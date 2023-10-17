import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {
  gl: "",
  fromDate: "",
  toDate: "",
};
export default function OverheadVarianceReport() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [glList, getGlList] = useAxiosGet();
  const [rowData, getRowData] = useAxiosGet();
  const [totals, setTotals] = useState({
    totalBudOH: 0,
    totalAchOH: 0,
    totalTotalVariance: 0,
    totalUnitBudOH: 0,
    totalUnitActOH: 0,
    totalUnitVariance: 0,
  });

  // Calculate the totals when rowData changes
  useEffect(() => {
    const newTotals = rowData?.reduce(
      (accumulator, item) => {
        return {
          totalBudOH: accumulator.totalBudOH + (item?.numBudOH || 0),
          totalAchOH: accumulator.totalAchOH + (item?.numAchOH || 0),
          totalTotalVariance:
            accumulator.totalTotalVariance + (item?.numTotalVariance || 0),
          totalUnitBudOH:
            accumulator.totalUnitBudOH + (item?.numUnitBudOH || 0),
          totalUnitActOH:
            accumulator.totalUnitActOH + (item?.numUnitActOH || 0),
          totalUnitVariance:
            accumulator.totalUnitVariance + (item?.numUnitVariance || 0),
        };
      },
      {
        totalBudOH: 0,
        totalAchOH: 0,
        totalTotalVariance: 0,
        totalUnitBudOH: 0,
        totalUnitActOH: 0,
        totalUnitVariance: 0,
      }
    );

    setTotals(newTotals);
  }, [rowData]);

  useEffect(() => {
    getGlList(
      `/mes/SalesPlanning/GetGeneralLedgers?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&accountGroupId=4`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {};
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Overhead Variance Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="gl"
                      options={glList || []}
                      value={values?.gl}
                      label="GL Name"
                      onChange={(valueOption) => {
                        setFieldValue("gl", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

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
                  <div style={{ marginTop: "17px" }}>
                    <button
                      disabled={
                        !values?.gl?.value ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        getRowData(
                          `/fino/Report/GetOverheadVarianceReport?businessUnitId=${selectedBusinessUnit?.value}&intGLId=${values?.gl?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }}
                      className="btn btn-primary"
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div>
                  {rowData?.length > 0 && (
                    <div className="mt-5">
                      <div>
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>Transaction Code</th>
                              <th>Transaction Name</th>
                              <th>Budget Overhead</th>
                              <th>Actual Overhead</th>
                              <th>Variance</th>
                              <th>BOH / Unit</th>
                              <th>AOH / Unit</th>
                              <th>Variance / Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.strBusinessTransactionCode}</td>
                                <td>{item?.strBusinessTransactionName}</td>
                                <td className="text-right">
                                  {item?.numBudOH?.toFixed()}
                                </td>
                                <td className="text-right">
                                  {item?.numAchOH?.toFixed()}
                                </td>
                                <td className="text-right">
                                  {item?.numTotalVariance?.toFixed()}
                                </td>
                                <td className="text-right">
                                  {item?.numUnitBudOH?.toFixed(2)}
                                </td>
                                <td className="text-right">
                                  {item?.numUnitActOH?.toFixed(2)}
                                </td>
                                <td className="text-right">
                                  {item?.numUnitVariance?.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={2}>
                                <strong>Total</strong>
                              </td>
                              <td className="text-right">
                                {totals?.totalBudOH?.toFixed()}
                              </td>
                              <td className="text-right">
                                {totals?.totalAchOH?.toFixed()}
                              </td>
                              <td className="text-right">
                                {totals?.totalTotalVariance?.toFixed()}
                              </td>
                              <td className="text-right">
                                {totals?.totalUnitBudOH?.toFixed(2)}
                              </td>
                              <td className="text-right">
                                {totals?.totalUnitActOH?.toFixed(2)}
                              </td>
                              <td className="text-right">
                                {totals?.totalUnitVariance?.toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
