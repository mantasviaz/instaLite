import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    birthday: '',
    profilePhoto: null, // To store the selected profile photo
    hashtags: [],
  });

  //placeholder hashtags
  const [topHashtags, setTopHashtags] = useState(['#technology', '#travel', '#food', '#fitness', '#music', '#art', '#photography', '#fashion', '#nature', '#books']);

  const { dispatch } = useUserContext();

  const navigate = useNavigate(); // Access the history object

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePhoto: file,
    });
  };

  const handleHashtagChange = (e, index) => {
    const newHashtags = [...formData.hashtags];
    newHashtags[index] = e.target.value;
    setFormData({
      ...formData,
      hashtags: newHashtags,
    });
  };

  const handleAddHashtag = () => {
    setFormData({
      ...formData,
      hashtags: [...formData.hashtags, ''],
    });
  };

  const handleRemoveHashtag = (index) => {
    const newHashtags = [...formData.hashtags];
    newHashtags.splice(index, 1);
    setFormData({
      ...formData,
      hashtags: newHashtags,
    });
  };

  const handleHashtagClick = (hashtag) => {
    setFormData({
      ...formData,
      hashtags: [...formData.hashtags, hashtag],
    });
  };

  //review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const requestBody = {
            profilePhoto: formData.profilePhoto,
            username: formData.username,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            school: formData.school,
            birthday: formData.birthday,
            hashtags: formData.hashtags,
          };

      const response = await fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // convert response to JSON and save the user into local storage
        const jsonResponse = await response.json();
        localStorage.setItem('user', JSON.stringify(jsonResponse));
        // update the user context
        dispatch({ type: 'LOGIN', payload: jsonResponse });
        console.log('User registered successfully');

        navigate('/home'); // Use navigate for redirection
      } else {
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }

  /*try {
    console.log('User registered successfully');
    navigate('/home');
    
  } catch (error) {
    console.error('Error registering user:', error);
  }*/
  };

  return (
    <div className='signup-page flex justify-center items-center min-h-screen w-full bg-gray-100'>
      <div className='signup-form bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h1 className='text-3xl font-semibold mb-4 text-center'>Create an Account</h1>
        <form
          onSubmit={handleSubmit}
          method='POST'
        >
          <div className='flex flex-col space-y-4'>
            {/* File Upload Section */}
            <div className='flex flex-col items-center space-y-2 mb-4'>
                hi
              <input
                type='file'
                name='profilePhoto'
                onChange={handleProfilePhotoChange}
                accept='image/*'
                className='input-field'
                required
              />
              {formData.profilePhoto && (
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt='Profile'
                  className='w-32 h-32 rounded-full'
                />
              )}
            </div>
            {/* Username Input */}
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleInputChange}
              placeholder='Username'
              className='input-field'
              required
            />
            {/* Password Input */}
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Password'
              className='input-field'
              required
            />
            {/* Full Name Input */}
            <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder='First Name'
                className='input-field'
                required
            />
            <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder='Last Name'
                className='input-field'
                required
            />
            {/* Email Input */}
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Email'
              className='input-field'
              required
            />
            {/* School Input */}
            <input
              type='text'
              name='school'
              value={formData.school}
              onChange={handleInputChange}
              placeholder='School'
              className='input-field'
              required
            />
            {/* Birthday Input */}
            <input
              type='text'
              name='birthday'
              value={formData.birthday}
              onChange={handleInputChange}
              placeholder='Birthday'
              className='input-field'
              required
            />
            {/* Hashtags Input */}
            <div className='hashtag-section'>
              <h2 className='text-lg font-semibold mb-2'>Hashtags of Interests</h2>
              {formData.hashtags.map((tag, index) => (
                <div
                  key={index}
                  className='flex items-center mb-2'
                >
                  <input
                    type='text'
                    value={tag}
                    onChange={(e) => handleHashtagChange(e, index)}
                    placeholder='Hashtag'
                    className='input-field mr-2'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveHashtag(index)}
                    className='btn-secondary'
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type='button'
                onClick={handleAddHashtag}
                className='btn-primary'
              >
                Add Hashtag
              </button>
            </div>
            {/* Display placeholder top hashtags */}
            <div>
              <h2 className='text-lg font-semibold mb-2'>Top 10 Hashtags:</h2>
              <ul>
                {topHashtags.map((tag, index) => (
                  <li
                    key={index}
                    onClick={() => handleHashtagClick(tag)}
                    className='cursor-pointer text-blue-500'
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type='submit'
            className='btn-primary w-full mt-4 rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600'
          >
            Sign Up
          </button>
        </form>
        <div className='text-center mt-4'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-blue-500'
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
