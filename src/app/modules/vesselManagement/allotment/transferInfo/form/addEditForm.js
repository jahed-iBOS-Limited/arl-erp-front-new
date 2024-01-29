import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetShipPointDDL } from "../../generalInformation/helper";
import Form from "./form";
import MotherVesselTransferForm from "./MVesselTransferForm";

const initData = {
  transactionDate: _todayDate(),
  transactionType: "",
  shipPoint: "",
  toShipPoint: "",
  comment: "",
  itemType: "",
  item: "",
  quantity: "",
};

const initDataTwo = {
  fromPort: "",
  fromMotherVessel: "",
  toPort: "",
  toMotherVessel: "",
  quantity: "",
  reason: "",
  organization: "",
  item: "",
};

export default function TransferInfoForm() {
  const { type } = useParams();
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [, postData, loading] = useAxiosPost();
  const [, getItems, isLoading] = useAxiosGet();
  const { state } = useLocation();
  const transferTypeId = state?.transferType?.value;

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
    let transferInData = [];
    const selectedItems = rowDto?.filter((item) => item?.isSelected);
    if (values?.transactionType?.value === 5 && selectedItems?.length < 1) {
      return toast.warn("Please select at least one item!");
    }
    transferInData = selectedItems?.map((item) => {
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

    const URL =
      transferTypeId === 1
        ? "/wms/FertilizerOperation/CreateG2GInventoryTransfer"
        : transferTypeId === 2
        ? "/tms/LigterLoadUnload/CreateMotherVesselTransfer"
        : "";

    postData(
      URL,
      payload,
      () => {
        cb();
        setRowDto([]);
      },
      true
    );
  };

  const addRow = (values, cb) => {
    if (transferTypeId === 1) {
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
    } else if (transferTypeId === 2) {
      const isExist = rowDto?.filter(
        (e) =>
          e?.fromMotherVesselId === values?.fromMotherVessel?.value &&
          e?.toMotherVesselId === values?.toMotherVessel?.value
      );
      if (isExist?.length) {
        return toast.warn("Duplicate entry is not allowed!");
      }

      const newRow = {
        inventoryTransactionId: 0,
        vesselTransferId: 0,
        fromMotherVesselId: values?.fromMotherVessel?.value,
        fromMotherVesselName: values?.fromMotherVessel?.label,
        toMotherVesselId: values?.toMotherVessel?.value,
        toMotherVesselName: values?.toMotherVessel?.label,
        itemId: values?.fromMotherVessel?.itemId,
        transferQuantity: values?.quantity,
        transactionTypeId: 19,
        transactionTypeName: "Transfer Out",
        actionBy: userId,
        accountId: accId,
        businessUnitId: buId,
        reasons: values?.reason,
        fromMvprogramId: values?.fromMotherVessel?.programId,
        toMvprogramId: values?.toMotherVessel?.programId,
        businessPartnerId: values?.organization?.value,
      };

      // const newRow = {
      //   fromMotherVesselId: values?.motherVessel?.value,
      //   fromMotherVesselName: values?.motherVessel?.label,
      //   toMotherVesselId: values?.toMotherVessel?.value,
      //   toMotherVesselName: values?.toMotherVessel?.label,
      //   lighterVesselId: 0,
      //   transferQuantity: values?.quantity,
      //   actionBy: userId,
      //   accountId: accId,
      //   businessUnitId: buId,
      // };
      setRowDto([...rowDto, newRow]);
      cb();
    }
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
      {/* Warehouse to Warehouse Transfer */}
      {transferTypeId === 1 && (
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
      )}
      {/* Mother Vessel to Mother Vessel Transfer */}
      {transferTypeId === 2 && (
        <MotherVesselTransferForm
          obj={{
            rowDto,
            addRow,
            history,
            removeRow,
            saveHandler,
            initData: initDataTwo,
          }}
        />
      )}
    </>
  );
}
