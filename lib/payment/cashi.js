const Payment = require("./payment");

const payment = new Payment();

(async () => {

  const pay = await payment.create(5000);

  console.log(pay);

})();