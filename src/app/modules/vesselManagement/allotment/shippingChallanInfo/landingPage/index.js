/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getGodownDDL, getTotal } from "../../../common/helper";
import { GetShipPointDDL } from "../../loadingInformation/helper";
import { getLandingDataForConfirmation } from "../helper";
import Form from "./form";
import Table from "./table";

const ALL = { value: 0, label: "All" };

const initData = {
  confirmationType: { value: 2, label: "Supervisor Confirmation" },
  type: "badc",
  shipPoint: ALL,
  shipToPartner: ALL,
  port: ALL,
  motherVessel: ALL,
  confirmationStatus: { value: 1, label: "Pending" },
  jvDate: _todayDate(),
  remarks: "",
  billRef: "",
};

const ShippingChallanInfo = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, setRowData] = useState();
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [godownDDL, setGodownDDL] = useState([]);
  const [status, setStatus] = useState(true);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // ______ landing data fetching functions __________
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

  // set Position Handler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize);
    GetShipPointDDL(accId, buId, setShipPointDDL);
    getGodownDDL(buId, 73244, setGodownDDL, setLoading);
  }, [accId, buId]);

  // _________ confirmation popup opening function __________
  // const approveConfirmationHandler = (payload, values) => {
  //   let confirmObject = {
  //     title: "Are you sure?",
  //     message: `Do you want to Approve`,
  //     yesAlertFunc: () => {
  //       challanConfirm(payload, setLoading, () => {
  //         getData(values, pageNo, pageSize);
  //       });
  //     },
  //     noAlertFunc: () => {},
  //   };
  //   IConfirmModal(confirmObject);
  // };

  // _________ Approve Submit Handler __________
  // const saveHandler = (values) => {
  //   const selectedItems = rowData?.data?.filter((item) => item?.isSelected);
  //   const checkBeforeSubmitData = selectedItems.find(
  //     (item) => item?.quantity <= 0
  //   );
  //   if (checkBeforeSubmitData) {
  //     toast("Please ensure Quantity value is greater than 0 on Selected Row", {
  //       type: "warning",
  //     });
  //   } else {
  //     const typeId = values?.confirmationType?.value;
  //     const billTypeId = typeId === 2 ? 16 : typeId === 3 ? 21 : 0;

  //     // _________ Payload for Receive Confirmation ___________
  //     const payloadOne = selectedItems?.map((item) => {
  //       return {
  //         typeId: typeId,
  //         confirmChallan: {
  //           deliveryId: item?.deliveryId,
  //           shipToPartnerId: item?.shipToPartner?.value,
  //           shipToPartnerName: item?.shipToPartner?.label,
  //           receiveDate: typeId === 1 ? item?.date : item?.deliveryDate,
  //           // remarks: item?.remarks,
  //           remarks: values?.remarks,
  //           totalLogsticFare: +item?.totalLogsticFare || 0,
  //           advanceLogisticeFare: +item?.advanceLogisticeFare || 0,
  //           dueFare:
  //             (+item?.totalLogsticFare || 0) -
  //               (+item?.advanceLogisticeFare || 0) || 0,
  //           unloadingSupplierId: item?.unloadingSupplierId,
  //           unloadingSupplier: item?.unloadingSupplier,
  //           unloadingRate: item?.unloadingRate,
  //         },
  //         rowObject: {
  //           rowId: item?.rowId,
  //           quantity: +item?.quantity,
  //           transportRate: +item?.transportRate,
  //           totalShippingValue: +item?.quantity * +item?.transportRate,
  //           unloadingAmount: item?.unloadingAmount,
  //           // "transportRate": 0,
  //           // "totalShippingValue": 0,
  //           goDownUnloadLabourRate: item?.godownUnloadingRate,
  //         },
  //       };
  //     });

  //     // _______ Payload Two types of Supervisor Confirmation ________
  //     const payloadTwo = selectedItems?.map((item) => {
  //       return {
  //         typeId: 2,
  //         // typeId: typeId,
  //         headerObject: {
  //           deliveryId: item?.deliveryId || 0,
  //           shipToPartnerId: item?.shipToPartner?.value || 0,
  //           shipToPartnerName: item?.shipToPartner?.label || "",
  //           supplierId: item?.supplierId || 0,
  //           supplierName: item?.supplierName || "",
  //           lighterVesselId: 0,
  //           motherVesselId: item?.motherVesselId,
  //           totalLogsticFare: +item?.totalLogsticFare || 0,
  //           advanceLogisticeFare: +item?.advanceLogisticeFare || 0,
  //           dueFare:
  //             (+item?.totalLogsticFare || 0) -
  //               (+item?.advanceLogisticeFare || 0) || 0,

  //           deliveryDate: [2, 3].includes(typeId)
  //             ? item?.date
  //             : item?.deliveryDate || _todayDate(),
  //           isConfirmBySupervisor: [2, 3].includes(typeId),
  //           confirmBy: userId,
  //           updateBy: userId,
  //           salesOrder: item?.salesOrder || "",
  //           remarks: values?.remarks || "",

  //           unloadingSupplierId: item?.godownLabourSupplier?.value || 0,
  //           unloadingSupplier: item?.godownLabourSupplier?.label || "",
  //           unloadingRate: item?.unloadingRate,
  //           sbuId: item?.sbuId || 0,
  //           salesRevenueNarration: `Challan No: ${
  //             item?.deliveryCode
  //           }, Partner: ${item?.shipToPartner?.label ||
  //             ""}, Quantity: ${+item?.quantity} bag.`,

  //           accountId: accId,
  //           businessUnitId: buId,
  //           godownLabourSupplier: item?.godownLabourSupplier?.label || "",
  //           godownLabourSupplierId: item?.godownLabourSupplier?.value || 0,
  //           dteDate: values?.jvDate || _todayDate(),

  //           imageId: uploadedImages[0]?.id || "",
  //           billRef: values?.billRef || "",
  //           billTypeId: billTypeId,
  //         },
  //         rowObject: {
  //           rowId: item?.rowId || 0,
  //           quantity: +item?.quantity || 0,
  //           transportRate: +item?.transportRate || 0,
  //           totalShippingValue: _fixedPoint(
  //             (+item?.transportRate + +item?.godownUnloadingRate) *
  //               +item?.quantity || 0,
  //             false
  //           ),
  //           unloadingAmount: item?.unloadingAmount || 0,
  //           goDownUnloadLabourRate: +item?.godownUnloadingRate || 0,

  //           ghatLoadUnloadLabourRate: +item?.directOrDumpRate || 0,
  //           transPortAmount: _fixedPoint(
  //             +item?.quantity * +item?.transportRate || 0,
  //             false
  //           ),
  //           goDownLabourAmount: _fixedPoint(
  //             +item?.quantity * +item?.godownUnloadingRate || 0,
  //             false
  //           ),
  //           ghatLabourAmount: 0,
  //           lighterCarrierAmount: 0,
  //           isProcess: false,
  //           deliveryId: item?.deliveryId || 0,
  //           numItemPrice: +item?.numItemPrice || 0,
  //           salesRevenueAmount: _fixedPoint(
  //             ((+item?.quantity * 50) / 1000) * +item?.numItemPrice || 0,
  //             false
  //           ),
  //           // salesRevenueAmount: +item?.salesRevenueAmount || 0,
  //         },
  //       };
  //     });

  //     const payload = typeId === 1 ? payloadOne : payloadTwo;

  //     approveConfirmationHandler(payload, values);
  //   }
  // };

  // _______ form data changing handler function _________
  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "type":
        setFieldValue("type", currentValue);
        setFieldValue("shipToPartner", {
          value: 0,
          label: "All",
        });
        setRowData([]);
        if (currentValue) {
          getGodownDDL(
            buId,
            currentValue === "badc" ? 73244 : 73245,
            setGodownDDL,
            setLoading
          );
        }
        getData(values, pageNo, pageSize, "");
        break;

      default:
        break;
    }
  };

  // _______ table data changing handler functions _________
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

  // ______ searchable supplier DDL function ___________
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

  //  _______ view button disable handler function __________
  const isDisabled = (values) => {
    return (
      !values?.confirmationType ||
      !values?.shipPoint ||
      !values?.shipToPartner ||
      !values?.motherVessel ||
      !values?.confirmationStatus
    );
  };

  //  _______ approve button disable handler function __________
  // const disabled = (values) => {
  //   return (
  //     !values?.remarks ||
  //     !values?.billRef ||
  //     rowData?.data?.filter((item) => item?.isSelected)?.length < 1
  //   );
  // };

  //  ________ calculations of totals that showing on top the table __________
  const totalQty = getTotal(rowData?.data, "quantity", "isSelected");

  const totalBill = (values) => {
    return _fixedPoint(
      rowData?.data
        ?.filter((item) => item?.isSelected)
        ?.reduce(
          (x, y) =>
            (x +=
              (values?.confirmationType?.value === 2
                ? +y?.transportRate
                : values?.confirmationType?.value === 3
                ? +y?.godownUnloadingRate
                : 0) * +y?.quantity),
          0
        ),
      true
    );
  };

  const totalRevenue = _fixedPoint(
    rowData?.data
      ?.filter((item) => item?.isSelected)
      ?.reduce((x, y) => (x += y?.numItemPrice * y?.quantityTon), 0),
    true
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard
              title="Shipping Challan Info"
              // createHandler={() => {
              //   saveHandler(values);
              // }}
              // createBtnText={"Approve"}
              // createBtnClass='btn-info'
              // disableCreateBtn={disabled(values)}
            >
              {loading && <Loading />}
              <Form
                obj={{
                  paginationSearchHandler,
                  onChangeHandler,
                  setFieldValue,
                  shipPointDDL,
                  totalRevenue,
                  isDisabled,
                  setRowData,
                  godownDDL,
                  totalBill,
                  totalQty,
                  pageSize,
                  getData,
                  rowData,
                  status,
                  pageNo,
                  values,
                }}
              />

              <Table
                obj={{
                  status,
                  values,
                  pageNo,
                  rowData,
                  pageSize,
                  godownDDL,
                  setPageNo,
                  allSelect,
                  selectedAll,
                  loadOptions,
                  setPageSize,
                  rowDataHandler,
                  setPositionHandler,
                }}
              />
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ShippingChallanInfo;
