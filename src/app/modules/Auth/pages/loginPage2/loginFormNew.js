import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../style.css";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as actions from "../../_redux/Auth_Actions";
import axios from "axios";
import { toast } from "react-toastify";
import OtpPopup from "./OtpPopup";
import Loading from "../../../_helper/_loading";
import { setPeopledeskCookie } from "../../../_helper/_cookie";

function LoginForm(props) {
  const dispatch = useDispatch();
  const [isOtp, setIsOtp] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("email is Required"),
      password: Yup.string()
        .min(4, "Must be at least 4 characters")
        .required("password is required"),
    }),
    onSubmit: (values) => {
      loginAction(false, values);
    },
  });

  const loginAction = (isSkipOtp, values) => {
    axios
      .get(`/domain/Information/Basic?Email=${values?.email}`)
      .then((res) => {
        if (res?.data?.isExpire) {
          dispatch(actions?.passwordExpiredUpdateAction(true));
        } else {
          dispatch(
            actions.Login(
              values.email,
              values.password,
              setLoading,
              () => {
                setPeopledeskCookie(
                  "loginInfoPeopleDesk",
                  JSON.stringify({}),
                  100
                );
              },
              setIsOtp,
              isSkipOtp,
              setUserId,
              setToken
            )
          );
        }
      })
      .catch((err) => {
        toast.warn("Failed, try again");
      });
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      {loading && <Loading />}
      <Form.Group controlId="formBasicEmail">
        <label className="login-form-label">Email </label>
        <Form.Control
          type="text"
          placeholder="Enter user name or email address"
          name="email"
          className="fromStyle"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="inputError margin-minus-10">
            {formik.errors.email}
          </div>
        ) : null}
        <span className="iconname usericon"> </span>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <label className="login-form-label">Password</label>
        <React.Fragment>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
            className="fromStyle"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <span className="iconname passwordicon"> </span>
        </React.Fragment>
        {formik.touched.password && formik.errors.password ? (
          <div className="inputError margin-minus-10">
            {formik.errors.password}
          </div>
        ) : null}
      </Form.Group>

      <div className="forgetPassword ">
        <Form.Group controlId="formBasicCheckbox ">
          <Form.Check type="checkbox" label="Remember Me" />
        </Form.Group>
        <div className="forget" style={{ marginTop: "6px" }}>
          <Link to="/reset-password">Forgot Password?</Link>
        </div>
      </div>

      <Button type="submit" className="loginbutton custom_btn">
        Log in
      </Button>
      {isOtp && (
        <OtpPopup
          token={token}
          setIsOtp={setIsOtp}
          loginAction={loginAction}
          userId={userId}
        />
      )}
    </Form>
  );
}

export default LoginForm;
