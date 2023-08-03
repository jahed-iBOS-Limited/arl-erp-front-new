import { Form, Formik } from "formik";
import React from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _todayDate } from "../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import WIPTable from "./wipTable";
import YeildReport from "./yeildReport";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: "",
};
export default function Yeildreport() {
  const [gridData, setGridData] = React.useState([]);
  const [, getTableData, tableDataLoader] = useAxiosGet();
  const [, getYearldReportPivot, YearldReportPivotLoading] = useAxiosGet();

  const saveHandler = (values, cb) => { };

  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
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
          {(tableDataLoader || YearldReportPivotLoading) && <Loading />}
          <IForm
            title="Yeild Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setGridData([])
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
                      setGridData([])
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: "Yeild Report" },
                      { value: 2, label: "WIP" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                      setGridData([])
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mr-2"
                    style={{
                      marginTop: "20px",
                    }}
                    type="button"
                    disabled={
                      !values?.fromDate ||
                      !values?.toDate ||
                      !values?.reportType
                    }
                    onClick={() => {

                      if (values?.reportType?.value === 1) {
                        // yeild api call

                        getYearldReportPivot(`/mes/ProductionEntry/GetYearldReportPivot?unitId=${selectedBusinessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intPartId=${values?.reportType?.value}`, (data) => {
                          setGridData(data)
                        });

                      } else {
                        // WIP api call
                        getTableData(
                          `/mes/ProductionEntry/GetYearldReport?unitId=${selectedBusinessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intPartId=${values?.reportType?.value}`,
                          (data) => {
                            setGridData(data)
                          }
                        );
                      }

                    }}
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Yeild Report table */}
              {values?.reportType?.value === 1 && (
                <YeildReport tableData={gridData} />
              )}

              {/*  WIP Table */}
              {values?.reportType?.value === 2 && <WIPTable tableData={gridData} />}


              {/* <div className="row">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered global-table">
                    {values?.reportType?.value === 1 ? (
                      <>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Production Order Id</th>
                            <th>Item Id</th>
                            <th>Item Name</th>
                            <th>Producation Qty (bag)</th>
                            <th>Producation Qty</th>
                            <th>By Product</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {item?.intproductionorderid}
                              </td>
                              <td className="text-center">{item?.intitemid}</td>
                              <td>{item?.stritemname}</td>
                              <td className="text-right">
                                {item?.producationqtyBag}
                              </td>
                              <td className="text-right">
                                {item?.producationQty}
                              </td>
                              <td className="text-right">{item?.byproduct}</td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    ) : values?.reportType?.value === 2 ? (
                      <>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Id</th>
                            <th>Item Name</th>
                            <th>Con Quantity</th>
                            <th>Issue</th>
                            <th>WIP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">{item?.mitemid}</td>
                              <td>{item?.stritemname}</td>
                              <td className="text-right">{item?.conqty}</td>
                              <td className="text-right">{item?.issue}</td>
                              <td className="text-right">{item?.wip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    ) : (
                      <></>
                    )}
                  </table>
                </div>
              </div> */}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
