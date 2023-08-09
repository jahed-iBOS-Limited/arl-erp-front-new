import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { salesReturnEntry } from "../helper";
import Form from "./form";

const initData = {
  channel: "",
  customer: "",
  challan: "",
  returnType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function SalesReturnForm() {
  const [gridData, getGirdData, loader, setGridData] = useAxiosGet([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId, employeeId: empId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const commonGridFunc = (values) => {
    const returnType = values?.returnType?.value;

    const urlOne = `/oms/SalesInformation/GetDeliveryChallanNSalesOrderCancel?Challan=${values?.challan}&Unitid=${buId}&Partid=5&Narration=test&InactiveBy=${empId}&Customerid=${values?.customer?.value}`;

    const urlTwo = `/oms/SalesReturnAndCancelProcess/GetDeliveryDataForSalesReturnPartial?accountId=${accId}&businessUnitId=${buId}&channelId=${values?.channel?.value}&businessPartnerId=${values?.customer?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`;

    const URL = returnType === 1 ? urlOne : returnType === 2 ? urlTwo : ``;

    getGirdData(URL, (resData) => {
      const modifyData = resData?.map((item) => ({
        ...item,
        isSelected: false,
        rowData:
          returnType === 2
            ? item?.rowData?.map((elem) => ({ ...elem, returnQty: "" }))
            : [],
      }));

      setGridData(modifyData);
    });
  };

  const allSelect = (value) => {
    let _data = [...gridData];
    const modify = _data.map((item) => {
      return { ...item, isSelected: value };
    });
    setGridData(modify);
  };

  const selectedAll = () => {
    return gridData?.filter((item) => item.isSelected)?.length ===
      gridData?.length && gridData?.length > 0
      ? true
      : false;
  };

  const saveHandler = (values) => {
    const selectedItems = gridData?.filter((item) => item.isSelected);
    if (selectedItems?.length === 0 && values?.returnType?.value === 2) {
      toast.warn("Please select at least one item");
      return;
    }
    if (
      selectedItems?.filter(
        (element) => element?.numDamageQnt > element?.numDeliveryQnt
      )?.length > 0
    ) {
      toast.warn(`Please check damage quantities!
      Damage qty can not be greater than delivery qty`);
      return;
    }
    const rows = values?.returnType?.value === 1 ? gridData : selectedItems;
    const totalQty = rows?.reduce(
      (a, b) =>
        a + values?.returnType?.value === 1
          ? b?.numDeliveryQnt
          : b?.numDamageQnt,
      0
    );
    const totalAmount = rows?.reduce(
      (a, b) =>
        a + values?.returnType?.value === 1
          ? b?.numDeliveryQnt * b?.numProductPrice
          : +b?.numDamageQnt * b?.numProductPrice,
      0
    );
    const payload = {
      head: rows?.map((item) => {
        return {
          salesOrderId: item?.intSOID,
          salesOrderNo: item?.stroder,
          deliveryChallan: item?.strchallan,
          deliveryID: item?.intDeliveryID,
          businessUnitId: buId,
          businessPartnerId: values?.customer?.value,
          businessPartnerName: values?.customer?.label,
          totalQty: totalQty,
          totalAmount: totalAmount,
          salesReturnType: values?.returnType?.value,
        };
      }),

      row: rows?.map((item) => {
        return {
          referenceId: 0,
          referenceCode: "",
          itemId: item?.intItemID,
          itemName: item?.strItemName,
          uoMId: 0,
          uoMName: "",
          issueQty: +item?.numDeliveryQnt,
          returnQty:
            values?.returnType?.value === 1
              ? +item?.numDeliveryQnt
              : +item?.numDamageQnt,
          basePrice: +item?.numProductPrice,
          returnPercentage: 0,
        };
      }),

      img: [{ imageId: 0 }],
      businessUnitId: buId,
      actionById: userId,
    };
    salesReturnEntry(payload, setLoading, () => {
      commonGridFunc(values);
    });
  };

  const isLoader = loading || loader;

  return (
    <>
      {isLoader && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        gridData={gridData}
        setGridData={setGridData}
        history={history}
        commonGridFunc={commonGridFunc}
        selectedAll={selectedAll}
        allSelect={allSelect}
        accId={accId}
        buId={buId}
      />
    </>
  );
}

export default SalesReturnForm;
