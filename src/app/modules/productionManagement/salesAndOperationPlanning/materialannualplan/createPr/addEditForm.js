/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import { savePurchaseRequest } from "./helper";
import { useLocation, useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";

const initData = {
  requestType: "",
  supplyingWh: "",
  requestDate: _todayDate(),
  bom: "",
  controllingUnit: "",
  costCenter: "",
  costElement: "",
  purpose: "",
  refNo: "",
  code: "",
  address: "",
  requiredDate: _todayDate(),
  itemName: "",
  quantity: "",
  sbu: "",
  po: "",
  plant: "",
  wh: "",
};

export default function CreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const location = useLocation();

  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };

  const saveHandler = async (values, cb) => {
    if (rowDto?.length < 1) return toast.warn("Please add item");

    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let createPurchaseRequestRow = rowDto?.map((item) => ({
        itemId: item?.itemName?.value,
        uoMid: item?.uomName?.value || item?.itemName?.baseUoMId,
        uoMname: item?.itemName?.baseUoMName,
        numRequestQuantity: +item?.quantity,
        dteRequiredDate: item?.requiredDate,
        costElementId: item?.costElement?.value,
        costElementName: item?.costElement?.label,
        billOfMaterialId: 0,
        remarks: item?.rowPurpose || "",
      }));

      let payload = {
        createPurchaseRequestHeader: {
          purchaseRequestCode: "",
          reffNo: values?.refNo,
          purchaseRequestTypeId: values?.requestType?.value,
          purchaseRequestTypeName: values?.requestType?.label,
          accountId: profileData?.accountId,
          accountName: profileData?.accountName,
          businessUnitId: selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          sbuid: values?.sbu?.value,
          sbuname: values?.sbu?.label,
          purchaseOrganizationId: values?.po?.value,
          purchaseOrganizationName: values?.po?.label,
          plantId: values?.plant?.value,
          plantName: values?.plant?.label,
          warehouseId: values?.wh?.value,
          warehouseName: values?.wh?.label,
          deliveryAddress: values?.address,
          supplyingWarehouseId: values?.supplyingWh?.value || 0,
          supplyingWarehouseName: values?.supplyingWh?.label || "",
          requestDate: values?.requestDate,
          actionBy: profileData?.userId,
          costControlingUnitId: values?.controllingUnit?.value || 0,
          costControlingUnitName: values?.controllingUnit?.value || "",
          costCenterName: values?.costCenter?.label,
          costCenterId: values?.costCenter?.value,
          costElementId: values?.costElement?.value,
          costElementName: values?.costElement?.label,
          requiredDate: values?.requiredDate,
          strPurpose: values?.purpose || "",
        },
        createPurchaseRequestRow,
      };
      savePurchaseRequest(payload, cb, setDisabled, IConfirmModal);
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  const setter = (payload, successCB) => {
    if (payload.quantity < 0) {
      return toast.warn("Quantity must be greater than 0");
    }
    const foundItem = rowDto?.filter(
      (item) => item?.itemName?.value === payload?.itemName?.value
    );
    //if (!payload?.purpose) return toast.warn("Add Purpose");
    if (foundItem?.length >= 1)
      return toast.warn("Not allowed to duplicate item");

    successCB();

    let newPayload = {
      ...payload,
      // quantity: parseInt(payload?.quantity?.replace(/[^0-9]/g, ''))
      quantity: +payload?.quantity,
    };
    setRowDto([...rowDto, newPayload]);
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((item, ind) => ind !== index);
    setRowDto(filterArr);
  };

  return (
    <IForm
      title={"Create Purchase Request"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={params?.type === "viewType"}
      isHiddenReset={params?.type === "viewType"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setter={setter}
        remover={remover}
        prId={2}
        type={params?.type}
        location={location}
      />
    </IForm>
  );
}
