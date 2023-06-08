import React, { Component } from "react";
// eslint-disable-next-line no-unused-vars
import { Container, Row, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../asset/update/logo.png";
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
          </Row>
        </Container>
      </div>
    );
  }
}
