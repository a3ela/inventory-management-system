const User = require("../models/User");

const createUser = async (req, res, next) => {
  try {
    const { fullname, email } = req.body;
    const user = new User({ fullname, email });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("fullname email _id createdAt");
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getUsers };
