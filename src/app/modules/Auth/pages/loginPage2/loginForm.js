/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../style.css";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
// import "./style.css";
import * as actions from "../../_redux/Auth_Actions";
import axios from "axios";
import { toast } from "react-toastify";
import OtpPopup from "./OtpPopup";
import Loading from "../../../_helper/_loading";
import { setPeopledeskCookie } from "../../../_helper/_cookie";

function LoginForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const [isOtp, setIsOtp] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [token, setToken] = useState("");

  const loginAction = (isSkipOtp) => {
    axios
      .get(`/domain/Information/Basic?Email=${loginData?.email}`)
      .then((res) => {
        if (res?.data?.isExpire) {
          dispatch(actions?.passwordExpiredUpdateAction(true));
        } else {
          dispatch(
            actions.Login(
              loginData.email,
              loginData.password,
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

  const onSubmit = (data) => {
    let languageLocale = localStorage.getItem("language") || undefined;

    if (typeof languageLocale === "undefined" || languageLocale === "null") {
      localStorage.setItem("language", "en");
    }

    loginAction(false);
  };

  const handleChange = ({ currentTarget: input }) => {
    const loginDataNew = { ...loginData };
    loginDataNew[input.name] = input.value;
    dispatch(actions.setEmailAction(loginDataNew?.email));
    setLoginData(loginDataNew);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {loading && <Loading />}
      <Form.Group controlId='formBasicEmail'>
        <label className='login-form-label'>Email </label>
        <Form.Control
          type='text'
          placeholder='Enter user name or email address'
          name='email'
          className='fromStyle'
          onChange={handleChange}
        />

        {/* 
                  ref={register({
                        required: true,
                        maxLength: 100,
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                */}
        <span className='iconname usericon'> </span>
      </Form.Group>
      <div className='inputError margin-minus-10'>
        {errors.Email &&
          errors.Email.type === "required" &&
          '"Email Address" can\'t be blank!'}
        {errors.Email &&
          errors.Email.type === "maxLength" &&
          '"Email Address" criteria aren\'t meet!'}
        {errors.Email &&
          errors.Email.type === "pattern" &&
          '"Email Address" criteria aren\'t meet!'}
      </div>

      <Form.Group controlId='formBasicPassword'>
        <label className='login-form-label'>Password</label>
        <React.Fragment>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            name='password'
            className='fromStyle'
            onChange={handleChange}
            ref={register({ required: true, minLength: 4 })}
          />
          <span className='iconname passwordicon'> </span>
        </React.Fragment>
      </Form.Group>

      <div className='inputError margin-minus-10'>
        {errors.Password &&
          errors.Password.type === "required" &&
          "Password\" can't be blank!"}
        {errors.Password &&
          errors.Password.type === "minLength" &&
          '"Password" criteria aren\'t meet!'}
      </div>

      <div className='forgetPassword '>
        <Form.Group controlId='formBasicCheckbox '>
          <Form.Check type='checkbox' label='Remember Me' />
        </Form.Group>
        <div className='forget' style={{ marginTop: "6px" }}>
          <Link to='/reset-password'>Forgot Password?</Link>
        </div>
      </div>

      {/* {isLoading && (
                <Button type="submit" className="loginbutton" disabled>
                    Logging in
                </Button>
            )} */}

      {
        <Button type='submit' className='loginbutton custom_btn'>
          Log in
        </Button>
      }
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
