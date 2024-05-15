import { Form, Formik } from "formik";
import React from "react";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import { _getCurrentMonthYearForInput } from "../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  monthYear: _getCurrentMonthYearForInput(),
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

  const getData = (values) => {
    const [year, month] = values?.monthYear.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    getTableData(
      `/fino/Report/GetProductionVarianceReport?intBusinessUnitId=${selectedBusinessUnit?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`,
      (data) => {
        console.log("data", data);
      }
    );
  };

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
                    <label>Month-Year</label>
                    <InputField
                      value={values?.monthYear}
                      name="monthYear"
                      placeholder="From Date"
                      type="month"
                      onChange={(e) => {
                        setFieldValue("monthYear", e?.target?.value);
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
                        console.log("values", values);
                        getData(values);
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
                        <th>Actual Qty</th>
                        <th>Budget Qty</th>
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
                            <td className="text-right">{item?.actualQty}</td>
                            <td className="text-right">{item?.budgetQty}</td>
                            <td className="text-right">{item?.variance}</td>
                          </tr>
                        ))}
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
