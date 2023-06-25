import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
    businessUnit: "",
    plant: "",
    warehouse: "",
    itemType: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
};

export default function InventoryStatementRDLC() {
    const [itemTypeDDl, getItemTypeDDl, itemTypeDDLloader] = useAxiosGet()
    const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
    const [warehouseListDDL, getWarehouseListDDL, warehouseListDDLloader, setWarehouseListDDL] = useAxiosGet();
    const [showRdlc, setShowRdlc] = useState(false);

    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    useEffect(() => {
        getItemTypeDDl(`/wms/WmsReport/GetItemTypeListDDL`)
        getPlantListDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
    const reportId = "5802242a-cfb5-4ab0-a98b-0ed4da3babbe";

    const parameterValues = (values) => {
        const agingParameters = [
            { name: "intUnit", value: `${selectedBusinessUnit?.value}` },
            { name: "dteFromDate", value: `${values?.fromDate}` },
            { name: "dteToDate", value: `${values?.todate}` },
            { name: "intWarehouseId", value: `${values?.warehouse?.value}` },
            { name: "intItemTypeId", value: `${values?.itemType?.value}` },
        ];
        return agingParameters;
    };

    const saveHandler = (values, cb) => { };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
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
                    {(itemTypeDDLloader || plantListDDLloader || warehouseListDDLloader) && <Loading />}
                    <IForm
                        title="Inventory Statement RDLC"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div></div>
                            );
                        }}
                    >
                        <Form>
                            <div>
                                <div className="form-group  global-form row">
                                    <div className="col-lg-2">
                                        <NewSelect
                                            name="plant"
                                            options={plantListDDL}
                                            value={values?.plant}
                                            label="Plant"
                                            onChange={(v) => {
                                                if (v) {
                                                    setShowRdlc(false);
                                                    setFieldValue("plant", v);
                                                    getWarehouseListDDL(
                                                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${v?.value}`
                                                    );
                                                } else {
                                                    setShowRdlc(false);
                                                    setFieldValue("plant", "");
                                                    setFieldValue("warehouse", "");
                                                    setWarehouseListDDL([]);
                                                }
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <NewSelect
                                            name="warehouse"
                                            options={warehouseListDDL}
                                            value={values?.warehouse}
                                            label="Warehouse"
                                            onChange={(v) => {
                                                if (v) {
                                                    setShowRdlc(false);
                                                    setFieldValue("warehouse", v);
                                                } else {
                                                    setShowRdlc(false);
                                                    setFieldValue("warehouse", "");
                                                }
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <NewSelect
                                            name="itemType"
                                            options={itemTypeDDl}
                                            value={values?.itemType}
                                            label="Item Type"
                                            onChange={(v) => {
                                                if (v) {
                                                    setShowRdlc(false);
                                                    setFieldValue("itemType", v);
                                                } else {
                                                    setShowRdlc(false);
                                                    setFieldValue("itemType", "");
                                                }
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <InputField
                                            value={values?.fromDate}
                                            label="From Date"
                                            name="fromDate"
                                            type="date"
                                            onChange={(e) => {
                                                setShowRdlc(false);
                                                setFieldValue("fromDate", e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <InputField
                                            value={values?.toDate}
                                            label="To Date"
                                            name="toDate"
                                            type="date"
                                            onChange={(e) => {
                                                setShowRdlc(false);
                                                setFieldValue("toDate", e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            style={{
                                                marginTop: '18px',
                                            }}
                                            onClick={() => {
                                                if (values?.plant && values?.warehouse && values?.itemType && values?.fromDate && values?.toDate) {
                                                    setShowRdlc(true);
                                                } else {
                                                    setShowRdlc(false);
                                                }

                                            }}
                                        >
                                            View Report
                                        </button>
                                    </div>
                                </div>
                                {
                                    showRdlc ? (
                                        <div>
                                            <PowerBIReport
                                                reportId={reportId}
                                                groupId={groupId}
                                                parameterValues={parameterValues(values)}
                                                parameterPanel={false}
                                            />
                                        </div>
                                    ) : null
                                }
                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}