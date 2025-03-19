import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
const initData = {
    businessUnit: "",
    plant: "",
    wareHouse: "",
};
export default function ItemStockUpdate() {
    const [plantDDL, getPlantDDL, plantDDLloader, setPlantDDL] = useAxiosGet();
    const [warehouseDDL, getWarehouseDDL, warehouseDDLloader, setWarehouseDDL] = useAxiosGet();
    const [, itemStockQtyUpdate, itemStockQtyUpdateLoader] = useAxiosPost();
    const [, itemStockWHCostUpdate, itemStockWHCostUpdateLoader] = useAxiosPost();

    const businessUnitDDL = useSelector((state) => {
        return state.authData.businessUnitList;
    }, shallowEqual);

    const profileData = useSelector((state) => {
        return state.authData.profileData;
    }, shallowEqual);

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
                    {(plantDDLloader || warehouseDDLloader || itemStockQtyUpdateLoader || itemStockWHCostUpdateLoader) && <Loading />}
                    <IForm
                        title="Item Stock Update"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (<div></div>);
                        }}
                    >
                        <Form>
                            <div className="form-group row global-form">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="businessUnit"
                                        options={businessUnitDDL}
                                        value={values?.businessUnit}
                                        label="Business Unit"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("businessUnit", valueOption);
                                                setFieldValue("plant", "");
                                                setFieldValue("warehouse", "");
                                                getPlantDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value
                                                    }&OrgUnitTypeId=7`)
                                            } else {
                                                setFieldValue("businessUnit", "");
                                                setFieldValue("plant", "");
                                                setFieldValue("warehouse", "");
                                                setPlantDDL([]);
                                                setWarehouseDDL([]);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="plant"
                                        options={plantDDL}
                                        value={values?.plant}
                                        label="Plant"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("plant", valueOption);
                                                setFieldValue("warehouse", "");
                                                getWarehouseDDL(`/asset/DropDown/GetWareHouseByPlantId?AccountId=${profileData?.accountId}&UnitId=${values?.businessUnit?.value}&PlantId=${valueOption?.value}`)
                                            } else {
                                                setFieldValue("plant", "");
                                                setFieldValue("warehouse", "");
                                                setWarehouseDDL([]);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="wareHouse"
                                        options={
                                            warehouseDDL?.length > 0 && [
                                                {
                                                    value: null,
                                                    label: "All"
                                                },
                                                ...warehouseDDL
                                            ]
                                        }
                                        value={values?.wareHouse}
                                        label="Warehouse"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("wareHouse", valueOption);
                                            } else {
                                                setFieldValue("wareHouse", "");
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <button
                                        type="button"
                                        disabled={!values?.businessUnit?.value || !values?.plant?.value || !values?.wareHouse?.label}
                                        style={{ marginTop: "17px" }}
                                        className="btn btn-primary"
                                        onClick={() => {
                                            const whId = values?.wareHouse?.value ? `&whId=${values?.wareHouse?.value}` : "";
                                            itemStockQtyUpdate(`/wms/WmsReport/InventoryAllItemStockQtyUpdate?businessUnitId=${values?.businessUnit?.value}${whId}`, null, () => {
                                                itemStockWHCostUpdate(`/wms/WmsReport/InventoryAllItemStockWHCostUpdate?businessUnitId=${values?.businessUnit?.value}`, null, null, true, "WareHouse Cost Updated Successfully")
                                            }, true, "Stock Updated Successfully")
                                        }}
                                    >
                                        Process
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}