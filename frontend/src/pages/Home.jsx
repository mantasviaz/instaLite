import React, { useEffect } from "react";

// Test posts
import image_post_test from "../test/image-post";
import text_posts from "../test/text-post";

import ImagePost from "../components/ImagePost";
import CreatePost from "../components/CreatePost";
import TextPost from "../components/TextPost";

function Home() {
  return (
    <div className="flex-start max-h-full flex-1 flex-col overflow-y-auto">
      <CreatePost />
      {image_post_test.map((post, idx) => (
        <ImagePost
          username={post.username}
          text={post.text}
          img_link={post.img}
          created_date={post.created_at}
          key={idx}
        />
      ))}
      {text_posts.map((post, idx) => (
        <TextPost
          username={post.username}
          content={post.text}
          num_of_likes={post.num_of_likes}
          key={idx}
        />
      ))}
    </div>
  );
}

export default Home;
