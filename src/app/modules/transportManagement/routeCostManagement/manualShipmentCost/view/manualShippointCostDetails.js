
import { Formik, Form as FormikForm } from "formik";
import React, { useEffect, useRef } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
// const html2pdf = require("html2pdf.js");



const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function ManualShippointCostDetails({ currentItem, isHiddenBackBtn, valuesfordate }) {
  const [manualShippointCostDetails, getManualShippointCostDetails] = useAxiosGet()

  const {shippointId, vehicleId  } = currentItem

  // eslint-disable-next-line no-unused-vars
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // eslint-disable-next-line no-unused-vars
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
      getManualShippointCostDetails(
         `/tms/ShipmentStandardCost/ManualShipmentCostDetails?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&shipPointId=${shippointId}&FromDate=${valuesfordate?.fromDate || ""}&ToDate=${valuesfordate?.toDate || ""}&isBillSubmited=${false}&intVehicleId=${vehicleId}`,
      );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippointId, vehicleId, profileData, selectedBusinessUnit]);


  const printRef = useRef();
  const history = useHistory();

  //const emailReceiverList = rfqDetailsData[0]?.objSuplier?.map((itm) => (itm?.strEmail))

  

//   Dear Sir,

// Please find the request for quotation:  

// To enter the quotation, please go to the link

//   const pdfExport = (fileName) => {
//     var element = document.getElementById("pdf-section");
//     var opt = {
//       margin: 1,
//       filename: `${fileName}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: {
//         scale: 5,
//         dpi: 300,
//         letterRendering: true,
//         scrollX: 0,
//         scrollY: 0,
//       },
//       jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "p" },
//     };
//     html2pdf()
//       .set(opt)
//       .from(element)
//       .save();
//   };

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => (
                <button className="btn btn-primary">
                  {/* <img
                style={{ width: "25px", paddingRight: "5px" }}
                src={printIcon}
                alt="print-icon"
              /> */}
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
            {/* <ReactToPrint
              pageStyle='@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className="btn btn-primary ml-2">
                  PDF
                </button>
              )}
              content={() => printRef.current}
            /> */}
            {/* <button
              className="btn btn-primary ml-2"
              onClick={(e) =>
                pdfExport(
                  `${rfqDetailsData[0]?.objHeader?.strRequestForQuotationCode}`
                )
              }
            >
              PDF
            </button> */}
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary ml-2"
              table="table-to-xlsx"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Export Excel"
            />
            {/* <button
              type="button"
              onClick={() => setIsShowModal(true)}
              className="btn btn-primary back-btn ml-2"
            >
              Mail
            </button> */}
            {!isHiddenBackBtn && (
              <button
                type="button"
                onClick={() => history.goBack()}
                className="btn btn-secondary back-btn ml-2"
              >
                <i className="fa fa-arrow-left mr-1"></i>
                Back
              </button>
            )}
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              <FormikForm>
                <div id="pdf-section">
                  <div className="mx-5">
                    <div ref={printRef}>
                      <div className="d-flex justify-content-between align-items-center ship-report">
                        <div></div>

                        <div>
                          {/* <div>
                            <img
                              style={{
                                // width: "100%",
                                height: "70px",
                                margin: "0 auto",
                                marginTop: "25px",
                              }}
                              src={akijShippingLogo}
                              alt={"Akij Shipping Logo"}
                            />
                          </div> */}
                          {/* <h6>{rfqDetailsData[0]?.objHeader?.billToAddress}</h6> */}
                          {/* <h4 className=" text-center">
                            {"Manual Shipment Cost Details"}
                          </h4> */}
                        </div>
                        <div></div>
                      </div>

                      {/* <table
                        className="global-table table mt-5 mb-5"
                        id="table-to-xlsx"
                      >
                        <thead className="tableHead"></thead>
                        <tbody className="tableHead">
                          <tr>
                            <td className="text-left">RFQ Code:</td>
                            <td>
                              {rfqDetailsData[0]?.objHeader?.strRequestForQuotationCode}
                            </td>
                            <td>RFQ Date:</td>
                            <td>
                              {_dateFormatter(
                               rfqDetailsData[0]?.objHeader?.dteRfqdate
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Currency:</td>
                            <td>
                              {rfqDetailsData[0]?.objHeader?.strCurrencyCode}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Quotation Start Date:</td>
                            <td>
                              {
                                _dateFormatter(rfqDetailsData[0]?.objHeader?.quotationStartDateTime)
                              }
                            </td>
                            <td>Quotation End Date:</td>
                            <td>
                              {_dateFormatter(rfqDetailsData[0]?.objHeader?.quotationEndDateTime)}
                            </td>
                          </tr>
                        </tbody>
                      </table> */}
                    <div className="table-responsive">
                    <table
                        className="global-table table py-5 report-container"
                        id="table-to-xlsx"
                      >
                        <thead className="tableHead">
                          <tr>
                            <th>SL.</th>
                            <th>Vehicle No</th>
                            <th>Driver Name</th>
                            <th>Route</th>
                            <th>Bill Submit Date</th>
                            <th>Bill Submit By</th>
                            <th>Bill Entry Type Name</th>
                            <th>Shipment Date</th>
                            <th>Shipment Code</th>
                            <th>Net Payable</th>
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {manualShippointCostDetails?.data?.map(
                            (data, i) => (
                              <>
                                <tr key={i}>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.vehicleNo}</td>
                                  <td>{data?.driverName}</td>
                                  <td>{data?.routeName}</td>
                                  <td className="">
                                    {_dateFormatter(data?.billSubmitDate)}
                                  </td>
                                  <td className="">
                                    {data?.billSubmitBy}
                                  </td>
                                  <td >{data?.billEntryTypeName}</td>
                                  <td >{_dateFormatter(data?.shipmentDate)}</td>
                                  <td >{data?.shipmentCode}</td>
                                  <td >{data?.netPayable}</td>
                                </tr>
                              </>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    </div>
                  </div>
                  <div>
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
