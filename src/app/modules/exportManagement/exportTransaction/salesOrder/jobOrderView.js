import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import essentialLogo from "./assets/essentialLogo.png";
const initData = {};
export default function JobOrderView({ salesQuotationId }) {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const saveHandler = (values, cb) => {};
  const printRef = useRef();
  const [
    jobOrderData,
    getJobOrderData,
    jobOrderLoader,
    setJobOrderData,
  ] = useAxiosGet();
  useEffect(() => {
    if (salesQuotationId) {
      getJobOrderData(
        `/oms/SalesQuotation/ViewForeignSalesQuotation?QuotationId=${salesQuotationId}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
        (data) => {
          setJobOrderData(data?.Data);
        }
      );
    }
  }, [salesQuotationId]);

  const totalFOBValue = (soRow, type) => {
    const totalCTN = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalCarton || 0),
      0
    );
    const totalPCS = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalPieces || 0),
      0
    );
    if (type === 1) {
      return totalCTN;
    }
    if (type === 2) {
      return _formatMoney(totalPCS);
    }
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
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
          {jobOrderLoader && <Loading />}
          <IForm
            title=""
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important;margin-top: 2cm ! important;}}"
                    }
                    trigger={() => (
                      <button type="button" className="btn btn-primary ml-3">
                        <i class="fa fa-print pointer" aria-hidden="true"></i>
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              );
            }}
          >
            <Form>
              <div componentRef={printRef} ref={printRef}>
                <img
                  style={{ width: "130px", height: "60px" }}
                  src={essentialLogo}
                  alt="logo"
                />
                <table
                  id="sales-contract-print"
                  className="table text-center table-striped table-bordered global-table"
                >
                  <tr className="text-center">
                    <td className="font-weight-bold" colSpan={13}>
                      <h1>Job Order</h1>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold text-start" colSpan={4}>
                      Order NO: {jobOrderData?.HeaderData?.SalesContractNo}
                    </td>
                    <td className="font-weight-bold" rowSpan={3} colSpan={5}>
                      Exporter: {jobOrderData?.HeaderData?.BusinessUnitName}
                    </td>
                    <td className="font-weight-bold" rowSpan={3} colSpan={5}>
                      Importer Name:
                      {jobOrderData?.HeaderData?.SoldToPartnerName}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold text-start" colSpan={4}>
                      Country: {jobOrderData?.HeaderData?.FinalDestination}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold text-start" colSpan={4}>
                      Order Date:{" "}
                      {_dateFormatter(jobOrderData?.HeaderData?.PricingDate)}
                    </td>
                  </tr>
                  <thead>
                    <tr>
                      <th className="text-center">Sl</th>
                      <th>PRODUCT NAME</th>
                      <th>PACKING SIZE</th>
                      <th>PCS IN CTN</th>
                      <th>ORDER QUANTITY IN CTN</th>
                      <th>ORDER QUANTITY IN PCS</th>
                      <th>PACKING DETAILS</th>
                      <th>MFG DATE ENGLISH</th>
                      <th>BEST BEFORE</th>
                      <th>SELF LIFE</th>
                      <th>NET WEIGHT MANUAL</th>
                      <th>SAMPLE FOR FOREIGN CUSTOMER</th>
                      <th>SAMPLE FOR BD CUSTOMER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobOrderData?.RowData?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.ItemName.toUpperCase()}</td>
                        <td>
                          {item?.Headings?.length > 0
                            ? `${item?.Headings[0]?.HeaderValue}`
                            : ""}
                        </td>
                        <td>
                          {" "}
                          {item?.Headings?.length > 0
                            ? `${item?.Headings[1]?.HeaderValue}`
                            : ""}
                        </td>
                        <td>{item?.TotalCarton ? item?.TotalCarton : "0"}</td>
                        <td>{item?.TotalPieces ? item?.TotalPieces : "0"}</td>
                        <td>
                          {item?.PackingDetails ? item?.PackingDetails : "-"}
                        </td>
                        <td>
                          {item?.MfgDate ? _dateFormatter(item?.MfgDate) : "-"}
                        </td>
                        <td>
                          {item?.MfgDate ? _dateFormatter(item?.MfgDate) : "-"}
                        </td>
                        <td>
                          {item?.SelfLife ? `${item?.SelfLife} Months` : "-"}
                        </td>
                        <td>
                          {item?.NetWeightManual
                            ? `${item?.NetWeightManual}`
                            : "-"}
                        </td>
                        <td>
                          {item?.ForeignCustomsSample
                            ? item?.ForeignCustomsSample
                            : "-"}
                        </td>
                        <td>
                          {item?.BdCustomsSample ? item?.BdCustomsSample : "-"}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colSpan={6} style={{ backgroundColor: "yellow" }}>
                        ENGLISH CODING
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td> <td>{totalFOBValue(jobOrderData, 1)}</td>
                      <td>{totalFOBValue(jobOrderData, 2)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-5">
                  <h6>
                    {jobOrderData?.JobOrderReq?.length > 0 &&
                      "Order Execution Requirements"}
                  </h6>
                  <ol>
                    {jobOrderData?.JobOrderReq?.length > 0
                      ? jobOrderData?.JobOrderReq?.map((item, index) => (
                          <li key={index}>{item?.OrderRequirement}</li>
                        ))
                      : null}
                  </ol>
                </div>
                <div className="row">
                  {/* <div className="col-lg-5" style={{ border: "1px solid black" }}>
                    <h5 style={{backgroundColor:"yellow"}}>CODING MATTER:</h5>
                    <ol>
                      <li>NET WEIGHT : {"117"}</li>
                      <li>BEST BEFORE : {"117"}</li>
                      <li>BATCH NO : {"117"}</li>
                      <li className="mt-5">
                        IMP BY : <span>SUPER FRESH DISTRIBUTION INC</span>
                        <br />
                        <span>FDA NO: 15839748978, NY-11368, USA.</span>
                      </li>
                    </ol>
                  </div> */}
                  <div
                    style={{ border: "1px solid black",width:"45%",padding:"10px",margin:"10px"}}
                  >
                    <h5 style={{ backgroundColor: "yellow" }}>
                      SHIPPING MARKS:
                    </h5>
                    <span style={{ fontWeight: "bold" }}>
                      Imported & Distributed by:
                    </span>
                    <span>{jobOrderData?.HeaderData?.SoldToPartnerName}</span>
                    <br />
                    <span>
                      FDA NO: {jobOrderData?.HeaderData?.SalesContractNo}
                    </span>
                    <br />
                    <span>
                      {jobOrderData?.HeaderData?.SoldToPartnerAddress}
                    </span>
                    <br />
                    <span style={{ fontWeight: "bold" }}>
                      NET CONTENT : KG X PCS
                    </span>
                    <br />
                    <span>
                      EXP DATE:{" "}
                      {_dateFormatter(
                        jobOrderData?.HeaderData?.QuotationEndDate
                      )}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    gap: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  className="mt-40"
                >
                  <p>PREPARED BY</p>
                  <p>CHECKED BY</p>
                  <p>Approval</p>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
