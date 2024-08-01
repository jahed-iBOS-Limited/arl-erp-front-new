import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getSalesReturnPreData, salesReturnEntry } from "../helper";
import Form from "./form";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  channel: "",
  customer: "",
  challan: "",
  returnType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function SalesReturnForm() {
  const [gridData, getGirdData, loader, setGridData] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [, partialSalesReturnEntry, entryLoader] = useAxiosPost();

  const history = useHistory();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId, employeeId: empId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const commonGridFunc = (values) => {
    const returnType = values?.returnType?.value;

    const urlOne = `/oms/SalesInformation/GetDeliveryChallanNSalesOrderCancel?Challan=${values?.challan}&Unitid=${buId}&Partid=5&Narration=test&InactiveBy=${empId}&Customerid=${values?.customer?.value}`;

    const urlTwo = `/oms/SalesReturnAndCancelProcess/GetDeliveryDataForSalesReturnPartial?accountId=${accId}&businessUnitId=${buId}&channelId=${
      values?.channel?.value
    }&businessPartnerId=${values?.customer?.value || 0}&FromDate=${
      values?.fromDate
    }&ToDate=${values?.toDate}`;

    if (returnType === 1) {
      getGirdData(urlOne);
    } else if (returnType === 2) {
      getSalesReturnPreData(urlTwo, setLoading, (resData) => {
        const modifyData = resData?.data?.map((item) => ({
          ...item,
          isSelected: false,
          rowData: item?.rowData?.map((elem) => ({ ...elem, returnQty: "" })),
        }));

        setGridData(modifyData);
      });
    }
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
    const returnType = values?.returnType?.value;

    const selectedItems = gridData?.filter((item) => item.isSelected);
    if (selectedItems?.length === 0 && returnType === 2) {
      toast.warn("Please select at least one item");
      return;
    }

    const qtyCheck = selectedItems?.filter((header) => {
      return header?.rowData?.find((row) => row?.returnQty > row?.quantity);
    });

    if (qtyCheck?.length) {
      toast.warn(`Please check return quantities!
      Return qty can not be greater than delivery qty`);
      return;
    }

    const rows = returnType === 1 ? gridData : selectedItems;
    const totalQty = rows?.reduce(
      (a, b) => (a + returnType === 1 ? b?.numDeliveryQnt : b?.numDamageQnt),
      0
    );
    const totalAmount = rows?.reduce(
      (a, b) =>
        a + returnType === 1
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
          salesReturnType: returnType,
          shipmentId: item?.intshipmentid,
          reassons: values?.reason || "",
        };
      }),

      row: rows?.map((item) => {
        return {
          referenceId: item?.intDeliveryID,
          referenceCode: item?.strchallan,
          itemId: item?.intItemID,
          itemName: item?.strItemName,
          uoMId: 0,
          uoMName: "",
          issueQty: +item?.numDeliveryQnt,
          returnQty:
            returnType === 1 ? +item?.numDeliveryQnt : +item?.numDamageQnt,
          basePrice: +item?.numProductPrice,
          returnPercentage: 0,
        };
      }),

      img: [{ imageId: 0 }],
      businessUnitId: buId,
      actionById: userId,
    };

    const payloadForPartialReturn = rows?.map((header) => {
      const totalQty = header?.rowData?.reduce((a, b) => (a += b?.quantity), 0);
      const totalAmount = header?.rowData?.reduce(
        (a, b) => (a += b?.amount),
        0
      );
      return {
        head: {
          salesOrderId: header?.salesOrderId,
          salesOrderCode: header?.salesOrderCode,
          deliveryCode: header?.deliveryCode,
          deliveryID: header?.deliveryId,
          accountId: accId,
          businessUnitId: buId,
          businessPartnerId: header?.soldToPartnerId,
          businessPartnerName: header?.soldToPartnerName,
          totalQty: totalQty,
          totalAmount: totalAmount,
          salesReturnType: returnType,
          actionBy: userId,
        },
        row: header?.rowData?.map((row) => {
          return {
            referenceId: 0,
            referenceCode: "string",
            itemId: row?.itemId,
            itemName: row?.itemName,
            uoMId: 0,
            uoMName: "string",
            issueQty: 0,
            returnQty: row?.returnQty || 0,
            basePrice: row?.itemPrice,
            returnPercentage: _fixedPoint(
              (row?.returnQty / row?.quantity) * 100,
              false
            ),
          };
        }),

        img: {
          attatchment: "string",
        },
      };
    });

    if (returnType === 2) {
      partialSalesReturnEntry(
        `/oms/SalesReturnAndCancelProcess/SalesReturnEntry`,
        payloadForPartialReturn,
        () => {
          commonGridFunc(values);
        },
        true
      );
    } else if (returnType === 1) {
      salesReturnEntry(payload, setLoading, () => {
        commonGridFunc(values);
      });
    }
  };

  const isLoader = loading || loader || entryLoader;

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
