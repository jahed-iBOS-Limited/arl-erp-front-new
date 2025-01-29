/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import essentialLogo from "./assets/essentialLogo.png";
import "./styles.css";
const initData = {};

export default function PackingAndWeightListViewModal({
  packingAndWeightListId,
}) {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const [
    quotationData,
    getQuotationData,
    quotationDataLoader,
    setQuotationData,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const printRef = useRef();

  useEffect(() => {
    if (packingAndWeightListId) {
      getQuotationData(
        `/oms/SalesQuotation/ViewForeignCommonSpecificationByQuotationId?quotationId=${packingAndWeightListId}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
        (data) => {
          setQuotationData(data.Data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNetWeight = (item) => {
    const pcsInCtn = item?.Headings?.find(
      (item) => item?.HeaderName === "PCS In CTN"
    )?.HeaderValue;
    const totalCarton = item?.Headings?.find(
      (item) => item?.HeaderName === "Total Carton"
    )?.HeaderValue;
    const packSize = item?.Headings?.find(
      (item) => item?.HeaderName === "Pack Size"
    )?.HeaderValue;
    return (totalCarton * pcsInCtn * packSize) / 1000;
  };

  const getGrossWeight = (item) => {
    const netWeight = getNetWeight(item);
    const totalCarton = item?.Headings?.find(
      (item) => item?.HeaderName === "Total Carton"
    )?.HeaderValue;
    return (netWeight + totalCarton * 0.5).toFixed(2);
  };

  const totalNetWeightSum = (data) => {
    let totalNetWeight = 0;
    const sum = data?.forEach((item) => {
      totalNetWeight = totalNetWeight + +getNetWeight(item);
    });
    return totalNetWeight;
  };

  const totalGrossWeightSum = (data) => {
    let totalGrossWeight = 0;
    const sum = data?.forEach((item) => {
      totalGrossWeight = totalGrossWeight + +getGrossWeight(item);
    });
    return totalGrossWeight;
  };

  const getTotalCarton = (quotationData) => {
    return quotationData?.RowData?.reduce((a, b) => a + b?.TotalCarton, 0) || 0;
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
                <div className="table-responsive">  <table
                    id="sales-contract-print"
                    className="table table-striped table-bordered global-table"
                  >
                    <tr className="text-center">
                      <td
                        className="font-weight-bold"
                        colSpan={quotationData?.Head?.length + 7}
                      >
                        <h1>PACKING & WEIGHT LIST</h1>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 7) / 2
                        )}
                      >
                        <strong>COMMERCIAL INVOICE NO:</strong>{" "}
                        {quotationData?.HeaderData?.SalesContractNo?.toUpperCase()}{" "}
                        <strong>DATE:</strong>{" "}
                        {_dateFormatter(quotationData?.HeaderData?.PricingDate)}
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 7) / 2
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
                          (quotationData?.Head?.length + 7) / 2
                        )}
                      >
                        <strong>SALES CONTRACT NO:</strong>{" "}
                        {quotationData?.HeaderData?.SalesContractNo?.toUpperCase()}{" "}
                        <strong>DATE:</strong>{" "}
                        {_dateFormatter(quotationData?.HeaderData?.PricingDate)}
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 7) / 2
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
                          (quotationData?.Head?.length + 7) / 2
                        )}
                      >
                        <strong>EXPORTER/SHIPPER:</strong>
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 7) / 2
                        )}
                      >
                        <strong>IMPORTER/CONSIGNEE:</strong>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(
                          (quotationData?.Head?.length + 7) / 2
                        )}
                      >
                        {quotationData?.HeaderData?.BusinessUnitName?.toUpperCase()}
                        <br />
                        {quotationData?.HeaderData?.BusinessUnitAddress?.toUpperCase()}
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 7) / 2
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
                          (quotationData?.Head?.length + 7) / 2
                        )}
                      >
                        <strong>BENIFICIARY BANK:</strong>
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 7) / 2
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
                          (quotationData?.Head?.length + 7) / 2
                        )}
                      >
                        ISLAMI BANK BANGLADESH PLC <br />
                        HEAD OFFICE COMPLEX BRANCH <br />
                        41 DILKUSHA C/A, DHAKA-1000, BANGLADESH. <br />
                        ACCOUNT NO: 20502130100248815,
                        <br /> SWIFT CODE NO: IBBLBDDH213
                      </td>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.ceil(
                          (quotationData?.Head?.length + 7) / 2
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
                      <th className="text-center">SHIPPING MARK</th>
                      <th className="text-center">Sl</th>
                      <th>DESCRIPTION OF GOODS</th>
                      <th>HS CODE</th>
                      <th>PACKING DETAILS</th>
                      {quotationData?.Head?.map((item, index) => {
                        return <th>{item?.HeaderName?.toUpperCase()}</th>;
                      })}
                      <th>NET WEIGHT IN (KGS)</th>
                      <th>GROSS WEIGHT IN (KGS)</th>
                    </tr>
                    <tr>
                      <td
                        className="text-center"
                        rowSpan={quotationData?.RowData?.length + 1}
                      >
                        <strong
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {quotationData?.HeaderData?.BusinessUnitName?.toUpperCase()}
                        </strong>
                      </td>
                    </tr>
                    {quotationData?.RowData?.map((item, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.ItemName?.toUpperCase()}</td>
                        <td>{item?.ItemCode?.toUpperCase()}</td>
                        <td>{item?.PackingDetails?.toUpperCase()}</td>
                        {item?.Headings?.map((itm, index) => (
                          <td className="text-center">{itm?.HeaderValue}</td>
                        ))}
                        <td className="text-center">{getNetWeight(item)}</td>
                        <td className="text-center">{getGrossWeight(item)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        className="text-right"
                        colSpan={quotationData?.Head?.length + 7 - 3}
                      >
                        <strong>TOTAL: </strong>
                      </td>
                      <td className="text-center font-weight-bold">
                        {getTotalCarton(quotationData)}
                      </td>
                      <td className="text-center font-weight-bold">
                        {totalNetWeightSum(quotationData?.RowData)}
                      </td>
                      <td className="text-center font-weight-bold">
                        {totalGrossWeightSum(quotationData?.RowData)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={quotationData?.Head?.length + 7}
                      >
                        <strong
                          style={{
                            fontStyle: "italic",
                          }}
                        >
                          OTHERS INFORMATION : QUANTITY, QUALITY, RATE AND ALL
                          OTHER DETAILS OF GOODS ARE IN ACCORDANCE WITH THE
                        </strong>
                      </td>
                    </tr>
                    {/* <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={quotationData?.Head?.length + 7}
                      >
                        {quotationData?.TermsData?.map((item, index) => {
                          return (
                            <h6 style={{ fontSize: "14px" }}>
                              {item?.Sl}. {item?.Terms?.toUpperCase()} <br />{" "}
                            </h6>
                          );
                        })}
                      </td>
                    </tr> */}
                    <tr>
                      <td
                        className="font-weight-bold"
                        colSpan={Math.floor(quotationData?.Head?.length + 7)}
                      >
                        <strong>SALES CONTRACT NO:</strong>{" "}
                        {quotationData?.HeaderData?.SalesContractNo?.toUpperCase()}{" "}
                        <strong>DATE:</strong>{" "}
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
                          (quotationData?.Head?.length + 7) / 3
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
                          (quotationData?.Head?.length + 7) / 3
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
                          (quotationData?.Head?.length + 7) / 3
                        )}
                      >
                        findYourDailyEssentials.com <br />
                        findYourDailyEssentials.com
                      </td>
                    </tr>
                  </table></div>
                </div>
              ) : null}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
