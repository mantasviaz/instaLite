import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Profile from "./Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ userId: "123" }),
  useNavigate: () => jest.fn(),
}));

describe("Profile component", () => {
  it("submits profile update form", async () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <Routes>
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </Router>
    );

    // Fill in form fields
    fireEvent.change(getByLabelText("Change Email"), { target: { value: "test@example.com" } });
    fireEvent.change(getByLabelText("Change Password"), { target: { value: "password123" } });

    // Submit form
    fireEvent.click(getByText("Save Changes"));

    // Wait for profile update to complete
    await waitFor(() => expect(console.log).toHaveBeenCalledWith("Profile updated successfully"));
  });
});
