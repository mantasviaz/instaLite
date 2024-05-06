import React, { useRef, useState } from 'react';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Test Profile Img
import testProfileImg from '../assets/test/phuc-lai-test.jpg';

import uploadLogo from '../assets/logos/upload.svg';
import deleteLogo from '../assets/logos/x.svg';
import { useUserContext } from '../hooks/useUserContext';

import config from '../config.json';

function CreatePost() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);

  const { user } = useUserContext();

  const fileInput = useRef(null);

  const handleClick = (event) => {
    event.preventDefault();
    fileInput.current.click();
  };

  const handleImageUpload = (event) => {
    const fileUploaded = event.target.files[0];
    setUploadImage(fileUploaded);

    if (fileUploaded) {
      const reader = new FileReader();

      reader.onload = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(fileUploaded);
    }
  };

  const handlePostChange = (event) => {
    setContent(event.target.value);
  };

  const handleInput = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + 'px';
  };

  const handlePost = async (event) => {
    // Prevent page from refreshing
    event.preventDefault();
    // Check to see if there is content
    if (uploadImage == null && content === '') {
      return;
    }

    // Create body to send
    const body = {};
    if (content) {
      body.text = content;
    }

    // Check for images to upload
    if (uploadImage) {
      // Initialize s3 client
      const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: config.ACCESS_KEY_ID,
          secretAccessKey: config.SECRET_ACESS_KEY,
          sessionToken: config.SESSION_TOKEN,
        },
      });
      const params = {
        Bucket: config.S3_BUCKET,
        Key: uploadImage.name,
        Body: uploadImage,
      };
      console.log(params);
      // Upload to s3
      try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
      } catch (error) {
        console.log(error);
      }

      body.image_url = `https://${config.S3_BUCKET}.s3.amazonaws.com/${uploadImage.name}`;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/posts', {
        ...body,
        userId: user.userId,
      });

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className='my-5 flex w-[26rem] border-2 p-2'>
      <img
        src={testProfileImg}
        alt='User Profile Picture'
        className='mr-2 h-[36px] w-[36px] rounded-full'
      />
      <div className='flex flex-1 flex-col'>
        <div className='flex-1'>
          <textarea
            placeholder='What is happening?!'
            rows={1}
            maxLength={500}
            onChange={handlePostChange}
            onInput={handleInput}
            className='no-scrollbar max-h-[200px] w-full resize-none overflow-visible text-sm outline-none'
            value={content}
          ></textarea>
          {image && (
            <div className='relative'>
              <img
                src={image}
                alt='Uploaded Image'
                className='rounded-md'
              />
              <img
                src={deleteLogo}
                alt='Delete Button'
                className='absolute right-1 top-1 h-6 w-6 cursor-pointer rounded-full bg-stone-400 opacity-50 hover:opacity-60'
                onClick={() => {
                  setImage(null);
                  setUploadImage(null);
                  fileInput.current.value = null;
                }}
              />
            </div>
          )}
        </div>
        <div className='flex-between mt-1'>
          <img
            src={uploadLogo}
            alt='Upload Logo'
            onClick={handleClick}
            className='h-[18px] w-[18px] cursor-pointer'
          />
          <input
            type='file'
            onChange={handleImageUpload}
            ref={fileInput}
            style={{ display: 'none' }}
          />
          <button
            className='rounded-2xl bg-blue-400 px-4 py-1 text-xs font-semibold'
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}

export default CreatePost;
