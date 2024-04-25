const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
          username: req.body.username,
          email: req.body.email,
          password_hash: hashedPassword,
          first_name: req.body.firstName,
          last_name: req.body.lastName
      });
      const result = user.toJSON();
      delete result.password_hash;
      res.status(201).send(result);
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).send({ error: 'Internal Server Error', message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user && await bcrypt.compare(req.body.password, user.password_hash)) {
            res.status(200).send(user);
        } else {
            res.status(401).send("Authentication failed");
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { userId: req.params.userId }
        });
        if (updated) {
            res.status(200).send("User updated successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { userId: req.params.userId }
        });
        if (deleted) {
            res.status(200).send("User deleted successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
