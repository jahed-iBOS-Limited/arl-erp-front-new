/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  getNewApplicationData,
  approveAll,
  getLeaveTypeDDL,
  approveLeavePLForchangeReq,
  getWorkplaceGroupDDL,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import IView from "./../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { toast } from "react-toastify";
const initData = {
  busUnit: { value: 0, label: "All" },
  workPlace: { value: 0, label: "All" },
  viewAs: "",
  applicationType: "",
  leaveType: { value: 0, label: "All" },
  plChangeStatus: "",
};

const applicationTypeDDL = [
  { value: 1, label: "Pending Application" },
  { value: 2, label: "Approved Application" },
  { value: 3, label: "Rejected Application" },
];

const LeaveApprovalLanding = () => {
  const [rowDto, setRowDto] = useState([]);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [workPlaceDDL, setWorkPlaceDDL] = useState([]);

  const { profileData, businessUnitList } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [loader, setLoader] = useState(false);
  const [allSelect, setAllSelect] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileData?.accountId) {
      // 1 = leave type DDL
      // 0  = Movement type DDL
      getLeaveTypeDDL(1, profileData?.accountId, setLeaveTypeDDL);
      getWorkplaceGroupDDL(profileData?.accountId, setWorkPlaceDDL);
    }
  }, [profileData]);

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure to approved?",
      yesAlertFunc: async () => {
        const filterData = rowDto?.filter((item) => item?.isSelect);
        if (filterData?.length === 0) {
          toast.warning("Please Select One");
        } else {
          const payload = filterData?.map((item) => {
            return {
              applicationId: item?.intApplicationId,
              employeeId: item?.intEmployeeId,
              approvedBy: profileData?.userId,
              isApproved: true,
              isRejected: false,
              isPayable: true,
              adminTypeId: values?.viewAs?.value,
            };
          });
          let payloadForChangeReq = filterData?.map((item) => ({
            //             IF(@intPart = 1) -- PL Date Change Request
            //              ELSE IF(@intPart = 2) -- Approved By Suppervisor
            //              ELSE IF(@intPart = 3) -- Approved By Linemanager
            partId: values?.viewAs?.value + 1,
            employeeId: item?.intEmployeeId,
            leaveApplicationId: item?.intApplicationId,
            requestDate: item?.dteRequestDate,
            insertBy: profileData?.userId,
            plDateChangeReqId: item?.intPldateChangeReqId,
            remarks: item?.strRemarks || "",
          }));

          const cb = () => {
            getNewApplicationData(
              values?.busUnit?.value,
              values?.workPlace?.value,
              values?.plChangeStatus,
              values?.leaveType?.value,
              values?.viewAs?.value,
              values?.applicationType?.value,
              profileData?.employeeId,
              setRowDto,
              setLoader
            );
          };
          if (values?.plChangeStatus) {
            approveLeavePLForchangeReq(payloadForChangeReq, setLoader, cb);
          } else {
            approveAll(payload, setLoader, () => {
              setAllSelect(false);
              cb();
            });
          }
        }
      },
      noAlertFunc: () => {
      
      },
    };
    IConfirmModal(confirmObject);
  };

  // rejectedSubmitlHandler btn submit handler
  const rejectedSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure to reject?",
      yesAlertFunc: async () => {
        let data = [];
        let isPreviledgeFound = false;

        for (const item of rowDto) {
          if (item?.isSelect) {
            // check if previledge found
            if (
              item?.intLeaveTypeId === 7 ||
              item?.strLeaveType === "Previledge Leave" ||
              item?.strLeaveType === "Privilege Leave"
            ) {
              isPreviledgeFound = true;
            }

            let obj = {
              applicationId: item?.intApplicationId,
              employeeId: item?.intEmployeeId,
              approvedBy: profileData?.userId,
              isApproved: false,
              isRejected: true,
              isPayable: true,
              adminTypeId: values?.viewAs?.value,
            };
            data.push(obj);
          }
        }

        if (isPreviledgeFound)
          return toast.warning(
            `Please deselect "Privilege Leave" to reject. "Privilege Leave" can't be rejected.`
          );

        if (data?.length < 1) return toast.warning("Please Select One");

        approveAll(data, setLoader, () => {
          setAllSelect(false);
          getNewApplicationData(
            values?.busUnit?.value,
            values?.workPlace?.value,
            values?.plChangeStatus,
            values?.leaveType?.value,
            values?.viewAs?.value,
            values?.applicationType?.value,
            profileData?.employeeId,
            setRowDto,
            setLoader
          );
        });
      },
      noAlertFunc: () => {
        
      },
    };
    IConfirmModal(confirmObject);
    //
  };

  useEffect(() => {
    if (!allSelect) {
      const newRowData = rowDto?.map((item) => {
        return {
          ...item,
          isSelect: false,
        };
      });
      setRowDto(newRowData);
    } else {
      const newRowData = rowDto?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setRowDto(newRowData);
    }
  }, [allSelect]);

  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = [...rowDto];
    newRowDto[index].isSelect = value;
    setRowDto(newRowDto);
  };

  return (
    <>
      <ICustomCard title="Leave Approval">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          // validationSchema={validationSchema}
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
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row d-flex justify-content-between">
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="col-lg-3 mb-2">
                              <NewSelect
                                name="busUnit"
                                options={
                                  [
                                    { value: 0, label: "All" },
                                    ...businessUnitList,
                                  ] || []
                                }
                                value={values?.busUnit}
                                label="Business Unit"
                                onChange={(valueOption) => {
                                  setFieldValue("busUnit", valueOption);
                                }}
                                placeholder="Business Unit"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3 mb-2">
                              <NewSelect
                                name="workPlace"
                                options={workPlaceDDL || []}
                                value={values?.workPlace}
                                label="Work Place Group"
                                onChange={(valueOption) => {
                                  setFieldValue("workPlace", valueOption);
                                }}
                                placeholder="Work Place Group"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3 mb-2">
                              <NewSelect
                                name="viewAs"
                                options={[
                                  { value: 1, label: "Supervisor" },
                                  { value: 2, label: "Line Manager" },
                                ]}
                                value={values?.viewAs}
                                label="View As"
                                onChange={(valueOption) => {
                                  setFieldValue("viewAs", valueOption);
                                }}
                                placeholder="View As"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3 mb-2">
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
                                isDisabled={values?.plChangeStatus}
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3 mb-2">
                              <NewSelect
                                name="leaveType"
                                options={leaveTypeDDL || []}
                                value={values?.leaveType}
                                label="Leave Type"
                                onChange={(valueOption) => {
                                  setFieldValue("leaveType", valueOption);
                                }}
                                placeholder="Leave Type"
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                                isDisabled={values?.plChangeStatus}
                              />
                            </div>
                            <div
                              className="col-lg-4 d-flex mb-2"
                              style={{ marginTop: "14px" }}
                            >
                              <span className="d-flex">
                                <input
                                  style={{ width: "15px", height: "15px" }}
                                  name="plChangeStatus"
                                  checked={values?.plChangeStatus}
                                  className="form-control mr-3"
                                  type="checkbox"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "plChangeStatus",
                                      e.target.checked
                                    );
                                    setRowDto([]);
                                    setFieldValue("leaveType", {
                                      value: 0,
                                      label: "All",
                                    });
                                    setFieldValue("applicationType", {
                                      value: 1,
                                      label: "Pending Application",
                                    });
                                  }}
                                />
                                <label>PL Change Request</label>
                              </span>
                              <button
                                type="button"
                                className="btn btn-primary ml-2"
                                onClick={() => {
                                  setAllSelect(false);
                                  getNewApplicationData(
                                    values?.busUnit?.value,
                                    values?.workPlace?.value,
                                    values?.plChangeStatus,
                                    values?.leaveType?.value,
                                    values?.viewAs?.value,
                                    values?.applicationType?.value,
                                    profileData?.employeeId,
                                    setRowDto,
                                    setLoader
                                  );
                                }}
                                disabled={
                                  !values?.applicationType ||
                                  !values?.viewAs ||
                                  !values?.leaveType ||
                                  !values?.busUnit ||
                                  !values?.workPlace
                                }
                              >
                                View
                              </button>
                            </div>
                            {values?.applicationType?.value === 1 && (
                              <>
                                <div className="col d-flex align-items-center justify-content-end mt-2">
                                  <button
                                    type="button"
                                    className="btn btn-primary mr-1"
                                    onClick={() =>
                                      approveSubmitlHandler(values)
                                    }
                                    disabled={rowDto?.length === 0}
                                  >
                                    Approve
                                  </button>
                                  {!values?.plChangeStatus && (
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() =>
                                        rejectedSubmitlHandler(values)
                                      }
                                      disabled={rowDto?.length === 0}
                                    >
                                      Reject
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        <th>SL</th>
                        <th>Name</th>
                        <th>
                          {values?.plChangeStatus
                            ? "Previous From Date"
                            : "From Date"}
                        </th>
                        <th>
                          {values?.plChangeStatus
                            ? "Previous To Date"
                            : "To Date"}
                        </th>
                        {values?.plChangeStatus && (
                          <>
                            <th>Request From Date</th>
                            <th>Request To Date</th>
                          </>
                        )}
                        <th>Leave Type</th>
                        <th>Total Consume Days (Leave Type)</th>
                        <th>Total Consume Days (All Leave Type)</th>
                        <th>Total Days</th>
                        {values?.plChangeStatus && <th>Remarks</th>}
                        <th>Attachment</th>
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
                            <td>{index + 1}</td>
                            <td>
                              <div className="pl-2">
                                {data?.strEmployeeFullName}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(data?.dteAppliedFromDate)}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(data?.dteAppliedToDate)}
                              </div>
                            </td>
                            {values?.plChangeStatus && (
                              <>
                                <td>
                                  <div className="text-center">
                                    {_dateFormatter(data?.dteRequestDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {_dateFormatter(data?.dteRequestToDate)}
                                  </div>
                                </td>
                              </>
                            )}
                            <td>
                              <div className="text-left pl-2">
                                {data?.strLeaveType}
                              </div>
                            </td>
                            <td>
                              <div className="text-center pl-2">
                                {data?.intTotalConsumeLeave}
                              </div>
                            </td>
                            <td>
                              <div className="text-center pl-2">
                                {data?.intAllTypeLeaveConsume}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {data?.intTotalAppliedDays}
                              </div>
                            </td>
                            {values?.plChangeStatus && (
                              <td>
                                <div className="text-center">
                                  {data?.strRemarks}
                                </div>
                              </td>
                            )}
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "center",
                              }}
                            >
                              <div className="d-flex justify-content-center">
                                {data?.strDocumentFile ? (
                                  <IView
                                    clickHandler={() => {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          data?.strDocumentFile
                                        )
                                      );
                                    }}
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </div>
                            </td>
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

export default LeaveApprovalLanding;
