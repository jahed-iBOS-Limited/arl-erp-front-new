import React from "react";
import { Container, Row } from "react-bootstrap";
// import mockup from "../asset/loginBg.png";
import mockup from "../asset/update/loginB.png";
import ibosLogo from "../asset/update/ibosLogo.png";
import "../style.css";
import LoginForm from "./loginForm";
// import LoginForm from "../sign-in/LoginForm";

const HomeComponent = () => {
  return (
    <div className="WelcomeMockup ">
      <Container>
        <Row>
          <div className="col-xl-6 col-lg-12">
            <div className="welcomeArea">
              <h1 className="text-dark text-uppercase">
                Welcome To <br /> Akij Resource Limited
              </h1>
              <p className="short_description">
                Ensure best quality products & services through continuous
                improvement that benefits society and environment.
              </p>
            </div>
            <div className="welcomeFrom">
              <LoginForm />
            </div>
          </div>

          <div className="col-xl-6 offset-lg-0 col-lg-0">
            <div className="mockup text-center">
              <img src={mockup} alt="" />
              <h3 className="mocku_text">
                "Be the benchmark <br /> of customer's choice"
              </h3>
            </div>
          </div>
        </Row>
        <div className="text-right" style={{ marginTop: "15px" }}>
          <span>Powered By</span>
          <img className="footer_logo" src={ibosLogo} alt="" />
        </div>
      </Container>
    </div>
  );
};

export default HomeComponent;
