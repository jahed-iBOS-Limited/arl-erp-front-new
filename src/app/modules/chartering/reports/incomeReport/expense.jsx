/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Formik } from "formik";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Loading from "../../_chartinghelper/loading/_loading";
import ICustomTable from "../../_chartinghelper/_customTable";
import { getExpenseReport } from "./helper";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
// import { _fixedPoint } from "../../../_helper/_fixedPoint";

const initData = { vesselName: "", voyageNo: "" };

export default function ExpenseReport() {
  const printRef = useRef();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageDDL, setVoyageDDL] = useState([]);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getGridData = (values) => {
    getExpenseReport(
      accId,
      buId,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    getGridData(initData);
    getVesselDDL(accId, buId, setVesselDDL);
  }, [accId, buId]);

  const headers = gridData?.heads?.map((e) => ({ name: e }));

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
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
                        setGridData([]);
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: accId,
                            buId: buId,
                            id: valueOption?.value,
                            setter: setVoyageDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 0,
                            voyageTypeId: 0,
                          });
                        }
                        getGridData({ ...values, vesselName: valueOption });
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("voyageNo", valueOption);
                        getGridData({
                          ...values,
                          voyageNo: valueOption,
                        });
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-6 text-right mt-5">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary px-3 py-2 mr-2"
                      table="table-to-xlsx"
                      filename="Expense Report"
                      sheet="Sheet-1"
                      buttonText="Export Excel"
                    />
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2"
                        >
                          <i
                            className="mr-1 fa fa-print pointer"
                            aria-hidden="true"
                          ></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                </div>
              </div>
              <div ref={printRef}>
                <ICustomTable id="table-to-xlsx" ths={headers || []}>
                  {gridData?.rows?.map((item, index) => (
                    <tr key={index}>
                      {item?.map((e, i) => (
                        <td
                          className={!isNaN(e) ? "text-right" : "text-left"}
                          key={i}
                        >
                          {!isNaN(e)
                            ? i > 3
                              ? e > 0
                                ? _fixedPoint(e, true)
                                : ""
                              : e
                            : e}
                        </td>
                      ))}
                    </tr>
                  ))}
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
