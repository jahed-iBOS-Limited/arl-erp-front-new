import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import TextArea from "../../../_helper/TextArea";
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
    termsAndConditions: "",
};
export default function RfqViewModal({ code, title }) {
    const [, getViewData, viewDataLoader] = useAxiosGet();
    const [modifiedData, setModifiedData] = useState({});
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const saveHandler = (values, cb) => { };
    const [objProps, setObjprops] = useState({});
    useEffect(() => {
        if (code) {
            getViewData(`/procurement/RequestForQuotation/GetRequestForQuotationById?RequestForQuotationId=${code}`, (data) => {
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
                    deliveryDate: _dateFormatter    (objHeader?.deliveryDate),
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
                    termsAndConditions: objHeader?.termsAndConditions,
                };
                setModifiedData(viewData);
            });
        }
    }, [])
    return (
        <Formik
            enableReinitialize={true}
            initialValues={modifiedData}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    resetForm(initData);
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
                    {viewDataLoader && <Loading />}
                    <IForm
                        title={title}
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div>
                                    {/* <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            console.log("Export PDF");
                                        }}
                                    >
                                        Export PDF
                                    </button> */}
                                </div>
                            );
                        }}
                        getProps={setObjprops}
                    >
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="sbu"
                                        options={[]}
                                        value={values?.sbu}
                                        label="SBU"
                                        onChange={(v) => {
                                            setFieldValue("sbu", v);
                                        }}
                                        placeholder="SBU"
                                        errors={errors}
                                        touched={touched} isDisabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="plant"
                                        options={[]}
                                        value={values?.plant}
                                        label="Plant"
                                        placeholder="Plant"
                                        errors={errors}
                                        touched={touched} isDisabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="warehouse"
                                        options={[]}
                                        value={values?.warehouse}
                                        label="Warehouse"
                                        onChange={(v) => {
                                            setFieldValue("warehouse", v);
                                        }}
                                        placeholder="Warehouse"
                                        errors={errors}
                                        touched={touched} isDisabled={true}
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
                                        options={[]}
                                        value={values?.purchaseOrganization}
                                        label="Purchase Organization"
                                        placeholder="Purchase Organization"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
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
                                        options={[]}
                                        value={values?.currency}
                                        label="Currency"
                                        onChange={(v) => {
                                            setFieldValue("currency", v);
                                        }}
                                        placeholder="Currency"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="paymentTerms"
                                        options={[
                                            {
                                                value: 1,
                                                label: "Cash",
                                            },
                                            {
                                                value: 2,
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
                                        isDisabled={true}
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
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.quotationEntryStart}
                                        label="Quotation Start Date-Time"
                                        name="Quotation Starte Date-Time"
                                        type="datetime-local"

                                        disabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.validTillDate}
                                        label="Quotation End Date-Time"
                                        name="validTillDate"
                                        type="datetime-local"
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.deliveryDate}
                                        label="Delivery Date"
                                        name="deliveryDate"
                                        type="date"
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.deliveryAddress}
                                        label="Delivery Address"
                                        name="deliveryAddress"
                                        type="text"
                                        placeholder="Delivery Address"
                                        disabled={true}
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
                                        isDisabled={true}
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
                                        placeholder="TDS"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
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
                                        placeholder="VDS"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
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
                                        placeholder="Reference Type"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
                                    />
                                </div>

                            </div>
                            <h4 className="mt-2">Item List</h4>
                            <div className="mt-2">
                                <table className="table table-striped table-bordered bj-table bj-table-landing">
                                    <thead>
                                        <tr>
                                            <th>Sl</th>
                                            <th>Item Name</th>
                                            <th>Uom</th>
                                            <th>Description</th>
                                            <th>Ref Quantity</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            itemList?.length > 0 && itemList?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.itemName}</td>
                                                    <td>{item?.uoMname}</td>
                                                    <td>{item?.description}</td>
                                                    <td>{item?.referenceQuantity}</td>
                                                    <td>{item?.reqquantity}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {/* item table */}
                            <h4 className="mt-2">Supplier List</h4>

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
                                        disabled={true}
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