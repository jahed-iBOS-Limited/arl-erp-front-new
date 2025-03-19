import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import TextArea from "../../../_helper/TextArea";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import { trimString } from "../../../_helper/_trimString";
import BasicModal from "./../../../_helper/_BasicModal";
import IViewModal from "../../../_helper/_viewModal";
import QRCodeScanner from "../../../_helper/qrCodeScanner";

const initData = {
  date: _todayDate(),
  supplierName: "",
  nameOfDriver: "",
  mobileNo: "",
  vehicleNo: "",
  inTime: "",
  invoiceNo: "",
  shiftIncharge: "",
  itemName: "",
  uom: "",
  comment: "",
  clientType: "",
  vatChallanNo: "",
  strCardNumber: "",
  businessUnit: "",
  shipPoint: "",
  supCusNameFWR: "",
  itemNameFWR: "",
  addressFWR: "",
  quantityFWR: "",
  supplierItemQuantity: "",
  poNo: "",
  poValidityDate: "",
};
export default function GateEntryCreate() {
  const [QRCodeScannerModal, setQRCodeScannerModal] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, saveData, loading] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState(initData);
  const [
    shiftInchargeDDL,
    getShiftInchargeDDL,
    shiftInchargeDDLloader,
  ] = useAxiosGet();
  const [itemDDL, getItemDDL, itemDDLloader] = useAxiosGet();
  const [poList, getPoList, poLoader, setPoList] = useAxiosGet();
  const [isScalable, setIsScalable] = useState(true);
  const [supplierDDL, getSupplierDDLDDL, supplierDDLloader] = useAxiosGet();
  const [isShowModel, setIsShowModel] = useState(false);
  const [entryCode, setEntryCode] = useState("");
  const [vehicleDDL, getVehicleDDL, vehicleDDLloader] = useAxiosGet();

  // update feature
  const [shipPoint, getShipPoint, shipPointLoader] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit) {
      initData.businessUnit = selectedBusinessUnit;
    }
    if (location?.state?.intBusinessUnitId) {
      getShipPoint(
        `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${location?.state?.intBusinessUnitId}&AutoId=${profileData?.userId}`
      );
      getShiftInchargeDDL(
        `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${location?.state?.intBusinessUnitId}`
      );
      getItemDDL(
        `/mes/MSIL/GateEntryItemDDL?intBusinessUnitId=${location?.state?.intBusinessUnitId}`
      );
      getSupplierDDLDDL(
        `/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialSupplierDDL&BusinessUnitId=${location?.state?.intBusinessUnitId}`
      );
      getVehicleDDL(
        `/mes/MSIL/GetAllMSIL?PartName=VehicleListForGateEntry&BusinessUnitId=${location?.state?.intBusinessUnitId}`
      );
    } else {
      getShipPoint(
        `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${initData?.businessUnit?.value}&AutoId=${profileData?.userId}`,
        (data) => {
          initData.shipPoint = data[0];
        }
      );
      getShiftInchargeDDL(
        `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${initData?.businessUnit?.value}`
      );
      getItemDDL(
        `/mes/MSIL/GateEntryItemDDL?intBusinessUnitId=${selectedBusinessUnit?.value}`
      );
      getSupplierDDLDDL(
        `/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialSupplierDDL&BusinessUnitId=${initData?.businessUnit?.value}`
      );
      getVehicleDDL(
        `/mes/MSIL/GetAllMSIL?PartName=VehicleListForGateEntry&BusinessUnitId=${initData?.businessUnit?.value}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCustomer = (location) => {
    return +location?.state?.intClientTypeId === 2;
  };

  const hadScalable = (location) => {
    return location?.state?.isScalable;
  };

  const getFieldValue = (location) => {
    const value = +location?.state?.intSupplierId;
    const label = location?.state?.strSupplierName;
    return value && label ? { value, label } : "";
  };

  useEffect(() => {
    if (id) {
      setIsScalable(location?.state?.isScalable);
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        supplierName: isCustomer(location)
          ? ""
          : hadScalable(location)
          ? getFieldValue(location)
          : location.state?.strSupplierName,
        supCusNameFWR:
          location?.state?.intClientTypeId === 4
            ? location.state?.strSupplierName || ""
            : "",
        nameOfDriver: location?.state?.strDriverName,
        mobileNo: location?.state?.strDriverMobileNo,
        vehicleNo:
          location?.state?.intClientTypeId === 1 ||
          location?.state?.intClientTypeId === 4
            ? location?.state?.strTruckNumber
            : {
                value: location?.state?.intVehicleId,
                label: location?.state?.strTruckNumber,
              },
        inTime: location?.state?.tmInTime,
        invoiceNo: location?.state?.strInvoiceNumber,
        shiftIncharge: {
          value: location?.state?.intShiftIncharge,
          label: location?.state?.strShiftIncharge,
        },
        comment: location?.state?.strRemarks,
        itemName: {
          value: location?.state?.intItemId,
          label: location?.state?.strItemName,
        },
        itemNameFWR:
          location?.state?.intClientTypeId === 4
            ? location?.state?.strItemName || ""
            : "",
        gatePassItemName:
          location?.state?.intClientTypeId === 3
            ? location?.state?.strItemName
            : "",
        uom: location?.state?.strUoMname,
        clientType:
          location?.state?.intClientTypeId && location?.state?.strClientTypeName
            ? {
                value: location?.state?.intClientTypeId,
                label: location?.state?.strClientTypeName,
              }
            : "",
        vatChallanNo: location?.state?.strVatChallanNo || "",
        strCardNumber: location?.state?.strCardNumber || "",
        businessUnit: {
          value: location?.state?.intBusinessUnitId,
          label: location?.state?.strBusinessUnitName,
        },
        shipPoint: {
          value: location?.state?.shipPointId,
          label: location?.state?.shipPointName,
        },
        addressFWR:
          location?.state?.intClientTypeId === 4
            ? location?.state?.strAddress || ""
            : "",
        quantityFWR:
          location?.state?.intClientTypeId === 4
            ? location?.state?.numQuantity || ""
            : "",
        supplierItemQuantity:
          location?.state?.intClientTypeId === 1
            ? location?.state?.numQuantity || ""
            : "",
        poNo:
          location?.state?.poId && location?.state?.poNo
            ? {
                value: location?.state?.poId,
                label: location?.state?.poNo,
              }
            : "",
        poValidityDate: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location]);

  const saveHandler = (values, cb) => {
    if (values?.clientType?.value === 1 && !values?.supplierName) {
      return toast.warn("অনুগ্রহ করে সাপ্লায়ারের নাম নির্বাচন করুন");
    }
    if (isScalable && !values?.vehicleNo) {
      return toast.warn("অনুগ্রহ করে গাড়ীর নাম্বার  নির্বাচন করুন");
    }
    if (!values?.inTime) {
      return toast.warn("অনুগ্রহ করে প্রবেশের সময় নির্বাচন করুন");
    }
    if (
      (!values?.itemName?.value && values?.clientType?.value === 1) ||
      (!values?.gatePassItemName && values?.clientType?.value === 3)
    ) {
      return toast.warn("অনুগ্রহ করে পণ্যের নাম নির্বাচন করুন");
    }
    if (!values?.businessUnit) {
      return toast.warn("অনুগ্রহ করে বিজনেস ইউনিট নির্বাচন করুন");
    }
    if (!values?.shipPoint) {
      return toast.warn("অনুগ্রহ করে শিপ পয়েন্ট নির্বাচন করুন");
    }
    if (isPoVisible(values) && values?.poNo?.value) {
      return toast.warn("অনুগ্রহ পিও নির্বাচন করুন");
    }
    saveData(
      `/mes/MSIL/ItemGateEntryCreateAndEdit`,
      {
        intGateEntryItemListId: id || 0,
        intBusinessUnitId: values?.businessUnit?.value,
        dteDate: values?.date,
        intSupplierId:
          values?.clientType?.value === 1 && isScalable
            ? values?.supplierName?.value
            : 0,
        strSupplierName:
          values?.clientType?.value === 4
            ? values?.supCusNameFWR || ""
            : values?.clientType?.value === 1 && isScalable
            ? values?.supplierName?.label
            : values?.supplierName || "",
        intVehicleId:
          values?.clientType?.value === 1 || values?.clientType?.value === 4
            ? 0
            : values?.vehicleNo?.value,
        strTruckNumber:
          values?.clientType?.value === 1 || values?.clientType?.value === 4
            ? values?.vehicleNo || ""
            : values?.vehicleNo?.label || "",
        strDriverName: values?.nameOfDriver,
        strDriverMobileNo: values?.mobileNo,
        strInvoiceNumber: values?.invoiceNo,
        tmInTime: values?.inTime,
        intShiftIncharge: values?.shiftIncharge?.value,
        strShiftIncharge: values?.shiftIncharge?.label,
        strRemarks: values?.comment || "",
        intActionBy: profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true,
        intItemId: values?.itemName?.value || 0,
        strItemName:
          values?.clientType?.value === 4
            ? values?.itemNameFWR || ""
            : values?.clientType?.value === 1
            ? values?.itemName?.label
            : values?.clientType?.value === 3
            ? values?.gatePassItemName
            : "",
        intUoMid: 0,
        strUoMname: values?.uom || "",
        isScalable: isScalable,
        intClientTypeId: values?.clientType?.value,
        strClientTypeName: values?.clientType?.label,
        strVatChallanNo: values?.vatChallanNo || "",
        strCardNumber: trimString(values?.strCardNumber) || null,
        shipPointId: values?.shipPoint?.value || 0,
        shipPointName: values?.shipPoint?.label || "",
        strAddress:
          values?.clientType?.value === 4 ? values?.addressFWR || "" : "",
        numQuantity:
          values?.clientType?.value === 4
            ? +values?.quantityFWR || 0
            : values?.clientType?.value === 1
            ? +values?.supplierItemQuantity || 0
            : 0,
        poId: values?.poNo?.value || 0,
        poNo: values?.poNo?.label || "",
      },
      id
        ? ""
        : (data) => {
            setEntryCode(data?.code);
            cb();
            setIsShowModel(true);
            document.getElementById("cardNoInput").disabled = false;
          },
      true
    );
  };

  const isPoVisible = (values) => {
    return (
      [188, 189].includes(values?.businessUnit?.value) &&
      isScalable &&
      values?.clientType?.value === 1
    );
  };
  console.log(location.state);

  const qurScanHandler = ({ setFieldValue, values }) => {
    document.getElementById("cardNoInput").disabled = true;
  };

  console.log(shipPoint);
  console.log(initData);
  return (
    <IForm title="Create Item Gate Entry" getProps={setObjprops}>
      {(loading ||
        vehicleDDLloader ||
        supplierDDLloader ||
        shiftInchargeDDLloader ||
        itemDDLloader ||
        poLoader ||
        shipPointLoader) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={
            id
              ? modifyData
              : {
                  ...initData,
                  shipPoint: {
                    value: location?.state?.shipPoint?.value,
                    label: location?.state?.shipPoint?.label,
                  },
                  clientType:
                    selectedBusinessUnit.value === 171
                      ? { value: 1, label: "Supplier" }
                      : { value: 2, label: "Customer" },
                }
          }
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              document.getElementById("cardNoInput").focus();
              resetForm(initData);
              getShiftInchargeDDL(
                `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${initData?.businessUnit?.value}`
              );
              getItemDDL(
                `/mes/MSIL/GateEntryItemDDL?intBusinessUnitId=${selectedBusinessUnit?.value}`
              );
              getSupplierDDLDDL(
                `/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialSupplierDDL&BusinessUnitId=${initData?.businessUnit?.value}`
              );
              getVehicleDDL(
                `/mes/MSIL/GetAllMSIL?PartName=VehicleListForGateEntry&BusinessUnitId=${initData?.businessUnit?.value}`
              );
              getShipPoint(
                `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${initData?.businessUnit?.value}&AutoId=${profileData?.userId}`
              );
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
              <Form className="form form-label-right">
                {false && <Loading />}
                <>
                  <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="isScalable"
                        checked={isScalable === true}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(valueOption) => {
                          setIsScalable(true);
                          setFieldValue("supplierName", "");
                          if (!values?.strCardNumber) {
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          }
                        }}
                      />
                      ওজন হবে
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="isScalable"
                        checked={isScalable === false}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setIsScalable(false);
                          setFieldValue("supplierName", "");
                          if (!values?.strCardNumber) {
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          }
                        }}
                      />
                      ওজন হবে না
                    </label>
                  </div>
                </>
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL}
                        value={values?.businessUnit}
                        label="বিজনেস ইউনিট"
                        isDisabled={id}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("businessUnit", valueOption);
                            setFieldValue("strCardNumber", "");
                            setFieldValue("vehicleNo", "");
                            setFieldValue("supplierName", "");
                            setFieldValue("clientType", "");
                            
                            getShipPoint(
                              `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${valueOption?.value}&AutoId=${profileData?.userId}`,
                              (data) => {
                                setFieldValue("shipPoint", data[0]);
                              }
                            );
                            getShiftInchargeDDL(
                              `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${valueOption?.value}`
                            );
                            getItemDDL(
                              `/mes/MSIL/GateEntryItemDDL?intBusinessUnitId=${valueOption?.value}`
                            );
                            getSupplierDDLDDL(
                              `/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialSupplierDDL&BusinessUnitId=${valueOption?.value}`
                            );
                            getVehicleDDL(
                              `/mes/MSIL/GetAllMSIL?PartName=VehicleListForGateEntry&BusinessUnitId=${valueOption?.value}`
                            );
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          } else {
                            setFieldValue("businessUnit", "");
                            getShiftInchargeDDL(
                              `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}`
                            );
                            getItemDDL(
                              `/mes/MSIL/GateEntryItemDDL?intBusinessUnitId=${selectedBusinessUnit?.value}`
                            );
                            getSupplierDDLDDL(
                              `/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialSupplierDDL&BusinessUnitId=${selectedBusinessUnit?.value}`
                            );
                            getVehicleDDL(
                              `/mes/MSIL/GetAllMSIL?PartName=VehicleListForGateEntry&BusinessUnitId=${selectedBusinessUnit?.value}`
                            );
                            setFieldValue("shiftIncharge", "");
                            setFieldValue("supplierName", "");
                            setFieldValue("vehicleNo", "");
                            setFieldValue("itemName", "");
                            setFieldValue("shipPoint", "");
                            setFieldValue("strCardNumber", "");
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={shipPoint}
                        value={values?.shipPoint}
                        label="শিপ পয়েন্ট"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("shipPoint", valueOption);
                            setFieldValue("strCardNumber", "");
                            document.getElementById("cardNoInput").focus();
                          } else {
                            setFieldValue("shipPoint", "");
                            setFieldValue("strCardNumber", "");
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          }
                        }}
                      />
                    </div>
                    <div
                      className="col-lg-3 d-flex"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          cursor: "pointer",
                          color: "blue",
                          zIndex: "1",
                        }}
                        onClick={() => {
                          setQRCodeScannerModal(true);
                        }}
                      >
                        QR Code <i class="fa fa-qrcode" aria-hidden="true"></i>
                      </div>

                      <div style={{ width: "inherit" }}>
                        <InputField
                          id="cardNoInput"
                          autoFocus
                          value={values?.strCardNumber}
                          label="কার্ড নাম্বার"
                          name="strCardNumber"
                          type="text"
                          disabled={id ? true : false}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              document.getElementById(
                                "cardNoInput"
                              ).disabled = true;
                            } else {
                              document.getElementById(
                                "cardNoInput"
                              ).disabled = false;
                            }
                          }}
                          onChange={(e) => {
                            setFieldValue("strCardNumber", e.target.value);
                          }}
                        />
                      </div>
                      {!id && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "5px",
                            cursor: "pointer",
                            marginTop: "20px",
                          }}
                          onClick={() => {
                            setFieldValue("strCardNumber", "");
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          }}
                        >
                          <i
                            style={{
                              color: "blue",
                            }}
                            className="fa fa-refresh"
                            aria-hidden="true"
                          ></i>
                        </span>
                      )}
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.date}
                        label="তারিখ"
                        name="date"
                        type="date"
                        disabled={id}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="clientType"
                        options={[
                          { value: 1, label: "Supplier" },
                          { value: 2, label: "Customer" },
                          { value: 3, label: "Gate Pass" },
                          { value: 4, label: "Without Reference" },
                        ]}
                        value={values?.clientType}
                        label="সাপ্লায়ার/কাস্টমার"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("clientType", valueOption);
                            setFieldValue("supplierName", "");
                            setFieldValue("vehicleNo", "");
                            setFieldValue("itemName", "");
                            setFieldValue("supCusNameFWR", "");
                            setFieldValue("itemNameFWR", "");
                          } else {
                            setFieldValue("clientType", "");
                            setFieldValue("vehicleNo", "");
                            setFieldValue("supCusNameFWR", "");
                            setFieldValue("itemNameFWR", "");
                          }
                        }}
                      />
                    </div>
                    {isScalable && values?.clientType?.value === 1 ? (
                      <div className="col-lg-3">
                        <NewSelect
                          name="supplierName"
                          options={supplierDDL || []}
                          value={values?.supplierName}
                          label="সাপ্লায়ারের নাম"
                          onChange={(valueOption) => {
                            setFieldValue("supplierName", valueOption || "");
                            setFieldValue("poNo", "");
                            setFieldValue("poValidityDate", "");
                            setPoList([]);
                            if (isPoVisible(values) && valueOption) {
                              getPoList(
                                `/procurement/PurchaseOrder/PoNoBySupplierId?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&SupplierId=${valueOption?.value}`,
                                (res) => {
                                  const result = res.map((item) => ({
                                    ...item,
                                    value: item?.intPurchaseOrderId,
                                    label: item?.intPurchaseOrderNumber,
                                  }));
                                  setPoList(result);
                                }
                              );
                            }
                          }}
                        />
                      </div>
                    ) : null}
                    {values?.clientType?.value === 4 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.supCusNameFWR}
                          label="সাপ্লায়ার/কাস্টমার নাম"
                          name="supCusNameFWR"
                          type="text"
                        />
                      </div>
                    ) : null}
                    {values?.clientType?.value === 4 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.addressFWR}
                          label="এড্রেস"
                          name="addressFWR"
                          type="text"
                        />
                      </div>
                    ) : null}
                    {!isScalable && values?.clientType?.value === 1 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.supplierName}
                          label="সাপ্লায়ারের নাম"
                          name="supplierName"
                          type="text"
                        />
                      </div>
                    ) : null}
                    {values?.clientType?.value === 2 ||
                    values?.clientType?.value === 3 ? (
                      <div className="col-lg-3">
                        <NewSelect
                          name="vehicleNo"
                          options={vehicleDDL || []}
                          value={values?.vehicleNo}
                          label="গাড়ীর নাম্বার"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue("vehicleNo", valueOption);
                              setFieldValue(
                                "nameOfDriver",
                                valueOption?.strDriverName || ""
                              );
                              setFieldValue(
                                "mobileNo",
                                valueOption?.strDriverContact || ""
                              );
                            } else {
                              setFieldValue("vehicleNo", "");
                              setFieldValue("nameOfDriver", "");
                              setFieldValue("mobileNo", "");
                            }
                          }}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.nameOfDriver}
                        label="ড্রাইভারের নাম"
                        name="nameOfDriver"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.mobileNo}
                        label="ড্রাইভারের মোবাইল নাম্বার"
                        name="mobileNo"
                        type="text"
                      />
                    </div>
                    {values?.clientType?.value === 1 ||
                    values?.clientType?.value === 4 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.vehicleNo}
                          label="গাড়ীর নাম্বার"
                          name="vehicleNo"
                          type="text"
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.inTime}
                        label="প্রবেশের সময়"
                        name="inTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.invoiceNo}
                        label="চালান নাম্বার"
                        name="invoiceNo"
                        type="text"
                      />
                    </div>
                    {selectedBusinessUnit?.value === 4 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.vatChallanNo}
                          label="ভ্যাট চালান নাম্বার"
                          name="vatChallanNo"
                          type="text"
                        />
                      </div>
                    ) : null}

                    {isPoVisible(values) && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="poNo"
                            options={poList || []}
                            value={values?.poNo}
                            label="পিও নাম্বার"
                            onChange={(valueOption) => {
                              setFieldValue("poNo", "");
                              setFieldValue("poValidityDate", "");
                              //   if (valueOption) {
                              //     const currentDate = new Date();
                              //     const parsedValidityDate = new Date(valueOption.validityDate);

                              //     // Check if the parsed date is valid
                              //     if (isNaN(parsedValidityDate.getTime())) {
                              //         return toast.warn("Invalid Po Validity Date!");
                              //     } else if (parsedValidityDate < currentDate) {
                              //         return toast.warn("Po validity date has ended");
                              //     } else {
                              //         setFieldValue("poNo", valueOption.poNo);
                              //         setFieldValue("poValidityDate", _dateFormatter(valueOption.validityDate));
                              //     }
                              // }
                              if (valueOption) {
                                const currentDate = new Date();
                                const parsedValidityDate = new Date(
                                  valueOption.validityDate
                                );

                                // Zero out the time components
                                const currentDateOnly = new Date(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth(),
                                  currentDate.getDate()
                                );
                                const parsedValidityDateOnly = new Date(
                                  parsedValidityDate.getFullYear(),
                                  parsedValidityDate.getMonth(),
                                  parsedValidityDate.getDate()
                                );

                                // Check if the parsed date is valid
                                if (isNaN(parsedValidityDateOnly.getTime())) {
                                  return toast.warn(
                                    "Invalid Po Validity Date!"
                                  );
                                } else if (
                                  parsedValidityDateOnly < currentDateOnly
                                ) {
                                  return toast.warn(
                                    "Po validity date has ended"
                                  );
                                } else {
                                  setFieldValue("poNo", valueOption.poNo);
                                  setFieldValue(
                                    "poValidityDate",
                                    _dateFormatter(valueOption.validityDate)
                                  );
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            disabled
                            value={values?.poValidityDate}
                            label="পিও এর মেয়াদ"
                            name="poValidityDate"
                            type="date"
                            onChange={(e) => {
                              if (+e.target.value < 0) return;
                              setFieldValue("poValidityDate", e.target.value);
                            }}
                          />
                        </div>
                      </>
                    )}

                    {values?.clientType?.value === 1 ? (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="itemName"
                            options={itemDDL || []}
                            value={values?.itemName}
                            label="পণ্যের নাম"
                            onChange={(valueOption) => {
                              setFieldValue("itemName", valueOption);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.supplierItemQuantity}
                            label="কোয়ান্টিটি"
                            name="supplierItemQuantity"
                            type="number"
                            onChange={(e) => {
                              if (+e.target.value < 0) return;
                              setFieldValue(
                                "supplierItemQuantity",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      </>
                    ) : values?.clientType?.value === 3 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.gatePassItemName}
                          label="পণ্যের নাম"
                          name="gatePassItemName"
                          type="text"
                        />
                      </div>
                    ) : null}
                    {values?.clientType?.value === 4 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.itemNameFWR}
                          label="পণ্যের নাম"
                          name="itemNameFWR"
                          type="text"
                        />
                      </div>
                    ) : null}
                    {values?.clientType?.value === 4 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.quantityFWR}
                          label="কোয়ান্টিটি"
                          name="quantityFWR"
                          type="number"
                          onChange={(e) => {
                            if (+e.target.value < 0) return;
                            setFieldValue("quantityFWR", e.target.value);
                          }}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <NewSelect
                        name="shiftIncharge"
                        options={shiftInchargeDDL || []}
                        value={values?.shiftIncharge}
                        label="শিফট ইনচার্জ"
                        onChange={(valueOption) => {
                          setFieldValue("shiftIncharge", valueOption);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>মন্তব্য</label>
                      <TextArea
                        value={values?.comment}
                        name="comment"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                {QRCodeScannerModal && (
                  <>
                    <IViewModal
                      show={QRCodeScannerModal}
                      onHide={() => {
                        setQRCodeScannerModal(false);
                      }}
                    >
                      <QRCodeScanner
                        QrCodeScannerCB={(result) => {
                          setFieldValue("strCardNumber", result);
                          setQRCodeScannerModal(false);
                          qurScanHandler({
                            setFieldValue,
                            values: {
                              ...values,
                              strCardNumber: result,
                            },
                          });
                        }}
                      />
                    </IViewModal>
                  </>
                )}
                <button
                  type="button"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  // onSubmit={() => handleSubmit()}
                  onClick={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
        <div>
          <BasicModal
            open={isShowModel}
            handleOpen={() => setIsShowModel(true)}
            handleClose={() => {
              setIsShowModel(false);
              setTimeout(() => {
                document.getElementById("cardNoInput").focus();
              }, 100);
            }}
            myStyle={{ width: 400 }}
            hideBackdrop={true}
          >
            <h1 className="text-center">রেজি. নং : {entryCode}</h1>
          </BasicModal>
        </div>
      </>
    </IForm>
  );
}
