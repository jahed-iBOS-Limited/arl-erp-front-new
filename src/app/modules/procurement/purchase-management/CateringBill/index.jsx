import { Form, Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
import { generateExcel } from "./helper";


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
    const [, getSingleData, singleDataLoading] = useAxiosGet();
    const [, onCreatePO, createPOLoading] = useAxiosPost();
    const [, onInventoryReceive, inventoryReceiveLoading] = useAxiosPost();


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
                    {(loading || saveLoading || singleDataLoading || createPOLoading || inventoryReceiveLoading) && <Loading />}
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

                                {(gridData?.length > 0) && (<div className="text-right my-2">
                                    <span className="mr-2">
                                        <button
                                            type="button"
                                            disabled={!gridData?.length}
                                            onClick={() => {
                                                generateExcel(gridData);
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Excel Export
                                        </button>
                                    </span>

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
                                                    <th style={{ minWidth: "70px" }}>Action</th>
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
                                                            <div className="d-flex justify-content-between">
                                                                {!item?.purchaseOrderNo && (
                                                                    <span
                                                                        className=""
                                                                        onClick={() => {
                                                                            if (!item?.attatchmentId) {
                                                                                return toast.warn("Please attach a file first");
                                                                            }
                                                                            getSingleData(`/procurement/CateringBill/GetAutoPurchaseOrderForMealById?MealConsumeCountId=${item?.mealConsumeCountId}`, (data) => {
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
                                                                                            objHeaderDTO: {
                                                                                                accountId: data?.accountId,
                                                                                                businessUnitId: data?.businessUnitId,
                                                                                                sbuId: data?.sbuid,
                                                                                                plantId: data?.plantId,
                                                                                                priceStructureId: 0,
                                                                                                plantName: data?.plantName,
                                                                                                warehouseId: data?.warehouseId,
                                                                                                warehouseName: data?.warehouseName,
                                                                                                supplyingWarehouseId: data?.warehouseId,
                                                                                                supplyingWarehouseName: data?.warehouseName,
                                                                                                purchaseOrganizationId: data?.purchaseOrganizationId,
                                                                                                businessPartnerId: data?.supplierId,
                                                                                                purchaseOrderDate: _todayDate(),
                                                                                                purchaseOrderTypeId: data?.orderType,
                                                                                                incotermsId: data?.incoterms,
                                                                                                currencyId: data?.currencyId,
                                                                                                supplierReference: "",
                                                                                                referenceDate: _todayDate(),
                                                                                                referenceTypeId: data?.referenceType,
                                                                                                returnDate: _todayDate(),
                                                                                                paymentTerms: 2,
                                                                                                creditPercent: 0,
                                                                                                cashOrAdvancePercent: 0,
                                                                                                otherTerms: "",
                                                                                                poValidityDate: poValidityDate,
                                                                                                lastShipmentDate: _todayDate(),
                                                                                                paymentDaysAfterDelivery: 14,
                                                                                                deliveryAddress: data?.deliveryAddress,
                                                                                                actionBy: profileData?.userId,
                                                                                                grossDiscount: 0,
                                                                                                freight: 0,
                                                                                                commission: 0,
                                                                                                othersCharge: 0,
                                                                                                transferBusinessUnitId: 0,
                                                                                                transferCostElementId: 0,
                                                                                                transferCostCenterId: 0,
                                                                                                profitCenterId: data?.profitCenterId,

                                                                                            },
                                                                                            objRowListDTO: [
                                                                                                {
                                                                                                    referenceId: 0,
                                                                                                    referenceCode: "",
                                                                                                    referenceQty: 0,
                                                                                                    itemId: data?.itemId,
                                                                                                    itemName: data?.itemName,
                                                                                                    uoMid: data?.baseUom,
                                                                                                    uoMname: data?.baseUomname,
                                                                                                    controllingUnitId: data?.controllingUnitId,
                                                                                                    bomId: 0,
                                                                                                    controllingUnitName: data?.controllingUnitName,
                                                                                                    costCenterId: data?.costCenterId,
                                                                                                    costCenterName: data?.costCenterName,
                                                                                                    costElementId: data?.costElementId,
                                                                                                    costElementName: data?.costElementName,
                                                                                                    purchaseDescription: "",
                                                                                                    orderQty: 1,
                                                                                                    basePrice: data?.numMealAmount,
                                                                                                    finalPrice: data?.numMealAmount,
                                                                                                    totalValue: data?.numMealAmount,
                                                                                                    actionBy: profileData?.userId,
                                                                                                    lastActionDateTime: _todayDate(),
                                                                                                    vatPercentage: 0,
                                                                                                    vatAmount: 0,
                                                                                                    baseVatAmount: 0,
                                                                                                    discount: 0,
                                                                                                    profitCenterId: data?.profitCenterId,
                                                                                                }
                                                                                            ],
                                                                                            objImageListDTO: [
                                                                                                {
                                                                                                    imageId: item?.attatchmentId || "",
                                                                                                }
                                                                                            ],
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
                                                                {item?.attatchmentId && (
                                                                    <span onClick={() => {
                                                                        dispatch(
                                                                            getDownlloadFileView_Action(
                                                                                item?.attatchmentId,
                                                                            )
                                                                        );
                                                                    }}>
                                                                        <IView styles={{ fontSize: "16px" }} />

                                                                    </span>)}
                                                                {item?.purchaseOrderNo && (
                                                                    <span
                                                                        className=""
                                                                        onClick={() => {
                                                                            if (!item?.attatchmentId) {
                                                                                return toast.warn("Please attach a file first");
                                                                            }
                                                                            getSingleData(`/procurement/PurchaseOrder/GetPurchaseOrderInformationByPOtoPrint_Id?PurchaseOrderId=${item?.purchaseOrderId}&OrderTypeId=5`, (data) => {
                                                                                console.log(data, "data");
                                                                                const payload = {
                                                                                    images: [
                                                                                        {
                                                                                            imageId: item?.attatchmentId || "",
                                                                                        }
                                                                                    ],
                                                                                    objHeader: {
                                                                                        serviceCode: "",
                                                                                        transactionDate: _todayDate(),
                                                                                        referenceId: data[0]?.objHeaderDTO?.purchaseOrderId || 0,
                                                                                        referenceCode: data[0]?.objHeaderDTO?.purchaseOrderNo || "",
                                                                                        accountId: profileData?.accountId,
                                                                                        accountName: profileData?.accountName,
                                                                                        businessUnitId: data[0]?.objHeaderDTO?.businessUnitId || 0,
                                                                                        businessUnitName: item?.controllingUnitName || "",
                                                                                        sbuid: item?.sbuid || 0,
                                                                                        sbuname: item?.controllingUnitName || "",
                                                                                        plantId: item?.plantId || 0,
                                                                                        plantName: item?.plantName || "",
                                                                                        warehouseId: data[0]?.objHeaderDTO?.warehouseId || 0,
                                                                                        warehouseName: data[0]?.objHeaderDTO?.warehouseName || "",
                                                                                        businessPartnerId: item?.supplierId || 0,
                                                                                        businessPartnerName: item?.supplierName || "",
                                                                                        strComments: "Auto SRR",
                                                                                        intActionBy: profileData?.userId,
                                                                                        // strDocumentId: item?.attatchmentId || "",
                                                                                        costCenterId: item?.costCenterId || 0,
                                                                                        costCenterCode: "",
                                                                                        costCenterName: item?.costCenterName || "",
                                                                                        projectId: 0,
                                                                                        projectCode: "",
                                                                                        projectName: "",
                                                                                        receivedById: 0,
                                                                                        receivedBy: "",
                                                                                        gateEntryNo: "",
                                                                                        challan: "123",
                                                                                        challanDateTime: _todayDate(),
                                                                                        vatChallan: "",
                                                                                        vatAmount: 0,
                                                                                        grossDiscount: 0,
                                                                                        freight: 0,
                                                                                        commission: 0,
                                                                                        shipmentId: 0,
                                                                                        othersCharge: 0,

                                                                                    },
                                                                                    objRow: [
                                                                                        {
                                                                                            itemId: data[0]?.objRowListDTO?.[0]?.itemId,
                                                                                            itemName: data[0]?.objRowListDTO?.[0]?.itemName,
                                                                                            uoMid: data[0]?.objRowListDTO?.[0]?.uomId,
                                                                                            uoMname: data[0]?.objRowListDTO?.[0]?.uomName,
                                                                                            transactionQuantity: data[0]?.objRowListDTO?.[0]?.orderQty,
                                                                                            poQuantity: data[0]?.objRowListDTO?.[0]?.orderQty,
                                                                                            previousQuantity: data[0]?.objRowListDTO?.[0]?.orderQty,
                                                                                            transactionValue: data[0]?.objRowListDTO?.[0]?.totalValue,
                                                                                            vatAmount: data[0]?.objRowListDTO?.[0]?.numVatAmount,
                                                                                            discount: data[0]?.objRowListDTO?.[0]?.numDiscount,
                                                                                            referenceId: data[0]?.objRowListDTO?.[0]?.referenceId,
                                                                                            profitCenterId: item?.profitCenterId,
                                                                                            profitCenterName: item?.profitCenterName,
                                                                                            costRevenueName: item?.costElementName,
                                                                                            costRevenueId: item?.costElementId,
                                                                                            elementName: item?.costElementName,
                                                                                            elementId: item?.costElementId

                                                                                        }
                                                                                    ]
                                                                                }

                                                                                onInventoryReceive("/wms/ServiceTransection/CreateServiceTransecionForReceive", payload, (res) => {
                                                                                    const updatePayload = [{
                                                                                        mealConsumeCountId: item?.mealConsumeCountId || 0,
                                                                                        inventoryTransactionId: res?.key,
                                                                                        inventoryTransactionCode: res?.code,

                                                                                    }]

                                                                                    onUpdateHandler(values, updatePayload, setFieldValue);
                                                                                }
                                                                                );

                                                                            });
                                                                        }}
                                                                    >
                                                                        <OverlayTrigger
                                                                            overlay={
                                                                                <Tooltip id="cs-icon">Inventory Receive</Tooltip>
                                                                            }
                                                                        >
                                                                            <i
                                                                                style={{ fontSize: "16px" }}
                                                                                class="fa fa-briefcase cursor-pointer"
                                                                                aria-hidden="true"
                                                                            ></i>
                                                                        </OverlayTrigger>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                ))}

                                                <tr>
                                                    <td colSpan="5" className="text-right text-bold">Total</td>
                                                    <td className="text-center text-bold">{gridData?.reduce((a, b) => a + (+b?.mealCount || 0), 0)}</td>
                                                    <td className="text-center text-bold">{gridData?.reduce((a, b) => a + (+b?.mealAmount || 0), 0)}</td>
                                                    <td colSpan="3"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div>
                                    <table id="excel-table" style={{ display: "none" }}>
                                        <thead>
                                            <tr>
                                                <th>SL</th>
                                                <th>Month</th>
                                                <th>Business Unit</th>
                                                <th>Supplier</th>
                                                <th>Meal Count</th>
                                                <th>Meal Amount</th>
                                                <th>Purchase Order No</th>
                                                <th>Inventory Transaction Code</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gridData?.map((item, index) => (
                                                <tr key={item.mealConsumeCountId}>
                                                    <td>{index + 1}</td>
                                                    <td>{getMonth(item?.monthId)}</td>
                                                    <td>{item?.controllingUnitName}</td>
                                                    <td>{item?.supplierName}</td>
                                                    <td>{item?.mealCount}</td>
                                                    <td>{item?.mealAmount}</td>
                                                    <td>{item?.purchaseOrderNo}</td>
                                                    <td>{item?.inventoryTransactionCode}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="4" className="text-right text-bold">Total</td>
                                                <td className="text-center text-bold">{gridData?.reduce((a, b) => a + (+b?.mealCount || 0), 0)}</td>
                                                <td className="text-center text-bold">{gridData?.reduce((a, b) => a + (+b?.mealAmount || 0), 0)}</td>
                                                <td colSpan="2"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                            </>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}