import React, { useState, useEffect } from 'react';
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

  //top10 hashtags
  const [topHashtags, setTopHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);

  const { dispatch } = useUserContext();

  const navigate = useNavigate(); // Access the history object

  const [selectedCircleIndex, setSelectedCircleIndex] = useState(0);
  const [circleElements, setCircleElements] = useState([]);

  useEffect(() => {
    // Fetch top 10 hashtags
    const fetchTopHashtags = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/hashtags/top10');
        if (response.ok) {
          const data = await response.json();
          setTopHashtags(data); // Update topHashtags state
        } else {
          console.error('Failed to fetch top hashtags');
        }
      } catch (error) {
        console.error('Error fetching top hashtags:', error);
      }
    };

    fetchTopHashtags(); // Call the fetchTopHashtags function
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfilePhotoChange = (e, index) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePhoto: file,
    });

    // Generate five circles with the uploaded image
    const circles = Array.from({ length: 5 }, (_, i) => {
      const isSelected = i === index;
      return (
        <div
          key={i}
          className={`circle ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedCircleIndex(i)}
        >
          <img
            src={URL.createObjectURL(file)}
            alt='Profile'
            className='w-full h-full rounded-full'
          />
        </div>
      );
    });
    setCircleElements(circles);
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
    setSelectedHashtags([...selectedHashtags, hashtag]);
  };

  //review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        // convert response to JSON and save the user into local storage
        const jsonResponse = await response.json();
        localStorage.setItem('user', JSON.stringify(jsonResponse));
        // update the user context
        dispatch({ type: 'LOGIN', payload: jsonResponse });
        const response = await axios.post('http://localhost:3000/api/users/status', { userId: jsonResponse.userId, status: 'online' });
        console.log('User registered successfully');

        navigate('/home'); // Use navigate for redirections
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
      <div className='signup-form bg-white p-8 rounded shadow-md w-full max-w-md mt-8 mb-8'>
        {' '}
        {/* Adjusted width, padding, and margins */}
        <h1 className='text-2xl font-semibold mb-2 text-center'>Create an Account</h1> {/* Adjusted font size and margin */}
        <form
          onSubmit={handleSubmit}
          method='POST'
        >
          <div className='flex flex-col space-y-2'>
            {/* File Upload Section */}
            <div className='flex flex-col items-center space-y-1 mb-2'>
              <input
                type='file'
                name='profilePhoto'
                onChange={handleProfilePhotoChange}
                accept='image/*'
                className='input-field'
              />
              {formData.profilePhoto && (
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt='Profile'
                  className='w-20 h-20 rounded-full'
                />
              )}
            </div>
            {/* Circles for profile photo selection */}
            <div className='flex items-center justify-center space-x-1 mb-2'>{circleElements}</div>
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
            {/* Name Inputs */}
            <div className='flex space-x-1'>
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder='First Name'
                className='input-field flex-1'
                required
              />
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder='Last Name'
                className='input-field flex-1'
                required
              />
            </div>
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
              <h2 className='text-base font-semibold mb-1'>Hashtags of Interests</h2>
              {formData.hashtags.map((tag, index) => (
                <div
                  key={index}
                  className='flex items-center mb-1'
                >
                  <input
                    type='text'
                    value={tag}
                    onChange={(e) => handleHashtagChange(e, index)}
                    placeholder='Hashtag'
                    className='input-field mr-1'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveHashtag(index)}
                    className='btn-secondary text-sm'
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type='button'
                onClick={handleAddHashtag}
                className='btn-primary text-sm'
              >
                Add Hashtag
              </button>
            </div>
            {/* Display top 10 hashtags */}
            <div>
              <h2 className='text-base font-semibold mb-1'>Top 10 Hashtags:</h2>
              <ul>
                {topHashtags.map((tag, index) => (
                  <li
                    key={index}
                    onClick={() => handleHashtagClick(tag)}
                    className='cursor-pointer text-blue-500 text-sm'
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
            className='btn-primary w-full rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-base mt-2'
          >
            Sign Up
          </button>
        </form>
        <div className='text-center mt-2'>
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
