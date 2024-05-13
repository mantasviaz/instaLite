const { Kafka } = require('kafkajs');
const cron = require('node-cron');

const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const PostHashtag = require('../models/postHashtag');

var config = require('./config.json');

const { CompressionTypes, CompressionCodecs } = require('kafkajs');
const SnappyCodec = require('kafkajs-snappy');

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: config.bootstrapServers,
});

const consumer = kafka.consumer({
  groupId: config.groupId,
  bootstrapServers: config.bootstrapServers,
});

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
  } catch (error) {
    throw error;
  }
  return newHashtags;
};

// Create a post
const createPost = async (userId, text, created_at) => {
  console.log({ userId, text, created_at });
  try {
    const hashtags = text.replace(/\s/g, '').split('#').slice(1, text.length);
    const postHashtags = await createHashtag(hashtags);

    const newPost = await Post.create({ userId: userId, text: text, created_at: created_at });

    for (const hashtag of postHashtags) {
      const newPostHashtag = PostHashtag.create({ postId: newPost.postId, hashtagId: hashtag.hashtagId });
      console.log(newPostHashtag);
    }

    return newPost;
  } catch (error) {
    return;
  }
};

const isValidJson = (string) => {
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
};

// Upload tweets from kafka to database
const getFederatedPosts = async () => {
  // Consuming
  await consumer.connect();
  console.log(`Following topic ${config['producer-topic']}`);
  // Subscribe to topic
  await consumer.subscribe({ topic: config['producer-topic'], fromBeginning: true, partitions: [0] }); // Will set fromBeginning to false in actual feed

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let federatedPost;
      if (isValidJson(message.value.toString())) {
        federatedPost = JSON.parse(message.value.toString());
        const user = await User.findOne({ where: { userId: 69 } });
        const newPost = await createPost(user.userId, federatedPost.post_text, new Date(Date.now()));

        console.log({
          federatedPost: federatedPost,
        });
      }
    },
  });
  await consumer.seek({ topic: config['producer-topic'], partition: 0, offset: '0' });
};

module.exports = getFederatedPosts;
