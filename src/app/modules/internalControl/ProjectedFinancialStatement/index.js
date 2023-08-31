import { Form, Formik } from "formik";
import React, { useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../_helper/_form";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import NewSelect from "../../_helper/_select";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";
import TrailBalanceProjected from "./trailBalanceProjected";

const initData = {
  reportType: "",
  fromDate: "",
  toDate: "",
};
export default function ProjectedFinancialStatement() {
  const printRef = useRef();
  const saveHandler = (values, cb) => {};
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, loading, setRowData] = useAxiosGet();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
        setValues,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Projected Financial Statement"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <div className="col-md-3">
                  <NewSelect
                    name="reportType"
                    options={[{ value: 1, label: "Trail Balance Projected" }]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setRowData([]);
                      setFieldValue("reportType", valueOption);
                      setValues({
                        ...initData,
                        reportType: valueOption,
                      });
                    }}
                    placeholder="Report Type"
                  />
                </div>

                {[1]?.includes(values?.reportType?.value) ? (
                  <>
                    {" "}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
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
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                  </>
                ) : null}
                <div style={{ marginTop: "17px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      let url = [1]?.includes(values?.reportType?.value)
                        ? `/fino/Report/GetTrailBalanceProjected?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        : "";
                      getRowData(url);
                    }}
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
                {rowData.length > 0 && (
                  <div
                    className="col-lg-auto d-flex"
                    style={{ marginTop: "25px" }}
                  >
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button btn btn-primary"
                      table="table-to-xlsx"
                      filename="tablexls"
                      sheet="tablexls"
                      buttonText="Export Excel"
                    />
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                        >
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                )}
              </div>
              <div>
                {[1]?.includes(values?.reportType?.value) ? (
                  <TrailBalanceProjected
                    rowData={rowData}
                    printRef={printRef}
                    values={values}
                    selectedBusinessUnit={selectedBusinessUnit}
                  />
                ) : null}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
