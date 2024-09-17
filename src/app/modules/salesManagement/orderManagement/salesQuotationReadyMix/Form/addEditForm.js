/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
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
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  id: undefined,
  salesOrg: "",
  channel: "",
  salesOffice: "",
  soldToParty: "",
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

  customerType: "",
  customerName: "",
  customerAddress: "",
  includeVat: "",
  shippingPoint: "",
  paymentMode: "",
  address: "",
  includeAit: "",
  distance: "",

  validityDays: "",
  transportType: "",
  creditBackUp: "",
  destination: "",
  creditLimitDaysPropose: "",
  creditLimitAmountsPropose: ""
};

export default function SalesQuotationReadyMixForm({
  history,
  match: {
    params: { id },
  },
}) {
  const printRef = useRef();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [specRowDto, setSpecRowDto] = useState([]);
  const [specTableData, setSpecTableData] = useState([]);
  const [editItemOnChange, setEditItemOnChange] = useState(false);
  const [total, setTotal] = useState({ totalQty: 0, totalAmount: 0 });
  const [shippingPointList, getShippingPointList] = useAxiosGet([]);
  const quationCodeForEditPageTitle = history?.location?.state?.quotationCode;
  const dispatch = useDispatch();

  const shipPointDDL = shippingPointList?.map((item) => ({
    value: item?.organizationUnitReffId,
    label: item?.organizationUnitReffName,
  }));

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // get single controlling  unit from store
  const { singleData, salesOrg, soldToParty, setSpction } = useSelector(
    (state) => state?.salesQuotation,
    shallowEqual
  );

  //  ddl
  const {
    distributionChannelDDL,
    salesOfficeDDL,
    itemSaleDDL,
    uomDDL,
  } = useSelector((state) => state?.commonDDL, shallowEqual);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const salesOfficeDDLDispatcher = (salesOrgId) => {
    dispatch(getSalesOfficeDDLAction(accId, buId, salesOrgId));
  };

  useEffect(() => {
    if (buId && accId) {
      getShippingPointList(
        `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${accId}&BusinessUnitId=${buId}`
      );
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
        const objSpecRow = specRowDto.map((itm) => {
          return {
            ...itm,
            actionBy: userId,
            quotationDetailsRowId: itm.quotationDetailsRowId || 0,
          };
        });
        const payload = {
          objHeader: {
            quotationId: values?.quotationId,
            accountId: accId,
            businessUnitId: buId,
            salesOrganizationId: values?.salesOrg.value,
            salesOfficeId: values?.salesOffice.value,
            salesOfficeName: values?.salesOffice.label,
            distributionChannelId: values?.channel.value,
            pricingDate: values?.pricingDate,
            partnerReffNo: values?.partnerReffNo,
            soldToPartnerId:
              values?.customerType?.value === 1
                ? values?.soldToParty?.value
                : 0,
            totalQuotationValue: total.totalAmount,
            totalQuotationQty: total.totalQty,
            actionBy: userId,
            quotationEndDate: values?.quotationEndDate,
            remark: values?.remark || "",

            // soldToPartnerName:
            //   values?.customerType?.value === 1
            //     ? values?.soldToParty?.label
            //     : values?.customerName,
            newCustomerName: values?.customerName,
            newCustomerAddress: values?.customerAddress,
            address: values?.address || "",
            shipPointId: values?.shippingPoint?.value || 0,
            shipPointName: values?.shippingPoint?.label || "",
            isIncludeVat: values?.includeVat?.value === 1,
            paymentMode: values?.paymentMode || "",

            intConcernEmployeId: values?.officerName?.value,
            strConcernEmployeeName: values?.officerName?.label,
            strUsesOfCement: "",
            strCoraseAggregate: "",
            strFineAggregate: "",
            strAddmixture: "",
            strWaterProofingChemical: "",
            strProject: "",
            isAitinclude: values?.includeAit?.value === 1,
            distancekm: values?.distance || "",

            validityDays: +values.validityDays || 0,
            transportType: values.transportType?.label || "",
            transportTypeId: +values.transportType?.value || 0,
            creditTypeId: +values.creditBackUp?.value || 0,
            creditTypeS: values.creditBackUp?.label || "",
            creditLimitDaysPropose: +values.creditLimitDaysPropose || 0,
            creditLimitAmountsPropose: +values.creditLimitAmountsPropose || 0,
            finalDestination: values?.destination || "",
          },
          objRow: objListRowDTO,
          objSpecRow: objSpecRow,
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
          };
        });
        const payload = {
          objHeader: {
            accountId: accId,
            businessUnitId: buId,
            salesOrganizationId: values?.salesOrg.value,
            salesOfficeId: values?.salesOffice.value,
            salesOfficeName: values?.salesOffice.label,
            distributionChannelId: values?.channel.value,
            pricingDate: values?.pricingDate,
            partnerReffNo: values?.partnerReffNo,
            soldToPartnerId:
              values?.customerType?.value === 1
                ? values?.soldToParty?.value
                : 0,
            totalQuotationValue: total.totalAmount,
            totalQuotationQty: total.totalQty,
            actionBy: userId,
            quotationEndDate: values?.quotationEndDate,
            remark: values?.remark || "",

            // soldToPartnerName:
            //   values?.customerType?.value === 1
            //     ? values?.soldToParty?.label
            //     : values?.customerName,
            newCustomerName: values?.customerName,
            newCustomerAddress: values?.customerAddress,
            address: values?.address || "",
            shipPointId: values?.shippingPoint?.value || 0,
            shipPointName: values?.shippingPoint?.label || "",
            isIncludeVat: values?.includeVat?.value === 1,
            paymentMode: values?.paymentMode || "",
            isAitinclude: values?.includeAit?.value === 1,
            distancekm: values?.distance || "",

            validityDays: +values.validityDays || 0,
            transportType: values.transportType?.label || "",
            transportTypeId: +values.transportType?.value || 0,
            creditTypeId: +values.creditBackUp?.value || 0,
            creditTypeS: values.creditBackUp?.label || "",
            creditLimitDaysPropose: +values.creditLimitDaysPropose || 0,
            creditLimitAmountsPropose: +values.creditLimitAmountsPropose || 0,
            finalDestination: values?.destination || "",
          },
          objRow: objListRowDTO,
          objSpecRow: objSpecRow,
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
        itemId: values?.itemList.value,
        itemName: values?.itemList.label,
        quotationQuantity: values?.quantity,
        itemPrice: values?.price,
        quotationValue: values?.quantity * values?.price,
        itemCode: values?.itemList.code,
        specification: strGen(specTableData, "specification", "value"),
        length: values?.length,
        height: values?.height,
        uomName: values?.uom.label,
        uom: values?.uom.value,
      },
    ];

    if (isUniq("itemId", values?.itemList.value, rowDto)) {
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
    // if edit Specification specRowDto data delete
    // if (!editItemOnChange && id) {
    //   const updateSpecification = specRowDto.filter(
    //     (itm, inx) => inx !== index
    //   );
    //   setSpecRowDto(updateSpecification);
    // }
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

  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

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
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.objHeader || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        accId={accId}
        buId={buId}
        isEdit={id || false}
        salesOfficeDDLDispatcher={salesOfficeDDLDispatcher}
        salesOrg={salesOrg}
        soldToParty={soldToParty}
        salesOffice={salesOfficeDDL}
        channel={distributionChannelDDL}
        rowDto={rowDto}
        setter={setter}
        setterTwo={setterTwo}
        remover={remover}
        itemSalesDDL={itemSaleDDL}
        uomDDL={uomDDL}
        total={total}
        specTableData={specTableData}
        spctionDDL={setSpction}
        removerTwo={removerTwo}
        itemListHandelar={itemListHandelar}
        setEditItemOnChange={setEditItemOnChange}
        editItemOnChange={editItemOnChange}
        quotationClosedFunc={quotationClosedFunc}
        printRef={printRef}
        handleInvoicePrint={handleInvoicePrint}
        shippingPointList={shipPointDDL}
      />
    </IForm>
  );
}
