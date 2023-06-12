import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles/auth.css";
import Layout from "../components/Layout";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "https://cargoamernbackend.onrender.com/api/user/register",
                {
                    username,
                    password,
                    address,
                    role,
                }
            );
            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <Layout>
            <div className="register form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <h3 className="text-center">REGISTER</h3>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="form-control"
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Transporter">Transporter</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter Address"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>

                    <div className="mt-3 d-flex flex-column">
                        <h6>
                            Already Registered?{" "}
                            <NavLink to="/">
                                {" "}
                                <b>Login</b>
                            </NavLink>{" "}
                        </h6>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
