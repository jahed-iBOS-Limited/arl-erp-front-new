import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import SearchAsyncSelect from "./../../../_helper/SearchAsyncSelect";
import IViewModal from "../../../_helper/_viewModal";
import QRCodeScanner from "../../../_helper/qrCodeScanner";

const initData = {
  firstWeightDate: _todayDate(),
  vehicaleNumber: "",
  itemName: "",
  firstWeight: "",
  firstWeightRemarks: "",
  entryCode: "",
  entryDate: "",
  customerName: "",
  clientName: "",
  challanNo: "",
  strCardNumber: "",
  businessUnit: "",
};
export default function FirstWeightCreateEdit({ weight }) {
  const [objProps, setObjprops] = useState({});
  const [, saveData, saveLoading] = useAxiosPost();
  const [gateEntryItemListId, setGateEntryItemListId] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [regDDL, getRegDDL, regDDLloader] = useAxiosGet();
  // eslint-disable-next-line no-unused-vars
  const [regData, getRegData, regDataLoader] = useAxiosGet();
  const [QRCodeScannerModal, setQRCodeScannerModal] = useState(false);
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit) {
      initData.businessUnit = selectedBusinessUnit;
    }
  }, [selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (!values?.entryCode?.value) return toast.warn("প্রবেশের কোড প্রয়োজন");
    if (!values?.firstWeightDate) return toast.warn("তারিখ প্রয়োজন");
    if (!values?.vehicaleNumber) return toast.warn("গাড়ির নাম্বার প্রয়োজন");
    if (!values?.firstWeight) return toast.warn("First Weight is required");
    if (!values?.businessUnit) {
      return toast.warn("অনুগ্রহ করে বিজনেস ইউনিট নির্বাচন করুন");
    }
    saveData(
      `/mes/WeightBridge/WeightBridgeCreateAndEditV2`,
      {
        intGateEntryItemListId: gateEntryItemListId,
        intPartnerId: 0,
        numWeight: +values?.firstWeight,
        strRemarks: values?.firstWeightRemarks || "",
        intActionBy: profileData?.userId,
      },
      cb,
      true
    );
  };

  const qurScanHandler = ({ setFieldValue, values }) => {
    document.getElementById("cardNoInput").disabled = true;
    getRegDDL(
      `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumber&BusinessUnitId=${values?.businessUnit?.value}&search=${values?.strCardNumber}`,
      (data) => {
        if (data.length > 0) {
          // console.log("data", data[0])
          // setFieldValue("entryCode", {
          //   value: data?.[0]?.value,
          //   label: data?.[0]?.label,
          // });
          // setFieldValue("entryCode", data[0]);
          getRegData(
            `/mes/MSIL/GetAllMSIL?PartName=FirstWeightEntryCodeDDL&BusinessUnitId=${values?.businessUnit?.value}&search=${data[0]?.label}`,
            (data) => {
              setFieldValue("entryCode", data[0]);
              // console.log("FirstWeightEntryCodeDDL", data)
              setGateEntryItemListId(data[0]?.intGateEntryItemListId);
              setFieldValue("vehicaleNumber", data[0]?.vehicleNo);
              setFieldValue("itemName", data[0]?.materialName);
              setFieldValue("entryDay", data[0]?.gateEntryDate?.split("T")[0]);
              setFieldValue("clientName", data[0]?.strSupplierName);
              setFieldValue("challanNo", data[0]?.invoiceNo);
            }
          );
        } else {
          toast.warn("কার্ড নাম্বার সঠিক নয়");
          setFieldValue("strCardNumber", "");
          document.getElementById("cardNoInput").disabled = false;
          document.getElementById("cardNoInput").focus();
        }
      }
    );
  };
  return (
    <IForm isHiddenBack title="First Weight" getProps={setObjprops}>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              document.getElementById("cardNoInput").disabled = false;
              document.getElementById("cardNoInput").focus();
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
                {(regDataLoader || regDDLloader || saveLoading) && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL}
                        value={values?.businessUnit}
                        label="বিজনেস ইউনিট"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("businessUnit", valueOption);
                            setFieldValue("entryCode", "");
                            setFieldValue("vehicaleNumber", "");
                            setFieldValue("itemName", "");
                            setFieldValue("customerName", "");
                            setFieldValue("clientName", "");
                            setFieldValue("challanNo", "");
                            setFieldValue("strCardNumber", "");
                            setGateEntryItemListId(0);
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          } else {
                            setFieldValue("businessUnit", "");
                            setFieldValue("entryCode", "");
                            setFieldValue("vehicaleNumber", "");
                            setFieldValue("itemName", "");
                            setFieldValue("customerName", "");
                            setFieldValue("clientName", "");
                            setFieldValue("challanNo", "");
                            setFieldValue("strCardNumber", "");
                            setGateEntryItemListId(0);
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
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              document.getElementById(
                                "cardNoInput"
                              ).disabled = true;
                              getRegDDL(
                                `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumber&BusinessUnitId=${values?.businessUnit?.value}&search=${values?.strCardNumber}`,
                                (data) => {
                                  if (data.length > 0) {
                                    // console.log("data", data[0])
                                    // setFieldValue("entryCode", {
                                    //   value: data?.[0]?.value,
                                    //   label: data?.[0]?.label,
                                    // });
                                    // setFieldValue("entryCode", data[0]);
                                    getRegData(
                                      `/mes/MSIL/GetAllMSIL?PartName=FirstWeightEntryCodeDDL&BusinessUnitId=${values?.businessUnit?.value}&search=${data[0]?.label}`,
                                      (data) => {
                                        setFieldValue("entryCode", data[0]);
                                        // console.log("FirstWeightEntryCodeDDL", data)
                                        setGateEntryItemListId(
                                          data[0]?.intGateEntryItemListId
                                        );
                                        setFieldValue(
                                          "vehicaleNumber",
                                          data[0]?.vehicleNo
                                        );
                                        setFieldValue(
                                          "itemName",
                                          data[0]?.materialName
                                        );
                                        setFieldValue(
                                          "entryDay",
                                          data[0]?.gateEntryDate?.split("T")[0]
                                        );
                                        setFieldValue(
                                          "clientName",
                                          data[0]?.strSupplierName
                                        );
                                        setFieldValue(
                                          "challanNo",
                                          data[0]?.invoiceNo
                                        );
                                      }
                                    );
                                  } else {
                                    toast.warn("কার্ড নাম্বার সঠিক নয়");
                                    setFieldValue("strCardNumber", "");
                                    document.getElementById(
                                      "cardNoInput"
                                    ).disabled = false;
                                    document
                                      .getElementById("cardNoInput")
                                      .focus();
                                  }
                                }
                              );
                            }
                          }}
                          onChange={(e) => {
                            setFieldValue("strCardNumber", e.target.value);
                          }}
                        />
                      </div>
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
                          resetForm(initData);
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
                    </div>
                    <div className="col-lg-3">
                      <label>রেজি. নং</label>
                      <SearchAsyncSelect
                        selectedValue={values?.entryCode}
                        handleChange={(valueOption) => {
                          // console.log("valueOption", valueOption)
                          if (valueOption) {
                            setGateEntryItemListId(
                              valueOption?.intGateEntryItemListId
                            );
                            setFieldValue("entryCode", valueOption);
                            setFieldValue(
                              "vehicaleNumber",
                              valueOption?.vehicleNo
                            );
                            setFieldValue(
                              "itemName",
                              valueOption?.materialName
                            );
                            setFieldValue(
                              "entryDay",
                              valueOption?.gateEntryDate?.split("T")[0]
                            );
                            setFieldValue(
                              "clientName",
                              valueOption?.strSupplierName
                            );
                            setFieldValue("challanNo", valueOption?.invoiceNo);
                          } else {
                            setGateEntryItemListId(0);
                            setFieldValue("entryCode", "");
                            setFieldValue("vehicaleNumber", "");
                            setFieldValue("itemName", "");
                            setFieldValue("entryDay", "");
                            setFieldValue("clientName", "");
                            setFieldValue("challanNo", "");
                            setFieldValue("vehicleType", "");
                            setFieldValue("strCardNumber", "");
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            // document.getElementById("cardNoInput").focus();
                          }
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return axios
                            .get(
                              `/mes/MSIL/GetAllMSIL?PartName=FirstWeightEntryCodeDDL&BusinessUnitId=${values?.businessUnit?.value}&search=${v}`
                            )
                            .then((res) => {
                              return res?.data;
                            })
                            .catch((err) => []);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWeightDate}
                        label="তারিখ"
                        name="firstWeightDate"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.vehicaleNumber}
                        label="গাড়ির নাম্বার"
                        name="vehicaleNumber"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.entryDay}
                        label="প্রবেশের তারিখ"
                        name="entryDate"
                        type="date"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.challanNo}
                        label="চালান নাম্বার"
                        name="challanNo"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.itemName}
                        label="পণ্যের নাম"
                        name="itemName"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWeight}
                        label="First Weight (KG)"
                        name="firstWeight"
                        type="number"
                        disabled
                      />
                    </div>
                    {values?.entryCode?.intClientTypeId ? (
                      <div className="col-lg-3">
                        <InputField
                          value={
                            values?.entryCode?.intClientTypeId === 1
                              ? "সাপ্লায়ার"
                              : values?.entryCode?.intClientTypeId === 2
                              ? "কাস্টমার"
                              : values?.entryCode?.intClientTypeId === 3
                              ? "Gate Pass"
                              : values?.entryCode?.intClientTypeId === 4
                              ? "Without Reference"
                              : ""
                          }
                          label="গাড়ির ধরন"
                          name="vehicleType"
                          type="text"
                          disabled
                        />
                      </div>
                    ) : null}
                    {values?.entryCode?.intClientTypeId === 1 ? (
                      <div className="col-lg-3">
                        <InputField
                          value={values?.clientName}
                          label="সাপ্লায়ারের নাম"
                          name="clientName"
                          type="text"
                          disabled
                        />
                      </div>
                    ) : null}

                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWeightRemarks}
                        label="Remarks"
                        name="firstWeightRemarks"
                        type="text"
                        disabled={false}
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        onClick={() => {
                          if (weight > 0) {
                            setFieldValue("firstWeight", parseInt(weight, 10));
                          }
                        }}
                        disabled={false}
                        type="button"
                        className="btn btn-primary mt-5"
                      >
                        Start Weightmen
                      </button>
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
      </>
    </IForm>
  );
}
