import { Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
   ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import "./style.css";
const html2pdf = require("html2pdf.js");
const initData = {
  negotiationRate: "",
};
export default function ShippingCsDetails() {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState([]);
  const location = useLocation();
  const [
    csDetailsList,
    getCsDetailsList,
    // eslint-disable-next-line no-unused-vars
    getLoading,
    setCsDetailsList,
  ] = useAxiosGet([]);
  const history = useHistory();

  const backHandler = () => {
    history.goBack();
  };
  const dispatch = useDispatch();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getCsDetailsList(
      `/procurement/ShipRequestForQuotation/GetComparativeStatementShipById?AccountId=${profileData?.accountId}&BusinessId=${selectedBusinessUnit?.value}&SBUId=80&RequestForQuatationId=${location?.state?.intRequestForQuotationId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const saveHandler = async (values, cb) => {};

  const getPercentageValue = (item) => {
    if (!item?.numDiscountPercentage) {
      return 0;
    }
    return (item?.numDiscountPercentage / 100) * (item?.sumValue || 0);
  };
  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 5,
        dpi: 300,
        letterRendering: true,
        padding: "50px",
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setCsDetailsList([]);
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Comparative Statement Details"}>
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={backHandler}
                    className={"btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      RFQ Code: {location?.state?.strRequestForQuotationCode}
                    </div>
                    <div className="col-lg-3">
                      RFQ Date:{" "}
                      {_dateFormatter(
                        location?.state?.dteRfqdate || location?.state?.rfqdate
                      )}
                    </div>
                    <div className="col-lg-3">
                      Currency:{" "}
                      {location?.state?.strCurrencyCode ||
                        location?.state?.currencyCode}
                    </div>
                    {/* <div className="col-lg-3">
                                 Payment Terms:{' '}
                                 {location?.state?.strPaymentTermsName}
                              </div>
                              <div className="col-lg-3">
                                 VAT/AIT: {location?.state?.strVatAti}
                              </div>
                              <div className="col-lg-3">
                                 Transport Cost:{' '}
                                 {location?.state?.strTransportCost}
                              </div> */}
                    <div className="col-lg-3">
                      Delivery Address:{" "}
                      {location?.state?.strDeliveryAddress ||
                        location?.state?.deliveryAddress}
                    </div>
                    <div className="col-lg-3">
                      Quotation Start Date:{" "}
                      {location?.state?.quotationStartDateTime
                        ? `${
                            location?.state?.quotationStartDateTime?.split(
                              "T"
                            )[0]
                          } / ${
                            location?.state?.quotationStartDateTime?.split(
                              "T"
                            )[1]
                          }`
                        : `${location?.state?.startDate?.split("T")[0]} / ${
                            location?.state?.startDate?.split("T")[1]
                          }`}
                    </div>
                    <div className="col-lg-3">
                      Quotation End Date:{" "}
                      {location?.state?.quotationEndDateTime
                        ? `${
                            location?.state?.quotationEndDateTime?.split("T")[0]
                          } / ${
                            location?.state?.quotationEndDateTime?.split("T")[1]
                          }`
                        : `${location?.state?.endDate?.split("T")[0]} / ${
                            location?.state?.endDate?.split("T")[1]
                          }`}
                    </div>
                    <div className="col-lg-3">
                      Status: {location?.state?.strStatus}
                    </div>
                    <div className="col-lg-3">
                      {csDetailsList?.objRow?.length > 0 && (
                        <>
                          <ReactHtmlTableToExcel
                            id="test-table-xls-button-att-reports"
                            className="btn btn-primary"
                            table="table-to-xlsx"
                            filename="CS_Details"
                            sheet="Sheet1"
                            buttonText="Export Excel"
                          />
                          <button
                            className="btn btn-primary ml-2"
                            type="button"
                            onClick={(e) =>
                              pdfExport("Comparative Statement Details Report")
                            }
                          >
                            Export PDF
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div id="pdf-section" className="row mt-3">
                  <div className="col-lg-12">
                    <div className="csDetailsTable employee-overall-status">
                      <div
                        style={{ maxHeight: "800px" }}
                        className="scroll-table _table"
                      >
                        <table
                          id="table-to-xlsx"
                          className="table table-striped table-bordered bj-table bj-table-landing"
                        >
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>SL</th>
                              <th style={{ width: "110px" }}>IMPA Code</th>
                              <th>Item Name</th>
                              {csDetailsList?.objRow?.[0]?.intItemCategoryId ===
                              624 ? (
                                <>
                                  <th>Part No</th>
                                  <th>Drawing No</th>
                                </>
                              ) : null}
                              <th style={{ width: "70px" }}>UOM</th>
                              <th style={{ width: "70px" }}>Quantity</th>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <th colSpan={4}>
                                      <div>{itm?.strBusinessPartnerName}</div>
                                    </th>
                                  </Fragment>
                                )
                              )}
                            </tr>
                            <tr>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              {csDetailsList?.objRow?.[0]?.intItemCategoryId ===
                              624 ? (
                                <>
                                  <th></th>
                                  <th></th>
                                </>
                              ) : null}
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <th>
                                      <div>{"Rate"}</div>
                                    </th>
                                    <th>
                                      <div>{"Total value"}</div>
                                    </th>
                                    <th>
                                      <div>{"Remarks"}</div>
                                    </th>
                                    <th>
                                      <div>{"Attachment"}</div>
                                    </th>
                                  </Fragment>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {csDetailsList?.objRow?.length > 0 &&
                              csDetailsList?.objRow?.map((item, index) => (
                                <Fragment key={index}>
                                  {(index === 0 || item.strShippingItemSubHead !== csDetailsList?.objRow[index - 1].strShippingItemSubHead) && item?.strShippingItemSubHead ? (
                                 <tr >
                                     <td colSpan={csDetailsList[0]?.objRow[0]?.intItemCategoryId === 624 ? `${(item?.objPartnerHeader?.length * 4) + 7}`  : `${(item?.objPartnerHeader?.length * 4) + 5}`}>
                                         <div style={{fontSize: '24', fontWeight:"bold"}} className="text-center">
                                             {item.strShippingItemSubHead}
                                         </div>
                                     </td>
                                 </tr>
                              ) : null}

                                
                                <tr
                                  style={{
                                    background: item?.color,
                                  }}
                                >
                                  <td>{index + 1}</td>
                                  <td>{item?.strItemCode || ""}</td>
                                  <td>{item?.strItemName}</td>
                                  {item?.intItemCategoryId === 624 ? (
                                    <>
                                      <td>{item?.strPartNo}</td>
                                      <td>{item?.strDrawingNo}</td>
                                    </>
                                  ) : null}
                                  <td>{item?.strUoMname}</td>
                                  <td>{item?.numRfqquantity}</td>
                                  {item?.objPartnerHeader?.map(
                                    (partnerData, ind) => (
                                      <Fragment key={ind}>
                                        <td className="text-right">
                                          {partnerData?.objPartnerRow
                                            ?.numNegotiationRate
                                            ? partnerData?.objPartnerRow
                                                ?.numNegotiationRate
                                            : partnerData?.objPartnerRow
                                                ?.numRate || ""}
                                        </td>
                                        <td className="text-right">
                                          {partnerData?.objPartnerRow
                                            ?.numTotalvalue
                                            ? partnerData?.objPartnerRow
                                                ?.numTotalvalue
                                            : ""}
                                        </td>
                                        <td>
                                          {partnerData?.objPartnerRow
                                            ?.strRemarks
                                            ? partnerData?.objPartnerRow
                                                ?.strRemarks
                                            : ""}
                                        </td>
                                        <td className="text-center">
                                          {partnerData?.objPartnerRow
                                            ?.strAttachment ? (
                                            <>
                                              <IView
                                                title={"Attachment"}
                                                classes={"text-primary"}
                                                clickHandler={() => {
                                                  dispatch(
                                                    getDownlloadFileView_Action(
                                                      partnerData?.objPartnerRow
                                                        ?.strAttachment
                                                    )
                                                  );
                                                }}
                                              />
                                            </>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                      </Fragment>
                                    )
                                  )}
                                </tr>
                                </Fragment>
                              ))}
                            <tr>
                              <td
                                colSpan={
                                  csDetailsList?.objRow?.[0]
                                    ?.intItemCategoryId === 624
                                    ? 7
                                    : 5
                                }
                                className="text-right font-weight-bold "
                                style={{ fontSize: "12px" }}
                              >
                                Sub Total
                              </td>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <td>{""}</td>
                                    <td
                                      className="text-right font-weight-bold "
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      {itm?.sumValue >0 ? (itm?.sumValue).toFixed(2) : ""} 
                                    </td>
                                    <td>{""}</td>
                                    <td>{""}</td>
                                  </Fragment>
                                )
                              )}
                            </tr>
                            <tr>
                              <td
                                colSpan={
                                  csDetailsList?.objRow?.[0]
                                    ?.intItemCategoryId === 624
                                    ? 7
                                    : 5
                                }
                                className="text-right font-weight-bold "
                                style={{ fontSize: "12px" }}
                              >
                                Discount Amount
                              </td>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <td>{""}</td>
                                    <td
                                      className="text-right font-weight-bold "
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                       {itm?.sumValue >0 ? `${getPercentageValue(itm).toFixed(
                                        2
                                      )} (${itm?.numDiscountPercentage}%)` : ""}
                                      
                                    </td>
                                    <td>{""}</td>
                                    <td>{""}</td>
                                  </Fragment>
                                )
                              )}
                            </tr>
                            <tr>
                              <td
                                colSpan={
                                  csDetailsList?.objRow?.[0]
                                    ?.intItemCategoryId === 624
                                    ? 7
                                    : 5
                                }
                                className="text-right font-weight-bold "
                                style={{ fontSize: "12px" }}
                              >
                                Total After Discount
                              </td>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <td>{""}</td>
                                    <td
                                      className="text-right font-weight-bold "
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >{itm?.sumValue >0 ? (
                                       (itm?.sumValue || 0) -
                                       (getPercentageValue(itm) || 0)
                                     ).toFixed(2) : ""}
                                     
                                    </td>
                                    <td>{""}</td>
                                    <td>{""}</td>
                                  </Fragment>
                                )
                              )}
                            </tr>
                            <tr>
                              <td
                                colSpan={
                                  csDetailsList?.objRow?.[0]
                                    ?.intItemCategoryId === 624
                                    ? 7
                                    : 5
                                }
                                className="text-right font-weight-bold "
                                style={{ fontSize: "12px" }}
                              >
                                Transportation
                              </td>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <td>{""}</td>
                                    <td
                                      className="text-right font-weight-bold "
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      {itm?.sumValue >0 ? itm?.numTransportCost : ""}
                                    </td>
                                    <td>{""}</td>
                                    <td>{""}</td>
                                  </Fragment>
                                )
                              )}
                            </tr>
                            <tr>
                              <td
                                colSpan={
                                  csDetailsList?.objRow?.[0]
                                    ?.intItemCategoryId === 624
                                    ? 7
                                    : 5
                                }
                                className="text-right font-weight-bold "
                                style={{ fontSize: "12px" }}
                              >
                                Other Cost
                              </td>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <td>{""}</td>
                                    <td
                                      className="text-right font-weight-bold "
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      {itm?.sumValue >0 ? itm?.numOthersCost:""}
                                    </td>
                                    <td>{""}</td>
                                    <td>{""}</td>
                                  </Fragment>
                                )
                              )}
                            </tr>
                            <tr>
                              <td
                                colSpan={
                                  csDetailsList?.objRow?.[0]
                                    ?.intItemCategoryId === 624
                                    ? 7
                                    : 5
                                }
                                className="text-right font-weight-bold "
                                style={{ fontSize: "12px" }}
                              >
                                Grand Total
                              </td>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <td>{""}</td>
                                    <td
                                      className="text-right font-weight-bold "
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      {itm?.sumValue >0 ? (
                                        (itm?.sumValue || 0) -
                                        (getPercentageValue(itm) || 0) +
                                        (itm.numTransportCost || 0) +
                                        (itm.numOthersCost || 0)
                                      ).toFixed(2) : ""}
                                    </td>
                                    <td>{""}</td>
                                    <td>{""}</td>
                                  </Fragment>
                                )
                              )}
                            </tr>
                            <tr>
                              <td
                                colSpan={
                                  csDetailsList?.objRow?.[0]
                                    ?.intItemCategoryId === 624
                                    ? 7
                                    : 5
                                }
                                className="text-right font-weight-bold "
                                style={{ fontSize: "12px" }}
                              >
                                Remarks
                              </td>
                              {csDetailsList?.objPartnerHead?.map(
                                (itm, index) => (
                                  <Fragment key={index}>
                                    <td
                                      colSpan={4}
                                      className=" "
                                      style={{
                                        fontSize: "12px",
                                      }}
                                    >
                                      {itm?.strRemarks}
                                    </td>
                                  </Fragment>
                                )
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
