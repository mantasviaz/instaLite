const { Kafka } = require('kafkajs');

const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const PostHashtag = require('../models/postHashtag');

var config = require('./config.json');
const createRandomUser = require('./createRandomUser');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: config.bootstrapServers,
});

const consumer = kafka.consumer({
  groupId: config.groupId,
  bootstrapServers: config.bootstrapServers,
});

// Create user with user_id
const createUser = async (user_id) => {
  let user = await User.findOne({ where: { userId: user_id } });
  if (user) {
    return user;
  }
  user = createRandomUser();
  try {
    const newUser = await User.create({ ...user, userId: user_id });
    return newUser;
  } catch (error) {
    return;
  }
};

// Create a post
const createPost = async (userId, text, created_at) => {
  try {
    const newPost = await Post.create({ userId, text, created_at });
    return newPost;
  } catch (error) {
    return;
  }
};

// Create hashtags
const createHashtag = async (hashtags) => {
  const newHashtags = [];
  try {
    for (const hashtag of hashtags) {
      const existingHashtag = await Hashtag.findOne({ where: { text: hashtag } });
      if (existingHashtag) {
        newHashtags.push(existingHashtag);
      } else {
        const newHashtag = await Hashtag.create({ text: hashtag });
        newHashtags.push(newHashtag);
      }
    }
  } catch (error) {}
  return newHashtags;
};

// Link the hashtags to the post
const createPostHashtag = async (post, hashtags) => {
  try {
    for (const hashtag of hashtags) {
      const newPostHashtag = PostHashtag.create({ postId: post.postId, hashtagId: hashtag.hashtagId });
      console.log(newPostHashtag);
    }
  } catch (error) {
    return;
  }
};

// Upload tweets from kafka to database
const getTwitterPosts = async () => {
  // Consuming
  await consumer.connect();
  console.log(`Following topic ${config['consumer-topic']}`);
  // Subscribe to topic
  await consumer.subscribe({ topic: config['consumer-topic'], fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const twitterPost = JSON.parse(message.value.toString());
      const [user, hashtags] = await Promise.all([createUser(twitterPost.author_id), createHashtag(twitterPost.hashtags)]);
      const newPost = await createPost(user.userId, twitterPost.text, new Date(twitterPost.created_at));
      await createPostHashtag(newPost, hashtags);

      console.log({
        twitterPost: twitterPost,
        user: user,
        hashtags: hashtags,
        newPost: newPost,
      });
      // Commits an offset so that it resume to the previous offset before shutting down
      await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
    },
  });
  await consumer.disconnect();
};

getTwitterPosts().catch(console.error);

// module.exports = getTwitterPosts;
