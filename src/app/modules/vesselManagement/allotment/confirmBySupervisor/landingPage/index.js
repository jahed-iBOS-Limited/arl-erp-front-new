/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ICard from "../../../../_helper/_card";
import IConfirmModal from "../../../../_helper/_confirmModal";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import AttachFile from "../../../common/attachmentUpload";
import { getGodownDDL } from "../../../common/helper";
import { GetShipPointDDL } from "../../loadingInformation/helper";
import {
  GetDomesticPortDDL,
  challanConfirm,
  getLandingDataForConfirmation,
} from "../helper";
import Form from "./form";
import Table from "./table";

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
                      salesRevenueAmount:
                        ((+item?.quantity * 50) / 1000) * +item?.numItemPrice ||
                        0,
                      // salesRevenueAmount: +item?.salesRevenueAmount || 0,
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
              <Form
                obj={{
                  values,
                  setFieldValue,
                  onChangeHandler,
                  rowData,
                  setRowData,
                  status,
                  getData,
                  setOpen,
                  shipPointDDL,
                  godownDDL,
                  portDDL,
                  accId,
                  buId,
                  setMotherVesselDDL,
                  motherVesselDDL,
                  pageNo,
                  pageSize,
                  paginationSearchHandler,
                  saveHandler,
                }}
              />

              <Table
                obj={{
                  rowData,
                  status,
                  allSelect,
                  selectedAll,
                  values,
                  rowDataHandler,
                  godownDDL,
                  loadOptions,
                  setPositionHandler,
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
              />
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
