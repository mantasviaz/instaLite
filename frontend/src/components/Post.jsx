import React, { useEffect, useState } from 'react';
import ImagePost from './ImagePost';
import TextPost from './TextPost';

function Post({ postId }) {
  const [isImagePost, setIsImagePost] = useState(false);

  useEffect(async () => {
    const response = axios.get();
  }, []);
  return isImagePost ? <ImagePost /> : <TextPost />;
}

export default Post;
