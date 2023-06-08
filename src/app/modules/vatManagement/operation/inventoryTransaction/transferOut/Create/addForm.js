import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import IForm from "./../../../../../_helper/_form";
import Loading from "./../../../../../_helper/_loading";
import {
  getSingleData,
  saveEditedTransferOut,
  saveTrasnferOut,
} from "../helper";

const initData = {
  branch: "",
  branchAddress: "",
  transactionType: "",
  itemType: "",
  toBusinessUnit: "",
  transferTo: "",
  address: "",
  transactionDate: _todayDate(),
  vehicleInfo: "",
  referenceNo: "",
  referenceDate: _todayDate(),
  totalamount: "",
  itemName: "",
  uom: "",
  quantity: "",
  // isFree:"False"
};

export default function TrasferOutCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const { state: landingData } = useLocation();
  const params = useParams();
  const [customData, setCustomData] = useState([]);
  const [total, setTotal] = useState({ totalAmount: 0 });
  const [isClosingCheck, setIsClosingCheck] = useState(false);
  // const [checkPublic, setCheckPublic] = useState(false);
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (params?.id && landingData?.itemType?.value) {
      getSingleData(
        params?.id,
        landingData?.itemType?.value,
        setSingleData,
        setRowDto
      );
    }
  }, [params, landingData]); // location

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
        //obj row
        let objRow = rowDto?.map((item) => ({
          taxItemGroupId: +item?.itemName?.value,
          taxItemGroupName: item?.itemName?.label,
          uomid: +item?.uom?.value,
          uomname: item?.uom?.label,
          salesUomid: 0,
          salesUomname: "string",
          quantity: +item?.quantity,
          basePrice: +item?.basePrice,
          baseTotal: +item?.individualAmount,
          sdtotal: 0,
          vatTotal: 0,
          surchargeTotal: 0,
          isFree: true,
        }));

        const payload = {
          objEdit: {
            taxSalesId: +params?.id,
            accountId: +profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            itemTypeId: values?.itemType?.value,
          },
          objListRow: objRow,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          if (isClosingCheck) {
            toast.warning("This period tax already closed");
          } else {
            saveEditedTransferOut(payload, setDisabled);
          }
        }
      } else {
        // obj row for transfer out
        let objRow = rowDto?.map((item) => ({
          taxItemGroupId: +item?.itemName?.value,
          taxItemGroupName: item?.itemName?.label,
          uomid: +item?.uom?.value,
          uomname: item?.uom?.label,
          salesUomid: 0,
          salesUomname: "string",
          quantity: +item?.quantity,
          basePrice: +item?.basePrice,
          baseTotal: +item?.individualAmount,
          sdtotal: 0,
          vatTotal: 0,
          surchargeTotal: 0,
          isFree: false,
        }));

        const payload = {
          itemTypeId: values?.itemType?.value,
          objHeader: {
            taxTransactionTypeId: values.transactionType.value,
            vehicleNo: values?.vehicleInfo,
            referenceNo: values?.referenceNo || "",
            referenceDate: values?.referenceDate,
            accountId: +profileData?.accountId,
            businessUnitId: selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit?.label,
            taxBranchId: +values?.branch?.value,
            taxBranchName: values?.branch?.label,
            taxBranchAddress: values?.address,
            otherBranchId: values?.transferTo?.value,
            otherBranchName: values?.transferTo?.label,
            otherBranchAddress: values?.address,
            actionBy: +profileData?.userId,
          },
          objRowList: objRow,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          if (isClosingCheck) {
            toast.warning("This period tax already closed");
          } else {
            saveTrasnferOut(payload, cb, setDisabled);
          }
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    let totalQR = 1;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalQR = +rowDto[i]?.quantity * +rowDto[i]?.basePrice;
        totalAmount += totalQR;
      }
    }
    setTotal({ totalAmount });
  }, [rowDto]);
  return (
    <IForm
      title={"Create Transfer Out"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData?.objHeader : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        customData={customData}
        setCustomData={setCustomData}
        total={total}
        itemSelectHandler={itemSelectHandler}
        isEdit={params?.id || false}
        setRowDto={setRowDto}
        landingData={landingData}
        setIsClosingCheck={setIsClosingCheck}
      />
    </IForm>
  );
}
