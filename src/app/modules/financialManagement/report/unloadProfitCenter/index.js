import { Form, Formik } from "formik";
import React from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import NewSelect from "../../../_helper/_select";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  businessUnit: "",
};
export default function UnallocatedProfitCenter() {
  const saveHandler = (values, cb) => {};

  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
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
            title="Unallocated Profit Center"
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
                      label="Business Unit"
                      options={businessUnitList || ""}
                      value={values?.businessUnit}
                      name="businessUnit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption);
                      }}
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
                        if (e) {
                          setFieldValue("fromDate", e?.target?.value);
                          setTableData([]);
                        } else {
                          setFieldValue("fromDate", "");
                          setTableData([]);
                        }
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
                        if (e) {
                          setFieldValue("toDate", e?.target?.value);
                          setTableData([]);
                        } else {
                          setFieldValue("toDate", "");
                          setTableData([]);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      style={{
                        marginTop: "18px",
                      }}
                      className="btn btn-primary"
                      type="button"
                      disabled={
                        !values?.businessUnit?.value ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        getTableData(
                          `/fino/Report/GetUnAllocatedProfitCenter?businessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                <div className="table-responsive">
 <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Accounting Journal Code</th>
                        <th>General Ledger Name</th>
                        <th>Transaction Date</th>
                        <th>Amount</th>
                        <th>Narration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.length > 0 &&
                        tableData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.strAccountingJournalCode}
                            </td>
                            <td>{item?.strGeneralLedgerName}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteTransactionDate)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numAmount)}
                            </td>
                            <td>{item?.strNarration}</td>
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
