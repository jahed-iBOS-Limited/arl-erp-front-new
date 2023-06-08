/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { getVesselDDL, getVoyageDDLNew } from "../../../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { ExportPDF } from "../../../_chartinghelper/exportPdf";
import Loading from "../../../_chartinghelper/loading/_loading";
import {
  getAdditionalCostById,
  // getIncomeStatement,
  getIncomeStatementForVoyageCharter,
  getIncomeStatementNew,
  GetTransactionDetailsForStatement,
  GetVesselBunkerInvInfo,
} from "../helper";
import TimeCharterStatement from "./timeStatement";
import VoyageCharterStatement from "./voyageStatement";

const initData = {
  vesselName: "",
  voyageNo: "",
  voyageType: "",
};

export default function StatementTable() {
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [timeCharterData, setTimeCharterData] = useState({});
  const [voyageCharterData, setVoyageCharterData] = useState({});
  const [hireList, setHireList] = useState([]);
  const [bunkerSellList, setBunkerSellList] = useState([]);
  const [additionalCostList, setAdditionalCostList] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getIncomeStatementData = (values) => {
    setAdditionalCostList([]);
    if (values?.voyageNo?.voyageTypeID === 1) {
      // getIncomeStatement(
      getIncomeStatementNew(
        values?.vesselName?.value,
        values?.voyageNo?.value,
        values?.voyageNo?.voyageTypeID,
        setTimeCharterData,
        setLoading,
        () => {
          GetTransactionDetailsForStatement(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            values?.vesselName?.value,
            values?.voyageNo?.value,
            setHireList
          );
          GetVesselBunkerInvInfo(
            values?.vesselName?.value,
            values?.voyageNo?.value,
            setBunkerSellList
          );
          getAdditionalCostById(
            values?.vesselName?.value,
            values?.voyageNo?.value,
            setAdditionalCostList,
            setLoading
          );
        }
      );
    } else {
      getIncomeStatementForVoyageCharter(
        values?.vesselName?.value,
        values?.voyageNo?.value,
        values?.voyageNo?.voyageTypeID,
        setVoyageCharterData,
        setLoading,
        () => {
          getAdditionalCostById(
            values?.vesselName?.value,
            values?.voyageNo?.value,
            setAdditionalCostList,
            setLoading
          );
        }
      );
    }
  };

  const printRef = useRef();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Income Statement</p>
                <div>
                  {/* <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-primary px-3 py-2"
                    table="table-to-xlsx"
                    filename="Income Statement"
                    sheet="Income Statement"
                    buttonText="Export Excel"
                  /> */}
                  <button
                    className="btn btn-primary px-3 py-2 mr-2"
                    type="button"
                    onClick={() => {
                      ExportPDF(
                        `Statement of ${values?.vesselName?.label}_V${values?.voyageNo?.value}`,
                        setLoading
                      );
                    }}
                  >
                    Export PDF
                  </button>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary px-3 py-2 sales_invoice_btn ml-2"
                      >
                        <i
                          style={{ fontSize: "10px" }}
                          className="fas fa-print mr-1"
                        ></i>
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setFieldValue("voyageNo", "");
                        setVoyageNoDDL([]);
                        setFieldValue("voyageType", "");
                        setFieldValue("hireType", "");
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: profileData?.accountId,
                            buId: selectedBusinessUnit?.value,
                            id: valueOption?.value,
                            setter: setVoyageNoDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 0,
                            voyageTypeId: 0,
                          });
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);

                        if (valueOption) {
                          getIncomeStatementData({
                            ...values,
                            voyageNo: valueOption,
                          });
                          setFieldValue("voyageType", {
                            value: valueOption?.voyageTypeID,
                            label: valueOption?.voyageTypeName,
                          });
                          setFieldValue("shipType", {
                            value: valueOption?.hireTypeId,
                            label: valueOption?.hireTypeName,
                          });
                        } else {
                          setFieldValue("voyageType", "");
                          setFieldValue("shipType", "");
                        }
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.shipType || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="shipType"
                      placeholder="Ship Type"
                      label="Ship Type"
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageType || ""}
                      isSearchable={true}
                      options={[]}
                      styles={customStyles}
                      name="voyageType"
                      placeholder="Voyage Type"
                      label="Voyage Type"
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              {values?.voyageNo?.voyageTypeName === "Voyage Charter" &&
                values?.voyageNo?.hireTypeName !== "Charterer Ship" && (
                  <VoyageCharterStatement
                    voyageCharterData={voyageCharterData}
                    printRef={printRef}
                    values={values}
                    additionalCostList={additionalCostList}
                  ></VoyageCharterStatement>
                )}
              {values?.voyageNo?.voyageTypeName === "Time Charter" &&
                values?.voyageNo?.hireTypeName !== "Charterer Ship" && (
                  <TimeCharterStatement
                    timeCharterData={timeCharterData}
                    values={values}
                    printRef={printRef}
                    hireList={hireList}
                    bunkerSellList={bunkerSellList}
                    additionalCostList={additionalCostList}
                  ></TimeCharterStatement>
                )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
