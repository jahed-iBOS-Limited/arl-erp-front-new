import React from "react";
import { Spinner } from "react-bootstrap";

const ChatAppLoading = () => {
  return (
    <div
      style={{
        height: "60vh",
        position: "absolute",
        top: "0",
        left: "0",
        transform: "translateX(30%)",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="dark" />
    </div>
  );
};

export default ChatAppLoading;
