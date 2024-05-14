import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import TextArea from "../../../_helper/TextArea";
import IForm from "../../../_helper/_form";
import FormikError from "../../../_helper/_formikError";
import IActiveInActiveIcon from "../../../_helper/_helperIcons/_activeInActiveIcon";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { dateFormatterForInput } from "../../../productionManagement/msilProduction/meltingProduction/helper";
import { rateAgreementValidationSchema } from "./helper";
const initData = {
  nameOfContract: "",
  termsAndCondition: "",
  contractStartDate: "",
  contractEndDate: "",
  contractDate: "",
  supplier: "",
  itemRate: "",
  vat: "",
  isForRateAgreement: "",
};

export default function RateAgreementCreate() {
  const { id } = useParams();
  const [rowData, getRowData, rowDataLoading, setRowData] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const location = useLocation();

  const {
    wareHouse,
    plant,
    purchaseOrganization,
    agreementHeaderId,
    purchaseOrganizationId,
    purchaseOrganizationName,
    businessUnitId,
    plantId,
    warehouseId,
    warehouseName,
    item,
    sbu,
    itemId,
    itemCode,
    itemName,
  } = location?.state || {};
  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = {
        agreementHeaderId: 0,
        agreementCode: "",
        nameOfContact: values?.nameOfContract,
        contactDateTime: values?.contractDate,
        purchaseOrganizationId: purchaseOrganization?.value,
        purchaseOrganizationName: purchaseOrganization?.label,
        itemId: item?.value,
        itemName: item?.label,
        itemCode: item?.code,
        isForRateAgreement: values?.isForRateAgreement,
        businessUnitId: buId,
        plantId: plant?.value,
        warehouseId: wareHouse?.value,
        warehouseName: wareHouse?.label,
        termsAndCondition: values?.termsAndCondition || "",
        warehouseAddress: values?.deliveryAdress,
        contractStartDate: values?.contractStartDate,
        contractEndDate: values?.contractEndDate,
        isActive: true,
        isApprove: false,
        approvedBy: 0,
        createdBy: userId,
        createdAt: _todayDate(),
        rows: rowData,
      };
      postData(
        `/procurement/PurchaseOrder/SaveAndEditRateAgreement`,
        payload,
        () => {
          cb(setRowData([]));
        },
        true
      );
    }
    if (id) {
      const payload = {
        agreementHeaderId: agreementHeaderId,
        agreementCode: "",
        nameOfContact: values?.nameOfContract,
        contactDateTime: values?.contractDate,
        purchaseOrganizationId: purchaseOrganizationId,
        purchaseOrganizationName: purchaseOrganizationName,
        itemId: itemId,
        itemName: itemName,
        itemCode: itemCode,
        isForRateAgreement: values?.isForRateAgreement,
        businessUnitId: businessUnitId,
        plantId: plantId,
        warehouseId: warehouseId,
        warehouseName: warehouseName,
        termsAndCondition: values?.termsAndCondition,
        warehouseAddress: values?.deliveryAdress,
        contractStartDate: values?.contractStartDate,
        contractEndDate: values?.contractEndDate,
        isActive: true,
        isApprove: false,
        approvedBy: 0,
        createdBy: userId,
        createdAt: _todayDate(),
        rows: rowData,
      };
      postData(
        `/procurement/PurchaseOrder/SaveAndEditRateAgreement`,
        payload,
        () => {
          cb(
            getRowData(
              `/procurement/PurchaseOrder/GetRateAgreementById?AgreementHeaderId=${id}`,
              (data) => {
                // console.log(data?.rows);
                setRowData(data?.rows);
              }
            )
          );
        },
        true
      );
    }
  };

  const deleteRow = (index) => {
    const newRow = [...rowData];
    newRow.splice(index, 1);
    setRowData(newRow);
  };
  const addRow = (values, callBack) => {
    if (rowData?.find((item) => item?.supplierId === values?.supplier?.value)) {
      return toast.warn("Supplier already added");
    }
    try {
      if (values?.isForRateAgreement === true && rowData?.length < 1) {
        const newRow = {
          agreementRowId: 0,
          supplierId: values?.supplier?.value,
          supplierName: values?.supplier?.label,
          itemRate: values?.itemRate,
          vatPercentage: values?.vat,
          isActive: true,
          createdAt: _todayDate(),
          status: "Active",
          createdBy: userId,
        };
        setRowData([...rowData, newRow]);
        callBack();
      } else if (values?.isForRateAgreement === false) {
        const newRow = {
          agreementRowId: 0,
          supplierId: values?.supplier?.value,
          supplierName: values?.supplier?.label,
          itemRate: values?.itemRate,
          vatPercentage: values?.vat,
          isActive: true,
          createdAt: _todayDate(),
          status: "Active",
          createdBy: userId,
        };
        setRowData([...rowData, newRow]);
        callBack();
      } else {
        toast.warning("You can not add multiple supplier");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const statusHandler = (index, item) => {
    const data = [...rowData];
    if (item?.status === "Active") {
      data[index]["status"] = "Inactive";
      data[index]["createdBy"] = userId;
      setRowData(data);
    } else {
      data[index]["status"] = "Active";
      data[index]["createdBy"] = userId;
      setRowData(data);
    }
  };

  useEffect(() => {
    if (id) {
      const {
        nameOfContact,
        contractStartDate,
        contractEndDate,
        warehouseAddress,
        termsAndCondition,
        contactDateTime,
        isForRateAgreement,
      } = location?.state || {};
      const editedInitData = {
        nameOfContract: nameOfContact,
        termsAndCondition: termsAndCondition,
        contractStartDate: dateFormatterForInput(contractStartDate),
        contractEndDate: dateFormatterForInput(contractEndDate),
        deliveryAdress: warehouseAddress,
        contractDate: dateFormatterForInput(contactDateTime),
        supplier: "",
        itemRate: "",
        vat: "",
        isForRateAgreement: isForRateAgreement,
      };
      setSingleData(editedInitData);
    }

    if (id) {
      getRowData(
        `/procurement/PurchaseOrder/GetRateAgreementById?AgreementHeaderId=${id}`,
        (data) => {
          setRowData(data?.rows);
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        id ? singleData : { ...initData, deliveryAdress: wareHouse?.address }
      }
      validationSchema={rateAgreementValidationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (rowData?.length > 0) {
          saveHandler(values, () => {
            resetForm(initData);
          });
        } else {
          toast.warn("Please add minimum one item");
        }
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
          {/* {console.log("error", errors)} */}
          {(rowDataLoading || isLoading) && <Loading />}
          <IForm
            title={`Rate Agreement ${id ? "Edit" : "Create"}`}
            getProps={setObjprops}
          >
            <Form onSubmit={handleSubmit}>
              <div
                style={{ color: "red", marginTop: "8px" }}
                className="col-lg-12"
              >
                Item Name : {itemName || item?.label}
              </div>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    name="nameOfContract"
                    value={values?.nameOfContract}
                    // disabled={id && values?.nameOfContract}
                    label="Name Of Contract"
                    type="text"
                    placeholder="Name Of Contract"
                    onChange={(e) => {
                      setFieldValue("nameOfContract", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="contractDate"
                    value={values?.contractDate}
                    disabled={id && values?.contractDate}
                    label="Contract Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("contractDate", e.target.value);
                      setFieldValue("contractStartDate", "");
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="contractStartDate"
                    // disabled={id && values?.contractStartDate}
                    value={values?.contractStartDate}
                    label="Contract Start Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("contractStartDate", e.target.value);
                      setFieldValue("contractEndDate", "");
                    }}
                    min={values?.contractDate}
                  />
                </div>
                {console.log(location)}
                <div className="col-lg-3">
                  <InputField
                    name="contractEndDate"
                    // disabled={id && values?.contractEndDate}
                    value={values?.contractEndDate}
                    label="Contract End Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("contractEndDate", e.target.value);
                    }}
                    min={values?.contractStartDate}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    name="deliveryAdress"
                    disabled={
                      (id && values?.deliveryAdress) || values?.deliveryAdress
                    }
                    value={values?.deliveryAdress}
                    label="Delivery Adress"
                    type="text"
                    placeholder="Delivery Adress"
                    onChange={(e) => {
                      setFieldValue("deliveryAdress", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="">Terms And Conditions</label>
                  <TextArea
                    label="Terms And Condition"
                    // disabled={id}
                    value={values?.termsAndCondition}
                    name="termsAndCondition"
                    placeholder="Terms And Condition"
                    type="text"
                    // disabled={viewType === "view"}
                  />
                </div>

                <div className="col-lg-3">
                  <div style={{ marginTop: "16px" }}>
                    Is For Rate Agreement ?
                  </div>
                  <div
                    role="group"
                    aria-labelledby="my-radio-group"
                    style={{ gap: "10px" }}
                    className="d-flex align-items-center"
                  >
                    <div style={{ gap: "2px" }} className="d-flex">
                      <input
                        style={{ marginTop: "5px" }}
                        id="yes"
                        type="radio"
                        name="isForRateAgreement"
                        checked={values?.isForRateAgreement === true}
                        onChange={(e) => {
                          setFieldValue("isForRateAgreement", true);
                          setRowData([]);
                        }}
                        disabled={id}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>

                    <div style={{ gap: "3px" }} className="d-flex">
                      <input
                        style={{ marginTop: "5px" }}
                        type="radio"
                        id="no"
                        name="isForRateAgreement"
                        checked={values?.isForRateAgreement === false}
                        onChange={(e) => {
                          setFieldValue("isForRateAgreement", false);
                          setRowData([]);
                        }}
                        disabled={id}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                  {touched?.isForRateAgreement &&
                    errors?.isForRateAgreement && (
                      <span style={{ color: "red" }}>
                        {errors?.isForRateAgreement}
                      </span>
                    )}
                </div>
              </div>

              <div className={`form-group  global-form row `}>
                <div className="col-lg-3">
                  <label>Supplier Name</label>
                  <SearchAsyncSelect
                    selectedValue={values.supplier}
                    isDisabled={
                      values?.isForRateAgreement === "" ||
                      (values?.isForRateAgreement && rowData?.length === 1)
                    }
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v.length < 3) return [];
                      return axios
                        .get(
                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${sbu?.value}`
                        )
                        .then((res) => {
                          const updateList = res?.data.map((item) => ({
                            ...item,
                          }));
                          return updateList;
                        });
                    }}
                  />
                  <FormikError
                    errors={errors}
                    name="supplierName"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Item Rate"
                    value={values?.itemRate}
                    name="itemRate"
                    placeholder="Item Rate"
                    type="number"
                    disabled={
                      values?.isForRateAgreement === "" ||
                      (values?.isForRateAgreement && rowData?.length === 1)
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Vat(%)"
                    value={values?.vat}
                    name="vat"
                    placeholder="Vat"
                    type="number"
                    disabled={
                      values?.isForRateAgreement === "" ||
                      (values?.isForRateAgreement && rowData?.length === 1)
                    }
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      addRow(values, () => {
                        setFieldValue("supplier", "");
                        setFieldValue("itemRate", "");
                        setFieldValue("vat", "");
                      });
                    }}
                    disabled={
                      !values?.supplier || !values?.itemRate || !values?.vat
                    }
                  >
                    + Add
                  </button>
                </div>
              </div>

              {rowData?.length > 0 && (
                <div className="table-responsive">
                  <table
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        <th>SL</th>
                        <th>Supplier Name</th>
                        <th>Item Rate</th>
                        <th>Vat (%)</th>
                        {id && <th>Active Status</th>}
                        {!id && <th>Action</th>}
                      </tr>
                    </thead>
                    {rowData?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td className="text-center">{item?.supplierName}</td>
                        {item?.agreementRowId === 0 ? (
                          <td className="text-left">
                            <span style={{ paddingLeft: "16px" }}>
                              {item?.itemRate}
                            </span>
                          </td>
                        ) : (
                          <td>
                            <InputField
                              value={+item?.itemRate}
                              type="number"
                              onChange={(e) => {
                                const data = [...rowData];
                                data[index]["itemRate"] = +e?.target?.value;
                                data[index]["createdBy"] = userId;
                                setRowData(data);
                              }}
                              min={0}
                            />
                          </td>
                        )}

                        {item?.agreementRowId === 0 ? (
                          <td
                            className="text-left "
                            style={{ width: "150px", height: "28px" }}
                          >
                            <span style={{ paddingLeft: "12px" }}>
                              {item?.vatPercentage}
                            </span>
                          </td>
                        ) : (
                          <td>
                            <InputField
                              value={+item?.vatPercentage}
                              type="number"
                              onChange={(e) => {
                                const data = [...rowData];
                                data[index]["vatPercentage"] = +e?.target
                                  ?.value;
                                data[index]["createdBy"] = userId;
                                setRowData(data);
                              }}
                              min={0}
                            />
                          </td>
                        )}
                        {id && item?.agreementRowId ? (
                          <td className="text-center">
                            <span
                              style={
                                item?.status === "Active"
                                  ? { fontWeight: "bold", color: "green" }
                                  : { fontWeight: "bold", color: "red" }
                              }
                            >
                              {item?.status === "Active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                            <span
                              disabled={!item?.agreementRowId}
                              className="ml-2 pointer"
                              onClick={() => {
                                statusHandler(index, item);
                              }}
                            >
                              <IActiveInActiveIcon
                                title="Status"
                                iconTyee={
                                  item?.status === "Active"
                                    ? "Active"
                                    : "inActive"
                                }
                              />
                            </span>
                          </td>
                        ) : (
                          id && (
                            <td className="text-center" disabled>
                              {item?.agreementRowId === 0 && (
                                <IDelete remover={deleteRow} id={index} />
                              )}
                            </td>
                          )
                        )}
                        {!id && (
                          <td className="text-center">
                            <IDelete remover={deleteRow} id={index} />
                          </td>
                        )}
                      </tr>
                    ))}
                  </table>
                </div>
              )}
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
