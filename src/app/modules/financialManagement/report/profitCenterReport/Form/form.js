import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import ReconcileTable from "../Table/reconcileTable";
import Table from "../Table/table";
import { getProfitCenterData, getProfitCenterDDL, getProfitCenterReconcileReport } from "./helper";

const validationSchema = Yup.object().shape({});

export default function 
_Form({ initData }) {
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const selectedBusinessUnit = useSelector((state) => state.authData.selectedBusinessUnit, shallowEqual);

  const [reconcileDto, getReconcileDto, getReconcileDtoLoading, setReconcileDto] = useAxiosGet([]);


  useEffect(() => {
    getProfitCenterDDL(selectedBusinessUnit?.value, setProfitCenterDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit?.value]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
            {getReconcileDtoLoading ? <Loading /> : null}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenter"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    placeholder="Profit Center"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                      }}
                    />
                  </div>
                <div style={{ marginTop: "18px" }} className="col-lg-3">
                  <button
                    type="button"
                    disabled={!values?.profitCenter||!values?.fromDate ||!values?.toDate}
                    onClick={() => {
                      setReconcileDto([])
                      getProfitCenterData({
                        pcId: values?.profitCenter?.value,
                        fromDate: values?.fromDate,
                        toDate: values?.toDate,
                        buId: selectedBusinessUnit?.value,
                        setter: setRowDto,
                      });
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    disabled={!values?.fromDate ||!values?.toDate}
                    onClick={() => {
                      setRowDto([])
                      getProfitCenterReconcileReport({ getReconcileDto, selectedBusinessUnit, setReconcileDto, values })
                    }}
                    className="btn btn-primary ml-2"
                  >
                    Reconcile
                  </button>
                </div>
                {rowDto?.length > 0 &&
                <div className="col-lg-3 mt-3">
                  <ReactHtmlTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary"
                    table={"table-to-xlsx"}
                    filename="Profit Cost Center"
                    sheet="Profit Cost Center"
                    buttonText="Export Excel"
                  />
                </div>
                }
              </div>
              <div>{reconcileDto?.length ? <ReconcileTable reconcileDto={reconcileDto} landingValues={values} /> : <Table rowDto={rowDto} landingValues={values} />}</div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
