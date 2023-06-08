/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  getNewApplicationData,
  approveAll,
  getWorkplaceDDL_api,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { toast } from "react-toastify";
import { downloadFile } from "../../../../_helper/downloadFile";
import { IInput } from "../../../../_helper/_input";
import { _todayDate } from "../../../../_helper/_todayDate";
const initData = {
  viewAs: "",
  applicationType: "",
  workPlace: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const applicationTypeDDL = [
  { value: 1, label: "Pending Application" },
  { value: 2, label: "Approved Application" },
  { value: 3, label: "Rejected Application" },
];

const OvertimeRequisitionApprovalLanding = () => {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [allSelect, setAllSelect] = useState(false);
  const [workPlaceDDL, setWorkplaceDDL] = useState([]);

  useEffect(() => {
    getWorkplaceDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWorkplaceDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getDataForApproval = (values) => {
    getNewApplicationData(
      values?.viewAs?.value,
      values?.applicationType?.value,
      profileData?.employeeId,
      values?.workPlace?.value,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoader
    );
  };

  // // approveSubmitlHandler btn submit handler
  const approveRejectSubmitlHandler = (values, isApproved) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: () => {
        let data = [];
        rowDto.forEach((item) => {
          if (item?.isSelect) {
            let obj = {
              autoId: item?.intAutoId,
              employeeId: item?.intEmployeeId,
              approvedBy: profileData?.userId,
              isApproved: isApproved ? true : false,
              isRejected: isApproved ? false : true,
              adminTypeId: values?.viewAs?.value,
            };
            data.push(obj);
          }
        });
        if (data.length === 0) return toast.warn("Select atleast one row");
        approveAll(data, setLoader, () => {
          setAllSelect(false);
          getDataForApproval(values);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    const newRowData = rowDto?.map((item) => {
      return {
        ...item,
        isSelect: allSelect,
      };
    });
    setRowDto(newRowData);
  }, [allSelect]);

  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = [...rowDto];
    newRowDto[index].isSelect = value;
    setRowDto(newRowDto);
  };

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let overtimeRequisitionApprove = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 831) {
      overtimeRequisitionApprove = userRole[i];
    }
  }

  return (
    <>
      <ICustomCard title="Overtime Requisition Approval">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            setValues,
            isValid,
          }) => (
            <>
              {loader && <Loading />}
              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="viewAs"
                      options={[
                        { value: 1, label: "Supervisor" },
                        { value: 2, label: "Line Manager" },
                      ]}
                      value={values?.viewAs}
                      label="View As"
                      onChange={(valueOption) => {
                        setRowDto([]);
                        setFieldValue("viewAs", valueOption);
                      }}
                      placeholder="View As"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="applicationType"
                      options={applicationTypeDDL || []}
                      value={values?.applicationType}
                      label="Application Type"
                      onChange={(valueOption) => {
                        setRowDto([]);
                        setFieldValue("applicationType", valueOption);
                      }}
                      placeholder="Application Type"
                      isSearchable={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      options={workPlaceDDL}
                      label="Work Place"
                      placeholder="Work Place"
                      value={values?.workPlace}
                      onChange={(valueOption) => {
                        setFieldValue("workPlace", valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                    />
                  </div>
                  <div style={{ marginTop: "14px" }} className="ml-5">
                    <button
                      type="button"
                      className="btn btn-primary mr-1"
                      disabled={
                        !values?.applicationType ||
                        !values?.viewAs ||
                        !values?.workPlace?.label ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        setAllSelect(false);
                        getDataForApproval(values);
                      }}
                    >
                      View
                    </button>
                  </div>
                  <div style={{ marginTop: "14px" }} className="ml-4">
                    {rowDto?.length > 0 && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={(e) =>
                          downloadFile(
                            `/hcm/HCMOvertimeRequisition/GetOvertimeListForApproveDownload?adminTypeId=${values?.viewAs?.value}&viewTypeId=${values?.applicationType?.value}&employeeId=${profileData?.employeeId}&workplaceId=${values?.workPlace?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}`,
                            "Overtime Requisition Approval",
                            "xlsx"
                          )
                        }
                      >
                        Export Excel
                      </button>
                    )}
                  </div>
                  {values?.applicationType?.value === 1 &&
                    overtimeRequisitionApprove?.isCreate && (
                      <>
                        <div style={{ marginTop: "14px" }}>
                          <button
                            type="button"
                            className="btn btn-primary ml-4 mr-1"
                            onClick={() =>
                              approveRejectSubmitlHandler(values, true)
                            }
                            disabled={rowDto?.length === 0}
                          >
                            Approve
                          </button>
                        </div>
                        <div style={{ marginTop: "14px" }} className="ml-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                              approveRejectSubmitlHandler(values, false)
                            }
                            disabled={rowDto?.length === 0}
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    )}
                </div>
              </Form>
              {/* Table Start */}
              {rowDto?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        {values?.applicationType?.value === 1 && (
                          <th style={{ width: "20px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                setAllSelect(event.target.checked);
                              }}
                            />
                          </th>
                        )}
                        <th>Employee Name</th>
                        <th>Department</th>
                        <th>Cost Center</th>
                        <th>Workplace</th>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Time</th>
                        <th>OT Shift</th>
                        <th>Current Shift</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto?.map((data, index) => (
                          <tr key={index}>
                            {values?.applicationType?.value === 1 && (
                              <td>
                                <input
                                  id="isSelect"
                                  type="checkbox"
                                  value={data?.isSelect}
                                  checked={data?.isSelect}
                                  onChange={(e) => {
                                    singleCheckBoxHandler(
                                      e.target.checked,
                                      index
                                    );
                                  }}
                                />
                              </td>
                            )}
                            <td>{data?.strEmployeeName}</td>
                            <td>{data?.strRequestedDepartmentName}</td>
                            <td>{data?.strCostCenterName}</td>
                            <td>{data?.strWorkplaceName}</td>
                            <td className="text-center">
                              {_dateFormatter(data?.dteRequestedDate)}
                            </td>
                            <td>{data?.strReasonForOvertime}</td>
                            <td className="text-center">
                              {data?.strHoursMinute}
                            </td>
                            <td>{data?.strRequestedOtShiftName}</td>
                            <td>{data?.strCurrentShiftName}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default OvertimeRequisitionApprovalLanding;
