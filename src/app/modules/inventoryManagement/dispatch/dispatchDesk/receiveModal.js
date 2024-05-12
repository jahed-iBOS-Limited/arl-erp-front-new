import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import CommonTable from "../../../_helper/commonTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { dispatchReceiveValidationSchema } from "./helper";
import FormikError from "../../../_helper/_formikError";

const initData = {
  receiveType: "",
  senderName: "",
  senderContactNo: "",
  receiverName: "",
  receiverContractNo: "",
  fromLocation: "",
  fromLocationDDL: "",
  toLocation: "",
  toLocationDDL: "",
  receiveDate: "",
  remarks: "",
  dispatchType: "",
  parcelName: "",
  qty: "",
  rowRemark: "",
  uom: "",
  plant: "",
  documentNo: "",
  reciverBuName:"",
};

export default function ReceiveModal() {

  const [objProps, setObjprops] = useState({});
  const [rowData, setRowData] = useState([]);
  //   const location = useLocation();
  const [, saveDocumentReceive, loadDocumentReceive] = useAxiosPost();
  const [locationDDL, getLocationDDL, ] = useAxiosGet();
  const [singleData, getSingleData] = useAxiosGet();
  const {
    profileData: {
      accountId: accId,
      employeeFullName,
      employeeId,
      userId,
    },
    selectedBusinessUnit: { value: buId, label: buName },
    // businessUnitList,
  } = useSelector((state) => state?.authData, shallowEqual);
  const [uomList, getUoMList] = useAxiosGet();

  // all handler
  const saveHandler = (values, cb) => {
    if (rowData?.length < 1) return toast.warn("Add minimum one data");
    if (!values?.senderName) return toast.warn("Sender Name is required");
    const payload = {
      header: {
        dispatchType: values?.receiveType?.label,
        dispatchHeaderId: singleData?.header?.DispatchHeaderId || 0,
        sendReceive: "received",
        fromLocation:
          values?.receiveType?.value === 1
            ? values?.fromLocationDDL?.label
            : values?.fromLocation,
        fromPlantId: values?.fromLocationDDL?.value || 0,
        toLocation:values?.toLocationDDL?.label,
        toPlantId: values?.toLocationDDL?.value || 0,
        senderEnrollId: values?.senderName?.value || 0,
        senderName: values?.senderName?.label || values?.senderName || "",
        senderContactNo: values?.senderContactNo || "",
        receiverEnrollId: values.receiverName?.value || 0,
        receiverName: values.receiverName?.label || "",
        receiverBusinessUnitId : values?.receiverName?.businessUnitId || 0,
        receiverBusinessUnit : values?.receiverName?.businessUnitName || "",
        receiverContactNo: values?.receiverContractNo || "",
        remaks: values?.remarks,
        dispatchSenderReceiverEnroll: employeeId,
        dispatchSenderReceiverName: employeeFullName,
        dispatchReceiveDate: values?.receiveDate,
        dispatchNote: values?.dispatchNote || "",
        actionById: employeeId,
        accountId: accId,
        businessUnitId: buId,
        businessUnit: buName
      },
      row: [...rowData],
    };
    if (values?.receiveType?.label === "External") {
      saveDocumentReceive(
        `/tms/DocumentDispatch/ExternalDocumentReceive`,
        payload,
        () => {
          setRowData([]);
          cb && cb();
        },
        true
      );
    } else {
      saveDocumentReceive(
        `/tms/DocumentDispatch/InternalDocumentReceive`,
        payload,
        () => {
          setRowData([]);
          cb && cb();
        },
        true
      );
    }
  };
  const loadSenderList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${accId}&BusinessUnitId=${0}&Search=${v}`
      )
      .then((res) => {
        const user = res?.data?.map((user) => ({
          ...user,
          label: `${user?.strEmployeeName} - ${user?.employeeBusinessUnit} - [${user?.employeeId}]`,
        }));
        return user;
      })
      .catch((err) => []);
  };
  const loadSenderListForDocument = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(`/tms/DocumentDispatch/DocumentDispatchDDL?Search=${v}`)
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        // `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${accId}&BusinessUnitId=${buId}&Search=${v}`
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${accId}&search=${v}`

      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => []);
  };
  const handleAdd = (values) => {
    const checkDuplicate = rowData?.find(
      (item) =>
        item?.dispatchType === values?.dispatchType?.label.toLowerCase() &&
        item?.documentMaterialName === values?.parcelName &&
        item?.quantity === +values?.qty &&
        item?.remaks === values?.remarks
    );

    if (checkDuplicate) return toast.warn("Duplicate Data Found");
    const newRowItem = {
      rowId: 0,
      dispatchHeaderId: 0,
      dispatchType: values?.dispatchType?.label.toLowerCase(),
      documentMaterialName: values?.parcelName,
      quantity: +values?.qty || 0,
      uomId: values?.uom?.value || 0,
      uom: values?.uom?.label || "",
      isActive: true,
      remaks: values?.rowRemark,
    };
    setRowData((prev) => [...prev, newRowItem]);
  };
  const handleRowDelete = (index) => {
    const prevRowData = [...rowData];
    prevRowData.splice(index, 1);
    setRowData(prevRowData);
  };
  useEffect(() => {
    getUoMList(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    getLocationDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=0&OrgUnitTypeId=8`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, userId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        // toLocation: workPlaceName,
      }}
      validationSchema={dispatchReceiveValidationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (!values?.receiverName)
          return toast.warn("Receiver name is required");
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
        setValues,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loadDocumentReceive && <Loading />}
          <IForm
            title="Dispatch Receive"
            isHiddenBack={true}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="receiveType"
                    options={[
                      { value: 1, label: "Internal" },
                      { value: 2, label: "External" },
                    ]}
                    value={values?.receiveType}
                    label="Receive Type"
                    onChange={(valueOption) => {
                      setFieldValue("receiveType", valueOption);
                      setValues({ ...initData, receiveType: valueOption });
                      setRowData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                
                {values?.receiveType?.value === 1 ? (
                  <div className="col-md-3">
                    <label>Document No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.documentNo}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("senderName","");
                        setFieldValue("senderContactNo","");
                        setFieldValue("receiverName","");
                        setFieldValue("receiverContractNo","");
                        setFieldValue("fromLocationDDL","");
                        setFieldValue("toLocationDDL","");
                        setFieldValue("remarks","");
                        setFieldValue("documentNo", valueOption || "");
                        setFieldValue("reciverBuName", "");
                        if (valueOption) {
                          getSingleData(
                            `/tms/DocumentDispatch/GetDocumentDispatchById?DispatchId=${valueOption?.value}`,
                            (data) => {
                              setFieldValue(
                                "senderName",
                                data?.header?.SenderEnrollId &&
                                  data?.header?.SenderName
                                  ? {
                                      value: data?.header?.SenderEnrollId,
                                      label: data?.header?.SenderName,
                                    }
                                  : null
                              );
                              setFieldValue(
                                "senderContactNo",
                                data?.header?.SenderContactNo || ""
                              );
                              setFieldValue(
                                "receiverName",
                                data?.header?.ReceiverEnrollId &&
                                  data?.header?.ReceiverName
                                  ? {
                                      value: data?.header?.ReceiverEnrollId,
                                      label: data?.header?.ReceiverName,
                                      businessUnitId: data?.header?.ReceiverBusinessUnitId,
                                      businessUnitName:  data?.header?.ReceiverBusinessUnit,
                                    }
                                  : null
                              );
                              setFieldValue("reciverBuName",  data?.header?.ReceiverBusinessUnitId &&  data?.header?.ReceiverBusinessUnit ? {value: data?.header?.ReceiverBusinessUnitId, label:  data?.header?.ReceiverBusinessUnit} : "")
                              setFieldValue(
                                "receiverContractNo",
                                data?.header?.ReceiverContactNo || ""
                              );
                              setFieldValue(
                                "fromLocationDDL",
                                data?.header?.FromPlantId &&
                                  data?.header?.FromLocation
                                  ? {
                                      value: data?.header?.FromPlantId,
                                      label: data?.header?.FromLocation,
                                    }
                                  : null
                              );
                              setFieldValue(
                                "toLocationDDL",
                                data?.header?.ToPlantId &&
                                  data?.header?.ToLocation
                                  ? {
                                      value: data?.header?.ToPlantId,
                                      label: data?.header?.ToLocation,
                                    }
                                  : null
                              );
                              setFieldValue(
                                "remarks",
                                data?.header?.Remaks || ""
                              );

                              setRowData(
                                data?.row?.map((item) => ({
                                  // ...item,
                                  dispatchType: item?.DispatchType,
                                  documentMaterialName:
                                    item?.DocumentMaterialName,
                                  quantity: item?.Quantity,
                                  uom: item?.Uom,
                                  remaks: item?.Remaks,
                                  rowId: item?.RowId,
                                  dispatchHeaderId: item?.DispatchHeaderId,
                                  uomId: item?.UomId,
                                  isActive: item?.IsActive,
                                }))
                              );
                            }
                          );
                        }
                      }}
                      loadOptions={loadSenderListForDocument}
                    />
                  </div>
                ) : null}
                {values?.receiveType?.value === 1 ? (
                  <div className="col-md-3">
                    <label>Sender Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.senderName}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("senderName", valueOption);
                        setFieldValue(
                          "senderContactNo",
                          valueOption?.contactNo
                        );
                      }}
                      loadOptions={loadSenderList}
                      isDisabled={true}
                    />
                     <FormikError
                      errors={errors}
                      name="senderName"
                      touched={touched}
                  />
                  </div>
                ) : values?.receiveType?.value === 2 ? (
                  <div className="col-lg-3">
                    <InputField
                      value={values?.senderName}
                      label="Sender Name"
                      placeholder="Sender Name"
                      name="senderName"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("senderName", e.target.value);
                      }}
                    />
                  </div>
                ) : null}
                <div className="col-lg-3">
                  <InputField
                    value={values?.senderContactNo}
                    label="Sender Contract No"
                    placeholder="Sender Contract No"
                    name="senderContactNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("senderContactNo", e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label>Receiver Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.receiverName}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("receiverName", valueOption);
                      setFieldValue(
                        "receiverContractNo",
                        valueOption?.contactNo
                      );
                      setFieldValue("reciverBuName", {value: valueOption?.businessUnitId, label: valueOption?.businessUnitName});
                    }}
                    loadOptions={loadUserList}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                      <NewSelect
                        name="reciverBuName"
                        options={[]}
                        value={values?.reciverBuName}
                        label="Receiver Business Unit"
                        disabled={true}
                      />
                    </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.receiverContractNo}
                    label="Receiver Contract No"
                    placeholder="Receiver Contract No"
                    name="receiverContractNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("receiverContractNo", e.target.value);
                    }}
                  />
                </div>
                {values?.receiveType?.value === 1 ? (
                  <>
                    {" "}
                    <div className="col-lg-3">
                      <NewSelect
                        name="fromLocationDDL"
                        options={locationDDL}
                        value={values?.fromLocationDDL}
                        label="From Location"
                        onChange={(valueOption) => {
                          setFieldValue("fromLocationDDL", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromLocation}
                        label="From Location"
                        placeholder="From Location"
                        name="fromLocation"
                        type="text"
                        onClick={(e) => {
                          setFieldValue("fromLocation", e.target.value);
                        }}
                      />
                    </div>
                  </>
                )}
                <div className="col-lg-3">
                  <NewSelect
                    name="toLocationDDL"
                    options={locationDDL}
                    value={values?.toLocationDDL}
                    label="To Location"
                    onChange={(valueOption) => {
                      setFieldValue("toLocationDDL", valueOption);
                    }}
                    isDisabled={values?.receiveType?.value === 1}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    placeholder="Remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.receiveDate}
                    label="Receive Date"
                    name="receiveDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("receiveDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.dispatchNote}
                    label="Dispatch Note"
                    name="dispatchNote"
                    placeholder="Dispatch Note"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("dispatchNote", e.target.value);
                    }}
                  />
                </div>
              </div>

              {values?.receiveType?.value !== 1 && (
                <div className="form-group  global-form row mt-5">
                  <div className="col-lg-3">
                    <NewSelect
                      name="dispatchType"
                      options={[
                        { value: 1, label: "Document" },
                        { value: 2, label: "Material" },
                      ]}
                      value={values?.dispatchType}
                      label="Dispatch Type"
                      onChange={(valueOption) => {
                        setFieldValue("parcelName", "");
                        setFieldValue("qty", "");
                        setFieldValue("dispatchType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.parcelName}
                      label={
                        values?.dispatchType
                          ? `${values?.dispatchType?.label} Name`
                          : "Document / Material Name"
                      }
                      name="parcelName"
                      placeholder={
                        values?.dispatchType
                          ? `${values?.dispatchType?.label} Name`
                          : "Document / Material Name"
                      }
                      type="text"
                      onChange={(e) => {
                        setFieldValue("parcelName", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.qty}
                      label="Qty"
                      name="qty"
                      placeholder="qty"
                      type="number"
                      min={0}
                      onChange={(e) => {
                        setFieldValue("qty", e.target.value);
                      }}
                    />
                  </div>
                  {values?.dispatchType?.value === 2 && (
                    <div className="col-lg-3">
                      <NewSelect
                        options={uomList}
                        value={values?.uom}
                        label="UOM"
                        name="uom"
                        placeholder="UOM"
                        type="text"
                        onChange={(valueOption) => {
                          setFieldValue("uom", valueOption);
                        }}
                      />
                    </div>
                  )}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.rowRemark}
                      label="Remarks"
                      name="rowRemark"
                      placeholder="Remarks"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("rowRemark", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      style={{ marginTop: "16px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        handleAdd(values, setRowData);
                        setValues({
                          ...values,
                          dispatchType: "",
                          parcelName: "",
                          qty: "",
                          rowRemark: "",
                          uom: "",
                        });
                      }}
                      disabled={
                        !values?.dispatchType ||
                        !values?.parcelName ||
                        !values?.qty ||
                        !values?.rowRemark
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: "15px" }}>
                <CommonTable
                  headersData={[
                    "Sl",
                    "Dispatch Type",
                    "Parcel Name",
                    "Quantity",
                    "UoM",
                    "Remarks",
                    "Action",
                  ]}
                >
                  <tbody>
                    {rowData?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{item?.dispatchType}</td>
                        <td className="text-center">
                          {item?.documentMaterialName}
                        </td>
                        <td className="text-center">{item?.quantity}</td>
                        <td className="text-center">{item?.uom}</td>
                        <td className="text-center">{item?.remaks}</td>
                        <td className="text-center">
                          <span onClick={() => handleRowDelete(index)}>
                            <IDelete />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </CommonTable>
              </div>

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
