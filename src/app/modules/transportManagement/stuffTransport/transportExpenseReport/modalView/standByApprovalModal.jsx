import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  driver: "",
  vehicle: "",
};

export default function StandByApprovalModal({
  singleData,
  setShowApproveModal,
  getRowData,
  parentValues,
}) {
  const {
    employeeName,
    employeeId,
    workplace,
    bookingTime,
    tourTime,
    purpose,
    bookingDate,
    bookingId,
    designation,
    carpools,
    tripToAddress
  } = singleData || {};
  console.log("singleData",singleData);
  const [objProps, setObjprops] = useState({});
  const [,saveApproval, loadingApproval] = useAxiosPost([]);
  const tripDate = _dateFormatter(bookingDate?.split("T")[0]);
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const validationSchema = Yup.object().shape({
    driver: Yup.object().shape({
      label: Yup.string().required("Driver is required"),
      value: Yup.string().required("Driver is required"),
    }),
    vehicle: Yup.object().shape({
      label: Yup.string().required("vehicle is required"),
      value: Yup.string().required("vehicle is required"),
    }),
  });

  // load driver ddl data
  const loadUserList = (v) => {
    const apiUrl = "/mes/VehicleLog/GetAvailableDriverList";
    const mapResponseData = (data) => {
      return data.map((item) => ({
        ...item,
        value: item?.intDriverId,
        label: item?.strDriverName,
      }));
    };

    if (v === "") {
      return axios
        .get(`${apiUrl}?TripDate=${tripDate}&strSearch=%20%20%20`)
        .then((res) => mapResponseData(res?.data));
    }

    if (v?.length < 3) return Promise.resolve([]);

    return axios
      .get(`${apiUrl}?TripDate=${tripDate}&strSearch=${v}`)
      .then((res) => mapResponseData(res?.data));
  };

  const saveHandler = (values, cb) => {
    const payload = {
      isAdminApprove: true,
      bookingId,
      driverId: values?.driver?.value,
      driverName: values?.driver?.label,
      vehicleId: values?.vehicle?.value,
      vehicleName: values?.vehicle?.label,
      approvedBy: userId,
    };
    saveApproval(
      `/mes/VehicleLog/ApproveBookingStandByVehicle`,
      payload,
      ()=>{
        setShowApproveModal(false);
        getRowData(
          `/mes/VehicleLog/GetBookingStandByVehicleStatus?fromDate=${parentValues?.fromDate}&todate=${parentValues?.toDate}&adminStatus=${parentValues?.status?.value}`
        );
      },
      true
    );
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
          {loadingApproval && <Loading />}
          <IForm
            title="Approve"
            getProps={setObjprops}
            isHiddenBack
            submitBtnText="Approve"
          >
            <Form>
              <div
                style={{ justifyContent: "space-between", marginTop: "20px" }}
                className="d-flex"
              >
                <div>
                  <p>
                    <strong>
                      Employee Name & Enroll : {employeeName}({employeeId})
                    </strong>
                  </p>
                  <p>
                    <strong>WorkPlace : {workplace}</strong>
                  </p>
                  <p>
                    <strong>Start Time : {bookingTime}</strong>
                    <strong style={{ marginLeft: "15px" }}>
                      End Time : {tourTime}
                    </strong>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Designation : {designation}</strong>
                  </p>
                  <p>
                    <strong>Destination :{tripToAddress} </strong>
                  </p>
                  <p>
                    <strong>Purpose (In details) : {purpose} </strong>
                  </p>
                </div>
              </div>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <label>Driver Name</label>
                  <SearchAsyncSelect
                    name="driver"
                    selectedValue={values?.driver}
                    handleChange={(valueOption) => {
                      setFieldValue("driver", valueOption);
                      console.log("valueOption", valueOption);
                      setFieldValue("vehicle", {
                        label: valueOption?.strVehicleNo,
                        value: valueOption?.intVehicleId,
                      });
                    }}
                    loadOptions={loadUserList}
                    placeholder="Driver Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vehicle"
                    value={values?.vehicle}
                    label="vehicle Name"
                    onChange={(valueOption) => {
                      setFieldValue("vehicle", valueOption);
                    }}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="table custom-table global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Carpooling Person Name</th>
                      <th>Designation</th>
                      <th>Pickup Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carpools?.map((item, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{item?.employeeName}</td>
                        <td className="text-center">{item?.empDesignation}</td>
                        <td className="text-center">{item?.empPickUpPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
