import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { getSalesReturnPreData } from "../helper";
import Form from "./form";

const initData = {
  channel: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function RecevingChallanAttachmentEntryFrom() {
  const [gridData, , loader, setGridData] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [, partialSalesReturnEntry, entryLoader] = useAxiosPost();
  // const [uploadedImage, setUploadedImage] = useState([]);
  const history = useHistory();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const commonGridFunc = (values) => {
    const urlTwo = `/oms/SalesReturnAndCancelProcess/GetDeliveryDataForSalesReturnPartial?accountId=${accId}&businessUnitId=${buId}&channelId=${
      values?.channel?.value
    }&businessPartnerId=${values?.customer?.value || 0}&FromDate=${
      values?.fromDate
    }&ToDate=${values?.toDate}`;

    getSalesReturnPreData(urlTwo, setLoading, (resData) => {
      const modifyData = resData?.data?.map((item) => ({
        ...item,
        attatchment:'',
        isSelected: false,
        rowData: item?.rowData?.map((elem) => ({ ...elem, returnQty: "" })),
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

  console.log(gridData, "gridData")
  const saveHandler = (values) => {
    const selectedItems = gridData?.filter((item) => item.isSelected);
    if (selectedItems?.length === 0) {
      toast.warn("Please select at least one item");
      return;
    }

    const qtyCheck = selectedItems?.filter((header) => {
      return header?.rowData?.find(
        (row) =>
          row?.returnQty > row?.quantity ||
          row?.returnQty >
            // row?.quantity * (2 / 100) fixed to two decimal
            _fixedPoint(row?.quantity * (2 / 100), false)
      );
    });

    if (qtyCheck?.length) {
      toast.warn(
        `Please check return quantities! Return qty can not be greater than 2% of delivery qty*`
      );
      return;
    }

    const rows = selectedItems;

    console.log(rows, "rows")

    const payloadForPartialReturn = rows?.map((header) => {
      console.log(header, "header")
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
          salesReturnType: 2,
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
            returnQty: row?.returnQty,
            basePrice: row?.itemPrice,
            returnPercentage: _fixedPoint(
              (row?.returnQty / row?.quantity) * 100,
              false
            ),
          };
        }),

        img: {
          attatchment: header?.attatchment|| "",
        },
      };
    });
    partialSalesReturnEntry(
      `/oms/SalesReturnAndCancelProcess/SalesReturnEntry`,
      payloadForPartialReturn,
      () => {
        commonGridFunc(values);
      },
      true
    );
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
        // setUploadedImage={setUploadedImage}
      />
    </>
  );
}

export default RecevingChallanAttachmentEntryFrom;
