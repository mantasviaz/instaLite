import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    school: "",
    birthday: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to backend API
    console.log(formData); // Example: Log form data to console
  };

  return (
    <div className="signup-page flex justify-center items-center min-h-screen w-full bg-gray-100">
      <div className="signup-form bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="input-field"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="input-field"
              required
            />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="input-field"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="input-field"
              required
            />
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              placeholder="School"
              className="input-field"
              required
            />
            <input
              type="text"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              placeholder="Birthday"
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-4 rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
