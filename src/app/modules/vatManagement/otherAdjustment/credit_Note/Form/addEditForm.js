import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "./../../../../_helper/_form";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { ereateCreditNote_api } from "../helper";
import { useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { isUniq } from "../../../../_helper/uniqChecker";
import { toast } from "react-toastify";

const initData = {
  id: undefined,
  partner: "",
  purchaseInvoice: "",
  transactionDate: _todayDate(),
  allItem: false,
  itemName: "",
  fiscalYear: "",
};

export default function CostControllingForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});

  const [total, setTotal] = useState({ totalAmount: 0 });
  const [purchaseItemDetailsSingle, setPurchaseItemDetailsSingle] = useState(
    []
  );
  const [
    purchaseItemDetailsMultipleAll,
    setPurchaseItemDetailsMultipleAll,
  ] = useState([]);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const newData = rowDto?.map((itm) => ({
        taxPurchaseHeaderId: 0,
        taxItemGroupId: itm?.itemId,
        taxItemGroupName: itm?.itemName,
        uomid: itm?.uomid,
        uomname: itm?.uomname,
        invoicePrice: itm?.invoicePrice,
        invoiceTotal: itm?.invoiceTotal,
        cdtotal: itm?.cdtotal,
        rdtotal: itm?.rdtotal,
        baseTotal: itm?.baseTotal,
        subTotal: itm?.subTotal,
        grandTotal: itm?.grandTotal,
        rebateTotal: itm?.rebateTotal,
        isFree: itm?.isFree,
        increaseQuantity: +itm?.quantity,
        increaseVatTotal: +itm?.vatTotal,
        increaseSdtotal: +itm?.sdtotal,
      }));
      if (id) {
      } else {
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            taxBranchId: headerData?.branch?.value,
            taxBranchName: headerData?.branch?.label,
            taxBranchAddress: headerData?.branch?.address,
            purchaseId: values?.purchaseInvoice?.value,
            referenceNo: values?.purchaseInvoice?.value,
            taxYear: values?.fiscalYear?.value,
            actionBy: profileData?.userId,
          },
          objRowList: newData,
        };
        console.log(payload);
        ereateCreditNote_api(payload, cb, setRowDto, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  //rowDataAddHandler
  const rowDataAddHandler = (checked, values) => {
    //uniq check
    if (isUniq("itemId", values?.itemName?.value, rowDto)) {
      if (checked) {
        // multiple item added
        const multipleList = purchaseItemDetailsMultipleAll.map((itm) => ({
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          salesUomid: itm?.uomid,
          salesUomname: itm?.uomname,
          quantity_api: itm?.quantity,
          basePrice: itm?.baseTotal,
          sdtotal_api: itm?.sdtotal,
          vatTotal_api: itm?.vatTotal,
          surchargeTotal: itm?.rebateTotal,
          grandTotal: itm?.grandTotal,
          isFree: itm?.isFree,
          itemName: itm?.taxItemGroupName,
          itemId: itm?.taxItemGroupId,
          quantity: 1,
          sdtotal: 0,
          vatTotal: 0,
          invoicePrice: itm?.invoicePrice,
          invoiceTotal: itm?.invoiceTotal,
          cdtotal: itm?.cdtotal,
          rdtotal: itm?.rdtotal,
          baseTotal: itm?.baseTotal,
          subTotal: itm?.subTotal,
          rebateTotal: itm?.rebateTotal,
        }));
        setRowDto([...rowDto, ...multipleList]);
      } else {
        // single item add
        const singleList = purchaseItemDetailsSingle.map((itm) => ({
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          salesUomid: itm?.uomid,
          salesUomname: itm?.uomname,
          quantity_api: itm?.quantity,
          basePrice: itm?.baseTotal,
          sdtotal_api: itm?.sdtotal,
          vatTotal_api: itm?.vatTotal,
          surchargeTotal: itm?.rebateTotal,
          grandTotal: itm?.grandTotal,
          isFree: itm?.isFree,
          itemName: values?.itemName?.label,
          itemId: values?.itemName?.value,
          quantity: 1,
          sdtotal: 0,
          vatTotal: 0,
          invoicePrice: itm?.invoicePrice,
          invoiceTotal: itm?.invoiceTotal,
          cdtotal: itm?.cdtotal,
          rdtotal: itm?.rdtotal,
          baseTotal: itm?.baseTotal,
          subTotal: itm?.subTotal,
          rebateTotal: itm?.rebateTotal,
        }));
        setRowDto([...rowDto, ...singleList]);
      }
    }else {
      toast.warn("Not allowed to duplicate item!", { toastId: 456 });
    }
  };

  //remover row dto
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  const changeHandler = (name, value, index) => {
    if (name === "increaseQty") {
      const copyRowDto = [...rowDto];
      copyRowDto[index].quantity = value;
      setRowDto(copyRowDto);
    } else if (name === "IncreseVat") {
      const copyRowDto = [...rowDto];
      copyRowDto[index].vatTotal = value;
      setRowDto(copyRowDto);
    } else if (name === "IncreseSd") {
      const copyRowDto = [...rowDto];
      copyRowDto[index].sdtotal = value;
      setRowDto(copyRowDto);
    }
  };

  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalAmount += +rowDto[i].invoicePrice * +rowDto[i].quantity;
      }
    }
    setTotal({ totalAmount });
  }, [rowDto]);

  return (
    <IForm
      title="Create Credit Note"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        rowDataAddHandler={rowDataAddHandler}
        setPurchaseItemDetailsSingle={setPurchaseItemDetailsSingle}
        setPurchaseItemDetailsMultipleAll={setPurchaseItemDetailsMultipleAll}
        changeHandler={changeHandler}
        total={total?.totalAmount}
      />
    </IForm>
  );
}
