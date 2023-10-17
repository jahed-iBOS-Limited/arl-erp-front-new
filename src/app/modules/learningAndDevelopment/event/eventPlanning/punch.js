import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";

const initData = {};
const Punch = () => {
  const { id } = useParams();
  const [objProps, setObjprops] = useState({});
  const [, saveData, saveDataLoader] = useAxiosPost();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const saveHandler = (values) => {
    console.log("values", values);
    const payload = {
      actionBy: profileData?.userId,
      cardNumber: values?.strCardNumber,
      activityId: location?.clickedItem?.activityId,
      eventId: +id,
    };
    saveData(
      "/hcm/Training/CheckParticipant",
      payload,
      (res) => {
        console.log("res", res);
        setResponse(res);
      },
      true
    );
  };

  const location = useLocation();
  const [response, setResponse] = useState({});

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {saveDataLoader && <Loading />}
          <IForm
            isHiddenReset={true}
            isHiddenSave={true}
            customTitle={"Event Planning"}
            getProps={setObjprops}
          >
            <Form>
              {/* header section */}
              <div className="form-group  global-form row">
                <div className="col-lg-4">
                  <h6>Name: {location?.eventHeaderData?.eventName}</h6>
                </div>
                <div className="col-lg-4">
                  <h6>
                    Description: {location?.eventHeaderData?.eventDescription}
                  </h6>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <h6>
                    Start Date:{" "}
                    {_dateFormatter(location?.eventHeaderData?.eventStartDate)}
                  </h6>
                </div>
                <div className="col-lg-4">
                  <h6>
                    End Date:{" "}
                    {_dateFormatter(location?.eventHeaderData?.eventEndDate)}
                  </h6>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <h6
                    style={{
                      color: "green",
                    }}
                  >
                    Activity: {location?.clickedItem?.activityName}
                  </h6>
                </div>
                <div className="col-lg-4 d-flex">
                  <InputField
                    id="cardNoInput"
                    autoFocus
                    value={values?.strCardNumber}
                    label="Card No"
                    name="strCardNumber"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("strCardNumber", e.target.value);
                      setResponse({});
                    }}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-lg-3"></div>
                <div className="col-lg-6">
                  <div
                    className="text-center"
                    style={{
                      height: "200px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "10px",
                      backgroundColor:
                        response?.autoId === 1
                          ? "#00b33c"
                          : response?.autoId === 2
                          ? "#f7b500"
                          : response?.autoId === 3
                          ? "#b53535"
                          : "",
                      color:
                        response?.autoId === 1
                          ? "white"
                          : response?.autoId === 2
                          ? "black"
                          : response?.autoId === 3
                          ? "white"
                          : "",
                    }}
                  >
                    <h1>{response?.message}</h1>
                  </div>
                </div>
                <div className="col-lg-3"></div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default Punch;

// autoId = 1 -> green
// autoId = 2 -> yellow
// autoId = 3 -> red
