import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import InputField from "../../../../_helper/_inputField";
import Axios from "axios";
import FormikError from "../../../../_helper/_formikError";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  // manuName: Yup.string().required("Request Date is required"),
  // countryOrigin: Yup.string().required("Valid Till Date is required"),
  // location: Yup.string().required("Due Date is required"),
  category: Yup.object().shape({
    label: Yup.string().required("Category is required"),
    value: Yup.string().required("Category is required"),
  }),
  assetName: Yup.string().required("Asset Name is required"),
  profitCenter: Yup.object().shape({
    label: Yup.string().required("Profit Center is required"),
    value: Yup.string().required("Profit Center is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  currentRowData,
  assetDetais,
  responsiblePerson,
  assignTO,
  department,
  itemList,
  onChangeForItem,
  supplierList,
  itemAttribute,
  profileData,
  selectedBusinessUnit,
  categoryDDL,
  singleData,
  brtaList,
  profitCenterDDL
}) {
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&searchTearm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        value: item?.value,
        label: item?.employeeName,
      }));
      return updateList;
    });
  };


  const loadItemList = (v) => {
    //  if (v?.length < 3) return []
    return Axios.get(
      `/asset/DropDown/GetAssetItemListByWhId?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&PlantId=${currentRowData?.plantId}&WHId=${currentRowData?.warehouseId}&searchTearm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
      }));
      return updateList;
    });
  }
  return (
    <>
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
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
              <div className="col-lg-3">
                <ISelect
                  name="category"
                  options={categoryDDL || []}
                  value={values?.category}
                  label="Category"
                  onChange={(valueOption) => {
                    setFieldValue("brtaType","" );
                    setFieldValue("category", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                  placeholder="Category"
                />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Asset Name</label>
                  <InputField
                    value={values?.assetName}
                    placeholder="Asset Name"
                    name="assetName"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.itemName}
                    handleChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                      onChangeForItem(valueOption);
                    }}
                    loadOptions={loadItemList}
                    isDisabled={true}
                  />
                  <FormikError
                    errors={errors}
                    name="itemName"
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Item Name"
                    options={itemList}
                    // defaultValue={values?.itemName}
                    value = {values?.itemName}
                    name="itemName"
                    onChange={(item) => {
                      setFieldValue("itemName", item);
                      onChangeForItem(item);
                    }}
                    // setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {/* <div className="col-lg-3 mb-4">
                  <InputField
                    value={values?.uoMname}
                    label="UoM Name"
                    placeholder="UoM Name"
                    name="uoMname"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <InputField
                    value={values?.transactionQuantity}
                    label="Item Quantity"
                    placeholder="Item Quantity"
                    name="transactionQuantity"
                  />
                </div> */}
                <div className="col-lg-3 mb-4">
                  <label>PO Number</label>
                  <InputField
                    value={values?.referenceCode}
                    placeholder="PO Number"
                    name="referenceCode"
                    disabled={true}
                  />
                </div>
                {values?.category?.value === 2 ? (
                  <div className="col-lg-3">
                    <ISelect
                      label="BRTA Vehicle Type"
                      options={brtaList||[]}
                      value={values?.brtaType}
                      name="brtaType"
                      setFieldValue={setFieldValue}
                      // isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : null}
                <div className="col-lg-3">
                  <ISelect
                    label="Supplier Name"
                    options={supplierList}
                    // defaultValue={values?.businessPartnerName}
                    value={values?.businessPartnerName}
                    name="businessPartnerName"
                    setFieldValue={setFieldValue}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Acquisition Date</label>
                  <InputField
                    value={values?.transactionDate}
                    placeholder="Acquisition Date"
                    type="date"
                    name="transactionDate"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Invoice Value</label>
                  <InputField
                    value={values?.transactionValue}
                    placeholder="Invoice Value"
                    name="transactionValue"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Acquisition Value</label>
                  <InputField
                    value={values?.acquisitionValue}
                    placeholder="Acquisition Value"
                    name="acquisitionValue"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Manufacturer Name</label>
                  <InputField
                    value={values?.manuName}
                    placeholder="
                    Manufacturer Name"
                    name="manuName"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Manufacturer Serial Number</label>
                  <InputField
                    value={values?.strManufacturerSerialNo}
                    placeholder="
                    Manufacturer Serial Number"
                    name="strManufacturerSerialNo"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Country of Origin</label>
                  <InputField
                    value={values?.countryOrigin}
                    placeholder="Country of Origin"
                    name="countryOrigin"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Warrenty End Date</label>
                  <InputField
                    value={values?.warrentyEnd}
                    placeholder="Warrenty End Date"
                    type="date"
                    name="warrentyEnd"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Location</label>
                  <InputField
                    value={values?.location}
                    placeholder="Location"
                    name="location"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Depreciation Value</label>
                  <InputField
                    value={values?.depriValue}
                    placeholder="Depreciation Value"
                    name="depriValue"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Depreciation Run Date</label>
                  <InputField
                    value={values?.depriRunDate}
                    placeholder="Depreciation Run Date"
                    type="date"
                    name="depriRunDate"
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Usage Type"
                    options={[
                      { label: "Individual", value: 1 },
                      { label: "Company", value: 2 },
                    ]}
                    // defaultValue={values?.usageType}
                    value={values?.usageType}
                    name="usageType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Assign To </label>
                  <SearchAsyncSelect
                    selectedValue={values?.assignTo}
                    handleChange={(valueOption) => {
                      setFieldValue("assignTo", valueOption);
                    }}
                    loadOptions={loadUserList}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Department"
                    options={department}
                    // defaultValue={values?.departnemt}
                    value={values?.departnemt}
                    name="departnemt"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Responsible Person </label>
                  <SearchAsyncSelect
                    selectedValue={values?.resPerson}
                    handleChange={(valueOption) => {
                      setFieldValue("resPerson", valueOption);
                    }}
                    loadOptions={loadUserList}
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Asset Description</label>
                  <InputField
                    value={values?.assetDes}
                    placeholder="Asset Description"
                    name="assetDes"
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Profit Center"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    name="profitCenter"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Attribute Name</th>
                          <th>Attribute Uom</th>
                          <th>Attribute Value</th>
                          <th>Item Type Name</th>
                          <th>Item Category Name</th>
                          <th>Item Sub Category Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemAttribute &&
                          itemAttribute?.map((item, i) => (
                            <tr key={i + 1}>
                              <td>{i + 1}</td>
                              <td className="text-center">
                                {item.attributeName}
                              </td>
                              <td className="text-center">
                                {item.attributeUom}
                              </td>
                              <td className="text-center">
                                {item.attributeValue}
                              </td>
                              <td className="text-center">
                                {item.itemTypeName}
                              </td>
                              <td className="text-center">
                                {item.itemCategoryName}
                              </td>
                              <td className="text-center">
                                {item.itemSubCategoryName}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
