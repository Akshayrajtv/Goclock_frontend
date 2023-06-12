import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Transporter = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [priceMap, setPriceMap] = useState({});
    const [replyMap, setReplyMap] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [searchOption, setSearchOption] = useState("orderID");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const token = currentUser?.token;

        if (token) {
            const config = {
                headers: {
                    Authorization: `${token}`,
                },
            };

            axios
                .get(
                    "https://cargoamernbackend.onrender.com/api/transporter/messages",
                    config
                )
                .then((response) => {
                    setMessages(response.data);
                })
                .catch((error) => {
                    console.log("Error fetching messages:", error);
                });
        }
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const token = currentUser?.token;

            if (!token) {
                // Handle the case when the user is not authenticated or the token is missing
                return;
            }

            const config = {
                headers: {
                    Authorization: `${token}`,
                },
            };

            const selectedMessageId = selectedMessage.orderID;
            const price = priceMap[selectedMessageId];
            const reply = replyMap[selectedMessageId];
            const from = selectedMessage.to;
            const to = selectedMessage.manuid;

            const orderData = {
                orderId: selectedMessageId,
                price,
                reply,
                from,
                to,
            };

            await axios.post(
                "https://cargoamernbackend.onrender.com/api/transporter/saveOrder",
                orderData,
                config
            );

            // Clear form fields
            const newPriceMap = { ...priceMap, [selectedMessageId]: "" };
            setPriceMap(newPriceMap);
            const newReplyMap = { ...replyMap, [selectedMessageId]: "" };
            setReplyMap(newReplyMap);

            // Display success message
            setSuccessMessage("Message sent successfully.");

            // Perform any additional actions upon successful submission
        } catch (error) {
            console.log(error);
            // Handle the error condition appropriately
        }
    };

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
    };

    const handlePriceChange = (event, messageId) => {
        const newPriceMap = { ...priceMap, [messageId]: event.target.value };
        setPriceMap(newPriceMap);
    };

    const handleReplyChange = (event, messageId) => {
        const newReplyMap = { ...replyMap, [messageId]: event.target.value };
        setReplyMap(newReplyMap);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchOptionChange = (event) => {
        setSearchOption(event.target.value);
        setSearchTerm("");
    };

    const filteredMessages = messages.filter((message) => {
        if (searchOption === "orderID") {
            return message.orderID.includes(searchTerm);
        } else if (searchOption === "from") {
            return message.from.includes(searchTerm);
        }
        return true;
    });

    return (
        <Layout>
            <div className="container">
                <h1 className="text-center mt-4">Transporter Dashboard</h1>
                <div className="row">
                    <div className="col-md-6">
                        <h2 className="text-center mb-4">Received Messages</h2>
                        <div className="mb-4">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchOption"
                                    id="searchOptionOrderId"
                                    value="orderID"
                                    checked={searchOption === "orderID"}
                                    onChange={handleSearchOptionChange}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="searchOptionOrderId"
                                >
                                    Order ID
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchOption"
                                    id="searchOptionFrom"
                                    value="from"
                                    checked={searchOption === "from"}
                                    onChange={handleSearchOptionChange}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="searchOptionFrom"
                                >
                                    From
                                </label>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                />
                            </div>
                        </div>
                        <div className="list-group">
                            {filteredMessages.map((message) => (
                                <button
                                    key={message.orderID}
                                    type="button"
                                    className={`list-group-item list-group-item-action ${
                                        selectedMessage?.orderID ===
                                        message.orderID
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => handleSelectMessage(message)}
                                >
                                    {message.orderID}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2 className="text-center mb-4">Selected Message</h2>
                        {selectedMessage ? (
                            <div>
                                <h5>Order ID: {selectedMessage.orderID}</h5>
                                <h5>From: {selectedMessage.from}</h5>
                                <h5>To: {selectedMessage.to}</h5>
                                <h5>Address: {selectedMessage.address}</h5>
                                <h5>
                                    Quantity: {selectedMessage.quantity} ton
                                </h5>
                                <div className="form-group">
                                    <label htmlFor="price">Price:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        value={
                                            priceMap[selectedMessage.orderID] ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handlePriceChange(
                                                e,
                                                selectedMessage.orderID
                                            )
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reply">Reply:</label>
                                    <textarea
                                        className="form-control"
                                        id="reply"
                                        rows="3"
                                        value={
                                            replyMap[selectedMessage.orderID] ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleReplyChange(
                                                e,
                                                selectedMessage.orderID
                                            )
                                        }
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary mt-3"
                                        onClick={handleFormSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                                {successMessage && (
                                    <p className="text-success">
                                        {successMessage}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-center">No message selected.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Transporter;
