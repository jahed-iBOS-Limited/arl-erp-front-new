/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { createSales, getSinglePurchase, editSales } from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import { getItemAmounts } from "../helper";
import moment from "moment";
import Loading from "../../../../_helper/_loading";
import { _currentTime } from "../../../../_helper/_currentTime";

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
  deliveryAddress: "",
  selectedUom: "",
  quantity: "",
  rate: "",
  // eslint-disable-next-line no-dupe-keys
  totalTdsAmount: "",
  // eslint-disable-next-line no-dupe-keys
  totalVdsAmount: "",
  totalAtv: "",
  totalAit: "",
  deliveryTo: "",
  taxDeliveryDateTime: _todayDate(),
  customsHouse: "",
  customsHouseCode: "",
  port: "",
};

export default function SalesForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const [singleData, setSingleData] = useState("");

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
        profileData.accountId,
        selectedBusinessUnit.value,
        rowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    // time format
    const time = _currentTime();
    const dateFormate = moment(`${values?.taxDeliveryDateTime} ${time}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        let objRow = rowDto?.map((item) => {
          const total = getItemAmounts(item);
          return {
            rowId: item.rowId || 0,
            taxItemGroupId: item.value,
            taxItemGroupName: item.label,
            uomid: item.uom.value,
            uomname: item.uom.label,
            quantity: +item.quantity,
            sdtotal: total.sdAmount,
            vatTotal: total.vatAmount,
            isFree: item.isFree,
            salesUomid: 0,
            salesUomname: "string",
            basePrice: +item.rate,
            baseTotal: 0,
            surchargeTotal: total.surchargeAmount,
          };
        });

        const payload = {
          objHeader: {
            taxSalesId: parseInt(params.id),
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit.value,
          },
          objList: objRow,
        };
        editSales(payload, setDisabled);
      } else {
        // obj row
        let objRow = rowDto?.map((item) => {
          const total = getItemAmounts(item);
          return {
            taxItemGroupId: item.value,
            taxItemGroupName: item.label,
            uomid: item.uom.value,
            uomname: item.uom.label,
            quantity: +item.quantity,
            basePrice: +item.rate,
            cdtotal: item.cd,
            sdtotal: total.sdAmount,
            vatTotal: total.vatAmount,
            grandTotal: 0,
            isFree: item.isFree,
            salesUomid: 0,
            salesUomname: "string",
            baseTotal: 0,
            subTotal: 0,
            surchargeTotal: total.surchargeAmount,
          };
        });
        const payload = {
          objHeader: {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit.label,
            taxBranchId: location?.state?.taxBranch?.value,
            taxBranchName: location?.state?.taxBranch?.label,
            taxBranchAddress: location?.state?.taxBranch?.address,
            transactiondate: values.transactionDate,
            tradeTypeId: values.tradeType.value,
            tradeTypeName: values.tradeType.label,
            soldtoPartnerId: values.supplier.value,
            soldtoPartnerName: values.supplier.label,
            soldtoPartnerAddress: values.address || "",
            shiptoPartnerId: values.deliveryTo.value,
            shiptoPartnerName: values.deliveryTo.label,
            shiptoPartnerAddress: values.deliveryAddress || "",
            // paymentTerms: values.paymentTerm.value,
            // paymentTermsName: values.paymentTerm.label,
            vehicleNo: values.vehicalInfo,
            referenceNo: values.refferenceNo || "",
            referencedate: values.refferenceDate,
            actionBy: profileData?.userId,
            taxYear: 0,
            taxDeliveryDateTime: dateFormate,
            deliveryDateTime: values.taxDeliveryDateTime,
            // new field add
            portId: values?.port?.value || 0,
            customHouseId: values?.customsHouse?.value || 0,
            customHouseName: values?.customsHouse?.withOutCodeLabel || "",
            customHouseCode: values?.customsHouseCode || "",
          },
          objListRow: objRow,
        };

        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          createSales(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = ({ values, selectedItemInfo }, cb) => {
    const arr = rowDto?.filter(
      (item) => item?.value === values?.selectedItem?.value
    );

    const total = getItemAmounts(values, selectedItemInfo);

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
        sd: selectedItemInfo.sdpercentage || 0,
        vat: selectedItemInfo.vatpercentage || 0,
        surcharge: selectedItemInfo.surchargePercentage || 0,
        ait: "",
        atv: "",
        refund: "",
        rebatAmount: "",
        totalAmount: total.totalAmount?.toFixed(2),
        isFree: false,
      };
      setRowDto([...rowDto, item]);
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
    setRowDto([...xData]);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  // Set and get value in rowdto
  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  return (
    <IForm title="Create Sales" getProps={setObjprops} isDisabled={isDisabled}>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
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
    </IForm>
  );
}
