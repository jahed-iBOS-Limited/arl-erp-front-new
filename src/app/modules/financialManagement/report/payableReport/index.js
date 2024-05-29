import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../_helper/_card";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: "",
  businessUnit: "",
};

function PayableReport() {
  const {
    // eslint-disable-next-line no-unused-vars
    authData: { profileData },
  } = useSelector((store) => store, shallowEqual);
  const [buDDL, getBuDDL] = useAxiosGet();
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet([]);

  useEffect(() => {
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <ICard title="Payable Variance Report">
            {loading && <Loading />}
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={[{ value: 0, label: "All" }, ...buDDL] || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("businessUnit", valueOption);
                        setRowDto([]);
                      } else {
                        setFieldValue("businessUnit", "");
                        setRowDto([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* <div className="col-lg-2">
                           <InputField
                              value={values?.fromDate}
                              label="From Date"
                              type="date"
                              name="fromDate"
                              onChange={e => {
                                 setFieldValue('fromDate', e.target.value);
                                 setRowDto([]);
                              }}
                           />
                        </div> */}
                <div className="col-lg-2">
                  <InputField
                    value={values?.toDate}
                    label="Date"
                    type="date"
                    name="toDate"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setRowDto([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 0, label: "Summary" },
                      { value: 1, label: "Details" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                      setRowDto([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="mt-5 ml-5">
                  <button
                    type="button"
                    disabled={
                      !values?.fromDate ||
                      !values?.businessUnit ||
                      !values?.reportType ||
                      !values?.toDate
                    }
                    onClick={() => {
                      getRowDto(
                        `/fino/Report/GetPayableTresuryReport?intBusinessUnitId=${values?.businessUnit?.value}&dteFromDate=${values?.toDate}&dteToDate=${values?.toDate}&reportType=${values?.reportType?.value}`
                      );
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>
            </form>
            <div className="row" id="pdf-section">
              <div className="col-lg-12">
                <div className="print_wrapper">
                  {values?.reportType?.value === 1 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                        <thead>
                          <tr>
                            <th style={{ width: "50px" }}>SL</th>
                            <th>Transaction</th>
                            <th>Code</th>
                            <th>Openning</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-left">
                                {item?.strSubGlName}
                              </td>
                              <td className="text-center">
                                {item?.strSubGlCode}
                              </td>
                              <td className="text-right">
                                {item?.numOppening
                                  ? _formatMoney(item?.numOppening)
                                  : ""}
                              </td>
                              <td className="text-right">
                                {item?.numDebit
                                  ? _formatMoney(item?.numDebit)
                                  : ""}
                              </td>
                              <td className="text-right">
                                {item?.numCredit
                                  ? _formatMoney(item?.numCredit)
                                  : ""}
                              </td>
                              <td className="text-right">
                                {item?.numAmount
                                  ? _formatMoney(item?.numAmount)
                                  : ""}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                        <thead>
                          <tr>
                            <th style={{ width: "50px" }}>SL</th>
                            <th>Transaction</th>
                            {/* <th>Openning</th>
                                    <th>Debit</th>
                                    <th>Credit</th> */}
                            <th>Standard</th>
                            <th>Actual</th>
                            <th>Variance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-left">
                                {item?.TransactionName}
                              </td>
                              {/* <td className="text-right">
                                          {item?.numOppening ? _formatMoney(item?.numOppening) : ""}
                                       </td>
                                       <td className="text-right">
                                          {item?.numDebit ? _formatMoney(item?.numDebit) : ""}
                                       </td>
                                       <td className="text-right">
                                          {item?.numCredit ? _formatMoney(item?.numCredit) : ""}
                                       </td> */}
                              <td className="text-right">
                                {item?.standerdValue
                                  ? _formatMoney(item?.standerdValue)
                                  : ""}
                              </td>
                              <td className="text-right">
                                {item?.actualValue
                                  ? _formatMoney(item?.actualValue)
                                  : ""}
                              </td>
                              <td className="text-right">
                                {item?.variance
                                  ? _formatMoney(item?.variance)
                                  : ""}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default PayableReport;
