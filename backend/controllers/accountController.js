let User = require('../models/User.model');

//Get User by uid
const getUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found! Please sign up!' });
    }

    return res.json(user);
  } catch (error) {
    // Handle any errors that might occur during the database query
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateName = async (req, res) => {
  const { uid } = req.params;
  const { name } = req.body;
  try {
    const user = await User.findOneAndUpdate({ uid }, { name }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found! Please sign up!' });
    }

    return res.json(user);
  } catch (error) {
    // Handle any errors that might occur during the database update
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOneAndDelete({ uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found! Please sign up!' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  return res.status(200);
};
module.exports = {
  getUser,
  updateName,
  deleteUser,
};
