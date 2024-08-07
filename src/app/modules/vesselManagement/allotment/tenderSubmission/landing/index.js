import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import IForm from "../../../../_helper/_form";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { getLetterHead } from "../../../../financialManagement/report/bankLetter/helper";
import Print from "../print/printTender";
import "../print/style.css";
import NewSelect from "../../../../_helper/_select";
import { businessPartnerDDL, fetchSubmittedTenderData } from "../helper";
import * as Yup from 'yup'

// const initData = {};

export default function TenderSubmissionLanding() {
  const history = useHistory();
  const printRef = useRef();
  const dispatch = useDispatch();
  const {
    profileData: { accountId },
    selectedBusinessUnit: { value: buUnId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [
    submittedTenderLists,
    getSubmittedTenderLists,
    getSubmittedTenderLoading,
  ] = useAxiosGet();
  const [
    tenderDetails,
    getTenderDetails,
    getTenderDetailsLoading,
  ] = useAxiosGet();

  useEffect(() => {
    // Fetch sumitted tender data
    // fetchSubmittedTenderData(pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set paginations
  const setPositionHandler = (pageNo, pageSize) => {
    fetchSubmittedTenderData(pageNo, pageSize);
  };

  const saveHandler = (values, cb) => { };

  // Handle tender print directly
  const handleTenderPrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  // Async await approch for fetch details along with print page view
  // const fetchTenderDetails = async (tenderId,) => {
  //     const url = `/tms/TenderSubmission/GetTenderSubmissionById?AccountId=${accountId}&BusinessUnitId=${buUnId}8&TenderId=${tenderId}`
  //     const response = await getTenderDetails(url)
  //     return response
  // }

  // Callback approch for fetch details along with print page view
  const fetchTenderDetailsCallback = (tenderId, callback) => {
    const url = `/tms/TenderSubmission/GetTenderSubmissionById?AccountId=${accountId}&BusinessUnitId=${buUnId}&TenderId=${tenderId}`;
    getTenderDetails(url, () => {
      callback();
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        businessPartner: ""
      }}
      validationSchema={Yup.object({
        businessPartner: Yup.string().required("Select a business partner")
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
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
          {(getSubmittedTenderLoading || getTenderDetailsLoading) && (
            <Loading />
          )}
          <IForm
            title="Tender Submission"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/vessel-management/allotment/tendersubmission/entry"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessPartner"
                    options={businessPartnerDDL}
                    value={values?.businessPartner}
                    label="Business Partner"
                    onChange={(valueOption) => {
                      setFieldValue("businessPartner", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      fetchSubmittedTenderData(accountId, buUnId, values, pageNo, pageSize, getSubmittedTenderLists)
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table
                  id="table-to-xlsx"
                  className={
                    "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table"
                  }
                >
                  <thead>
                    <tr className="cursor-pointer">
                      <th>SL</th>
                      <th style={{ width: "150px" }}>Business Partner</th>
                      <th>Enquiry No</th>
                      <th>Item Name</th>
                      <th>Load Port</th>
                      <th>Discharge Port</th>
                      <th style={{ width: "150px" }}>Foreign Price (USD)</th>
                      <th style={{ width: "150px" }}>Total Qty</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedTenderLists?.data?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "40px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>{item?.businessPartnerName}</td>
                          <td>{item?.enquiryNo}</td>
                          <td>{item?.itemName}</td>
                          <td style={{ width: "200px" }}>
                            {item?.loadPortName}
                          </td>
                          <td style={{ width: "200px" }}>
                            {item?.dischargePortName}
                          </td>
                          <td className="text-right" style={{ width: "70px" }}>
                            {item?.foreignPriceUsd}
                          </td>
                          <td className="text-right" style={{ width: "70px" }}>
                            {item?.totalQty}
                          </td>
                          <td style={{ width: "70px" }}>
                            {item?.isAccept === null || item?.isAccept === false
                              ? "No"
                              : "Approved"}
                          </td>
                          <td style={{ width: "80px" }} className="text-center">
                            <div className="d-flex justify-content-around">
                              <span>
                                <IEdit
                                  onClick={() => {
                                    history.push({
                                      pathname: `/vessel-management/allotment/tendersubmission/edit/${item?.tenderId}`,
                                      state: item,
                                    });
                                    // setShow(true);
                                  }}
                                // id={item?.shiptoPartnerId}
                                />
                              </span>
                              <span
                                // 1st approch
                                // onClick={() => {
                                //     fetchTenderDetails(item?.tenderId)
                                //     handleTenderPrint()
                                // }}
                                // 2nd approch
                                onClick={() => {
                                  fetchTenderDetailsCallback(
                                    item?.tenderId,
                                    handleTenderPrint
                                  );
                                }}
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">Print</Tooltip>
                                  }
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    class="fa fa-print cursor-pointer"
                                    aria-hidden="true"
                                  ></i>
                                </OverlayTrigger>
                              </span>
                              {item?.attachment && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.attachment
                                      )
                                    );
                                  }}
                                >
                                  <ICon title={`View Attachment`}>
                                    <i class="far fa-file-image"></i>
                                  </ICon>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {submittedTenderLists?.data?.length > 0 && (
                <PaginationTable
                  count={submittedTenderLists?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
            </Form>

            <div ref={printRef} className="tender-print-preview">
              <div style={{ margin: "-13px 0 51px 0" }}>
                <table>
                  <thead>
                    <div
                      className="invoice-header"
                      style={{
                        backgroundImage: `url(${getLetterHead({
                          buId: buUnId,
                        })})`,
                        backgroundRepeat: "no-repeat",
                        height: "150px",
                        backgroundPosition: "left 10px",
                        backgroundSize: "cover",
                        // position: "fixed",
                        width: "100%",
                        top: "-60px",
                      }}
                    ></div>
                  </thead>
                  {/* CONTENT GOES HERE */}
                  <tbody>
                    <div style={{ margin: "40px 75px 0 75px" }}>
                      <Print tenderDetails={tenderDetails} />
                    </div>
                  </tbody>
                  <tfoot>
                    <div
                      className="ifoot"
                      style={{
                        backgroundImage: `url(${getLetterHead({
                          buId: buUnId,
                        })})`,
                        backgroundRepeat: "no-repeat",
                        height: "100px",
                        backgroundPosition: "left bottom",
                        backgroundSize: "cover",
                        bottom: "-25px",
                        position: "fixed",
                        width: "100%",
                      }}
                    ></div>
                  </tfoot>
                </table>
              </div>
            </div>
          </IForm>
        </>
      )}
    </Formik>
  );
}
