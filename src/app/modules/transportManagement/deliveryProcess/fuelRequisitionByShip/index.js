import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import QRCodeScanner from "../../../_helper/qrCodeScanner";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import ICustomTable from "../../../_helper/_customTable";

const initData = {
  shipmentId: "",
  shipmentCode: "",
  shippingPoint: "",
  vehicleNumber: "",
  driver: "",
  deliveryDate: "",
  //   packerName: "",
};

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});

export default function FuelRequisitionByShipment() {
  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const [reportData, getReportData, loading, setReportData] = useAxiosGet();
  const [, onComplete, loader] = useAxiosPost();
  const [shipmentId, setShipmentId] = useState(null);
  const [isQrCodeShow, setIsQRCodeSHow] = useState(false);
  const [actionType, setActionType] = useState("Manual");

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue }) => (
        <>
          {(loader || loading) && <Loading />}
          <IForm
            title="Fuel Requisition By Shipment"
            getProps={setObjprops}
            isHiddenBack
            isHiddenReset
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      (!reportData?.objHeader?.shipmentCostId && !shipmentId) ||
                      reportData?.objHeader?.fuelConfirmBy > 0
                      // (reportData?.objHeader?.fuelConfirmDate &&
                      //   reportData?.objHeader?.fuelConfirmBy)
                      // (reportData?.objHeader?.storConfirmDate &&
                      //   reportData?.objHeader?.storeCompleteBy)
                    }
                    onClick={() => {
                      if (reportData?.objHeader?.isLoaded) {
                        return toast.warn("Already Completed");
                      }
                      const header = {
                        transactionGroupId: 2,
                        transactionGroupName: "Issue Inventory",
                        transactionTypeId: 9,
                        transactionTypeName: "Issue For Cost Center",
                        referenceTypeId: 7,
                        referenceTypeName: "Inventory Request",
                        referenceId: reportData?.objHeader?.shipmentId,
                        referenceCode: reportData?.objHeader?.strShipmentCode,
                        accountId: 1,
                        accountName: "Akij Resource Limited",
                        businessUnitId: 4,
                        businessUnitName: "Akij Cement Company Ltd.",
                        sbuId: 58,
                        sbuName: "Akij Cement Company Ltd.",
                        plantId: 79,
                        plantName: "ACCL Narayanganj",
                        warehouseId: 142,
                        warehouseName: "ACCL Factory",
                        businessPartnerId: 0,
                        parsonnelId: userId,
                        costElementName: 270,
                        costCenterId: 78,
                        costCenterCode: "LD",
                        costCenterName: "Logistic & Distribution,LD,Akij Cement Company Ltd",
                        profitCenterId: 54,
                        profitCenterName: "Akij Cement Company Ltd.",
                        projectId: -1,
                        projectCode: "",
                        projectName: "",
                        comments: "",
                        actionBy: userId,
                        documentId: "",
                        gateEntryNo: "",
                        businessTransactionId: 0,
                        generalLedgerId: 0,
                        intCostElementId:270
                      };
                      const row = {
                        itemId: reportData?.objHeader?.itemId,
                        itemName: reportData?.objHeader?.itemName,
                        uoMid: reportData?.objHeader?.uoMid,
                        uoMname: reportData?.objHeader?.uoMname,
                        numTransactionQuantity: Math.ceil(
                          reportData?.objHeader?.totalFuelCostLtr
                        ),
                        monTransactionValue:
                          reportData?.objHeader?.fuelRate *
                          Math.ceil(reportData?.objHeader?.totalFuelCostLtr),
                        inventoryLocationId:
                          reportData?.objHeader?.inventoryLocationId,
                        inventoryLocationName:
                          reportData?.objHeader?.inventoryLocationName,
                        batchId: 0,
                        batchNumber: "",
                        inventoryStockTypeId:
                          reportData?.objHeader?.inventoryStockTypeId,
                        inventoryStockTypeName:
                          reportData?.objHeader?.inventoryStockTypeName,
                        strBinNo: reportData?.objHeader?.binNo,
                      };
                      onComplete(
                        `/wms/InventoryTransaction/CreateInvTransectionForIssue`,
                        {
                          objHeader: header,
                          objRow: [row],
                        },
                        () => {
                          resetForm(initData);
                          setReportData({});
                          setShipmentId(null);
                        },
                        true
                      );
                    }}
                  >
                    Complete
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="col-lg-4 mb-2 mt-5">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="actionType"
                      checked={actionType === "Manual"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setActionType("Manual");
                        resetForm(initData);
                        setShipmentId(null);
                        setReportData({});
                      }}
                    />
                    By Card Number
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="actionType"
                      checked={actionType === "Auto"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setActionType("Auto");
                        resetForm(initData);
                        setShipmentId(null);
                        setReportData({});
                      }}
                    />
                    By QR Code
                  </label>
                </div>
                {reportData?.objHeader?.isLoaded && (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                    className="text-danger"
                  >
                    Packer Completed
                  </p>
                )}
                <div className="form-group  global-form row">
                  {["Auto"].includes(actionType) ? (
                    <div className="col-lg-3">
                      <div style={{ display: "inline-block", width: "95%" }}>
                        <InputField
                          value={shipmentId}
                          label="Card Id"
                          name="shipmentId"
                          type="text"
                          disabled
                        />
                      </div>
                      <span
                        className="pl-1"
                        style={{ display: "inline-block" }}
                      >
                        <i
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsQRCodeSHow(true);
                          }}
                          style={{ color: "blue", cursor: "pointer" }}
                          class="fa fa-qrcode"
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>
                  ) : (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.shipmentCode}
                        label="Card Number"
                        name="shipmentCode"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("shipmentCode", e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            setFieldValue("shipmentCode", e.target.value);
                            getReportData(
                              // `/wms/Delivery/GetDeliveryPrintInfoManual?businessUnitId=${selectedBusinessUnit?.value}&shipmentCode=${e.target.value}`,
                              `/wms/Delivery/GetDeliveryFuelInfoByVehicleCardNumber?strCardNumber=${e.target.value}`,
                              (res) => {
                                setShipmentId(res?.objHeader?.shipmentCostId);
                                setFieldValue(
                                  "shippingPoint",
                                  res?.objHeader?.shipPointName || ""
                                );
                                setFieldValue(
                                  "vehicleNumber",
                                  res?.objHeader?.vehicleName || ""
                                );
                                setFieldValue(
                                  "driver",
                                  res?.objHeader?.driverName || ""
                                );
                                // setFieldValue(
                                //   "packerName",
                                //   res?.objHeader?.packerName || ""
                                // );
                                setFieldValue(
                                  "deliveryDate",
                                  _dateFormatter(
                                    res?.objHeader?.shipmentDate
                                  ) || ""
                                );
                              }
                            );
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="col-lg-3">
                    <InputField
                      value={values?.shippingPoint}
                      label="Shipping Point"
                      name="shippingPoint"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("shippingPoint", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.vehicleNumber}
                      label="Vehicle Number"
                      name="vehicleNumber"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("vehicleNumber", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.driver}
                      label="Driver"
                      name="driver"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("driver", e.target.value);
                      }}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <InputField
                      value={values?.packerName}
                      label="Packer Name"
                      name="packerName"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("packerName", e.target.value);
                      }}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.deliveryDate}
                      label="Delivery Date"
                      name="deliveryDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("deliveryDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </>

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
              <IViewModal
                show={isQrCodeShow}
                onHide={() => setIsQRCodeSHow(false)}
              >
                <QRCodeScanner
                  QrCodeScannerCB={(result) => {
                    setIsQRCodeSHow(false);
                    setShipmentId(result);
                    getReportData(
                      // `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${+result}`,
                      `/wms/Delivery/GetDeliveryPrintInfoByVehicleCardNumber?strCardNumber=${result}`,
                      (res) => {
                        setFieldValue(
                          "shippingPoint",
                          res?.objHeader?.shipPointName || ""
                        );
                        setFieldValue(
                          "vehicleNumber",
                          res?.objHeader?.strVehicleName || ""
                        );
                        setFieldValue(
                          "driver",
                          res?.objHeader?.driverName || ""
                        );
                        setFieldValue(
                          "packerName",
                          res?.objHeader?.packerName || ""
                        );
                        setFieldValue(
                          "deliveryDate",
                          _dateFormatter(res?.objHeader?.pricingDate) || ""
                        );
                      }
                    );
                  }}
                />
              </IViewModal>
              {reportData?.objHeader?.shipmentId ? (
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    {/* {Object?.keys(reportData?.objHeader)?.length > 0 && ( */}
                    <ICustomTable
                      ths={[
                        "SL",
                        "Shipment Code",
                        "Rate",
                        "Total Fuel Cost/Ltr",
                      ]}
                    >
                      {/* {reportData?.objRow?.map((item, index) => { */}
                      {/* return ( */}
                      <tr>
                        <td>{1}</td>
                        <td>{reportData?.objHeader?.strShipmentCode}</td>
                        <td>{reportData?.objHeader?.fuelRate}</td>
                        <td className="text-right">
                          {Math.ceil(reportData?.objHeader?.totalFuelCostLtr)}
                        </td>
                      </tr>
                      {/* ); */}
                      {/* })} */}
                      <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                        <td colSpan={3} className="text-right">
                          Total
                        </td>
                        <td>
                          {reportData?.objHeader?.fuelRate *
                            Math.ceil(reportData?.objHeader?.totalFuelCostLtr)}
                        </td>
                      </tr>
                    </ICustomTable>
                    {/* )} */}
                  </div>
                </div>
              ) : null}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
