// /* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getItemTypeDDL_api,
  getTaxBranchDDL_api,
  saveEditedProduction,
  saveItemDestroy,
} from "../helper";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../../_helper/_todayDate";
import IForm from './../../../../../_helper/_form';
import Loading from "../../../../../_helper/_loading";


const initData = {
  branchName: "",
  branchAddress: "",
  transactionDate: _todayDate(),
  vatTotal: "",
  referenceNo: "",
  referenceDate: _todayDate(),
  sdChargeableValue: "",
  sdTotal: "",
  itemName: "",
  itemType: "",
  quantity: "",
};

export default function ItemDestroyForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [taxBranchDDL, setTaxBranchDDL] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const location = useLocation();
  const [itemType, setItemType] = useState();
  const [itemNameList, setItemNameList] = useState([]);
  const [isClosingCheck, setIsClosingCheck] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getTaxBranchDDL_api(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
      getItemTypeDDL_api(setItemType);
    }
  }, [profileData, selectedBusinessUnit]);

  //SingleData to view
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");

  const saveHandler = async (values, cb) => {
    if (isClosingCheck) {
      toast.warning("This period tax already closed");
      return false;
    } 
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const editRowDto = rowDto.map((itm, index) => ({
          rowId: 0,
          taxPurchaseHeaderId: 0,
          taxItemGroupId: values?.itemName?.value,
          taxItemGroupName: values?.itemName?.label,
          uomid: +itm?.uomId,
          uomname: itm?.uomName,
          quantity: +values?.quantity,
          invoicePrice: 0,
          sd: +itm?.sdpercentage,
          vat: +itm?.vatamount,
        }));

        const payload = {
          objHeader: {
            taxPurchaseId: 1,
          },
          objRow: editRowDto,
        };
        saveEditedProduction(payload, setDisabled);
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
        }
      } else {
        const newRowDto = rowDto.map((item, index) => ({
          taxItemGroupId: item?.taxItemGroupId,
          taxItemGroupName: item?.taxItemGroupName,
          uomid: item?.uomId,
          uomname: item?.uom,
          sdchargeableValue: item?.sdChargeableValue,
          totalUsedQty: item?.useQuantity,
          itemBaseValue: item?.basedPrice,
          sdAmount: item?.sdTotal,
          vatAmount: item?.vat,
        }));
        const payload = {
          objHeader: {
            accountId: profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            itemTypeId: values?.itemType?.value,
            transactionDate: values?.transactionDate,
            referenceNo: values?.referenceNo || "",
            referenceDate: values?.referenceDate,
            actionBy: profileData?.userId,
            taxItemGroupId: values?.itemName?.value,
            taxItemGroupName: values?.itemName?.label,
            taxItemGroupQty: values?.quantity || 0,
            taxBranchId: values?.branchName?.value,
            taxBranchName: values?.branchName?.label,
            taxBranchAddress: values?.branchName?.address,
            sdchargeableValueTotal: values?.sdChargeableValue,
            sdAmountTotal: values?.sdTotal,
            vatAmountTotal: values?.vatTotal,
          },
          objRowList: newRowDto,
        };

   


        // If you don't Undarstand, Please contact with Jahed Bhai!
        if (values?.itemType?.value === 3) {
          if (values?.quantity) {
            if (rowDto?.length === 0) {
              toast.warn("Please add transaction");
            } else {
              saveItemDestroy(payload, cb, setDisabled);
            }
          } else {
            toast.warning("Quantity must be needed");
          }
        } else {
          if (rowDto?.length === 0) {
            toast.warn("Please add transaction");
          } else {

            saveItemDestroy(payload, cb, setDisabled);
          }
        }
      }
    } else {
      setDisabled(false);
    }
  };

  // calculation
  const rowCalculateFunc = (arr, setFieldValue) => {
    const sdChargeableValue = arr.reduce(
      (sum, data) => data.sdChargeableValue + sum,
      0
    );
    const sdTotalData = arr.reduce((sum, data) => data.sdTotal + sum, 0);
    const vatTotal = arr.reduce((sum, data) => data.vat + sum, 0);
    setFieldValue("sdChargeableValue", sdChargeableValue);
    setFieldValue("sdTotal", sdTotalData);
    setFieldValue("vatTotal", vatTotal);
  };

  // Vat & SD Input from onChange Handler
  const rowDtoHandler = (name, value, sl, setFieldValue) => {
    const xData = [...rowDto];
    xData[sl][name] = +value;
    setRowDto([...xData]);
    rowCalculateFunc(xData, setFieldValue);
  };

  // Add Row Data Handler
  const addRowDataHandler = (mId, values, setFieldValue) => {
    let filterData = rowDto?.filter((item) => item?.meterialId === mId);

    if (filterData?.length > 0) {
      toast.warning("Duplicate Item Not Allowed");
    } else {
      const payload = {
        meterialId: +values?.itemName?.value,
        materialName: values?.itemName?.label,
        uom: values?.itemName?.uomName,
        useQuantity: +values?.quantity,
        sdChargeableValue: 0,
        sdTotal: 0,
        vat: 0,
        basedPrice: 0,
        taxItemGroupId: +values?.itemName?.value,
        taxItemGroupName: values?.itemName?.label,
        uomId: +values?.itemName?.uomId,
      };
      setRowDto([...rowDto, payload]);
      setFieldValue("quantity", "");
    }
  };

  // Remover Row Data
  const remover = (index, setFieldValue) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
    rowCalculateFunc(filterArr, setFieldValue);
  };

  return (
    <IForm
      title="Create Item Destroy"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit?.value}
        taxBranchDDL={taxBranchDDL}
        itemType={itemType}
        isEdit={id || false}
        rowDtoHandler={rowDtoHandler}
        addRowDataHandler={addRowDataHandler}
        itemNameList={itemNameList}
        rowDto={rowDto}
        remover={remover}
        setItemNameList={setItemNameList}
        setRowDto={setRowDto}
        state={location.state}
        setIsClosingCheck={setIsClosingCheck}
      />
    </IForm>
  );
}
