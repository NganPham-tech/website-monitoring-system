const Stripe = require('stripe');
// Lưu ý: Cần thêm STRIPE_SECRET_KEY vào .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_12345');

class StripeService {
  /**
   * Thực hiện hoàn tiền qua Stripe API
   * @param {string} paymentIntentId Mã PaymentIntent (pi_xxxx)
   * @returns {Object} Đối tượng Refund từ Stripe
   */
  async refundPayment(paymentIntentId) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      return refund;
    } catch (error) {
      // Ném lỗi để controller bắt và trả HTTP 400
      throw new Error(`Lỗi hoàn tiền Stripe: ${error.message}`);
    }
  }
}

module.exports = new StripeService();
