import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Profile() {
  const [formData, setFormData] = useState({
    profilePhoto: null,
    first_name: "",
    last_name: "",
    email: '',
    password: '',
    hashtags: [],
  });

  const [modifiedFields, setModifiedFields] = useState([]);
  const { userId } = useParams(); // Get userId from route parameters
  const navigate = useNavigate();

  //Top10 hashtags
  const [topHashtags, setTopHashtags] = useState([]);

  useEffect(() => {
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
    // Only update the form data if the input field is not empty
    //if (value.trim() !== "") {
    setFormData({
      ...formData,
      [name]: value,
    });

    if (!modifiedFields.includes(name)) {
      setModifiedFields([...modifiedFields, name]);
    }
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

  const handleHashtagClick = (tag) => {
    setFormData({
      ...formData,
      hashtags: [...formData.hashtags, tag],
    });
  };

  const handleProfilePhotoChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData({
      ...formData,
      profilePhoto: imageFile,
    });
    if (!modifiedFields.includes('profilePhoto')) {
      setModifiedFields([...modifiedFields, 'profilePhoto']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modifiedFields.length === 0) {
      console.log('No fields are modified. Form submission cancelled.');
      return; // Exit the function without submitting the form
    }
    // Construct JSON object with updated fields
    const modifiedData = {};
    modifiedFields.forEach((field) => {
      modifiedData[field] = formData[field];
    });

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify(modifiedData), // Convert JSON object to string
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        navigate(`/${userId}`); // Redirect to the profile page or another appropriate page
      } else {
        console.error('Profile update failed:', await response.text());
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <div className='profile-page flex justify-center items-center min-h-screen w-full bg-gray-100 overflow-y-auto'>
      <div className='profile-form bg-white p-8 rounded shadow-md max-w-md w-full mt-10 mb-10'> {/* Adjusted width, padding, and margins */}
        <h1 className='text-2xl font-semibold mb-3 text-center'>Profile</h1> {/* Adjusted font size and margin */}
        <form onSubmit={handleSubmit} method='POST'>
          <div className='mb-1'>
            <label htmlFor='profilePhoto' className='block text-base font-semibold mb-1'>
              Change Profile Photo
            </label> {/* Adjusted font size */}
            <input
              type='file'
              id='profilePhoto'
              name='profilePhoto'
              onChange={handleProfilePhotoChange}
              accept='image/*'
              className='input-field'
            />
            {formData.profilePhoto && (
              <img
                src={URL.createObjectURL(formData.profilePhoto)}
                alt='Profile'
                className='w-24 h-24 rounded-full mt-2'
              />
            )}
          </div>
          <div className='mb-1'>
            <label htmlFor="firstName" className="block text-base font-semibold mb-1">
              Change First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              className="input-field"
            />
          </div>
          <div className='mb-1'>
            <label htmlFor="lastName" className="block text-base font-semibold mb-1">
              Change Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="input-field"
            />
          </div>
          <div className='mb-1'>
            <label htmlFor='email' className='block text-base font-semibold mb-1'>
              Change Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Email'
              className='input-field'
            />
          </div>
          <div className='mb-1'>
            <label htmlFor='password' className='block text-base font-semibold mb-1'>
              Change Password
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Password'
              className='input-field'
            />
          </div>
          <div className='hashtag-section mb-2'>
            <h2 className='text-base font-semibold mb-1'>Change Hashtags of Interests</h2>
            {formData.hashtags.map((tag, index) => (
              <div key={index} className='flex items-center mb-1'>
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
          <div className='mb-1'>
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
          <button
            type='submit'
            className='btn-primary w-full rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-base mt-2'
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
