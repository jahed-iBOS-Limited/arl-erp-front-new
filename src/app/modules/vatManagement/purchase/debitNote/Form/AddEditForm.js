/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Form from "./Form";
import { useSelector, shallowEqual } from "react-redux";
import { getDebitNoteById, saveDebitNote } from "../helper/helper";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { editDebitNote_api } from "./../helper/helper";

let initData = {
  branch: "",
  partnerName: "",
  purchaseInvoice: "",
  fiscalYear: "",
  itemName: "",
  checkAllItem: false,
};

export default function SalesDebitNoteCreateForm({
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowData, setRowData] = useState([]);
  const params = useParams();
  const location = useLocation();
  const [singleData, setSingleData] = useState("");
  const [purchaseItemDetailsSingle, setPurchaseItemDetailsSingle] = useState(
    []
  );
  const [
    purchaseItemDetailsMultipleAll,
    setPurchaseItemDetailsMultipleAll,
  ] = useState([]);
  const [viewData, setViewData] = useState({});

  // get profileData unit from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //singleData
  useEffect(() => {
    getDebitNoteById(id, setSingleData, setRowData);
  }, [id]);

  // Set View Data
  useEffect(() => {
    setViewData({ objHeaderDTO: singleData?.objHeader });
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (+params?.id) {
        const modifiedData = rowData.map((item, index) => {
          return {
            taxPurchaseHeaderId: 0, //number
            taxItemGroupId: +item?.taxItemGroupId, //number
            taxItemGroupName: item?.taxItemGroupName,
            uomid: +item?.uomid, //number
            uomname: item?.uomname,
            quantity: +item?.quantity, //number
            invoicePrice: +item?.invoicePrice, //number
            invoiceTotal: +item?.invoiceTotal, //number
            cdtotal: +item?.cdtotal, //number
            rdtotal: +item?.rdtotal, //number
            baseTotal: +item?.baseTotal, //number
            sdtotal: +item?.sdtotal, //number
            subTotal: +item?.subTotal, //number
            vatTotal: +item?.vatTotal, //number
            grandTotal: +item?.grandTotal, //number
            rebateTotal: +item?.rebateTotal, //number
            isFree: true,
            rowId: item?.rowId || 0,
          };
        });
        if (rowData.length > 0) {
          const payload = {
            objHeader: {
              taxPurchaseId: +params?.id,
            },
            objRow: modifiedData,
          };
          editDebitNote_api(payload, setDisabled);
        } else {
          toast.warn("Please add transaction");
        }
      } else {
        const modifiedData = rowData.map((item, index) => {
          return {
            taxPurchaseHeaderId: 0, //number
            taxItemGroupId: +item?.taxItemGroupId, //number
            taxItemGroupName: item?.taxItemGroupName,
            uomid: +item?.uomid, //number
            uomname: item?.uomname,
            quantity: +item?.quantity, //number
            invoicePrice: +item?.invoicePrice, //number
            invoiceTotal: +item?.invoiceTotal, //number
            cdtotal: +item?.cdtotal, //number
            rdtotal: +item?.rdtotal, //number
            baseTotal: +item?.baseTotal, //number
            sdtotal: +item?.sdtotal, //number
            subTotal: +item?.subTotal, //number
            vatTotal: +item?.vatTotal, //number
            grandTotal: +item?.grandTotal, //number
            rebateTotal: +item?.rebateTotal, //number
            isFree: true,
          };
        });
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            purchaseId: values?.purchaseInvoice?.value,
            taxBranchId: +location.state.taxBranch.value,
            taxBranchName: location.state.taxBranch.label,
            taxBranchAddress: location.state.taxBranch.address,
            taxYear: new Date().getFullYear(),
            referenceNo: values?.purchaseInvoice?.label,
            actionBy: profileData?.userId,
          },
          objRowList: modifiedData,
        };
        if (rowData.length > 0) {
          saveDebitNote(payload, cb, setRowData, setDisabled);
        } else {
          toast.warn("Please add transaction");
        }
      }
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  //rowDataAddHandler
  const rowDataAddHandler = (checked, values) => {
    const foundData = rowData.filter(
      (item) => +item?.itemName === +values?.itemName?.value
    );
    if (checked) {
      if (foundData.length > 0) {
        toast.warning("Item Name Already Exists");
      } else {
        // multiple item added
        const multipleList = purchaseItemDetailsMultipleAll.map((itm) => ({
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          grandTotal: itm?.grandTotal,
          isFree: itm?.isFree,
          itemNameLabel: itm?.taxItemGroupName,
          purchaseInvoice: itm?.purchaseInvoice?.value,
          itemName: itm?.taxItemGroupId,
          quantity: "",
          sdtotal: "",
          vatTotal: "",
          invoicePrice: itm?.invoicePrice,
          invoiceTotal: itm?.invoiceTotal,
          cdtotal: itm?.cdtotal,
          rdtotal: itm?.rdtotal,
          baseTotal: itm?.baseTotal,
          subTotal: itm?.subTotal,
          rebateTotal: itm?.rebateTotal,
          taxPurchaseHeaderId: 0,
          taxItemGroupId: itm?.taxItemGroupId,
          taxItemGroupName: itm?.taxItemGroupName,
          apiQuantity: +itm?.quantity,
          apivatTotal: +itm?.vatTotal,
          apiSdtotal: +itm?.sdtotal,
        }));
        if (multipleList?.length > 0) {
          setRowData([...multipleList]);
        } else {
          toast.warning("Data not found");
        }
      }
    } else {
      const foundData = rowData.filter(
        (item) => +item?.itemName === +values?.itemName?.value
      );

      if (foundData.length > 0) {
        toast.warning("Item Name Already Exists");
      } else {
        // single item add
        const singleList = purchaseItemDetailsSingle.map((itm) => ({
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          grandTotal: itm?.grandTotal,
          isFree: itm?.isFree,
          itemNameLabel: values?.itemName?.label,
          purchaseInvoice: values?.purchaseInvoice?.value,
          itemName: values?.itemName?.value,
          quantity: "",
          sdtotal: "",
          vatTotal: "",
          invoicePrice: itm?.invoicePrice,
          invoiceTotal: itm?.invoiceTotal,
          cdtotal: itm?.cdtotal,
          rdtotal: itm?.rdtotal,
          baseTotal: itm?.baseTotal,
          subTotal: itm?.subTotal,
          rebateTotal: itm?.rebateTotal,
          taxPurchaseHeaderId: 0,
          taxItemGroupId: itm?.taxItemGroupId,
          taxItemGroupName: itm?.taxItemGroupName,
          apiQuantity: +itm?.quantity,
          apivatTotal: +itm?.vatTotal,
          apiSdtotal: +itm?.sdtotal,
        }));
        if (singleList?.length > 0) {
          setRowData([...rowData, ...singleList]);
        } else {
          toast.warning("Data not found");
        }
      }
    }
  };

  // Delete Item
  const remover = (i) => {
    let newRowData = rowData.filter((item, index) => index !== i);
    setRowData(newRowData);
  };

  // Change Handler for vatTotal, quantity
  const changeHandler = (name, value, index) => {
    let newData = [...rowData];
    newData[index][name] = value;
    setRowData(newData);
  };

  return (
    <IForm
      title='Create Debit Note'
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData?.objHeader : initData}
        //disableHandler={disableHandler}
        saveHandler={saveHandler}
        isEdit={params?.id ? params?.id : false}
        rowData={rowData}
        setRowData={setRowData}
        setPurchaseItemDetailsSingle={setPurchaseItemDetailsSingle}
        setPurchaseItemDetailsMultipleAll={setPurchaseItemDetailsMultipleAll}
        rowDataAddHandler={rowDataAddHandler}
        remover={remover}
        changeHandler={changeHandler}
        viewData={viewData}
        setViewData={setViewData}
      />
    </IForm>
  );
}
