import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";

import {
  createPurchase,
  getSinglePurchase,
  editPurchase,
  rowDtoCalculationFunc,
} from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "./../../../../../_helper/_loading";
import IForm from "./../../../../../_helper/_form";

const initData = {
  supplier: "",
  address: "",
  port: "",
  transactionDate: _todayDate(),
  tradeType: "",
  paymentTerm: "",
  vehicalInfo: "",
  refferenceNo: "",
  refferenceDate: _todayDate(),
  totalTdsAmount: 0,
  totalVdsAmount: 0,
  selectedItem: "",
  selectedUom: "",
  quantity: "",
  amount: "",
  totalAtv: 0,
  totalAit: 0,
  totalAtAmount: 0,
  purchaseType: "",
  isVDS: false,
  lcNumber: "",
  lcDate: _todayDate(),
  customsHouse: "",
  country: { value: 18, label: "Bangladesh" },
  CPCCode: "",
  supplyType: "",
  numberOfItem: "",
};

export default function PurchaseForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [isClosingCheck, setIsClosingCheck] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const [singleData, setSingleData] = useState("");
  const [uploadImage, setUploadImage] = useState([]);
  const [itemVatInfo, setItemVatInfo] = useState("");
  const [totalVDSAmount, setTotalVDSAmount] = useState(0);
  const location = useLocation();

  // eslint-disable-next-line no-unused-vars

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
      getSinglePurchase(params?.id, setSingleData, setRowDto, setDisabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        let objRow = rowDto?.map((item) => ({
          taxPurchaseHeaderId: parseInt(params.id),
          rowId: item.rowId,
          taxItemGroupId: item.value,
          taxItemGroupName: item?.label.includes("(")
            ? item?.label?.split("(")?.[0]
            : item?.label,
          uomid: item.uom.value,
          uomname: item.uom.label,
          quantity: +item.quantity || 0,
          invoicePrice: +item.rate || 0,
          cdtotal: +item?.cal_cdtotal || 0,
          rdtotal: +item?.cal_rdtotal || 0,
          sdtotal: +item?.cal_sdtotal || 0,
          vatTotal: +item?.cal_vatTotal || 0,
          aitTotal: +item?.cal_aitTotal || 0,
          grandTotal: 0,
          rebateTotal: +item.rebateAmount || 0,
          isFree: true,
          // new fild
          invoiceTotal: 0,
          attotal: +item?.cal_atTotal || 0,
          baseTotal: 0,
          subTotal: 0,
          supplyTypeName: item.supplyTypeName || "",
          supplyTypeId: item?.supplyTypeId || 0,
          vatPercentage: item?.vat || 0,
        }));

        const payload = {
          objEdit: {
            taxPurchaseId: parseInt(params.id),
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit.value,
            fileName: uploadImage[0]?.id,
            actionBy: profileData?.userId,
          },
          objListRow: objRow,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
          setDisabled(false);
        } else {
          if (isClosingCheck) {
            toast.warning("This period tax already closed");
          } else {
            editPurchase(payload, setDisabled);
          }
        }
      } else {
        let objRow = rowDto?.map((item) => {
          return {
            taxItemGroupId: item.value,
            taxItemGroupName: item?.label.includes("(")
              ? item?.label?.split("(")?.[0]
              : item?.label,
            uomid: item.uom.value,
            uomname: item.uom.label,
            quantity: +item.quantity || 0,
            invoicePrice: +item.rate || 0,
            cdtotal: +item?.cal_cdtotal || 0,
            rdtotal: +item?.cal_rdtotal || 0,
            sdtotal: +item?.cal_sdtotal || 0,
            vatTotal: +item?.cal_vatTotal || 0,
            atTotal: +item?.cal_atTotal || 0,
            aitTotal: +item?.cal_aitTotal || 0,
            grandTotal: 0,
            rebateTotal: +item.rebateAmount || 0,
            isFree: true,
            supplyTypeName: item.supplyTypeName || "",
            supplyTypeId: item?.supplyTypeId || 0,
            noItem: +values?.numberOfItem || 0,
            vatPercentage: item?.vat || 0,
          };
        });

        const payload = {
          objHeaderDTO: {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit.label,
            taxBranchId: location?.state?.taxBranch?.value,
            taxBranchName: location?.state?.taxBranch?.label,
            taxBranchAddress: location?.state?.taxBranch?.address,
            purchaseDateTime: values.transactionDate,
            tradeTypeId: values.tradeType.value,
            tradeTypeName: values.tradeType.label,
            portId: values?.port?.value || 0,
            supplierId: values.supplier.value,
            supplierName: values.supplier.name,
            supplierAddress: values.address || "",
            paymentTerms: values.paymentTerm.value || 0,
            paymentTermsName: values.paymentTerm.label || "",
            vehicleNo: values.vehicalInfo?.label || "",
            referanceNo: values.refferenceNo || "",
            referanceDate: values.refferenceDate,
            aittotal: +values.totalAit || 0,
            atvtotal: +values.totalAtv || 0,
            tdstotal: +values.totalTdsAmount || 0,
            vdstotal: totalVDSAmount || 0,
            actionBy: profileData?.userId,
            purchaseType: values?.purchaseType?.label || "",
            lcNumber: values?.lcNumber || "",
            fileName: uploadImage[0]?.id || "",
            lcdate: values?.lcDate || "",
            orginCountryId: values?.country?.value || "",
            orginCountryName: values?.country?.label || "",
            customHouseId: values?.customsHouse?.value || 0,
            customHouseName: values?.customsHouse?.withOutCodeLabel || "",
            customHouseCode: values?.customsHouse?.code || "",
            cpcID: 0,
            cpcCode: values?.CPCCode || "",
            cpcDetails: "",
            noItem: +values?.numberOfItem || 0,
          },
          objListRowDTO: objRow,
        };

        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
          setDisabled(false);
        } else {
          if (values?.tradeType?.label === "Import") {
            if (+values?.numberOfItem >= rowDto?.length) {
              if (isClosingCheck) {
                toast.warning("This period tax already closed");
              } else {
                createPurchase(payload, cb, setDisabled);
              }
            } else {
              toast.warning('Invalid "Number Of Item" Number');
            }
          } else {
            if (isClosingCheck) {
              toast.warning("This period tax already closed");
            } else {
              createPurchase(payload, cb, setDisabled);
            }
          }
        }
      }
    } else {
      setDisabled(false);
    }
  };
  const setter = (values, cb) => {
    if (itemVatInfo) {
      const arr = rowDto?.filter(
        (item) => item?.value === values?.selectedItem?.value
      );
      if (arr?.length > 0) {
        toast.warn("Not allowed to duplicate items");
      } else {
        const item = {
          ...values.selectedItem,
          uom: values.selectedUom,
          quantity: +values.quantity,
          amount: +values.amount,
          cd: itemVatInfo?.cd || 0,
          rd: itemVatInfo?.rd || 0,
          sd: itemVatInfo?.sd || 0,
          vat: itemVatInfo?.vat || 0,
          ait: itemVatInfo?.ait || 0,
          atv: itemVatInfo?.atv || 0,
          at: itemVatInfo?.atv || 0,
          refund: 0,
          supplyTypeId: values?.supplyType?.value || 0,
          supplyTypeName: values?.supplyType?.label || "",
          hsCode: values?.tarrifSchedule?.hscode || "",
          description: values?.tarrifSchedule?.description || "",
        };
        const rowDtoArry = rowDtoCalculationFunc([item]);
        setRowDto([...rowDto, ...rowDtoArry]);
        cb();
      }
    } else {
      toast.warn("Vat Info  not found");
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const dataHandler = (name, value, sl) => {
    const xData = [...rowDto];
    xData[sl][name] = value;
    const modifiRowDto = rowDtoCalculationFunc(xData);
    setRowDto([...modifiRowDto]);
  };
  return (
    <IForm
      title="Create Purchase"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.id || false}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
        rowDto={rowDto}
        dataHandler={dataHandler}
        setUploadImage={setUploadImage}
        setItemVatInfo={setItemVatInfo}
        setDisabled={setDisabled}
        totalVDSAmount={totalVDSAmount}
        setTotalVDSAmount={setTotalVDSAmount}
        setIsClosingCheck={setIsClosingCheck}
      />
    </IForm>
  );
}
