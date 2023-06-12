import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, NavLink } from "react-router-dom";
import Layout from "../components/Layout";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "https://cargoamernbackend.onrender.com/api/user/login",
                {
                    username,
                    password,
                }
            );
            if (res && res.data.success) {
                toast.success(res.data.message);
                const user = res.data.user;
                const token = res.data.token;
                const userDetails = {
                    username: user.username,
                    role: user.role,
                    address: user.address,
                    token: token,
                    id: user._id,
                };
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(userDetails)
                );
                const role = user.role;
                navigate(`/${role.toLowerCase()}`);
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
            <div className="login form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <h3 className="text-center">LOGIN</h3>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter username"
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

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>

                    <div className="mt-3 d-flex flex-column">
                        <h6>
                            New to Cargoa?
                            <NavLink to="/register">
                                {" "}
                                <b>Register now</b>
                            </NavLink>{" "}
                        </h6>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
