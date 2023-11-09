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
import { getLandingDataForConfirmation, updateSalesOrders } from "../helper";
import Form from "./form";
import Table from "./table";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const ALL = { value: 0, label: "All" };

const initData = {
  confirmationType: { value: 2, label: "Supervisor Confirmation" },
  type: "badc",
  shipPoint: ALL,
  shipToPartner: ALL,
  port: ALL,
  motherVessel: ALL,
  status: { value: 1, label: "Pending" },
  jvDate: _todayDate(),
  fromDate: _todayDate(),
  toDate: _todayDate(),
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
  const [motherVessels, getMotherVessels] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // ______ landing data fetching functions __________
  const getData = (values, pageNo, pageSize, searchTerm = "") => {
    getLandingDataForConfirmation(
      accId,
      buId,
      values,
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
    getMotherVessels(
      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${0}`
    );
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
  const saveHandler = (values) => {
    const selectedItems = rowData?.data?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one item.");
    }

    const checkBeforeSubmitData = selectedItems.find(
      (item) => !item?.salesOrder
    );

    if (checkBeforeSubmitData) {
      return toast("Please enter sales order no on all selected rows", {
        type: "warning",
      });
    }

    const payload = selectedItems?.map((item) => {
      return {
        objectHeader: {
          deliveryId: item?.deliveryId,
          actionBy: userId,
          salesOrderCode: item?.salesOrder,
          motherVesselId: item?.motherVessel?.value,
          remarks: item?.remarks,
        },
      };
    });

    updateSalesOrders(payload, setLoading, () => {
      getData(values, pageNo, pageSize);
    });
  };

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
      !values?.status
    );
  };

  //  _______ approve button disable handler function __________
  const disabled = (values) => {
    return rowData?.data?.filter((item) => item?.isSelected)?.length < 1;
  };

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
              createHandler={() => {
                saveHandler(values);
              }}
              createBtnText={"Update Sales Orders"}
              // createBtnClass='btn-info'
              disableCreateBtn={disabled(values)}
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
                  motherVessels,
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
