import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Profile() {
  const [formData, setFormData] = useState({
    actorImage: null,
    email: "",
    password: "",
    hashtags: [],
  });

  const { userId } = useParams(); // Get userId from route parameters
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

  const handleHashtagClick = (tag) => {
    setFormData({
      ...formData,
      hashtags: [...formData.hashtags, tag],
    });
  };

  const handleActorImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData({
      ...formData,
      actorImage: imageFile,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithPhoto = new FormData(); // Use FormData for file uploads
    formDataWithPhoto.append("email", formData.email);
    formDataWithPhoto.append("password", formData.password);

    // If profile image is provided, add it to FormData
    if (formData.actorImage) {
        formDataWithPhoto.append("actorImage", formData.actorImage);
    }

    formDataWithPhoto.append("hashtags", JSON.stringify(formData.hashtags)); // Convert hashtags to JSON

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: formDataWithPhoto, // Sending form data
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        navigate("/profile"); // Redirect to the profile page or another appropriate page
      } else {
        console.error("Profile update failed:", await response.text());
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };


  return (
    <div className="profile-page flex justify-center items-center min-h-screen w-full bg-gray-100">
      <div className="profile-form bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Profile</h1>
        <form onSubmit={handleSubmit} method="POST">
          <div className="mb-4">
            <label htmlFor="actorImage" className="block text-lg font-semibold mb-2">
              Change Profile Photo
            </label>
            <input
              type="file"
              id="actorImage"
              name="actorImage"
              onChange={handleActorImageChange}
              accept="image/*"
              className="input-field"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold mb-2">
              Change Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="input-field"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-semibold mb-2">
              Change Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="input-field"
              required
            />
          </div>
          <div className="hashtag-section">
            <h2 className="text-lg font-semibold mb-2">Change Hashtags of Interests</h2>
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
          <button
            type="submit"
            className="btn-primary w-full mt-4 rounded bg-blue-500 text-white py-2 px-4 hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;