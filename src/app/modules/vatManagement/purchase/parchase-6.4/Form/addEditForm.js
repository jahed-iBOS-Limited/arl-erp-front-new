import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  createPurchase,
  getSinglePurchase,
  editPurchase,
  rowDtoCalculationFunc,
} from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";

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
  country: { value: 18, label: "Bangladesh" },
  lcNumber: "",
  lcDate: _todayDate(),
  customsHouse: "",
  CPCCode: "",
  supplyType: "",
  numberOfItem: "",
  grnCode: "",
};

export default function PurchaseForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const [singleData, setSingleData] = useState("");
  const [uploadImage, setUploadImage] = useState([]);
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
      getSinglePurchase(
        params?.id,
        setSingleData,
        setRowDto,
        selectedBusinessUnit
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        let objRow = rowDto?.map((item) => ({
          taxPurchaseHeaderId: parseInt(params.id),
          rowId: item.rowId,
          taxItemGroupId: item.value || 0,
          taxItemGroupName: item.label || "",
          uomid: item.uom.value || 0,
          uomname: item.uom.label || "",
          quantity: +item.quantity || 0,
          invoicePrice: +item.rate || 0,
          cdtotal: +item?.cal_cdtotal || 0,
          rdtotal: +item?.cal_rdtotal || 0,
          sdtotal: +item?.cal_sdtotal || 0,
          vatTotal: +item?.cal_vatTotal || 0,
          grandTotal: 0,
          rebateTotal: +item.rebateAmount || 0,
          isFree: true,
          // new fild
          invoiceTotal: values?.amount || 0,
          attotal: +item?.cal_atTotal || 0,
          baseTotal: 0,
          subTotal: 0,
          invoicetotal: item?.amount || 0,
          isTariff: item?.isTariff || false,
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
          if (values?.tradeType?.label === "Import") {
            if (+values?.numberOfItem >= rowDto?.length) {
              createPurchase(payload, cb, setDisabled);
            } else {
              editPurchase(payload, setDisabled);
            }
          } else {
            editPurchase(payload, setDisabled);
          }
        }
      } else {
        let objRow = rowDto?.map((item) => {
          return {
            taxItemGroupId: item.value || 0,
            taxItemGroupName: item.label || "",
            uomid: item.uom.value || 0,
            uomname: item.uom.label || "",
            quantity: +item.quantity || 0,
            invoicePrice: +item.rate || 0,
            cdtotal: +item?.cal_cdtotal || 0,
            rdtotal: +item?.cal_rdtotal || 0,
            sdtotal: +item?.cal_sdtotal || 0,
            vatTotal: +item?.cal_vatTotal || 0,
            atTotal: +item?.cal_atTotal || 0,
            aitTotal: 0,
            attotal: +item?.cal_atTotal || 0,
            grandTotal: 0,
            rebateTotal: +item.rebateAmount || 0,
            isFree: true,
            invoicetotal: item?.amount || 0,
            isTariff: item?.isTariff || false,
          };
        });

        const payload = {
          objHeaderDTO: {
            grnId: values?.grnCode?.value || 0,
            grnCode: values?.grnCode?.label || 0,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit.label,
            taxBranchId: location?.state?.taxBranch?.value,
            taxBranchName: location?.state?.taxBranch?.label,
            taxBranchAddress: location?.state?.taxBranch?.address,
            purchaseDateTime: values.transactionDate,
            tradeTypeId: values.tradeType.value,
            tradeTypeName: values.tradeType.label,
            portId: values?.port?.value,
            supplierId: values.supplier.value,
            supplierName: values.supplier.label,
            supplierAddress: values.address || "",
            paymentTerms: values.paymentTerm.value || 0,
            paymentTermsName: values.paymentTerm.label || "",
            vehicleNo: values.vehicalInfo,
            referanceNo: values.refferenceNo || "",
            referanceDate: values.refferenceDate,
            aittotal: values.totalAit || 0,
            atvtotal: values.totalAtv || 0,
            tdstotal: values.totalTdsAmount || 0,
            vdstotal: values.totalVdsAmount || 0,
            actionBy: profileData?.userId,
            purchaseType: values?.purchaseType?.label || "",
            // new field add
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
            noProduct: +values?.numberOfItem || 0,
          },
          objListRowDTO: objRow,
        };

        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
          setDisabled(false);
        } else {
          if (values?.tradeType?.label === "Import") {
            if (+values?.numberOfItem >= rowDto?.length) {
              createPurchase(payload, cb, setDisabled);
            } else {
              toast.warning('Invalid "Number Of Item" Number');
            }
          } else {
            createPurchase(payload, cb, setDisabled);
          }
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
      // this condition "Magnum Steel Industries Limited"
      const isFixedRate =
        (selectedBusinessUnit?.value === 171 ||
          selectedBusinessUnit?.value === 224) &&
        values?.tradeType?.label === "Import"
          ? true
          : false;

      const item = {
        ...values.selectedItem,
        uom: values.selectedUom,
        quantity: +values.quantity,
        amount: +values.amount,
        rate: +values.amount / +values.quantity,
        cd: 0,
        rd: 0,
        sd: 0,
        vat: 0,
        ait: 0,
        atv: 0,
        at: 0,
        refund: 0,
        isFixedRate: isFixedRate,
      };
      const rowDtoArry = rowDtoCalculationFunc([item]);
      setRowDto([...rowDto, ...rowDtoArry]);
      cb();
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
      title="Create Purchase (6.4)"
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
        setDisabled={setDisabled}
        setUploadImage={setUploadImage}
      />
    </IForm>
  );
}
