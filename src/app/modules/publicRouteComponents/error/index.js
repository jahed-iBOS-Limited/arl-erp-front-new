import React from "react";
import styles from "../success/style.module.css";

const ErrorMessageComponent = () => {
  return (
    <section className="d-flex flex-row justify-content-center align-items-center h-100">
      <div
        className={`bg-secondary d-flex justify-content-center align-items-center ${styles.cardContainer}`}
      >
        <div className="card w-100 h-100">
          <div class="card-header bg-danger text-center py-sm-4">
            <i
              class="fa fa-check-circle display-2 py-5 text-white"
              aria-hidden="true"
            ></i>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
            <h2 className={`mb-4 ${styles.greatText}`}>Sorry!</h2>
            <p style={{ fontSize: "18px" }}>Your payment has been cancelled.</p>
            <button className="btn btn-primary rounded">
              {" "}
              Back Home <i class="fa fa-arrow-left ml-2" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorMessageComponent;
