import React from "react";
import { Container, Row } from "react-bootstrap";
import mockup from "./asset/loginBg.png";
import "./style.css";
import LoginForm from "./loginPage2/loginFormNew";
// import LoginForm from "./loginForm";
// import LoginForm from "../sign-in/LoginForm";

const HomeComponent = () => {
  return (
    <div className="WelcomeMockup ">
      <Container>
        <Row>
          <div className="col-xl-5 col-lg-12">
            <div className="welcomeArea">
              <h1 className="text-dark">
                {" "}
                Welcome To
                <br /> iBOS{" "}
              </h1>
              <p>
                {" "}
                Harness the potential of Big Data Analytics & Cloud Services and
                become a data-driven organization with Needle tail{" "}
              </p>
            </div>
            <div className="welcomeFrom">
              <LoginForm />
            </div>
          </div>

          <div className="offset-xl-1 col-xl-6 offset-lg-0 col-lg-0">
            <div className="mockup">
              <img src={mockup} alt="" />
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default HomeComponent;
