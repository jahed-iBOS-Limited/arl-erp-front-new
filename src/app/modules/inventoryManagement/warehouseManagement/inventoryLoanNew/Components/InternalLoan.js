import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import Axios from 'axios';
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
    sbu: "",
    partner: "",
    plant: "",
    warehouse: "",
    toBusinessUnit: "",
    reference: "",
    item: "",
    uom: "",
    quantity: "",
    remarks: "",
};

export default function InternalLoan({ loanType }) {
    const [objProps, setObjprops] = useState({});
    const [transactionType, setTransactionType] = useState(1);
    const { profileData, selectedBusinessUnit, businessUnitList } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const [, saveData, saveDataLoader] = useAxiosPost();
    const [, getSbuDDL, sbuDDLloader] = useAxiosGet();
    const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
    const [warehouseDDL, getWarehouseDDL, warehouseDDLloader] = useAxiosGet();
    const [partnerDDL, getpartnerDDl, partnerDDLloader] = useAxiosGet();

    const saveHandler = (values, cb) => {
        if (transactionType === 1) {
            if (!values?.partner) {
                return toast.warn("Partner is required")
            }
            if (!values?.plant) {
                return toast.warn("Plant is required")
            }
            if (!values?.warehouse) {
                return toast.warn("Warehouse is required")
            }
            if (!values?.toBusinessUnit) {
                return toast.warn("To Business Unit is required")
            }
            if (!values?.item) {
                return toast.warn("Item is required")
            }
            if (!values?.quantity) {
                return toast.warn("Quantity is required")
            }
            const payload = {
                intAccountId: profileData?.accountId,
                intBusinessUnitId: selectedBusinessUnit?.value,
                intPlantId: values?.plant?.value,
                intSbuId: values?.sbu?.value,
                intBusinessPartnerId: values?.partner?.value,
                strBusinessPartnerName: values?.partner?.label,
                intLoanTypeId: loanType,
                intLoanTypeName: loanType === 1 ? "Internal Loan" : "External Loan",
                intTransTypeId: transactionType,
                strTransTypeName: transactionType === 1 ? "Issue" : "Receive",
                intWareHouseId: values?.warehouse?.value,
                strWareHouseName: values?.warehouse?.label,
                intLcid: 0,
                strLcnumber: "",
                intShipmentId: 0,
                strShipmentName: "",
                strSurveyReportNo: "",
                intLighterVesselId: 0,
                strLighterVesselName: "",
                intMotherVesselId: 0,
                strMotherVesselName: "",
                dteTransDate: _todayDate(),
                intItemId: values?.item?.value,
                strItemName: values?.item?.label,
                numItemQty: +values?.quantity,
                numItemRate: 0,
                numItemAmount: 0,
                strNarration: values?.remarks,
                intActionBy: profileData?.userId,
                intFromOrToBusinessUnitId: values?.toBusinessUnit?.value,
                strFromOrToBusinessUnitName: values?.toBusinessUnit?.label,
            };
            saveData(`/wms/InventoryLoan/CreateInvItemloan`, payload, cb, true)
            console.log("transactionType 1 => payload", payload);
        }
        else if (transactionType === 2) {
            const payload = {
                // intAccountId: profileData?.accountId,
                // intBusinessUnitId: selectedBusinessUnit?.value,
                // intPlantId: values?.plant?.value,
                // intSbuId: values?.sbu?.value,
                // intBusinessPartnerId: values?.partner?.value,
                // strBusinessPartnerName: values?.partner?.label,
                // intLoanTypeId: loanType,
                // intLoanTypeName: loanType === 1 ? "Internal Loan" : "External Loan",
                // intTransTypeId: transactionType,
                // strTransTypeName: transactionType === 1 ? "Issue" : "Receive",
                // intWareHouseId: values?.warehouse?.value,
                // strWareHouseName: values?.warehouse?.label,
                // intLcid: 0,
                // strLcnumber: "",
                // intShipmentId: 0,
                // strShipmentName: "",
                // strSurveyReportNo: "",
                // intLighterVesselId: 0,
                // strLighterVesselName: "",
                // intMotherVesselId: 0,
                // strMotherVesselName: "",
                // intItemId: values?.item?.value,
                // strItemName: values?.item?.label,
                // numItemQty: +values?.quantity,
                // numItemRate: 0,
                // numItemAmount: 0,
                // strNarration: values?.remarks,
                // intActionBy: profileData?.userId,
                // intFromOrToBusinessUnitId: values?.toBusinessUnit?.value,
                // strFromOrToBusinessUnitName: values?.toBusinessUnit?.label,

            };
            console.log("transactionType 2 => payload", payload);
        }
        else { }
    };

    useEffect(() => {
        getpartnerDDl(`/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=4`)
        getSbuDDL(`/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId
            }&BusinessUnitId=${selectedBusinessUnit?.value
            }&Status=true`, (data) => {
                if (data && data[0]?.value) {
                    initData.sbu = data[0]
                }
            })
        getPlantDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId
            }&AccId=1&BusinessUnitId=${selectedBusinessUnit?.value
            }&OrgUnitTypeId=7`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    {(plantDDLloader || warehouseDDLloader || saveDataLoader || sbuDDLloader || partnerDDLloader) && <Loading />}
                    <IForm title="Create Inventory Loan" getProps={setObjprops}>
                        <Form>
                            <>
                                <div className="col-lg-4 mb-2 mt-5">
                                    <label className="mr-3">
                                        <input
                                            type="radio"
                                            name="transactionType"
                                            checked={transactionType === 1}
                                            className="mr-1 pointer"
                                            style={{ position: "relative", top: "2px" }}
                                            onChange={(valueOption) => {
                                                setTransactionType(1);
                                                resetForm(initData);
                                            }}
                                        />
                                        Loan Type (Issue)
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="transactionType"
                                            checked={transactionType === 2}
                                            className="mr-1 pointer"
                                            style={{ position: "relative", top: "2px" }}
                                            onChange={(e) => {
                                                setTransactionType(2);
                                                resetForm(initData);
                                            }}
                                        />
                                        Loan Type (Receive)
                                    </label>
                                </div>
                            </>
                            {transactionType === 1 ? (
                                <div className="form-group  global-form row">
                                    {/* <div className="col-lg-3">
                                        <NewSelect
                                            name="sbu"
                                            options={sbuDDL || []}
                                            value={values?.sbu}
                                            label="Sbu"
                                            onChange={(valueOption) => {
                                                if (valueOption) {
                                                    setFieldValue("sbu", valueOption);
                                                } else {
                                                    setFieldValue("sbu", "");
                                                }
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div> */}
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="partner"
                                            // options={[{ value: 0, label: "All" }, ...partnerDDL] || []}
                                            options={partnerDDL || []}
                                            value={values?.partner}
                                            label="Business Partner"
                                            onChange={(valueOption) => {
                                                setFieldValue("partner", valueOption);
                                            }}
                                            placeholder="Business Partner"
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="plant"
                                            options={plantDDL || []}
                                            value={values?.plant}
                                            label="Plant"
                                            onChange={(valueOption) => {
                                                if (valueOption) {
                                                    setFieldValue("plant", valueOption);
                                                    setFieldValue("warehouse", "");
                                                    setFieldValue("item", "");
                                                    setFieldValue("uom", "");
                                                    getWarehouseDDL(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId
                                                        }&businessUnitId=${selectedBusinessUnit?.value
                                                        }&PlantId=${valueOption?.value
                                                        }`)
                                                } else {
                                                    setFieldValue("plant", "");
                                                    setFieldValue("warehouse", "");
                                                    setFieldValue("item", "");
                                                    setFieldValue("uom", "");
                                                }
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="warehouse"
                                            options={warehouseDDL || []}
                                            value={values?.warehouse}
                                            label="Warehouse"
                                            onChange={(valueOption) => {
                                                if (valueOption) {
                                                    setFieldValue("warehouse", valueOption);
                                                    setFieldValue("item", "");
                                                    setFieldValue("uom", "");
                                                } else {
                                                    setFieldValue("warehouse", "");
                                                    setFieldValue("item", "");
                                                    setFieldValue("uom", "");
                                                }
                                            }}
                                            errors={errors}
                                            touched={touched}
                                            isDisabled={!values?.plant}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="toBusinessUnit"
                                            options={
                                                businessUnitList?.filter((itm) => itm.value !== selectedBusinessUnit?.value) || []
                                            }
                                            value={values?.toBusinessUnit}
                                            label="To BusinessUnit"
                                            onChange={(valueOption) => {
                                                setFieldValue("toBusinessUnit", valueOption);
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>Item Name</label>
                                        <SearchAsyncSelect
                                            selectedValue={values?.item}
                                            handleChange={(valueOption) => {
                                                if (valueOption) {
                                                    setFieldValue("item", valueOption);
                                                    setFieldValue("uom", {
                                                        value: valueOption?.uomId,
                                                        label: valueOption?.uomName,
                                                    });
                                                } else {
                                                    setFieldValue("item", "");
                                                    setFieldValue("uom", "");
                                                }
                                            }}
                                            loadOptions={(v) => {
                                                if (v?.length < 3) return [];
                                                return Axios.get(
                                                    `/item/ItemSales/GetItemDDLForInventoryLoan?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&WareHouseId=${values?.warehouse?.value || 0}&Search=${v}`
                                                ).then((res) => res?.data);
                                            }}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="Uom"
                                            options={[]}
                                            value={values?.uom}
                                            label="Uom"
                                            onChange={(valueOption) => { }}
                                            errors={errors}
                                            touched={touched}
                                            isDisabled={true}
                                        />
                                    </div>
                                    <div className="col-lg-3">
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
                                            value={values?.remarks}
                                            label="Remarks"
                                            name="remarks"
                                            type="text"
                                            onChange={(e) => {
                                                setFieldValue("remarks", e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>

                            ) : transactionType === 2 ? (
                                <>
                                    <div className="form-group  global-form row">
                                        <div className="col-lg-3">
                                            <NewSelect
                                                name="plant"
                                                options={plantDDL || []}
                                                value={values?.plant}
                                                label="Receive Plant"
                                                onChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue("plant", valueOption);
                                                        setFieldValue("warehouse", "");
                                                        setFieldValue("item", "");
                                                        getWarehouseDDL(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId
                                                            }&businessUnitId=${selectedBusinessUnit?.value
                                                            }&PlantId=${valueOption?.value
                                                            }`)
                                                    } else {
                                                        setFieldValue("plant", "");
                                                        setFieldValue("warehouse", "");
                                                        setFieldValue("item", "");
                                                    }
                                                }}
                                                errors={errors}
                                                touched={touched}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <NewSelect
                                                name="warehouse"
                                                options={warehouseDDL || []}
                                                value={values?.warehouse}
                                                label="Receive Warehouse"
                                                onChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue("warehouse", valueOption);
                                                        setFieldValue("item", "");
                                                        getWarehouseDDL(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`)
                                                    } else {
                                                        setFieldValue("warehouse", "");
                                                        setFieldValue("item", "");
                                                    }
                                                }}
                                                errors={errors}
                                                touched={touched}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <NewSelect
                                                name="toBusinessUnit"
                                                options={
                                                    businessUnitList?.filter((itm) => itm.value !== selectedBusinessUnit?.value) || []
                                                }
                                                value={values?.toBusinessUnit}
                                                label="From BusinessUnit"
                                                onChange={(valueOption) => {
                                                    setFieldValue("toBusinessUnit", valueOption);
                                                }}
                                                errors={errors}
                                                touched={touched}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <NewSelect
                                                name="reference"
                                                options={[]}
                                                value={values?.reference}
                                                label="Reference"
                                                onChange={(valueOption) => {
                                                    setFieldValue("reference", valueOption);
                                                }}
                                                errors={errors}
                                                touched={touched}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.remarks}
                                                label="Remarks"
                                                name="remarks"
                                                type="text"
                                                onChange={(e) => {
                                                    setFieldValue("remarks", e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "30px" }}>SL</th>
                                                        <th>Item Code</th>
                                                        <th>Item Name</th>
                                                        <th>UOM</th>
                                                        <th>Quantity</th>
                                                        <th>From Warehouse</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            ) : <></>}

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

