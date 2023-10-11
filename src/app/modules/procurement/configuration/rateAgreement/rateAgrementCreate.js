import { default as Axios } from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import TextArea from "../../../_helper/TextArea";
import IForm from "../../../_helper/_form";
import FormikError from "../../../_helper/_formikError";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { rateAgreementValidationSchema } from "./helper";
const initData = {
  nameOfContract: "",
  termsAndCondition: "",
  contractStartDate: "",
  contractEndDate: "",
  contractDate: "",
  itemName: "",
  itemRate: "",
  vat: "",
};

export default function RateAgreementCreate() {
  const { id } = useParams();
  const [rowData, getRowData,rowDataLoading,setRowData] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [singleData,setSingleData] = useState({})
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const location = useLocation();
  console.log("location", location);
  console.log("id", id);

  const { sbu, wareHouse, plant, purchaseOrganization, supplier } =
    location?.state || {};
  const saveHandler = (values, cb) => {
    const payload = {
      agreementHeaderId: 0,
      agreementCode: "",
      nameOfContact: values?.nameOfContract,
      contactDateTime: values?.contractDate,
      purchaseOrganizationId: purchaseOrganization?.value,
      purchaseOrganizationName: purchaseOrganization?.label,
      supplierId: supplier?.value,
      supplierName: supplier?.label,
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
        cb();
      },
      true
    );
  };

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/wms/ItemPlantWarehouse/GetItemPlantWarehouseForPurchaseRequestSearchDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plant?.value ||
        initData?.plantId}&whId=${wareHouse?.value ||
        initData?.warehouseId}&purchaseOrganizationId=${purchaseOrganization?.value ||
        initData?.purchaseOrganizationId}&typeId=2&searchTerm=${v}`
      // typeId 2 pass for this standard products
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
      }));
      return updateList;
    });
  };
  const deleteRow = (index) => {
    const newRow = [...rowData];
    newRow.splice(index, 1);
    setRowData(newRow);
  };
  const addRow = (values, callBack) => {
    if (rowData?.find((item) => item?.itemId === values?.itemName?.value)) {
      return toast.warn("Item already added");
    }
    try {
      const newRow = {
        autoId: 0,
        itemId: values?.itemName?.value,
        itemName: values?.itemName?.label,
        itemRate: values?.itemRate,
        vatPercentage: values?.vat,
        isActive: true,
        createdAt: _todayDate(),
        status: "Active",
      };
      setRowData([...rowData, newRow]);
      callBack();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(()=>{
    if (id) {
      const {
        nameOfContact,
        contractStartDate,
        contractEndDate,
        warehouseAddress,
        termsAndCondition,
        contactDateTime
      } = location?.state || {};
  
      const editedInitData = {
        nameOfContract: nameOfContact,
        termsAndCondition: termsAndCondition,
        contractStartDate: contractStartDate,
        contractEndDate: contractEndDate,
        deliveryAdress:warehouseAddress,
        contractDate: contactDateTime,
        itemName: "",
        itemRate: "",
        vat: "",
      };
      setSingleData(editedInitData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id])

 

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
          {console.log("error", errors)}
          {false && <Loading />}
          <IForm title="Rate Agreement Create" getProps={setObjprops}>
            <Form onSubmit={handleSubmit}>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    name="nameOfContract"
                    value={values?.nameOfContract}
                    label="Name Of Contract"
                    type="text"
                    placeholder="Name Of Contract"
                    onChange={(e) => {
                      setFieldValue("nameOfContract", e.target.value);
                    }}
                  />
                </div>
                {console.log(values)}
                <div className="col-lg-3">
                  <InputField
                    value={values?.contractStartDate}
                    label="Contract Start Date"
                    name="contractStartDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("contractStartDate", e.target.value);
                    }}
                    // min={values?.validTillDate?.split("T")[0]}
                    // errors={errors}
                    // touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.contractEndDate}
                    label="Contract End Date"
                    name="contractEndDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("contractEndDate", e.target.value);
                    }}
                    // errors={errors}
                    // touched={touched}
                    // min={values?.validTillDate?.split("T")[0]}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.contractDate}
                    label="Contract Date"
                    name="contractDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("contractDate", e.target.value);
                    }}
                    // errors={errors}
                    // touched={touched}
                    // min={values?.validTillDate?.split("T")[0]}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="deliveryAdress"
                    value={values?.deliveryAdress}
                    label="Delivery Adress"
                    type="text"
                    placeholder="Delivery Adress"
                    onChange={(e) => {
                      setFieldValue("deliveryAdress", e.target.value);
                    }}
                    // errors={errors}
                    // touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="">Terms And Conditions</label>
                  <TextArea
                    label="Terms And Condition"
                    value={values?.termsAndCondition}
                    name="termsAndCondition"
                    placeholder="Terms And Condition"
                    type="text"
                    // disabled={viewType === "view"}
                  />
                </div>
              </div>

              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.itemName}
                    handleChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                      setFieldValue("uomName", "");
                      //   getUOMList(
                      //     valueOption?.value,
                      //     selectedBusinessUnit?.value,
                      //     profileData?.accountId,
                      //     setUOMList,
                      //     setFieldValue
                      //   );
                    }}
                    loadOptions={loadUserList}
                    disabled={true}
                  />
                  <FormikError
                    errors={errors}
                    name="itemName"
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
                    // disabled={viewType === "view"}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Vat(%)"
                    value={values?.vat}
                    name="vat"
                    placeholder="Vat"
                    type="number"
                    // disabled={viewType === "view"}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      addRow(values, () => {
                        setFieldValue("itemName", "");
                        setFieldValue("itemRate", "");
                        setFieldValue("vat", "");
                      });
                    }}
                    disabled={
                      !values?.itemName || !values?.itemRate || !values?.vat
                    }
                  >
                    + Add
                  </button>
                </div>
              </div>

              {rowData?.length > 0 && (
                <table
                  className={
                    "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                  }
                >
                  <thead>
                    <tr className="cursor-pointer">
                      <th>SL</th>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Item Rate</th>
                      <th>Vat (%)</th>
                      {/* <th>Active Status</th> */}
                      <th>Action</th>
                      {/* {!viewType && <th>Action</th>} */}
                    </tr>
                  </thead>
                  {rowData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center" style={{ width: "40px" }}>
                        {index + 1}
                      </td>
                      <td className="text-center">{item?.itemId}</td>
                      <td className="text-center">
                        {/* {viewType === "edit" ? (
                              <InputField
                                value={row?.deliverdQnt}
                                name="deliverdQnt"
                                type="number"
                                errors={errors}
                                touched={touched}
                                onChange={(e) => {
                                  rowDataChange(
                                    index,
                                    "deliverdQnt",
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              row?.deliverdQnt
                            )} */}
                        {item?.itemName}
                      </td>
                      <td className="text-right">{item?.itemRate}</td>
                      <td className="text-right" style={{ width: "150px" }}>
                        {item?.vat}
                      </td>

                      <td className="text-center">
                        <IDelete remover={deleteRow} id={index} />
                        {/* <IActiveInActiveIcon title="test" iconTyee="inActive" /> */}
                      </td>

                      {/* {!viewType && (
                            <td
                              className="text-center"
                              style={{ width: "60px" }}
                            >
                              <IDelete remover={deleteRow} id={index} />
                            </td>
                          )} */}
                    </tr>
                  ))}
                </table>
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
