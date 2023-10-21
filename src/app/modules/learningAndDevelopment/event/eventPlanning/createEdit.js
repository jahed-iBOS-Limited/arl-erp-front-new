import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
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
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import NewSelect from "../../../_helper/_select";
import IView from "../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import ParticipantRowModal from "./participantRowModal";

const initData = {
  eventName: "",
  eventDescription: "",
  eventPlace: "",
  eventStartDate: _todayDate(),
  eventEndDate: _todayDate(),
  activityName: "",
  activityStartTime: "",
  activityEndTime: "",
  isParticipantCount: false,
};

const validationSchema = Yup.object().shape({
  eventName: Yup.string().required("Event Name is required"),
  eventDescription: Yup.string().required("Event Description is required"),
  eventPlace: Yup.string().required("Event Place is required"),
  eventStartDate: Yup.string().required("Event Start Date is required"),
  eventEndDate: Yup.string().required("Event End Date is required"),
});

export default function EventPlanningCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [activityList, setActivityList] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false)
  const [participantModalData, setParticipantModalData] = useState({})
  const [customerDDL, getCustomerDDL, getCustomerDDLLoader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [modifiedData, setModifiedData] = useState({});
  const [, getEditData, editDataLoader] = useAxiosGet();
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);


  const { id } = useParams();

  const saveHandler = (values, cb) => {
    const payload = {
      eventId: id ? id : 0,
      partnerName: values?.customerName.label,
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

  const activityAddHandler = (values, setFieldValue) => {
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
          eventId: id ? +id : 0,
          activityName: values?.activityName,
          activityStartTime: values?.activityStartTime,
          activityEndTime: values?.activityEndTime,
          isParticipantCount: values?.isParticipantCount,
          createdBy: profileData?.employeeId,
        },
      ]);
      setFieldValue("activityName", "");
    }
  };

  const deleteActivity = (index) => {
    const filterArr = activityList?.filter((item, idx) => idx !== index);
    setActivityList(filterArr);
  };

  useEffect(() => {
    if (id) {
      getEditData(`/hcm/Training/GetEventById?id=${id}`, (data) => {
        setActivityList(data?.activities);
        setParticipantList(data?.participants);
        setModifiedData({
          eventName: data?.eventName,
          eventDescription: data?.eventDescription,
          eventPlace: data?.eventPlace,
          eventStartDate: _dateFormatter(data?.eventStartDate),
          eventEndDate: _dateFormatter(data?.eventEndDate),
          customerName: { value: data?.partnerId, label: data?.partnerName }

        });
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const accId = profileData?.accountId;
    const buId = selectedBusinessUnit?.value;
    getCustomerDDL(`/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=2`)

  }, [profileData, selectedBusinessUnit])


  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifiedData : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          !id && resetForm(initData);
          !id && setActivityList([]);
          !id && setParticipantList([]);
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
          {(saveDataLoader || editDataLoader || getCustomerDDLLoader) && <Loading />}
          <IForm title={"Event Planning Create"} getProps={setObjprops}>
            <Form>
              {/* header section */}
              <div className="form-group  global-form row">
                <div className="col-lg-3 ">
                  <NewSelect
                    value={values?.customerName}
                    label="Customer Name"
                    name="customerName"
                    options={customerDDL}
                    onChange={(valueOption) => {
                      setFieldValue("customerName", valueOption);
                    }}
                  />
                </div>
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
                <div className="col-lg-7">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-12">
                        <h4>Activity List</h4>
                      </div>
                      <div className="col-lg-4">
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
                      <div className="col-lg-2">
                        <InputField
                          value={values?.activityStartTime}
                          label="Start Time"
                          name="activityStartTime"
                          type="time"
                          onChange={(e) => {
                            setFieldValue("activityStartTime", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-2">
                        <InputField
                          value={values?.activityEndTime}
                          label="End Time"
                          name="activityEndTime"
                          type="time"
                          onChange={(e) => {
                            setFieldValue("activityEndTime", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-2 d-flex  mt-2">
                        <div className="d-flex align-items-center mt-2">

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
                          <span htmlFor="isParticipantCount" className="pl-2">
                            Participant Count
                          </span>
                        </div>
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
                            activityAddHandler(values, setFieldValue);
                          }}
                          disabled={!values?.activityName || !values?.activityStartTime || !values?.activityEndTime}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Participant list  */}
                <div className="col-lg-5">
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
                <div className="col-lg-7">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Activity Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>
                          Participant <br /> Count
                        </th>
                        <th>Taken</th>
                        <th>Remaining</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityList?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.activityName}</td>
                          <td>{item?.activityStartTime ? item?.activityStartTime : ""}</td>
                          <td>{item?.activityEndTime}</td>
                          <td>{item?.isParticipantCount ? "Yes" : "No"}</td>
                          <td>{item?.taken}</td>
                          <td>{item?.remaining}</td>
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
                <div className="col-lg-5">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Name</th>
                        <th>Occupation</th>
                        {/* <th>Organization</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th> */}
                        <th>Code</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantList?.length > 0 &&
                        participantList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.participantName}</td>
                            <td>{item?.occupation}</td>
                            {/* <td>{item?.organaizationName}</td>
                            <td>{item?.phone}</td>
                            <td>{item?.email}</td>
                            <td>{item?.address}</td> */}
                            <td>{item?.cardNumber}</td>
                            <td className="d-flex justify-content-center">
                              <IView clickHandler={() => {

                                setIsShowModal(true)
                                setParticipantModalData({ sl: index + 1, ...item })

                              }} />
                            </td>

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
            <IViewModal
              title="Event Participant"
              modelSize="lg"
              show={isShowModal}
              onHide={() => setIsShowModal(false)}
            >
              <ParticipantRowModal participantData={participantModalData} />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
