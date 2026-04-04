const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Plan = require('../models/Plan');
const stripeService = require('../services/stripeService');
const { updatePlanSchema } = require('../schemas/businessSchema');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');

exports.getUsers = async (req, res) => {
  const { search, plan, status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { providerId: { $regex: search, $options: 'i' } } // Tạm ánh xạ Keycloak/Provider ID
    ];
  }
  if (plan && plan !== 'all') {
    query.plan = plan; 
  }
  if (status && status !== 'all') {
    query.isActive = status === 'active';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const users = await User.find(query).skip(skip).limit(parseInt(limit)).select('-password');
  const total = await User.countDocuments(query);

  res.json({ success: true, data: users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'ban' or 'unban'
  
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: 'User không tồn tại' });

  user.isActive = action !== 'ban';
  await user.save();

  res.json({ success: true, message: `Thao tác khóa/mở khóa thành công.` });
};

exports.impersonateUser = async (req, res) => {
  const { id } = req.params;
  const targetUser = await User.findById(id);
  
  if (!targetUser) return res.status(404).json({ success: false, message: 'User không tồn tại' });
  if (targetUser.role === 'admin') return res.status(403).json({ success: false, message: 'Không thể impersonate Admin khác' });

  const token = jwt.sign(
    { userId: targetUser._id, role: targetUser.role, impersonatorId: req.user.userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  console.log(`[AUDIT] Admin ${req.user.userId} has impersonated User ${targetUser._id} (IP: ${req.ip})`);

  res.json({ success: true, access_token: token, redirectUrl: '/dashboard' });
};

// --- TRANSACTIONS ---
exports.getTransactions = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
     const userSearch = await User.find({ email: { $regex: search, $options: 'i'} }).select('_id');
     const userIds = userSearch.map(u => u._id);
     query.$or = [
       { stripeId: { $regex: search, $options: 'i' } },
       { user: { $in: userIds } }
     ];
  }
  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const transactions = await Transaction.find(query).populate('user', 'email firstName lastName').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
  const total = await Transaction.countDocuments(query);

  res.json({ success: true, data: transactions, total, page: parseInt(page), pages: Math.ceil(total / limit) });
};

exports.refundTransaction = async (req, res) => {
  const { id } = req.params;

  const trx = await Transaction.findOne({ stripeId: id });
  if (!trx) return res.status(404).json({ success: false, message: 'Transaction không tồn tại' });
  if (trx.status === 'refunded') return res.status(400).json({ success: false, message: 'Giao dịch đã được hoàn tiền rồi' });

  // Dùng mongoose transaction nếu setup Replica Set, ở local demo tạm bỏ để tránh lỗi MongoError
  try {
     await stripeService.refundPayment(trx.stripeId);
     trx.status = 'refunded';
     await trx.save();
     res.json({ success: true, message: 'Hoàn tiền thành công' });
  } catch (err) {
     return res.status(400).json({ success: false, message: err.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  const { id } = req.params;
  const trx = await Transaction.findOne({ stripeId: id }).populate('user');
  
  if (!trx) return res.status(404).json({ success: false, message: 'Invoice không tồn tại' });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${trx.stripeId}.pdf`);

  doc.pipe(res);
  doc.fontSize(20).text('INVOICE / HOA DON', { align: 'center' }); // Tạm không dấu để tránh lỗi font default PDFKit
  doc.moveDown();
  doc.fontSize(12).text(`Ma giao dich (Stripe): ${trx.stripeId}`);
  doc.text(`Ngay: ${trx.createdAt.toLocaleString()}`);
  doc.text(`Khach hang: ${trx.user?.email || 'N/A'}`);
  doc.text(`Trang thai: ${trx.status}`);
  doc.text(`Noi dung: ${trx.content}`);
  doc.moveDown();
  doc.fontSize(16).text(`Tong cong: $${trx.amount.toFixed(2)}`, { align: 'right' });
  doc.end();
};

// --- PLANS ---
exports.getPlans = async (req, res) => {
  const plans = await Plan.find().sort({ price: 1 });
  res.json({ success: true, data: plans });
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  
  const parsed = updatePlanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, errors: parsed.error.errors });
  }

  const plan = await Plan.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!plan) return res.status(404).json({ success: false, message: 'Plan không tồn tại' });

  res.json({ success: true, data: plan });
};
