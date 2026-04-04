const adminService = require('../services/adminService');

exports.getStats = async (req, res) => {
  const stats = await adminService.getStats();
  res.status(200).json({ success: true, data: stats });
};

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || '';

  const result = await adminService.getUsers(page, limit, search);
  res.status(200).json({ success: true, data: result });
};

exports.updateUser = async (req, res) => {
  const updatedUser = await adminService.updateUser(req.params.id, req.body);
  res.status(200).json({ success: true, data: updatedUser });
};

exports.getSettings = async (req, res) => {
  const settings = await adminService.getSettings();
  res.status(200).json({ success: true, data: settings });
};

exports.updateSettings = async (req, res) => {
  const updatedSettings = await adminService.updateSettings(req.body);
  res.status(200).json({ success: true, data: updatedSettings });
};

exports.getServerHealth = async (req, res) => {
  const health = await adminService.getServerHealth();
  res.status(200).json({ success: true, data: health });
};

exports.getLogs = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  const logs = await adminService.getLogs(limit);
  res.status(200).json({ success: true, data: logs });
};

exports.streamLogs = async (req, res) => {
  const { logFilePath } = require('../utils/logger');
  const fs = require('fs');

  if (!fs.existsSync(logFilePath)) {
    return res.status(404).json({ success: false, message: 'Log file not found' });
  }

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="system_audit.log"');
  
  const readStream = fs.createReadStream(logFilePath);
  readStream.pipe(res);
};

exports.clearLogs = async (req, res) => {
  await adminService.clearLogs();
  res.status(200).json({ success: true, message: 'Logs cleared' });
};
