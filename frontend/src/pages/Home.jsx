import React, { useEffect } from "react";
import image_post_test from "../test/image-post";
import ImagePost from "../components/ImagePost";
import CreatePost from "../components/CreatePost";

function Home() {
  useEffect(() => {
    console.log(image_post_test);
  }, []);
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
    </div>
  );
}

export default Home;