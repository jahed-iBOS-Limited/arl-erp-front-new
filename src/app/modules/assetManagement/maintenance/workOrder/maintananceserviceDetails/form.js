import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import { IInput } from "../../../../_helper/_input";
import Axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import NewSelect from "../../../../_helper/_select";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { getCostElement } from "../../../../inventoryManagement/warehouseManagement/itemRequest/helper";
// import { getInventoryCurrentBalance } from "./helper";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = Yup.object().shape({
  manuName: Yup.string().required("Request Date is required"),
});
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  warehouseDDl,
  serviceDDL,
  onClickForSparePArts,
  spareParts,
  onClickForsubMntTask,
  subTask,
  sparePartsDDL,
  rowDtoHandlerforSpareParts,
  rowDtoHandlerforSubTask,
  onClickforspareParts,
  onClickforDeletePArts,
  onClicksubServiceParts,
  onClickforDeleteSubService,
  accountId,
  selectedBusinessUnit,
  plantId,
  whId,
  maintenanceId,
}) {
  const [costeleDDL, setcosteleDDL] = useState([]);
  const [, getStockAndRate, stockAndRateLoader] = useAxiosPost();

  useEffect(() => {
    if (selectedBusinessUnit?.value) {
      getCostElement(selectedBusinessUnit?.value, setcosteleDDL);
    }
  }, [selectedBusinessUnit]);

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
            {stockAndRateLoader && <Loading />}
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-12">
                  <h5>Spare Parts</h5>
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    label="Select Warehouse"
                    options={warehouseDDl}
                    value={values?.warehouse}
                    name="warehouse"
                    placeholder="Select Warehouse"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue("parts", "");
                      setFieldValue("warehouse", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Select Parts</label>
                  <SearchAsyncSelect
                    selectedValue={values?.parts}
                    handleChange={(valueOption) => {
                      if (valueOption && values?.warehouse?.value) {
                        const payload = [
                          {
                            businessUnitId: selectedBusinessUnit?.value,
                            wareHouseId: values?.warehouse?.value,
                            itemId: valueOption?.value
                          }
                        ]
                        getStockAndRate(`/mes/ProductionEntry/GetRuningStockAndQuantityList`, payload, (res)=> {
                          const {numStockByDate, numStockRateByDate} = res?.[0] || {};
                          setFieldValue("stockQuantity", numStockByDate || 0);
                          setFieldValue("value", numStockRateByDate || 0);
                        });
                        // getInventoryCurrentBalance({ whId: values?.warehouse?.value, buId: selectedBusinessUnit?.value, itemId: valueOption?.value, setFieldValue, name: "value" });
                      }
                      setFieldValue("parts", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return Axios.get(
                        `/asset/DropDown/GetPartsList?AccountId=${accountId}&UnitId=${selectedBusinessUnit?.value}&PlantId=${plantId}&WHId=${values?.warehouse?.value}&searchTearm=${v}`
                      ).then((res) => res?.data);
                    }}
                    isDisabled={!values?.warehouse}
                  />
                  <FormikError
                    errors={errors}
                    name="assetNo"
                    touched={touched}
                  />
                  {/* <ISelect
                    label="Select Parts"
                    options={sparePartsDDL}
                    defaultValue={values?.parts}
                    name="parts"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  /> */}
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Select Cost Element"
                    options={costeleDDL || []}
                    value={values?.costElement}
                    placeholder="Select Cost Element"
                    name="costElement"
                    onChange={(valueOption) => {
                      setFieldValue("costElement", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.quantity}
                    label="Quantity"
                    placeholder="Quantity"
                    type="number"
                    name="quantity"
                    min="0"
                  />
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    placeholder="Remarks"
                    name="remarks"
                  />
                </div> */}
                <div className="col-lg-2">
                  <IInput
                    value={values?.stockQuantity}
                    label="Stock Quantity"
                    placeholder="Stock Quantity"
                    type="number"
                    name="stockQuantity"
                    disabled
                  />
                </div>
                <div className="col-lg-2">
                  <IInput
                    value={values?.value}
                    label="Value"
                    placeholder="Value"
                    type="number"
                    name="value"
                    disabled
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.narration}
                    label="Narration"
                    placeholder="Narration"
                    type="text"
                    name="narration"
                  />
                </div>
                <div className="col-lg-1" style={{ marginTop: "20px" }}>
                  <button
                    type="button"
                    disabled={
                      values.warehouse === "" ||
                      values.parts === "" ||
                      values.quantity === "" ||
                      values.value === ""
                    }
                    onClick={() => {
                      if(values?.quantity <= values?.stockQuantity) {
                        onClickForSparePArts(values);
                        setFieldValue("warehouse", "");
                        setFieldValue("parts", "");
                        setFieldValue("costElement", "");
                        setFieldValue("quantity", "");
                        setFieldValue("stockQuantity", 0);
                        setFieldValue("value", 0);
                      } else {
                        toast.warn("Quantity must be less than or equal to stock quantity!");
                      }
                    }}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>Qty</th>
                          <th>Value</th>
                          <th>Req. Code</th>
                          <th>Status</th>
                          <th>Total Amount</th>
                          <th>Narration</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {spareParts &&
                          spareParts?.map((item, i) => (
                            <tr key={i}>
                              <td className="text-center">{i + 1}</td>
                              <td className="text-center">{item.itemName}</td>
                              {/* <td className="text-center">{item.numQuantity}</td> */}
                              <td
                                className="text-center"
                                style={{ width: "150px" }}
                              >
                                <IInput
                                  value={spareParts[i]?.numQuantity}
                                  name="numQuantity"
                                  type="number"
                                  placeholder="Quantity"
                                  required
                                  onChange={(e) => {
                                    rowDtoHandlerforSpareParts(
                                      "numQuantity",
                                      e.target.value,
                                      i
                                    );
                                  }}
                                  min="0"
                                />
                              </td>
                              <td
                                className="text-center"
                                style={{ width: "150px" }}
                              >
                                <IInput
                                  value={spareParts[i]?.numPrice}
                                  name="numPrice"
                                  type="number"
                                  placeholder="Price"
                                  required
                                  onChange={(e) => {
                                    rowDtoHandlerforSpareParts(
                                      "numPrice",
                                      e.target.value,
                                      i
                                    );
                                  }}
                                  min="0"
                                />
                              </td>
                              <td className="text-center">
                                {item.itemRequestCode}
                              </td>
                              <td className="text-center">{item.status}</td>
                              <td className="text-center">{item.numAmount}</td>
                              <td className="text-center">
                                {item?.description}
                              </td>

                              <td
                                className="text-center"
                                style={{ width: "70px" }}
                              >
                                <div className="d-flex justify-content-around">
                                  <span onClick={() => onClickforspareParts(i)}>
                                    <IEdit />
                                  </span>

                                  <span
                                    onClick={() =>
                                      onClickforDeletePArts(item.rowId)
                                    }
                                  >
                                    <IDelete />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-12">
                  <h5>Sub Service Cost</h5>
                </div>

                <div className="col-lg-3">
                  <label>Select Service Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.serviceName}
                    handleChange={(valueOption) => {
                      setFieldValue("serviceName", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return Axios.get(
                        `/asset/Asset/GetSubTaskListDDL?AssetMaintenanceId=${maintenanceId}&searchTearm=${v}`
                      ).then((res) => res?.data);
                    }}
                    disabled={true}
                  />
                  <FormikError
                    errors={errors}
                    name="assetNo"
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Service Name"
                    options={serviceDDL}
                    value={values?.serviceName}
                    name="serviceName"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.serviceCost}
                    label="Service Cost"
                    placeholder="Service Cost"
                    type="number"
                    name="serviceCost"
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.descriptionSub}
                    label="Description"
                    placeholder="Description"
                    name="descriptionSub"
                  />
                </div>
                <div className="col-lg-3 mt-7">
                  <button
                    type="button"
                    disabled={
                      values.serviceName === "" ||
                      values.serviceCost === "" ||
                      values.descriptionSub === ""
                    }
                    onClick={() => {
                      onClickForsubMntTask(values);
                      setFieldValue("serviceName", "");
                      setFieldValue("serviceCost", "");
                      setFieldValue("descriptionSub", "");
                    }}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Service Name</th>
                          <th>Amount</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subTask &&
                          subTask?.map((item, i) => (
                            <tr key={i}>
                              <td className="text-center">{i + 1}</td>
                              <td className="text-center">
                                {item.serviceName}
                              </td>
                              <td
                                className="text-center"
                                style={{ width: "200px" }}
                              >
                                <IInput
                                  value={subTask[i]?.numAmount}
                                  name="numAmount"
                                  type="number"
                                  placeholder="Price"
                                  required
                                  onChange={(e) => {
                                    rowDtoHandlerforSubTask(
                                      "numAmount",
                                      e.target.value,
                                      i
                                    );
                                  }}
                                  min="0"
                                />
                              </td>
                              <td className="text-center">
                                {item.description}
                              </td>
                              {/* <td className="text-center">{item.numAmount}</td> */}
                              <td
                                className="text-center"
                                style={{ width: "200px" }}
                              >
                                <button
                                  type="button"
                                  onClick={() => onClicksubServiceParts(i)}
                                  className="btn btn-primary text-center mr-3"
                                >
                                  Update
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onClickforDeleteSubService(item.rowId)
                                  }
                                  className="btn btn-danger text-center"
                                >
                                  Remove
                                </button>
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
