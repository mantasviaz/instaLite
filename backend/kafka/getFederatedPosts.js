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

// Create a post
const createPost = async (userId, text, created_at) => {
  console.log({ userId, text, created_at });
  try {
    const newPost = await Post.create({ userId: userId, text: text, created_at: created_at });
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
        // const [user, hashtags] = await Promise.all([User.findOne({ where: { userId: 4 } }), createHashtag(federatedPost.hashtags)]);
        // const newPost = await createPost(user.userId, federatedPost.text, new Date(federatedPost.created_at));
        // await createPostHashtag(newPost, hashtags);

        console.log({
          federatedPost: federatedPost,
        });
      }
    },
  });
  await consumer.seek({ topic: config['producer-topic'], partition: 0, offset: '0' });
};

getFederatedPosts();

// cron.schedule('* * * * *', getFederatedPosts);

// module.exports = getFederatedPosts;
