import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _getCurrentMonthYearForInput } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  businessUnit: "",
  monthYear: _getCurrentMonthYearForInput(),
};
export default function DistributionPlanReport() {
  const [rowData, setRowDta, rowDataLoading] = useAxiosGet();
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);
  const saveHandler = (values, cb) => {};

  const getData = (values) => {
    const splitMonthYear = values?.monthYear.split("-");
    const yearId = +splitMonthYear[0];
    const monthId = +splitMonthYear[1];
    setRowDta(
      `/fino/BudgetFinancial/GetTeritoryWiseDistribution?BusinessUnitId=${values?.businessUnit?.value}&YearId=${yearId}&MonthId=${monthId}`
    );
  };

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
        isValid,
        errors,
        touched,
      }) => (
        <>
          {rowDataLoading && <Loading />}
          <IForm
            title="Distribution Plan Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            //   renderProps={() => {
            //     return (
            //       <div>
            //         <button
            //           type="button"
            //           className="btn btn-primary"
            //           onClick={() => {
            //             history.push("route here");
            //           }}
            //         >
            //           Create
            //         </button>
            //       </div>
            //     );
            //   }}
          >
            <Form>
              <div>
                <div className="global-form align-items-end">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        label="Business Unit"
                        options={businessUnitList || ""}
                        value={values?.businessUnit}
                        name="businessUnit"
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                        }}
                        //   errors={errors}
                        //   touched={touched}
                      />
                    </div>
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
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: "18px" }}
                        onClick={() => {
                          getData(values);
                        }}
                        disabled={!values?.businessUnit || !values?.monthYear}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-3">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th colSpan={3}>Horizon</th>
                            <th colSpan={2}>Budget Qty with</th>
                            <th colSpan={2}>Actual Qty with Rate</th>
                            <th colSpan={2}>Variance</th>
                          </tr>
                          <tr>
                            <th>Area</th>
                            <th>Region</th>
                            <th>Territory</th>
                            <th>Direct</th>
                            {/* <th>Rate</th> */}
                            <th>Via-Transshipment</th>
                            {/* <th>Rate</th> */}
                            <th>Direct</th>
                            {/* <th>Rate</th> */}
                            <th>Via-Transshipment</th>
                            {/* <th>Rate</th> */}
                            <th>Direct</th>
                            {/* <th>Rate</th> */}
                            <th>Via-Transshipment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((row) => (
                              <tr>
                                <td>{row?.strAreaName}</td>
                                <td>{row?.srtRegionName}</td>
                                <td>{row?.strTerritoryName}</td>
                                <td style={{ textAlign: "right" }}>
                                  {row?.DirectShipmentQty}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {row?.ViaShipmentQty}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {row?.actDirectShipmentQty}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {row?.actViaShipmentQty}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {(row?.DirectShipmentQty || 0) -
                                    (row?.actDirectShipmentQty || 0)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {(row?.ViaShipmentQty || 0) -
                                    (row?.actViaShipmentQty || 0)}
                                </td>
                                {/* <td style={{textAlign:"right"}}>0</td>
                            <td style={{textAlign:"right"}}>0</td>
                            <td style={{textAlign:"right"}}>0</td>
                            <td style={{textAlign:"right"}}>0</td> */}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
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
