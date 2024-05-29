/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { approveSelected, getNewApplicationData } from "./helper";
import IConfirmModal from "../../../../_helper/_confirmModal";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  applicationType: "",
};

const applicationTypeDDL = [
  { value: 1, label: "Pending Application" },
  { value: 2, label: "Approved Application" },
  { value: 3, label: "Rejected Application" },
];

const MovementApprovalGrid = () => {
  const history = useHistory();
  const [newApplicationData, setNewApplicationData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // eslint-disable-next-line no-unused-vars
  const params = useParams();

  const setPositionHandler = (pageNo, pageSize, values) => {
    getNewApplicationData(
      values?.applicationType?.value,
      values?.employee?.value || profileData?.userReferenceId,
      setNewApplicationData,
      pageNo,
      pageSize,
      setLoader
    );
  };

  useEffect(() => {
    if (newApplicationData?.data?.length > 0) {
      setRowDto(
        newApplicationData?.data?.map((itm) => ({
          ...itm,
          itemCheck: false,
        }))
      );
    } else {
      setRowDto([]);
    }
  }, [newApplicationData]);

  useEffect(() => {
    getNewApplicationData(
      1,
      profileData?.userReferenceId,
      pageNo,
      pageSize,
      setNewApplicationData,
      setLoader
    );
  }, [profileData?.userReferenceId]);

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
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.filter((item) => item?.itemCheck);
        const payload = filterSelectedData?.map((item) => {
          return {
            applicationId: +item?.id,
            userID: profileData?.userId,
            approved: true,
            rejected: false,
          };
        });
        approveSelected(payload, () => {
          getNewApplicationData(
            values?.applicationType?.value,
            values?.employee?.value || profileData?.userReferenceId,
            pageNo,
            pageSize,
            setNewApplicationData,
            setLoader
          );
        });
        setBillSubmitBtn(true);
      },
      noAlertFunc: () => {
        history.push("/personal/approval/commonapproval");
      },
    };
    IConfirmModal(confirmObject);
    //
  };

  // rejectedSubmitlHandler btn submit handler
  const rejectedSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.filter((item) => item?.itemCheck);
        const payload = filterSelectedData?.map((item) => {
          return {
            applicationId: +item?.id,
            userID: profileData?.userId,
            approved: false,
            rejected: true,
          };
        });
        approveSelected(payload, () => {
          getNewApplicationData(
            values?.applicationType?.value,
            values?.employee?.value || profileData?.userReferenceId,
            pageNo,
            pageSize,
            setNewApplicationData,
            setLoader
          );
        });
        setBillSubmitBtn(true);
      },
      noAlertFunc: () => {
        history.push("/personal/approval/commonapproval");
      },
    };
    IConfirmModal(confirmObject);
    //
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          applicationType: { value: 1, label: "Pending Application" },
        }}
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
                      <div className="col-lg-3">
                        <NewSelect
                          name="applicationType"
                          options={applicationTypeDDL || []}
                          value={values?.applicationType}
                          label="Application Type"
                          onChange={(valueOption) => {
                            setNewApplicationData([]);
                            setFieldValue("applicationType", valueOption);

                            getNewApplicationData(
                              valueOption?.value,
                              values?.employee?.value ||
                                profileData?.userReferenceId,
                              pageNo,
                              pageSize,
                              setNewApplicationData,
                              setLoader
                            );
                          }}
                          placeholder="Application Type"
                          isSearchable={true}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4 mt-4">
                        {/* <button
                          type="button"
                          className="btn btn-primary"
                          disabled={!values?.applicationType}
                          onClick={() => {
                            getNewApplicationData(
                              values?.applicationType?.value,
                              values?.employee?.value ||
                                profileData?.userReferenceId,
                              pageNo,
                              pageSize,
                              setNewApplicationData,
                              setLoader
                            );
                          }}
                        >
                          View
                        </button> */}
                      </div>
                      {values?.applicationType?.value === 1 && (
                        <div className="col-lg-3 mt-4 offset-2 d-flex justify-content-end">
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
                            Rejected
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            {newApplicationData?.data?.length > 0 && (
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
                    <th>Name</th>
                    <th>From-Date</th>
                    <th>To-Date</th>
                    <th>Leave Type</th>
                    <th>Total Days</th>
                    {/* {values?.applicationType?.value === 1 ? (
                        <th>Actions</th>
                      ) : null} */}
                  </tr>
                </thead>
                <tbody>
                  {newApplicationData?.data?.length > 0 &&
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
                          <div className="pl-2">{data?.employeeName}</div>
                        </td>
                        <td>
                          <div className="text-center pr-2">
                            {_dateFormatter(data?.startDate)}
                          </div>
                        </td>
                        <td>
                          <div className="text-center pr-2">
                            {_dateFormatter(data?.endDate)}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">{data.moveType}</div>
                        </td>
                        <td>
                          <div className="text-center pr-2">
                            {data.totalDays}
                          </div>
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
            {newApplicationData?.data?.length > 0 && (
              <PaginationTable
                count={newApplicationData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
              />
            )}
          </>
        )}
      </Formik>
    </>
  );
};

export default MovementApprovalGrid;
