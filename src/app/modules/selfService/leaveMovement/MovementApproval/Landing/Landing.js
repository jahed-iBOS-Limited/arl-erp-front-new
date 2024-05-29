import React, { useState, useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  approveSelected,
  getNewApplicationData,
  getWorkplaceGroupDDL,
} from "../helper";
import IConfirmModal from "../../../../_helper/_confirmModal";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";

const initData = {
  busUnit: { value: 0, label: "All" },
  workPlace: { value: 0, label: "All" },
  viewAs: "",
  applicationType: "",
};

const applicationTypeDDL = [
  { value: 1, label: "Pending Application" },
  { value: 2, label: "Approved Application" },
  { value: 3, label: "Rejected Application" },
];

const MovementApprovalLanding = () => {
  const [newApplicationData, setNewApplicationData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  const [workPlaceDDL, setWorkPlaceDDL] = useState([]);
  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // eslint-disable-next-line no-unused-vars
  const params = useParams();

  useEffect(() => {
    if (profileData?.accountId) {
      getWorkplaceGroupDDL(profileData?.accountId, setWorkPlaceDDL);
    }
  }, [profileData]);

  useEffect(() => {
    if (newApplicationData?.length > 0) {
      setRowDto(
        newApplicationData?.map((itm) => ({
          ...itm,
          itemCheck: false,
        }))
      );
    } else {
      setRowDto([]);
    }
  }, [newApplicationData]);

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
    // btn hide conditon
    const bllSubmitBtn = copyRowDto.some((itm) => itm.itemCheck === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };
  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = rowDto?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
    // btn hide conditon
    const bllSubmitBtn = modifyGridData.some((itm) => itm.itemCheck === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected approve submit`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.filter((item) => item?.itemCheck);
        const payload = filterSelectedData?.map((item) => {
          return {
            applicationId: item?.intId,
            employeeId: item?.intEmployeeId,
            ysnApproved: true,
            ysnRejected: false,
            approvedBy: profileData?.userId,
            adminTypeId: values?.viewAs?.value,
          };
        });
        approveSelected(payload, () => {
          getNewApplicationData(
            values?.busUnit?.value,
            values?.workPlace?.value,
            values?.viewAs?.value,
            values?.applicationType?.value,
            profileData?.employeeId,
            setNewApplicationData,
            setLoader
          );
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
    //
  };

  // rejectedSubmitlHandler btn submit handler
  const rejectedSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected approve submit`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.filter((item) => item?.itemCheck);
        const payload = filterSelectedData?.map((item) => {
          return {
            applicationId: item?.intId,
            employeeId: item?.intEmployeeId,
            ysnApproved: false,
            ysnRejected: true,
            approvedBy: profileData?.userId,
            adminTypeId: values?.viewAs?.value,
          };
        });
        approveSelected(payload, () => {
          getNewApplicationData(
            values?.busUnit?.value,
            values?.workPlace?.value,
            values?.viewAs?.value,
            values?.applicationType?.value,
            profileData?.employeeId,
            setNewApplicationData,
            setLoader
          );
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
    //
  };
  return (
    <>
      <ICustomCard title="Movement Approval">
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
                      <div className="row">
                        <div className="col-lg-2 mb-2">
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
                        <div className="col-lg-2 mb-2">
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
                        <div className="col-lg-2">
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
                        <div className="col-lg-2">
                          <NewSelect
                            name="applicationType"
                            options={applicationTypeDDL || []}
                            value={values?.applicationType}
                            label="Application Type"
                            onChange={(valueOption) => {
                              setNewApplicationData([]);
                              setFieldValue("applicationType", valueOption);
                            }}
                            placeholder="Application Type"
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div style={{ marginTop: "19px" }} className="col-lg-1">
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={
                              !values?.applicationType ||
                              !values?.viewAs ||
                              !values?.busUnit ||
                              !values?.workPlace
                            }
                            onClick={() => {
                              getNewApplicationData(
                                values?.busUnit?.value,
                                values?.workPlace?.value,
                                values?.viewAs?.value,
                                values?.applicationType?.value,
                                profileData?.employeeId,
                                setNewApplicationData,
                                setLoader
                              );
                            }}
                          >
                            View
                          </button>
                        </div>
                        {values?.applicationType?.value === 1 && (
                          <div className="col d-flex align-items-center justify-content-end mt-2">
                            <button
                              type="button"
                              className="btn btn-primary mr-1"
                              onClick={() => approveSubmitlHandler(values)}
                              disabled={billSubmitBtn}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => rejectedSubmitlHandler(values)}
                              disabled={billSubmitBtn}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
              {/* Table Start */}
              {newApplicationData?.length > 0 && (
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
                              allGridCheck(event.target.checked);
                            }}
                          />
                        </th>
                      )}

                      <th>SL</th>
                      <th style={{ width: "150px" }}>Name</th>
                      <th style={{ width: "70px" }}>From Date</th>
                      <th style={{ width: "70px" }}>To Date</th>
                      <th style={{ width: "70px" }}>From Time</th>
                      <th style={{ width: "70px" }}>To Time</th>
                      <th style={{ width: "100px" }}>Movement Type</th>
                      <th style={{ width: "40px" }}>Total Days</th>
                      <th style={{ width: "120px" }}>Address</th>
                      <th>Reason</th>
                      
                      {/* {values?.applicationType?.value === 1 ? (
                        <th>Actions</th>
                      ) : null} */}
                    </tr>
                  </thead>
                  <tbody>
                    {newApplicationData?.length > 0 &&
                      rowDto?.map((data, index) => (
                        <tr key={index}>
                          {values?.applicationType?.value === 1 && (
                            <td>
                              <input
                                id="itemCheck"
                                type="checkbox"
                                className=""
                                value={data.itemCheck}
                                checked={data.itemCheck}
                                name={data.itemCheck}
                                onChange={(e) => {
                                  itemSlectedHandler(e.target.checked, index);
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
                            <div className="text-center pr-2">
                              {_dateFormatter(data?.dteStartDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center pr-2">
                              {_dateFormatter(data?.dteEndDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center pr-2">
                              {data?.tmStart
                                ? _timeFormatter(data?.tmStart)
                                : ""}
                            </div>
                          </td>
                          <td>
                            <div className="text-center pr-2">
                              {data?.tmEnd ? _timeFormatter(data?.tmEnd) : ""}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{data?.strMoveType}</div>
                          </td>
                          <td>
                            <div className="text-center pr-2">
                              {data?.intTotalDays}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{data?.strAddress}</div>
                          </td>
                          <td>
                            <div className="pl-2">{data?.strReason}</div>
                          </td>
                          {/* {values?.applicationType?.value === 1 && (
                            <td>
                              <div className="d-flex justify-content-center">
                                <span
                                  className="view mr-5"
                                  style={{ cursor: "pointer" }}
                                >
                                  <ICheckout
                                    checkout={() => {
                                      singleLeaveApproveHandler(
                                        data?.id,
                                        data?.id,
                                        profileData?.accountId,
                                        "true",
                                        "false",
                                        values
                                      );
                                    }}
                                    id={data?.applicationId}
                                    title="Approve"
                                  />
                                </span>
                                <IReject
                                  remover={() => {
                                    singleLeaveApproveHandler(
                                      data?.id,
                                      data?.id,
                                      profileData?.accountId,
                                      "false",
                                      "true",
                                      values
                                    );
                                  }}
                                  id={data?.applicationId}
                                  title="Rejected"
                                />
                              </div>
                            </td>
                          )} */}
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

export default MovementApprovalLanding;
