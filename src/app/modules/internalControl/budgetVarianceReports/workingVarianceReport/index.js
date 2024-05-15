import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  currentBusinessUnit: "",
  toDate: _todayDate(),
};
const InventoryVarianceReport = () => {
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();

  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Inventory Variance Report"}></CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="currentBusinessUnit"
                        options={businessUnitList}
                        value={values?.currentBusinessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("currentBusinessUnit", valueOption);
                            setRowData([]);
                          } else {
                            setFieldValue("currentBusinessUnit", "");
                            setRowData([]);
                          }
                        }}
                        placeholder="Business Unit"
                        errors={errors}
                        touched={touched}
                        required={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="todate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    {console.log(values)}
                    <div>
                      <button
                        style={{ marginTop: "20px" }}
                        className="btn btn-primary ml-2"
                        disabled={
                          !values?.currentBusinessUnit || !values?.toDate
                        }
                        onClick={() => {
                          getRowData(
                            `/fino/Report/GetInventoryVarianceReport?businessUnitId=${values?.currentBusinessUnit?.value}&toDate=${values?.toDate}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                {rowData?.length > 0 && (
                  <div className="row mt-5">
                    <div className="col-lg-12 cost-of-production">
                      <div className="table-responsive">
                        <table
                          id="table-to-xlsx"
                          className="table table-striped table-bordered bj-table bj-table-landing"
                        >
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Item Name</th>
                              <th>Item Code</th>
                              <th>Item Type</th>
                              <th>Actual (Safety Stock)</th>
                              <th>Average Stock</th>
                              <th>Variance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.length > 0 &&
                              rowData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td
                                    className="text-center"
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {item?.strItemName}
                                  </td>
                                  <td
                                    className="text-center"
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {item?.strItemCode}
                                  </td>
                                  <td
                                    className="text-center"
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {item?.strItemTypeName}
                                  </td>
                                  <td
                                    className="text-center"
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {numberWithCommas(
                                      Math.round(
                                        item?.numSafetyStockQuantity
                                      ) || 0
                                    )}
                                  </td>
                                  <td
                                    className="text-center"
                                    // rowSpan={item?.intSectionCount}
                                  >
                                    {numberWithCommas(
                                      Math.round(item?.numAvgStock) || 0
                                    )}
                                  </td>
                                  <td>
                                    {numberWithCommas(
                                      Math.round(
                                        +item?.numSafetyStockQuantity -
                                          +item?.numAvgStock
                                      )
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default InventoryVarianceReport;
