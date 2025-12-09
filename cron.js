const cron = require("node-cron");
const { createDailyDiscount } = require("./controllers/discountController");

cron.schedule(" 0 0 * * *", () => {
  console.log("Running daily discount job at midnight");
  createDailyDiscount();
});
