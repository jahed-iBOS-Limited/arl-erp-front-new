import React, { Component } from "react";
import { Container, Row, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "./asset/logo.svg";
import "react-toastify/dist/ReactToastify.css";

export default class Header extends Component {
  render() {
    return (
      <div className="NavigationWrapper">
        <Container>
          <Row>
            <div className="col-lg-3 logoleft">
              <div className="logo">
                <Link to="/">
                  <img alt="Logo" src={Logo} />
                </Link>
              </div>
            </div>

            <div className="col-lg-9 navigationright">
              <div className="Navigation">
                <Navbar bg="" expand="lg">
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                      <Link to="/">About</Link>
                      <Link to="">Pricing</Link>
                      <Link to="/">Contact Us</Link>
                      <Link to="/">Login</Link>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
              </div>
              <div className="quote">
                <button> Get Started </button>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}
