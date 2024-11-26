/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useReducer, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import BreakDownModal from "./breakdownModal";
import CommonItemDetailsModal from "./rawMaterialModals/commonItemDetailsModal";
import {
  commonItemInitialState,
  commonItemReducer,
} from "./rawMaterialModals/helper";
import WarehouseStockModal from "./rawMaterialModals/warehouseStockModal";
import IConfirmModal from "../../../_helper/_confirmModal";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";

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

// init data
const initData = {
  businessUnit: "",
  // monthYear: _getCurrentMonthYearForInput(),
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function RawMaterialAutoPRNew() {
  // redux
  const { profileData, businessUnitList, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // state
  const [singleRowData, setSingleRowData] = useState();
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [warehouseStockModalShow, setWarehouseStockModalShow] = useState(false);
  const [, onCreateMRPFromProduction, saveLoader] = useAxiosPost()

  // reducer
  const [commonItemDetailsState, commonItemDetailsDispatch] = useReducer(
    commonItemReducer,
    commonItemInitialState
  );

  // axios
  const [
    autoRawMaterialData,
    getAutoRawMaterialData,
    loading,
    setAutoRawMaterialData,
  ] = useAxiosGet();

  const [
    mrpfromProductionScheduleLanding,
    getMrpfromProductionScheduleLanding,
    loading2,
    setMrpfromProductionScheduleLanding,
  ] = useAxiosGet();


  // save handler
  const saveHandler = (values, cb) => {



  };

  const getData = (values) => {
    setAutoRawMaterialData([]);
    setMrpfromProductionScheduleLanding([])
    getMrpfromProductionScheduleLanding(`/procurement/MRPFromProduction/MrpfromProductionScheduleLanding?businessUnitId=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`, (res) => {
      if (!res?.length) {
        getAutoRawMaterialData(
          `/procurement/MRPFromProduction/GetMRPFromProductionScheduleDetailsNew?businessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&isForecast=true`
        );
      }
    })
  };

  // func for get landing selected months & next months
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
          {(loading || saveLoader || loading2) && <Loading />}
          <IForm
            title="Raw Material Auto PR Calculation"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    disabled={!autoRawMaterialData?.length || mrpfromProductionScheduleLanding?.length}
                    className="btn btn-primary"
                    onClick={() => {
                      if (!autoRawMaterialData?.length) {
                        return
                      }

                      const payload = {
                        fromDate: values?.fromDate,
                        toDate: values?.toDate,
                        actionById: profileData?.userId,
                        actionByName: profileData?.userName,
                        businessUnitId: selectedBusinessUnit?.value,
                        businessUnitName: selectedBusinessUnit?.label,
                        accountId: profileData?.accountId,
                        row: autoRawMaterialData.map((item) => {

                          const avaiableBlance = (
                            (+item?.stockQty || 0) +
                            (+item?.numOpenPOQty || 0) +
                            (+item?.openPRQty || 0) -
                            (+item?.deadStockQuantity || 0)
                          ).toFixed(2);

                          return {
                            itemId: item.itemId || 0,
                            itemCode: item.itemCode || "",
                            itemName: item.itemName || "",
                            itemCategoryId: 0,
                            itemSubCategoryId: 0,
                            uoMid: item.uoMId || 0,
                            totalBudgetQty: item?.totalBudgetQty || 0,
                            stockQty: item.stockQty || 0,
                            inTransit: item.numOpenPOQty || 0,
                            openPrqty: item.openPRQty || 0,
                            avaiableBlance: parseFloat(avaiableBlance),
                            closingBlance: item.balanceOnGhat || 0,
                            deadStock: item.deadStockQuantity || 0,
                          };
                        }),
                      };


                      IConfirmModal({
                        message: `Are you sure to generate MRP ?`,
                        yesAlertFunc: () => {
                          onCreateMRPFromProduction(`/procurement/MRPFromProduction/CreateMRPFromProduction`, payload, () => {
                            getData(values)
                          }, true)

                        },
                        noAlertFunc: () => { },
                      });

                    }}
                  >
                    Save
                  </button>
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


                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                      disabled
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
                      min={values?.fromDate}
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
                </div>
                {mrpfromProductionScheduleLanding?.length ? <div>
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Schedule Code</th>
                          <th>From Date</th>
                          <th>To Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mrpfromProductionScheduleLanding?.length > 0 &&
                          mrpfromProductionScheduleLanding?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.mrpproductionScheduleCode}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.fromDate)}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.toDate)}
                                </td>
                                <td className="text-center">
                                  <span onClick={() => {

                                  }}>
                                    <IView />
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div> : <div>
                  {autoRawMaterialData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UOM</th>
                            <th>Total QTY</th>
                            <th>Warehouse Stock</th>
                            <th>Floating Stock</th>
                            <th>In Transit</th>
                            <th>Open PR</th>
                            <th>Dead Stock</th>
                            <th>Available Stock</th>
                            <th>Closing Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {autoRawMaterialData?.length > 0 &&
                            autoRawMaterialData?.map((item, index) => {
                              let availableStock = 0;

                              availableStock =
                                (
                                  (+item?.stockQty || 0) +
                                  (+item?.numOpenPOQty || 0) +
                                  (+item?.openPRQty || 0) -
                                  (+item?.deadStockQuantity || 0)
                                )?.toFixed(2) || 0;

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
                                    {item?.totalBudgetQty || 0}
                                  </td>
                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() => {
                                      setWarehouseStockModalShow(true);
                                      setSingleRowData(item);
                                    }}
                                  >
                                    {item?.stockQty?.toFixed(2) || 0}

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
                                    {item?.floatingStock || 0}
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
                                  </td>
                                  <td className="text-right">
                                    {item?.deadStockQuantity || 0}
                                  </td>
                                  <td className="text-right">
                                    {availableStock}
                                  </td>
                                  <td className="text-right">
                                    {((+item?.totalBudgetQty || 0) - (+availableStock || 0)).toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>}

              </>
            </Form>
            <IViewModal
              show={showBreakdownModal}
              onHide={() => {
                setShowBreakdownModal(false);
                setSingleRowData({});
              }}
            >
              <BreakDownModal
                singleRowData={singleRowData}
                setShowBreakdownModal={setShowBreakdownModal}
                setSingleRowData={setSingleRowData}
              />
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
