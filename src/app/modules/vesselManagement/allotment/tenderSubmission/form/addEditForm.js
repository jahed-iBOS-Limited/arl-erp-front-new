import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../../_helper/_loading";
import { useLocation, useParams } from "react-router";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { businessPartnerDDL, convertToText, ErrorMessage, getDischargePortDDL, GetLoadPortDDL, initData, validationSchema } from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";



export default function TenderSubmissionCreateEditForm() {
    const { profileData: { userId, accountId }, selectedBusinessUnit: { label: buUnName, value: buUnId } } = useSelector(state => state?.authData, shallowEqual)
    const { id } = useParams()
    const { state } = useLocation()

    const [objProps, setObjprops] = useState({});
    const [dischargeDDL, setDischargeDDL] = useState([])
    const [loadPortDDL, setLoadPortDDL] = useState([])
    const [godownDDL, getGodownDDL, getGodownDDLLoading, updateGodownDDLLoading] = useAxiosGet()
    const [tenderDetails, getTenderDetails] = useAxiosGet()
    const [, submitTender, submitTenderLoading] = useAxiosPost()

    const getGodownDDLList = (businessPartner) => {
        const url = `/tms/LigterLoadUnload/GetShipToPartnerG2GPagination?AccountId=${accountId}&BusinessUnitId=${buUnId}&BusinessPartnerId=${businessPartner?.value}&PageNo=${0}&PageSize=${100}`
        getGodownDDL(url, (data) => {
            const updateDDL = data?.data?.map(item => {
                return {
                    value: item?.shiptoPartnerId,
                    label: item?.shipToParterName
                }
            })
            updateGodownDDLLoading(updateDDL)
        })
    }

    useEffect(() => {
        getDischargePortDDL(setDischargeDDL)
        GetLoadPortDDL(setLoadPortDDL)
        // Id Id (Edit)
        if (id && state) {
            console.log({ businessPartner: { value: state?.businessPartnerId } })
            fetchTenderDetails(id)
            getGodownDDLList({ value: state?.businessPartnerId })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchTenderDetails = (tenderId) => {
        const url = `/tms/TenderSubmission/GetTenderSubmissionById?AccountId=${accountId}&BusinessUnitId=${buUnId}&TenderId=${tenderId}`
        getTenderDetails(url)
    }

    const saveHandler = (values, cb) => {
        const payload = {
            header: {
                accountId: accountId,
                businessUnitId: buUnId,
                businessUnitName: buUnName,
                tenderId: id ? id : 0,
                businessPartnerId: values?.businessPartner?.value,
                businessPartnerName: values?.businessPartner?.label,
                enquiryNo: values?.enquiry,
                submissionDate: values?.submissionDate,
                foreignQty: values?.foreignQnt,
                totalQty: values?.foreignQnt,
                uomname: values?.uomname,
                itemName: values?.productName,
                loadPortId: values?.loadPort?.value,
                loadPortName: values?.loadPort?.label,
                dischargePortId: values?.dischargePort?.value,
                dischargePortName: values?.dischargePort?.label,
                foreignPriceUsd: values?.foreignPriceUSD,
                commercialNo: values?.commercialNo,
                commercialDate: values?.commercialDate,
                referenceNo: values?.referenceNo,
                referenceDate: values?.referenceDate,
                actionBy: userId,
                isActive: true
            },
            rows: values?.localTransportations?.map(item => ({
                godownId: item?.godownName?.value,
                godownName: item?.godownName?.label,
                quantity: item?.quantity,
                perQtyTonPriceBd: item?.price,
                perQtyPriceWords: convertToText(item?.price),
                tenderHeaderId: id ? id : 0,
                tenderRowId: id ? item?.tenderRowId : 0,
                isActive: true
            }))
        }
        submitTender(`/tms/TenderSubmission/CreateOrUpdateTenderSubission`, payload, cb,
            true
        )
    };

    const updateState = ({ header, rows }) => {
        const editData = {
            businessPartner: {
                value: header?.businessPartnerId,
                label: header?.businessPartnerName
            },
            enquiry: header?.enquiryNo,
            submissionDate: _dateFormatter(header?.submissionDate),
            foreignQnt: header?.foreignQty,
            uomname: header?.uomname,
            productName: header?.itemName,
            loadPort: {
                label: header?.loadPortName,
                value: header?.loadPortId
            },
            dischargePort: {
                label: header?.dischargePortName,
                value: header?.dischargePortId
            },
            foreignPriceUSD: header?.foreignPriceUsd,
            commercialNo: header?.commercialNo,
            commercialDate: _dateFormatter(header?.commercialDate),
            referenceNo: header?.referenceNo,
            referenceDate: _dateFormatter(header?.referenceDate),
            localTransportations: rows?.map(item => {
                return {
                    tenderRowId: item?.tenderRowId,
                    tenderHeaderId: item?.tenderHeaderId,
                    godownName: {
                        value: 98654,
                        label: item?.godownName
                    },
                    quantity: item?.quantity,
                    price: item?.perQtyTonPriceBd,
                    perQtyPriceWords: item?.perQtyTonPriceBd
                }
            })
        }
        return editData

    }

    return (
        <Formik
            enableReinitialize={true}
            initialValues={id ? updateState(tenderDetails) : initData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    !id && resetForm(initData)
                });
            }}
        >
            {({
                handleSubmit,
                resetForm,
                values,
                setFieldValue,
                errors,
                touched,
            }) => (
                <>
                    {(getGodownDDLLoading || submitTenderLoading) && <Loading />}
                    <IForm title="Tender Submission Create" getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-12">
                                    <h4>Foreign Part</h4>
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="businessPartner"
                                        options={businessPartnerDDL}
                                        value={values?.businessPartner}
                                        label="Business Partner"
                                        onChange={(valueOption) => {
                                            setFieldValue("businessPartner", valueOption);
                                            getGodownDDLList(valueOption)
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.enquiry}
                                        label="Enquiry No"
                                        name="enquiry"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("enquiry", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.submissionDate}
                                        label="Submission Date"
                                        name="submissionDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("submissionDate", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.foreignQnt}
                                        label="Foreign Quantity"
                                        name="foreignQnt"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("foreignQnt", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.uomname}
                                        label="Unit"
                                        name="uomname"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("uomname", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.productName}
                                        label="Product Name"
                                        name="productName"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("productName", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="loadPort"
                                        options={loadPortDDL}
                                        value={values?.loadPort}
                                        label="Load Port"
                                        onChange={(valueOption) => {
                                            setFieldValue("loadPort", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="dischargePort"
                                        options={dischargeDDL}
                                        value={values?.dischargePort}
                                        label="Discharge Port"
                                        onChange={(valueOption) => {
                                            setFieldValue("dischargePort", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.foreignPriceUSD}
                                        label="Foreign Price (USD)"
                                        name="foreignPriceUSD"
                                        type="number"
                                        onChange={(e) => {
                                            setFieldValue("foreignPriceUSD", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.commercialNo}
                                        label="Commercial No"
                                        name="commercialNo"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("commercialNo", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField

                                        value={values?.commercialDate}
                                        label="Commercial Date"
                                        name="commercialDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("commercialDate", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.referenceNo}
                                        label="Reference No"
                                        name="referenceNo"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("referenceNo", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.referenceDate}
                                        label="Reference Date"
                                        name="referenceDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("referenceDate", e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="col-lg-12 mt-2">
                                    <h4>Local Transport</h4>
                                </div>
                                <FieldArray
                                    name="localTransportations"
                                    render={arrayHelpers => (
                                        <>
                                            {
                                                values?.localTransportations?.map((localTransport, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <div className="col-lg-3">
                                                                <NewSelect
                                                                    name={`localTransportations[${index}].godownName`}
                                                                    options={godownDDL || []}
                                                                    value={values?.localTransportations[index].godownName}
                                                                    label="Godowns"
                                                                    onChange={(valueOption) => {
                                                                        setFieldValue(`localTransportations[${index}].godownName`, valueOption);
                                                                    }}
                                                                    errors={errors}
                                                                    touched={touched}
                                                                />
                                                                <p className="text-danger"><ErrorMessage name={`localTransportations[${index}].godownName`} /></p>
                                                                {errors.localTransportations && typeof errors.localTransportations === 'string' && (
                                                                    <p className="text-danger">{errors.localTransportations}</p>
                                                                )}
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <InputField
                                                                    value={values?.localTransportations[index].quantity}
                                                                    label="Quantity (Ton)"
                                                                    name={`localTransportations[${index}].quantity`}
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        setFieldValue(`localTransportations[${index}].quantity`, e.target.value);
                                                                    }}
                                                                />
                                                                <p className="text-danger"><ErrorMessage name={`localTransportations[${index}].quantity`} /></p>

                                                            </div>
                                                            <div className="col-lg-3">
                                                                <InputField
                                                                    value={values?.localTransportations[index].price}
                                                                    label="Price"
                                                                    name={`localTransportations[${index}].price`}
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        setFieldValue(`localTransportations[${index}].price`, e.target.value);
                                                                    }}
                                                                />
                                                                <p className="text-danger"><ErrorMessage name={`localTransportations[${index}].price`} /></p>

                                                            </div>

                                                            {
                                                                values?.localTransportations.length > 1 ? <span type="button" className="px-2 py-1 ml-2 align-self-end rounded font-xl" onClick={() => arrayHelpers.remove(index)}>
                                                                    <i class="fa fa-trash text-danger" style={{ fontSize: '16px' }} aria-hidden="true"></i>
                                                                </span> : <></>
                                                            }


                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                            <span
                                                type="button"
                                                className="px-2 py-1 text-success ml-2 align-self-end rounded font-xl"
                                                onClick={() => arrayHelpers.push({ godownName: '', quantity: '', price: '', tenderHeaderId: 0, tenderRowId: 0 })}
                                            >
                                                <i class="fa fa-plus text-success" style={{ fontSize: '16px' }} aria-hidden="true"></i>
                                            </span>
                                        </>
                                    )}
                                ></FieldArray>

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
            )
            }
        </Formik >
    );
}


