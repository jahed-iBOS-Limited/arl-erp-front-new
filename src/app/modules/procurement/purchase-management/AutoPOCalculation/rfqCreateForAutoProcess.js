import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import {
  _oneMonthLater,
  _todayDate,
  _todayDateTime12HFormet,
} from "../../../_helper/_todayDate";
import { eProcurementBaseURL } from "../../../../App";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import IDelete from "../../../_helper/_helperIcons/_delete";
import TextArea from "../../../_helper/TextArea";
import { useLocation } from "react-router";

const initData = {
  sbu: "",
  plant: "",
  warehouse: "",
  purchaseOrganization: {
    value: 11,
    label: "Local Procurement",
  },
  rfqType: { value: 1, label: "Standard RFQ" },
  rfqTitle: "",
  currency: {
    value: 141,
    label: "Taka",
    code: "BDT",
  },
  paymentTerms: { value: "Bank", label: "Bank" },
  transportCost: { value: 1, label: "Including" },
  quotationEntryStart: "",
  validTillDate: "",
  deliveryAddress: "",
  vatOrAit: { value: 1, label: "Including" },
  tds: { value: 1, label: "Including" },
  vds: { value: 1, label: "Including" },
  deliveryDate: "",
  referenceNo: "",
  isRankVisible: {
    value: false,
    label: "Hidden",
  },
  // item infos
  item: "",
  itemDescription: "",
  quantity: "",
  isAllItem: false,
  // supplier infos
  supplier: "",
  supplierContactNo: "",
  supplierEmail: "",
  isAllSupplier: false,
  termsAndConditions: "",

  isSentToSupplier: null,
};

export default function RFQCreateForAutoProcess() {
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const { id } = useParams();
  const [isRfqQty, setIsRfqQty] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [itemList, setItemList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [sbuListDDL, getSbuListDDL, sbuListDDLloader] = useAxiosGet();
  const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
  const [
    warehouseListDDL,
    getWarehouseListDDL,
    warehouseListDDLloader,
  ] = useAxiosGet();
  const [
    purchangeOrgListDDL,
    getPurchaseOrgListDDL,
    purchaseOrgListDDLloader,
  ] = useAxiosGet();
  const [currencyDDL, getCurrencyDDL, currencyDDLloader] = useAxiosGet();
  const [
    paymentTermsDDL,
    getPaymentTermsDDL,
    paymentTermsLoader,
  ] = useAxiosGet();
  const [
    referenceNoDDL,
    getReferenceNoDDL,
    referenceNoDDLloader,
    setReferenceNoDDL,
  ] = useAxiosGet();
  const [
    itemListDDL,
    getItemListDDL,
    itemListDDLloader,
    setItemListDDL,
  ] = useAxiosGet();
  const [
    supplierListDDL,
    getSupplierListDDL,
    supplierListDDLloader,
    setSupplierListDDL,
  ] = useAxiosGet();
  const [modifiedData, setModifiedData] = useState({});
  const [singleData, getSingleData, singleDataLoader] = useAxiosGet();
  const { profileData, selectedBusinessUnit, sbu } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  // const [attachmentData, setAttchmentData] = useState([]);
  // const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [, uploadFile] = useAxiosPost();

  const location = useLocation();
  const prData = location?.state || {};
  console.log("prData", prData);
  const saveHandler = (values, cb) => {
    if (!values?.rfqTitle) return toast.warn("Please enter RFQ Title");
    if (!values?.currency) return toast.warn("Please select Currency");
    if (!values?.paymentTerms) return toast.warn("Please select Payment Terms");
    if (!values?.transportCost)
      return toast.warn("Please select Transport Cost");
    if (!values?.quotationEntryStart)
      return toast.warn("Please select Quotation Start Date-Time");
    if (!values?.validTillDate)
      return toast.warn("Please select Quotation End Date-Time");
    if (!values?.deliveryDate) return toast.warn("Please select Delivery Date");
    if (!values?.deliveryAddress)
      return toast.warn("Please enter Delivery Address");
    if (!values?.isRankVisible) return toast.warn("Please select Bidding Rank");
    if (!itemList?.length) return toast.warn("Please add item");
    if (supplierList?.length < 3)
      return toast.warn("Please add at least 3 supplier");

    const rfqDetailsFunction = (lanData) => {
      if (lanData?.purchaseRequestTypeId === 2) {
        return { rfqTypeId: 1, rfqTypeName: "Standard RFQ" };
      } else if (lanData?.purchaseRequestTypeId === 8) {
        return { rfqTypeId: 2, rfqTypeName: "Service RFQ" };
      } else if (lanData?.purchaseRequestTypeId === 9) {
        return { rfqTypeId: 3, rfqTypeName: "Asset RFQ" };
      } else {
        return { rfqTypeId: 0, rfqTypeName: "" };
      }
    };

    const totalRowQuantity = itemList?.reduce(
      (acc, itm) => acc + +itm?.rfqquantity,
      0
    );

    const fileList = fileObjects?.map((itm) => {
      return {
        id: +id ? itm?.id : 0,
        attachmentId: +id ? itm?.attachmentId : itm?.id,
      };
    });
    const rowListWithReferance = itemList?.map((item) => {
      return {
        rowId: 0,
        partnerRfqid: item?.partnerRfqid || 0,
        requestForQuotationId: item?.requestForQuotationId || 0,
        requestForQuotationCode: "",
        referenceId: item?.purchaseRequestId,
        prreferenceCode: item?.purchaseRequestCode,
        itemId: item?.itemId,
        itemCode: item?.itemCode,
        itemName: item?.itemName,
        uoMid: item?.uoMid,
        uoMname: item?.uoMname,
        //@ts-ignore
        rfqquantity: item?.rfqquantity,
        referenceQuantity: item?.approvedQuantity,
        description: item?.description || "",
        chatList: [], // chat list
      };
    });

    const partnerList = supplierList?.map((item) => {
      return {
        partnerRfqid: item?.partnerRfqid || 0,
        requestForQuotationId: item?.requestForQuotationId || 0,
        requestForQuotationCode: item?.requestForQuotationCode || "",
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        businessPartnerId: item?.businessPartnerId,
        businessPartnerName: item?.businessPartnerName,
        businessPartnerCode: item?.businessPartnerCode,
        businessPartnerAddress: item?.businessPartnerAddress,
        supplierRefNo: item?.supplierRefNo || "",
        email: item?.email,
        contactNumber: item?.contactNumber,
        issueDate: _todayDate(),
        docAttachmentLink: "",
        isQuotationReceived: true,
        isEmailSend: true,
        lastActionBy: profileData?.userId,
        isActive: true,
      };
    });

    const payload = {
      requestForQuotationId: 0,
      requestForQuotationCode: "",
      rfqDate: _todayDate(),
      rfqtitle: values?.rfqTitle,
      currencyId: values?.currency?.value || 0,
      currencyCode: values?.currency?.code || "",
      quotationEntryStart: values?.quotationEntryStart,
      validTillDate: values?.validTillDate,
      paymentTerms: values?.paymentTerms?.label,
      isTransportCostInclude:
        prData?.purchaseOrganizationId?.value === 11
          ? values?.transportCost?.value === 1
            ? true
            : false
          : false,
      isVatAitInclude:
        prData?.purchaseOrganizationId?.value === 11
          ? values?.vatOrAit?.value === 1
            ? true
            : false
          : false,
      isTdsInclude:
        prData?.purchaseOrganizationId?.value === 11
          ? values?.tds?.value === 1
            ? true
            : false
          : false,
      isVdsInclude:
        prData?.purchaseOrganizationId?.value === 11
          ? values?.vds?.value === 1
            ? true
            : false
          : false,
      deliveryAddress: values?.deliveryAddress,
      deliveryDate: values?.deliveryDate,
      isApproved: true,
      businessUnitId: prData?.businessUnitId,
      businessUnitName: prData?.businessUnitName,
      sbuId: prData?.sbuid || 0,
      sbuName: prData?.sbuname || "",
      termsAndConditions: values?.termsAndConditions,
      totalItems: itemList?.length || 0,
      totalQuantity: totalRowQuantity || 0,
      status: "",
      rank: 0,
      amount: 0,
      isRankVisible: values?.isRankVisible?.value,
      purchaseOrganizationId: prData?.purchaseOrganizationId,
      purchaseOrganizationName: prData?.purchaseOrganizationName,
      plantId: prData?.plantId,
      plantName: prData?.plantName,
      warehouseId: prData?.warehouseId,
      warehouseName: prData?.warehouseName,
      requestTypeId: rfqDetailsFunction(prData)?.rfqTypeId || 0,
      // 2 = standardPr,8 = servicePr, 9 = assetPr
      requestTypeName: rfqDetailsFunction(prData)?.rfqTypeName || "", //
      referenceTypeName: "",
      attachmentList: fileList?.length > 0 ? fileList : [],
      actionBy: profileData?.userId,
      rowList: rowListWithReferance,
      partnerList: partnerList,
      incotermsId: 0,
      transportCostProvider: values?.transportCostProvider?.label || "",
      transportCost: +values?.transportAmount || 0,
    };
    saveData(
      id
        ? `${eProcurementBaseURL}/RequestForQuotation/EditRequestForQuotation`
        : `${eProcurementBaseURL}/RequestForQuotation/CreateRequestForQuotation`,
      payload,
      cb,
      true
    );
  };
  // console.log("itemList", JSON.stringify(itemList, null, 2));

  useEffect(() => {
    // /RequestForQuotation/GetRequestForQuotationDetails
    if (prData?.purchaseRequestId) {
      setItemList(prData?.rows || []);
      // const viewData = {
      //   sbu: {
      //     value: data?.sbuId,
      //     label: data?.sbuName,
      //   },
      //   plant: {
      //     value: data?.plantId,
      //     label: data?.plantName,
      //   },
      //   warehouse: {
      //     value: data?.warehouseId,
      //     label: data?.warehouseName,
      //   },
      //   rfqType: {
      //     value: data?.requestTypeId,
      //     label: data?.requestTypeName,
      //   },
      //   purchaseOrganization: {
      //     value: data?.purchaseOrganizationId,
      //     label: data?.purchaseOrganizationName,
      //   },
      //   rfqTitle: data?.rfqTitle,
      //   currency: {
      //     value: data?.currencyId,
      //     label: data?.currencyCode,
      //   },
      //   paymentTerms: {
      //     value: data?.paymentTerms,
      //     label: data?.paymentTerms,
      //   },
      //   transportCost: {
      //     value: data?.isTransportCostInclude ? 1 : 2,
      //     label: data?.isTransportCostInclude ? "Including" : "Excluding",
      //   },
      //   quotationEntryStart: data?.quotationEntryStart,
      //   validTillDate: data?.validTillDate,
      //   deliveryDate: _dateFormatter(data?.deliveryDate),
      //   deliveryAddress: data?.deliveryAddress,
      //   vatOrAit: {
      //     value: data?.isVatAitInclude ? 1 : 2,
      //     label: data?.isVatAitInclude ? "Including" : "Excluding",
      //   },
      //   tds: {
      //     value: data?.isTdsInclude ? 1 : 2,
      //     label: data?.isTdsInclude ? "Including" : "Excluding",
      //   },
      //   vds: {
      //     value: data?.isVdsInclude ? 1 : 2,
      //     label: data?.isVdsInclude ? "Including" : "Excluding",
      //   },
      //   referenceType: {
      //     value: data?.referenceTypeName,
      //     label: data?.referenceTypeName,
      //   },
      //   isRankVisible: {
      //     value: data?.isRankVisible,
      //     label: data?.isRankVisible ? "Show" : "Hidden",
      //   },
      //   referenceNo: "",
      //   termsAndConditions: data?.termsAndConditions,
      //   isSentToSupplier: true,
      // };
      // getReferenceNoDDL(
      //   `${eProcurementBaseURL}/EProcurement/GetPRReferrenceDDL?businessUnitId=${
      //     selectedBusinessUnit?.value
      //   }&purchaseOrganizationId=${data?.purchaseOrganizationId}&plantId=${
      //     data?.plantId
      //   }&warehouseId=${data?.warehouseId}&transactiontType=${
      //     data?.rfqType
      //   }&search=${""}`
      // );
      // getPlantListDDL(
      //   `${eProcurementBaseURL}/EProcurement/GetPermissionWisePlantDDL?userId=${profileData?.userId}&businessUnitId=${selectedBusinessUnit?.value}&orgUnitTypeId=7`
      // );
      // getWarehouseListDDL(
      //   `${eProcurementBaseURL}/EProcurement/GetPermissionWiseWarehouseDDL?userId=${profileData?.userId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${data?.plantId}&orgUnitTypeId=8`
      // );
      // getSupplierListDDL(
      //   `${eProcurementBaseURL}/EProcurement/GetSupplierListDDL?businessUnitId=${
      //     selectedBusinessUnit?.value
      //   }&search=${""}`
      // );
      // getPurchaseOrgListDDL(
      //   `${eProcurementBaseURL}/EProcurement/GetPurchaseOrganizationDDL?businessUnitId=${selectedBusinessUnit?.value}`
      // );
      // setModifiedData(viewData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!id) {
      // getPlantListDDL(
      //   `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
      // );
      getPlantListDDL(
        `${eProcurementBaseURL}/EProcurement/GetPermissionWisePlantDDL?userId=${profileData?.userId}&businessUnitId=${selectedBusinessUnit?.value}&orgUnitTypeId=7`
      );
      getSbuListDDL(
        `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`
      );
      getCurrencyDDL(
        `${eProcurementBaseURL}/EProcurement/GetBaseCurrencyListDDL`
      );
      getSupplierListDDL(
        `${eProcurementBaseURL}/EProcurement/GetSupplierListDDL?businessUnitId=${
          selectedBusinessUnit?.value
        }&search=${""}`
      );
      getPaymentTermsDDL(
        `${eProcurementBaseURL}/EProcurement/GetPaymentTermsListDDL`
      );
      getPurchaseOrgListDDL(
        `${eProcurementBaseURL}/EProcurement/GetPurchaseOrganizationDDL?businessUnitId=${selectedBusinessUnit?.value}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleAddSupplier = (values, setFieldValue) => {
    if (!values?.supplier) {
      return toast.warn("Please Select Supplier");
    }
    if (!values?.supplierContactNo) {
      return toast.warn("Please Enter Supplier Contact No");
    }
    if (!values?.supplierEmail) {
      return toast.warn("Please Enter Supplier Email");
    }
    const isDuplicate = supplierList.some(
      (supplier) => supplier?.businessPartnerName === values?.supplier?.label
    );
    if (isDuplicate) {
      toast.warn(`${values?.supplier?.label} already added`);
    } else {
      const newSupplier = {
        partnerRFQId: 0,
        requestForQuotationId: id ? +id : 0,
        businessPartnerId: values?.supplier?.value,
        businessPartnerName: values?.supplier?.label,
        businessPartnerCode: values?.supplier?.code,
        businessPartnerAddress: values?.supplier?.supplierAddress,
        email:
          values?.supplierEmail === ""
            ? values?.supplier?.supplierEmail
            : values?.supplierEmail,
        contactNumber:
          values?.supplierContactNo === ""
            ? values?.supplier?.supplierContact
            : values?.supplierContactNo,
        isEmailSend: false,
      };
      setSupplierList([...supplierList, newSupplier]);
    }
    setFieldValue("supplier", "");
    setFieldValue("supplierContactNo", "");
    setFieldValue("supplierEmail", "");
  };

  const handleDescriptionChange = (e, index) => {
    const temp = [...itemList];
    temp[index] = { ...temp[index], description: e.target.value };
    setItemList(temp);
  };

  const handleQuantityChange = (e, index) => {
    if (e.target.value < 0) {
      return toast?.warn("Quantity cant be negative");
    } else {
      const temp = [...itemList];
      temp[index].rfqquantity = +e.target.value;
      setItemList(temp);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifiedData : initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          !id && resetForm(initData);
          !id && setItemList([]);
          !id && setSupplierList([]);
          setIsRfqQty(false);
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
        d,
      }) => (
        <>
          {(currencyDDLloader || supplierListDDLloader || saveDataLoader) && (
            <Loading />
          )}
          <IForm
            title={
              id ? "Edit Request For Quotation" : "Create Request For Quotation"
            }
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.rfqTitle}
                    label="RFQ Title"
                    name="rfqTitle"
                    type="text"
                    placeholder="RFQ Title"
                    onChange={(e) => {
                      setFieldValue("rfqTitle", e.target.value);
                    }}
                    disabled={id && values?.isSentToSupplier}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="currency"
                    options={currencyDDL || []}
                    value={values?.currency}
                    label="Currency"
                    onChange={(v) => {
                      setFieldValue("currency", v);
                    }}
                    placeholder="Currency"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      values?.purchaseOrganization?.value === 11 ||
                      (id && values?.isSentToSupplier)
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentTerms"
                    options={paymentTermsDDL || []}
                    value={values?.paymentTerms}
                    label="Payment Terms"
                    onChange={(v) => {
                      setFieldValue("paymentTerms", v);
                    }}
                    placeholder="Payment Terms"
                    errors={errors}
                    touched={touched}
                    isDisabled={id && values?.isSentToSupplier}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.quotationEntryStart}
                    label="Quotation Start Date-Time"
                    name="Quotation Starte Date-Time"
                    type="datetime-local"
                    onChange={(e) => {
                      if (e.target.value) {
                        setFieldValue("quotationEntryStart", e.target.value);
                        setFieldValue("validTillDate", "");
                        setFieldValue("deliveryDate", "");
                      } else {
                        setFieldValue("quotationEntryStart", "");
                        setFieldValue("validTillDate", "");
                        setFieldValue("deliveryDate", "");
                      }
                    }}
                    disabled={id && values?.isSentToSupplier}
                    min={_todayDateTime12HFormet()}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.validTillDate}
                    label="Quotation End Date-Time"
                    name="validTillDate"
                    type="datetime-local"
                    onChange={(e) => {
                      if (e.target.value) {
                        setFieldValue("validTillDate", e.target.value);
                        setFieldValue(
                          "deliveryDate",
                          _oneMonthLater(e.target.value.split("T")[0])
                        );
                      } else {
                        setFieldValue("validTillDate", "");
                        setFieldValue("deliveryDate", "");
                      }
                    }}
                    min={values?.quotationEntryStart}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.deliveryDate}
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("deliveryDate", e.target.value);
                    }}
                    min={values?.validTillDate?.split("T")[0]}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.deliveryAddress}
                    label="Delivery Address"
                    name="deliveryAddress"
                    type="text"
                    placeholder="Delivery Address"
                    onChange={(e) => {
                      setFieldValue("deliveryAddress", e.target.value);
                    }}
                    disabled={id && values?.isSentToSupplier}
                  />
                </div>
                {prData?.purchaseOrganizationId === 11 && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="transportCost"
                        options={[
                          { value: 1, label: "Including" },
                          { value: 2, label: "Excluding" },
                        ]}
                        value={values?.transportCost}
                        label="Transport Cost"
                        onChange={(v) => {
                          if (v) {
                            setFieldValue("transportCost", v);
                          } else {
                            setFieldValue("transportCost", "");
                          }
                        }}
                        placeholder="Transport Cost"
                        errors={errors}
                        touched={touched}
                        isDisabled={id && values?.isSentToSupplier}
                      />
                    </div>
                    {values?.transportCost?.value === 1 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="transportCostProvider"
                          options={[
                            { value: 1, label: "Company" },
                            { value: 0, label: "Supplier" },
                          ]}
                          value={values?.transportCostProvider}
                          label="Transport Provider"
                          onChange={(v) => {
                            if (v) {
                              setFieldValue("transportCostProvider", v);
                            } else {
                              setFieldValue("transportCostProvider", "");
                            }
                          }}
                          placeholder="Transport Provider"
                          errors={errors}
                          touched={touched}
                          isDisabled={id && values?.isSentToSupplier}
                        />
                      </div>
                    )}
                    {values?.transportCostProvider?.value === 1 && (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.transportAmount}
                          label="Transport Amount"
                          name="transportAmount"
                          type="number"
                          placeholder="Transport Amount"
                          onChange={(e) => {
                            setFieldValue("transportAmount", e.target.value);
                          }}
                          disabled={id && values?.isSentToSupplier}
                        />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <NewSelect
                        name="vatOrAit"
                        options={[
                          { value: 1, label: "Including" },
                          { value: 2, label: "Excluding" },
                        ]}
                        value={values?.vatOrAit}
                        label="VAT/AIT"
                        onChange={(v) => {
                          if (v) {
                            setFieldValue("vatOrAit", v);
                          } else {
                            setFieldValue("vatOrAit", "");
                          }
                        }}
                        placeholder="VAT/AIT"
                        errors={errors}
                        touched={touched}
                        isDisabled={id && values?.isSentToSupplier}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="tds"
                        options={[
                          { value: 1, label: "Including" },
                          { value: 2, label: "Excluding" },
                        ]}
                        value={values?.tds}
                        label="TDS"
                        onChange={(v) => {
                          if (v) {
                            setFieldValue("tds", v);
                          } else {
                            setFieldValue("tds", "");
                          }
                        }}
                        placeholder="TDS"
                        errors={errors}
                        touched={touched}
                        isDisabled={id && values?.isSentToSupplier}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="vds"
                        options={[
                          { value: 1, label: "Including" },
                          { value: 2, label: "Excluding" },
                        ]}
                        value={values?.vds}
                        label="VDS"
                        onChange={(v) => {
                          if (v) {
                            setFieldValue("vds", v);
                          } else {
                            setFieldValue("vds", "");
                          }
                        }}
                        placeholder="VDS"
                        errors={errors}
                        touched={touched}
                        isDisabled={id && values?.isSentToSupplier}
                      />
                    </div>
                  </>
                )}
                <div className="col-lg-3">
                  <NewSelect
                    name="isRankVisible"
                    options={[
                      {
                        value: true,
                        label: "Show",
                      },
                      {
                        value: false,
                        label: "Hidden",
                      },
                    ]}
                    value={values?.isRankVisible}
                    label="Bidding Rank"
                    onChange={(v) => {
                      if (v) {
                        setFieldValue("isRankVisible", v);
                      } else {
                        setFieldValue("isRankVisible", "");
                      }
                    }}
                    placeholder="Bidding Rank"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2 mt-5">
                  {/* <button
                    className="btn btn-primary mr-2 mt-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button> */}
                  <AttachmentUploaderNew
                    isForPeopleDeskApi={true}
                    showIcon
                    style={{
                      color: "black",
                    }}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        console.log(attachmentData);
                        setFileObjects(attachmentData);
                      }
                    }}
                  />
                </div>
              </div>
              <h4 className="mt-2">Item's</h4>
              <div className="mt-2">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Reference No</th>
                        <th>Item Name</th>
                        <th>Uom</th>
                        <th>Description</th>
                        <th>PR Quantity</th>
                        <th>Rest Quantity</th>
                        <th>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                {isRfqQty
                                  ? "Click to add quantity manually"
                                  : "Click to fill by PR quantity"}
                              </Tooltip>
                            }
                          >
                            <input
                              style={{
                                transform: "translateY(3px)",
                                marginRight: "5px",
                              }}
                              type="checkbox"
                              defaultChecked={isRfqQty}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setIsRfqQty(true);
                                  setFieldValue("isAllItem", false);
                                  itemList.forEach((item) => {
                                    item.rfqquantity = item?.numRestQuantity;
                                  });
                                  setItemList([...itemList]);
                                } else {
                                  setIsRfqQty(false);
                                  setFieldValue("isAllItem", false);
                                  itemList.forEach((item) => {
                                    item.rfqquantity = 0;
                                  });
                                  setItemList([...itemList]);
                                }
                              }}
                              disabled={
                                itemList?.length === 0 ||
                                (id && values?.isSentToSupplier)
                              }
                            />
                          </OverlayTrigger>
                          Quantity
                        </th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {itemList?.length > 0 &&
                        itemList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.purchaseRequestCode}
                            </td>
                            <td>{item?.itemName}</td>
                            <td>{item?.uoMname}</td>
                            <td>
                              <InputField
                                value={item?.description}
                                name="description"
                                type="text"
                                placeholder="Item Description"
                                onChange={(e) => {
                                  handleDescriptionChange(e, index);
                                }}
                                disabled={id && values?.isSentToSupplier}
                              />
                            </td>
                            <td className="text-center">
                              {item?.approvedQuantity || ""}
                            </td>
                            <td className="text-center">
                              {item?.numRestQuantity || ""}
                            </td>
                            <td>
                              <InputField
                                value={item?.rfqquantity}
                                name="rfqquantity"
                                type="number"
                                placeholder="Quantity"
                                onChange={(e) => {
                                  handleQuantityChange(e, index);
                                }}
                                disabled={id && values?.isSentToSupplier}
                              />
                            </td>
                            {/* <td className="text-center">
                              <span
                                onClick={() => {
                                  if (id && values?.isSentToSupplier) {
                                    return toast.warn(
                                      "You can't delete item after sending RFQ"
                                    );
                                  }
                                  const temp = [...itemList];
                                  temp.splice(index, 1);
                                  setItemList(temp);
                                }}
                              >
                                <IDelete />
                              </span>
                            </td> */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* item table */}
              <h4 className="mt-2">Add Supplier to Send RFQ</h4>
              <div className="form-group  global-form row">
                <div className="col-lg-3 d-flex justify-content-center">
                  <NewSelect
                    name="supplier"
                    options={supplierListDDL || []}
                    value={values?.supplier}
                    label="Supplier"
                    onChange={(v) => {
                      if (v) {
                        setFieldValue("supplier", v);
                        setFieldValue("supplierContactNo", v?.supplierContact);
                        setFieldValue("supplierEmail", v?.supplierEmail);
                      } else {
                        setFieldValue("supplier", "");
                        setFieldValue("supplierContactNo", "");
                        setFieldValue("supplierEmail", "");
                      }
                    }}
                    placeholder="Supplier"
                    errors={errors}
                    touched={touched}
                    isDisabled={id && values?.isSentToSupplier}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.supplierContactNo}
                    label="Contact No"
                    name="supplierContactNo"
                    type="text"
                    placeholder="Contact No"
                    onChange={(e) => {
                      setFieldValue("supplierContactNo", e.target.value);
                    }}
                    disabled={id && values?.isSentToSupplier}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.supplierEmail}
                    label="Email"
                    name="supplierEmail"
                    type="text"
                    placeholder="Email"
                    onChange={(e) => {
                      setFieldValue("supplierEmail", e.target.value);
                    }}
                    disabled={id && values?.isSentToSupplier}
                  />
                </div>
                <div className="col-lg-3 d-flex">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginTop: "18px",
                      marginLeft: "5px",
                    }}
                    onClick={() => {
                      handleAddSupplier(values, setFieldValue);
                    }}
                    disabled={id && values?.isSentToSupplier}
                  >
                    Add Supplier
                  </button>
                </div>
              </div>
              {/* supplier table */}
              <div className="mt-2">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Supplier Name</th>
                        <th>Supplier Address</th>
                        <th>Contact No</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierList?.length > 0 &&
                        supplierList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.businessPartnerName}</td>
                            <td>{item?.businessPartnerAddress}</td>
                            <td>{item?.contactNumber}</td>
                            <td>{item?.email}</td>
                            <td className="text-center">
                              <span
                                onClick={() => {
                                  if (id && values?.isSentToSupplier) {
                                    return toast.warn(
                                      "You can't delete supplier after sending RFQ"
                                    );
                                  }
                                  const temp = [...supplierList];
                                  temp.splice(index, 1);
                                  setSupplierList(temp);
                                }}
                              >
                                <IDelete />
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="form-group  global-form row">
                <div className="col-lg-12">
                  <label>Terms & Conditions</label>
                  <TextArea
                    style={{
                      height: "100px",
                    }}
                    value={values?.termsAndConditions}
                    name="termsAndConditions"
                    placeholder="Terms & Conditions"
                    onChange={(e) =>
                      setFieldValue("termsAndConditions", e.target.value)
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
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
