import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
// import { MaintenanceReport } from "../maintenance";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
// import { getMaintenanceReport } from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import MaintenanceDetailReport from "./maintenanceReportModal";
import { _todayDate } from "../../../../_helper/_todayDate";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  // manuName: Yup.string().required("Request Date is required"),
  // countryOrigin: Yup.string().required("Valid Till Date is required"),
  // location: Yup.string().required("Due Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  itemAttribute,
  maintenanceRowDto,
  selectedBusinessUnit,
  setMaintenanceRowDto,
  setDisabled,
  currentRowData,
  assignRowDto
}) {
  const [mdalShow, setModalShow] = useState(false)
  const [currentItem, setCurrentItem] = useState("")
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          fromDate: _dateFormatter(new Date("2021-06-01")),
          toDate: _todayDate()
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div style={{
                height: "450px",
                overflowY: "auto",
                overflowX: "hidden"
              }}>
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <ISelect
                      label="Item Name"
                      options={[]}
                      // defaultValue={values?.itemName}
                      value={values?.itemName}
                      name="itemName"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      isDisabled={true}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>PO Number</label>
                    <InputField
                      value={values?.referenceCode}
                      placeholder="PO Number"
                      disabled={true}
                      name="referenceCode"
                    />
                  </div>
                  {values?.itemCategory === "Vehicle" && <div className="col-lg-3">
                    <ISelect
                      label="Brta Vehicle Type"
                      options={[]}
                      value={values?.brtaType}
                      name="brtaType"
                      setFieldValue={setFieldValue}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>}
                  <div className="col-lg-3">
                    <ISelect
                      label="Supplier Name"
                      options={[]}
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
                      disabled={true}
                      name="transactionDate"
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Invoice Value</label>
                    <InputField
                      value={values?.transactionValue}
                      placeholder="Invoice Value"
                      disabled={true}
                      name="transactionValue"
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Acquisition Value</label>
                    <InputField
                      value={values?.acquisitionValue}
                      placeholder="Acquisition Value"
                      disabled={true}
                      name="acquisitionValue"
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Manufacturer Name</label>
                    <InputField
                      value={values?.manuName}
                      disabled={true}
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
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Country of Origin</label>
                    <InputField
                      value={values?.countryOrigin}
                      placeholder="Country of Origin"
                      disabled={true}
                      name="countryOrigin"
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Warrenty End Date</label>
                    <InputField
                      value={values?.warrentyEnd}
                      placeholder="Warrenty End Date"
                      disabled={true}
                      type="date"
                      name="warrentyEnd"
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Location</label>
                    <InputField
                      value={values?.location}
                      placeholder="Location"
                      disabled={true}
                      name="location"
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Depreciation Value</label>
                    <InputField
                      value={values?.depriValue}
                      placeholder="Depreciation Value"
                      disabled={true}
                      name="depriValue"
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Depreciation Run Date</label>
                    <InputField
                      value={values?.depriRunDate}
                      placeholder="Depreciation Run Date"
                      disabled={true}
                      type="date"
                      name="depriRunDate"
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Usage Type"
                      options={[]}
                      // defaultValue={values?.usageType}
                      value={values?.usageType}
                      name="usageType"
                      setFieldValue={setFieldValue}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Assign To"
                      options={[]}
                      // defaultValue={values?.assignTo}
                      value={values?.assignTo}
                      name="assignTo"
                      setFieldValue={setFieldValue}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <ISelect
                      label="Department"
                      options={[]}
                      // defaultValue={values?.departnemt}
                      value={values?.departnemt}
                      name="departnemt"
                      setFieldValue={setFieldValue}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <ISelect
                      label="Responsible Person"
                      options={[]}
                      // defaultValue={values?.resPerson}
                      value={values?.resPerson}
                      name="resPerson"
                      setFieldValue={setFieldValue}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label>Asset Description</label>
                    <InputField
                      value={values?.assetDes}
                      placeholder="Asset Description"
                      disabled={true}
                      name="assetDes"
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
                <h4 className="my-5 py-5 border-bottom">Asset Maintenance</h4>

                <div className="row">

                  <div className="col-lg-12">
                   <div className="table-responsive">
                   <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Job Card</th>
                          <th style={{ width: "100px" }}>Asset Code</th>
                          <th style={{ width: "120px" }}>Name of Asset</th>
                          {/* <th style={{ width: "100px" }}>Bill Unit</th> */}
                          <th style={{ width: "100px" }}>Problem</th>
                          <th>Repair Type</th>
                          <th>Priority</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Material</th>
                          <th>Service</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenanceRowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.intMaintenanceNo}</td>
                            <td>{item?.strAssetCode}</td>
                            <td>{item?.strNameOfAsset}</td>
                            {/* <td>{item?.strBilUnit}</td> */}
                            <td>{item?.strProblem}</td>
                            <td>{item?.strRepairType}</td>
                            <td>{item?.strPriority}</td>
                            <td>{_dateFormatter(item?.dteStart)}</td>
                            <td>{_dateFormatter(item?.dteEnd)}</td>
                            <td>{item?.monMaterial}</td>
                            <td>{item?.monServiceCost}</td>
                            <td>{item?.monMaterial + item?.monServiceCost}</td>
                            <td className="text-center">
                              <IView
                                //classes="text-muted"
                                clickHandler={() => {
                                  setModalShow(true);
                                  setCurrentItem(item);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="text-right font-weight-bold" colSpan="9"> Total</td>
                          <td className="text-center font-weight-bold">{maintenanceRowDto?.reduce((acc, item) => acc + +item?.monMaterial, 0)}</td>
                          <td className="text-center font-weight-bold">{maintenanceRowDto?.reduce((acc, item) => acc + +item?.monServiceCost, 0)}</td>
                          <td className="text-center font-weight-bold">{maintenanceRowDto?.reduce((acc, item) => acc + (+item?.monMaterial + +item?.monServiceCost), 0)}</td>
                          <td>
                          </td>
                        </tr>
                      </tbody>
                      {/* )} */}
                    </table>
                   </div>
                  </div>
                  <>
                    <IViewModal
                      show={mdalShow}
                      onHide={() => setModalShow(false)}
                    >
                      <MaintenanceDetailReport
                        item={currentItem}
                        setModalShow={setModalShow}
                        values={values}
                        selectedBusinessUnit={selectedBusinessUnit}
                        setLoading={setDisabled}
                        // selectedBusinessUnit={selectedBusinessUnit}
                        currentRowData={currentRowData}
                      />
                    </IViewModal>
                  </>
                </div>

                <h4 className="my-5 py-5 border-bottom">Asset Assign</h4>

                <div className="row">

                  <div className="col-lg-12">
                   <div className="table-responsive">
                   <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Employee Name</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignRowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.intMaintenanceNo}</td>
                            <td>{item?.strAssetCode}</td>
                            <td>{item?.strNameOfAsset}</td>
                            <td>{item?.strProblem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                   </div>
                  </div>
                  <>
                    <IViewModal
                      show={mdalShow}
                      onHide={() => setModalShow(false)}
                    >
                      <MaintenanceDetailReport
                        item={currentItem}
                        setModalShow={setModalShow}
                        values={values}
                        selectedBusinessUnit={selectedBusinessUnit}
                        setLoading={setDisabled}
                        // selectedBusinessUnit={selectedBusinessUnit}
                        currentRowData={currentRowData}
                      />
                    </IViewModal>
                  </>
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
