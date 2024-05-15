import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IClose from "../../../_helper/_helperIcons/_close";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { updateLoadingSlip } from "./utils";

const initData = {
    dteDate: _todayDate(),
    strCardNumber: "",
    entryCode: "",
    vehicaleNumber: "",
    salesBU: "",
    salesOrg: "",
    distributionChannel: "",
    item: "",
    uom: "",
    numQnt: "",
    strRemarks: "",
    shipPoint: "",
};

export default function ManualShipmentCreate() {
    const [objProps, setObjprops] = useState({});
    const { loadingId } = useParams();
    const [itemDDL, getItemDDL, itemDDLloader] = useAxiosGet();
    const [salesOrg, getSalesOrg, salesOrgLoader] = useAxiosGet();
    const [salesBU, getSalesBU, salesBULoader] = useAxiosGet();
    const [distributionChannel, getDistributionChannel, distributionChannelLoader] = useAxiosGet();
    const [shippointDDL, getShippointDDL, shippointDDLloader, setShippointDDL] = useAxiosGet();
    const [, getRegDDL, regDDLloader] = useAxiosGet();
    const [regData, getRegData, regDataLoader] = useAxiosGet();
    const [, saveData, saveDataLoader] = useAxiosPost();
    const [uom, getUom, uomLoader] = useAxiosGet();
    const [rowData, setRowData] = useState([]);
    const [, getEditData, editDataLoader] = useAxiosGet();
    const [modifyData, setModifyData] = useState();
    const [loader, setLoader] = useState(false);

    const profileData = useSelector((state) => {
        return state.authData.profileData;
    }, shallowEqual);

    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);

    useEffect(() => {
        if (loadingId) {
            getEditData(`/tms/Vehicle/GetLoadingSlipById?LoadingId=${loadingId}`,
                (data) => {
                    getItemDDL(`/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${profileData?.accountId
                        }&BUnitId=${selectedBusinessUnit?.value
                        }&DistributionChannelId=${data?.data?.headerDTO?.intDistributionChannelId
                        }&SalesOrgId=${data?.data?.headerDTO?.intSalesOrgId}`)
                    const initialEditData = {
                        dteDate: _dateFormatter(data?.data?.headerDTO?.dteDate),
                        strCardNumber: data?.data?.headerDTO?.strCardNumber,
                        entryCode: {
                            value: data?.data?.headerDTO?.strGateEntryCode,
                            label: data?.data?.headerDTO?.strGateEntryCode
                        },
                        vehicaleNumber: data?.data?.headerDTO?.strVehicleName,
                        salesBU: {
                            value: data?.data?.headerDTO?.intSalesBuid,
                            label: data?.data?.headerDTO?.salesBusinesstUnitName
                        },
                        salesOrg: {
                            value: data?.data?.headerDTO?.intSalesOrgId,
                            label: data?.data?.headerDTO?.salesOrganizationName
                        },
                        distributionChannel: {
                            value: data?.data?.headerDTO?.intDistributionChannelId,
                            label: data?.data?.headerDTO?.salesOrganizationName
                        },
                        shipPoint: {
                            value: data?.data?.headerDTO?.intShipPointId,
                            label: data?.data?.headerDTO?.shipPointName
                        },
                        strRemarks: data?.data?.headerDTO?.strRemarks,
                        intShipmentId: data?.data?.headerDTO?.intShipmentId,
                        strShipmentCode: data?.data?.headerDTO?.strShipmentCode,
                        intGateEntryId: data?.data?.headerDTO?.intGateEntryId,
                        intVehicleId: data?.data?.headerDTO?.intVehicleId,
                        strVehicleName: data?.data?.headerDTO?.strVehicleName,
                    }
                    setModifyData(initialEditData);
                    const initialRowData = data?.data?.rowDTO
                    setRowData(initialRowData);
                }
            )
        }
        getShippointDDL(`/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${profileData?.userId
            }&ClientId=${profileData?.accountId
            }&BusinessUnitId=${selectedBusinessUnit?.value
            }`, (date) => {
                let newData = date?.map((item) => {
                    return {
                        value: item?.organizationUnitReffId,
                        label: item?.organizationUnitReffName
                    }
                })
                setShippointDDL(newData)
            })
        getSalesBU(`/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
            (data) => {
                initData.salesBU = data[0];
                getSalesOrg(`/oms/SalesOrder/GetSODDLbySBUId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${data[0]?.value}`)
                getDistributionChannel(`/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${data[0]?.value}`)
            }
        )
        getUom(`/item/ItemUOM/GetItemUOMDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveHandler = (values, cb) => {
        if (rowData?.length <= 0) {
            return toast.warn("Add at least one item")
        }
        if (!values?.dteDate) {
            return toast.warn("Date is required")
        }
        if (!values?.shipPoint) {
            return toast.warn("Ship Point is required")
        }
        if (!values?.entryCode) {
            return toast.warn("Entry Code is required")
        }
        if (!values?.vehicaleNumber) {
            return toast.warn("Vehicle number is required")
        }
        if (!values?.salesBU) {
            return toast.warn("Sales BU is required")
        }
        if (!values?.salesOrg) {
            return toast.warn("Sales Org is required")
        }
        if (!values?.distributionChannel) {
            return toast.warn("Distribution Channel  is required")
        }
        const payload = {
            headerDTO: {
                intLoadingId: loadingId ? loadingId : 0,
                intShipmentId: loadingId ? modifyData?.intShipmentId : 0,
                strShipmentCode: loadingId ? modifyData?.strShipmentCode : "",
                intAccountId: profileData?.accountId,
                intBusinessUnitId: selectedBusinessUnit?.value,
                intShipPointId: values?.shipPoint?.value,
                shipPointName: values?.shipPoint?.label,
                dteDate: values?.dteDate,
                intVehicleId: loadingId ? modifyData?.intVehicleId : values?.entryCode?.intvehicleid,
                strVehicleName: loadingId ? modifyData?.strVehicleName : values?.entryCode?.vehicleNo,
                intActionBy: profileData?.userId,
                intGateEntryId: loadingId ? modifyData?.intGateEntryId : regData[0]?.intVeichleEntryId,
                strGateEntryCode: values?.entryCode?.label,
                strCardNumber: values?.strCardNumber,
                strRemarks: loadingId ? modifyData?.strRemarks : "",
                intSalesBuid: values?.salesBU?.value,
                intSalesOrgId: values?.salesOrg?.value,
                intDistributionChannelId: values?.distributionChannel?.value,
                numTotalQuantity: 0,
            },
            rowDTO: rowData
        };
        loadingId ? updateLoadingSlip(payload, setLoader, cb) : saveData(`/tms/Vehicle/CreateLoadingSlip`, payload, cb, true)
    };
    return (
        <Formik
            enableReinitialize={true}
            initialValues={loadingId ? modifyData : initData}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => { });
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
                    {(regDDLloader ||
                        regDataLoader ||
                        salesBULoader ||
                        salesOrgLoader ||
                        itemDDLloader ||
                        distributionChannelLoader ||
                        uomLoader ||
                        shippointDDLloader ||
                        editDataLoader ||
                        saveDataLoader ||
                        loader) && <Loading />}
                    <IForm title={loadingId ? "Edit Manual Shipment" : "Create Manual Shipment"} getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.dteDate}
                                        label="Date"
                                        name="dteDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("dteDate", e.target.value);
                                            document.getElementById("strCardNoId").focus();
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2 d-flex">
                                    <div style={{ width: "inherit" }}>
                                        <InputField
                                            id="cardNoInput"
                                            autoFocus
                                            value={values?.strCardNumber}
                                            label="Card No"
                                            name="strCardNumber"
                                            type="text"
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    document.getElementById("cardNoInput").disabled = true;
                                                    getRegDDL(
                                                        `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumber&BusinessUnitId=${selectedBusinessUnit?.value}&search=${values?.strCardNumber}`,
                                                        (data) => {
                                                            if (data.length > 0) {
                                                                getRegData(
                                                                    `/mes/MSIL/GetAllMSIL?PartName=EntryCodeDDL&BusinessUnitId=${selectedBusinessUnit?.value}&search=${data[0]?.label}`,
                                                                    (data) => {
                                                                        if (data.length > 0) {
                                                                            setFieldValue("entryCode", data[0]);
                                                                            setFieldValue("shipPoint", { value: data[0]?.intShipPointId, label: data[0]?.strShipPointName });
                                                                            setFieldValue("vehicaleNumber", data[0]?.vehicleNo);
                                                                        }
                                                                    }
                                                                );
                                                            } else {
                                                                toast.warn("Wrong Card No");
                                                                setFieldValue("strCardNumber", "");
                                                                document.getElementById("cardNoInput").disabled = false;
                                                                document.getElementById("cardNoInput").focus();
                                                            }
                                                        }
                                                    );
                                                }
                                            }}
                                            onChange={(e) => {
                                                setFieldValue("strCardNumber", e.target.value);
                                            }}
                                            disabled={loadingId ? true : false}
                                        />
                                    </div>
                                    {!loadingId && (<span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginLeft: "5px",
                                            cursor: "pointer",
                                            marginTop: "20px",
                                        }}
                                        onClick={() => {
                                            setRowData([]);
                                            setFieldValue("strCardNumber", "");
                                            document.getElementById("cardNoInput").disabled = false;
                                            document.getElementById("cardNoInput").focus();
                                            resetForm(initData);
                                        }}
                                    >
                                        <i style={{ color: "blue", }} className="fa fa-refresh" aria-hidden="true"></i>
                                    </span>)}
                                </div>
                                <div className="col-lg-2">
                                    <label>Reg No</label>
                                    <SearchAsyncSelect
                                        selectedValue={values?.entryCode}
                                        handleChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("entryCode", valueOption);
                                                setFieldValue("vehicaleNumber", valueOption?.vehicleNo);
                                                setFieldValue("shipPoint", { value: valueOption?.intShipPointId, label: valueOption?.strShipPointName });
                                            } else {
                                                setFieldValue("entryCode", "");
                                                setFieldValue("vehicaleNumber", "");
                                                setFieldValue("shipPoint", "");
                                                document.getElementById("cardNoInput").disabled = false;
                                            }
                                        }}
                                        isDisabled={rowData?.length > 0 ? true : false}
                                        loadOptions={(v) => {
                                            if (v?.length < 3) return [];
                                            return axios
                                                .get(`/mes/MSIL/GetAllMSIL?PartName=EntryCodeDDL&BusinessUnitId=${selectedBusinessUnit?.value}&search=${v}`)
                                                .then((res) => { return res?.data; })
                                                .catch((err) => []);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        autoFocus
                                        value={values?.vehicaleNumber}
                                        label="Vehicle No"
                                        name="vehicaleNumber"
                                        type="text"
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="salesBU"
                                        options={salesBU}
                                        value={values?.salesBU}
                                        label="Sales BU"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("salesBU", valueOption);
                                                getSalesOrg(`/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${valueOption?.value}`)
                                            } else {
                                                setFieldValue("salesBU", "");
                                            }
                                        }}
                                        placeholder="Sales BU"
                                        errors={errors}
                                        isDisabled={true}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="shipPoint"
                                        options={shippointDDL}
                                        value={values?.shipPoint}
                                        label="Ship Point"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("shipPoint", valueOption);
                                            } else {
                                                setFieldValue("shipPoint", "");
                                            }
                                        }}
                                        placeholder="Ship Point"
                                        errors={errors}
                                        isDisabled={true}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="salesOrg"
                                        options={salesOrg}
                                        value={values?.salesOrg}
                                        label="Sales Org"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("salesOrg", valueOption);
                                            } else {
                                                setFieldValue("salesOrg", "");
                                            }
                                        }}
                                        placeholder="Sales Org"
                                        errors={errors}
                                        isDisabled={rowData?.length > 0}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="distributionChannel"
                                        options={distributionChannel}
                                        value={values?.distributionChannel}
                                        label="Distribution Channel"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("distributionChannel", valueOption);
                                                getItemDDL(`/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${profileData?.accountId
                                                    }&BUnitId=${selectedBusinessUnit?.value
                                                    }&DistributionChannelId=${valueOption?.value
                                                    }&SalesOrgId=${values?.salesOrg?.value
                                                    }`)
                                            } else {
                                                setFieldValue("distributionChannel", "");
                                            }
                                        }}
                                        placeholder="Distribution Channel"
                                        errors={errors}
                                        isDisabled={rowData?.length > 0}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="item"
                                        options={itemDDL}
                                        value={values?.item}
                                        label="Item"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("item", valueOption);
                                                setFieldValue("uom", "");
                                            } else {
                                                setFieldValue("item", "");
                                                setFieldValue("uom", "");
                                            }
                                        }}
                                        placeholder="Item"
                                        errors={errors}
                                        isDisabled={false}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
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
                                        placeholder="uom"
                                        errors={errors}
                                        isDisabled={false}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.numQnt}
                                        label="Quantity"
                                        name="numQnt"
                                        type="number"
                                        onChange={(e) => {
                                            setFieldValue("numQnt", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.strRemarks}
                                        label="Remarks"
                                        name="strRemarks"
                                        type="text"
                                        onChange={(e) => {
                                            setFieldValue("strRemarks", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <button onClick={() => {
                                        let isItemAlreadyAdded = rowData.find((itm) => itm.intItemId === values?.item?.value)
                                        if (isItemAlreadyAdded) {
                                            return toast.warn("Item already added")
                                        }
                                        if (!values?.item?.value) {
                                            return toast.warn("Item is required")
                                        }
                                        if (!values?.uom?.value) {
                                            return toast.warn("Uom is required")
                                        }
                                        if (!values?.numQnt) {
                                            return toast.warn("Quantity is required")
                                        }
                                        if (!values?.strRemarks) {
                                            return toast.warn("Remarks is required")
                                        }
                                        setRowData(
                                            [...rowData, {
                                                intRowId: 0,
                                                intLoadingId: loadingId ? +loadingId : 0,
                                                numQnt: +values?.numQnt,
                                                intItemId: values?.item?.value,
                                                strItemName: values?.item?.label,
                                                intUomid: values?.uom?.value,
                                                strUomname: values?.uom?.label,
                                                strRemarks: values?.strRemarks,
                                                dteDate: _todayDate(),
                                                strItemCode: values?.item?.code,
                                            }]
                                        );
                                        setFieldValue("item", "");
                                        setFieldValue("uom", "");
                                        setFieldValue("numQnt", "");
                                        setFieldValue("strRemarks", "");
                                    }}
                                        type="button"
                                        className="btn btn-primary mt-5"
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12 table-responsive">
                                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30px" }}>SL</th>
                                                <th>Item Code</th>
                                                <th>Item Name</th>
                                                <th>UoM</th>
                                                <th>Quantity</th>
                                                <th>Remarks</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rowData?.length > 0 && rowData?.map((itm, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{itm?.strItemCode}</td>
                                                    <td>{itm?.strItemName}</td>
                                                    <td>{itm?.strUomname}</td>
                                                    <td className="text-center">{itm?.numQnt}</td>
                                                    <td>{itm?.strRemarks}</td>
                                                    <td className="text-center">
                                                        <IClose
                                                            closer={() => {
                                                                setRowData(
                                                                    rowData.filter((item) => item !== itm)
                                                                );
                                                            }}

                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <button
                                type="button"
                                style={{ display: "none" }}
                                ref={objProps?.btnRef}
                                onClick={() => handleSubmit()}
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