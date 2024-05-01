const comments = [
  {
    username: "user1",
    comment: generateRandomComment()
  },
  {
    username: "user2",
    comment: generateRandomComment()
  },
  {
    username: "user3",
    comment: generateRandomComment()
  },
  {
    username: "user4",
    comment: generateRandomComment()
  },
  {
    username: "user5",
    comment: generateRandomComment()
  },
  {
    username: "user6",
    comment: generateRandomComment()
  },
  {
    username: "user7",
    comment: generateRandomComment()
  },
  {
    username: "user8",
    comment: generateRandomComment()
  },
  {
    username: "user9",
    comment: generateRandomComment()
  },
  {
    username: "user10",
    comment: generateRandomComment()
  },
  {
    username: "user11",
    comment: generateRandomComment()
  },
  {
    username: "user12",
    comment: generateRandomComment()
  },
  {
    username: "user13",
    comment: generateRandomComment()
  },
  {
    username: "user14",
    comment: generateRandomComment()
  },
  {
    username: "user15",
    comment: generateRandomComment()
  },
  {
    username: "user16",
    comment: generateRandomComment()
  },
  {
    username: "user17",
    comment: generateRandomComment()
  },
  {
    username: "user18",
    comment: generateRandomComment()
  },
  {
    username: "user19",
    comment: generateRandomComment()
  },
  {
    username: "user20",
    comment: generateRandomComment()
  }
];

function generateRandomComment() {
  const words = [
    "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipisicing", 
    "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", 
    "et", "dolore", "magna", "aliqua", "Ut", "enim", "ad", "minim", "veniam", 
    "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", 
    "aliquip", "ex", "ea", "commodo", "consequat", "Duis", "aute", "irure", 
    "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", 
    "dolore", "eu", "fugiat", "nulla", "pariatur", "Excepteur", "sint", "occaecat", 
    "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", 
    "mollit", "anim", "id", "est", "laborum"
  ];

  let comment = "";
  while (comment.length < 150) {
    comment += words[Math.floor(Math.random() * words.length)] + " ";
  }
  return comment.trim();
}

export default comments;