/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ICard from "../../../../_helper/_card";
import IConfirmModal from "../../../../_helper/_confirmModal";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { BADCBCICForm } from "../../../common/components";
import { getGodownDDL } from "../../../common/helper";
import { GetShipPointDDL } from "../../loadingInformation/helper";
import {
  challanConfirm,
  GetDomesticPortDDL,
  getLandingDataForConfirmation,
  getMotherVesselDDL,
} from "../helper";
import TextArea from "../../../../_helper/TextArea";
import { _todayDate } from "../../../../_helper/_todayDate";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import AttachFile from "../../../common/attachmentUpload";

const initData = {
  confirmationType: { value: 2, label: "Supervisor Confirmation (Truck Bill)" },
  type: "badc",
  shipPoint: { value: 0, label: "All" },
  shipToPartner: { value: 0, label: "All" },
  port: { value: 0, label: "All" },
  motherVessel: { value: 0, label: "All" },
  confirmationStatus: {
    value: 1,
    label: "Pending",
  },
  jvDate: _todayDate(),
  remarks: "",
  billRef: "",
};

const confirmationTypes = [
  { value: 1, label: "Receive Confirmation" },
  { value: 2, label: "Supervisor Confirmation (Truck Bill)" },
  { value: 3, label: "Supervisor Confirmation (Godown Unload Bill)" },
];

const ConfirmBySupervisor = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, setRowData] = useState();
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [godownDDL, setGodownDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [status, setStatus] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploadedImages, setUploadedImage] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize, searchTerm = "") => {
    getLandingDataForConfirmation(
      accId,
      buId,
      values,
      searchTerm,
      pageNo,
      pageSize,
      setRowData,
      setLoading
    );
    if (values?.confirmationStatus?.value === 1) {
      setStatus(true);
    } else if (values?.confirmationStatus?.value === 2) {
      setStatus(false);
    }
  };

  const paginationSearchHandler = (searchTerm, values) => {
    getData(values, pageNo, pageSize, searchTerm);
  };

  useEffect(() => {
    // getData(initData, pageNo, pageSize);
    GetShipPointDDL(accId, buId, setShipPointDDL);
    getGodownDDL(buId, 73244, setGodownDDL, setLoading);
    GetDomesticPortDDL(setPortDDL);
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  // approveSubmitlHandler btn submit handler
  const saveHandler = (values) => {
    const checkBeforeSubmitData = rowData?.data
      ?.filter((item) => item?.isSelected)
      .find((item) => item?.quantity <= 0);
    if (checkBeforeSubmitData) {
      toast("Please ensure Quantity value is greater than 0 on Selected Row", {
        type: "warning",
      });
    } else {
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to Approve`,
        yesAlertFunc: () => {
          const typeId = values?.confirmationType?.value;
          const billTypeId = typeId === 2 ? 16 : typeId === 3 ? 21 : 0;
          const selectedItems = rowData?.data?.filter(
            (item) => item?.isSelected
          );
          const payload =
            typeId === 1 //Receive Confirmation
              ? selectedItems?.map((item) => {
                  return {
                    typeId: typeId,
                    confirmChallan: {
                      deliveryId: item?.deliveryId,
                      shipToPartnerId: item?.shipToPartner?.value,
                      shipToPartnerName: item?.shipToPartner?.label,
                      receiveDate:
                        typeId === 1 ? item?.date : item?.deliveryDate,
                      // remarks: item?.remarks,
                      remarks: values?.remarks,
                      totalLogsticFare: +item?.totalLogsticFare || 0,
                      advanceLogisticeFare: +item?.advanceLogisticeFare || 0,
                      dueFare:
                        (+item?.totalLogsticFare || 0) -
                          (+item?.advanceLogisticeFare || 0) || 0,
                      unloadingSupplierId: item?.unloadingSupplierId,
                      unloadingSupplier: item?.unloadingSupplier,
                      unloadingRate: item?.unloadingRate,
                    },
                    rowObject: {
                      rowId: item?.rowId,
                      quantity: +item?.quantity,
                      transportRate: +item?.transportRate,
                      totalShippingValue:
                        +item?.quantity * +item?.transportRate,
                      unloadingAmount: item?.unloadingAmount,
                      // "transportRate": 0,
                      // "totalShippingValue": 0,
                      goDownUnloadLabourRate: item?.godownUnloadingRate,
                    },
                  };
                })
              : selectedItems?.map((item) => {
                  return {
                    typeId: 2,
                    // typeId: typeId,
                    headerObject: {
                      deliveryId: item?.deliveryId || 0,
                      shipToPartnerId: item?.shipToPartner?.value || 0,
                      shipToPartnerName: item?.shipToPartner?.label || "",
                      supplierId: item?.supplierId || 0,
                      supplierName: item?.supplierName || "",
                      lighterVesselId: 0,
                      motherVesselId: 0,
                      totalLogsticFare: +item?.totalLogsticFare || 0,
                      advanceLogisticeFare: +item?.advanceLogisticeFare || 0,
                      dueFare:
                        (+item?.totalLogsticFare || 0) -
                          (+item?.advanceLogisticeFare || 0) || 0,

                      deliveryDate: [2, 3].includes(typeId)
                        ? item?.date
                        : item?.deliveryDate || _todayDate(),
                      isConfirmBySupervisor: [2, 3].includes(typeId),
                      confirmBy: userId,
                      updateBy: userId,
                      salesOrder: item?.salesOrder || "",
                      remarks: values?.remarks || "",

                      unloadingSupplierId:
                        item?.godownLabourSupplier?.value || 0,
                      unloadingSupplier:
                        item?.godownLabourSupplier?.label || "",
                      unloadingRate: item?.unloadingRate,
                      sbuId: item?.sbuId || 0,
                      salesRevenueNarration: `Challan No: ${
                        item?.deliveryCode
                      }, Partner: ${item?.shipToPartner?.label ||
                        ""}, Quantity: ${+item?.quantity} bag.`,

                      accountId: accId,
                      businessUnitId: buId,
                      godownLabourSupplier:
                        item?.godownLabourSupplier?.label || "",
                      godownLabourSupplierId:
                        item?.godownLabourSupplier?.value || 0,
                      dteDate: values?.jvDate || _todayDate(),

                      imageId: uploadedImages[0]?.id || "",
                      billRef: values?.billRef || "",
                      billTypeId: billTypeId,
                    },
                    rowObject: {
                      rowId: item?.rowId || 0,
                      quantity: +item?.quantity || 0,
                      transportRate: +item?.transportRate || 0,
                      totalShippingValue:
                        (+item?.transportRate + +item?.godownUnloadingRate) *
                          +item?.quantity || 0,
                      unloadingAmount: item?.unloadingAmount || 0,
                      goDownUnloadLabourRate: +item?.godownUnloadingRate || 0,

                      ghatLoadUnloadLabourRate: +item?.directOrDumpRate || 0,
                      transPortAmount:
                        +item?.quantity * +item?.transportRate || 0,
                      goDownLabourAmount:
                        +item?.quantity * +item?.godownUnloadingRate || 0,
                      ghatLabourAmount: 0,
                      lighterCarrierAmount: 0,
                      isProcess: false,
                      deliveryId: item?.deliveryId || 0,
                      numItemPrice: +item?.numItemPrice || 0,
                      salesRevenueAmount: +item?.salesRevenueAmount || 0,
                    },
                  };
                });

          challanConfirm(payload, setLoading, () => {
            getData(values, pageNo, pageSize);
          });
        },
        noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
    }
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "type":
        setFieldValue("type", currentValue);
        setFieldValue("shipToPartner", "");
        if (currentValue) {
          getGodownDDL(
            buId,
            currentValue === "badc" ? 73244 : 73245,
            setGodownDDL,
            setLoading
          );
        }
        break;

      default:
        break;
    }
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData?.data];
    _data[index][name] = value;
    setRowData({ ...rowData, data: _data });
  };

  const allSelect = (value, values) => {
    // is Supervisor Confirmation (Truck Bill || Godown Unload Bill)
    const isSupervisorConfirmation = [2, 3].includes(
      values?.confirmationType?.value
    );
    let _data = [...rowData?.data];
    const modify = {
      ...rowData,
      data: _data.map((item) => {
        let pricelessThanZero =
          +item?.numItemPrice <= 0 && isSupervisorConfirmation;
        return {
          ...item,
          isSelected: pricelessThanZero ? false : value,
        };
      }),
    };
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.data?.length > 0 &&
      rowData?.data?.filter((item) => item?.isSelected)?.length ===
        rowData?.data?.length
      ? true
      : false;
  };

  const getTotal = (key) => {
    const total = rowData?.data
      ?.filter((item) => item?.isSelected)
      ?.reduce((a, b) => (a += +b?.[key]), 0);
    return total;
  };

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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard title="Challan Confirmation">
              {loading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <BADCBCICForm
                      values={values}
                      setFieldValue={setFieldValue}
                      onChange={onChangeHandler}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="confirmationType"
                        options={confirmationTypes}
                        value={values?.confirmationType}
                        label="Confirmation Type"
                        onChange={(e) => {
                          setFieldValue("confirmationType", e);
                          setRowData([]);
                        }}
                        placeholder="Confirmation Type"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                        value={values?.shipPoint}
                        label="ShipPoint"
                        onChange={(e) => {
                          setFieldValue("shipPoint", e);
                        }}
                        placeholder="ShipPoint"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipToPartner"
                        options={[{ value: 0, label: "All" }, ...godownDDL]}
                        value={values?.shipToPartner}
                        label="Ship to Partner"
                        placeholder="Ship to Partner"
                        onChange={(e) => {
                          setFieldValue("shipToPartner", e);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="port"
                        options={[{ value: 0, label: "All" }, ...portDDL]}
                        value={values?.port}
                        label="Port"
                        placeholder="Port"
                        onChange={(e) => {
                          setFieldValue("port", e);
                          setFieldValue("motherVessel", "");
                          getMotherVesselDDL(
                            accId,
                            buId,
                            e?.value,
                            setMotherVesselDDL
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="motherVessel"
                        options={
                          [{ value: 0, label: "All" }, ...motherVesselDDL] || []
                        }
                        value={values?.motherVessel}
                        label="Mother Vessel"
                        placeholder="Mother Vessel"
                        onChange={(e) => {
                          setFieldValue("motherVessel", e);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="confirmationStatus"
                        options={[
                          { value: 1, label: "Pending" },
                          { value: 2, label: "Approve" },
                        ]}
                        value={
                          values?.confirmationStatus || {
                            value: 1,
                            label: "Pending",
                          }
                        }
                        label="Confirmation Status"
                        onChange={(e) => {
                          setFieldValue("confirmationStatus", e);
                          setRowData([]);
                        }}
                        placeholder="Confirmation Status"
                      />
                    </div>
                    {status &&
                      [2, 3].includes(values?.confirmationType?.value) &&
                      rowData?.data?.length > 0 && (
                        <>
                          <div className="col-lg-3">
                            <InputField
                              label="JV Date"
                              placeholder="JV Date"
                              value={values?.jvDate}
                              name="jvDate"
                              type="date"
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Bill Ref"
                              placeholder="Bill Ref"
                              value={values?.billRef}
                              name="billRef"
                              type="text"
                            />
                          </div>
                          <div className="col-lg-6">
                            <label>Remarks</label>
                            <TextArea
                              placeholder="Remarks"
                              value={values?.remarks}
                              name="remarks"
                              rows={3}
                            />
                          </div>
                          <div className="col-lg-2">
                            <button
                              className="btn btn-primary mr-2 mt-5"
                              type="button"
                              onClick={() => setOpen(true)}
                            >
                              Attachment
                            </button>
                          </div>
                        </>
                      )}

                    {/* <FromDateToDateForm obj={{ values, setFieldValue }} /> */}

                    <div className="col-12 text-right">
                      <button
                        className="btn btn-primary btn-sm mt-2"
                        type="button"
                        onClick={() => {
                          getData(values, pageNo, pageSize);
                        }}
                        // disabled={loading || !values?.confirmationType}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="mt-5">
                <PaginationSearch
                  placeholder="Delivery Code/Sales Order/ShipPoint"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              {rowData?.data?.length > 0 && status && (
                <div className="row my-3">
                  <div className="col-lg-4">
                    <h3>Total Quantity: {getTotal("quantity")}</h3>
                  </div>
                  <div className="col-lg-4">
                    <h3>
                      Total Bill:{" "}
                      {rowData?.data
                        ?.filter((item) => item?.isSelected)
                        ?.reduce(
                          (x, y) =>
                            (x +=
                              (+y?.transportRate + +y?.godownUnloadingRate) *
                              +y?.quantity),
                          0
                        )}
                    </h3>
                  </div>

                  <div className="col-lg-4 text-right">
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        saveHandler(values);
                      }}
                      disabled={
                        !values?.remarks ||
                        !values?.billRef ||
                        rowData?.data?.filter((item) => item?.isSelected)
                          ?.length < 1
                      }
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}

              {rowData?.data?.length > 0 && (
                <div className="">
                  <div className="loan-scrollable-table inventory-statement-report">
                    <div
                      style={{ maxHeight: "500px" }}
                      className="scroll-table _table"
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm">
                        <thead>
                          <tr className="cursor-pointer">
                            {status && (
                              <th
                                onClick={() =>
                                  allSelect(!selectedAll(), values)
                                }
                                style={{ minWidth: "30px" }}
                              >
                                <input
                                  type="checkbox"
                                  value={selectedAll()}
                                  checked={selectedAll()}
                                  onChange={() => {}}
                                />
                              </th>
                            )}
                            <th style={{ minWidth: "30px" }}>SL</th>
                            <th style={{ minWidth: "100px" }}>
                              Sales Order No
                            </th>
                            <th style={{ minWidth: "90px" }}>Ghat Name</th>
                            <th style={{ minWidth: "90px" }}>
                              Vehicle No
                            </th>{" "}
                            {/* 4 */}
                            <th style={{ minWidth: "70px" }}>
                              Delivery Address
                            </th>
                            <th style={{ minWidth: "100px" }}>Quantity</th>
                            {values?.confirmationType?.value !== 3 && (
                              <th style={{ minWidth: "100px" }}>
                                Transport Rate (per bag)
                              </th>
                            )}{" "}
                            {/* 7 */}
                            {values?.confirmationType?.value !== 2 && (
                              <th style={{ minWidth: "100px" }}>
                                Godown Unloading Rate (per bag)
                              </th>
                            )}
                            {/* <th style={{ minWidth: "100px" }}>Carrier Rate</th> */}
                            <th style={{ minWidth: "100px" }}>Bill Amount</th>
                            <th style={{ minWidth: "200px" }}>
                              Ship to Partner
                            </th>
                            <th style={{ minWidth: "160px" }}>{`${
                              values?.confirmationType?.value === 1
                                ? "Receive"
                                : "Challan"
                            } Date`}</th>
                            {values?.confirmationType?.value !== 3 && (
                              <th style={{ minWidth: "180px" }}>
                                Transport Supplier
                              </th>
                            )}
                            <th style={{ minWidth: "100px" }}>DO No</th>
                            <th style={{ minWidth: "90px" }}>Driver Name</th>
                            <th style={{ minWidth: "80px" }}>
                              Driver Mobile No
                            </th>
                            {/* <th style={{ minWidth: "100px" }}>
                              Direct/Dump Labour Rate
                            </th> */}
                            {/* <th style={{ minWidth: "200px" }}>
                              Ghat Labour Supplier
                            </th> */}
                            {values?.confirmationType?.value !== 2 && (
                              <th style={{ minWidth: "200px" }}>
                                Godown Labour Supplier
                              </th>
                            )}
                            <th style={{ minWidth: "100px" }}>Insert By</th>
                            {[2, 3].includes(
                              values?.confirmationType?.value
                            ) && <th style={{ minWidth: "80px" }}>Price</th>}
                            {/* <th style={{ minWidth: "150px" }}>Remark</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.map((item, index) => {
                            // is Supervisor Confirmation (Truck Bill || Godown Unload Bill)
                            const isSupervisorConfirmation = [2, 3].includes(
                              values?.confirmationType?.value
                            );
                            // price is less than 0
                            let pricelessThanZero =
                              +item?.numItemPrice <= 0 &&
                              isSupervisorConfirmation;
                            return (
                              <tr
                                key={index}
                                style={{
                                  background: pricelessThanZero
                                    ? "#ff0000a1"
                                    : "",
                                }}
                              >
                                {status && (
                                  <td
                                    onClick={() => {
                                      if (pricelessThanZero) return;
                                      rowDataHandler(
                                        "isSelected",
                                        index,
                                        !item.isSelected
                                      );
                                    }}
                                    className="text-center"
                                    // style={
                                    //   item?.isSelected
                                    //     ? {
                                    //         backgroundColor: "#aacae3",
                                    //         minWidth: "30px",
                                    //       }
                                    //     : { minWidth: "30px" }
                                    // }
                                  >
                                    <input
                                      type="checkbox"
                                      value={item?.isSelected}
                                      checked={item?.isSelected}
                                      onChange={() => {}}
                                      disabled={pricelessThanZero}
                                    />
                                  </td>
                                )}
                                <td
                                  style={{ minWidth: "30px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td className="" style={{ width: "100px" }}>
                                  {status ? (
                                    <InputField
                                      name="salesOrder"
                                      placeholder="Sales Order"
                                      value={item?.salesOrder}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "salesOrder",
                                          index,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.salesOrder
                                  )}
                                </td>
                                {/* <td>{item?.program}</td> */}
                                <td>{item?.shipPointName}</td>
                                <td>{item?.vehicleRegNo}</td> {/* 4 */}
                                <td>{item?.address}</td>
                                {/* quantity  */}
                                <td
                                  className="text-right"
                                  style={{ width: "100px" }}
                                >
                                  {status ? (
                                    <InputField
                                      name="quantity"
                                      placeholder="Quantity"
                                      type="number"
                                      min="0"
                                      max={item?.maxQty}
                                      value={item?.quantity}
                                      disabled={
                                        item?.truckSupplierBillRegisterId ||
                                        item?.unloadSupplierBillRegisterId
                                      }
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "quantity",
                                          index,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.quantity
                                  )}
                                </td>
                                {/* rate  */}
                                {values?.confirmationType?.value !== 3 && (
                                  <td
                                    className="text-right"
                                    style={{ width: "100px" }}
                                  >
                                    {status ? (
                                      <InputField
                                        name="transportRate"
                                        placeholder="Transport Rate"
                                        value={item?.transportRate || ""}
                                        type="number"
                                        min="0"
                                        disabled={
                                          values?.confirmationType?.value === 3
                                        }
                                        onChange={(e) => {
                                          if (+e.target.value < 0) return;
                                          rowDataHandler(
                                            "transportRate",
                                            index,
                                            e?.target?.value
                                          );
                                        }}
                                      />
                                    ) : (
                                      item?.transportRate || 0
                                    )}
                                  </td>
                                )}
                                {/* 7 */}
                                {values?.confirmationType?.value !== 2 && (
                                  <td className="text-right">
                                    {status ? (
                                      <InputField
                                        name="godownUnloadingRate"
                                        placeholder="Unloading Rate"
                                        value={item?.godownUnloadingRate || ""}
                                        type="number"
                                        min="0"
                                        disabled={
                                          values?.confirmationType?.value === 2
                                        }
                                        onChange={(e) => {
                                          if (+e.target.value < 0) return;
                                          rowDataHandler(
                                            "godownUnloadingRate",
                                            index,
                                            e?.target?.value
                                          );
                                        }}
                                      />
                                    ) : (
                                      item?.godownUnloadingRate
                                    )}
                                  </td>
                                )}
                                <td
                                  className="text-right"
                                  style={{ width: "100px" }}
                                >
                                  {status ? (
                                    <InputField
                                      name="billAmount"
                                      value={
                                        (values?.confirmationType?.value === 2
                                          ? +item?.transportRate
                                          : values?.confirmationType?.value ===
                                            3
                                          ? +item?.godownUnloadingRate
                                          : +item?.transportRate +
                                            +item?.godownUnloadingRate) *
                                        +item?.quantity
                                      }
                                      onChange={(e) => {
                                        if (+e.target.value < 0) return;
                                        rowDataHandler(
                                          "billAmount",
                                          index,
                                          e?.target?.value
                                        );
                                      }}
                                      disabled
                                    />
                                  ) : (
                                    (item?.quantity || 0) *
                                    (item?.transportRate || 0)
                                  )}
                                </td>
                                <td style={{ width: "150px" }}>
                                  {status ? (
                                    <NewSelect
                                      isClearable={false}
                                      name="shipToPartner"
                                      value={item?.shipToPartner}
                                      options={godownDDL}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "shipToPartner",
                                          index,
                                          e
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.shipToPartnerName
                                  )}
                                </td>
                                <td
                                  className="text-right"
                                  style={{ width: "100px" }}
                                >
                                  {status ? (
                                    <InputField
                                      name="date"
                                      placeholder="Date"
                                      value={item?.date}
                                      type="date"
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "date",
                                          index,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.date
                                  )}
                                </td>{" "}
                                {values?.confirmationType?.value !== 3 && (
                                  <td style={{ width: "100px" }}>
                                    {item?.supplierName}
                                  </td>
                                )}
                                <td>{item?.deliveryCode}</td>
                                <td>{item?.driverName}</td>
                                <td>{item?.driverPhone}</td>
                                {values?.confirmationType?.value !== 2 && (
                                  <td style={{ width: "150px" }}>
                                    {status ? (
                                      <SearchAsyncSelect
                                        selectedValue={
                                          item?.godownLabourSupplier
                                        }
                                        handleChange={(valueOption) => {
                                          rowDataHandler(
                                            "godownLabourSupplier",
                                            index,
                                            valueOption
                                          );
                                        }}
                                        loadOptions={loadOptions}
                                      />
                                    ) : (
                                      item?.godownLabourSupplierName
                                    )}
                                  </td>
                                )}
                                <td style={{ width: "100px" }}>
                                  {item?.actionByName}
                                </td>
                                {[2, 3].includes(
                                  values?.confirmationType?.value
                                ) && (
                                  <td
                                    style={{ width: "100px" }}
                                    className="text-right"
                                  >
                                    {item?.numItemPrice}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
            </ICard>
            <AttachFile
              open={open}
              setOpen={setOpen}
              setUploadedImage={setUploadedImage}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default ConfirmBySupervisor;
