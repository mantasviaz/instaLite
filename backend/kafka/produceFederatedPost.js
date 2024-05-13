const { Kafka } = require('kafkajs');
var config = require('./config.json');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: config.bootstrapServers,
});

const producer = kafka.producer({
  groupId: config.groupId,
  bootstrapServers: config.bootstrapServers,
});

const produceFederatedPost = async (post, username) => {
  const federatedPost = {
    username: username,
    source_site: 'g43',
    post_uuid_within_site: post.postId,
    post_text: post.text,
    content_type: 'text/html',
  };

  const message = {
    key: null, // You can specify a key if needed
    value: JSON.stringify(federatedPost), // Convert the federatedPost object to a string
  };

  await producer.connect();
  await producer.send({
    topic: config['producer-topic'],
    messages: [message],
  });

  await producer.disconnect();
};

module.exports = produceFederatedPost;
