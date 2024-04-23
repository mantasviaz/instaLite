import React from "react";

function Home() {
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
