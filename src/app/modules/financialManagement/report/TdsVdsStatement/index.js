import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: {
    value: 1,
    label: "TDS",
  },
};
export default function TdsVdsStatement() {
  const saveHandler = (values, cb) => {};
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  useEffect(() => {
    getTableData(
      `/oms/SalesInformation/GetTDSVDSStatement?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${initData?.fromDate}&toDate=${initData?.toDate}&type=1&nbrSubmitType=${initData?.reportType?.value}
      `
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            title="TDS VDS Statement"
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
                      label="Report Type"
                      options={[
                        {
                          value: 1,
                          label: "TDS",
                        },
                        {
                          value: 2,
                          label: "VDS",
                        },
                      ]}
                      value={values?.reportType}
                      name="reportType"
                      onChange={(valueOption) => {
                        setTableData([]);
                        setFieldValue("reportType", valueOption);
                      }}
                      placeholder="Report Type"
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
                        setTableData([]);
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
                        setTableData([]);
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
                        !values?.reportType?.value ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        getTableData(
                          `/oms/SalesInformation/GetTDSVDSStatement?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&type=1&nbrSubmitType=${values?.reportType?.value}
                          `
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
                          <th>Business Partner Name</th>
                          <th>BIN</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.length > 0 &&
                          tableData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strBusinessPartnerName}</td>
                              <td>{item?.companybin}</td>
                              <td className="text-right">
                                {_formatMoney(
                                  item?.monTDSAmount || item?.monVDSAmount || 0
                                )}
                              </td>
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
