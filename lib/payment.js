const CashiAPI = require("./payment/cashi");

class Payment {
  constructor() {
    this.cashi = new CashiAPI();
  }

  generateInvoice() {
  return `Mng-TRX${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

  async create(amount) {
    try {
      if (amount < 2000 || amount > 10000000) {
        throw new Error("Amount tidak valid");
      }

      const invoice = this.generateInvoice();

      const res = await this.cashi.createOrder(
        Number(amount),
        invoice
      );

      return {
        success: true,
        invoice: invoice,
        amount: res.amount,
        checkout: res.checkout_url,
        qr: res.qrUrl,
        expired: res.expires_at
      };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data || err.message
      };
    }
  }

  async status(orderId) {
    try {
      const res = await this.cashi.checkStatus(orderId);
      

      return {
        success: true,
        invoice: res.order_id,
        amount: res.amount,
        status: res.status,
      }
    

    } catch (err) {
      return {
        success: false,
        message: err.response?.data || err.message
      };
    }
  }
}

module.exports = Payment;