import React, { useEffect } from "react";
import image_post_test from "../test/image-post";
import ImagePost from "../components/ImagePost";

function Home() {
  useEffect(() => {
    console.log(image_post_test);
  }, []);
  return (
    <div className="flex-start max-h-full flex-1 flex-col overflow-y-auto">
      <h1 className=" bg-red-300 text-3xl font-bold underline">Home Page</h1>
      {image_post_test.map((post, idx) => (
        <ImagePost
          username={post.username}
          text={post.text}
          img_link={post.img}
          created_date={post.created_at}
        />
      ))}
    </div>
  );
}

export default Home;
