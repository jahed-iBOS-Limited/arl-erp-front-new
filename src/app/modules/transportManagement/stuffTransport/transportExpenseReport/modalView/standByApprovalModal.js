import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  driver: "",
  vehicle:""
};

export default function StandByApprovalModal({ singleData }) {
  const {
    employeeName,
    employeeId,
    workplace,
    bookingTime,
    tourTime,
    purpose,
    designation,
    bookingDate,
    bookingId,
  } = singleData || {};
  const [objProps, setObjprops] = useState({});
  const [, saveApproval, loadingApproval] = useAxiosGet([]);
  const tripDate = _dateFormatter(bookingDate?.split("T")[0]);
  const [vehicleListDDL, getVehicleListDDL] = useAxiosGet([]);
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);

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
    const payload ={
        isAdminApprove:true,
        bookingId,
        driverId:values?.driver?.value,
        driverName:values?.driver?.label,
        vehicleId:values?.vehicle?.value,
        vehicleName:values?.vehicle?.label,
        approvedBy:userId
    }
    saveApproval(`7/mes/VehicleLog/ApproveBookingStanByVehicle`,payload,()=>{},true)
  };
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
                  </p>
                  <p>
                    <strong>End Time : {tourTime}</strong>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Designation : {designation}</strong>
                  </p>
                  <p>
                    <strong>Destination : </strong>
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
                      if (!valueOption) return;
                      getVehicleListDDL(
                        `/mes/VehicleLog/GetLastVehicleMileageId?vehicleId=${valueOption.intVehicleId}`
                      );
                    }}
                    loadOptions={loadUserList}
                    placeholder="Driver Name"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vehicle"
                    options={vehicleListDDL || []}
                    value={values?.item}
                    label="vehicle Name"
                    onChange={(valueOption) => {
                      setFieldValue("vehicle", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
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
