/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { StockInToInventoryApproval } from "../../challanEntry/helper";
import { CreateLighterDumpBill, updateUnloadingQtyAndRates } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  supplier: "",
  unloadedQty: "",
  dumpDeliveryRate: "",
  directRate: "",
  bolgateToDamRate: "",
  damToTruckRate: "",
  lighterToBolgateRate: "",
  truckToDamRate: "",
  othersCostRate: "",
  decTruckToDamOutSideRate: "",
  decBiwtarate: "",
  decShipSweepingRate: "",
  decScaleRate: "",
  decDailyLaboureRate: "",

  dumpDeliveryQty: "",
  directQty: "",
  bolgateToDamQty: "",
  damToTruckQty: "",
  lighterToBolgateQty: "",
  truckToDamQty: "",
  othersCostQty: "",
  decTruckToDamOutSideQty: "",
  decBiwtaQty: "",
  decShipSweepingQty: "",
  decScaleQty: "",
  decDailyLaboureQty: "",
  othersLabourPerson: 0,
  othersLabourPersonRate: 0,
  dailyLabourAmount: 0,
  totalBillAmount: "",
  remainingDumpQnt: "",
  date: _todayDate(),
};

export default function WarehouseApproveFrom({
  getData,
  preValues,
  singleItem,
  pageNo,
  pageSize,
  setShow,
  levelOfApprove,
}) {
  const [rates, getRates, loading] = useAxiosGet();
  const [isTruckToDampDayByDay, getIsTruckToDampDayByDay] = useAxiosGet();

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const loadOptions = async (v) => {
    await [];
    if (v.length < 3) return [];
    return axios
      .get(
        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
        }));
        return [...updateList];
      });
  };

  useEffect(() => {
    const param = `&shippointId=${singleItem?.shipPointId}`;

    const URLOne = `/tms/LigterLoadUnload/GetGodownNOtherLabourRate?type=${1}&businessUnitId=${buId}${param}`;
    const URLTwo = `/tms/LigterLoadUnload/GetLighterLoadUnloadBillDetails?voyageId=${singleItem?.voyageNo}&lighterVesselId=${singleItem?.lighterVesselId}&shipPointId=${singleItem?.shipPointId}`;
    const URLThree = `/tms/LigterLoadUnload/GetLighterLoadUnloadBillDetails?voyageId=${singleItem?.voyageNo}&lighterVesselId=${singleItem?.lighterVesselId}&shipPointId=${singleItem?.shipPointId}`;

    const URL =
      levelOfApprove === "first"
        ? URLOne
        : levelOfApprove === "second"
        ? URLTwo
        : levelOfApprove === "third"
        ? URLThree
        : "";

    getRates(URL, (resData) => {});
    getIsTruckToDampDayByDay(
      `/tms/LigterLoadUnload/IsDayByDayTruckToDumpDelivery?shipPointId=${singleItem?.shipPointId}`
    );
  }, []);

  const approveSubmitHandler = (values) => {
    const payloadOne = {
      voyageNo: singleItem?.voyageNo,
      motherVesselId: singleItem?.motherVesselId,
      lighterVesselId: singleItem?.lighterVesselId,
      supplierId: values?.supplier?.value,
      supplierName: values?.supplier?.label,
      shipPointId: singleItem?.shipPointId,
      actionBy: userId,
      quantity: +values?.unloadedQty,
      dumpQnt: +values?.dumpDeliveryQty,
      dumpRate: +values?.dumpDeliveryRate,
      directQnt: +values?.directQty,
      directRate: +values?.directRate,
      bolgateToDumpQnt: +values?.bolgateToDamQty,
      bolgateToDumpRate: +values?.bolgateToDamRate,
      dumpToTruckQnt: +values?.damToTruckQty,
      dumpToTruckRate: +values?.damToTruckRate,
      lighterToBolgateQnt: +values?.lighterToBolgateQty,
      lighterToBolgateRate: +values?.lighterToBolgateRate,
      truckToDumpOutsideQnt: +values?.decTruckToDamOutSideQty,
      truckToDumpOutsideRate: +values?.decTruckToDamOutSideRate,
      biwtarate: +values?.decBiwtarate,
      shipSweepingRate: +values?.decShipSweepingRate,
      scaleRate: +values?.decScaleRate,
      dailyLaboureRate: +values?.decDailyLaboureRate,
      truckToDamQnt: +values?.truckToDamQty,
      truckToDamRate: +values?.truckToDamRate,
      othersCostQnt: 1,
      othersCostRate: +values?.othersCostRate,

      // all quantity
      // biwtaqnt: 1,
      biwtaqnt: +values?.unloadedQty,
      shipSweepingQnt: 1,
      decScaleQnt: 1,
      dailyLaboureQnt: 1,
    };
    const payloadTwo = {
      rowId: values?.rowId,
      voyageNo: values?.voyageNo,
      lighterVesselId: values?.lighterVesselId,
      supplierId: values?.supplier?.value,
      actionBy: userId,
      quantity: values?.unloadedQty,
      dumpQnt: values?.dumpDeliveryQty,
      dumpRate: values?.dumpDeliveryRate,
      directQnt: values?.directQty,
      directRate: values?.directRate,
      bolgateToDumpQnt: values?.bolgateToDamQty,
      bolgateToDumpRate: values?.bolgateToDamRate,
      dumpToTruckQnt: values?.damToTruckQty,
      dumpToTruckRate: values?.damToTruckRate,
      lighterToBolgateQnt: values?.lighterToBolgateQty,
      lighterToBolgateRate: values?.lighterToBolgateRate,
      truckToDumpOutsideQnt: values?.decTruckToDamOutSideQty,
      truckToDumpOutsideRate: values?.decTruckToDamOutSideRate,
      biwtaqnt: +values?.unloadedQty,
      // biwtaqnt: 1,
      biwtarate: values?.decBiwtarate,
      shipSweepingQnt: 1,
      shipSweepingRate: values?.decShipSweepingRate,
      decScaleQnt: 1,
      scaleRate: values?.decScaleRate,
      dailyLaboureQnt: 1,
      dailyLaboureRate: values?.decDailyLaboureRate,
      truckToDamQnt: values?.truckToDamQty,
      truckToDamRate: values?.truckToDamRate,
      othersCostQnt: 1,
      othersCostRate: values?.othersCostRate,
      shipPointId: singleItem?.shipPointId,
    };
    const payloadThree = {
      billTypeId: 32,
      rowId: values?.rowId,
      voyageNo: values?.voyageNo,
      lighterVesselId: values?.lighterVesselId,
      supplierId: values?.supplier?.value,
      actionBy: userId,
      quantity: values?.unloadedQty,
      dumpQnt: values?.dumpDeliveryQty,
      dumpRate: values?.dumpDeliveryRate,
      directQnt: values?.directQty,
      directRate: values?.directRate,
      bolgateToDumpQnt: values?.bolgateToDamQty,
      bolgateToDumpRate: values?.bolgateToDamRate,
      dumpToTruckQnt: +values?.damToTruckQty,
      dumpToTruckRate: +values?.damToTruckRate,
      lighterToBolgateQnt: values?.lighterToBolgateQty,
      lighterToBolgateRate: values?.lighterToBolgateRate,
      truckToDumpOutsideQnt: values?.decTruckToDamOutSideQty,
      truckToDumpOutsideRate: values?.decTruckToDamOutSideRate,
      biwtaqnt: +values?.unloadedQty,
      // biwtaqnt: 1,
      biwtarate: values?.decBiwtarate,
      shipSweepingQnt: 1,
      shipSweepingRate: values?.decShipSweepingRate,
      decScaleQnt: 1,
      scaleRate: values?.decScaleRate,
      dailyLaboureQnt: 1,
      dailyLaboureRate: values?.decDailyLaboureRate,
      truckToDamQnt: values?.truckToDamQty,
      truckToDamRate: values?.truckToDamRate,
      othersCostQnt: 1,
      othersCostRate: values?.othersCostRate,
      shipPointId: singleItem?.shipPointId,
      otherLaborPerson: values.otherLaborPerson,
      otherLaborRate: values.othersLabourPersonRate,
      transactionDate: values?.date,
    };

    if (levelOfApprove === "second") {
      updateUnloadingQtyAndRates(payloadTwo, () => {
        setShow(false);
        getData(preValues, pageNo, pageSize);
      });
    } else if (levelOfApprove === "third") {
      CreateLighterDumpBill(payloadThree, () => {
        setShow(false);
        getData(preValues, pageNo, pageSize);
      });
    } else {
      StockInToInventoryApproval(payloadOne, () => {
        setShow(false);
        getData(preValues, pageNo, pageSize);
      });
    }
  };

  const setTotals = (values, setFieldValue) => {
    const directAmount = +values?.directRate * +values?.directQty;
    const dumpAmount = +values?.dumpDeliveryRate * +values?.dumpDeliveryQty;
    const bolgateToDumpAmount =
      +values?.bolgateToDamRate * +values?.bolgateToDamQty;
    const dumpToTruckAmount = +values?.damToTruckRate * +values?.damToTruckQty;
    const lighterToBolgateAmount =
      +values?.lighterToBolgateRate * +values?.lighterToBolgateQty;
    const truckToDumpAmount = +values?.truckToDamRate * +values?.truckToDamQty;
    const truckToDumpOutsideAmount =
      +values?.decTruckToDamOutSideRate * +values?.decTruckToDamOutSideQty;
    const biwtaAmount = +values?.decBiwtarate * +values?.unloadedQty;
    const shipSweepingAmount = +values?.decShipSweepingRate * 1;
    const scaleAmount = +values?.decScaleRate * 1;
    const dailyLaborAmount = +values?.decDailyLaboureRate * 1;
    const otherCostAmount = +values?.othersCostRate * 1;

    const totalAmount =
      directAmount +
      dumpAmount +
      bolgateToDumpAmount +
      dumpToTruckAmount +
      lighterToBolgateAmount +
      truckToDumpAmount +
      truckToDumpOutsideAmount +
      biwtaAmount +
      shipSweepingAmount +
      scaleAmount +
      dailyLaborAmount +
      otherCostAmount;
    // const totalAmount = +values?.unloadedQty * +totalRate;
    setFieldValue("totalBillAmount", totalAmount);
  };

  const getInitData = () => {
    const dataSetOne = {
      ...initData,
      supplier: {
        value: rates?.supplierId,
        label: rates?.supplierName,
      },
      unloadedQty: _fixedPoint(singleItem?.receiveQnt, false, 2),
      directRate: rates?.directRate,
      dumpDeliveryRate: rates?.dumpDeliveryRate,
      bolgateToDamRate: rates?.bolgateToDamRate,
      damToTruckRate: rates?.damToTruckRate,
      lighterToBolgateRate: rates?.lighterToBolgateRate,
      truckToDamRate: rates?.truckToDamRate,
      othersCostRate: rates?.othersCostRate,
      decTruckToDamOutSideRate: rates?.decTruckToDamOutSideRate,
      decBiwtarate: rates?.decBiwtarate,
      decShipSweepingRate: rates?.decShipSweepingRate,
      decScaleRate: rates?.decScaleRate,
      decDailyLaboureRate: rates?.decDailyLaboureRate,
    };

    const dataSetTwo = {
      ...initData,
      ...rates,
      supplier: {
        value: rates?.supplierId,
        label: rates?.supplierName,
      },
      unloadedQty: _fixedPoint(singleItem?.receiveQnt, false, 2),
      directRate: rates?.directRate,
      dumpDeliveryRate: rates?.dumpRate,
      bolgateToDamRate: rates?.bolgateToDumpRate,
      damToTruckRate: rates?.dumpToTruckRate,
      lighterToBolgateRate: rates?.lighterToBolgateRate,
      truckToDamRate: rates?.truckToDamRate,
      othersCostRate: rates?.othersCostRate,
      decTruckToDamOutSideRate: rates?.truckToDumpOutsideRate,
      decBiwtarate: rates?.biwtarate,
      decShipSweepingRate: rates?.shipSweepingRate,
      decScaleRate: rates?.scaleRate,
      decDailyLaboureRate: rates?.dailyLaboureRate,

      // Quantities
      dumpDeliveryQty: rates?.dumpQnt,
      directQty: rates?.directQnt,
      bolgateToDamQty: rates?.bolgateToDumpQnt,
      damToTruckQty: rates?.dumpToTruckQnt,
      lighterToBolgateQty: rates?.lighterToBolgateQnt,
      truckToDamQty: rates?.truckToDamQnt,
      othersCostQty: rates?.othersCostQnt,
      decTruckToDamOutSideQty: rates?.truckToDumpOutsideQnt,
      decBiwtaQty: rates?.biwtaqnt,
      decShipSweepingQty: rates?.shipSweepingQnt,
      decScaleQty: 1,
      decDailyLaboureQty: rates?.dailyLaboureQnt,
      // totalBillAmount: rates?.,
    };

    const dataSetThree = {
      ...initData,
      ...rates,
      supplier: {
        value: rates?.supplierId,
        label: rates?.supplierName,
      },
      unloadedQty: _fixedPoint(singleItem?.receiveQnt, false, 2),
      directRate: rates?.directRate,
      dumpDeliveryRate: rates?.dumpRate,
      bolgateToDamRate: rates?.bolgateToDumpRate,
      damToTruckRate: rates?.dumpToTruckRate,
      lighterToBolgateRate: rates?.lighterToBolgateRate,
      truckToDamRate: rates?.truckToDamRate,
      othersCostRate: rates?.othersCostRate,
      decTruckToDamOutSideRate: rates?.truckToDumpOutsideRate,
      decBiwtarate: rates?.biwtarate,
      decShipSweepingRate: rates?.shipSweepingRate,
      decScaleRate: rates?.scaleRate,
      decDailyLaboureRate: rates?.dailyLaboureRate,

      // Quantities
      dumpDeliveryQty: rates?.dumpQnt,
      directQty: rates?.directQnt,
      bolgateToDamQty: rates?.bolgateToDumpQnt,
      damToTruckQty: rates?.dumpToTruckQnt,
      lighterToBolgateQty: rates?.lighterToBolgateQnt,
      truckToDamQty: rates?.truckToDamQnt,
      othersCostQty: rates?.othersCostQnt,
      decTruckToDamOutSideQty: rates?.truckToDumpOutsideQnt,
      decBiwtaQty: rates?.biwtaqnt,
      decShipSweepingQty: rates?.shipSweepingQnt,
      decScaleQty: 1,
      decDailyLaboureQty: rates?.dailyLaboureQnt,
      // totalBillAmount: rates?.,
      remainingDumpQnt: +rates?.remainingDumpQnt,
    };

    return levelOfApprove === "first"
      ? dataSetOne
      : levelOfApprove === "second"
      ? dataSetTwo
      : levelOfApprove === "third"
      ? dataSetThree
      : "";
  };

  const billAmountValue = (values) => {
    const total =
      +values?.damToTruckRate * +values?.damToTruckQty +
      +values?.othersLabourPerson * +values?.othersLabourPersonRate +
      +values?.othersCostRate;

    return total;
  };

  const firstPartOfTitle =
    levelOfApprove === "first"
      ? "Warehouse Approve (Unloading Information)"
      : levelOfApprove === "second"
      ? "Supervisor Approve (Unloading Information)"
      : levelOfApprove === "third"
      ? "Dam Delivery Approve"
      : "";

  const title = `${firstPartOfTitle} > ${singleItem?.shipPointName} -- ${singleItem?.lighterVesselName}`;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={getInitData()}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <Card>
              <ModalProgressBar />
              <CardHeader title={title}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        approveSubmitHandler(values);
                      }}
                      className="btn btn-info"
                      disabled={!values?.supplier}
                    >
                      Approve
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <label>Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values?.supplier}
                          handleChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          loadOptions={loadOptions}
                          // isDisabled={levelOfApprove === "third" ? true : false}
                        />
                        <FormikError
                          errors={errors}
                          name="supplier"
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Unloaded Quantity"
                          placeholder="Unloaded Quantity"
                          value={values?.unloadedQty}
                          name="unloadedQty"
                          type="number"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Damp Rate"
                          placeholder="Damp Rate"
                          value={values?.dumpDeliveryRate}
                          name="dumpDeliveryRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("dumpDeliveryRate", e?.target?.value);
                            setTotals(
                              {
                                ...values,
                                dumpDeliveryRate: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                          disabled={levelOfApprove === "third" ? true : false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Damp Qty"
                          placeholder="Damp Qty"
                          value={values?.dumpDeliveryQty}
                          name="dumpDeliveryQty"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("dumpDeliveryQty", e?.target?.value);
                            setTotals(
                              {
                                ...values,
                                dumpDeliveryQty: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                          disabled={levelOfApprove === "third" ? true : false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Remaining Dump Qty"
                          placeholder="Remaining Dump Qty"
                          value={values?.remainingDumpQnt}
                          name="remainingDumpQnt"
                          type="number"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Direct Rate"
                          placeholder="Direct Rate"
                          value={values?.directRate}
                          name="directRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("directRate", e?.target?.value);
                            setTotals(
                              {
                                ...values,
                                directRate: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                          disabled={levelOfApprove === "third" ? true : false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Direct Qty"
                          placeholder="Direct Qty"
                          value={values?.directQty}
                          name="directQty"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("directQty", e?.target?.value);
                            setTotals(
                              {
                                ...values,
                                directQty: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                          disabled={levelOfApprove === "third" ? true : false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Date"
                          placeholder="Date"
                          value={values?.date}
                          name="date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("date", e?.target?.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Dam to Truck Rate"
                          placeholder="Dam to Truck Rate"
                          value={values?.damToTruckRate}
                          name="damToTruckRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("damToTruckRate", e?.target?.value);
                            setTotals(
                              {
                                ...values,
                                damToTruckRate: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Dam to Truck Qty"
                          placeholder="Dam to Truck Qty"
                          value={values?.damToTruckQty}
                          name="damToTruckQty"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("damToTruckQty", e?.target?.value);
                            setTotals(
                              {
                                ...values,
                                damToTruckQty: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                        />
                      </div>

                      {levelOfApprove !== "third" && (
                        <>
                          <div className="col-lg-3">
                            <InputField
                              label="Bolgate to Dam Rate"
                              placeholder="Bolgate to Dam Rate"
                              value={values?.bolgateToDamRate}
                              name="bolgateToDamRate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bolgateToDamRate",
                                  e?.target?.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    bolgateToDamRate: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Bolgate to Dam Qty"
                              placeholder="Bolgate to Dam Qty"
                              value={values?.bolgateToDamQty}
                              name="bolgateToDamQty"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "bolgateToDamQty",
                                  e?.target?.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    bolgateToDamQty: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Lighter to Bolgate Rate"
                              placeholder="Lighter to Bolgate Rate"
                              value={values?.lighterToBolgateRate}
                              name="lighterToBolgateRate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "lighterToBolgateRate",
                                  e?.target?.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    lighterToBolgateRate: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Lighter to Bolgate Qty"
                              placeholder="Lighter to Bolgate Qty"
                              value={values?.lighterToBolgateQty}
                              name="lighterToBolgateQty"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "lighterToBolgateQty",
                                  e?.target?.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    lighterToBolgateQty: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Truck to Dam Rate"
                              placeholder="Truck to Dam Rate"
                              value={values?.truckToDamRate}
                              name="truckToDamRate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "truckToDamRate",
                                  e?.target?.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    truckToDamRate: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ||
                                isTruckToDampDayByDay
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Truck to Dam Qty"
                              placeholder="Truck to Dam Qty"
                              value={values?.truckToDamQty}
                              name="truckToDamQty"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "truckToDamQty",
                                  e?.target?.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    truckToDamQty: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ||
                                isTruckToDampDayByDay
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.decTruckToDamOutSideRate}
                              name="decTruckToDamOutSideRate"
                              label="Truck To Dam Outside Rate"
                              placeholder="Truck To Dam Outside Rate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "decTruckToDamOutSideRate",
                                  e.target.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    decTruckToDamOutSideRate: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.decTruckToDamOutSideQty}
                              label="Truck To Dam Outside Qty"
                              placeholder="Truck To Dam Outside Qty"
                              name="decTruckToDamOutSideQty"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "decTruckToDamOutSideQty",
                                  e.target.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    decTruckToDamOutSideQty: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.decBiwtarate}
                              label="BIWTA Rate"
                              placeholder="BIWTA Rate"
                              name="decBiwtarate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("decBiwtarate", e.target.value);
                                setTotals(
                                  {
                                    ...values,
                                    decBiwtarate: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>

                          <div className="col-lg-3">
                            <InputField
                              value={values?.decShipSweepingRate}
                              label="Ship Sweeping Amount"
                              placeholder="Ship Sweeping Amount"
                              name="decShipSweepingRate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue(
                                  "decShipSweepingRate",
                                  e.target.value
                                );
                                setTotals(
                                  {
                                    ...values,
                                    decShipSweepingRate: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>

                          <div className="col-lg-3">
                            <InputField
                              value={values?.decScaleRate}
                              label="Scale Amount"
                              placeholder="Scale Amount"
                              name="decScaleRate"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("decScaleRate", e.target.value);
                                setTotals(
                                  {
                                    ...values,
                                    decScaleRate: e?.target?.value,
                                  },
                                  setFieldValue
                                );
                              }}
                              disabled={
                                levelOfApprove === "third" ? true : false
                              }
                            />
                          </div>
                        </>
                      )}

                      <div className="col-lg-3">
                        <InputField
                          value={values?.othersLabourPerson}
                          label="Others Labour Person"
                          placeholder="Others Labour Person"
                          name="othersLabourPerson"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("othersLabourPerson", e.target.value);
                            setFieldValue(
                              "decDailyLaboureRate",
                              Number(e.target.value) *
                                Number(values.othersLabourPersonRate)
                            );
                            setTotals(
                              {
                                ...values,
                                decDailyLaboureRate:
                                  Number(e.target.value) *
                                  Number(values.othersLabourPersonRate),
                              },
                              setFieldValue
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.othersLabourPersonRate}
                          label="Others Labour Person Rate"
                          placeholder="Others Labour Person Rate"
                          name="othersLabourPerson"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "othersLabourPersonRate",
                              e.target.value
                            );
                            setFieldValue(
                              "decDailyLaboureRate",
                              Number(e.target.value) *
                                Number(values.othersLabourPerson)
                            );
                            setTotals(
                              {
                                ...values,
                                decDailyLaboureRate:
                                  Number(e.target.value) *
                                  Number(values.othersLabourPerson),
                              },
                              setFieldValue
                            );
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          value={values?.decDailyLaboureRate}
                          label="Daily Labor Amount"
                          placeholder="Daily Labor Amount"
                          name="decDailyLaboureRate"
                          type="number"
                          disabled={true}
                        />
                      </div>

                      {/* <div className="col-lg-3">
                        <InputField
                          value={values?.decDailyLaboureRate}
                          label="Daily Labor Amount"
                          placeholder="Daily Labor Amount"
                          name="decDailyLaboureRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "decDailyLaboureRate",
                              e.target.value
                            );
                            setTotals(
                              {
                                ...values,
                                decDailyLaboureRate: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <InputField
                          label="Others Cost Amount"
                          placeholder="Others Cost Amount"
                          value={values?.othersCostRate}
                          name="othersCostRate"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("othersCostRate", e?.target?.value);
                            setTotals(
                              {
                                ...values,
                                othersCostRate: e?.target?.value,
                              },
                              setFieldValue
                            );
                          }}
                          // disabled={levelOfApprove === "third" ? true : false}
                        />
                      </div>
                      {levelOfApprove === "third" ? (
                        <div className="col-lg-3">
                          <InputField
                            label="Bill Amount"
                            placeholder="Bill Amount"
                            value={billAmountValue(values)}
                            name="billAmount"
                            type="number"
                            disabled={true}
                          />
                        </div>
                      ) : (
                        <div className="col-lg-3">
                          <InputField
                            label="Total Bill Amount"
                            placeholder="Total Bill Amount"
                            value={values?.totalBillAmount}
                            name="totalBillAmount"
                            type="number"
                            disabled={true}
                          />
                        </div>
                      )}

                      {/* <div className="col-lg-3">
                        <label>Narration</label>
                        <TextArea
                          placeholder="Narration"
                          value={values?.narration}
                          name="narration"
                          rows={3}
                        />
                      </div> */}
                      {/* <div className="col-lg-2">
                        <button
                          className="btn btn-primary mr-2 mt-5"
                          type="button"
                          onClick={() => setOpen(true)}
                        >
                          Attachment
                        </button>
                      </div> */}
                    </div>
                  </div>
                </form>
              </CardBody>
            </Card>
            {/* <AttachFile obj={{ open, setOpen, setUploadedImage }} /> */}
          </>
        )}
      </Formik>
    </>
  );
}
