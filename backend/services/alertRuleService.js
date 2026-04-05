const AlertRule = require('../models/AlertRule');

const getAlertSetting = async (userId) => {
  let rule = await AlertRule.findOne({ userId });

  // If no rule exists, create default rule
  if (!rule) {
    rule = await AlertRule.create({ userId });
  }
  
  return rule;
};

const updateAlertSetting = async (userId, payload) => {
  return await AlertRule.findOneAndUpdate(
    { userId },
    { $set: payload },
    { new: true, upsert: true, runValidators: true }
  );
};

module.exports = {
  getAlertSetting,
  updateAlertSetting
};
