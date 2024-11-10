/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getNewApplicationData, approveAll } from "./helper";
import PaginationTable from "../../../../_helper/_tablePagination";
import Loading from "../../../../_helper/_loading";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import NewSelect from "../../../../_helper/_select";

const initData = {
  applicationType: "",
};

const applicationTypeDDL = [
  { value: 1, label: "Approved Application" },
  { value: 2, label: "Rejected Application" },
  { value: 3, label: "Pending Application" },
];

const GetPassApproval = () => {
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const [newApplicationData, setNewApplicationData] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  const [loader, setLoader] = useState(false);

  const [allSelect, setAllSelect] = useState(false);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getNewApplicationData(
      profileData?.userReferenceId,
      values?.applicationType?.value,
      pageNo,
      pageSize,
      setNewApplicationData,
      setLoader
    );
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (newApplicationData?.data?.length > 0) {
      setRowDto({
        data: newApplicationData?.data?.map((itm) => ({
          ...itm,
          isSelect: false,
        })),
        totalCount: newApplicationData?.totalCount,
        currentPage: newApplicationData?.currentPage,
        pageSize: newApplicationData?.pageSize,
      });
    } else {
      setRowDto([]);
    }
  }, [newApplicationData]);

  // // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: async () => {
        const filterData = rowDto?.data?.filter((item) => item?.isSelect);
        if (filterData?.length === 0) {
          toast.warning("Please Select One");
        } else {
          const payload = filterData?.map((item) => {
            return {
              leaveApplicationId: item?.applicationId,
              dateApprovedFrom: item?.appliedFromDate,
              dateApprovedTo: item?.appliedToDate,
              payStatus: "approved",
              approvedStatus: "Y",
              approvedBy: profileData?.userId,
            };
          });
          approveAll(payload, setLoader, () => {
            setAllSelect(false);
            getNewApplicationData(
              profileData?.userReferenceId,
              values?.applicationType?.value,
              pageNo,
              pageSize,
              setNewApplicationData,
              setLoader
            );
          });
        }
        setBillSubmitBtn(true);
      },
      noAlertFunc: () => {
        history.push("/personal/approval/commonapproval");
      },
    };
    IConfirmModal(confirmObject);
  };

  // RejectedSubmitlHandler btn submit handler
  const rejectedSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: async () => {
        const filterData = rowDto?.data?.filter((item) => item?.isSelect);
        if (filterData?.length === 0) {
          toast.warning("Please Select One");
        } else {
          const payload = filterData?.map((item) => {
            return {
              leaveApplicationId: item?.applicationId,
              dateApprovedFrom: item?.appliedFromDate,
              dateApprovedTo: item?.appliedToDate,
              payStatus: "rejected",
              approvedStatus: "R",
              approvedBy: profileData?.userId,
            };
          });
          approveAll(payload, setLoader, () => {
            setAllSelect(false);
            getNewApplicationData(
              profileData?.userReferenceId,
              values?.applicationType?.value,
              pageNo,
              pageSize,
              setNewApplicationData,
              setLoader
            );
          });
        }
        setBillSubmitBtn(true);
      },
      noAlertFunc: () => {
        history.push("/personal/approval/commonapproval");
      },
    };
    IConfirmModal(confirmObject);
    //
  };

  useEffect(() => {
    getNewApplicationData(
      profileData?.userReferenceId,
      1, // Hardcode for pending
      pageNo,
      pageSize,
      setNewApplicationData,
      setLoader
    );
  }, [profileData?.userReferenceId]);

  useEffect(() => {
    if (!allSelect) {
      const newRowData = rowDto?.data?.map((item) => {
        return {
          ...item,
          isSelect: false,
        };
      });
      setRowDto({
        ...rowDto,
        data: newRowData,
      });
    } else {
      const newRowData = rowDto?.data?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setRowDto({
        ...rowDto,
        data: newRowData,
      });
    }
  }, [allSelect]);

  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = rowDto?.data;
    newRowDto[index].isSelect = value;
    setRowDto({
      ...rowDto,
      data: newRowDto,
    });
    const bllSubmitBtn = newRowDto.some((itm) => itm.isSelect === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  return (
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
          <Form className='form form-label-right'>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='global-form'>
                  <div className='row d-flex justify-content-between'>
                    <div className='col-lg-9'>
                      <div className='row'>
                        <div className='col-lg-4'>
                          <NewSelect
                            name='applicationType'
                            options={applicationTypeDDL || []}
                            value={values?.applicationType}
                            label='Application Type'
                            onChange={(valueOption) => {
                              setNewApplicationData([]);
                              setFieldValue("applicationType", valueOption);

                              setAllSelect(false);
                              getNewApplicationData(
                                profileData?.userReferenceId,
                                valueOption?.value,
                                pageNo,
                                pageSize,
                                setNewApplicationData,
                                setLoader
                              );
                            }}
                            placeholder='Application Type'
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {/* <div className="col-lg-1 mt-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!values?.applicationType}
                            onClick={() => {
                              setAllSelect(false);
                              getNewApplicationData(
                                profileData?.userReferenceId,
                                values?.applicationType?.value,
                                pageNo,
                                pageSize,
                                setNewApplicationData,
                                setLoader
                              );
                            }}
                          >
                            View
                          </button>
                        </div> */}
                      </div>
                    </div>
                    {values?.applicationType?.value === 3 && (
                      <>
                        <div className='col-lg-3 mt-4 d-flex justify-content-end'>
                          <button
                            type='button'
                            className='btn btn-primary mr-1'
                            onClick={() => approveSubmitlHandler(values)}
                            disabled={billSubmitBtn}
                          >
                            Approve
                          </button>
                          <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() => rejectedSubmitlHandler(values)}
                            disabled={billSubmitBtn}
                          >
                            Rejected
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
          {/* Table Start */}
          {newApplicationData?.data?.length > 0 && (
            <div className='table-responsive'>
              <table className='table table-striped table-bordered bj-table bj-table-landing'>
                <thead>
                  <tr>
                    {values?.applicationType?.value === 2 && (
                      <th style={{ width: "20px" }}>
                        <input
                          type='checkbox'
                          id='parent'
                          onChange={(event) => {
                            setAllSelect(event.target.checked);
                            setBillSubmitBtn((data) => !data);
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
                    <th>Total Consumed Days</th>
                    <th>Attachment</th>
                    {/* {values?.applicationType?.value === 1 && (
                          <th>Actions</th>
                        )} */}
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.data?.length > 0 &&
                    rowDto?.data?.map((data, index) => (
                      <tr key={index}>
                        {values?.applicationType?.value === 1 && (
                          <td>
                            <input
                              id='isSelect'
                              type='checkbox'
                              value={data?.isSelect}
                              checked={data?.isSelect}
                              onChange={(e) => {
                                singleCheckBoxHandler(e.target.checked, index);
                              }}
                            />
                          </td>
                        )}
                        <td>{index + 1}</td>
                        <td>
                          <div className='pl-2'>{data?.employeeName}</div>
                        </td>
                        <td>
                          <div className='text-center'>
                            {_dateFormatter(data?.appliedFromDate)}
                          </div>
                        </td>
                        <td>
                          <div className='text-center'>
                            {_dateFormatter(data?.appliedToDate)}
                          </div>
                        </td>
                        <td>
                          <div className='text-left pl-2'>
                            {data?.leaveType}
                          </div>
                        </td>
                        <td>
                          <div className='text-center'>{data?.totalDays}</div>
                        </td>
                        <td>
                          <div className='text-center'>
                            {data?.totalLeaveConsumedDays}
                          </div>
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <div className='d-flex justify-content-center'>
                            {data?.strDocumentFile && (
                              <IView
                                clickHandler={() => {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      data?.strDocumentFile
                                    )
                                  );
                                }}
                              />
                            )}
                          </div>
                        </td>
                        {/* {values?.applicationType?.value === 1 && (
                              <td>
                                <div className="d-flex justify-content-center">
                                  <span
                                    className="view mr-2"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <ICheckout
                                      checkout={() => {
                                        singleLeaveApproveHandler(
                                          data?.applicationId,
                                          data?.applicationId,
                                          _dateFormatter(data?.appliedFromDate),
                                          _dateFormatter(data?.appliedToDate),
                                          1,
                                          "Y",
                                          profileData?.userReferenceId,
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
                                        data?.applicationId,
                                        data?.applicationId,
                                        _dateFormatter(data?.appliedFromDate),
                                        _dateFormatter(data?.appliedToDate),
                                        0,
                                        "R",
                                        profileData?.userReferenceId,
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
          {rowDto?.data?.length > 0 && (
            <PaginationTable
              count={rowDto?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              values={values}
            />
          )}
        </>
      )}
    </Formik>
  );
};

export default GetPassApproval;
