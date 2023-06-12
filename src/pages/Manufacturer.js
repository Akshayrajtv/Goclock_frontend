import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Manufacturer = () => {
    const [orderID, setOrderID] = useState("");
    const [to, setTo] = useState("");
    const [quantity, setQuantity] = useState("");
    const [transporters, setTransporters] = useState([]);
    const [address, setAddress] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        // Fetch the list of transporters from the backend
        const fetchTransporters = async () => {
            try {
                const response = await axios.get(
                    "https://cargoamernbackend.onrender.com/api/user/get-transporters"
                );
                setTransporters(response.data.transporters);
            } catch (error) {
                console.error(error);
            }
        };

        // Fetch the current user details from local storage
        const fetchCurrentUser = () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            setCurrentUser(currentUser);
            if (currentUser) {
                setAddress(currentUser.address);
            }
        };

        const fetchReplies = async () => {
            try {
                const response = await axios.get(
                    "https://cargoamernbackend.onrender.com/api/manufacturer/get-replies"
                );
                setReplies(response.data.replies);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReplies();

        fetchTransporters();
        fetchCurrentUser();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            // Find the transporter ID based on the selected username
            const selectedTransporter = transporters.find(
                (transporter) => transporter.username === to
            );

            if (!selectedTransporter) {
                setErrorMessage("Invalid transporter selected.");
                return;
            }

            // Create the manufacturer response and send it to the backend
            const response = await axios.post(
                "https://cargoamernbackend.onrender.com/api/manufacturer/create-response",
                {
                    orderID,
                    from: currentUser.username,
                    to: selectedTransporter.username,
                    transid: selectedTransporter._id,
                    manuid: currentUser.id,
                    quantity,
                    address,
                }
            );

            if (response.data.success) {
                // Manufacturer response created successfully
                setSuccessMessage(
                    "Manufacturer response created successfully."
                );

                // Reset form fields
                setOrderID("");
                setTo("");
                setQuantity("");
                setAddress("");
                window.location.reload();
            } else {
                // Manufacturer response creation failed
                setErrorMessage("Manufacturer response creation failed.");

                // Display error message or perform any other actions
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div className="container align-items-center">
                <h2 className="text-center">Manufacturer Landing Page</h2>
                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
                <div className="container card justify-content-center ">
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group mt-4">
                            <label>Order ID:</label>
                            <input
                                type="text"
                                value={orderID}
                                onChange={(e) => setOrderID(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group mt-2">
                            <label>From:</label>
                            <input
                                type="text"
                                value={currentUser ? currentUser.username : ""}
                                disabled
                                className="form-control"
                            />
                        </div>

                        <div className="form-group mt-2">
                            <label>To:</label>
                            <select
                                value={to}
                                className="form-control"
                                onChange={(e) => setTo(e.target.value)}
                                required
                            >
                                <option value="">Select Transporter</option>
                                {transporters.map((transporter) => (
                                    <option
                                        key={transporter._id}
                                        value={transporter.username}
                                    >
                                        {transporter.username}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mt-2">
                            <label>Quantity:</label>
                            <select
                                value={quantity}
                                className="form-control"
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            >
                                <option value="">Select Quantity</option>
                                <option value="1">1 ton</option>
                                <option value="2">2 tons</option>
                                <option value="3">3 tons</option>
                            </select>
                        </div>

                        <div className="form-group mt-2">
                            <label>Address:</label>
                            <input
                                type="text"
                                value={currentUser ? currentUser.address : ""}
                                className="form-control"
                                onChange={(e) => setAddress(e.target.value)}
                                disabled
                            />
                        </div>

                        <button
                            className="mt-3 mb-3 btn btn-primary"
                            type="submit"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                <div className="mt-4">
                    <h3>Replies</h3>
                    <ul className="list-group mb-2">
                        {replies
                            .filter(
                                (reply) =>
                                    reply.to ===
                                    (currentUser ? currentUser.id : "")
                            )
                            .map((reply) => (
                                <li
                                    key={reply.orderId}
                                    className="list-group-item"
                                >
                                    <strong>From:</strong> {reply.from} |{" "}
                                    <strong>Order ID:</strong> {reply.orderId} |{" "}
                                    <strong>Price:</strong> {reply.price} |{" "}
                                    <strong>Reply:</strong> {reply.reply}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default Manufacturer;
