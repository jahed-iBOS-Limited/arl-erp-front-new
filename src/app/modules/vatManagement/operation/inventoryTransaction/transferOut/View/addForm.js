/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSingleData, saveTrasnferOut } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";

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

export default function TrasferOutViewForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  const [customData, setCustomData] = useState([]);
  const [total, setTotal] = useState({ totalAmount: 0 });
  // const [checkPublic, setCheckPublic] = useState(false);
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  // console.log(checkPublic, "checkPublic")

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (id) {
      getSingleData(id, setSingleData, setRowDto);
      // setSingleData("123")
    }
  }, [id]); // location

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
        //obj row
        let objRow = rowDto?.map((item) => ({
          rowId: item.expenseRowId ? item.expenseRowId : 0,
          dteExpenseDate: item.expenseDate,
          businessTransactionId: item.transaction.value,
          businessTransactionName: item.transaction.label,
          numQuantity: +item.quantity,
          numRate: +item.totalAmount / +item.quantity,
          numAmount: +item.totalAmount,
          expenseLocation: item.location,
          comments: item.comments2,
          attachmentLink: "string",
        }));
        const payload = {
          objHeader: {
            taxTransactionTypeId: 0,
            taxTransactionTypeName: "string",
            accountId: 0,
            businessUnitId: 0,
            businessUnitName: "string",
            taxBranchId: 0,
            taxBranchName: "string",
            taxBranchAddress: "string",
            otherBranchId: 0,
            otherBranchName: "string",
            otherBranchAddress: "string",
            actionBy: +profileData?.userId,
          },
          objRow: objRow,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          // editExpenseRegister(payload);
        }
      } else {
        // obj row for transfer out
        let objRow = rowDto?.map((item) => ({
          taxItemGroupId: values?.itemName?.value,
          taxItemGroupName: values?.itemName?.label,
          uomid: values?.uom?.value,
          uomname: values?.uom?.label,
          salesUomid: 0,
          salesUomname: "string",
          quantity: +values?.quantity,
          basePrice: +item?.basePrice,
          baseTotal: 0,
          sdtotal: 0,
          vatTotal: 0,
          surchargeTotal: 0,
          isFree: false,
        }));

        const payload = {
          objHeader: {
            taxTransactionTypeId: 0,
            vehicleNo: values?.vehicleInfo,
            referenceNo: values?.referenceNo,
            referenceDate: values?.referenceDate,
            accountId: +profileData?.accountId,
            businessUnitId: values?.toBusinessUnit?.value,
            businessUnitName: values?.toBusinessUnit?.label,
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
          saveTrasnferOut(payload, cb);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  // const remover = (index) => {
  //   const filterArr = rowDto.filter((itm, idx) => idx !== index);
  //   setRowDto(filterArr);
  // };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

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
        totalQR = +rowDto[i].quantity * +rowDto[i].rate;

        totalAmount += totalQR;
      }
    }

    setTotal({ totalAmount });
  }, [rowDto]);

  return (
    <ICustomCard
      title={"View Transfer Type Out"}
      backHandler={()=>{
        history.goBack();
      }}
      renderProps={() => {}}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={id ? singleData?.objHeader : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        sbu={location?.state?.selectedSbu}
        customData={customData}
        setCustomData={setCustomData}
        total={total}
        itemSelectHandler={itemSelectHandler}
        setRowDto={setRowDto}
      />
    </ICustomCard>
  );
}
