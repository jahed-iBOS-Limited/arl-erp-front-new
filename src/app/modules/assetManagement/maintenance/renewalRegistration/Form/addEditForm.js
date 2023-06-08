/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getActivityByRenewalServiceId,
  getSingleDataById,
  saveRenewalReg,
} from "../helper";
import Form from "./form";

const initData = {
  renewalDate: _todayDate(),
  expiredDate: "",
  nextRenewal: "",
};

const RenewalRegForm = ({
  prevData,
  setisShowModalforCreate,
  getGridAction,
  currentRowId,
  setCurrentRowId,
}) => {
  const [isDisabled, setDisabled] = useState(false);

  const [rowDto, setRowDto] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [singleData, setSingleData] = useState(null);
  const [modifiedInitData, setModifiedInitData] = useState(null);
  const [objProps, setObjprops] = useState({});

  useEffect(() => {
    if (currentRowId) {
      getSingleDataById(currentRowId, setSingleData);
    } else if (prevData?.vehicleNo?.brtaVehicelTypeId)
      setActivityByRenewalServiceId(
        prevData?.renewalType?.value,
        prevData?.vehicleNo?.brtaVehicelTypeId,
        prevData?.vehicleNo?.value,
        setRowDto
      );
  }, [currentRowId]);
  useEffect(() => {
    if (singleData?.objHeader) {
      setRowDto(singleData?.objRow);
      const {
        dteRenewalDate,
        dteValidityDate,
        dteNextRenewalDate,
      } = singleData?.objHeader;
      const data = {
        renewalDate: _dateFormatter(dteRenewalDate) || "",
        expiredDate: _dateFormatter(dteValidityDate) || "",
        nextRenewal: _dateFormatter(dteNextRenewalDate) || "",
      };
      setModifiedInitData(data);
    }
  }, [singleData]);

  const setActivityByRenewalServiceId = (
    renewalType,
    brtaVehicelTypeId,
    vehicleNo,
    setRowDto
  ) => {
    getActivityByRenewalServiceId(
      renewalType,
      brtaVehicelTypeId,
      vehicleNo,
      setRowDto
    );
  };

  useEffect(() => {
    const total = rowDto?.reduce((acc, item) => acc + +item?.amount, 0);
    setTotalAmount(total);
  }, [rowDto]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (totalAmount <= 0)
      return toast.warn("Total amount must be greater than zero");
    setDisabled(true);
    if (currentRowId) {
      const attribute = rowDto?.map((item) => ({
        rowId: item?.rowId,
        attributeId: item?.attributeId,
        attributeName: item?.attributeName,
        amount: +item?.amount,
        validityDate: values?.expiredDate,
        nextRenewalDate: values?.nextRenewal,
      }));

      const payload = {
        intRenewalId: currentRowId,
        isApproved: false,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        plantId: 0,
        assetId: +prevData?.vehicleNo?.value,
        assetCode: prevData?.vehicleNo?.code,
        assetName: prevData?.vehicleNo?.label,
        renewalServiceId: +prevData?.renewalType?.value,
        renewalServiceName: prevData?.renewalType?.label,
        itemId: prevData?.vehicleNo?.itemId,
        itemName: prevData?.vehicleNo?.itemName,
        documentId: "",
        renewalDate: values?.renewalDate,
        validityDate: values?.expiredDate || null,
        nextRenewalDate: values?.nextRenewal || null,
        renewalAmount: totalAmount,
        actionBy: profileData?.userId,
        brtaVehicleTypeId:
          prevData?.vehicleNo?.brtaVehicelTypeId || values?.brtaType?.value,
        brtaVehicleTypeName:
          prevData?.vehicleNo?.brtaVehicelTypeName || values?.brtaType?.label,
        attribute,
      };

      saveRenewalReg(
        payload,
        () => {
          setCurrentRowId(null);
          cb();
        },
        setDisabled
      );
    } else if (
      values &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
    ) {
      const attribute = rowDto?.map((item) => ({
        rowId: item?.rowId,
        attributeId: item?.attributeId,
        attributeName: item?.attributeName,
        amount: +item?.amount,
        validityDate: values?.expiredDate,
        nextRenewalDate: values?.nextRenewal,
      }));

      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        plantId: 0,
        assetId: +prevData?.vehicleNo?.value,
        assetCode: prevData?.vehicleNo?.code,
        assetName: prevData?.vehicleNo?.label,
        renewalServiceId: +prevData?.renewalType?.value,
        renewalServiceName: prevData?.renewalType?.label,
        itemId: prevData?.vehicleNo?.itemId,
        itemName: prevData?.vehicleNo?.itemName,
        documentId: "",
        renewalDate: values?.renewalDate,
        validityDate: values?.expiredDate || null,
        nextRenewalDate: values?.nextRenewal || null,
        renewalAmount: totalAmount,
        actionBy: profileData?.userId,
        brtaVehicleTypeId:
          prevData?.vehicleNo?.brtaVehicelTypeId || values?.brtaType?.value,
        brtaVehicleTypeName:
          prevData?.vehicleNo?.brtaVehicelTypeName || values?.brtaType?.label,
        attribute,
      };

      saveRenewalReg(payload, cb, setDisabled);
    } else {
      setDisabled(false);
    }
  };

  // setRowDto amount dynamically
  const rowDtoHandler = (name, value, index) => {
    let data = [...rowDto];
    let sl = data[index];
    sl[name] = value;
    setRowDto([...data]);
  };

  return (
    <IForm
      title={
        currentRowId ? "Edit Renewal Registration" : "Renewal Registration"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={currentRowId ? modifiedInitData : initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        rowDto={rowDto}
        rowDtoHandler={rowDtoHandler}
        prevData={prevData}
        setisShowModalforCreate={setisShowModalforCreate}
        totalAmount={totalAmount}
        setActivityByRenewalServiceId={setActivityByRenewalServiceId}
        setRowDto={setRowDto}
        getGridAction={getGridAction}
      />
    </IForm>
  );
};

export default RenewalRegForm;
