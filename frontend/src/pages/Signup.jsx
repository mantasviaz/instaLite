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
    profilePhoto: null, // To store the selected profile photo
    hashtags: [],
  });

  //placeholder hashtags
  const [topHashtags, setTopHashtags] = useState([
    "#technology",
    "#travel",
    "#food",
    "#fitness",
    "#music",
    "#art",
    "#photography",
    "#fashion",
    "#nature",
    "#books",
  ]);

  //new
  //const history = useHistory(); // Access the history object

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
      hashtags: [...formData.hashtags, ""],
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
      const formDataWithPhoto = new FormData();
      formDataWithPhoto.append("profilePhoto", formData.profilePhoto);
      formDataWithPhoto.append("username", formData.username);
      formDataWithPhoto.append("password", formData.password);
      // Add other form data fields as needed

      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataWithPhoto,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile photo uploaded successfully");
        console.log("Image URL:", data.imageUrl); // Assuming backend returns image URL
        // Store the image URL in form data state
        setFormData({
          ...formData,
          profilePhoto: data.imageUrl,
        });
      } else {
        console.error("Failed to upload profile photo");
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
    }
  };
    /*e.preventDefault();
    try {
      // Upload profile photo to server (You need to implement this part in the backend)
      const formDataWithPhoto = new FormData();
      formDataWithPhoto.append("profilePhoto", formData.profilePhoto);

      // Send form data with photo to the server
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataWithPhoto,
      });

      if (response.ok) {
        console.log("Profile photo uploaded successfully");
      } else {
        console.error("Failed to upload profile photo");
      }

      // Remaining form data to be sent to server
      const remainingFormData = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        school: formData.school,
        birthday: formData.birthday,
        hashtags: formData.hashtags,
      };

      // Send remaining form data to server
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(remainingFormData),
      });

      if (registerResponse.ok) {
        console.log("User registered successfully");
        // Redirect to home page after successful signup
        history.push("/"); // Redirect to home page
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
    */

  return (
    <div className="signup-page flex justify-center items-center min-h-screen w-full bg-gray-100">
      <div className="signup-form bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            {/* File Upload Section */}
            <div className="flex flex-col items-center space-y-2 mb-4">
              <input
                type="file"
                name="profilePhoto"
                onChange={handleProfilePhotoChange}
                accept="image/*"
                className="input-field"
                required
              />
              {formData.profilePhoto && (
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt="Profile"
                  className="w-32 h-32 rounded-full"
                />
              )}
            </div>
            {/* Username Input */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="input-field"
              required
            />
            {/* Password Input */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="input-field"
              required
            />
            {/* Full Name Input */}
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="input-field"
              required
            />
            {/* Email Input */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="input-field"
              required
            />
            {/* School Input */}
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              placeholder="School"
              className="input-field"
              required
            />
            {/* Birthday Input */}
            <input
              type="text"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              placeholder="Birthday"
              className="input-field"
              required
            />
            {/* Hashtags Input */}
            <div className="hashtag-section">
              <h2 className="text-lg font-semibold mb-2">Hashtags of Interests</h2>
              {formData.hashtags.map((tag, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleHashtagChange(e, index)}
                    placeholder="Hashtag"
                    className="input-field mr-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(index)}
                    className="btn-secondary"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddHashtag} className="btn-primary">
                Add Hashtag
              </button>
            </div>
            {/* Display placeholder top hashtags */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Top 10 Hashtags:</h2>
              <ul>
                {topHashtags.map((tag, index) => (
                  <li
                    key={index}
                    onClick={() => handleHashtagClick(tag)}
                    className="cursor-pointer text-blue-500"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full mt-4 rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600"
          >
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