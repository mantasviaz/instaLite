const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/dbConfig.js');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
            return res.status(500).send({ error: 'Validation Error', message: 'Required fields are missing' });
        }
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
        if (!user) {
            return res.status(401).send("Authentication failed: User not found");
        }
        const passwordValid = await bcrypt.compare(req.body.password, user.password_hash);
        if (passwordValid) {
            res.status(200).send(user); // Ensure sensitive info is not sent
        } else {
            res.status(401).send("Authentication failed: Incorrect password");
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

//update
exports.updateUserProfile = async (req, res) => {
    let transaction;

    try {
        //console.log("Received userId for update:", req.params.userId);
        transaction = await sequelize.transaction();

        const userExists = await User.findByPk(req.params.userId, { transaction });
        //console.log("User exists:", !!userExists);
        if (!userExists) {
            await transaction.rollback();
            return res.status(404).send("User not found");
        }

        //console.log("Update data:", req.body);
        // Ensure the request body has the correct properties
        const updateData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            updated_at: new Date()  // Update the 'updated_at' field to current time
        };

        const [updated] = await User.update(updateData, {
            where: { userId: req.params.userId },
            transaction: transaction
        });
        
        if (updated) {
            const updatedUser = await User.findByPk(req.params.userId, { transaction });
            await transaction.commit();
            res.status(200).send(updatedUser);
        } else {
            await transaction.rollback();
            res.status(404).send("User not found");
        }
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error updating user:", error);
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