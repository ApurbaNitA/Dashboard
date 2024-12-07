import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut(); // Sign out from Firebase
    dispatch(logout());
    navigate("/auth");
  };

  if (!user) return null; // Don't show header if the user is not logged in

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <p>{user.email}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
