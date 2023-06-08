/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "./../../../../_helper/loader/_loader";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useHistory } from "react-router-dom";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "./viewForm"
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png"
import ICustomTable from "../../../../_helper/_customTable";
import { getDataById } from "../_redux/Actions";


let imageObj = {
  8: iMarineIcon
}

let ths = [
  "SL",
  "Item Code",
  "Item Name",
  "UoM",
  "Purchase Description",
  "Reference No.",
  "Ref. Qty.",
  "RFQ Qty.",
];

let thsTwo = ["RFQ Date", "Validity", "Currency"];

let thsThree = [
  "SL",
  "Supplier Name",
  "Address",
  "Email",
  "Contact Number",
  "Action"
];

const initData = {};
const validationSchema = Yup.object().shape({});

export function TableRow({ prId }) {
  const [loading, setLoading] = useState(false);
  const [purchaseReport, setPurchaseReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);


  // console.log(purchaseReport)

  // const profileData = useSelector((state) => {
  //   return state.authData.profileData;
  // }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatch = useDispatch();

  // get single data from store
  const singleData = useSelector((state) => {
    return state?.rfq?.singleData[0];
  }, shallowEqual);

  // users selected ddl
  const usersDDL = useSelector((state) => {
    return state.rfq.userSelectedDDLData;
  }, shallowEqual);

  useEffect(() => {
    if (prId && selectedBusinessUnit.value && profileData.accountId) {
      dispatch(getDataById(prId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, prId, usersDDL]);

  const printRef = useRef();
  const history = useHistory();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [toMail, settoMail] = useState("");


  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            {/* <ReactToPrint
              pageStyle='@page { size: 8in 12in landscape !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className="btn btn-primary">
                   <img
                            style={{ width: "25px", paddingRight: "5px" }}
                            src={printIcon}
                            alt="print-icon"
                          /> 
                          Print
                </button>
              )}
              content={() => printRef.current}
            /> */}
            <ReactToPrint
              pageStyle='@page { size: 8in 12in landscape !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className="btn btn-primary ml-2">
                  PDF
                </button>
              )}
              content={() => printRef.current}
            />
            {/* <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary ml-2"
              table="table-to-xlsx"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Excel"
            /> */}

            <button
              type="button"
              onClick={() => history.goBack()}
              className="btn btn-secondary back-btn ml-2"
            >
              <i className="fa fa-arrow-left mr-1"></i>
                    Back
                  </button>
          </>
        )}
      >

        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
          }}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className="">
                  <div ref={printRef} className="print_wrapper">
                    <div className="m-3" >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {selectedBusinessUnit.value === 8 && <img style={{ width: "150px", height: "100px" }} class="" src={imageObj[selectedBusinessUnit?.value]} alt="img" />}
                            {/* imageObj[selectedBusinessUnit?.value] */}
                          </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <h3>{singleData?.objHeader?.businessUnitName}</h3>
                          <h6>
                            {singleData?.objHeader?.warehouseName}
                          </h6>
                          <h4>Request for Quotation</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className="my-3">
                        Request for Quotation Code: <span className="font-weight-bold mr-2">{singleData?.objHeader?.requestForQuotationCode}</span>
                      </div>

                      <ICustomTable ths={thsTwo}>
                        <tr>
                          <td> {singleData?.objHeader?.dteRfqdate} </td>
                          <td> {singleData?.objHeader?.validTillDate} </td>
                          <td> {singleData?.objHeader?.currencyCode} </td>
                        </tr>
                      </ICustomTable>

                      {/* Modal Grid */}
                      <ICustomTable ths={ths}>
                        {singleData?.objRow?.map((td, index) => {
                          return (
                            <tr>
                              <td> {index + 1} </td>
                              <td> {td?.itemCode} </td>
                              <td> {td?.itemName} </td>
                              <td> {td?.uoMname} </td>
                              <td> {td?.description} </td>
                              <td> {td?.referenceId} </td>
                              <td> {td?.referenceQuantity} </td>
                              <td> {td?.reqquantity} </td>
                            </tr>
                          );
                        })}
                      </ICustomTable>
                    </div>
                    </div>
                    {/* Modal third section */}
                    <h3 style={{ fontSize: "1.35rem", marginTop: "3px" }}>
                      Add Supplier For Send REQ/RFI/RFP
                         </h3>
                    <ICustomTable ths={thsThree}>
                      {singleData?.objSuplier?.map((td, index) => {
                        return (
                          <tr>
                            <td> {index + 1} </td>
                            <td> {td?.businessPartnerName} </td>
                            <td> {td?.businessPartnerAddress} </td>
                            <td> {td?.email} </td>
                            <td> {td?.contactNumber} </td>
                            <td className="text-center"><button
                              type="button"
                              onClick={() => {
                                setIsShowModal(true)
                                setSubject(`Request for Quotation Code: ${singleData?.objHeader?.requestForQuotationCode}`)
                                setMessage(`Dear 
                                       A Request for Quotation has been sent from  Request for Quotation Code: ${singleData?.objHeader?.requestForQuotationCode}
                                   Please Take the necessary action`)
                                settoMail(td?.email)
                              }}
                              className="btn btn-primary back-btn ml-2"
                            >
                              Mail
                  </button></td>
                          </tr>
                        );
                      })}
                    </ICustomTable>
            

                  <div>
                    <IViewModal
                      title="Send Email"
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewForm
                        subject={subject}
                        setSubject={setSubject}
                        message={message}
                        setMessage={setMessage}
                        toMail={toMail}
                        settoMail={settoMail}
                      // currentIndex={currentIndex}
                      // currentRowData={currentRowData}
                      // setRowDto={setRowDto}
                      // rowDto={rowDto}
                      // values={values}
                      // setIsShowModal={setIsShowModal}
                      />
                    </IViewModal>
                  </div>
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
