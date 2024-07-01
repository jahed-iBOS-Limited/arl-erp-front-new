import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";
import ICustomCard from "../../../_helper/_customCard";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { PortAndMotherVessel } from "../../common/components";
import GhatWiseDeliveryReport from "./ghatWiseDeliveryReport";
import GodownsEntryReport from "./godownsEntryReport";
import { batayonTradersLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/batayounTraders";
import { bluePillLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/bluePill";
import { bongoTradersLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/bongoTraders";
import { buildingLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/building";
import { cementLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/cement";
import { commoditiesLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/commodities";
import { dailyTradingLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/dailyTrading";
import { directTradingLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/directTrading";
import { essentialLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/essential";
import { eurasiaTradingLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/eurasiaTrading";
import { exoticaTradersLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/exoticaTraders";
import { ispatLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/ispat";
import { lineAsiaTradingLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/lineAsiaTrading";
import { magnumLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/magnum";
import { MTSLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/mts";
import { nobayonTradersLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/nobayonTraders";
import { oneTradingLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/oneTrading";
import { optimaTradersLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/optimaTraders";
import { polyFibreLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/polyFibre";
import { readymixLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/readymix";
import { resourceTradersLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/resourceTraders";
import { tradersLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/traders";
import { tradingLetterhead } from "../../../financialManagement/invoiceManagementSystem/salesInvoice/base64Images/trading";
import "./style.scss";
const validationSchema = Yup.object().shape({});
function G2GSalesInvoice() {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buUnId, label: buUnName },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [userPrintBtnClick, setUserPrintBtnClick] = useState(false);
  const [shipPoint, getShipPoint] = useAxiosGet();
  const [, getGhatWiseDeliveryReport, gridDataLoading] = useAxiosGet();
  const [, getGodownsEntryReport, godownsEntryLoading] = useAxiosGet();
  const [gridData, setGridData] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    getShipPoint(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accountId}&businessUnitId=${buUnId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "shipPoint":
        setFieldValue("shipPoint", currentValue);
        setFieldValue("motherVessel", "");
        break;
      case "port":
        if (currentValue) {
          setFieldValue("port", currentValue);
          setFieldValue("motherVessel", "");
        } else {
          setFieldValue("port", "");
          setFieldValue("motherVessel", "");
        }
        break;
      case "motherVessel":
        setFieldValue("motherVessel", currentValue);
        if (currentValue) {
          setFieldValue("programNo", currentValue?.programNo);
          setFieldValue("item", {
            value: currentValue?.itemId,
            label: currentValue?.itemName,
          });
        } else {
          setFieldValue("programNo", "");
          setFieldValue("item", "");
        }
        break;
      default:
        break;
    }
  };

  const showHandelar = (values) => {
    const reportType = values?.reportType?.value;

    switch (reportType) {
      case 1:
        // Godowns Entry Report
        getGodownsEntryReport(
          `/tms/LigterLoadUnload/GetMotherVesselWiseGodownsEntryReport?accountId=${accountId}&businessUnitId=${buUnId}&motherVesslelId=${values?.motherVessel?.value}&&fromDate=${values?.fromDate}&toDate=${values?.toDate}`,
          (resData) => {
            setGridData(resData);
          }
        );
        break;
      case 2:
        // Ghat Wise Delivery Report
        getGhatWiseDeliveryReport(
          `/tms/LigterLoadUnload/GetGhatWiseDeliveryReport?accountId=${accountId}&businessUnitId=${buUnId}&motherVesslelId=${values?.motherVessel?.value}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`,
          (resData) => {
            setGridData(resData);
          }
        );
        break;
      default:
        break;
    }
  };

  const handlePrint = useReactToPrint({
    pageStyle: `@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}`,
    onBeforePrint: () => {
      setUserPrintBtnClick(true);
    },
    onAfterPrint: () => {
      setUserPrintBtnClick(false);
    },
    content: () => printRef.current,
  });
  const letterhead =
    buUnId === 175
      ? readymixLetterhead
      : buUnId === 94
      ? MTSLetterhead
      : buUnId === 144
      ? essentialLetterhead
      : buUnId === 4
      ? cementLetterhead
      : buUnId === 186
      ? bluePillLetterhead
      : buUnId === 8
      ? polyFibreLetterhead
      : buUnId === 224
      ? ispatLetterhead
      : buUnId === 220
      ? buildingLetterhead
      : buUnId === 171
      ? magnumLetterhead
      : buUnId === 221
      ? commoditiesLetterhead
      : buUnId === 216
      ? tradersLetterhead
      : buUnId === 213
      ? tradingLetterhead
      : buUnId === 181
      ? oneTradingLetterhead
      : buUnId === 212
      ? batayonTradersLetterhead
      : buUnId === 178
      ? bongoTradersLetterhead
      : buUnId === 182
      ? dailyTradingLetterhead
      : buUnId === 180
      ? directTradingLetterhead
      : buUnId === 183
      ? eurasiaTradingLetterhead
      : buUnId === 218
      ? exoticaTradersLetterhead
      : buUnId === 209
      ? lineAsiaTradingLetterhead
      : buUnId === 211
      ? nobayonTradersLetterhead
      : buUnId === 214
      ? optimaTradersLetterhead
      : buUnId === 210
      ? resourceTradersLetterhead
      : "";

  return (
    <>
      <ICustomCard title="G2G Sales Invoice">
        <div id="g2gSalesInvoice">
          <Formik
            enableReinitialize={true}
            validationSchema={validationSchema}
            initialValues={{
              reportType: { value: 1, label: "Godowns Entry Report" },
              shipPoint: "",
              port: "",
              motherVessel: "",
              fromDate: _todayDate(),
              toDate: _todayDate(),
              godownsEntryTopDate: _todayDate(),
              godownsEntryBottomDate: _todayDate(),
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
          >
            {({
              handleSubmit,
              resetForm,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <>
                {(godownsEntryLoading || gridDataLoading) && <Loading />}
                <Form className="form">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        label="Report Type"
                        placeholder="Report Type"
                        options={[
                          {
                            value: 1,
                            label: "Godowns Entry Report",
                          },
                          {
                            value: 2,
                            label: "Ghat Wise Delivery Report",
                          },
                        ]}
                        value={values?.reportType}
                        onChange={(valueOption) => {
                          setGridData([]);
                          setFieldValue("reportType", valueOption);
                        }}
                      />
                    </div>
                    {[2].includes(values?.reportType?.value) && (
                      <>
                        {" "}
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipPoint"
                            options={shipPoint || []}
                            value={values?.shipPoint}
                            label="ShipPoint"
                            onChange={(valueOption) => {
                              setGridData([]);
                              setFieldValue("shipPoint", valueOption);
                            }}
                            placeholder="ShipPoint"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    )}

                    {[1, 2].includes(values?.reportType?.value) && (
                      <>
                        {" "}
                        <PortAndMotherVessel
                          obj={{
                            values,
                            setFieldValue,
                            allElement: false,
                            onChange: (fieldName, allValues) => {
                              setGridData([]);
                              onChangeHandler(
                                fieldName,
                                values,
                                allValues?.[fieldName],
                                setFieldValue
                              );
                            },
                          }}
                        />
                      </>
                    )}

                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setGridData([]);
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setGridData([]);
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={() => {
                          setGridData([]);
                          showHandelar(values);
                        }}
                        disabled={
                          !values?.fromDate ||
                          !values?.toDate ||
                          (values?.reportType?.value === 2
                            ? !values?.shipPoint || !values?.motherVessel
                            : !values?.motherVessel)
                        }
                      >
                        Show
                      </button>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <span
                        onClick={() => {
                          setUserPrintBtnClick(true);
                          setTimeout(() => {
                            handlePrint();
                          }, 1000);
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-primary ml-3"
                          disabled={gridData?.length > 0 ? false : true}
                        >
                          <i class="fa fa-print pointer" aria-hidden="true"></i>
                          Print
                        </button>
                      </span>
                    </div>
                  </div>
                  {/* Godowns Entr Report */}
                  {values?.reportType?.value === 1 && gridData?.length > 0 && (
                    <>
                      <GodownsEntryReport
                        printRef={printRef}
                        gridData={gridData}
                        buUnName={buUnName}
                        values={values}
                        setFieldValue={setFieldValue}
                        userPrintBtnClick={userPrintBtnClick}
                        letterhead={letterhead}
                      />
                    </>
                  )}
                  {/*  Ghat wise delivery report (type : 2) */}
                  {values?.reportType?.value === 2 && gridData?.length > 0 && (
                    <>
                      <GhatWiseDeliveryReport
                        printRef={printRef}
                        gridData={gridData}
                        buUnName={buUnName}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </>
                  )}
                </Form>
              </>
            )}
          </Formik>
        </div>
      </ICustomCard>
    </>
  );
}

export default G2GSalesInvoice;
