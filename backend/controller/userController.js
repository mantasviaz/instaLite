const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const UserHashtag = require('../models/userHashtag');

const bcrypt = require('bcryptjs');
const sequelize = require('../config/dbConfig.js');
const upload = require('../config/s3Config.js');

// Register a new user
exports.registerUser = async (req, res) => {
  console.log('trying to register user');
  try {
    console.log(req.body);
    console.log(req.file);
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
      return res.status(500).send({ error: 'Validation Error', message: 'Required fields are missing' });
    }
    console.log('Password being hashed:', req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log('Generated hash:', hashedPassword);

    // Handle image upload
    let profilePhotoUrl = null;
    if (req.file) {
      profilePhotoUrl = req.file.location;
    }

    // Extract hashtags from the request body
    console.log('Hashtags from request:', req.body.hashtags);
    let hashtags = req.body.hashtags.split(',');
    console.log('Extracted hashtags:', hashtags);

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password_hash: hashedPassword,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      school: req.body.school,
      birthday: req.body.birthday,
      profile_photo_url: profilePhotoUrl,
      hashtags: hashtags,
    });

    await Promise.all(
      hashtags.map(async (tag) => {
        try {
          // Find or create the hashtag in the database
          let [hashtag, created] = await Hashtag.findOrCreate({ where: { text: tag } });

          // Create an entry in user_hashtags table
          await UserHashtag.create({
            user_id: user.userId, // Using the userId obtained above
            hashtag_id: hashtag.hashtagId,
          });
        } catch (error) {
          console.error('Error processing hashtag:', error);
        }
      })
    );

    const result = user.toJSON();
    delete result.password_hash;
    res.status(201).send(result);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ error: 'Internal Server Error', message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  console.log('Attempting to log in user with email:', req.body.email);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('Login failed: No user found with email', email);
      return res.status(401).send('Authentication failed: User not found');
    }

    console.log('Hash from database:', user.password_hash);
    console.log('Password for comparison:', password);
    const passwordValid = bcrypt.compare(password, user.password_hash);
    console.log('Comparison result:', passwordValid);

    if (passwordValid) {
      const result = user.toJSON();
      delete result.password_hash; // Remove sensitive data before sending response
      console.log('Login successful for user:', result);
      res.status(200).send(result);
    } else {
      console.log('Login failed: Incorrect password for user', email);
      res.status(401).send('Authentication failed: Incorrect password');
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send({ error: 'Internal Server Error', message: error.message });
  }
};

//update
exports.updateUserProfile = async (req, res) => {
  let transaction;
  try {
    console.log('Received userId for update:', req.params.userId);
    transaction = await sequelize.transaction();
    const userExists = await User.findByPk(req.params.userId, {
      include: Hashtag, // Include associated hashtags
      transaction,
    });
    console.log('User exists:', !!userExists);
    if (!userExists) {
      await transaction.rollback();
      return res.status(404).send('User not found');
    }
    const hashedPassword = req.body?.password && (await bcrypt.hash(req.body.password, 10));

    console.log('Update data:', req.body);
    // Ensure the request body has the correct properties
    const updateData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email, // Include email field
      password_hash: hashedPassword, // Include password field
      updated_at: new Date(), // Update the 'updated_at' field to current time
    };

    const [updated] = await User.update(updateData, {
      where: { userId: req.params.userId },
      transaction: transaction,
    });

    if (updated) {
      // Fetch updated user data again
      const updatedUser = await User.findByPk(req.params.userId, { transaction });
      await transaction.commit();
      res.status(200).send(updatedUser);
    } else {
      await transaction.rollback();
      res.status(404).send('User not found');
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error updating user:', error);
    res.status(500).send({ error: 'Internal Server Error', message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { userId: req.params.userId },
    });
    if (deleted) {
      res.status(200).send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error', message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    console.log('HERE');
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    user.status = status;
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: 'Failed to change user status', message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get user', message: error.message });
  }
};
