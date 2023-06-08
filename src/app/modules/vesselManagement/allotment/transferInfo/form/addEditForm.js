import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetShipPointDDL } from "../../generalInformation/helper";
import Form from "./form";

let initData = {
  transactionDate: _todayDate(),
  transactionType: "",
  shipPoint: "",
  toShipPoint: "",
  comment: "",
  itemType: "",
  item: "",
  quantity: "",
};

export default function TransferInfoForm() {
  const { type } = useParams();
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [, postData, loading] = useAxiosPost();
  const [, getItems, isLoading] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetShipPointDDL(accId, buId, setShipPointDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const getTransferOutedItems = (values) => {
    getItems(
      `/wms/FertilizerOperation/GetTransferOutQty?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${values?.shipPoint?.value}&ToShipPointId=${values?.toShipPoint?.value}`,
      (resData) => {
        setRowDto(resData?.map((item) => ({ ...item, isSelected: false })));
      }
    );
  };

  const saveHandler = async (values, cb) => {
    const selectedItems = rowDto?.filter((item) => item?.isSelected);
    if (values?.transactionType?.value === 5 && selectedItems?.length < 1) {
      return toast.warn("Please select at least one item!");
    }
    const transferInData = selectedItems?.map((item) => {
      return {
        inventoryTransactionId: item?.inventoryTransactionId,
        headerObject: {
          transactionDate: values?.transactionDate,
          accountId: accId,
          businessUnitId: buId,
          businessUnitName: buName,
          transactionTypeId: values?.transactionType?.value,
          transactionTypeName: values?.transactionType?.label,
          fromshipPointId: values?.shipPoint?.value,
          fromshipPointName: values?.shipPoint?.label,
          toShipPointId: values?.toShipPoint?.value,
          toShipPointName: values?.toShipPoint?.label,
          comments: values?.comments,
          actionBy: userId,
          isTransferReceive: values?.transactionType?.value === 5,
        },
        rowObject: {
          itemId: item?.itemId,
          itemName: item?.itemName,
          transactionQuantity: item?.transactionQuantity,
          actionBy: userId,
        },
      };
    });

    const payload =
      values?.transactionType?.value === 5 ? transferInData : rowDto;

    postData(
      `/wms/FertilizerOperation/CreateG2GInventoryTransfer`,
      payload,
      () => {
        cb();
        setRowDto([]);
      },
      true
    );
  };

  const addRow = (values, cb) => {
    const newRow = {
      headerObject: {
        transactionDate: values?.transactionDate,
        accountId: accId,
        businessUnitId: buId,
        businessUnitName: buName,
        transactionTypeId: values?.transactionType?.value,
        transactionTypeName: values?.transactionType?.label,
        fromshipPointId: values?.shipPoint?.value,
        fromshipPointName: values?.shipPoint?.label,
        toShipPointId: values?.toShipPoint?.value,
        toShipPointName: values?.toShipPoint?.label,
        comments: values?.comments,
        actionBy: userId,
        isTransferReceive: values?.transactionType?.value === 5,
      },
      rowObject: {
        itemId: values?.item?.value,
        itemName: values?.item?.label,
        transactionQuantity: values?.quantity,
        actionBy: userId,
      },
    };
    setRowDto([...rowDto, newRow]);
    cb();
  };

  const removeRow = (i) => {
    setRowDto(rowDto?.filter((_, idx) => i !== idx));
  };

  const allSelect = (value) => {
    let _data = [...rowDto];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowDto(modify);
  };

  const selectedAll = () => {
    return rowDto?.length > 0 &&
      rowDto?.filter((item) => item?.isSelected)?.length === rowDto?.length
      ? true
      : false;
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowDto];
    _data[index][name] = value;
    setRowDto(_data);
  };

  const title = `${type === "view" ? "View " : "Create"} Transfer Information`;

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <Form
        type={type}
        accId={accId}
        buId={buId}
        title={title}
        history={history}
        rowDto={rowDto}
        addRow={addRow}
        selectedAll={selectedAll}
        allSelect={allSelect}
        setRowDto={setRowDto}
        removeRow={removeRow}
        initData={initData}
        rowDataHandler={rowDataHandler}
        saveHandler={saveHandler}
        shipPointDDL={shipPointDDL}
        getTransferOutedItems={getTransferOutedItems}
      />
    </>
  );
}
