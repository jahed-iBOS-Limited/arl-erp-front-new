/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import essentialLogo from "./assets/essentialLogo.png";
import "./styles.css";
import { ToWords } from "to-words";

const initData = {};

export default function CommercialInvoiceModalView({ commercialId }) {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });

  const [
    quotationData,
    getQuotationData,
    quotationDataLoader,
    setQuotationData,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const printRef = useRef();

  useEffect(() => {
    if (commercialId) {
      getQuotationData(
        `/oms/SalesQuotation/ViewForeignSalesQuotation?QuotationId=${commercialId}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
        (data) => {
          setQuotationData(data.Data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTotalCFR = (quotationData) => {
    return (
      quotationData?.RowData?.reduce(
        (a, b) => a + (b?.TotalFobAmountUSD || 0),
        0
      ) + quotationData?.HeaderData?.FreightAmount || 0
    );
  };

  const getTotalFOB = (quotationData) => {
    return quotationData?.RowData?.reduce(
      (a, b) => a + (b?.TotalFobAmountUSD || 0),
      0
    ).toFixed(2);
  };

  const getTotalCarton = (quotationData) => {
    return quotationData?.RowData?.reduce((a, b) => a + b?.TotalCarton, 0) || 0;
  };

  const getTotalMoneyInWords = (money) => {
    const moneyInWords = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return moneyInWords;
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
          {quotationDataLoader && <Loading />}
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
              {quotationData?.HeaderData ? (
                <div componentRef={printRef} ref={printRef}>
                  <img
                    style={{ width: "130px", height: "60px" }}
                    src={essentialLogo}
                    alt="logo"
                  />
                 <div className="table-responsive">
                 <table
                    id="sales-contract-print"
                    className="table table-striped table-bordered global-table"
                  >
                    <tr className="text-center">
                      <td
                        className="font-weight-bold"
                        colSpan={quotationData?.Head?.length + 6}
                      >
                        <h1>COMMERCIAL INVOICE</h1>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>COMMERCIAL INVOICE NO:</strong>{" "}
                        {quotationData?.HeaderData?.SalesContractNo?.toUpperCase()}{" "}
                        <strong className="ml-5">DATE:</strong>{" "}
                        {_dateFormatter(quotationData?.HeaderData?.PricingDate)}
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>COURNTRY OF ORIGIN:</strong>{" "}
                        {quotationData?.HeaderData?.CountryOfOrigin?.toUpperCase()}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>SALES CONTRACT NO:</strong>
                        {quotationData?.HeaderData?.SalesContractNo?.toUpperCase()}{" "}
                        <strong className="ml-5">DATE:</strong>{" "}
                        {_dateFormatter(quotationData?.HeaderData?.PricingDate)}
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>SALES TERM:</strong>{" "}
                        {quotationData?.HeaderData?.SalesTerm?.toUpperCase()}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>EXPORTER/SHIPPER:</strong>
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>IMPORTER/CONSIGNEE:</strong>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        {quotationData?.HeaderData?.BusinessUnitName?.toUpperCase()}
                        <br />
                        {quotationData?.HeaderData?.BusinessUnitAddress?.toUpperCase()}
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        {quotationData?.HeaderData?.SoldToPartnerName?.toUpperCase()}
                        <br />
                        {quotationData?.HeaderData?.SoldToPartnerAddress?.toUpperCase()}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>BENIFICIARY BANK:</strong>
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>MODE OF SHIPMENT:</strong>{" "}
                        {quotationData?.HeaderData?.ModeofShipment?.toUpperCase()}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        {/* ISLAMI BANK BANGLADESH PLC <br />
                        HEAD OFFICE COMPLEX BRANCH <br />
                        41 DILKUSHA C/A, DHAKA-1000, BANGLADESH. <br />
                        ACCOUNT NO: 20502130100248815,
                        <br />
                        SWIFT CODE NO: IBBLBDDH213 */}
                        PUBALI BANK PLC <br />
                        FARMGATE BRANCH <br />
                        85, KAZI NAZRUL ISLAM AVENUE, DHAKA-1215 <br />
                        ACCOUNT NAME: AKIJ ESSENTIAL LIMITED <br />
                        ACCOUNT NO: 1820901034255 <br />
                        SWIFT CODE NO: PUBABDDH
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 2
                        )}
                      >
                        <strong>PLACE OF LOADING:</strong>{" "}
                        {quotationData?.HeaderData?.PortofShipment?.toUpperCase()}{" "}
                        <br />
                        <strong>PORT OF DISCHARGE:</strong>{" "}
                        {quotationData?.HeaderData?.PortofDishcharge?.toUpperCase()}{" "}
                        <br />
                        <strong>DESTINATION COUNTRY:</strong>{" "}
                        {quotationData?.HeaderData?.ToCountryName?.toUpperCase()}{" "}
                        <br />
                        <strong>FINAL DESTINATION:</strong>{" "}
                        {quotationData?.HeaderData?.FinalDestination?.toUpperCase()}{" "}
                        <br />
                        {/* <strong>EXP NO:</strong>{" "}
                        {quotationData?.HeaderData?.ExPortPermissionNo?.toUpperCase()}{" "}
                        <strong className="ml-5">DATE:</strong>{" "}
                        {_dateFormatter(
                          quotationData?.HeaderData?.PricingDate?.toUpperCase()
                        )} */}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-center">Sl</th>
                      <th>DESCRIPTION OF GOODS</th>
                      <th>HS CODE</th>
                      <th>PACKING DETAILS</th>
                      {quotationData?.Head?.map((item, index) => {
                        return <th>{item?.HeaderName?.toUpperCase()}</th>;
                      })}
                      <th>RATE USD/CTN</th>
                      <th>TOTAL AMOUNT</th>
                    </tr>
                    {quotationData?.RowData?.map((item, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.ItemName?.toUpperCase()}</td>
                        <td>{item?.ItemCode?.toUpperCase()}</td>
                        <td className="text-center">
                          {item?.PackingDetails?.toUpperCase()}
                        </td>
                        {item?.Headings?.map((itm, index) => (
                          <td className="text-center">{itm?.HeaderValue}</td>
                        ))}
                        <td className="text-right">
                          {_formatMoney(item?.FobRatePerCartonUSD)}
                        </td>
                        <td className="text-right">
                          {_formatMoney(item?.TotalFobAmountUSD)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        className="text-center"
                        colSpan={quotationData?.Head?.length + 6 - 3}
                      >
                        <strong>TOTAL VALUE</strong>
                      </td>
                      <td className="text-center font-weight-bold">
                        {getTotalCarton(quotationData)}
                      </td>
                      <td></td>
                      <td className="text-right font-weight-bold">
                        {_formatMoney(getTotalFOB(quotationData))}
                      </td>
                    </tr>
                    {/* <tr>
                      <td
                        className="text-center"
                        colSpan={quotationData?.Head?.length + 6 - 1}
                      >
                        <strong>FREIGHT</strong>
                      </td>
                      <td className="text-right font-weight-bold">
                        {_formatMoney(
                          quotationData?.HeaderData?.FreightAmount || 0
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="text-center"
                        colSpan={quotationData?.Head?.length + 6 - 1}
                      >
                        <strong>TOTAL CFR VALUE</strong>
                      </td>
                      <td className="text-right font-weight-bold">
                        {_formatMoney(getTotalCFR(quotationData))}
                      </td>
                    </tr> */}
                    <tr>
                      <td colSpan={quotationData?.Head?.length + 6}>
                        <strong>
                          TOTAL AMOUNT (USD):
                          {toWords?.convert(getTotalCFR(quotationData) || 0)}
                          {/* {getTotalMoneyInWords(getTotalCFR(quotationData))} */}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={quotationData?.Head?.length + 6}>
                        <strong>
                          FREIGHT CONSIDERATION : $
                          {_formatMoney(
                            quotationData?.HeaderData?.FreightAmount || 0
                          )}
                        </strong>
                      </td>
                    </tr>
                    {/* t&c */}
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={quotationData?.Head?.length + 6}
                      >
                        OTHERS INFORMATION : QUANTITY, QUALITY, RATE AND ALL
                        OTHER DETAILS OF GOODS ARE IN ACCORDANCE WITH THE
                      </td>
                    </tr>
                    {/* <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={quotationData?.Head?.length + 6}
                      >
                        {quotationData?.TermsData?.map((item, index) => {
                          return (
                            <h6
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              {item?.Sl}. {item?.Terms?.toUpperCase()} <br />{" "}
                            </h6>
                          );
                        })}
                      </td>
                    </tr> */}
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={quotationData?.Head?.length + 6}
                      >
                        <strong>SALES CONTRACT NO:</strong>
                        {quotationData?.HeaderData?.SalesContractNo?.toUpperCase()}{" "}
                        <strong className="ml-5">DATE:</strong>{" "}
                        {_dateFormatter(quotationData?.HeaderData?.PricingDate)}
                      </td>
                    </tr>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <tr className="border-none">
                      <td
                        className="font-weight-bold"
                        style={{
                          border: "none",
                        }}
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 3
                        )}
                      >
                        {quotationData?.HeaderData?.BusinessUnitName}
                        <br />
                        {quotationData?.HeaderData?.BusinessUnitAddress}
                      </td>
                      <td
                        className="font-weight-bold"
                        style={{
                          border: "none",
                          textAlign: "center",
                        }}
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 3
                        )}
                      >
                        T: 88-02-887-8888 <br />
                        F: 88-02-887-8888 <br />
                        E: 048528528542
                      </td>
                      <td
                        className="font-weight-bold"
                        style={{
                          border: "none",
                        }}
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 6) / 3
                        )}
                      >
                        findYourDailyEssentials.com <br />
                        findYourDailyEssentials.com
                      </td>
                    </tr>
                  </table>
                 </div>
                </div>
              ) : null}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
