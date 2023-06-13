import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { useParams } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IDelete from "../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import TextArea from "../../../_helper/TextArea";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
const initData = {
    sbu: "",
    plant: "",
    warehouse: "",
    purchaseOrganization: "",
    rfqType: { value: 1, label: 'Request for Quotation' },
    rfqTitle: "",
    currency: "",
    paymentTerms: "",
    transportCost: "",
    quotationEntryStart: "",
    validTillDate: "",
    deliveryAddress: "",
    vatOrAit: "",
    tds: "",
    vds: "",
    referenceType: "",
    deliveryDate: "",
    referenceNo: "",
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
};

const validationSchema = Yup.object().shape({

});

export default function RFQCreateEdit() {
    const { id } = useParams()
    const [isRfqQty, setIsRfqQty] = useState(false);
    const [objProps, setObjprops] = useState({});
    const [, saveData, saveDataLoader] = useAxiosPost();
    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const saveHandler = (values, cb) => {
        if (!values?.sbu) return toast.warn("Please select SBU")
        if (!values?.plant) return toast.warn("Please select Plant")
        if (!values?.warehouse) return toast.warn("Please select Warehouse")
        if (!values?.purchaseOrganization) return toast.warn("Please select Purchase Organization")
        if (!values?.rfqType) return toast.warn("Please select RFQ Type")
        if (!values?.rfqTitle) return toast.warn("Please enter RFQ Title")
        if (!values?.currency) return toast.warn("Please select Currency")
        if (!values?.paymentTerms) return toast.warn("Please select Payment Terms")
        if (!values?.transportCost) return toast.warn("Please select Transport Cost")
        if (!values?.quotationEntryStart) return toast.warn("Please select Quotation Start Date-Time")
        if (!values?.validTillDate) return toast.warn("Please select Quotation End Date-Time")
        if (!values?.deliveryDate) return toast.warn("Please select Delivery Date")
        if (!values?.deliveryAddress) return toast.warn("Please enter Delivery Address")
        if (!values?.vatOrAit) return toast.warn("Please select VAT/AIT")
        if (!values?.tds) return toast.warn("Please select TDS")
        if (!values?.vds) return toast.warn("Please select VDS")
        if (!values?.referenceType) return toast.warn("Please select Reference Type")
        if (!itemList?.length) return toast.warn("Please add item")
        if (!supplierList?.length) return toast.warn("Please add supplier")
        const payload = {
            objHeader: {
                requestForQuotationId: id ? +id : 0,
                rfqdate: _todayDate(),
                accountId: profileData?.accountId,
                businessUnitId: selectedBusinessUnit?.value,
                businessUnitName: selectedBusinessUnit?.label,
                sbuname: values?.sbu?.label || "",
                sbuid: values?.sbu?.value || 0,
                purchaseOrganizationId: values?.purchaseOrganization?.value,
                purchaseOrganizationName: values?.purchaseOrganization?.label,
                plantId: values?.plant?.value || 0,
                plantName: values?.plant?.label || "",
                warehouseId: values?.warehouse?.value || 0,
                warehouseName: values?.warehouse?.label || "",
                requestTypeId: values?.rfqType?.value || 0,
                requestTypeName: values?.rfqType?.label || "",
                referenceTypeName: values?.referenceType?.value || "",
                currencyId: values?.currency?.value || 0,
                validTillDate: values?.validTillDate,
                actionBy: profileData?.userId,
                paymentTerms: values?.paymentTerms?.value || "",
                isTransportCostInclude: values?.transportCost?.value === 1 ? true : false,
                isVatAitInclude: values?.vatOrAit?.value === 1 ? true : false,
                isTdsInclude: values?.tds?.value === 1 ? true : false,
                isVdsInclude: values?.vds?.value === 1 ? true : false,
                deliveryAddress: values?.deliveryAddress,
                deliveryDate: values?.deliveryDate,
                quotationEntryStart: values?.quotationEntryStart,
                rfqtitle: values?.rfqTitle,
                termsAndConditions: values?.termsAndConditions,
            },
            objRow: itemList,
            supplierRow: supplierList,
        }
        saveData(id ? `/procurement/RequestForQuotation/EditRequestForQuotation` : `/procurement/RequestForQuotation/CreateRequestForQuotation`, payload, cb, true)
    };

    const [itemList, setItemList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);

    const [sbuListDDL, getSbuListDDL, sbuListDDLloader] = useAxiosGet();
    const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
    const [warehouseListDDL, getWarehouseListDDL, warehouseListDDLloader] = useAxiosGet();
    const [purchangeOrgListDDL, getPurchaseOrgListDDL, purchaseOrgListDDLloader] = useAxiosGet();
    const [currencyDDL, getCurrencyDDL, currencyDDLloader] = useAxiosGet();
    const [referenceNoDDL, getReferenceNoDDL, referenceNoDDLloader] = useAxiosGet();
    const [itemListDDL, getItemListDDL, itemListDDLloader, setItemListDDL] = useAxiosGet();
    const [supplierListDDL, getSupplierListDDL, supplierListDDLloader] = useAxiosGet();

    const [modifiedData, setModifiedData] = useState({});
    const [, getSingleData, singleDataLoader] = useAxiosGet();

    useEffect(() => {
        if (id) {
            getSingleData(`/procurement/RequestForQuotation/GetRequestForQuotationById?RequestForQuotationId=${id}`, (data) => {
                console.log("data", data);
                const { objHeader, objRow, supplierRow } = data;
                setItemList(objRow);
                setSupplierList(supplierRow);
                const viewData = {
                    sbu: {
                        value: objHeader?.sbuid,
                        label: objHeader?.sbuname,
                    },
                    plant: {
                        value: objHeader?.plantId,
                        label: objHeader?.plantName,
                    },
                    warehouse: {
                        value: objHeader?.warehouseId,
                        label: objHeader?.warehouseName,
                    },
                    rfqType: {
                        value: objHeader?.requestTypeId,
                        label: objHeader?.requestTypeName,
                    },
                    purchaseOrganization: {
                        value: objHeader?.purchaseOrganizationId,
                        label: objHeader?.purchaseOrganizationName,
                    },
                    rfqTitle: objHeader?.rfqtitle,
                    currency: {
                        value: objHeader?.currencyId,
                        label: objHeader?.currencyCode,
                    },
                    paymentTerms: {
                        value: objHeader?.paymentTerms,
                        label: objHeader?.paymentTerms,
                    },
                    transportCost: {
                        value: objHeader?.isTransportCostInclude ? 1 : 2,
                        label: objHeader?.isTransportCostInclude ? "Including" : "Excluding",
                    },
                    quotationEntryStart: objHeader?.quotationEntryStart,
                    validTillDate: objHeader?.validTillDate,
                    deliveryDate: _dateFormatter(objHeader?.deliveryDate),
                    deliveryAddress: objHeader?.deliveryAddress,
                    vatOrAit: {
                        value: objHeader?.isVatAitInclude ? 1 : 2,
                        label: objHeader?.isVatAitInclude ? "Including" : "Excluding",
                    },
                    tds: {
                        value: objHeader?.isTdsInclude ? 1 : 2,
                        label: objHeader?.isTdsInclude ? "Including" : "Excluding",
                    },
                    vds: {
                        value: objHeader?.isVdsInclude ? 1 : 2,
                        label: objHeader?.isVdsInclude ? "Including" : "Excluding",
                    },
                    referenceType: {
                        value: objHeader?.referenceTypeName,
                        label: objHeader?.referenceTypeName,
                    },
                    referenceNo: objHeader?.referenceTypeName === "with reference" ? {
                        value: objRow[0]?.referenceId,
                        label: objRow[0]?.referenceCode,
                    } : "",
                    termsAndConditions: objHeader?.termsAndConditions,
                };
                if (objHeader?.referenceTypeName === "without reference") {
                    getItemListDDL(`/procurement/RequestForQuotation/GetRFQItemWithoutRef?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${modifiedData?.plant?.value
                        }&WarehouseId=${modifiedData?.warehouse?.value}`)
                } else {
                    getItemListDDL(`/procurement/RequestForQuotation/GetRFQItemDDL?AccountId=${profileData?.accountId
                        }&BusinessUnitId=${selectedBusinessUnit?.value
                        }&SBUId=${objHeader?.sbuid
                        }&PurchaseOrganizationId=${objHeader?.purchaseOrganizationId
                        }&PlantId=${objHeader?.plantId
                        }&WearHouseId=${objHeader?.warehouseId
                        }&PurchaseRequestId=${objRow[0]?.referenceId}`)
                }
                getSupplierListDDL(`/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId
                    }&UnitId=${selectedBusinessUnit?.value
                    }&SBUId=${objHeader?.sbuid}`)
                setModifiedData(viewData);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        getPlantListDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId
            }&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`)
        getSbuListDDL(`/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`)
        getCurrencyDDL(`/domain/Purchase/GetBaseCurrencyList`)
        getPurchaseOrgListDDL(`/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId
            }&BusinessUnitId=${selectedBusinessUnit?.value}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Formik
            enableReinitialize={true}
            initialValues={
                id ? modifiedData : initData
            }
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    !id && resetForm(initData);
                    !id && setItemList([]);
                    !id && setSupplierList([]);
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
                touched, d
            }) => (
                <>
                    {(purchaseOrgListDDLloader || currencyDDLloader || referenceNoDDLloader || itemListDDLloader || supplierListDDLloader || sbuListDDLloader || plantListDDLloader || warehouseListDDLloader || saveDataLoader || singleDataLoader) && <Loading />}
                    <IForm title={
                        id ? "Edit Request For Quotation" : "Create Request For Quotation"
                    } getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="sbu"
                                        options={sbuListDDL || []}
                                        value={values?.sbu}
                                        label="SBU"
                                        onChange={(v) => {
                                            if (v) {
                                                setFieldValue("sbu", v);
                                                setFieldValue("plant", "");
                                                setFieldValue("warehouse", "");
                                                getSupplierListDDL(`/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId
                                                    }&UnitId=${selectedBusinessUnit?.value
                                                    }&SBUId=${v?.value
                                                    }`)
                                            } else {
                                                setFieldValue("sbu", "");
                                                setFieldValue("plant", "");
                                                setFieldValue("warehouse", "");
                                            }
                                        }}
                                        placeholder="SBU"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="plant"
                                        options={plantListDDL || []}
                                        value={values?.plant}
                                        label="Plant"
                                        onChange={(v) => {
                                            if (v) {
                                                setFieldValue("plant", v);
                                                setFieldValue("warehouse", "");
                                                getWarehouseListDDL(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${v?.value
                                                    }`)
                                            } else {
                                                setFieldValue("plant", "");
                                                setFieldValue("warehouse", "");
                                            }

                                        }}
                                        placeholder="Plant"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="warehouse"
                                        options={warehouseListDDL || []}
                                        value={values?.warehouse}
                                        label="Warehouse"
                                        onChange={(v) => {
                                            setFieldValue("warehouse", v);
                                            setFieldValue("referenceType", "");
                                        }}
                                        placeholder="Warehouse"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.plant}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="rfqType"
                                        options={
                                            [
                                                { value: 1, label: 'Request for Quotation' },
                                                { value: 2, label: 'Request for Information' },
                                                { value: 3, label: 'Request for Proposal' }
                                            ]
                                        }
                                        value={values?.rfqType}
                                        label="RFQ Type"
                                        onChange={(v) => {
                                            setFieldValue("rfqType", v);
                                        }}
                                        placeholder="RFQ Type"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="purchaseOrganization"
                                        options={purchangeOrgListDDL || []}
                                        value={values?.purchaseOrganization}
                                        label="Purchase Organization"
                                        onChange={(v) => {
                                            setFieldValue("currency", "");
                                            setFieldValue("purchaseOrganization", v);
                                            if (v?.value === 11) {
                                                setFieldValue("currency", {
                                                    value: 141,
                                                    label: "Taka",
                                                    code: "BDT"
                                                });
                                            }
                                        }}
                                        placeholder="Purchase Organization"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.rfqTitle}
                                        label="RFQ Title"
                                        name="rfqTitle"
                                        type="text"
                                        placeholder="RFQ Title"
                                        onChange={(e) => {
                                            setFieldValue("rfqTitle", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
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
                                        isDisabled={values?.purchaseOrganization?.value === 11}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="paymentTerms"
                                        options={[
                                            {
                                                value: "Cash",
                                                label: "Cash",
                                            },
                                            {
                                                value: "Bank",
                                                label: "Bank",
                                            }
                                        ]}
                                        value={values?.paymentTerms}
                                        label="Payment Terms"
                                        onChange={(v) => {
                                            setFieldValue("paymentTerms", v);
                                        }}
                                        placeholder="Payment Terms"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="transportCost"
                                        options={[
                                            {
                                                value: 1,
                                                label: "Including",
                                            },
                                            {
                                                value: 2,
                                                label: "Excluding",
                                            }
                                        ]}
                                        value={values?.transportCost}
                                        label="Transport Cost"
                                        onChange={(v) => {
                                            setFieldValue("transportCost", v);
                                        }}
                                        placeholder="Transport Cost"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.quotationEntryStart}
                                        label="Quotation Start Date-Time"
                                        name="Quotation Starte Date-Time"
                                        type="datetime-local"
                                        onChange={(e) => {
                                            setFieldValue("quotationEntryStart", e.target.value);
                                            setFieldValue("validTillDate", "");
                                            setFieldValue("deliveryDate", "");
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.validTillDate}
                                        label="Quotation End Date-Time"
                                        name="validTillDate"
                                        type="datetime-local"
                                        onChange={(e) => {
                                            setFieldValue("validTillDate", e.target.value);
                                            setFieldValue("deliveryDate", "");
                                        }}
                                        min={values?.quotationEntryStart}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.deliveryDate}
                                        label="Delivery Date"
                                        name="deliveryDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("deliveryDate", e.target.value);
                                        }}
                                        min={_dateFormatter(values?.validTillDate)}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.deliveryAddress}
                                        label="Delivery Address"
                                        name="deliveryAddress"
                                        type="text"
                                        placeholder="Delivery Address"
                                        onChange={(e) => {
                                            setFieldValue("deliveryAddress", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="vatOrAit"
                                        options={[
                                            {
                                                value: 1,
                                                label: "Including",
                                            },
                                            {
                                                value: 2,
                                                label: "Excluding",
                                            }
                                        ]}
                                        value={values?.vatOrAit}
                                        label="VAT/AIT"
                                        onChange={(v) => {
                                            setFieldValue("vatOrAit", v);
                                        }}
                                        placeholder="VAT/AIT"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="tds"
                                        options={[
                                            {
                                                value: 1,
                                                label: "Including",
                                            },
                                            {
                                                value: 2,
                                                label: "Excluding",
                                            }
                                        ]}
                                        value={values?.tds}
                                        label="TDS"
                                        onChange={(v) => {
                                            setFieldValue("tds", v);
                                        }}
                                        placeholder="TDS"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="vds"
                                        options={[
                                            {
                                                value: 1,
                                                label: "Including",
                                            },
                                            {
                                                value: 2,
                                                label: "Excluding",
                                            }
                                        ]}
                                        value={values?.vds}
                                        label="VDS"
                                        onChange={(v) => {
                                            setFieldValue("vds", v);
                                        }}
                                        placeholder="VDS"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="referenceType"
                                        options={[
                                            {
                                                value: "with reference",
                                                label: "With reference"
                                            },
                                            {
                                                value: "without reference",
                                                label: "Without reference",
                                            }
                                        ]}
                                        value={values?.referenceType}
                                        label="Reference Type"
                                        onChange={(v) => {
                                            if (v) {
                                                if (v?.value === "without reference") {
                                                    getItemListDDL(`/procurement/RequestForQuotation/GetRFQItemWithoutRef?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value
                                                        }&PlantId=${values?.plant?.value
                                                        }&WarehouseId=${values?.warehouse?.value
                                                        }`)
                                                } else {
                                                    getReferenceNoDDL(`/procurement/RequestForQuotation/GetPRReferrenceNoDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${values?.sbu?.value
                                                        }&PurchaseOrganizationId=${values?.purchaseOrganization?.value
                                                        }&PlantId=${values?.plant?.value
                                                        }&WearHouseId=${values?.warehouse?.value
                                                        }`)
                                                }
                                                setFieldValue("referenceType", v);
                                                setFieldValue("item", "");
                                                setItemListDDL([])
                                            } else {
                                                setFieldValue("referenceType", "");
                                                setFieldValue("item", "");
                                                setItemListDDL([])
                                            }
                                        }}
                                        placeholder="Reference Type"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.plant || !values?.warehouse || !values?.purchaseOrganization || id}
                                    />
                                </div>

                            </div>
                            <h4 className="mt-2">Add Item</h4>
                            <div className="form-group  global-form row">
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="referenceNo"
                                        options={referenceNoDDL || []}
                                        value={values?.referenceNo}
                                        label="Reference No"
                                        onChange={(v) => {
                                            if (v) {
                                                setFieldValue("referenceNo", v);
                                                getItemListDDL(`/procurement/RequestForQuotation/GetRFQItemDDL?AccountId=${profileData?.accountId
                                                    }&BusinessUnitId=${selectedBusinessUnit?.value
                                                    }&SBUId=${values?.sbu?.value
                                                    }&PurchaseOrganizationId=${values?.purchaseOrganization?.value
                                                    }&PlantId=${values?.plant?.value
                                                    }&WearHouseId=${values?.warehouse?.value
                                                    }&PurchaseRequestId=${v?.value}
                                            `)
                                                setItemList([])
                                            } else {

                                            }
                                        }}
                                        placeholder="Reference No"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.plant || !values?.warehouse || values?.referenceType?.value === "without reference" || itemList?.length > 0}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="item"
                                        options={itemListDDL || []}
                                        value={values?.item}
                                        label="Item"
                                        onChange={(v) => {
                                            setFieldValue("item", v);
                                            setFieldValue("quantity", v?.refQty);
                                        }}
                                        placeholder="Item"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.itemDescription}
                                        label="Item Description"
                                        name="itemDescription"
                                        type="text"
                                        placeholder="Item Description"
                                        onChange={(e) => {
                                            setFieldValue("itemDescription", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.quantity}
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        placeholder="Quantity"
                                        onChange={(e) => {
                                            setFieldValue("quantity", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <label style={{ position: "absolute", top: "24px" }}>All Item</label>
                                    <Field
                                        name={values.isAllItem}
                                        component={() => (
                                            <input
                                                style={{
                                                    position: "absolute",
                                                    top: "28px",
                                                    left: "65px",
                                                }}
                                                id="rfqIsAllItem"
                                                type="checkbox"
                                                className="ml-2"
                                                disabled={values?.referenceType?.value === "without reference"}
                                                value={values.isAllItem || ""}
                                                checked={values.isAllItem}
                                                name="isAllItem"
                                                onChange={(e) => {
                                                    setFieldValue("isAllItem", e.target.checked);
                                                }}
                                            />
                                        )}
                                        label="isAllItem"
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{
                                            marginTop: "18px",
                                        }}
                                        onClick={() => {
                                            if (values.isAllItem) {
                                                setItemList([]);
                                                const temp = [...itemListDDL];
                                                const newItems = temp.map((item) => ({
                                                    itemId: item?.value || 0,
                                                    itemCode: item?.code || "",
                                                    itemName: item?.label || "",
                                                    itemtypeName: item?.itemtypeName || "",
                                                    uoMid: item?.uoMId || 0,
                                                    uoMname: item?.uoMName || "",
                                                    reqquantity: 0,
                                                    referenceId: values?.referenceNo?.value || 0,
                                                    referenceCode: values?.referenceNo?.label || "",
                                                    referenceQuantity: item?.refQty || 0,
                                                    description: item?.description,
                                                }));
                                                setItemList(newItems);
                                                setFieldValue("item", "");
                                                setFieldValue("itemDescription", "");
                                                setFieldValue("quantity", "");
                                            } else {
                                                if (!values?.item) {
                                                    return toast.warn("Please Select Item");
                                                }
                                                if (!values?.quantity) {
                                                    return toast.warn("Please Enter Quantity");
                                                }
                                                const isDuplicate = itemList.some((item) =>
                                                    item.itemName === values?.item?.label
                                                );
                                                if (isDuplicate) {
                                                    toast.warn("Item already added");
                                                } else {
                                                    setItemList([...itemList, {
                                                        rowId: 0,
                                                        itemId: values?.item?.value || 0,
                                                        itemCode: values?.item?.code || "",
                                                        itemName: values?.item?.label || "",
                                                        itemtypeName: values?.item?.itemtypeName || "",
                                                        uoMid: values?.item?.uoMId || 0,
                                                        uoMname: values?.item?.uoMName || "",
                                                        reqquantity: +values?.quantity || 0,
                                                        referenceId: values?.referenceNo?.value || 0,
                                                        referenceCode: values?.referenceNo?.label || "",
                                                        referenceQuantity: +values?.item?.refQty || 0,
                                                        description: values?.itemDescription === "" ? values?.item?.description : values?.itemDescription,
                                                    }]);
                                                }
                                                setFieldValue("item", "");
                                                setFieldValue("itemDescription", "");
                                                setFieldValue("quantity", "");
                                            }
                                        }}
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <table className="table table-striped table-bordered bj-table bj-table-landing">
                                    <thead>
                                        <tr>
                                            <th>Sl</th>
                                            <th>Item Name</th>
                                            <th>Uom</th>
                                            <th>Description</th>
                                            <th>Ref Quantity</th>
                                            <th>
                                                <input
                                                    style={{ transform: 'translateY(3px)' }}
                                                    type="checkbox"
                                                    defaultChecked={isRfqQty}
                                                    onChange={e => {
                                                        itemList.forEach((item) => {
                                                            item.reqquantity = item.referenceQuantity;
                                                        })
                                                        setItemList([...itemList]);
                                                    }}
                                                />
                                                Quantity
                                            </th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            itemList?.length > 0 && itemList?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.itemName}</td>
                                                    <td>{item?.uoMname}</td>
                                                    <td>
                                                        <InputField
                                                            value={item?.description}
                                                            name="description"
                                                            type="text"
                                                            placeholder="Item Description"
                                                            onChange={(e) => {
                                                                const temp = [...itemList];
                                                                temp[index].description = e.target.value;
                                                                setItemList(temp);
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="text-center">{item?.referenceQuantity}</td>
                                                    <td>
                                                        <InputField
                                                            value={item?.reqquantity}
                                                            name="reqquantity"
                                                            type="number"
                                                            placeholder="Quantity"
                                                            onChange={(e) => {
                                                                if (e.target.value < 0) {
                                                                    return toast?.warn("Quantity cant be negative")
                                                                } else {
                                                                    const temp = [...itemList];
                                                                    temp[index].reqquantity = +e.target.value;
                                                                    setItemList(temp);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <span>
                                                            <IDelete
                                                                remover={() => {
                                                                    const temp = [...itemList];
                                                                    temp.splice(index, 1);
                                                                    setItemList(temp);
                                                                }}
                                                            />
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {/* item table */}
                            <h4 className="mt-2">Add Supplier to Send RFQ</h4>
                            <div className="form-group  global-form row">
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="supplier"
                                        options={supplierListDDL || []}
                                        value={values?.supplier}
                                        label="Supplier"
                                        onChange={(v) => {
                                            setFieldValue("supplier", v);
                                            setFieldValue("supplierContactNo", v?.supplierContact);
                                            setFieldValue("supplierEmail", v?.supplierEmail);
                                        }}
                                        placeholder="Supplier"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.supplierContactNo}
                                        label="Contact No"
                                        name="supplierContactNo"
                                        type="text"
                                        placeholder="Contact No"
                                        onChange={(e) => {
                                            setFieldValue("supplierContactNo", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.supplierEmail}
                                        label="Email"
                                        name="supplierEmail"
                                        type="text"
                                        placeholder="Email"
                                        onChange={(e) => {
                                            setFieldValue("supplierEmail", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{
                                            marginTop: "18px",
                                        }}
                                        onClick={() => {
                                            const isDuplicate = supplierList.some((supplier) => supplier?.businessPartnerName === values?.supplier?.label);
                                            if (isDuplicate) {
                                                toast.warn(`${values?.supplier?.label} already added`);
                                            } else {
                                                setSupplierList([...supplierList, {
                                                    partnerRFQId: 0,
                                                    requestForQuotationId: id ? +id : 0,
                                                    businessPartnerId: values?.supplier?.value,
                                                    businessPartnerName: values?.supplier?.label,
                                                    businessPartnerAddress: values?.supplier?.supplierAddress,
                                                    email: values?.supplierEmail === "" ? values?.supplier?.supplierEmail : values?.supplierEmail,
                                                    contactNumber: values?.supplierContactNo === "" ? values?.supplier?.supplierContact : values?.supplierContactNo,
                                                    isEmailSend: false
                                                }]);
                                            }
                                            setFieldValue("supplier", "");
                                            setFieldValue("supplierContactNo", "");
                                            setFieldValue("supplierEmail", "");
                                        }}
                                        disabled={!values?.supplier}
                                    >
                                        Add Supplier
                                    </button>
                                </div>
                            </div>
                            {/* supplier table */}
                            <div className="mt-2">
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
                                        {
                                            supplierList?.length > 0 && supplierList?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.businessPartnerName}</td>
                                                    <td>{item?.businessPartnerAddress}</td>
                                                    <td>{item?.contactNumber}</td>
                                                    <td>{item?.email}</td>
                                                    <td className="text-center">
                                                        <span>
                                                            <IDelete
                                                                remover={() => {
                                                                    const temp = [...supplierList];
                                                                    temp.splice(index, 1);
                                                                    setSupplierList(temp);
                                                                }}
                                                            />
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="form-group  global-form row">
                                <div className="col-lg-12">
                                    <label>Terms & Conditions</label>
                                    <TextArea
                                        value={values?.termsAndConditions}
                                        name="termsAndConditions"
                                        placeholder="Terms & Conditions"
                                        onChange={(e) =>
                                            setFieldValue("termsAndConditions", e.target.value)
                                        }
                                        max={1000}
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
        </Formik >
    );
}