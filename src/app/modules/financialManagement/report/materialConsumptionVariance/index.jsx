import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import "./style.css";

const initData = {
  monthYear: "",
};

function MaterialConsumptionVariance() {
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet();
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Material Consumption Variance"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/invoicemanagement-system/salesInvoice/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="global-form row">
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
                  <div>
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      class="btn btn-primary"
                      disabled={!values?.monthYear}
                      onClick={() => {
                        getRowDto(
                          `/fino/Report/GetRawMaterialConsumptionVarianceReport?intBusinessUnitId=${
                            selectedBusinessUnit?.value
                          }&fromDate=${`${values?.monthYear}-01`}&toDate=${`${values?.monthYear}-01`}`,
                          (data) => {
                            let sl = 0;
                            let arr = [];
                            data.forEach((item) => {
                              let obj = {
                                ...item,
                                isShow:
                                  sl === item?.intSectionSl ? false : true,
                              };
                              if (sl !== item?.intSectionSl) {
                                sl = item?.intSectionSl;
                              }
                              arr.push(obj);
                            });
                            setRowDto(arr);
                          }
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12">
                  <div className="table-responsive">
  <table className="table table-striped table-bordered bj-table bj-table-landing material-consumption-variance">
                      <thead>
                        <tr>
                          <th>FG Item</th>
                          <th>FG Item Budget[UoM]</th>
                          <th>Material Name</th>
                          <th>UOM</th>
                          <th>Budget Consumption per unit</th>
                          <th>Actual Consumption per unit</th>
                          <th>Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.length > 0 &&
                          rowDto?.map((item, index) => (
                            <tr key={index}>
                              {item?.isShow ? (
                                <>
                                  <td rowSpan={item?.intSectionCount}>
                                    {item?.fgItemName}
                                  </td>
                                  <td
                                    className="text-center"
                                    rowSpan={item?.intSectionCount}
                                  >
                                    {item?.fgItemBudgetWithUom}
                                  </td>
                                </>
                              ) : null}
                              <td
                                className={
                                  item?.isTotal ? "text-left bold" : "text-left"
                                }
                              >
                                {item?.materialName}
                              </td>
                              <td>{item?.materialUom}</td>
                              <td
                                className={
                                  item?.isTotal
                                    ? "text-right bold"
                                    : "text-right"
                                }
                              >
                                {_formatMoney(item?.budgetConsumption)}
                              </td>
                              <td
                                className={
                                  item?.isTotal
                                    ? "text-right bold"
                                    : "text-right"
                                }
                              >
                                {_formatMoney(item?.actualConsumption)}
                              </td>
                              <td
                                className={
                                  item?.isTotal
                                    ? "text-right bold"
                                    : "text-right"
                                }
                              >
                                {_formatMoney(item?.variance)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
</div>
                  
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default MaterialConsumptionVariance;
