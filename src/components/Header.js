import React from "react";
import { NavLink, Link } from "react-router-dom";

const Header = () => {
    // Retrieve the currently logged-in user details from local storage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Function to handle logout
    const handleLogout = () => {
        // Clear the user details from local storage
        localStorage.removeItem("currentUser");
        // Redirect to the login page or any other desired page
        // Replace "/login" with the appropriate route for your application
        window.location.href = "/";
    };

    return (
        <nav className="navbar navbar-expand-lg  " style={{backgroundColor:"#E4EBED"}}>
            <Link
                to="/"
                className="navbar-brand"
                style={{ marginLeft: "20px" }}
            >
                <b> Cargoa</b>
            </Link>
            <ul className="navbar-nav " style={{ marginLeft: "auto" }}>
                {currentUser ? (
                    <>
                        <li className="nav-item ">
                            <span className="nav-link">
                                <b>Welcome, {currentUser.username}</b> (
                                {currentUser.role})
                            </span>
                        </li>
                        <li className="nav-item">
                            <button
                                className="nav-link btn btn-link"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <NavLink
                                to="/register"
                                className="nav-link"
                                activeClassName="active"
                            >
                                Register
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className="nav-link"
                                activeClassName="active"
                            >
                                Login
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Header;
