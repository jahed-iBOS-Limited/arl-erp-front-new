/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import SearchAsyncSelect from "./../../../_helper/SearchAsyncSelect";
import Report from "./report";
import ShippingNoteView from "./shippingNoteView";

const initData = {
  secondWeightDate: _todayDate(),
  vehcileNumber: "",
  itemName: "",
  secondWeight: "",
  netWeight: "",
  firstWeightDate: "",
  firstWeight: "",
  remarks: "",
  entryCode: "",
  entryDate: "",
  supplierName: "",
  customerName: "",
  challanNo: "",
  strCardNumber: "",
  businessUnit: "",
};

export default function SecondWeightCreateEdit({ weight }) {
  const [objProps, setObjprops] = useState({});
  const [, saveData, saveLoading] = useAxiosPost();
  const [vehicaleDDL, getVehicleDDL, vehicleLoading] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowShippingNoteView, setIsShowShippingNoteView] = useState(false);
  const [weightmentId, setWeightmentId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [allDataForEntry, getAllDataForEntry, getAllDataLoader] = useAxiosGet();
  const [customerDDL, getCustomerDDL, , setCustomerDDL] = useAxiosGet();
  const [gateEntryItemListId, setGateEntryItemListId] = useState(0);
  const [
    reportData,
    getReportData,
    reportDataLoader,
    setReportData,
  ] = useAxiosGet();

  // eslint-disable-next-line no-unused-vars
  const [regDDL, getRegDDL, regDDLloader] = useAxiosGet();
  // eslint-disable-next-line no-unused-vars
  const [regData, getRegData, regDataLoader] = useAxiosGet();

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
    getVehicleDDL(
      `/mes/WeightBridge/GetAllWeightBridgeVehicleDDL?PartName=LastWeight&BusinessUnitId=${initData?.businessUnit?.value}&WeightementId=0`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    if (!values?.entryCode?.value) return toast.warn("প্রবেশের কোড প্রয়োজন");
    if (!values?.secondWeightDate) return toast.warn("তারিখ প্রয়োজন");
    if (!values?.vehcileNumber) {
      return toast.warn("অনুগ্রহ করে গাড়ির নাম্বার নির্বাচন করুন");
    }
    if (!values?.secondWeight) return toast.warn("Second Weight is required");
    if (
      values?.entryCode?.intClientTypeId === 1 &&
      !values?.supplierName?.value
    ) {
      return toast.warn("সাপ্লায়ারের নাম প্রয়োজন");
    }
    if (
      values?.entryCode?.intClientTypeId === 2 &&
      values?.entryCode?.isShipmentRequired &&
      !customerDDL?.length
    ) {
      return toast.warn("শিপমেন্ট সম্পূর্ন করুন।");
    }
    if (
      values?.entryCode?.intClientTypeId === 2 &&
      !values?.customerName?.value &&
      values?.entryCode?.isCustomerSelectionRequired
    ) {
      return toast.warn("কাস্টমারের নাম প্রয়োজন");
    }
    if (!values?.businessUnit) {
      return toast.warn("অনুগ্রহ করে বিজনেস ইউনিট নির্বাচন করুন");
    }
    saveData(
      `/mes/WeightBridge/WeightBridgeCreateAndEditV2`,
      {
        intGateEntryItemListId: gateEntryItemListId,
        intPartnerId:
          values?.entryCode?.intClientTypeId === 1
            ? values?.supplierName?.value
            : values?.customerName?.value || 0,
        numWeight: +values?.secondWeight,
        strRemarks: values?.remarks || "",
        intActionBy: profileData?.userId,
      },

      (data) => {
        cb();
        setWeightmentId(data?.key);
        setIsShowModal(true);
      },
      true
    );
  };

  return (
    <IForm isHiddenBack title="Second Weight" getProps={setObjprops}>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setReportData([]);
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
                {(vehicleLoading ||
                  saveLoading ||
                  regDataLoader ||
                  regDDLloader ||
                  reportDataLoader ||
                  getAllDataLoader) && <Loading />}
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
                            getVehicleDDL(
                              `/mes/WeightBridge/GetAllWeightBridgeVehicleDDL?PartName=LastWeight&BusinessUnitId=${valueOption?.value}&WeightementId=0`
                            );
                            setFieldValue("entryCode", "");
                            setFieldValue("vehcileNumber", "");
                            setFieldValue("supplierName", "");
                            setFieldValue("customerName", "");
                            setFieldValue("firstWeight", "");
                            setFieldValue("strCardNumber", "");
                            setFieldValue("secondWeight", "");
                            setFieldValue("remarks", "");
                            setGateEntryItemListId(0);
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                            document.getElementById("cardNoInput").focus();
                          } else {
                            getVehicleDDL(
                              `/mes/WeightBridge/GetAllWeightBridgeVehicleDDL?PartName=LastWeight&BusinessUnitId=${selectedBusinessUnit?.value}&WeightementId=0`
                            );
                            setReportData([]);
                            setFieldValue("businessUnit", "");
                            setFieldValue("entryCode", "");
                            setFieldValue("vehcileNumber", "");
                            setFieldValue("supplierName", "");
                            setFieldValue("customerName", "");
                            setFieldValue("firstWeight", "");
                            setFieldValue("secondWeight", "");
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
                    <div className="col-lg-3 d-flex">
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
                                  if (data?.length > 0) {
                                    getRegData(
                                      `/mes/MSIL/GetAllMSIL?PartName=SecondWeightEntryCodeDDL&BusinessUnitId=${values?.businessUnit?.value}&search=${data?.[0]?.label}`,
                                      (data) => {
                                        if (data.length > 0) {
                                          setFieldValue("entryCode", data[0]);
                                          setGateEntryItemListId(
                                            data[0]?.intGateEntryItemListId
                                          );
                                          setFieldValue(
                                            "vehcileNumber",
                                            data[0]?.vehicleNo
                                          );
                                          setFieldValue(
                                            "itemName",
                                            data[0]?.materialName
                                          );
                                          setFieldValue(
                                            "entryDay",
                                            data[0]?.gateEntryDate?.split(
                                              "T"
                                            )[0]
                                          );
                                          setFieldValue(
                                            "clientName",
                                            data[0]?.strSupplierName
                                          );
                                          setFieldValue(
                                            "challanNo",
                                            data[0]?.invoiceNo
                                          );
                                          setFieldValue("supplierName", {
                                            value: data[0]?.intSupplierId,
                                            label: data[0]?.strSupplierName,
                                          });
                                          getCustomerDDL(
                                            `/mes/MSIL/GetAllMSIL?PartName=CustomerWithEntryCodeDDL&AutoId=${data[0]?.intVeichleEntryId}`,
                                            (data) => {}
                                          );
                                          getAllDataForEntry(
                                            `/mes/MSIL/GetAllMSIL?PartName=CurrentFirstWeightInfo&AutoId=${data[0]?.intGateEntryItemListId}`,
                                            (data) => {
                                              setFieldValue(
                                                "firstWeightDate",
                                                data[0]?.firstWeightDateTime?.split(
                                                  "T"
                                                )[0]
                                              );
                                              setFieldValue(
                                                "firstWeight",
                                                data[0]?.firstWeight
                                              );
                                              getReportData(
                                                `/mes/MSIL/GetAllMSIL?PartName=FirstWeightSecondWeightInfoForPDF&AutoId=${data[0]?.intWeightmentId}`
                                              );
                                            }
                                          );
                                        }
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
                          setReportData([]);
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
                          console.log("valueOption", valueOption);
                          if (valueOption) {
                            setGateEntryItemListId(
                              valueOption?.intGateEntryItemListId
                            );
                            setFieldValue("entryCode", valueOption);
                            setFieldValue("itemName", valueOption.materialName);
                            setFieldValue(
                              "entryDay",
                              valueOption.gateEntryDate?.split("T")[0]
                            );
                            setFieldValue(
                              "vehcileNumber",
                              valueOption.vehicleNo
                            );
                            setFieldValue("challanNo", valueOption.invoiceNo);
                            setFieldValue("supplierName", {
                              value: valueOption?.intSupplierId,
                              label: valueOption?.strSupplierName,
                            });
                            getCustomerDDL(
                              `/mes/MSIL/GetAllMSIL?PartName=CustomerWithEntryCodeDDL&AutoId=${valueOption?.intVeichleEntryId}`
                            );
                            getAllDataForEntry(
                              `/mes/MSIL/GetAllMSIL?PartName=CurrentFirstWeightInfo&AutoId=${valueOption?.intGateEntryItemListId}`,
                              (data) => {
                                setFieldValue(
                                  "firstWeightDate",
                                  data[0]?.firstWeightDateTime?.split("T")[0]
                                );
                                setFieldValue(
                                  "firstWeight",
                                  data[0]?.firstWeight
                                );
                                getReportData(
                                  `/mes/MSIL/GetAllMSIL?PartName=FirstWeightSecondWeightInfoForPDF&AutoId=${data[0]?.intWeightmentId}`
                                );
                              }
                            );
                          } else {
                            setGateEntryItemListId(0);
                            setCustomerDDL([]);
                            setFieldValue("entryCode", "");
                            setFieldValue("vehcileNumber", "");
                            setFieldValue("itemName", "");
                            setFieldValue("entryDay", "");
                            setFieldValue("challanNo", "");
                            setFieldValue("firstWeightDate", "");
                            setFieldValue("firstWeight", "");
                            setFieldValue("customerName", "");
                            setFieldValue("supplierName", "");
                            setFieldValue("vehicleType", "");
                            setFieldValue("strCardNumber", "");
                            document.getElementById(
                              "cardNoInput"
                            ).disabled = false;
                          }
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return axios
                            .get(
                              `/mes/MSIL/GetAllMSIL?PartName=SecondWeightEntryCodeDDL&BusinessUnitId=${values?.businessUnit?.value}&search=${v}`
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
                        value={values?.secondWeightDate}
                        label="তারিখ"
                        name="secondWeightDate"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        name="vehcileNumber"
                        options={vehicaleDDL}
                        value={values?.vehcileNumber}
                        label="গাড়ির নাম্বার"
                        disabled
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
                        value={values?.firstWeightDate}
                        label="First Weight Date"
                        name="firstWeightDate"
                        type="date"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWeight}
                        label="First Weight"
                        name="firstWeight"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.secondWeight}
                        label="Second Weight"
                        name="secondWeight"
                        type="number"
                        disabled
                        onChange={(e) => {
                          if (+e.target.value < 0) return;
                          setFieldValue("secondWeight", e.target.value);
                          let netWeight =
                            values?.entryCode?.intClientTypeId === 1
                              ? +values?.firstWeight - +e.target.value
                              : +e.target.value - +values?.firstWeight;
                          setFieldValue("netWeight", Math.abs(netWeight));
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.netWeight}
                        label="Net Weight"
                        name="netWeight"
                        type="text"
                        disabled
                      />
                    </div>
                    {console.log("values?.entryCode", values?.entryCode)}
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
                        <NewSelect
                          value={values?.supplierName}
                          label="সাপ্লায়ারের নাম"
                          name="supplierName"
                          isDisabled={true}
                        />
                      </div>
                    ) : null}
                    {values?.entryCode?.intClientTypeId === 2 ? (
                      <div className="col-lg-3">
                        <NewSelect
                          name="customerName"
                          options={customerDDL}
                          value={values?.customerName}
                          label="কাস্টমারের নাম"
                          onChange={(valueOption) => {
                            setFieldValue("customerName", valueOption);
                          }}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Remarks"
                        name="remarks"
                        type="text"
                      />
                    </div>
                    <div className="d-flex">
                      <button
                        onClick={() => {
                          if (!values?.entryCode?.value)
                            return toast.warn(
                              "অনুগ্রহ করে প্রবেশের কোড নির্বাচন করুন"
                            );
                          if (weight > 0) {
                            let newWeight = parseInt(weight, 10);
                            setFieldValue("secondWeight", newWeight);
                            let netWeight =
                              values?.entryCode?.intClientTypeId === 1
                                ? +values?.firstWeight - +newWeight
                                : +newWeight - +values?.firstWeight;
                            setFieldValue("netWeight", Math.abs(netWeight));
                          }
                        }}
                        disabled={false}
                        type="button"
                        className="btn btn-primary mt-5"
                      >
                        Start Weightmen
                      </button>
                      <div>
                        <button
                          type="button"
                          disabled={
                            !values?.entryCode && !values?.strCardNumber
                          }
                          className="btn btn-primary mt-5 ml-3"
                          onClick={() => {
                            setIsShowShippingNoteView(true);
                          }}
                        >
                          Shipping Note View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-12">
                      <h5>Shipment Information</h5>
                    </div>
                    <div className="weight-report-details ml-4">
                      <div className="table-responsive">
                        <table className="weight-report-details-left-table">
                          <tr>
                            <td
                              style={{
                                minWidth: "125px",
                                verticalAlign: "text-top",
                              }}
                              class="bold"
                            >
                              Date
                            </td>
                            <td style={{ verticalAlign: "text-top" }}>: </td>
                            <td
                              style={{
                                width: "300px",
                                verticalAlign: "text-top",
                              }}
                            >
                              {_dateFormatter(
                                reportData[0]?.printDate?.split("T")
                              )}
                            </td>
                            <td
                              style={{ verticalAlign: "text-top" }}
                              class="bold"
                            >
                              Delivery Challan No
                            </td>
                            <td style={{ verticalAlign: "text-top" }}>: </td>
                            <td>{reportData[0]?.challanNo}</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                minWidth: "125px",
                                verticalAlign: "text-top",
                              }}
                              class="bold"
                            >
                              Client Code
                            </td>
                            <td style={{ verticalAlign: "text-top" }}>: </td>
                            <td style={{ width: "300px" }}>
                              {reportData[0]?.partnerCode}
                            </td>

                            <td class="bold">Client Type</td>
                            <td>: </td>
                            <td>{reportData[0]?.clientType}</td>
                          </tr>

                          <tr>
                            <td
                              class="bold"
                              style={{
                                verticalAlign: "text-top",
                                minWidth: "125px",
                              }}
                            >
                              {reportData[0]?.intClientTypeId === 1
                                ? "Supplier"
                                : "Customer"}
                            </td>
                            <td style={{ verticalAlign: "text-top" }}>: </td>
                            <td colSpan={4}>{reportData[0]?.partnerName}</td>
                          </tr>

                          <tr>
                            <td
                              style={{
                                verticalAlign: "text-top",
                                minWidth: "125px",
                              }}
                              class="bold"
                            >
                              Address
                            </td>
                            <td style={{ verticalAlign: "text-top" }}>: </td>
                            <td colSpan={4}>{reportData[0]?.partnerAddress}</td>
                          </tr>

                          <tr>
                            <td
                              style={{
                                verticalAlign: "text-top",
                                minWidth: "125px",
                              }}
                              class="bold"
                            >
                              Material Description
                            </td>
                            <td style={{ verticalAlign: "text-top" }}>: </td>
                            <td
                              colSpan={4}
                              style={{ verticalAlign: "text-top" }}
                            >
                              {reportData[0]?.materialDescription}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Vehicle No
                            </td>
                            <td>: </td>
                            <td>{reportData[0]?.vehicleNo}</td>
                          </tr>

                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Driver Name
                            </td>
                            <td>: </td>
                            <td style={{ width: "300px" }}>
                              {reportData[0]?.driverName}
                            </td>

                            <td class="bold">Quantity</td>
                            <td>: </td>
                            <td>{reportData[0]?.quantity}</td>
                          </tr>

                          <tr>
                            <td style={{ minWidth: "125px" }} class="bold">
                              Driver Phone No
                            </td>
                            <td>: </td>
                            <td style={{ width: "300px" }}>
                              {reportData[0]?.telFaxEmail}
                            </td>

                            <td class="bold">Quantity (KG)</td>
                            <td>: </td>
                            <td>{reportData[0]?.quantitykg}</td>
                          </tr>
                          <tr>
                            <td class="bold">Operator Name</td>
                            <td>: </td>
                            <td>{reportData[0]?.operatorName}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onClick={() => handleSubmit()}
                ></button>
                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
              <div>
                <IViewModal
                  show={isShowShippingNoteView}
                  onHide={() => {
                    setIsShowShippingNoteView(false);
                  }}
                  backdrop="static"
                >
                  <ShippingNoteView
                    id={
                      +values?.entryCode?.value || +values?.strCardNumber || 0
                    }
                  />
                </IViewModal>
              </div>
            </>
          )}
        </Formik>
        <div>
          <IViewModal
            show={isShowModal}
            onHide={() => {
              setIsShowModal(false);
            }}
            backdrop="static"
          >
            <Report weightmentId={weightmentId} />
          </IViewModal>
        </div>
      </>
    </IForm>
  );
}
