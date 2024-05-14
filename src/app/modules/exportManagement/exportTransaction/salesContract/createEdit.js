/* eslint-disable jsx-a11y/no-distracting-elements */
import axios from "axios";
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import BasicModal from "../../../_helper/_BasicModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { empAttachment_action } from "../../../financialManagement/invoiceManagementSystem/billregister/helper";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";

const salesTerms = [
  { value: 1, label: "FOB" },
  { value: 2, label: "CNF(CFR)" },
  { value: 3, label: "DDP" },
  { value: 4, label: "CTP" },
  { value: 5, label: "CIF" },
  { value: 6, label: "CIP" },
  { value: 7, label: "DAP" },
  { value: 8, label: "DUP" },
  { value: 9, label: "Ex-Work" },
  { value: 10, label: "FAS" },
  { value: 11, label: "FCA" },
];

const portsOfShipment = [
  { value: 1, label: "CTG/ICD Dhaka Bangladesh" },
  { value: 2, label: "Tamabil, Sylhet, Bangladesh" },
  { value: 3, label: "Benapole, Jashore, Bangladesh" },
  { value: 4, label: "Hilli, Dinajpur, Bangladesh" },
  { value: 5, label: "Sona Masjid, Chapainawabganj, Bangladesh" },
  { value: 6, label: "Burimari, Lalmonirhat, Bangladesh" },
  { value: 7, label: "Akhaura, Brahmanbaria, Bangladesh" },
  { value: 8, label: "Bhomna, Satkhira, Bangladesh" },
  { value: 9, label: "Banglabandha, Panchagarh, Bangladesh" },
  { value: 10, label: "Bibirbazar, Cumilla, Bangladesh" },
  { value: 11, label: "Sonahat, Bhurungamari Kurigram, Bangladesh" },
  { value: 12, label: "Belunia, Feni, Bangladesh" },
  // { value: 2, label: "Monglad/ICD Dhaka Bangladesh" },
  // { value: 3, label: "Payra/ICD Dhaka Bangladesh" },
  // { value: 4, label: "Matabaria/ICD Dhaka Bangladesh" },
];

const exportUoMs = [
  { value: 1, label: "GM" },
  { value: 2, label: "ML" },
  { value: 3, label: "PCS" },
  { value: 4, label: "LB" },
  { value: 5, label: "Pound" },
  { value: 6, label: "Inches" },
  { value: 7, label: "Kilogram" },
];

const initData = {
  salesOffice: "",
  soldToPartner: "",
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
  address: "",

  exPortRegNo: "260326211175421",
  exPortPermissionNo: "",
  salesContractNo: "",
  salesTerm: "",
  modeofShipment: { value: "By Sea", label: "By Sea" },
  portofShipment: "",
  portofDishcharge: "",
  destinationCountry: "",
  finalDestination: "",
  countryOfOrigin: "Bangladesh",
  contractFor: "",
  freightAmount: "",
  termsAndConditions: "",
  currency: "",
  currencyRateBdt: "",
  packingDetails: "",
  viewAs: { value: 1, label: "Sales Contract" },
  exportUoM: "",
};

export default function SalesContractCreateEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [modifyData, setModifyData] = useState();
  const [isShowModel, setIsShowModel] = useState(false);
  const [quotationCode, setQuotationCode] = useState("");
  const [objSpecRow, setObjSpecRow] = useState([]);
  const [objTerms, setObjTerms] = useState([]);
  const [objRow, setObjRow] = useState([]);
  const [objProps, setObjprops] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  const [currency, getCurrency, currencyLoader] = useAxiosGet();
  const [itemList, getItemList, itemListLoader] = useAxiosGet();
  const [soldToPartner, getSoldToPartner, soldToPartnerLoader] = useAxiosGet();
  const [salesOffice, getSalesOffice, salesOfficeLoader] = useAxiosGet();
  const [specification, getSpecification, specificationLoader] = useAxiosGet();
  const [
    destinationDDL,
    getDestinationDDL,
    destinationDDLLoader,
  ] = useAxiosGet();
  const [, getUom, uomLoader] = useAxiosGet();
  const [, saveData, saveLoader] = useAxiosPost();
  const [, getSingleData] = useAxiosGet();
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadedImage, setUploadedImage] = useState([]);

  //  for edit
  useEffect(() => {
    if (id) {
      getSingleData(
        `/oms/SalesQuotation/GetForeignSalesQuotationById?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&quotationId=${id}`,
        (data) => {
          setModifyData({
            salesOffice: {
              value: data?.data?.objHeader?.salesOfficeId,
              label: data?.data?.objHeader?.salesOfficeName,
            },
            soldToPartner: {
              value: data?.data?.objHeader?.soldToPartnerId,
              label: data?.data?.objHeader?.soldToPartnerName,
            },
            partnerReffNo: data?.data?.objHeader?.partnerReffNo,
            pricingDate: _dateFormatter(data?.data?.objHeader?.pricingDate),
            price: data?.data?.objHeader?.price,
            value: data?.data?.objHeader?.value,
            quotationEndDate: _dateFormatter(
              data?.data?.objHeader?.quotationEndDate
            ),
            remark: data?.data?.objHeader?.remark,
            address: data?.data?.objHeader?.soldToPartnerAddress,
            salesContractNo: data?.data?.objHeader?.salesContractNo,
            salesTerm: {
              value: data?.data?.objHeader?.salesTermid,
              label: data?.data?.objHeader?.salesTerm,
            },
            modeofShipment: {
              value: data?.data?.objHeader?.modeofShipment,
              label: data?.data?.objHeader?.modeofShipment,
            },
            portofShipment:
              data?.data?.objHeader?.portofShipment &&
              data?.data?.objHeader?.portofShipmentId
                ? {
                    value: data?.data?.objHeader?.portofShipmentId,
                    label: data?.data?.objHeader?.portofShipment,
                  }
                : "",
            portofDishcharge:
              data?.data?.objHeader?.portofDishcharge &&
              data?.data?.objHeader?.portofDischargeId
                ? {
                    value: data?.data?.objHeader?.portofDischargeId,
                    label: data?.data?.objHeader?.portofDishcharge,
                  }
                : "",
            destinationCountry:
              data?.data?.objHeader?.toCountryId &&
              data?.data?.objHeader?.toCountryName
                ? {
                    value: data?.data?.objHeader?.toCountryId,
                    label: data?.data?.objHeader?.toCountryName,
                  }
                : "",
            finalDestination: data?.data?.objHeader?.finalDestination,
            countryOfOrigin: data?.data?.objHeader?.countryOfOrigin,
            contractFor: data?.data?.objHeader?.contractFor,
            freightAmount: data?.data?.objHeader?.freightAmount,
            currency: {
              value: data?.data?.objHeader?.currencyId,
              label: data?.data?.objHeader?.currencyName,
            },
            currencyRateBdt: data?.data?.objHeader?.currencyRateBdt,
            exPortPermissionNo: data?.data?.objHeader?.exPortPermissionNo,
            exPortRegNo: data?.data?.objHeader?.exPortRegNo,
            viewAs:
              data?.data?.objHeader?.strViewAs &&
              data?.data?.objHeader?.intViewAs
                ? {
                    value: data?.data?.objHeader?.intViewAs,
                    label: data?.data?.objHeader?.strViewAs,
                  }
                : "",
            attachmentno: data?.data?.objHeader?.attachmentno,
          });
          setObjSpecRow(data?.data?.objSpec);
          setObjRow(data?.data?.objRow);
          setObjTerms(data?.data?.objTerms);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCurrency(`/domain/Purchase/GetBaseCurrencyList`);
    getItemList(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );
    getSoldToPartner(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getSpecification(
      `/oms/SalesQuotation/GetSpecificationDDL?businessUnitId=${selectedBusinessUnit?.value}`
    );
    getSalesOffice(
      `/oms/SalesOffice/GetSalesOfficeDDLbyId?AccountId=1&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getDestinationDDL(`/oms/TerritoryInfo/GetCountryDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNetWeight = (values, cb) => {
    const currentItem = objSpecRow?.filter(
      (item) => item?.itemId === values?.itemList?.value
    );
    const packSize = currentItem?.find((item) => item?.specificationId === 3);
    const pcsInCtn = currentItem?.find((item) => item?.specificationId === 4);

    if (!packSize || !pcsInCtn) {
      cb();
      return toast.warn("Firstly add the Pack Size and PCS in CTN!");
    }
    return (packSize?.value * pcsInCtn?.value) / 1000;
  };

  const saveHandler = (values, cb) => {
    if (objRow?.length < 1) {
      return toast.error("Please add at least one item");
    }
    if (!id && uploadedImage?.length < 1) {
      return toast.error("Please attach a file!");
    }
    const payload = {
      objHeader: {
        userId: profileData?.userId,
        quotationId: id ? id : 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        salesOfficeId: +values?.salesOffice?.value,
        salesOfficeName: values?.salesOffice?.label,
        pricingDate: values?.pricingDate,
        partnerReffNo: values?.partnerReffNo,
        soldToPartnerId: +values?.soldToPartner?.value,
        quotationEndDate: values?.quotationEndDate,
        remark: values?.remark,
        actionBy: profileData?.userId,
        address: values?.address,
        salesContractNo: values?.salesContractNo,
        salesTerm: values?.salesTerm?.label,
        salesTermid: values?.salesTerm?.value,
        modeofShipment: values?.modeofShipment?.value,
        portofShipmentId: values?.portofShipment?.value || 0,
        portofShipment: values?.portofShipment?.label || "",
        portofDischargeId: values?.portofDishcharge?.value || 0,
        portofDishcharge: values?.portofDishcharge?.label || "",
        toCountryId: values?.destinationCountry?.value,
        toCountryName: values?.destinationCountry?.label,
        finalDestination: values?.finalDestination,
        countryOfOrigin: values?.countryOfOrigin,
        contractFor: values?.contractFor,
        freightAmount: +values?.freightAmount,
        currencyId: values?.currency?.value,
        currencyName: values?.currency?.label,
        exPortRegNo: values?.exPortRegNo,
        exPortPermissionNo: id ? values?.exPortPermissionNo : "N/A",
        currencyRateBdt: +values?.currencyRateBdt,
        intViewAs: values?.viewAs?.value || 0,
        strViewAs: values?.viewAs?.label || "",
        attachmentno: uploadedImage[0]?.id || values?.attachmentno || "",
      },
      objRow: objRow,
      objSpecRow: objSpecRow,
      objTerms: objTerms,
    };
    saveData(
      id
        ? `/oms/SalesQuotation/EditForeignSalesQuotation`
        : `/oms/SalesQuotation/CreateForeignSalesQuotation`,
      payload,
      (data) => {
        setQuotationCode(data?.customResponse);
        id &&
          getSingleData(
            `/oms/SalesQuotation/GetForeignSalesQuotationById?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&quotationId=${id}`,
            (data) => {
              setModifyData({
                salesOffice: {
                  value: data?.data?.objHeader?.salesOfficeId,
                  label: data?.data?.objHeader?.salesOfficeName,
                },
                soldToPartner: {
                  value: data?.data?.objHeader?.soldToPartnerId,
                  label: data?.data?.objHeader?.soldToPartnerName,
                },
                partnerReffNo: data?.data?.objHeader?.partnerReffNo,
                pricingDate: _dateFormatter(data?.data?.objHeader?.pricingDate),
                price: data?.data?.objHeader?.price,
                value: data?.data?.objHeader?.value,
                quotationEndDate: _dateFormatter(
                  data?.data?.objHeader?.quotationEndDate
                ),
                remark: data?.data?.objHeader?.remark,
                address: data?.data?.objHeader?.soldToPartnerAddress,
                salesContractNo: data?.data?.objHeader?.salesContractNo,
                salesTerm: data?.data?.objHeader?.salesTerm,
                modeofShipment: {
                  value: data?.data?.objHeader?.modeofShipment,
                  label: data?.data?.objHeader?.modeofShipment,
                },
                portofShipment: data?.data?.objHeader?.portofShipment,
                portofDishcharge: data?.data?.objHeader?.portofDishcharge,
                destinationCountry:
                  data?.data?.objHeader?.toCountryId &&
                  data?.data?.objHeader?.toCountryName
                    ? {
                        value: data?.data?.objHeader?.toCountryId,
                        label: data?.data?.objHeader?.toCountryName,
                      }
                    : "",
                finalDestination: data?.data?.objHeader?.finalDestination,
                countryOfOrigin: data?.data?.objHeader?.countryOfOrigin,
                contractFor: data?.data?.objHeader?.contractFor,
                freightAmount: data?.data?.objHeader?.freightAmount,
                currency: {
                  value: data?.data?.objHeader?.currencyId,
                  label: data?.data?.objHeader?.currencyName,
                },
                currencyRateBdt: data?.data?.objHeader?.currencyRateBdt,
                exPortPermissionNo: data?.data?.objHeader?.exPortPermissionNo,
                exPortRegNo: data?.data?.objHeader?.exPortRegNo,
                attachmentno: data?.data?.objHeader?.attachmentno,
              });
              setObjSpecRow(data?.data?.objSpec);
              setObjRow(data?.data?.objRow);
              setObjTerms(data?.data?.objTerms);
            },
            true
          );
        cb();
        !id && setIsShowModel(true);
      },
      true
    );
  };

  const getAllSpecificationByItemId = (itemId) => {
    const filterData = objSpecRow.filter((item) => item?.itemId === itemId);
    const spec = filterData.map((item) => item?.specification);
    const value = filterData.map((item) => item?.value);
    const specValue = spec.map((item, index) => `${item} : ${value[index]}`);
    return specValue.join(", ");
  };

  const addItem = (values, cb) => {
    const specificationsForTheItem = objSpecRow?.filter(
      (item) => item?.itemId === values?.itemList?.value
    );
    if (specificationsForTheItem?.length < specification?.length) {
      return toast.warn("You have to add all type of specifications!");
    }
    const rate = specificationsForTheItem?.find(
      (item) => item?.specificationId === 6
    );
    const qty = specificationsForTheItem?.find(
      (item) => item?.specificationId === 7
    );
    try {
      if (objRow?.find((item) => +item?.itemId === +values?.itemList?.value)) {
        return toast.warning("Item already added");
      } else {
        setObjRow([
          ...objRow,
          {
            rowId: 0,
            sequenceNo: 0,
            salesQuotationId: id ? +id : 0,
            itemId: values?.itemList?.value,
            itemCode: values?.itemList?.code,
            itemName: values?.itemList?.label,
            uom: values?.uom?.value,
            uomName: values?.uom?.label,
            // quotationQuantity: +values?.quantity,
            quotationQuantity: qty?.value,
            specification: getAllSpecificationByItemId(values?.itemList?.value),
            // currencyPrice: +values?.price,
            currencyPrice: rate?.value,
            packingDetialid: values?.packingDetails?.value,
            packingDetails: values?.packingDetails?.label,
            exportUomid: values?.exportUoM?.value,
            exportUomname: values?.exportUoM?.label,
          },
        ]);
      }
      cb();
    } catch (error) {
      console.log(error);
    }
  };

  const addSpecification = (values, cb) => {
    const currentItem = objSpecRow?.filter(
      (item) => item?.itemId === values?.itemList?.value
    );
    if (
      currentItem?.find(
        (item) => +item?.specificationId === +values?.specification?.value
      )
    ) {
      return toast.warn("This specification for the item is already added!");
    }
    const obj = {
      id: 0,
      quotationId: id ? +id : 0,
      specificationId: values?.specification?.value,
      specification: values?.specification?.label,
      value: +values?.value,
      itemId: +values?.itemList?.value,
      itemName: values?.itemList?.label,
      itemCode: values?.itemList?.code,
    };
    setObjSpecRow([...objSpecRow, obj]);
    cb();
  };

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/oms/SalesQuotation/GetPortofDisChargeDDL?accountId=1&businessUnitId=${selectedBusinessUnit?.value}&SearchTerm=${v}`
      )
      .then((res) => {
        console.log(res);
        return res?.data?.data || [];
      });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifyData : initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setObjRow([]);
          setObjSpecRow([]);
          setObjTerms([]);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(currencyLoader ||
            itemListLoader ||
            soldToPartnerLoader ||
            salesOfficeLoader ||
            specificationLoader ||
            uomLoader ||
            saveLoader ||
            destinationDDLLoader) && <Loading />}
          <IForm
            title={id ? "Edit Sales Quotation" : "Create Sales Quotation"}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="viewAs"
                    options={[
                      { value: 1, label: "Sales Contract" },
                      { value: 2, label: "Sales Quotation" },
                      { value: 3, label: "Proforma Invoice" },
                    ]}
                    value={values?.viewAs}
                    label="View As"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("viewAs", valueOption);
                      } else {
                        setFieldValue("viewAs", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOffice"
                    options={salesOffice}
                    value={values?.salesOffice}
                    label="Sales Office"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("salesOffice", valueOption);
                      } else {
                        setFieldValue("salesOffice", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="soldToPartner"
                    options={soldToPartner}
                    value={values?.soldToPartner}
                    label="Sold To Partner"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("soldToPartner", valueOption);
                        setFieldValue("address", valueOption?.address || "");
                      } else {
                        setFieldValue("soldToPartner", "");
                        setFieldValue("address", "");
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.pricingDate}
                    label="Pricing Date"
                    name="pricingDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("pricingDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.quotationEndDate}
                    label="Quotation End Date"
                    name="quotationEndDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("quotationEndDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remark}
                    label="Remark"
                    name="remark"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remark", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.salesContractNo}
                    label="Sales Contract No"
                    name="salesContractNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("salesContractNo", e.target.value);
                    }}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.salesTerm}
                    label="Sales Term"
                    name="salesTerm"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("salesTerm", e.target.value);
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="salesTerm"
                    options={salesTerms}
                    value={values?.salesTerm}
                    label="Sales Term"
                    placeholder="Sales Term"
                    onChange={(valueOption) => {
                      setFieldValue("salesTerm", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="modeofShipment"
                    options={[
                      { value: "By Air", label: "By Air" },
                      { value: "By Sea", label: "By Sea" },
                      { value: "By Land", label: "By Land" },
                    ]}
                    value={values?.modeofShipment}
                    label="Mode Of Shipment"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("modeofShipment", valueOption);
                      } else {
                        setFieldValue("modeofShipment", "");
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="portofShipment"
                    options={portsOfShipment}
                    value={values?.portofShipment}
                    label="Port Of Shipment"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("portofShipment", valueOption);
                      } else {
                        setFieldValue("portofShipment", "");
                      }
                    }}
                  />
                </div>

                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.portofShipment}
                    label="Port Of Shipment"
                    name="portofShipment"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("portofShipment", e.target.value);
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <label>Port Of Discharge</label>
                  <SearchAsyncSelect
                    selectedValue={values?.portofDishcharge}
                    handleChange={(valueOption) => {
                      setFieldValue("portofDishcharge", valueOption);
                    }}
                    loadOptions={loadUserList}
                    disabled={true}
                  />
                  {/* <FormikError
                    errors={errors}
                    name="portofDishcharge"
                    touched={touched}
                  /> */}
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.portofDishcharge}
                    label="Port Of Discharge"
                    name="portofDishcharge"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("portofDishcharge", e.target.value);
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="destinationCountry"
                    options={destinationDDL || []}
                    value={values?.destinationCountry}
                    label="Destination Country"
                    onChange={(valueOption) => {
                      setFieldValue("destinationCountry", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.finalDestination}
                    label="Final Destination"
                    name="finalDestination"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("finalDestination", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.address}
                    label="Address"
                    name="address"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("address", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.countryOfOrigin}
                    label="Country Of Origin"
                    name="countryOfOrigin"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("countryOfOrigin", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.contractFor}
                    label="Contract For"
                    name="contractFor"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("contractFor", e.target.value);
                    }}
                  />
                </div>
                {/* exp reg no */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.exPortRegNo}
                    label="Export Reg No"
                    name="exPortRegNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("exPortRegNo", e.target.value);
                    }}
                    disabled
                  />
                </div>
                {id ? (
                  <div className="col-lg-3">
                    <InputField
                      value={values?.exPortPermissionNo}
                      label="Export Permission No"
                      name="exPortPermissionNo"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("exPortPermissionNo", e.target.value);
                      }}
                    />
                  </div>
                ) : null}
                <div className="col-lg-3">
                  <NewSelect
                    name="currency"
                    options={currency}
                    value={values?.currency}
                    label="Currency"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("currency", valueOption);
                      } else {
                        setFieldValue("currency", "");
                      }
                    }}
                    isDisabled={objRow?.length > 0}
                  />
                </div>
                {values?.currency?.value === 155 && (
                  <div className="col-lg-3">
                    <InputField
                      value={values?.partnerReffNo}
                      // label="Partner Reff No"
                      label="FDA"
                      name="partnerReffNo"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("partnerReffNo", e.target.value);
                      }}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <InputField
                    value={values?.currencyRateBdt}
                    label="Currency Rate in (BDT)"
                    name="currencyRateBdt"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("currencyRateBdt", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.freightAmount}
                    label={`Freight Amount ${
                      values?.currency?.label
                        ? `in (${values?.currency?.label})`
                        : ``
                    }`}
                    name="freightAmount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("freightAmount", e.target.value);
                    }}
                    disabled={!values?.currency}
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    className="btn btn-primary mr-2 mt-5"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    {`${
                      id && modifyData?.attachmentno ? "ReAttach" : "Attach"
                    } File`}
                  </button>
                </div>
                {id && modifyData?.attachmentno && (
                  <div className="col-lg-2">
                    <button
                      className="btn btn-primary mr-2 mt-5"
                      type="button"
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(modifyData?.attachmentno)
                        );
                      }}
                    >
                      <i class="fas fa-file-image"></i> View attached file
                    </button>
                  </div>
                )}

                <DropzoneDialogBase
                  filesLimit={5}
                  acceptedFiles={["image/*", "application/pdf"]}
                  fileObjects={fileObjects}
                  cancelButtonText={"cancel"}
                  submitButtonText={"submit"}
                  maxFileSize={1000000}
                  open={open}
                  onAdd={(newFileObjs) => {
                    setFileObjects([].concat(newFileObjs));
                  }}
                  onDelete={(deleteFileObj) => {
                    const newData = fileObjects.filter(
                      (item) => item.file.name !== deleteFileObj.file.name
                    );
                    setFileObjects(newData);
                  }}
                  onClose={() => setOpen(false)}
                  onSave={() => {
                    setOpen(false);
                    empAttachment_action(fileObjects).then((data) => {
                      setUploadedImage(data);
                    });
                  }}
                  showPreviews={true}
                  showFileNamesInPreview={true}
                />
              </div>
              {/* second box */}

              <marquee
                direction="left"
                style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
              >
                You must have to add Total Carton and PCS in CTN in
                specification for every item.
              </marquee>

              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="itemList"
                    options={itemList}
                    value={values?.itemList}
                    label="Item List"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("itemList", valueOption);
                        getUom(
                          `/item/ItemUOM/GetItemUoMconverstionDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ItemId=${valueOption?.value}`,
                          (data) => {
                            setFieldValue("uom", data[0]);
                          }
                        );
                        setFieldValue("specification", "");
                      } else {
                        setFieldValue("itemList", "");
                        setFieldValue("uom", "");
                        setFieldValue("specification", "");
                      }
                    }}
                    isDisabled={!values?.currency || !values?.currencyRateBdt}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="packingDetails"
                    options={[
                      { value: 1, label: "Pouch Pack" },
                      { value: 2, label: "Pet Jar" },
                      { value: 3, label: "Foil Pack" },
                      { value: 4, label: "Paper Pack" },
                    ]}
                    value={values?.packingDetails}
                    label="Packing Details"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("packingDetails", valueOption);
                      } else {
                        setFieldValue("packingDetails", "");
                      }
                    }}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    label="Quantity"
                    name="quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("quantity", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.price}
                    label={`Fob Rate (${values?.currency?.label || ""})`}
                    name="price"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("price", e.target.value);
                    }}
                  />
                </div> */}
                {/* <div className="col-lg-3">
                  <InputField
                    value={(values?.quantity * values?.price).toFixed(2) || 0}
                    label="Total Price"
                    name="total"
                    type="number"
                    disabled={true}
                  />
                </div> */}
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="uom"
                    options={uom}
                    value={values?.uom}
                    label="Uom"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("uom", valueOption);
                      } else {
                        setFieldValue("uom", "");
                      }
                    }}
                    isDisabled={true}
                  />
                </div> */}

                <div className="col-lg-3">
                  <NewSelect
                    name="exportUoM"
                    options={exportUoMs}
                    value={values?.exportUoM}
                    label="Uom"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("exportUoM", valueOption);
                      } else {
                        setFieldValue("exportUoM", "");
                      }
                    }}
                    // isDisabled={true}
                  />
                </div>

                {/* <div className="col-lg-3">
                  <input
                    id="isSpecification"
                    type="checkbox"
                    className="ml-2"
                    value={values?.isSpecification}
                    checked={values?.isSpecification}
                    name="isSpecification"
                    onChange={(e) => {
                      setFieldValue("isSpecification", e.target.checked);
                    }}
                  />
                  <label htmlFor="isSpecification" className="ml-1 mt-2">
                    Want to add specification?
                  </label>
                </div> */}
              </div>
              {/* third box */}
              {/* {values?.isSpecification && ( */}
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="specification"
                    options={specification}
                    value={values?.specification}
                    label="Specification"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("specification", valueOption);
                        if (valueOption?.value === 5) {
                          const netWeightValue = getNetWeight(values, () => {
                            setFieldValue("specification", "");
                            setFieldValue("value", "");
                          });
                          setFieldValue("value", netWeightValue);
                        }
                      } else {
                        setFieldValue("specification", "");
                      }
                    }}
                    isDisabled={!values?.itemList}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.value}
                    label="Value"
                    name="value"
                    type="number"
                    disabled={values?.specification?.value === 5}
                    onChange={(e) => {
                      setFieldValue("value", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.specification?.value || !values?.value}
                    onClick={() => {
                      addSpecification(values, () => {
                        setFieldValue("specification", "");
                        setFieldValue("value", "");
                      });
                    }}
                  >
                    Add Specification
                  </button>
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    type="button"
                    disabled={
                      !values?.itemList?.value ||
                      // !values?.quantity ||
                      // !values?.price ||
                      !values?.uom?.value ||
                      !values?.currency?.value ||
                      !values?.currencyRateBdt
                    }
                    onClick={() => {
                      addItem(values, () => {
                        setFieldValue("itemList", "");
                        setFieldValue("quantity", "");
                        setFieldValue("uom", "");
                        setFieldValue("specification", "");
                        setFieldValue("price", "");
                        setFieldValue("value", "");
                        setFieldValue("exportUoM", "");
                      });
                    }}
                  >
                    Add Item
                  </button>
                </div>
              </div>
              {/* )} */}
              {/* objSpecRow table */}
              <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Specification</th>
                    <th>Value</th>
                    {/* <th>Item Code</th> */}
                    <th>Item Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {objSpecRow?.length > 0 &&
                    objSpecRow?.map((itm, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{itm?.specification}</td>
                          <td className="text-center">{itm?.value}</td>
                          {/* <td className="text-center">{itm?.itemCode}</td> */}
                          <td>{itm?.itemName}</td>
                          <td className="text-center">
                            <i
                              className="fa fa-trash"
                              style={{ cursor: "pointer", color: "red" }}
                              onClick={() => {
                                let _objSpecRow = objSpecRow;
                                _objSpecRow.splice(idx, 1);
                                setObjSpecRow([..._objSpecRow]);
                                if (
                                  objRow?.find(
                                    (item) => item?.itemId === itm?.itemId
                                  )
                                ) {
                                  let _objRow = objRow;
                                  _objRow.splice(idx, 1);
                                  setObjRow([..._objRow]);
                                }
                              }}
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              </div>

              {/* item table */}
           <div className="table-responsive">
           <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Packing Details</th>
                    <th>Specification</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {objRow?.length > 0 &&
                    objRow?.map((itm, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="text-center">{itm?.itemCode}</td>
                          <td>{itm?.itemName}</td>
                          <td className="text-center">
                            {itm?.quotationQuantity}
                          </td>
                          <td className="text-center">{itm?.currencyPrice}</td>
                          <td className="text-center">
                            {(
                              itm?.quotationQuantity * itm?.currencyPrice
                            ).toFixed(2)}
                          </td>
                          <td className="text-center">{itm?.packingDetails}</td>
                          <td>{itm?.specification}</td>
                          <td className="text-center">
                            <i
                              className="fa fa-trash"
                              style={{ cursor: "pointer", color: "red" }}
                              onClick={() => {
                                let _objRow = objRow;
                                _objRow.splice(idx, 1);
                                setObjRow([..._objRow]);
                                let _objSpecRow = objSpecRow;
                                let _objSpecRowFilter = _objSpecRow.filter(
                                  (item) => item?.itemId !== itm?.itemId
                                );
                                setObjSpecRow([..._objSpecRowFilter]);
                              }}
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
           </div>

              {/* t&c */}
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.termsAndConditions}
                    label="Terms And Conditions"
                    name="termsAndConditions"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("termsAndConditions", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{
                      marginTop: "17px",
                    }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.termsAndConditions}
                    onClick={() => {
                      setObjTerms([
                        ...objTerms,
                        {
                          quotationId: id ? +id : 0,
                          sl: objTerms.length + 1,
                          terms: values?.termsAndConditions,
                        },
                      ]);
                      setFieldValue("termsAndConditions", "");
                    }}
                  >
                    Add Terms & Conditions
                  </button>
                </div>
              </div>

          <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Terms & Conditions</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {objTerms?.length > 0 &&
                    objTerms?.map((itm, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{itm?.sl}</td>
                          <td>{itm?.terms}</td>
                          <td className="text-center">
                            <i
                              className="fa fa-trash"
                              style={{ cursor: "pointer", color: "red" }}
                              onClick={() => {
                                let _objTerms = objTerms;
                                _objTerms.splice(idx, 1);
                                setObjTerms([..._objTerms]);
                              }}
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
          </div>

              {/* modal */}

              {!id ? (
                <div>
                  <BasicModal
                    open={isShowModel}
                    handleOpen={() => setIsShowModel(true)}
                    handleClose={() => {
                      setIsShowModel(false);
                    }}
                    myStyle={{ width: 400 }}
                    hideBackdrop={true}
                  >
                    <h1 className="text-center">
                      Quotation Code : {quotationCode}
                    </h1>
                  </BasicModal>
                </div>
              ) : null}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
