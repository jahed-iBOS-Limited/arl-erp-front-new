import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  createDebitNoteCustomerBlncIncrease,
  getFiscalYearDDL,
  getItemById,
  getPartnerDDL,
  getSalesInvoiceDDL,
  editDebitNoteCustomerBlncIncrease,
} from "../helper/helper";
import Form from "./Form";

let initData = {
  id: undefined,
  partner: "",
  salesInvoice: "",
  fiscalYear: "",
  transactionDate: _todayDate(),
  itemName: "",
  checkAllItem: false,
};

export default function OtherAdjusmentDebitNoteForm({
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [fiscalYearDDL, setFiscalYearDDL] = useState([]);
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [salesInvoiceDDL, setSalesInvoiceDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [taxSales, setTaxSales] = useState("");

  const params = useParams();
  const history = useHistory();

  if (history.location.state?.taxBranch) {
    var taxBranchId = history.location.state.taxBranch.value;
  }

  if (history.location.state?.singleItem) {
    var singleItem = history.location.state?.singleItem;
  }

  useEffect(() => {
    getPartnerDDL(
      profileData.accountId,
      selectedBusinessUnit.value,
      setPartnerDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getFiscalYearDDL(setFiscalYearDDL);
  }, []);

  useEffect(() => {}, [
    profileData.accountId,
    selectedBusinessUnit.value,
    taxBranchId,
  ]);

  const partnerDDLChangeFunc = (parnerId) => {
    getSalesInvoiceDDL(parnerId, setSalesInvoiceDDL);
  };

  useEffect(() => {
    if (id) {
      getItemById(
        id,
        profileData.accountId,
        selectedBusinessUnit.value,
        setRowDto,
        setTaxSales
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getItemById]);

  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (
      name === "increaseQty" ||
      name === "increaseVat" ||
      name === "increaseSd"
    ) {
      _sl[name] = +value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        let objRow = rowDto?.map((item, index) => ({
          rowId: index,
          taxSalesHeaderId: +id,
          taxItemGroupId: item?.taxItemGroupId || 0,
          taxItemGroupName: item?.taxItemGroupName,
          uomid: item?.uomid,
          uomname: item?.uomname,
          salesUomid: item?.salesUomid,
          salesUomname: item?.salesUomname,
          increaseQuantity: item?.increaseQty,
          basePrice: item?.basePrice,
          baseTotal: item?.baseTotal,
          increaseSdtotal: item?.increaseSd,
          increaseVatTotal: item?.increaseVat,
          surchargeTotal: item?.surchargeTotal,
          isFree: true,
        }));

        const payload = {
          objHeader: {
            taxSalesId: taxSales.taxSalesId,
          },
          objRow: [...objRow],
        };

        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          editDebitNoteCustomerBlncIncrease(payload, cb, setDisabled);
        }
      } else {
        let objRow = rowDto?.map((item) => ({
          taxSalesHeaderId: 0,
          taxItemGroupId: item?.itemId,
          taxItemGroupName: item?.itemName,
          uomid: item?.uomId,
          uomname: item?.uom,
          salesUomid: item?.uomId,
          salesUomname: item?.uom,
          increaseQuantity: item?.increaseQty,
          basePrice: 1.0,
          baseTotal: 1.0,
          increaseSdtotal: item?.increaseSd,
          subTotal: 1.0,
          increaseVatTotal: item?.increaseVat,
          surchargeTotal: 1.0,
          grandTotal: 1.0,
          isFree: true,
        }));

        const payload = {
          objHeader: {
            taxSalesCode: "",
            deliveryId: 0,
            deliveryCode: "",
            tradeTypeId: 0,
            tradeTypeName: "",
            soldtoPartnerId: values?.partner?.value,
            soldtoPartnerName: values?.partner?.label,
            soldtoPartnerAddress: values?.partner?.address,
            partnerBin: "",
            shiptoPartnerId: 0,
            shiptoPartnerName: "",
            shiptoPartnerAddress: "",
            vehicleNo: "",
            dteDeliveryDateTime: "2020-12-17T08:23:20.506Z",
            dteTaxDeliveryDateTime: "2020-12-17T08:23:20.506Z",
            taxYear: values?.fiscalYear?.value,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            taxBranchId: taxBranchId,
            taxBranchName: history.location?.state?.taxBranch?.label,
            taxBranchAddress: history.location?.state?.taxBranch?.address,
            otherBranchId: 1,
            otherBranchName: "",
            referenceNo: values?.salesInvoice?.value,
            fisaclYear: `${values?.fiscalYear?.value}`,
            referenceDate: "2020-12-17T08:23:20.506Z",
            otherBranchAddress: "string23",
            actionBy: profileData?.userId,
          },
          objRowList: [...objRow],
        };

        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          createDebitNoteCustomerBlncIncrease(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const deleteHandler = (data) => {
    const filteredArray = rowDto.filter((item, index) => index !== data);
    setRowDto(filteredArray);
  };

  // Total
  const total = rowDto?.reduce(
    (acc, item) => acc + +item?.salesAmount * +item?.salesQty,
    0
  );

  return (
    <IForm
      title="Create Debit Note"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        fiscalYearDDL={fiscalYearDDL}
        accountId={profileData.accountId}
        businessUnitId={selectedBusinessUnit.value}
        saveHandler={saveHandler}
        partnerDDL={partnerDDL}
        salesInvoiceDDL={salesInvoiceDDL}
        // disableHandler={disableHandler}
        isEdit={params?.id ? params?.id : false}
        rowDto={rowDto}
        singleItem={singleItem}
        setRowDto={setRowDto}
        rowDtoHandler={rowDtoHandler}
        deleteHandler={deleteHandler}
        partnerDDLChangeFunc={partnerDDLChangeFunc}
        total={total}
      />
    </IForm>
  );
}
