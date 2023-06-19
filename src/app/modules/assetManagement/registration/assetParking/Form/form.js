import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import Axios from "axios";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  manuName: Yup.string().required("Request Date is required"),
  countryOrigin: Yup.string().required("Valid Till Date is required"),
  location: Yup.string().required("Due Date is required"),
  // manuSerialNumber: Yup.string().required("Manufacturer Serial Number is required"),
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
  profileData,
  selectedBusinessUnit,
  brtaList,
  categoryDDL,
  profitCenterDDL,
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
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          transactionQuantity: assetDetais?.transactionQuantity,
          assetName: assetDetais?.itemName,
          itemCategory:{ value: currentRowData?.itemCategoryId, label: currentRowData?.itemCategoryName }
        }}
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
                      setFieldValue("brtaType", "");
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
                <div className="col-lg-3 mb-4">
                  <label>Item Name</label>
                  <InputField
                    value={assetDetais?.itemName}
                    placeholder="Item Name"
                    disabled={true}
                    name="itemName"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>UoM Name</label>
                  <InputField
                    value={assetDetais?.uoMname}
                    disabled={true}
                    placeholder="UoM Name"
                    name="uoMname"
                  />
                </div>
                {values?.category?.value === 2 ? (
                  <div className="col-lg-3">
                    <ISelect
                      name="brtaType"
                      options={brtaList || []}
                      value={values?.brtaType}
                      label="BRTA Vehicle Type"
                      onChange={(valueOption) => {
                        setFieldValue("brtaType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder="BRTA Vehicle Type"
                    />
                  </div>
                ) : null}
                {/* <div className="col-lg-3 mb-4">
                <label>Asset Quantity</label>
                  <InputField
                    value={assetDetais?.transactionQuantity}
                    placeholder="Item Quantity"
                    disabled={true}
                    name="numTransactionQuantity"
                  />
                </div> */}
                <div className="col-lg-3 mb-4">
                  <label>PO Number</label>
                  <InputField
                    value={assetDetais?.referenceCode}
                    placeholder="PO Number"
                    disabled={true}
                    name="referenceCode"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Supplier Name</label>
                  <InputField
                    value={assetDetais?.businessPartnerName}
                    placeholder="Supplier Name"
                    disabled={true}
                    name="businessPartnerName"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Acquisition Date</label>
                  <InputField
                    value={assetDetais?.transactionDate}
                    placeholder="Acquisition Date"
                    disabled={true}
                    name="transactionDate"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Invoice Value</label>
                  <InputField
                    value={assetDetais?.transactionValue}
                    placeholder="Invoice Value"
                    disabled={true}
                    name="transactionValue"
                  />
                </div>
                <div className="col-lg-3 mb-4">
                  <label>Acquisition Value</label>
                  <InputField
                    value={assetDetais?.transactionValue}
                    disabled={true}
                    placeholder="Acquisition Value"
                    name="transactionValue"
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
                    value={values?.manuSerialNumber}
                    placeholder="Manufacturer Serial Number"
                    name="manuSerialNumber"
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
                    type="number"
                    name="depriValue"
                    min="0"
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
                    label="Select Usage Type"
                    options={[
                      { label: "Individual", value: 1 },
                      { label: "Company", value: 2 },
                    ]}
                    value={values?.usageType}
                    name="usageType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Select Assign To </label>
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
                    label="Select Department"
                    options={department}
                    value={values?.departnemt}
                    name="departnemt"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Select Responsible Person </label>
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
                <div className="col-lg-3 mb-4">
                  <label>Transaction Quantity</label>
                  <InputField
                    value={values?.transactionQuantity}
                    placeholder="Transaction Quantity"
                    name="transactionQuantity"
                    // disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Life time Year</label>
                  <InputField
                    value={values?.lifeTimeYear}
                    placeholder="Life Time Year"
                    type="number"
                    name="lifeTimeYear"
                    min="0"
                    onChange={(e) => {
                      if(e.target.value < 0){
                        return setFieldValue("lifeTimeYear", "");
                      }else{
                        setFieldValue("lifeTimeYear", e.target.value);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Dep Run rate</label>
                  <InputField
                    value={values?.depRunRate}
                    placeholder="Dep Run rate"
                    type="number"
                    name="depRunRate"
                    min="0"
                    onChange={(e) => {
                      if(e.target.value < 0){
                        return setFieldValue("depRunRate", "");
                      }else{
                        setFieldValue("depRunRate", e.target.value);
                      }
                    }}
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
                        </tr>
                      </thead>
                      <tbody>
                        {assetDetais &&
                          assetDetais?.objLast?.map((item, i) => (
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
