const cron = require("node-cron");
const { createDailyDiscount } = require("./controllers/discountController");
const Transaction = require("./models/Transaction");

// Schedule daily discount job at midnight
const createCronDiscount = () => {
  cron.schedule(" 0 0 * * *", async () => {
    console.log("Running daily discount job at midnight");
    await createDailyDiscount();
  });
};

// Schedule job to cancel expired transactions every 5 minutes
const cancelExpiredTransaction = () => {
  // Run every 5 Minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const result = await Transaction.updateMany(
        {
          status: "Waiting for Payment",
          paymentStatus: "Waiting for Payment",
          paymentExpiredAt: { $lte: new Date() },
        },
        {
          $set: {
            status: "Cancelled",
            paymentStatus: "Expired",
          },
        },
      );

      if (result.modified > 0) {
        console.log(`Cancelled ${result.modified} expired transactions`);
      }
    } catch (error) {
      console.error("Error cancelling expired transactions", error);
    }
  });
};

const initCrons = () => {
  createCronDiscount();
  cancelExpiredTransaction();
  console.log("Cron Running");
};

module.exports = initCrons;