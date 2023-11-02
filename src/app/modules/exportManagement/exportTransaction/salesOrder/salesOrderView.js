/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { convertNumberToWords } from "../../../_helper/_convertMoneyToWord";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import essentialLogo from "./assets/essentialLogo.png";
const initData = {};

export default function SalesOrderView({ salesQuotationId }) {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const [
    salesOrderData,
    getSalesOrderData,
    salesOrderLoader,
    setSalesOrderData,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const printRef = useRef();

  //  const getItemByQuotationId = (salesQuotationId) => {

  //  }

  useEffect(() => {
    if (salesQuotationId) {
      getSalesOrderData(
        `/oms/SalesQuotation/ViewForeignSalesQuotation?QuotationId=${salesQuotationId}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
        (data) => {
          setSalesOrderData(data.Data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, salesQuotationId]);

  const totalFOBValue = (soRow, type) => {
    const totalCTN = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalCarton || 0),
      0
    );
    const totalPCS = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalPieces || 0),
      0
    );
    const totalFOBRatePCSBDT = soRow?.RowData?.reduce(
      (a, b) => a + (b?.FobRatePerPieceBDT || 0),
      0
    );
    const totalFOBAmountBDT = soRow?.RowData?.reduce(
      (a, b) => a + (b?.TotalFobAmountBDT || 0),
      0
    );

    const totalCNFValue =
      totalFOBAmountBDT + soRow?.HeaderData?.FreightAmountBDT;

    if (type === 1) {
      return totalCTN;
    }
    if (type === 2) {
      return _formatMoney(totalPCS);
    }
    if (type === 3) {
      return _formatMoney(totalFOBRatePCSBDT);
    }
    if (type === 4) {
      return _formatMoney(totalFOBAmountBDT);
    }
    if (type === 5) {
      return _formatMoney(totalCNFValue);
    }
    if (type === 6) {
      return totalCNFValue;
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
          {salesOrderLoader && <Loading />}
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
                  className="table table-striped table-bordered global-table"
                >
                  <tr className="text-center">
                    <td
                      className="font-weight-bold"
                      colSpan={salesOrderData?.Head?.length + 7}
                    >
                      <h1>Sales Order</h1>
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.floor(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      SALES CONTRACT NO:
                      {salesOrderData?.HeaderData?.SalesContractNo.toUpperCase()}{" "}
                      DATE:{" "}
                      {_dateFormatter(salesOrderData?.HeaderData?.PricingDate)}
                    </td>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.ceil(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      SALES TERM:{" "}
                      {salesOrderData?.HeaderData?.SalesTerm.toUpperCase()}{" "}
                      Country Of Origin:{" "}
                      {salesOrderData?.HeaderData?.CountryOfOrigin.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.floor(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      EXPORTER/SUPPLIER:
                    </td>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.ceil(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      IMPORTER/CONSIGNEE:
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.floor(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      {salesOrderData?.HeaderData?.BusinessUnitName.toUpperCase()}
                      <br />
                      {salesOrderData?.HeaderData?.BusinessUnitAddress.toUpperCase()}
                    </td>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.ceil(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      {salesOrderData?.HeaderData?.SoldToPartnerName.toUpperCase()}
                      <br />
                      {salesOrderData?.HeaderData?.SoldToPartnerAddress.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.floor(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      BENIFICIARY BANK:
                    </td>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.ceil(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      MODE OF SHIPMENT:{" "}
                      {salesOrderData?.HeaderData?.ModeofShipment.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.floor(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      ISLAMI BANK BANGLADESH LIMITED <br />
                      HEAD OFFICE COMPLEX BRANCH <br />
                      40 DILKUSHA C/A, DHAKA-1000, BANGLADESH. <br />
                      ACCOUNT NO: 20502130100248815, SWIFT CODE NO: IBBLBDDH213
                    </td>
                    <td
                      className="font-weight-bold"
                      colSpan={Math.ceil(
                        (salesOrderData?.Head?.length + 7) / 2
                      )}
                    >
                      PLACE OF LOADING:{" "}
                      {salesOrderData?.HeaderData?.SalesOfficeName?.toUpperCase()}{" "}
                      <br />
                      PORT OF DISCHARGE:{" "}
                      {salesOrderData?.HeaderData?.PortofDishcharge?.toUpperCase()}{" "}
                      <br />
                      DESTINATION COUNTRY:{" "}
                      {salesOrderData?.HeaderData?.ToCountryName?.toUpperCase()}{" "}
                      <br />
                      FINAL DESTINATION:{" "}
                      {salesOrderData?.HeaderData?.FinalDestination?.toUpperCase()}{" "}
                      <br />
                      ERC NO:{" "}
                      {salesOrderData?.HeaderData?.ExPortRegNo?.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-center">Sl</th>
                    <th>PRODUCT CODE</th>
                    <th>DESCRIPTION OF GOODS</th>
                    <th>PACKING SIZE</th>
                    {salesOrderData?.Head?.map((item, index) => {
                      return <th>{item?.HeaderName.toUpperCase()}</th>;
                    })}
                    <th>TOTAL PCS</th>
                    <th>FOB RATE PCS BDT</th>
                    <th>TOTAL AMOUNT FOB BDT</th>
                  </tr>
                  {salesOrderData.RowData?.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item?.ItemCode.toUpperCase()}</td>
                      <td>{item?.ItemName.toUpperCase()}</td>
                      <td>{item?.PackingDetails.toUpperCase()}</td>
                      {item?.Headings?.map((itm, index) => (
                        <td>{itm?.HeaderValue}</td>
                      ))}
                      <td>{item?.TotalPieces}</td>
                      <td className="text-right">
                        {item?.FobRatePerPieceBDT
                          ? _formatMoney(item?.FobRatePerPieceBDT)
                          : ""}
                      </td>
                      <td className="text-right">
                        {item?.TotalFobAmountBDT
                          ? _formatMoney(item?.TotalFobAmountBDT)
                          : ""}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      className="font-weight-bold text-center"
                      colSpan={salesOrderData?.Head?.length + 3}
                    >
                      TOTAL FOB VALUE
                    </td>
                    <td>{totalFOBValue(salesOrderData, 1)}</td>
                    <td className="text-right font-weight-bold">
                      {totalFOBValue(salesOrderData, 2)}
                    </td>
                    <td>{""}</td>
                    <td className="text-right font-weight-bold">
                      {totalFOBValue(salesOrderData, 4)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold text-center"
                      colSpan={salesOrderData?.Head?.length + 6}
                    >
                      FREIGHT
                    </td>
                    <td className="text-right">
                      {salesOrderData?.HeaderData?.FreightAmountBDT
                        ? _formatMoney(
                            salesOrderData?.HeaderData?.FreightAmountBDT
                          )
                        : ""}
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="font-weight-bold text-center"
                      colSpan={salesOrderData?.Head?.length + 6}
                    >
                      TOTAL CNF VALUE
                    </td>
                    <td className="text-right">
                      {totalFOBValue(salesOrderData, 5)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="font-weight-bold"
                      colSpan={salesOrderData?.Head?.length + 7}
                    >
                      TOTAL AMOUNT (BDT):{" "}
                      {convertNumberToWords(
                        totalFOBValue(salesOrderData, 6)
                      )?.toUpperCase()}{" "}
                      TAKA
                    </td>
                  </tr>

                  {/* t&c */}
                  {/* <tr>
                                        <td className="font-weight-bold" colSpan={salesOrderData?.Head?.length + 6}>
                                            <strong>TERMS & CONDITIONS</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-weight-bold" colSpan={salesOrderData?.Head?.length + 3}>
                                            {
                                                salesOrderData?.TermsData?.map((item, index) => {
                                                    return (
                                                        <h6>{item?.Sl}. {" "} {item?.Terms.toUpperCase()} <br /> </h6>
                                                    )
                                                })
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-weight-bold text-center" colSpan={Math.floor((salesOrderData?.Head?.length + 3) / 2)}>
                                            <br />
                                            <br />
                                            <br />
                                            DELIVER BY <br />
                                            {salesOrderData?.HeaderData?.BusinessUnitName.toUpperCase()}<br />
                                            {salesOrderData?.HeaderData?.BusinessUnitAddress.toUpperCase()}
                                        </td>
                                        <td className="font-weight-bold text-center" colSpan={Math.ceil((salesOrderData?.Head?.length + 3) / 2)}>
                                            <br />
                                            <br />
                                            <br />
                                            ACCEPTED BY <br />
                                            {salesOrderData?.HeaderData?.SoldToPartnerName.toUpperCase()}<br />
                                            {salesOrderData?.HeaderData?.SoldToPartnerAddress.toUpperCase()}<br />
                                        </td>
                                    </tr>

                                    <tr className="border-none">
                                        <td className="font-weight-bold" style={{
                                            border: "none"
                                        }} colSpan={Math.floor((salesOrderData?.Head?.length + 3) / 3)}>
                                            {salesOrderData?.HeaderData?.BusinessUnitName}<br />
                                            {salesOrderData?.HeaderData?.BusinessUnitAddress}
                                        </td>
                                        <td className="font-weight-bold" style={{
                                            border: "none",
                                            textAlign: "center"
                                        }} colSpan={Math.ceil((salesOrderData?.Head?.length + 3) / 3)}>
                                            T: 88-02-887-8888 <br />
                                            F: 88-02-887-8888 <br />
                                            E: 048528528542
                                        </td>
                                        <td className="font-weight-bold" style={{
                                            border: "none"
                                        }} colSpan={Math.floor((salesOrderData?.Head?.length + 3) / 3)}>
                                            findYourDailyEssentials.com <br />
                                            findYourDailyEssentials.com
                                        </td>
                                    </tr> */}
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
