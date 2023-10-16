import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import "./styles.css";
import { useParams } from "react-router-dom";
import IDelete from "../../../_helper/_helperIcons/_delete";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  eventName: "",
  eventDescription: "",
  eventPlace: "",
  eventStartDate: _todayDate(),
  eventEndDate: _todayDate(),
  isParticipantCount: false,
};

const validationSchema = Yup.object().shape({
  eventName: Yup.string().required("Event Name is required"),
  eventDescription: Yup.string().required("Event Description is required"),
  eventPlace: Yup.string().required("Event Place is required"),
});

export default function EventPlanningCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [activityList, setActivityList] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [, saveData, saveDataLoader] = useAxiosPost();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const { id } = useParams();
  const saveHandler = (values, cb) => {
    const payload = {
      eventId: 0,
      eventName: values?.eventName,
      eventDescription: values?.eventDescription,
      eventPlace: values?.eventPlace,
      eventStartDate: values?.eventStartDate,
      eventEndDate: values?.eventEndDate,
      createdBy: profileData?.employeeId,
      participants: participantList,
      activities: activityList,
    };

    saveData(`/hcm/Training/CreateEvent`, payload, cb, true);
  };

  const activityAddHandler = (values) => {
    const isExist = activityList?.find(
      (item) => item?.activityName === values?.activityName
    );
    if (isExist) {
      return toast.warn("Activity Name is already exist");
    } else {
      setActivityList([
        ...activityList,
        {
          activityId: 0,
          eventId: id ? id : 0,
          activityName: values?.activityName,
          activityStartTime: null,
          activityEndTime: null,
          isParticipantCount: values?.isParticipantCount,
          createdBy: profileData?.employeeId,
        },
      ]);
    }
  };

  const deleteActivity = (index) => {
    const filterArr = activityList?.filter((item, idx) => idx !== index);
    setActivityList(filterArr);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
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
          <IForm title={"Event Planning Create"} getProps={setObjprops}>
            <Form>
              {/* header section */}
              <div className="form-group  global-form row">
                <div className="col-lg-3 ">
                  <InputField
                    value={values?.eventName}
                    label="Event Name"
                    name="eventName"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("eventName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.eventDescription}
                    label="Event Description"
                    name="eventDescription"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("eventDescription", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.eventPlace}
                    label="Event Place"
                    name="eventPlace"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("eventPlace", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.eventStartDate}
                    label="Event Start Date"
                    placeholder="Event Start Date"
                    type="date"
                    name="eventStartDate"
                    onChange={(e) => {
                      setFieldValue("eventStartDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.eventEndDate}
                    label="Event End Date"
                    placeholder="Event End Date"
                    type="date"
                    name="eventEndDate"
                    onChange={(e) => {
                      setFieldValue("eventEndDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* activity section */}
              <div className="row">
                <div className="col-lg-4">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-12">
                        <h4>Activity List</h4>
                      </div>
                      <div className="col-lg-6">
                        <InputField
                          value={values?.activityName}
                          label="Activity Name"
                          name="activityName"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("activityName", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3 d-flex mt-5">
                        <input
                          id="isParticipantCount"
                          type="checkbox"
                          name="isParticipantCount"
                          value={values?.isParticipantCount}
                          onChange={(e) => {
                            setFieldValue(
                              "isParticipantCount",
                              e.target.checked
                            );
                          }}
                        />
                        <span htmlFor="isParticipantCount" className="ml-2">
                          Participant Count
                        </span>
                      </div>
                      <div
                        className="col-lg-2"
                        style={{
                          marginTop: "22px",
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            activityAddHandler(values);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-12">
                        <h4>Participant List</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* table section */}
              <div className="row">
                <div className="col-lg-4">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Activity Name</th>
                        <th>
                          Participant <br /> Count
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityList?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.activityName}</td>
                          <td>{item?.isParticipantCount ? "Yes" : "No"}</td>
                          <td className="text-center">
                            <span onClick={() => deleteActivity(index)}>
                              <IDelete />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-8">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Name</th>
                        <th>occupation</th>
                        <th>organization</th>
                        <th>phone</th>
                        <th>email</th>
                        <th>address</th>
                        <th>code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantList?.length > 0 &&
                        participantList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.name}</td>
                            <td>{item?.occupation}</td>
                            <td>{item?.organization}</td>
                            <td>{item?.phone}</td>
                            <td>{item?.email}</td>
                            <td>{item?.address}</td>
                            <td>{item?.code}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
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
}
