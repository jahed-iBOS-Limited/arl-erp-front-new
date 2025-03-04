import { Form, Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import { getMonth } from "../../../salesManagement/report/salesanalytics/utils";
import useAxiosGet from "../purchaseOrder/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IView from "../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";

const initData = {
    businessUnit: "",
    monthYear: "",
    attachmentList: "",
    supplierName: "",
};
export default function CateringBill() {
    const { profileData, businessUnitList } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);



    const dispatch = useDispatch();

    const [gridData, getGridData, loading, setGridData] = useAxiosGet();
    const [, onSubmitHandler, saveLoading] = useAxiosPost();


    const saveHandler = (values, cb) => { };

    const getLandingData = (values) => {
        getGridData(
            `/procurement/CateringBill/GetAutoPurchaseOrderForMeal?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value || 0}&MonthId=${values?.monthYear?.split("-")[1]}&YearId=${values?.monthYear?.split("-")[0]}&SupplierName=${values?.supplierName?.label || ""}`
        );
    };

    const selectedGridData = gridData?.filter((item) => item?.isChecked);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
            // validationSchema={{}}
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
                    {(loading || saveLoading) && <Loading />}
                    <IForm
                        title="Catering Bill"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                    >
                        <Form>
                            <>
                                <div className="form-group  global-form row">
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="businessUnit"
                                            options={[{ value: 0, label: "All" }, ...businessUnitList] || []}
                                            value={values?.businessUnit}
                                            label="Business Unit"
                                            onChange={(valueOption) => {
                                                setFieldValue("businessUnit", valueOption || "");
                                                setFieldValue("attachmentList", "");
                                                setGridData([]);

                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="supplierName"
                                            options={[{ value: 0, label: "All" }, { value: 1, label: "Champak" }, { value: 2, label: "R B Food Catering" }, { value: 3, label: "AusBD Kitchen Ltd." }] || []}
                                            value={values?.supplierName}
                                            label="Supplier Name"
                                            onChange={(valueOption) => {
                                                setFieldValue("supplierName", valueOption || "");
                                                setFieldValue("attachmentList", "");
                                                setGridData([]);

                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <InputField value={values?.monthYear}
                                            name="monthYear"
                                            label="Month Year"
                                            type="month"
                                            onChange={(e) => {
                                                setFieldValue("monthYear", e.target.value)
                                                setFieldValue("attachmentList", "");
                                                setGridData([]);
                                            }} />
                                    </div>

                                    <div className="col-lg-3">
                                        <button
                                            onClick={() => {
                                                setFieldValue("attachmentList", "");
                                                getLandingData(values);
                                            }}
                                            type="button"
                                            className="btn btn-primary mt-5"
                                        >
                                            Show
                                        </button>
                                    </div>
                                </div>
                                {(true || gridData?.length > 0) && (<div className="text-right my-2">
                                    <AttachmentUploaderNew
                                        CBAttachmentRes={(attachmentData) => {
                                            if (Array.isArray(attachmentData)) {
                                                setFieldValue(
                                                    'attachmentList',
                                                    attachmentData?.[0]?.id,
                                                );
                                            }
                                        }}
                                        fileUploadLimits={1}
                                        isExistAttachment={values?.attachmentList} />
                                    <span className="ml-2"><button disabled={!selectedGridData?.length} onClick={() => {
                                        const payload = selectedGridData.map((item) => {
                                            return {
                                                mealConsumeCountId: item?.mealConsumeCountId,
                                                mealCount: +item?.mealCount,
                                                mealAmount: +item?.mealAmount,
                                                purchaseOrderId: item?.purchaseOrderId,
                                                purchaseOrderNo: item?.purchaseOrderNo,
                                                inventoryTransactionId: item?.inventoryTransactionId,
                                                inventoryTransactionCode: item?.inventoryTransactionCode,
                                                attatchmentId: values?.attachmentList || "",
                                            };
                                        });
                                        onSubmitHandler("/procurement/CateringBill/UpdateAutoPurchaseOrderForMeal", payload, () => {
                                            getLandingData(values);
                                            setFieldValue("attachmentList", "");
                                        }, true);
                                    }} className="btn btn-primary">Save</button></span>
                                </div>)}
                                {gridData?.length > 0 && (
                                    <div className="table-responsive">
                                        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                                            <thead>
                                                <tr>
                                                    <th><input type="checkbox" checked={gridData?.every((item) => item?.isChecked)} onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const modifiedData = gridData.map(item => ({ ...item, isChecked: checked }));
                                                        setGridData(modifiedData);
                                                    }} />
                                                    </th>
                                                    <th>SL</th>
                                                    <th>Month</th>
                                                    <th>Business Unit</th>
                                                    <th>Supplier</th>
                                                    <th>Meal Count</th>
                                                    <th>Meal Amount</th>
                                                    <th>Purchase Order No</th>
                                                    <th>Inventory Transaction Code</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gridData?.map((item, index) => (
                                                    <tr key={item.mealConsumeCountId}>
                                                        <td><input type="checkbox" checked={item?.isChecked} onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const modifyData = gridData?.map((itm) => itm.mealConsumeCountId === item.mealConsumeCountId ? { ...itm, isChecked: checked } : itm
                                                            )
                                                            setGridData(modifyData);
                                                        }} />
                                                        </td>
                                                        <td>{index + 1}</td>
                                                        <td className="text-center">{getMonth(item?.monthId)}</td>
                                                        <td>{item?.controllingUnitName}</td>
                                                        <td>{item?.supplierName}</td>
                                                        <td className="text-center">
                                                            <InputField
                                                                value={item?.mealCount || ""}
                                                                name="mealCount"
                                                                type="number"
                                                                onChange={(e) => {
                                                                    const modifyData = [...gridData];
                                                                    modifyData[index].mealCount = e.target.value;
                                                                    setGridData(modifyData);
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <InputField
                                                                value={item?.mealAmount || ""}
                                                                name="mealAmount"
                                                                type="number"
                                                                onChange={(e) => {
                                                                    const modifyData = [...gridData];
                                                                    modifyData[index].mealAmount = e.target.value;
                                                                    setGridData(modifyData);
                                                                }}
                                                            />
                                                        </td>
                                                        <td>{item?.purchaseOrderNo}</td>
                                                        <td>{item?.inventoryTransactionCode}</td>
                                                        <td className="text-center">
                                                            <div className="">
                                                                {/* <span
                                                                    className=""
                                                                    onClick={() => {
                                                                        // Example: Log the item's ID to the console
                                                                        console.log("Edit clicked for ID:", item.mealConsumeCountId);
                                                                        // Call a function to open an edit modal, etc.
                                                                    }}
                                                                >
                                                                    <IEdit />
                                                                </span> */}
                                                                {item?.attatchmentId && (<span onClick={() => {
                                                                    dispatch(
                                                                        getDownlloadFileView_Action(
                                                                            item?.attatchmentId,
                                                                        )
                                                                    );
                                                                }}>
                                                                    <IView styles={{fontSize:"16px"}} />

                                                                </span>)}
                                                                {/* <span
                                                                    className="px-5"
                                                                    onClick={() => {
                                                                        // Example: Log the item to the console
                                                                        console.log("History clicked for:", item);
                                                                        // Navigate to a history page, etc.
                                                                    }}
                                                                >
                                                                    <OverlayTrigger
                                                                        overlay={
                                                                            <Tooltip id="cs-icon">History</Tooltip>
                                                                        }
                                                                    >
                                                                        <i
                                                                            style={{ fontSize: "16px" }}
                                                                            className="fa fa-history cursor-pointer"
                                                                            aria-hidden="true"
                                                                        ></i>
                                                                    </OverlayTrigger>
                                                                </span> */}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}


                            </>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}