import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { isUniq } from "../../../../_helper/uniqChecker";
import moment from "moment";
import {
  createContractManufacture_api,
  editContractManufacture_api,
  getContractManufactureById_api,
  getPartnerDDL_api,
} from "../helper";
import { toast } from "react-toastify";
import { _currentTime } from "../../../../_helper/_currentTime";
const initData = {
  id: undefined,
  type: "",
  partner: "",
  item: "",
  quantity: 0,
  transactionDate: _todayDate(),
};

export default function ContractManuFacturerlForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    // time format
    const time = _currentTime();
    const dateFormate = moment(`${_todayDate()} ${time}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const transactionDate = moment(`${values?.transactionDate} ${time}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        //edit api
        const purchaseRow = rowDto?.map((itm) => ({
          rowId: itm?.rowId || 0,
          taxPurchaseHeaderId: +id,
          invoiceTotal: 0,
          baseTotal: 0,
          subTotal: 0,
          taxItemGroupId: itm?.taxItemGroupId,
          taxItemGroupName: itm?.taxItemGroupName,
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          quantity: itm?.quantity,
          invoicePrice: 0,
          cdtotal: 0,
          rdtotal: 0,
          sdtotal: 0,
          vatTotal: 0,
          attotal: 0,
          grandTotal: 0,
          rebateTotal: 0,
          isFree: true,
        }));

        const salesRow = rowDto?.map((itm) => ({
          rowId: itm?.rowId || 0,
          baseTotal: 0,
          taxItemGroupId: itm?.taxItemGroupId,
          taxItemGroupName: itm?.taxItemGroupName,
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          quantity: itm?.quantity,
          salesUomid: 0,
          salesUomname: "",
          basePrice: 0,
          sdtotal: 0,
          subTotal: 0,
          vatTotal: 0,
          surchargeTotal: 0,
          grandTotal: 0,
          isFree: true,
        }));
        const payload = {
          contractManufactureTypeId: values?.type?.value,
          tContractManufactureType: values?.type?.label,
          editTaxPurchaseCommonDTO: {
            objEdit: {
              taxPurchaseId: +id,
              accountId: profileData?.accountId,
              businessUnitId: selectedBusinessUnit?.value,
            },
            objListRow: +values?.type?.value === 1 ? purchaseRow : [],
          },
          editTaxSalesInvoiceCommonDTO: {
            objHeader: {
              taxSalesId: +id,
              accountId: profileData?.accountId,
              businessUnitId: selectedBusinessUnit?.value,
            },
            objList: +values?.type?.value === 2 ? salesRow : [],
          },
        };
        editContractManufacture_api(payload, setDisabled);
      } else {
        //create api
        const purchaseRow = rowDto?.map((itm) => ({
          taxItemGroupId: itm?.taxItemGroupId,
          taxItemGroupName: itm?.taxItemGroupName,
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          quantity: itm?.quantity,
          invoicePrice: 0,
          cdtotal: 0,
          rdtotal: 0,
          sdtotal: 0,
          vatTotal: 0,
          attotal: 0,
          grandTotal: 0,
          rebateTotal: 0,
          isFree: true,
        }));
        const salesRow = rowDto?.map((itm) => ({
          taxItemGroupId: itm?.taxItemGroupId,
          taxItemGroupName: itm?.taxItemGroupName,
          uomid: itm?.uomid,
          uomname: itm?.uomname,
          quantity: itm?.quantity,
          salesUomid: 0,
          salesUomname: "",
          basePrice: 0,
          sdtotal: 0,
          subTotal: 0,
          vatTotal: 0,
          surchargeTotal: 0,
          grandTotal: 0,
          isFree: true,
        }));

        const payload = {
          contractManufactureTypeId: values?.type?.value,
          contractManufactureType: values?.type?.label,
          createTaxPurchaseCommonDTO: {
            objHeaderDTO: {
              accountId: profileData?.accountId,
              businessUnitId: selectedBusinessUnit?.value,
              businessUnitName: selectedBusinessUnit?.label,
              taxBranchId: headerData?.branch?.value,
              taxBranchName: headerData?.branch?.label,
              taxBranchAddress: headerData?.branch?.address,
              purchaseDateTime: transactionDate,
              tradeTypeId: 0,
              tradeTypeName: "",
              supplierId: values?.partner?.value,
              supplierName: values?.partner?.label,
              supplierAddress: values?.partner?.address,
              vehicleNo: "",
              referanceNo: "",
              referanceDate: dateFormate,
              chalanNo66: "",
              aittotal: 0,
              atvtotal: 0,
              tdstotal: 0,
              vdstotal: 0,
              actionBy: profileData?.userId,
              purchaseType: "",
            },
            objListRowDTO: +values?.type?.value === 1 ? purchaseRow : [],
          },
          createTaxSalesCommonDTO: {
            objHeader: {
              tradeTypeId: 0,
              tradeTypeName: "",
              soldtoPartnerId: values?.partner?.value,
              soldtoPartnerName: values?.partner?.label,
              soldtoPartnerAddress: values?.partner?.address,
              shiptoPartnerId: 0,
              shiptoPartnerName: "",
              shiptoPartnerAddress: "",
              vehicleNo: "",
              taxYear: 0,
              transactiondate: dateFormate,
              accountId: profileData.accountId,
              referenceNo: "",
              referencedate: dateFormate,
              businessUnitId: selectedBusinessUnit?.value,
              businessUnitName: selectedBusinessUnit?.label,
              taxBranchId: headerData?.branch?.value,
              taxBranchName: headerData?.branch?.label,
              taxBranchAddress: headerData?.branch?.address,
              taxDeliveryDateTime: dateFormate,
              deliveryDateTime: dateFormate,
              actionBy: profileData?.userId,
            },
            objListRow: +values?.type?.value === 2 ? salesRow : [],
          },
        };
        if (rowDto?.length > 0) {
          createContractManufacture_api(payload, cb, setDisabled);
        } else {
          toast.warning("You must have to add atleast one item");
        }
      }
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => index !== payload);
    setRowDto(filterArr);
  };

  const rowDataAddHandler = (values) => {
    const obj = {
      taxItemGroupName: values.item?.label,
      taxItemGroupId: values.item?.value,
      uomid: values.item?.uomId,
      uomname: values.item?.uomName,
      quantity: values.quantity,
    };
    if (isUniq("taxItemGroupId", values.item?.value, rowDto)) {
      setRowDto([...rowDto, obj]);
    }
  };

  const partnerDDLFunc = (type) => {
    if (type === 1) {
      getPartnerDDL_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        1,
        setPartnerDDL
      );
    } else {
      getPartnerDDL_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        2,
        setPartnerDDL
      );
    }
  };

  useEffect(() => {
    if (headerData?.typeId && id) {
      getContractManufactureById_api(id, headerData?.typeId, setSingleData);
    }
  }, [headerData, id]);

  useEffect(() => {
    if (id && singleData?.objListRowDTO?.length > 0) {
      setRowDto(singleData?.objListRowDTO);
    }
  }, [id, singleData]);
  return (
    <IForm title={"Create Contact Manufacturing"} getProps={setObjprops}>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.objHeaderDTO || initData}
        saveHandler={saveHandler}
        headerData={headerData}
        isEdit={id || false}
        rowDto={rowDto}
        remover={remover}
        rowDataAddHandler={rowDataAddHandler}
        partnerDDL={partnerDDL}
        partnerDDLFunc={partnerDDLFunc}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
