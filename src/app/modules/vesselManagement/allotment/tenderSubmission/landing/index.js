import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getLetterHead } from "../../../../financialManagement/report/bankLetter/helper";
import {
  approveStatusDDL,
  businessPartnerDDL,
  fetchSubmittedTenderData,
} from "../helper";
import PrintBADCTender from "../print/printBADCTender";
import PrintBCICTender from "../print/printBCICTender";
import "../print/style.css";
import BADCTendersTable from "./badcTable";
import BCICTendersTable from "./bcicTable";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";

// const initData = {};

export default function TenderSubmissionLanding() {
  const history = useHistory();
  const printRef = useRef();

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
    setSubmittedTenderList,
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

  // const saveHandler = (values, cb) => { };

  // Handle tender print directly
  const handleTenderPrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        businessPartner: { value: 89497, label: "BCIC" },
        fromDate: _monthFirstDate(),
        toDate: _todayDate(),
        approveStatus: "",
      }}
      validationSchema={Yup.object({
        businessPartner: Yup.object({
          value: Yup.string().required("Select a status"),
          label: Yup.string().required("Select a status"),
        }).required("Select a business partner"),
        approveStatus: Yup.object({
          value: Yup.string().required("Select a status"),
          label: Yup.string().required("Select a status")
        }).required("Select a status"),
      })
      }
    // onSubmit={(values, { setSubmitting, resetForm }) => {
    //   saveHandler(values, () => {
    //     resetForm();
    //   });
    // }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        dirty,
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
                      setSubmittedTenderList([]);
                    }}
                  />
                </div>
                <FromDateToDateForm obj={{ setFieldValue, values }} />
                <div className="col-lg-3">
                  <NewSelect
                    name="approveStatus"
                    options={approveStatusDDL}
                    value={values?.approveStatus}
                    label="Approve Status"
                    onChange={(valueOption) => {
                      setFieldValue("approveStatus", valueOption);
                      setSubmittedTenderList([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="submit"
                    onClick={() => {
                      fetchSubmittedTenderData(
                        accountId,
                        buUnId,
                        values,
                        pageNo,
                        pageSize,
                        getSubmittedTenderLists
                      );
                    }}
                    disabled={!isValid || !dirty}
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Table of BCIC & BADC Tender  */}
              {values?.businessPartner?.label === "BCIC" ? (
                <BCICTendersTable
                  accountId={accountId}
                  buUnId={buUnId}
                  values={values}
                  submittedTenderLists={submittedTenderLists}
                  handleTenderPrint={handleTenderPrint}
                  getTenderDetails={getTenderDetails}
                />
              ) : (
                <BADCTendersTable
                  accountId={accountId}
                  buUnId={buUnId}
                  values={values}
                  submittedTenderLists={submittedTenderLists}
                  handleTenderPrint={handleTenderPrint}
                  getTenderDetails={getTenderDetails}
                />
              )}

              {/* Paginations of BCIC & BADC Tender  */}
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
                      {values?.businessPartner?.label === "BCIC" ? (
                        <PrintBCICTender tenderDetails={tenderDetails} />
                      ) : (
                        <PrintBADCTender tenderDetails={tenderDetails} />
                      )}
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
    </ Formik>
  );
}
