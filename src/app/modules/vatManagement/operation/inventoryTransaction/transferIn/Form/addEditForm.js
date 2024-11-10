import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  createItemTransferIn,
  getTaxBranchDDL,
  getTaxItemTypeDDL,
} from "../helper";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "./../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
const initData = {
  taxBranchName: "",
  taxBranchAddress: "",
  businessUnitName: "",
  otherBranchName: "",
  otherBranchAddress: "",
  transferNo: "",
  taxItemGroupName: "",
  uomname: "",
  quantity: "",
  invoicePrice: "",
  isFree: false,
  itemType: "",
  basePrice: "",
  taxDeliveryDateTime: "",
  taxPurchaseCode: "",
};
export default function TranserInCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");
  const location = useLocation();
  // to show data in create page right side
  const [createPageGrid, setCreatePageGrid] = useState();
  // taxBranchName ddl
  const [taxBranchName, setTaxBranchName] = useState([]);
  //item type ddl
  const [itemType, setItemType] = useState([]);
  // transfer no ddl
  const [transferNo, setTransferNo] = useState([]);
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
      // getItemTransferInById(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    const newData = singleData?.getByIdRow?.map((item) => ({
      taxItemGroupName: item?.taxItemGroupName,
      quantity: item?.quantity,
      uomname: item?.uomname,
    }));
    if (params?.id) {
      setRowDto(newData);
    } else {
      setRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getTaxBranchDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchName
      );
      getTaxItemTypeDDL(setItemType);
    }
  }, [profileData, selectedBusinessUnit]);
  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
      } else {
        // obj row
        let objRow = rowDto?.map((item) => ({
          taxItemGroupId: +item?.taxItemGroupId,
          taxItemGroupName: item?.taxItemGroupName,
          uomid: +item?.uomid,
          uomname: item?.uomname,
          quantity: +item?.quantity,
          invoicePrice: Math.abs(item?.basePrice) || 0,
          invoiceTotal: 0,
          cdtotal: 0,
          rdtotal: 0,
          baseTotal: Math.abs(item?.basePrice) || 0,
          sdtotal: 0,
          subTotal: 0,
          vatTotal: 0,
          grandTotal: 0,
          rebateTotal: 0,
          isFree: true,
        }));

        const payload = {
          taxSalesId: +values?.transferNo?.value,
          itemTypeId: +values?.itemType?.value,
          objHeader: {
            grnid: 0,
            grncode: "",
            tradeTypeId: 0,
            tradeTypeName: "",
            supplierId: +values?.otherBranchName?.value || 0,
            supplierName: values?.otherBranchName?.label || "string",
            supplierAddress: values?.otherBranchAddress,
            referanceDate: values?.transferNo?.refDate,
            referanceNo: values?.transferNo?.value,
            partnerBin: "",
            vehicleNo: "",
            purchaseDateTime: "2020-11-26T08:22:05.875Z",
            taxYear: 0,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            taxBranchId: +location?.state?.selectedTaxBranchDDL?.value,
            taxBranchName: location?.state?.selectedTaxBranchDDL?.label,
            taxBranchAddress: location?.state?.selectedTaxBranchDDL?.address,
            // Branch (From) DDL value
            otherBranchId: +values?.otherBranchName?.value || 0,
            // Branch (From) DDL label
            otherBranchName: values?.otherBranchName?.label,
            otherBranchAddress: values?.otherBranchAddress,
            paymentTerms: 0,
            paymentTermsName: "string",
            aittotal: 0,
            atvtotal: 0,
            tdstotal: 0,
            vdstotal: 0,
            actionBy: +profileData?.userId,
          },
          objRowList: objRow,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add row data");
        } else {
          createItemTransferIn(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const setQuantity = (sl, value, name) => {
    const cloneArr = rowDto;
    cloneArr[sl][name] = +value;
    setRowDto([...cloneArr]);
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  return (
    <IForm
      title="Transfer-In Create"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData?.getByIdHeader : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        remover={remover}
        setRowDto={setRowDto}
        rowDto={rowDto}
        itemSelectHandler={itemSelectHandler}
        location={location}
        taxBranchName={taxBranchName}
        itemType={itemType}
        setTransferNo={setTransferNo}
        transferNo={transferNo}
        setQuantity={setQuantity}
        createPageGrid={createPageGrid}
        setCreatePageGrid={setCreatePageGrid}
      />
    </IForm>
  );
}
