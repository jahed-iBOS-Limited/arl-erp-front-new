import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import ICard from "../../../_helper/_card";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../_helper/iButton";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";



const initData = {
    viewType: "",
    plant: "",
    warehouse: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
};


export default function ItemCategorySales({ saveHandler }) {
    const {
        selectedBusinessUnit: { value: buId },
        profileData: { userId, accountId }
    } = useSelector((state) => state.authData, shallowEqual);

    const [showReport, setShowReport] = useState(false);
    const [plantDDL, getPlantDDL] = useAxiosGet();
    const [warehouseDDL, getWarehouseDDL, , setWarehouseDD0] = useAxiosGet();


    useEffect(() => {
        getPlantDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buId, userId, accountId]);




    const reportId = (values) => {
        return `d7355684-488c-434b-99f3-b34e0d7ecbeb`
    };
    const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;

    const parameterValues = (values) => {


        return [
            { name: "intUnit", value: `${buId}` },
            { name: "dteFromDate", value: `${values?.fromDate}` },
            { name: "dteToDate", value: `${values?.toDate}` },
            { name: "intPlantId", value: `${values?.plant?.value}` },
            { name: "intWarehouseId", value: `${values?.warehouse?.value}` },
            { name: "intPartid", value: `${values?.viewType?.value}` },
        ]

    };



    return (
        <Formik>
            <>
                <ICard title="Item Category Sales Report">
                    <div>
                        <div className="mx-auto">
                            <Formik
                                enableReinitialize={true}
                                initialValues={initData}
                                onSubmit={(values, { resetForm }) => {

                                }}
                            >
                                {({ values, errors, touched, setFieldValue }) => (
                                    <>
                                        <Form className="form form-label-right">
                                            <div className="form-group row global-form">
                                                <div className="col-lg-3">
                                                    <NewSelect
                                                        name="viewType"
                                                        options={[
                                                            { value: 1, label: "Details" },
                                                            { value: 2, label: "Top Sheet" },
                                                            { value: 3, label: "Item Category Base" },
                                                        ]}
                                                        value={values?.viewType}
                                                        label="View Type"
                                                        onChange={(valueOption) => {
                                                            setFieldValue("viewType", valueOption);
                                                            setShowReport(false);
                                                        }}
                                                        placeholder="View Type"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                </div>
                                                <div className="col-lg-3">
                                                    <NewSelect
                                                        name="plant"
                                                        options={plantDDL}
                                                        value={values?.plant}
                                                        label="Plant"
                                                        onChange={(valueOption) => {
                                                            setFieldValue("plant", valueOption);
                                                            setFieldValue("warehouse", "");
                                                            setShowReport(false);
                                                            setWarehouseDD0([])
                                                            if (valueOption) {
                                                                getWarehouseDDL(`wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${buId}&PlantId=${valueOption.value}&OrgUnitTypeId=8`);

                                                            }
                                                        }}
                                                        placeholder="Plant"
                                                        errors={errors}
                                                        touched={touched}
                                                    />

                                                </div>

                                                <div className="col-lg-3">
                                                    <NewSelect
                                                        name="warehouse"
                                                        options={[{ value: "0", label: "All" }, ...warehouseDDL]}
                                                        value={values?.warehouse}
                                                        label="Warehouse"
                                                        onChange={(valueOption) => {
                                                            setFieldValue("warehouse", valueOption);
                                                            setShowReport(false);
                                                        }
                                                        }
                                                        placeholder="Warehouse"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                </div>


                                                <FromDateToDateForm
                                                    obj={{

                                                        values,
                                                        setFieldValue,
                                                        onChange: () => {
                                                            setShowReport(false);
                                                        },
                                                        colSize: `col-lg-3`,
                                                    }}
                                                />

                                                <IButton
                                                    onClick={() => {
                                                        setShowReport(true);

                                                    }}
                                                />
                                            </div>
                                        </Form>

                                        {showReport && (
                                            <PowerBIReport
                                                reportId={reportId(values)}
                                                groupId={groupId}
                                                parameterValues={parameterValues(values)}
                                                parameterPanel={false}
                                            />
                                        )}
                                    </>
                                )}
                            </Formik>
                        </div>
                    </div>
                </ICard>
            </>
        </Formik>
    );
}
