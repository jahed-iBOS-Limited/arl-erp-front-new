/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { CreateJournalVoucher, getStoreExpense } from "../helper";
import { Formik } from "formik";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import TextArea from "../../../../_helper/TextArea";
import * as Yup from "yup";

const headers = [
  { name: "SL" },
  { name: "Lighter Name" },
  { name: "JV Code" },
  { name: "Amount" },
];

const validationSchema = Yup.object().shape({
  narration: Yup.string().required("Narration is required"),
});

const initData = {
  date: _firstDateofMonth(),
  narration: "",
};

export default function StoreExpenseReport() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getStoreExpense(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      _firstDateofMonth(),
      setGridData,
      setLoading
    );
  }, [profileData, selectedBusinessUnit]);

  let total = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          CreateJournalVoucher(
            "storeExp",
            profileData?.accountId,
            selectedBusinessUnit?.value,
            new Date(values?.date).getMonth(),
            new Date(values?.date).getFullYear(),
            values?.narration,
            profileData?.userId,
            setLoading,
            () => resetForm(initData)
          );
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-10">
                    <label>Narration</label>
                    <TextArea
                      value={values?.narration}
                      name="narration"
                      placeholder="Narration"
                      rows="3"
                      onChange={(e) =>
                        setFieldValue("narration", e.target.value)
                      }
                      max={1000}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mt-5">
                    <button
                      className="btn btn-primary px-3 py-2"
                      type="button"
                      onClick={handleSubmit}
                    >
                      JV Create
                    </button>
                  </div>
                  <div className="col-lg-3">
                    <label>Date</label>
                    <FormikInput
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        getStoreExpense(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          e?.target?.value,
                          setGridData,
                          setLoading
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-9 text-right mt-5">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary px-3 py-2 mr-2"
                      table="table-to-xlsx"
                      filename="Store Expense"
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
                <div className="text-center" style={{ margin: "15px 0" }}>
                  <h4>{selectedBusinessUnit?.label}</h4>
                  <p>{selectedBusinessUnit?.address}</p>
                </div>

                <ICustomTable id="table-to-xlsx" ths={headers}>
                  <div className="d-none">
                    <div style={{ textAlign: "center" }}>
                      <h4>{selectedBusinessUnit?.label}</h4>
                      <p>{selectedBusinessUnit?.address}</p>
                    </div>
                  </div>
                  {gridData?.map((item, index) => {
                    total += item?.storeExpAmount;
                    return (
                      <>
                        <tr key={index}>
                          <td className="text-center" style={{ width: "40px" }}>
                            {index + 1}
                          </td>
                          <td>{item?.lighterVesselName}</td>
                          <td className="text-center">{item?.jvcode}</td>
                          <td className="text-right">{item?.storeExpAmount}</td>
                        </tr>
                      </>
                    );
                  })}

                  {gridData?.length > 0 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td className="text-right" colSpan="3">
                        Total
                      </td>
                      <td className="text-right">
                        {_formatMoney(total || 0, 0)}
                      </td>
                    </tr>
                  )}
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
