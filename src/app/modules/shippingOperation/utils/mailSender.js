import { Form, Formik } from "formik";
import React, { useState } from "react";
import { marineBaseUrlPythonAPI } from "../../../App";
import IDelete from "../../_helper/_helperIcons/_delete";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";

const MailSender = ({ payloadInfo }) => {

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [emailList, setEmailList] = useState([]);
  const [email, setEmail] = useState("");
  const [, onSendEvent, loading] = useAxiosPost();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddEmail = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (emailList.includes(trimmedEmail)) {
      alert("This email is already in the list.");
      return;
    }

    if (trimmedEmail) {
      setEmailList([...emailList, trimmedEmail]);
      setEmail(""); // Clear input after adding
    }
  };

  const handleDeleteEmail = (index) => {
    const updatedList = emailList.filter((_, i) => i !== index);
    setEmailList(updatedList);
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={(values) => {
        // Handle form submission logic here
      }}
    >
      {() => (
        <>
          {loading && <Loading />}

          <Form className="form form-label-right">
            <div className="form-group global-form row">
              <div className="col-lg-6">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <button
                  onClick={handleAddEmail}
                  type="button"
                  className="btn btn-primary mt-5"
                >
                  Add
                </button>
              </div>
            </div>
            {/* Table to display emails */}
            {emailList.length > 0 && (
              <>
                <div className="text-right mt-5 mr-2">
                  <button
                    onClick={() => {
                      const payload = {
                        emailList: emailList, // Bind emailList dynamically
                        arrayData: payloadInfo,
                        intUserEnrollId: profileData?.userId || 0
                      };
                      onSendEvent(
                        `${marineBaseUrlPythonAPI}/automation/response_mail`,
                        payload,
                        null,
                        true
                      );
                    }}
                    type="button"
                    className="btn btn-primary"
                  >
                    Send
                  </button>
                </div>
                <div className="table-responsive mt-3">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailList.map((email, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{email}</td>
                          <td className="text-center">
                            <span
                              onClick={() => {
                                handleDeleteEmail(index);
                              }}
                            >
                              <IDelete />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Form>
        </>
      )}
    </Formik>
  );
};

export default MailSender;
