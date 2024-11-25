/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useReducer, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _getCurrentMonthYearForInput } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import BreakDownModal from "./breakdownModal";
import CommonItemDetailsModal from "./rawMaterialModals/commonItemDetailsModal";
import {
  commonItemInitialState,
  commonItemReducer,
} from "./rawMaterialModals/helper";
import WarehouseStockModal from "./rawMaterialModals/warehouseStockModal";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";

const months = [
  { name: "Jan", value: 1 },
  { name: "Feb", value: 2 },
  { name: "Mar", value: 3 },
  { name: "Apr", value: 4 },
  { name: "May", value: 5 },
  { name: "Jun", value: 6 },
  { name: "Jul", value: 7 },
  { name: "Aug", value: 8 },
  { name: "Sep", value: 9 },
  { name: "Oct", value: 10 },
  { name: "Nov", value: 11 },
  { name: "Dec", value: 12 },
];

const initData = {
  businessUnit: "",
  monthYear: _getCurrentMonthYearForInput(),
};
export default function RawMaterialAutoPR() {
  const saveHandler = (values, cb) => {};
  const [
    autoRawMaterialData,
    getAutoRawMaterialData,
    loading,
    setAutoRawMaterialData,
  ] = useAxiosGet();
  const [, saveHeaderData, loader] = useAxiosPost();

  // state
  const [singleRowData, setSingleRowData] = useState();
  const [warehouseStockModalShow, setWarehouseStockModalShow] = useState(false);
  const [commonItemDetailsState, commonItemDetailsDispatch] = useReducer(
    commonItemReducer,
    commonItemInitialState
  );

  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  const getData = (values) => {
    getAutoRawMaterialData(
      `/procurement/AutoPurchase/GetInsertPRCalculationNew?BusinessUnitId=${
        values?.businessUnit?.value
      }&FromMonth=${`${values?.monthYear?.split("-")[0]}-${
        values?.monthYear?.split("-")[1]
      }-01`}&ItemCategoryId=0&ItemSubCategoryId=0`
    );
  };

  const getSelectedAndNextMonths = (selectedValue) => {
    const selectedIndex = months.findIndex(
      (month) => month?.value === +selectedValue
    );

    if (selectedIndex === -1) return []; // Return empty if month not found

    // Get the selected month and the next two months, using modulo for wrapping around the array
    return [
      months[selectedIndex],
      months[(selectedIndex + 1) % months.length],
      months[(selectedIndex + 2) % months.length],
    ];
  };

  // console.log(autoRawMaterialData);

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
          {(loading || loader) && <Loading />}
          <IForm
            title="Raw Material Auto PR Calculation"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {/* <button
                    type="button"
                    disabled={!autoRawMaterialData?.length}
                    className="btn btn-primary"
                    onClick={() => {
                      console.log("save");
                        IConfirmModal({
                          message: `Are you sure to create PR ?`,
                          yesAlertFunc: () => {
                            onCreatePRHandler(
                              `/procurement/AutoPurchase/GetFormatedItemListForAutoPRCreate`,
                              payLoad,
                              () => {
                                getData(values);
                              },
                              true
                            );
                          },
                          noAlertFunc: () => {},
                        });
                    }}
                  >
                    Save
                  </button> */}
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption || "");
                        setAutoRawMaterialData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <YearMonthForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: (allValues) => {
                        setAutoRawMaterialData([]);
                      },
                    }}
                  /> */}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.monthYear}
                      name="monthYear"
                      label="Month & Year"
                      type="month"
                      onChange={(e) => {
                        setFieldValue("monthYear", e?.target?.value);
                        setAutoRawMaterialData([]);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        getData(values);
                      }}
                      disabled={!values?.businessUnit}
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                  {autoRawMaterialData?.length > 0 &&
                    !autoRawMaterialData?.[0]?.prCalculationHeaderId && (
                      <div className="ml-4">
                        <button
                          type="button"
                          onClick={() => {
                            const payload = autoRawMaterialData?.map((itm) => {
                              let totalBudgetQty = 0;
                              let availableStock = 0;

                              availableStock =
                                (
                                  (itm?.stockQty ?? 0) +
                                  (itm?.numOpenPOQty ?? 0) +
                                  (itm?.inTransit ?? 0) +
                                  (itm?.openPRQty ?? 0) -
                                  (itm?.deadStockQuantity ?? 0)
                                )?.toFixed(2) || 0;

                              totalBudgetQty =
                                +itm?.firstMonthQty ||
                                0 + +itm?.secondMonthQty ||
                                0 + +itm?.thirdMonthQty ||
                                0;

                              // console.log(availableStock);
                              // console.log("T", totalBudgetQty);

                              return {
                                ...itm,
                                prCalculationHeaderId: 0,
                                businessUnitId:
                                  values?.businessUnit?.value || 0,
                                businessUnitName:
                                  values?.businessUnit?.label || "",
                                fromDate: _monthFirstDate(values?.monthYear),
                                toDate: _monthLastDate(values?.monthYear),
                                itemCategoryId: 0,
                                itemSubCategoryId: 0,
                                secondMonthQty: itm?.secondMonthQty || 0,
                                thirdMonthQty: itm?.thirdMonthQty || 0,
                                totalBudgetQty: totalBudgetQty,
                                inTransit: 0,
                                openPRQty: itm?.openPRQty || 0,
                                availableStock: availableStock,
                                closingBlance:
                                  (totalBudgetQty - availableStock).toFixed(
                                    2
                                  ) || 0,

                                intActionBy: profileData?.userId,
                              };
                            });
                            // console.log(payload)
                            saveHeaderData(
                              `/procurement/AutoPurchase/CreatePRCalculationHeader`,
                              payload,
                              () => {
                                getAutoRawMaterialData(
                                  `/procurement/AutoPurchase/GetInsertPRCalculation?BusinessUnitId=${
                                    values?.businessUnit?.value
                                  }&FromMonth=${`${
                                    values?.monthYear?.split("-")[0]
                                  }-${
                                    values?.monthYear?.split("-")[1]
                                  }-01`}&ItemCategoryId=0&ItemSubCategoryId=0`
                                );
                              },
                              true
                            );
                          }}
                          disabled={!values?.businessUnit}
                          className="btn btn-primary mt-5"
                        >
                          Save
                        </button>
                      </div>
                    )}
                </div>

                <div>
                  {autoRawMaterialData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UOM</th>
                            <th style={{ width: "80px" }}>
                              {
                                getSelectedAndNextMonths(
                                  values?.monthYear?.split("-")[1] || 0
                                )?.[0]?.name
                              }
                            </th>
                            <th style={{ width: "80px" }}>
                              {
                                getSelectedAndNextMonths(
                                  values?.monthYear?.split("-")[1] || 0
                                )?.[1]?.name
                              }
                            </th>
                            <th style={{ width: "80px" }}>
                              {
                                getSelectedAndNextMonths(
                                  values?.monthYear?.split("-")[1]
                                )?.[2]?.name
                              }
                            </th>

                            <th>Total QTY</th>
                            <th>Warehouse Stock</th>
                            <th>Floating Stock</th>
                            <th>In Transit</th>
                            <th>Open PR</th>
                            <th>Dead Stock</th>
                            <th>Available Stock</th>
                            <th>Closing Balance</th>
                            <th>
                              {`${
                                getSelectedAndNextMonths(
                                  values?.monthYear?.split("-")[1]
                                )?.[0]?.name
                              } Requirment` || ""}
                            </th>
                            {/* <th>Total Requirment</th> */}
                            <th>Schedule Quantity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {autoRawMaterialData?.length > 0 &&
                            autoRawMaterialData?.map((item, index) => {
                              let totalBudgetQty = 0;
                              let availableStock = 0;

                              availableStock =
                                (
                                  (item?.stockQty ?? 0) +
                                  (item?.numOpenPOQty ?? 0) +
                                  (item?.inTransit ?? 0) +
                                  (item?.openPRQty ?? 0) -
                                  (item?.deadStockQuantity ?? 0)
                                )?.toFixed(2) || 0;

                              totalBudgetQty =
                                +item?.firstMonthQty ||
                                0 + +item?.secondMonthQty ||
                                0 + +item?.thirdMonthQty ||
                                0;

                              // console.log(availableStock);
                              // console.log("T", totalBudgetQty);
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-center">
                                    {item?.itemCode}
                                  </td>
                                  <td>{item?.itemName}</td>
                                  <td className="text-center">
                                    {item?.uomName}
                                  </td>
                                  <td className="text-right">
                                    {item?.firstMonthQty || 0}
                                  </td>
                                  <td className="text-right">
                                    {item?.secondMonthQty || 0}
                                  </td>
                                  <td className="text-right">
                                    {item?.thirdMonthQty || 0}
                                  </td>
                                  <td className="text-right">
                                    {totalBudgetQty || 0}
                                  </td>
                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() => {
                                      setWarehouseStockModalShow(true);
                                      setSingleRowData(item);
                                    }}
                                  >
                                    {item?.stockQty?.toFixed(2) || 0}
                                    {/* <InfoCircle
                                    clickHandler={() => {
                                      setWarehouseStockModalShow(true);
                                      setSingleRowData(item);
                                    }}
                                  /> */}
                                  </td>
                                  <td
                                    onClick={() =>
                                      commonItemDetailsDispatch({
                                        type: "FloatingStock",
                                        payload: { singleRowData: item },
                                      })
                                    }
                                    className="text-right text-primary cursor-pointer"
                                  >
                                    {/* //  ! Update for now */}0
                                    {/* {item?.floatingStock.toFixed(2) || 0} */}
                                    {/* <InfoCircle
                                    clickHandler={() =>
                                      commonItemDetailsDispatch({
                                        type: "FloatingStock",
                                        payload: { singleRowData: item },
                                      })
                                    }
                                  /> */}
                                  </td>

                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() =>
                                      commonItemDetailsDispatch({
                                        type: "OpenPo",
                                        payload: { singleRowData: item },
                                      })
                                    }
                                  >
                                    {item?.numOpenPOQty?.toFixed(2) || 0}
                                    {/* <InfoCircle
                                    clickHandler={() =>
                                      commonItemDetailsDispatch({
                                        type: "OpenPo",
                                        payload: { singleRowData: item },
                                      })
                                    }
                                  /> */}
                                  </td>

                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() =>
                                      commonItemDetailsDispatch({
                                        type: "OpenPR",
                                        payload: { singleRowData: item },
                                      })
                                    }
                                  >
                                    {item?.openPRQty?.toFixed(2) || 0}
                                    {/* <InfoCircle
                                    clickHandler={() =>
                                      commonItemDetailsDispatch({
                                        type: "OpenPR",
                                        payload: { singleRowData: item },
                                      })
                                    }
                                  /> */}
                                  </td>
                                  <td className="text-right">
                                    {item?.deadStockQuantity || 0}
                                  </td>
                                  <td className="text-right">
                                    {availableStock}
                                  </td>
                                  <td className="text-right">
                                    {(totalBudgetQty - availableStock).toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                  <td className="text-right">
                                    {(
                                      (item?.firstMonthQty ?? 0) -
                                      ((item?.stockQty ?? 0) +
                                        ((item?.numOpenPOQty ?? 0) -
                                          (item?.balanceOnGhat ?? 0)) +
                                        (item?.inTransit ?? 0) -
                                        (item?.deadStockQuantity ?? 0)) -
                                      (item?.openPRQty ?? 0)
                                    )?.toFixed(2) || 0}
                                  </td>
                                  {/* <td className="text-right">
                                  {(
                                    item?.totalBudgetQty -
                                    (item?.stockQty +
                                      (item?.numOpenPOQty -
                                        item?.balanceOnGhat) +
                                      item?.inTransit -
                                      item?.deadStockQuantity) -
                                    item?.openPRQty
                                  ).toFixed(2) || 0}
                                </td> */}
                                  <td className="text-center">
                                    {item?.scheduleQuantity?.toFixed(2) || 0}
                                  </td>
                                  <td className="text-center">
                                    {item?.prCalculationHeaderId &&
                                      item?.firstMonthQty -
                                        item?.availableStock >
                                        0 && (
                                        <span
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            if (
                                              item?.firstMonthQty -
                                                item?.availableStock >
                                              0
                                            ) {
                                              setSingleRowData(item);
                                              setShowBreakdownModal(true);
                                            } else {
                                              toast.warn(
                                                `You don't need to break down this item for the month ${
                                                  getSelectedAndNextMonths(
                                                    values?.monthYear?.split(
                                                      "-"
                                                    )[1] || 0
                                                  )?.[0]?.name
                                                }`
                                              );
                                            }
                                          }}
                                        >
                                          <i
                                            style={{ fontSize: "16px" }}
                                            className="fa fa-plus-square text-primary mr-2"
                                          />
                                        </span>
                                      )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            </Form>
            <IViewModal
              show={showBreakdownModal}
              onHide={() => {
                setShowBreakdownModal(false);
                setSingleRowData({});
              }}
            >
              <BreakDownModal singleRowData={singleRowData} />
            </IViewModal>

            {/* Warehouse Stock Details Modal */}
            <IViewModal
              show={warehouseStockModalShow}
              onHide={() => {
                setWarehouseStockModalShow(false);
                setSingleRowData({});
              }}
            >
              <WarehouseStockModal
                objProp={{
                  singleRowData,
                  setSingleRowData,
                  values,
                }}
              />
            </IViewModal>

            {/* Common Item Details Modal */}
            <IViewModal
              show={commonItemDetailsState?.modalShow}
              onHide={() => {
                commonItemDetailsDispatch({ type: "Close" });
              }}
            >
              <CommonItemDetailsModal
                objProp={{
                  commonItemDetailsState,
                  commonItemDetailsDispatch,
                  values,
                }}
              />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
