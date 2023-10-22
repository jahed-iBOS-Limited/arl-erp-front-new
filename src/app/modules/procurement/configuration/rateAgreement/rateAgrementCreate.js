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
import IActiveInActiveIcon from "../../../_helper/_helperIcons/_activeInActiveIcon";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { dateFormatterForInput } from "../../../productionManagement/msilProduction/meltingProduction/helper";
import { rateAgreementValidationSchema } from "./helper";
import useCustomAxiosGet from "./useCustomAxiosGet";
// import HelpModal from "./helpModal";
import DuplicateItemsModal from "./duplicateItemsModal";
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
  const [rowData, getRowData, rowDataLoading, setRowData] = useAxiosGet();
  const [duplicateItems,getDuplicateItems] = useCustomAxiosGet()
  const [isShowModal,setIsShowModal] = useState(false)
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
    supplier,
    agreementHeaderId,
    purchaseOrganizationId,
    purchaseOrganizationName,
    supplierId,
    supplierName,
    businessUnitId,
    plantId,
    warehouseId,
    warehouseName,
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
      getDuplicateItems(
        `/procurement/PurchaseOrder/SupplierAgreementDuplicateList`,
        payload,
        (data)=>{
          if(data?.length>0){
            setIsShowModal(true)
          }else{
            postData(
              `/procurement/PurchaseOrder/SaveAndEditRateAgreement`,
              payload,
              () => {
                cb();
              },
              true
            );
          }
        }
      )
      
    }
    if (id) {
      const payload = {
        agreementHeaderId: agreementHeaderId,
        agreementCode: "",
        nameOfContact: values?.nameOfContract,
        contactDateTime: values?.contractDate,
        purchaseOrganizationId: purchaseOrganizationId,
        purchaseOrganizationName: purchaseOrganizationName,
        supplierId: supplierId,
        supplierName: supplierName,
        businessUnitId: businessUnitId,
        plantId: plantId,
        warehouseId: warehouseId,
        warehouseName: warehouseName,
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
          cb(
            getRowData(
              `/procurement/PurchaseOrder/GetRateAgreementById?AgreementHeaderId=${id}`
            )
          );
        },
        true
      );
    }
  };

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/wms/ItemPlantWarehouse/GetItemPlantWarehouseForPurchaseRequestSearchDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plant?.value ||
        location?.state?.plantId}&whId=${wareHouse?.value ||
        location?.state
          ?.warehouseId}&purchaseOrganizationId=${purchaseOrganization?.value ||
        location?.state?.purchaseOrganizationId}&typeId=2&searchTerm=${v}`
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
        agreementRowId: 0,
        itemId: values?.itemName?.value,
        itemName: values?.itemName?.label,
        itemCode: values?.itemName?.code,
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

  const statusHandler = (index, item) => {
    const data = [...rowData];
    if (item?.status === "Active") {
      data[index]["status"] = "Inactive";
      setRowData(data);
    } else {
      data[index]["status"] = "Active";
      setRowData(data);
    }
  };
  console.log(id);
  useEffect(() => {
    if (id) {
      const {
        nameOfContact,
        contractStartDate,
        contractEndDate,
        warehouseAddress,
        termsAndCondition,
        contactDateTime,
      } = location?.state || {};
      const editedInitData = {
        nameOfContract: nameOfContact,
        termsAndCondition: termsAndCondition,
        contractStartDate: dateFormatterForInput(contractStartDate),
        contractEndDate: dateFormatterForInput(contractEndDate),
        deliveryAdress: warehouseAddress,
        contractDate: dateFormatterForInput(contactDateTime),
        itemName: "",
        itemRate: "",
        vat: "",
      };
      setSingleData(editedInitData);
    }

    if (id) {
      getRowData(
        `/procurement/PurchaseOrder/GetRateAgreementById?AgreementHeaderId=${id}`,
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
          <IForm title="Rate Agreement Create" getProps={setObjprops}>
            <Form onSubmit={handleSubmit}>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    name="nameOfContract"
                    value={values?.nameOfContract}
                    disabled={id && values?.nameOfContract}
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
                    }}
                    
                  />
                </div>
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
                    
                  />
                </div>
                
                <div className="col-lg-3">
                  <InputField
                    name="deliveryAdress"
                    disabled={(id && values?.deliveryAdress) || values?.deliveryAdress}
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
              </div>

              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.itemName}
                    handleChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);                     
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
                      {id && <th>Active Status</th>}
                      <th>Action</th>
                    </tr>
                  </thead>
                  {rowData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center" style={{ width: "40px" }}>
                        {index + 1}
                      </td>
                      <td className="text-center">{item?.itemId}</td>
                      <td className="text-center">{item?.itemName}</td>
                      {item?.agreementRowId === 0 ? (
                        <td className="text-left">
                          <span style={{ paddingLeft: "16px" }}>
                            {item?.itemRate}
                          </span>
                        </td>
                      ) : (
                        <td>
                          <InputField
                            value={item?.itemRate}
                            type="number"
                            onChange={(e) => {
                              const data = [...rowData];
                              data[index]["itemRate"] = +e?.target?.value;
                              setRowData(data);
                            }}
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
                            value={item?.vatPercentage}
                            type="number"
                            onChange={(e) => {
                              const data = [...rowData];
                              data[index]["vatPercentage"] = +e?.target?.value;
                              setRowData(data);
                            }}
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
                            {item?.status === "Active" ? "Active" : "Inactive"}
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
                            <span
                              style={{ fontWeight: "bold", color: "green" }}
                            >
                              Active
                            </span>
                            <IActiveInActiveIcon
                              title="Status"
                              iconTyee="Active"
                            />
                          </td>
                        )
                      )}
                      {item?.agreementRowId === 0 ? (
                        <td className="text-center">
                          <IDelete remover={deleteRow} id={index} />
                        </td>
                      ) : (
                        <td></td>
                      )}
                    </tr>
                  ))}
                </table>
              )}
             <IViewModal
             show={isShowModal}
             onHide={()=>{setIsShowModal(false)}}
             >
             {<DuplicateItemsModal  duplicateItems={duplicateItems}/>}
             </IViewModal>
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
