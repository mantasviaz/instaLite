import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { dispatch } = useUserContext();

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Submit form data to backend API for login using fetch
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        console.log('Login successful');

        // convert response to JSON and save the user into local storage
        const jsonResponse = await response.json();
        localStorage.setItem('user', JSON.stringify(jsonResponse));
        // update the user context
        dispatch({ type: 'LOGIN', payload: jsonResponse });

        navigate('/home');
      } else {
        console.error('Login failed:', response.statusText);
        // Optionally, handle login failure
      }
    } catch (error) {
      console.error('Error during login:', error.message || 'Unknown error');
      // Handle error and optionally display a friendly message to the user
    }
  };

  return (
    <div className='login-page flex justify-center items-center min-h-screen w-full bg-gray-100'>
      <div className='login-form bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h1 className='text-3xl font-semibold mb-4 text-center'>Log In</h1>
        <form
          onSubmit={handleSubmit}
          method='POST'
        >
          <div className='flex flex-col space-y-4'>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleInputChange}
              placeholder='Username'
              className='input-field'
              required
            />
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Password'
              className='input-field'
              required
            />
          </div>
          <button
            type='submit'
            className='btn-primary w-full mt-4 rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600'
          >
            Log In
          </button>
        </form>
        <div className='text-center mt-4'>
          Don't have an account yet?{' '}
          <Link
            to='/signup'
            className='text-blue-500'
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
