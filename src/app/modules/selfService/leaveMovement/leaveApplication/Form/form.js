/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import {
  getCountryDDL,
  getDistrictDDLAction,
  getLeaveSummarySelfData,
  getLeaveTypeDDL,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import { DropzoneDialogBase } from "material-ui-dropzone";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { addDaysToADate } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";
import { nextMonth } from "../../../../_helper/nextMonth";
import ApplicationTable from "./ApplicationTable";

const validationSchemaForMovement = Yup.object().shape({
  leaveType: Yup.string().required("Leave Type is required"),
  reasonType: Yup.object()
    .shape({
      label: Yup.string().required("Movement type is required"),
      value: Yup.string().required("Movement type is required"),
    })
    .typeError("Movement type is required"),
  fromTime: Yup.string().required("From Time required"),
  toTime: Yup.string().required("To Time required"),
  fromDate: Yup.date().required("From Date required"),
  toDate: Yup.date().required("To Date required"),
  reason: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Reason is required"),
  address: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Address is required"),
});

const validationSchema = Yup.object().shape({
  leaveType: Yup.string().required("Leave Type is required"),
  reasonType: Yup.object()
    .shape({
      label: Yup.string().required("Leave type is required"),
      value: Yup.string().required("Leave type is required"),
    })
    .typeError("Leave type is required"),
  fromDate: Yup.string()
    .required("From date is required")
    .typeError("From date is required"),
  toDate: Yup.string()
    .required("To date is required")
    .typeError("To date is required"),
  reason: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Reason is required"),
  address: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Address is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  location,
  setFileObjects,
  fileObjects,
  // setEmployeeValue,
  // employeeValue,
}) {
  const [countryDDL, setCountryDDL] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [updateLeaveTypeDDL, setUpdateLeaveTypeDDL] = useState([]);
  const [loader, setLoader] = useState([]);
  const [leaveSummaryRowDto, setLeaveSummaryRowDto] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getCountryDDL(setCountryDDL);
      getDistrictDDLAction(
        location?.state?.country?.value,
        location?.state?.division?.value,
        setDistrictDDL
      );
      // setEmployeeValue({
      //   label: location?.state?.employee?.label,
      //   value: location?.state?.employee?.value,
      // });
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    let data = [...leaveTypeDDL];
    const modifyData = data.filter(
      (item) => item.value !== 7 && item?.value !== 9
    );
    setUpdateLeaveTypeDDL([...modifyData]);
  }, [selectedBusinessUnit, profileData, leaveTypeDDL]);

  useEffect(() => {
    if (location) {
      getLeaveSummarySelfData(
        location?.state?.employee?.value,
        setLeaveSummaryRowDto,
        setLoader
      );
    }
  }, [location]);

  useEffect(() => {
    if (location && profileData?.accountId) {
      getLeaveTypeDDL(1, location?.state?.employee?.value, setLeaveTypeDDL);
    }
  }, [location, profileData]);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const plLeaveBalance = useCallback(
    leaveSummaryRowDto.filter((item) => item?.leaveType === "Previledge Leave"),
    [leaveSummaryRowDto]
  );

  const plLeaveFromDateHandler = (setFieldValue, value) => {
    let nextMonthFirstDate = new Date(nextMonth());
    let fromDate = new Date(value);

    // check if from Date is greather than current month last date,
    if (fromDate.getTime() >= nextMonthFirstDate.getTime()) {
      setFieldValue("fromDate", value);
    } else {
      setFieldValue("fromDate", "");
      return toast.warn("From date should be next month");
    }

    if (plLeaveBalance?.[0]?.remainingDays > 0) {
      let toDate = addDaysToADate(
        value,
        plLeaveBalance?.[0]?.remainingDays - 1
      );
      setFieldValue("toDate", toDate);
    } else {
      toast.warn("You don't have privileges to leave");
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employeeName: {
            value: location?.state?.employee?.value,
            label: location?.state?.employee?.label,
          },
          employeeInfo: location?.state?.employeeInfo,
          country: {
            value: location?.state?.country?.value,
            label: location?.state?.country?.label,
            code: location?.state?.country?.code,
            employeeInfoDesignation:
              location?.state?.country?.employeeInfoDesignation,
            employeeInfoDepartment:
              location?.state?.country?.employeeInfoDepartment,
            employeeBusinessUnit:
              location?.state?.country?.employeeBusinessUnit,
            routingNo: location?.state?.country?.routingNo,
          },
          district: {
            value: location?.state?.district?.value,
            label: location?.state?.district?.label,
            code: location?.state?.district?.code,
            employeeInfoDesignation:
              location?.state?.district?.employeeInfoDesignation,
            employeeInfoDepartment:
              location?.state?.district?.employeeInfoDepartment,
            employeeBusinessUnit:
              location?.state?.district?.employeeBusinessUnit,
            routingNo: location?.state?.district?.routingNo,
            leaveType: 1, // don't remove this, 1 = leave
          },
        }}
        validationSchema={
          selectedLeaveType === 0
            ? validationSchemaForMovement
            : validationSchema
        }
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          saveHandler(values, () => {
            let leaveType = values?.leaveType;
            resetForm(initData);
            setFieldValue("leaveType", leaveType);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              {console.log("values", values)}
              <div className="row">
                <div className="col-lg-6">
                  <div className="row bank-journal bank-journal-custom bj-left mr-1">
                    <div className="col-lg-6 mb-2">
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="leaveType"
                          checked={values?.leaveType === 1}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(e) => {
                            setFieldValue("fromTime", "");
                            setFieldValue("toTime", "");
                            setFieldValue("reasonType", "");
                            setLeaveTypeDDL([]);
                            if (values?.employeeName?.value) {
                              getLeaveTypeDDL(
                                1,
                                values?.employeeName?.value,
                                setLeaveTypeDDL
                              );
                            }
                            setFieldValue("leaveType", 1);
                            setSelectedLeaveType(1);
                          }}
                        />
                        Leave
                      </label>
                    </div>
                    <div className="col-lg-12"></div>
                    <div className="col-lg-4 mb-2">
                      {location?.state?.privacyType === "1" ? (
                        <>
                          <NewSelect
                            name="employeeName"
                            options={[]}
                            value={values?.employeeName}
                            label="Employee Name"
                            isDisabled={true}
                            placeholder="Employee"
                            errors={errors}
                            touched={touched}
                          />
                        </>
                      ) : (
                        <>
                          <label>Employee</label>
                          <SearchAsyncSelect
                            selectedValue={values?.employeeName}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {}}
                            loadOptions={loadUserList}
                            isDisabled={location?.state?.privacyType === "1"}
                          />
                        </>
                      )}
                    </div>
                    <div className="col-lg-4 mb-2">
                      <NewSelect
                        name="reasonType"
                        options={updateLeaveTypeDDL || []}
                        value={values?.reasonType}
                        label={
                          values?.leaveType === 1
                            ? "Leave Type"
                            : "Movement Type"
                        }
                        onChange={(valueOption) => {
                          setFieldValue("fromTime", "");
                          setFieldValue("toTime", "");
                          setFieldValue("reasonType", valueOption);
                          if (valueOption?.label === "Previledge Leave") {
                            setFieldValue("fromDate", "");
                            setFieldValue("toDate", "");
                          }
                        }}
                        placeholder="Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          values?.leaveType === 1 && !leaveSummaryRowDto?.length
                        }
                      />
                    </div>
                    {values?.leaveType === 0 && (
                      <div className="col-lg-4 mb-2">
                        <NewSelect
                          name="country"
                          options={countryDDL || []}
                          value={values?.country}
                          label="Country"
                          onChange={(valueOption) => {
                            setFieldValue("country", valueOption);
                          }}
                          placeholder="Country"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            values?.leaveType === 1 &&
                            !leaveSummaryRowDto?.length
                          }
                        />
                      </div>
                    )}
                    {values?.leaveType === 0 && (
                      <div className="col-lg-4 mb-2">
                        <NewSelect
                          name="district"
                          options={districtDDL || []}
                          value={values?.district}
                          label="District"
                          onChange={(valueOption) => {
                            setFieldValue("district", valueOption);
                          }}
                          placeholder="District"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            values?.leaveType === 1 &&
                            !leaveSummaryRowDto?.length
                          }
                        />
                      </div>
                    )}
                    <div className="col-lg-4 mb-2">
                      <div>From Date</div>
                      <InputField
                        className="trans-date cj-landing-date"
                        value={values?.fromDate}
                        name="fromDate"
                        onChange={(e) => {
                          if (
                            values?.reasonType?.label === "Previledge Leave"
                          ) {
                            plLeaveFromDateHandler(
                              setFieldValue,
                              e.target.value
                            );
                          } else {
                            setFieldValue("fromDate", e.target.value);
                          }
                        }}
                        type="date"
                        disabled={
                          values?.leaveType === 1 && !leaveSummaryRowDto?.length
                        }
                      />
                    </div>
                    {values?.reasonType?.value === 10 ||
                    values?.reasonType?.value === 8 ||
                    values?.leaveType === 0 ? (
                      <div className="col-lg-4 mb-2">
                        <label>From Time</label>
                        <InputField
                          value={values?.fromTime || ""}
                          name="fromTime"
                          placeholder="From Time"
                          type="time"
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="col-lg-4 mb-2">
                      <div>To Date</div>
                      <InputField
                        className="trans-date cj-landing-date"
                        value={values?.toDate}
                        name="toDate"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                        type="date"
                        min={values?.fromDate}
                        disabled={
                          (values?.leaveType === 1 &&
                            !leaveSummaryRowDto?.length) ||
                          values?.reasonType?.label === "Previledge Leave"
                        }
                      />
                    </div>

                    {values?.reasonType?.value === 10 ||
                    values?.reasonType?.value === 8 ||
                    values?.leaveType === 0 ? (
                      <div className="col-lg-4 mb-2">
                        <label>To Time</label>
                        <InputField
                          value={values?.toTime || ""}
                          name="toTime"
                          placeholder="To Time"
                          type="time"
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <div
                      className={
                        values?.leaveType === 1
                          ? "col-lg-8 mb-2"
                          : "col-lg-4 mb-2"
                      }
                    >
                      <label>Address</label>
                      <InputField
                        value={values?.address || ""}
                        name="address"
                        placeholder="Address"
                        type="text"
                        disabled={
                          values?.leaveType === 1 && !leaveSummaryRowDto?.length
                        }
                      />
                    </div>

                    <div className="col-lg-12 mb-2">
                      <label>Reason</label>
                      <InputField
                        value={values?.reason || ""}
                        name="reason"
                        placeholder="Reason"
                        type="text"
                        disabled={
                          values?.leaveType === 1 && !leaveSummaryRowDto?.length
                        }
                      />
                    </div>

                    {values?.leaveType === 1 && (
                      <div className="col-lg-4 mb-2">
                        <button
                          className="btn btn-primary mr-2 mt-2"
                          type="button"
                          onClick={() => setOpen(true)}
                          disabled={
                            values?.leaveType === 1 &&
                            !leaveSummaryRowDto?.length
                          }
                        >
                          Attachment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {values?.leaveType === 1 && (
                  <div className="col-lg-6">
                    <>
                      {loader && <Loading />}
                      <h6 className="my-2">Leave Summary</h6>
                      <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "120px" }}>Leave Type</th>
                            <th style={{ width: "50px" }}>Taken</th>
                            <th style={{ width: "50px" }}>Remaining</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaveSummaryRowDto?.map((td, index) => (
                            <tr key={index}>
                              <td>{td?.leaveType}</td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.leaveTakenDays}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {td?.remainingDays}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{td?.remarks}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </>
                  </div>
                )}
              </div>

              <ApplicationTable empId={values?.employeeName?.value} />

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  console.log("onSave", fileObjects);
                  setOpen(false);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
