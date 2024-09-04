import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import NewSelect from "../../../_helper/_select";
import { _getCurrentMonthYearForInput } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  monthYear: _getCurrentMonthYearForInput(),
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
  currentBusinessUnit: "",
  isForecast: 0,
};
export default function ProductionVarianceReport() {
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const totalBudgetQty = tableData?.reduce(
    (acc, item) => acc + (item?.budgetQty ?? 0),
    0
  );
  
  const totalActualQty = tableData?.reduce(
    (acc, item) => acc + (item?.actualQty ?? 0),
    0
  );
  
  const totalVariance = tableData?.reduce(
    (acc, item) => acc + (item?.variance ?? 0),
    0
  );

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
                    <NewSelect
                      name="currentBusinessUnit"
                      options={businessUnitList}
                      value={values?.currentBusinessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("currentBusinessUnit", valueOption);
                          setTableData([]);
                        } else {
                          setTableData([]);
                        }
                      }}
                      placeholder="Business Unit"
                      errors={errors}
                      touched={touched}
                      required={true}
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
                  <div className="col-lg-1 mt-4">
                    <div className="d-flex align-items-center">
                    <p className="pr-1 pt-3">
                      <input
                        type="checkbox"
                        checked={values?.isForecast === 1} 
                      onChange={(e)=>{
                        setFieldValue("isForecast", e.target.checked ? 1 : 0);
                      }}
                      />
                    </p>
                    <p>
                      <label>Is Forecast</label>
                    </p>
                  </div>
                    </div>
                  <div className="col-lg-3">
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      class="btn btn-primary"
                      disabled={!values?.monthYear}
                      onClick={() => {
                        getTableData(
                          `/fino/Report/GetProductionVarianceReport?intBusinessUnitId=${values?.currentBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&isForecast=${values?.isForecast}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="table-responsive">
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
                              <td className="text-right">
                                {_formatMoney(item?.budgetQty)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.actualQty)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.variance)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={4} className="text-center"><strong>Total</strong></td>
                            <td className="text-right">{_formatMoney(totalBudgetQty)}</td>
                            <td className="text-right">{_formatMoney(totalActualQty)}</td>
                            <td className="text-right">{_formatMoney(totalVariance)}</td>
                          </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
