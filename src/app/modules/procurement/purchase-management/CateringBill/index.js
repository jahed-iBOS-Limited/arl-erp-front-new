import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import IConfirmModal from "../../../_helper/_confirmModal";
import IForm from "../../../_helper/_form";
import IAdd from "../../../_helper/_helperIcons/_add";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { getMonth } from "../../../salesManagement/report/salesanalytics/utils";
import useAxiosGet from "../purchaseOrder/customHooks/useAxiosGet";

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
    const [, setSingleData, singleDataLoading] = useAxiosGet();
    const [, onCreatePO, createPOLoading] = useAxiosPost();


    const saveHandler = (values, cb) => { };

    const getLandingData = (values) => {

        const strSupliarName = (values?.supplierName?.label === "All" || !values?.supplierName?.label) ? "" : `&SupplierName=${values?.supplierName?.label}`;

        getGridData(
            `/procurement/CateringBill/GetAutoPurchaseOrderForMeal?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value || 0}&MonthId=${values?.monthYear?.split("-")[1]}&YearId=${values?.monthYear?.split("-")[0]}${strSupliarName}`
        );
    };

    const selectedGridData = gridData?.filter((item) => item?.isChecked);

    const onUpdateHandler = (values, payload, setFieldValue) => {

        onSubmitHandler("/procurement/CateringBill/UpdateAutoPurchaseOrderForMeal", payload, () => {
            getLandingData(values);
            setFieldValue("attachmentList", "");
        }, true);
    }

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
                    {(loading || saveLoading || singleDataLoading || createPOLoading) && <Loading />}
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
                                        onUpdateHandler(values, payload, setFieldValue);
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
                                                                {!item?.purchaseOrderNo && (<span
                                                                    className=""
                                                                    onClick={() => {
                                                                        setSingleData(`/procurement/CateringBill/GetAutoPurchaseOrderForMealById?MealConsumeCountId=${item?.mealConsumeCountId}`, (data) => {
                                                                            IConfirmModal({
                                                                                message: "Are you sure you want to create PO?",
                                                                                title: "Create PO",
                                                                                yesAlertFunc: () => {
                                                                                    const apiUrl = `/procurement/PurchaseOrder/CreateStanderdAssetServicePurchaseOrder`;


                                                                                    const today = new Date();
                                                                                    const fourteenDaysLater = new Date(today);
                                                                                    fourteenDaysLater.setDate(today.getDate() + 14);

                                                                                    // Format the date as 'YYYY-MM-DD'
                                                                                    const year = fourteenDaysLater.getFullYear();
                                                                                    const month = String(fourteenDaysLater.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                                                                                    const day = String(fourteenDaysLater.getDate()).padStart(2, '0');
                                                                                    const poValidityDate = `${year}-${month}-${day}`;

                                                                                    const payload = {
                                                                                        "objHeaderDTO": {
                                                                                            "accountId": data?.accountId,
                                                                                            "businessUnitId": data?.businessUnitId,
                                                                                            "sbuId": data?.sbuid,
                                                                                            "plantId": data?.plantId,
                                                                                            "priceStructureId": 0,
                                                                                            "plantName": data?.plantName,
                                                                                            "warehouseId": data?.warehouseId,
                                                                                            "warehouseName": data?.warehouseName,
                                                                                            "supplyingWarehouseId": data?.warehouseId,
                                                                                            "supplyingWarehouseName": data?.warehouseName,
                                                                                            "purchaseOrganizationId": data?.purchaseOrganizationId,
                                                                                            "businessPartnerId": data?.supplierId,
                                                                                            "purchaseOrderDate": _todayDate(),
                                                                                            "purchaseOrderTypeId": data?.orderType,
                                                                                            "incotermsId": data?.incoterms,
                                                                                            "currencyId": data?.currencyId,
                                                                                            "supplierReference": "",
                                                                                            "referenceDate": _todayDate(),
                                                                                            "referenceTypeId": data?.referenceType,
                                                                                            returnDate: _todayDate(),
                                                                                            "paymentTerms": 2,
                                                                                            "creditPercent": 0,
                                                                                            "cashOrAdvancePercent": 0,
                                                                                            "otherTerms": "",
                                                                                            "poValidityDate": poValidityDate,
                                                                                            "lastShipmentDate": _todayDate(),
                                                                                            "paymentDaysAfterDelivery": 14,
                                                                                            "deliveryAddress": data?.deliveryAddress,
                                                                                            "actionBy": profileData?.userId,
                                                                                            "grossDiscount": 0,
                                                                                            "freight": 0,
                                                                                            "commission": 0,
                                                                                            "othersCharge": 0,
                                                                                            "transferBusinessUnitId": 0,
                                                                                            "transferCostElementId": 0,
                                                                                            "transferCostCenterId": 0,
                                                                                            "profitCenterId": data?.profitCenterId,

                                                                                        },
                                                                                        "objRowListDTO": [
                                                                                            {
                                                                                                "referenceId": 0,
                                                                                                "referenceCode": "",
                                                                                                "referenceQty": 0,
                                                                                                "itemId": data?.itemId,
                                                                                                "itemName": data?.itemName,
                                                                                                "uoMid": data?.baseUom,
                                                                                                "uoMname": data?.baseUomname,
                                                                                                "controllingUnitId": data?.controllingUnitId,
                                                                                                "bomId": 0,
                                                                                                "controllingUnitName": data?.controllingUnitName,
                                                                                                "costCenterId": data?.costCenterId,
                                                                                                "costCenterName": data?.costCenterName,
                                                                                                "costElementId": data?.costElementId,
                                                                                                "costElementName": data?.costElementName,
                                                                                                "purchaseDescription": "",
                                                                                                "orderQty": 1,
                                                                                                "basePrice": data?.numMealAmount,
                                                                                                "finalPrice": data?.numMealAmount,
                                                                                                "totalValue": data?.numMealAmount,
                                                                                                "actionBy": profileData?.userId,
                                                                                                "lastActionDateTime": _todayDate(),
                                                                                                "vatPercentage": 0,
                                                                                                "vatAmount": 0,
                                                                                                "baseVatAmount": 0,
                                                                                                "discount": 0,
                                                                                                "profitCenterId": data?.profitCenterId,
                                                                                            }
                                                                                        ],
                                                                                        "objImageListDTO": []
                                                                                    };
                                                                                    onCreatePO(apiUrl, payload, (res) => {
                                                                                        const payload = [{
                                                                                            mealConsumeCountId: data?.mealConsumeCountId,
                                                                                            purchaseOrderId: res?.autoId,
                                                                                            purchaseOrderNo: res?.code,
                                                                                        }]
                                                                                        onUpdateHandler(values, payload, setFieldValue);
                                                                                    }, true);

                                                                                },
                                                                                noAlertFunc: () => { },
                                                                            });

                                                                        });

                                                                    }}
                                                                >
                                                                    <IAdd title={"Create PO"} />
                                                                </span>)}
                                                                {item?.attatchmentId && (<span onClick={() => {
                                                                    dispatch(
                                                                        getDownlloadFileView_Action(
                                                                            item?.attatchmentId,
                                                                        )
                                                                    );
                                                                }}>
                                                                    <IView styles={{ fontSize: "16px" }} />

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