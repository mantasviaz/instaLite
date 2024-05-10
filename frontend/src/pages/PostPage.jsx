import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import TextPostPage from './TextPostPage';
import ImagePostPage from './ImagePostPage';

function PostPage() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/posts/${postId}`);
        console.log(response);
        setPost(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, []);

  return <>{post && (post.image_url ? <ImagePostPage post={post} /> : <TextPostPage post={post} />)}</>;
}

export default PostPage;
