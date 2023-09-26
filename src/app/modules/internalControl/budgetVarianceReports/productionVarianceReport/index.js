import { Form, Formik } from "formik";
import React from "react";

import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import { _getCurrentMonthYearForInput } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  monthYear: _getCurrentMonthYearForInput(),
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
};
export default function ProductionVarianceReport() {
  const [
    tableData,
    getTableData,
    tableDataLoader,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

 

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Production Variance Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                  </div>
                  <div className="col-lg-3">
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      class="btn btn-primary"
                      disabled={!values?.monthYear}
                      onClick={() => {
                        getTableData(
                          `/fino/Report/GetProductionVarianceReport?intBusinessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`,
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <table className="table table-striped table-bordered global-table mt-0">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Uom Name</th>
                        <th>Budget Qty</th>
                        <th>Actual Qty</th>
                        <th>Variance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.length > 0 &&
                        tableData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.itemCode}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.uomName}</td>
                            <td className="text-right">{item?.budgetQty}</td>
                            <td className="text-right">{item?.actualQty}</td>
                            <td className="text-right">{item?.variance}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
