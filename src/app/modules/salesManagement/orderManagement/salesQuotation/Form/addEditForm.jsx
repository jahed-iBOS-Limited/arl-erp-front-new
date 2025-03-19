/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getSalesQuotationById,
  getSalesOrgDDLAction,
  getSoldToPartyDDLAction,
  getSpecificationDDLAction,
  saveSalesquotation,
  setSalesQuotationSingleEmpty,
  saveEditedSalesquotation,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import {
  getSalesOfficeDDLAction,
  getDistributionChannelDDLAction,
  getItemSaleDDLAction,
  getUomDDLItemId_Action,
} from "../../../../_helper/_redux/Actions";
import { isUniq } from "../../../../_helper/uniqChecker";
import { toast } from "react-toastify";
import { _todayDate } from "./../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import { editSalesQuotationStatusAction } from "./../_redux/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  id: undefined,
  salesOrg: "",
  channel: "",
  salesOffice: "",
  soldtoParty: "",
  partnerReffNo: "",
  pricingDate: _todayDate(),
  itemList: "",
  quantity: "",
  price: "",
  value: "",
  specification: "",
  uom: "",
  quotationCode: "",
  isSpecification: false,
  quotationEndDate: _todayDate(),
  remark: "",

  // changes by monir bhai
  salesContract: "",
  salesTerm: "",
  modeOfShipment: "",
  portOfShipment: "",
  portOfDischarge: "",
  finalDestination: "",
  countryOfOrigin: "",
  contractFor: "",
  freightCharge: "",
  termsAndConditions: "",
  currency: "",
  strCoraseAggregate: "",
  strFineAggregate: "",
  strUsesOfCement: "",
  paymentMode: "",
  transportType: "",
  validityDays: "",
  exFactoryPrice: "",
  creditLimitDaysPropose: "",
  creditLimitAmountsPropose: "",
};

export default function SalesQuotationForm({
  history,
  match: {
    params: { id },
  },
}) {
  const printRef = useRef();
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [objTerms, setObjTerms] = useState([]);
  const [specRowDto, setSpecRowDto] = useState([]);
  const [specTableData, setSpecTableData] = useState([]);
  const [editItemOnChange, setEditItemOnChange] = useState(false);
  const [total, setTotal] = useState({ totalQty: 0, totalAmount: 0 });
  const quationCodeForEditPageTitle = history?.location?.state?.quotationCode;
  const [currencyDDL, getCurrencyDDL, currencyDDLloader] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  // get single controlling  unit from store
  const {
    singleData,
    salesOrg,
    soldToParty,
    setSpction: spctionDDL,
  } = useSelector((state) => state?.salesQuotation, shallowEqual);

  const {
    distributionChannelDDL: channel,
    salesOfficeDDL: salesOffice,
    itemSaleDDL: itemSalesDDL,
    uomDDL,
  } = useSelector((state) => state?.commonDDL, shallowEqual);

  useEffect(() => {
    getCurrencyDDL(`/domain/Purchase/GetBaseCurrencyList`);
  }, []);
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSalesQuotationById(id));
    } else {
      dispatch(setSalesQuotationSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // single data Specification set
  useEffect(() => {
    if (singleData?.objRow?.length) {
      setRowDto(singleData?.objRow);
      setSpecRowDto(singleData?.objSpec);
      setSpecTableData(singleData?.objSpec);
      setObjTerms(singleData?.objTerms || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const salesOfficeDDLDispatcher = (salesOrgId) => {
    dispatch(getSalesOfficeDDLAction(accId, buId, salesOrgId));
  };

  useEffect(() => {
    if (buId && accId) {
      dispatch(getDistributionChannelDDLAction(accId, buId));
      dispatch(getItemSaleDDLAction(accId, buId));
      dispatch(getSalesOrgDDLAction(accId, buId));
      dispatch(getSoldToPartyDDLAction(accId, buId));
      dispatch(getSpecificationDDLAction(buId));
    }
  }, [buId, accId]);

  const saveHandler = async (values, cb) => {
    if (values && accId && buId) {
      if (id) {
        const objListRowDTO = rowDto.map((itm, index) => {
          return {
            businessUnitId: buId,
            sequenceNo: ++index,
            ...itm,
            rowId: itm?.rowId || 0,
          };
        });
        // Akij Poly Fibre Industries Ltd. ==== 8
        const objSpecRow = specRowDto.map((itm) => {
          return {
            ...itm,
            actionBy: userId,
            quotationDetailsRowId: itm.quotationDetailsRowId || 0,
            value: [8].includes(buId) ? 0 : itm.value,
            narration: [8].includes(buId) ? itm.value : itm.narration,
          };
        });
        const payload = {
          objHeader: {
            quotationId: values.quotationId,
            accountId: accId,
            businessUnitId: buId,
            salesOrganizationId: values.salesOrg.value,
            salesOfficeId: values.salesOffice.value,
            salesOfficeName: values.salesOffice.label,
            distributionChannelId: values.channel.value,
            pricingDate: values.pricingDate,
            partnerReffNo: values.partnerReffNo,
            soldToPartnerId: values.soldtoParty.value,
            totalQuotationValue: total.totalAmount,
            totalQuotationQty: total.totalQty,
            actionBy: userId,
            quotationEndDate: values?.quotationEndDate,
            remark: values?.remark || "",
            // changes by monir bhai
            salesContract: values?.salesContract || "",
            salesTerm: values?.salesTerm || "",
            modeOfShipment: values?.modeOfShipment || "",
            portOfShipment: values?.portOfShipment || "",
            portOfDischarge: values?.portOfDischarge || "",
            finalDestination: values?.finalDestination || "",
            countryOfOrigin: values?.countryOfOrigin || "",
            contractFor: values?.contractFor || "",
            freightCharge: +values?.freightCharge || "",
            currencyPrice: 0,
            currencyValue: values?.currency?.value || "",
            currencyRateBdt: values.price || "",
            paymentMode: values?.paymentMode || "",
            strUsesOfCement: values?.strUsesOfCement || "",
            strFineAggregate: values?.strFineAggregate || "",
            strCoraseAggregate: values?.strCoraseAggregate || "",
            creditLimitDaysPropose: values?.creditLimitDaysPropose,
            creditLimitAmountsPropose: values?.creditLimitAmountsPropose,
          },
          objRow: objListRowDTO,
          objSpecRow: objSpecRow,
          objTerms: objTerms,
        };

        if (rowDto.length) {
          dispatch(saveEditedSalesquotation(payload, setDisabled));
        } else {
          toast.warning("You must have to add atleast one item");
        }
      } else {
        const objListRowDTO = rowDto.map((itm, index) => {
          return {
            businessUnitId: buId,
            sequenceNo: ++index,
            ...itm,
          };
        });
        const objSpecRow = specRowDto.map((itm) => {
          return {
            ...itm,
            actionBy: userId,
            value: [8].includes(buId) ? 0 : itm.value,
            narration: [8].includes(buId) ? itm.value : itm.narration,
          };
        });
        const payload = {
          objHeader: {
            accountId: accId,
            businessUnitId: buId,
            salesOrganizationId: values.salesOrg.value,
            salesOfficeId: values.salesOffice.value,
            salesOfficeName: values.salesOffice.label,
            distributionChannelId: values.channel.value,
            pricingDate: values.pricingDate,
            partnerReffNo: values.partnerReffNo,
            soldToPartnerId: values.soldtoParty.value,
            totalQuotationValue: total.totalAmount,
            totalQuotationQty: total.totalQty,
            actionBy: userId,
            quotationEndDate: values?.quotationEndDate,
            remark: values?.remark || "",
            // changes by monir bhai
            salesContract: values?.salesContract || "",
            salesTerm: values?.salesTerm || "",
            modeOfShipment: values?.modeOfShipment || "",
            portOfShipment: values?.portOfShipment || "",
            portOfDischarge: values?.portOfDischarge || "",
            finalDestination: values?.finalDestination || "",
            countryOfOrigin: values?.countryOfOrigin || "",
            contractFor: values?.contractFor || "",
            freightCharge: +values?.freightCharge || "",
            currencyPrice: 0,
            currencyValue: values?.currency?.value || "",
            currencyRateBdt: values.price || "",
            paymentMode:
              buId === 4
                ? values?.paymentMode?.label
                : values?.paymentMode || "",
            strUsesOfCement: values?.strUsesOfCement || "",
            strFineAggregate: values?.strFineAggregate || "",
            strCoraseAggregate: values?.strCoraseAggregate || "",
            transportType: values?.transportType?.label,
            validityDays: values?.validityDays,
            creditLimitDaysPropose: values?.creditLimitDaysPropose,
            creditLimitAmountsPropose: values?.creditLimitAmountsPropose,
          },
          objRow: objListRowDTO,
          objSpecRow: objSpecRow,
          objTerms: objTerms,
        };
        if (rowDto.length) {
          dispatch(saveSalesquotation({ data: payload, cb, setDisabled }));
          setRowDto([]);
          setSpecTableData([]);
          setSpecRowDto([]);
        } else {
          toast.warning("You must have to add atleast one item");
        }
      }
    } else {
      setDisabled(false);
    }
  };

  //buttom row table specification string generator
  const strGen = (arr, key1, key2) => {
    let str = "";
    if (arr.length) {
      arr.forEach((itm) => {
        str += `${itm[key1]}-${itm[key2]}, `;
      });
    }
    return str;
  };

  //==buttom row table list==
  const setter = (values) => {
    const newData = [
      {
        itemId: values.itemList.value,
        itemName: values.itemList.label,
        quotationQuantity: values.quantity,
        itemPrice: values.price,
        quotationValue: values.quantity * values.price,
        itemCode: values.itemList.code,
        specification: strGen(specTableData, "specification", "value"),
        length: values.length,
        height: values.height,
        uomName: values.uom.label,
        uom: values.uom.value,
        numPriceWithTransport: values?.exFactoryPrice,
      },
    ];

    if (isUniq("itemId", values.itemList.value, rowDto)) {
      setRowDto([...rowDto, ...newData]);
      setSpecRowDto([...specRowDto, ...specTableData]);
      setSpecTableData([]);
    }
  };
  // row remove
  const remover = (id) => {
    let ccdata = rowDto.filter((itm) => itm.itemId !== id);
    setRowDto(ccdata);
    const updateSpecification = specRowDto.filter((itm) => {
      return itm.itemId !== id;
    });
    setSpecRowDto(updateSpecification);
    setSpecTableData([]);
  };

  //Total Qty & Total Amount calculation
  useEffect(() => {
    let totalQty = 0;
    let totalAmount = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalQty += +rowDto[i].quotationQuantity;
        totalAmount += +rowDto[i].quotationValue;
      }
    }
    setTotal({ totalQty, totalAmount });
  }, [rowDto]);

  // ==Specification table list==
  const setterTwo = (param) => {
    const newData = {
      specificationId: param.specification.value,
      specification: param.specification.label,
      value: param.value,
      itemId: param.itemList.value,
    };
    if (isUniq("specificationId", param.specification.value, specTableData)) {
      setSpecTableData([...specTableData, newData]);
    }
  };
  // row removeTwo
  const removerTwo = (index, id) => {
    let ccdata = specTableData.filter((itm, inx) => inx !== index);
    setSpecTableData(ccdata);
  };

  //onChange itemListHandelar
  const itemListHandelar = (currentValue, setFieldValue) => {
    setSpecTableData([]);
    dispatch(getUomDDLItemId_Action(accId, buId, currentValue, setFieldValue));
  };

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    return () => {
      dispatch(setSalesQuotationSingleEmpty());
    };
  }, []);

  const quotationClosedFunc = () => {
    dispatch(editSalesQuotationStatusAction(+id, userId, setDisabled, history));
  };

  return (
    <IForm
      title={
        id
          ? `Edit Sales Quotation [${quationCodeForEditPageTitle}]`
          : "Create Sales Quotation"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {(isDisabled || currencyDDLloader) && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.objHeader || initData}
        saveHandler={saveHandler}
        buId={buId}
        isEdit={id || false}
        salesOfficeDDLDispatcher={salesOfficeDDLDispatcher}
        salesOrg={salesOrg}
        soldToParty={soldToParty}
        salesOffice={salesOffice}
        channel={channel}
        rowDto={rowDto}
        setter={setter}
        setterTwo={setterTwo}
        remover={remover}
        itemSalesDDL={itemSalesDDL}
        uomDDL={uomDDL}
        total={total}
        specTableData={specTableData}
        spctionDDL={spctionDDL}
        removerTwo={removerTwo}
        itemListHandelar={itemListHandelar}
        setEditItemOnChange={setEditItemOnChange}
        editItemOnChange={editItemOnChange}
        quotationClosedFunc={quotationClosedFunc}
        objTerms={objTerms}
        setObjTerms={setObjTerms}
        currencyDDL={currencyDDL}
        userId={userId}
        printRef={printRef}
      />
    </IForm>
  );
}
