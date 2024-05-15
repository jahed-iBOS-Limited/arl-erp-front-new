/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import {
  getPoBaseReport,
  getShopFloorDDL,
  GetPlantDDL,
  getItemBaseReport,
  getAllItemBaseReport,
  getItemDDL,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import "./style.css";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls/Card";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

const initData = {
  plant: "",
  shopFloor: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  productionOrder: "",
  item: "",
  reportType: "",
};

// Dummy Data set For Test
// const dummyData = [
//   {
//     referenceName: "Calcium Carbonate (Local)",
//     type: "Bill Of Material",
//     productionCostType: null,
//     amount: 340.963679,
//   },
//   {
//     referenceName: "Labor Cost",
//     type: "Bill Of Expense",
//     productionCostType: "Factory Overhead",
//     amount: 0.0,
//   },
//   {
//     referenceName: "Master Batch-Beige Grade: EP-61729",
//     type: "Bill Of Expense",
//     productionCostType: "Direct Labour",
//     amount: 106.475295,
//   },
//   {
//     referenceName: "Master Batch-OXO Biodegradable PW-EP-OBD",
//     type: "Bill Of Expense",
//     productionCostType: "Factory Overhead",
//     amount: 141.34915,
//   },
//   {
//     referenceName: "PP Yarn Grade",
//     type: "Bill Of Material",
//     productionCostType: null,
//     amount: 4904.127702,
//   },
//   {
//     referenceName: "Recycle Beige Color",
//     type: "Bill Of Material",
//     productionCostType: null,
//     amount: 0.0,
//   },
// ];

function CostSheetReportLanding() {
  const [loading, setLoading] = useState(false);

  const [gridData, setGridData] = useState([]);
  const [billOfExData, setBillOfExData] = useState([]);

  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  // Plant DDL
  useEffect(() => {
    GetPlantDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // Calculate All Total
  const totalCalculator = (dataList) => {
    return dataList?.reduce((acc, item) => acc + +item?.amount, 0);
  };

  // Set Data Bill Of Expense
  useEffect(() => {
    let data = filterUniqeCostTypeWithArray();
    setBillOfExData(data);
  }, [gridData]);

  const filterUniqeCostTypeWithArray = () => {
    let uniqueCostTypeArray = [];
    let finalBillOfExpenseList = [];
    const billOfExpense = gridData?.filter(
      (item) => item?.type !== "Bill Of Material"
    );
    for (let i = 0; i < billOfExpense.length; i++) {
      if (
        uniqueCostTypeArray?.includes(billOfExpense[i]?.productionCostType) ===
        false
      ) {
        uniqueCostTypeArray = [
          ...uniqueCostTypeArray,
          billOfExpense[i]?.productionCostType,
        ];
        finalBillOfExpenseList = [
          ...finalBillOfExpenseList,
          {
            type: billOfExpense[i]?.productionCostType,
            arr: gridData?.filter(
              (item) =>
                item?.productionCostType ===
                billOfExpense[i]?.productionCostType
            ),
          },
        ];
      }
    }
    return finalBillOfExpenseList;
  };

  const printRef = useRef();

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Cost Sheet Report"}>
              <CardHeaderToolbar>
                {gridData?.length > 0 && (
                  <ReactToPrint
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary px-4 py-1"
                      >
                        <img
                          style={{
                            width: "25px",
                            paddingRight: "5px",
                          }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                )}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <>
                {console.log("Values", values)}
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-12 row m-0 p-0">
                      <div className="col-lg-3 pb-2">
                        <NewSelect
                          name="reportType"
                          options={[
                            { label: "Production Order", value: 1 },
                            { label: "Item", value: 2 },
                            { label: "All Item", value: 3 },
                          ]}
                          value={values?.reportType}
                          onChange={(valueOption) => {
                            setFieldValue("plant", "");
                            setFieldValue("shopFloor", "");
                            setFieldValue("item", "");
                            setGridData([]);

                            setFieldValue("reportType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          label="Report Type"
                          placeholder="Report Type"
                        />
                      </div>

                      <div className="col-lg-3 pb-2">
                        <NewSelect
                          name="plant"
                          options={plantDDL}
                          value={values?.plant}
                          onChange={(valueOption) => {
                            setFieldValue("plant", valueOption);
                            getShopFloorDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setShopFloorDDL
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          label="Plant Name"
                          placeholder="Plant Name"
                        />
                      </div>
                      <div className="col-lg-3 pb-2">
                        <NewSelect
                          name="shopFloor"
                          options={shopFloorDDL}
                          value={values?.shopFloor}
                          onChange={(valueOption) => {
                            setFieldValue("shopFloor", valueOption);
                            getItemDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.plant?.value,
                              valueOption?.value,
                              setItemDDL
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          label="Shop Floor"
                          placeholder="Shop Floor"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 row mx-0 mt-4 p-0">
                      {values?.reportType?.value === 1 && (
                        <div className="col-lg-3">
                          <label>Production Order</label>
                          <InputField
                            value={values?.productionOrder}
                            name="productionOrder"
                            placeholder="Production Order"
                            type="text"
                          />
                        </div>
                      )}

                      {values?.reportType?.value === 2 && (
                        <div className="col-lg-3 pb-2">
                          <NewSelect
                            name="item"
                            options={itemDDL}
                            value={values?.item}
                            onChange={(valueOption) => {
                              setFieldValue("item", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                            label="Item"
                            placeholder="Item"
                          />
                        </div>
                      )}

                      {(values?.reportType?.value === 2 ||
                        values?.reportType?.value === 3) && (
                        <>
                          <div className="col-lg-3">
                            <label>From Date</label>
                            <InputField
                              value={values?.fromDate}
                              name="fromDate"
                              placeholder="From Date"
                              type="date"
                            />
                          </div>

                          <div className="col-lg-3">
                            <label>To Date</label>
                            <InputField
                              value={values?.toDate}
                              name="toDate"
                              placeholder="To Date"
                              type="date"
                            />
                          </div>
                        </>
                      )}

                      {values?.reportType?.value && (
                        <div style={{ marginTop: "15px" }} className="col-lg-1">
                          <button
                            disabled={
                              !values?.plant?.value || !values?.shopFloor?.value
                            }
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              // PO Base Report
                              if (values?.reportType?.value === 1) {
                                getPoBaseReport(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  values?.productionOrder,
                                  setGridData,
                                  setLoading
                                );
                              } else if (values?.reportType?.value === 2) {
                                getItemBaseReport(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  values?.fromDate,
                                  values?.toDate,
                                  values?.item?.value,
                                  values?.shopFloor?.value,
                                  setGridData,
                                  setLoading
                                );
                              } else if (values?.reportType?.value === 3) {
                                getAllItemBaseReport(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  values?.fromDate,
                                  values?.toDate,
                                  values?.shopFloor?.value,
                                  setGridData,
                                  setLoading
                                );
                              }
                            }}
                          >
                            Show
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {gridData?.length > 0 && (
                    <>
                      <div className="row">
                        <div ref={printRef} className="col-lg-8">
                          <div className="table-responsive">
                            <table class="table cost-sheet-report-table">
                              <thead>
                                <tr className="cost-sheet-report-table-thead-tr">
                                  <th>
                                    <div className="text-left ">
                                      Particulars
                                    </div>
                                  </th>
                                  <th>
                                    <div className="text-right ">Amount</div>
                                  </th>
                                  <th>
                                    <div className="text-right ">Amount</div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* 1st Part Start */}
                                {gridData?.length > 0 && (
                                  <>
                                    {gridData?.map((item) => (
                                      <>
                                        {item?.type === "Bill Of Material" && (
                                          <>
                                            <tr className="cost-sheet-report-table-tbody-tr">
                                              <td>
                                                <div className="text-left pl-2">
                                                  {item?.referenceName}
                                                </div>
                                              </td>
                                              <td></td>
                                              <td>
                                                <div className="text-right pr-2">
                                                  {item?.amount.toFixed(2)}
                                                </div>
                                              </td>
                                            </tr>
                                          </>
                                        )}
                                      </>
                                    ))}
                                    <tr
                                      style={{
                                        borderTop: "1px solid grey",
                                      }}
                                      className="cost-sheet-report-table-tbody-tr"
                                    >
                                      <td>
                                        <div className="text-left pl-2">
                                          <strong>Prime Cost</strong>
                                        </div>
                                      </td>
                                      <td></td>
                                      <td>
                                        <div className="text-right pr-2">
                                          <strong>
                                            {totalCalculator(
                                              gridData?.filter(
                                                (item) =>
                                                  item?.type ===
                                                  "Bill Of Material"
                                              )
                                            ).toFixed(2)}
                                          </strong>
                                        </div>
                                      </td>
                                    </tr>
                                    {billOfExData?.map((item) => (
                                      <>
                                        <tr
                                          style={{
                                            borderBottom: "1px solid grey",
                                          }}
                                          className="cost-sheet-report-table-tbody-tr"
                                        >
                                          <td style={{ height: "30px" }}>
                                            <div className="text-left pl-2 ">
                                              <strong>Add: {item?.type}</strong>
                                            </div>
                                          </td>
                                          <td></td>
                                          <td>
                                            <div className="text-right pr-2 ">
                                              <strong>
                                                {totalCalculator(
                                                  item?.arr
                                                ).toFixed(2)}
                                              </strong>
                                            </div>
                                          </td>
                                        </tr>
                                        {item?.arr?.map((arrItem) => (
                                          <>
                                            <tr className="cost-sheet-report-table-tbody-tr">
                                              <td>
                                                <div className="text-left pl-6">
                                                  {arrItem?.referenceName}
                                                </div>
                                              </td>
                                              <td>
                                                <div className="text-right pr-2">
                                                  {arrItem?.amount.toFixed(2)}
                                                </div>
                                              </td>
                                              <td></td>
                                            </tr>
                                          </>
                                        ))}
                                      </>
                                    ))}
                                    <tr
                                      style={{ height: "50px" }}
                                      className="cost-sheet-report-table-tbody-tr"
                                    >
                                      <td className="pt-4">
                                        <div className="text-left pl-2">
                                          <strong>Cost Of Production</strong>
                                        </div>
                                      </td>
                                      <td></td>
                                      <td className="pt-4">
                                        <div className="text-right pr-2">
                                          {totalCalculator(gridData).toFixed(2)}
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Form>
              </>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default CostSheetReportLanding;
