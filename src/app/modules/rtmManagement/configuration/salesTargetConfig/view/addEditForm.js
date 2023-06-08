/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form"
import {
  createPurchase,
  getSinglePurchase,
  editPurchase,
} from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from 'react-router-dom'
import ICustomCard from "../../../../_helper/_customCard";


const initData = {
  supplier: "",
  address: "",
  transactionDate: _todayDate(),
  tradeType: "",
  paymentTerm: "",
  vehicalInfo: "",
  refferenceNo: "",
  refferenceDate: _todayDate(),
  totalTdsAmount: "",
  totalVdsAmount: "",
  selectedItem: "",
  selectedUom: "",
  quantity: "",
  rate: "",
  // totalTdsAmount: "",
  // totalVdsAmount: "",
  totalAtv:"",
  totalAit:""

};

export default function PurchaseView({history}) {

  const [
    // isDisabled,
     setDisabled] = useState(true);
  const [objProps,
    //  setObjprops
    ] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const [singleData, setSingleData] = useState("");

  const location = useLocation()

  // const getTotal = (property => {
  //   let total = 0
  //   rowDto.forEach(item => total += item[property])
  //   return parseInt(total)
  // })


  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (params?.id) {
      getSinglePurchase(params?.id, setSingleData, setRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const saveHandler = async (values, cb) => {

    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {

        let objRow = rowDto?.map((item) => ({
          taxPurchaseId:parseInt(params.id),
          rowId : item.rowId,
          taxItemGroupId: item.value,
          taxItemGroupName: item.label,
          uomid: item.uom.value,
          uomname: item.uom.label,
          quantity: +item.quantity,
          invoicePrice: +item.rate,
          cdtotal: item.cd ? (parseInt(item.cd) / 100) * (item.rate * item.quantity) : 0,
          rdtotal: item.rd ? (parseInt(item.rd) / 100) * (item.rate * item.quantity) : 0,
          sdtotal: item.sd ? (parseInt(item.sd) / 100) * (item.rate * item.quantity) : 0,
          vatTotal: item.vat ? (parseInt(item.vat) / 100) * (item.rate * item.quantity) : 0,
          grandTotal: 0,
          rebateTotal: item.rebateAmount || 0,
          isFree: true,
        //   invoiceTotal: 0,
        // baseTotal: 0,
        // subTotal: 0,
        }));

        // "rowId": 0,
        // "taxPurchaseHeaderId": 0,
        // "invoiceTotal": 0,
        // "baseTotal": 0,
        // "subTotal": 0,


        const payload = {
          objEdit: {
            taxPurchaseId: parseInt(params.id),
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit.value,
            // businessUnitName: selectedBusinessUnit.label,
            // taxBranchId: location?.state?.taxBranch?.value,
            // taxBranchName: location?.state?.taxBranch?.label,
            // taxBranchAddress: values.address,
            // purchaseDateTime: values.transactionDate,
            // tradeTypeId: values.tradeType.value,
            // tradeTypeName: values.tradeType.label,
            // supplierId: values.supplier.value,
            // supplierName: values.supplier.label,
            // supplierAddress: values.address || "",
            // paymentTerms: values.paymentTerm.value,
            // paymentTermsName: values.paymentTerm.label,
            // vehicleNo: values.vehicalInfo,
            // referanceNo: values.refferenceNo,
            // referanceDate: values.refferenceDate,
            // aittotal: getTotal("ait"),
            // atvtotal: getTotal("atv"),
            // tdstotal: values.totalTdsAmount,
            // vdstotal: values.totalVdsAmount,
            // actionBy: profileData?.userId
          },
          objListRow: objRow
        }
        editPurchase(payload) ;
      } else {
        // obj row
        let objRow = rowDto?.map((item) => ({
          // taxPurchaseId:params.id,
          // rowId : item.rowId,
          taxItemGroupId: item.value,
          taxItemGroupName: item.label,
          uomid: item.uom.value,
          uomname: item.uom.label,
          quantity: +item.quantity,
          invoicePrice: +item.rate,
          cdtotal: item.cd ? (parseInt(item.cd) / 100) * (item.rate * item.quantity) : 0,
          rdtotal: item.rd ? (parseInt(item.rd) / 100) * (item.rate * item.quantity) : 0,
          sdtotal: item.sd ? (parseInt(item.sd) / 100) * (item.rate * item.quantity) : 0,
          vatTotal: item.vat ? (parseInt(item.vat) / 100) * (item.rate * item.quantity) : 0,
          grandTotal: 0,
          rebateTotal: item.rebateAmount || 0,
          isFree: true
        }));

        // "rowId": 0,
        // "taxPurchaseHeaderId": 0,
        // "invoiceTotal": 0,
        // "baseTotal": 0,
        // "subTotal": 0,


        const payload = {
          objHeaderDTO: {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit.label,
            taxBranchId: location?.state?.taxBranch?.value,
            taxBranchName: location?.state?.taxBranch?.label,
            taxBranchAddress: values.address,
            purchaseDateTime: values.transactionDate,
            tradeTypeId: values.tradeType.value,
            tradeTypeName: values.tradeType.label,
            supplierId: values.supplier.value,
            supplierName: values.supplier.label,
            supplierAddress: values.address || "",
            paymentTerms: values.paymentTerm.value,
            paymentTermsName: values.paymentTerm.label,
            vehicleNo: values.vehicalInfo,
            referanceNo: values.refferenceNo,
            referanceDate: values.refferenceDate,
            aittotal: values.totalAit,
            atvtotal: values.totalAtv,
            tdstotal: values.totalTdsAmount,
            vdstotal: values.totalVdsAmount,
            actionBy: profileData?.userId
          },
          objListRowDTO: objRow
        }


        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
       

          createPurchase(payload, cb);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values, cb) => {
    const arr = rowDto?.filter(
      (item) => item?.value === values?.selectedItem?.value
    );
    if (arr?.length > 0) {
      toast.warn("Not allowed to duplicate items");
    } else {
      const item = {
        ...values.selectedItem,
        uom: values.selectedUom,
        quantity: values.quantity,
        rate: values.rate,
        cd: "",
        rd: "",
        sd: "",
        vat: "",
        ait: "",
        atv: "",
        refund: "",
        rebatAmount: ""
      }
      setRowDto([...rowDto, item]);
      cb()
    }
  }

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const dataHandler = (name, value, sl) => {
    const xData = [...rowDto];
    xData[sl][name] = value;
    setRowDto([...xData]);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  //

  // Set and get value in rowdto
  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  return (
    <ICustomCard
      title="View Purchase"
      backHandler={e => history.goBack()}
      // getProps={setObjprops}
      // isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.id || false}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
        rowDto={rowDto}
        dataHandler={dataHandler}
        // check={check}
        // setCheck={setCheck}
        itemSelectHandler={itemSelectHandler}
      // toggle_check={toggle_check}
      />
    </ICustomCard>
  );
}
