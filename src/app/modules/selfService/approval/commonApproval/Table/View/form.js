/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
import { IInput } from "../../../../../_helper/_input";

const validationSchema = {
  bomName: Yup.string().required("Bom Name is required"),
  bomVersion: Yup.string().required("Bom Version is required").nullable() ,
  lotSize: Yup.number()
    .min(1, "Minimum 1 Chracter")
    .max(10000000, "Maximum 10000000 Chracter")
    .required("Lot Size is required"),
  wastage: Yup.number()
    .min(0, "Minimum 0 Chracter")
    .max(10000000, "Maximum 10000000 Chracter")
    .required("Wastage is required"),
};

const createValiadtion = Yup.object().shape({
  ...validationSchema,
  plant: Yup.object().shape({
    label: Yup.string().required("Plant is required"),
    value: Yup.string().required("Plant is required"),
  }),
  shopFloor: Yup.object().shape({
    label: Yup.string().required("Shop Floor is required"),
    value: Yup.string().required("Shop Floor is required"),
  }),
  // bomCode: Yup.string().required("Bom Code is required"),
  product: Yup.object().shape({
    label: Yup.string().required("Item is required"),
    value: Yup.string().required("Item is required"),
  }),
});

const editValidation = Yup.object().shape({
  ...validationSchema,
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  remover,
  setter,
  plant,
  shopFloor,
  product,
  setProduct,
  material,
  setMaterial,
  profileData,
  selectedBusinessUnit,
  copyfrombomname,
  netWeight,
  setNetWeight,
  setShopFloor,
  singleData,
  setSingleData,
  setDisabled,
  bomId,
  itemSelectHandler,
  isEdit,
  setRowDto,
  plantId,
  id,
  UOMDDL,
  setUOMDDL,

  // Cost Element Props
  costElementDDL,
  costElementRowData,
  removerCostElement,
  setCostElementRowData,
}) {
  const [valid, setValid] = useState(true);
  //to get materialDDL in Edit
  

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          material: {
            value: id ? rowDto[0]?.material?.value : "",
            label: id ? rowDto[0]?.material?.label : "",
            description: id ? rowDto[0]?.material?.description : "",
            code: id ? rowDto[0]?.material?.code : "",
          },
          quantity: id ? rowDto[0]?.quantity : "",
        }}
        validationSchema={isEdit ? editValidation : createValiadtion}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
          setValid(true);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
          handleBlur,
          handleChange,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-4">
                  <div className="row global-form px-0 py-2 m-0">
                    <div className="col-lg-9 my-2">
                      <NewSelect
                        name="copyfrombomname"
                        options={copyfrombomname || []}
                        value={values?.copyfrombomname}
                        label="
                        Copy From BoM Name"
                        onChange={(valueOption) => {
                          setFieldValue("copyfrombomname", valueOption);
                        }}
                        placeholder="Select Bom Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-1 my-2">
                      <button
                        type="button"
                        disabled={true}
                        className="btn btn-primary mt-5"
                        onClick={() => {
                         
                        }}
                      >
                        GO
                      </button>
                    </div>
                    <div className="col-lg-6">
                      <NewSelect
                        name="plant"
                        options={plant || []}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setFieldValue("shopFloor", {}, "product", {});
                          setFieldValue("material", {});
                        }}
                        placeholder="Select Plant"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-6">
                      <NewSelect
                        name="shopFloor"
                        options={shopFloor || []}
                        value={values?.shopFloor}
                        label="Shop Floor"
                        onChange={(valueOption) => {
                          setFieldValue("shopFloor", valueOption);
                        }}
                        placeholder="Select Shop Floor"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-12">
                      <label>Bom Name</label>
                      <InputField
                        value={values?.bomName || ""}
                        name="bomName"
                        type="text"
                        placeholder="Bom Name"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12">
                      <label>Bom Version</label>
                      <InputField
                        value={values?.bomVersion}
                        name="bomVersion"
                        type="text"
                        placeholder="Bom Version"
                        disabled={true}
                      />
                    </div>
                    {/* <div className="col-lg-6">
                      <label>Bom Code</label>
                      <InputField
                        value={values?.bomCode || ""}
                        name="bomCode"
                        type="string"
                        placeholder="Bom Code"
                        disabled={true}
                      />
                    </div> */}
                    <div className="col-lg-12">
                      <NewSelect
                        name="product"
                        options={product || []}
                        value={values?.product}
                        label="Item"
                        onChange={(valueOption) => {
                          
                          setFieldValue("product", valueOption);
                        }}
                        placeholder="Select Item"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>

                    <div className="col-lg-6">
                      <NewSelect
                        name="headerUOM"
                        options={[]}
                        value={values?.headerUOM}
                        label="Select UoM"
                        onChange={(valueOption) => {
                          setFieldValue("headerUOM", valueOption);
                        }}
                        placeholder="UoM"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-6">
                      <label>Lot Size</label>
                      <InputField
                        value={values?.lotSize || ""}
                        name="lotSize"
                        type="string"
                        placeholder="Lot Size"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-6">
                      <label>Wastage %</label>
                      <InputField
                        value={values?.wastage || ""}
                        name="wastage"
                        type="string"
                        placeholder="Wastage"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-6 mt-2 d-flex align-items-center">
                      <label>IsStandardBoM</label>
                      <Field
                        name="isStandardBoM"
                        component={() => (
                          <input
                            type="checkbox"
                            disabled={true}
                            className="checkbox ml-3 mb-3"
                            value={values?.isStandardBoM}
                            checked={values?.isStandardBoM}
                            name="isStandardBoM"
                            onChange={(e) => {
                              setFieldValue("isStandardBoM", e.target.checked);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 p-0 m-0">
                  {/* Table Header input */}
                  <div className={"row global-form m-0 px-0 py-2"}>
                    <div className="col-lg-4">
                      <NewSelect
                        name="material"
                        options={material || []}
                        // value={values?.material}
                        label="
                        Material"
                        onChange={(valueOption) => {
                          setFieldValue("material", valueOption);
                          setFieldValue("UOM", {
                            label: valueOption?.description,
                            value: valueOption?.baseUomid,
                          });
                        }}
                        placeholder="Select Material"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                           
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="UOM"
                        options={UOMDDL || []}
                        value={values?.UOM}
                        label="
                        UOM"
                        onChange={(valueOption) => {
                          setFieldValue("UOM", valueOption);
                          setFieldValue("uom", valueOption);
                        }}
                        placeholder="Select UOM"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-0">
                      <label>Quantity</label>
                      <IInput
                        // value={values?.quantity || ""}
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("quantity", e.target.value);
                          } else {
                            setFieldValue("quantity", "");
                          }
                        }}
                        disabled={true}
                      />
                         
                    </div>

                    <div className="col-lg-1 pl-2 bank-journal">
                      <button
                        type="button"
                        disabled={true}
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          const isUniq = {
                            material: {
                              ...values?.material,
                              baseUomid: values?.UOM?.value,
                              description: values?.UOM?.label,
                            },
                            quantity: values?.quantity,
                          };
                          setter(isUniq, "M");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Table Header input end */}
                  <div className="row">
                    <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className={"table mt-1 bj-table"}>
                        <thead className={rowDto?.length === 0 && "d-none"}>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "120px" }}>Material</th>
                            <th style={{ width: "100px" }}>Qty</th>
                            <th style={{ width: "100px" }}>UoM</th>
                            {/* <th style={{ width: "50px" }}>Actions</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {item?.material?.label}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.quantity}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.uomName ||
                                    item?.material?.description ||
                                    item?.values?.description}
                                </div>
                              </td>

                              {/* <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>

                  {/* Bill Of Expense Start Here */}
                  <div className={"row global-form m-0 px-0 py-2 mt-10"}>
                    <div className="col-lg-4">
                      <NewSelect
                        name="costCenter"
                        options={[]}
                        value={values?.costCenter}
                        label="Cost Center"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", valueOption);
                        }}
                        placeholder="Select Cost Center"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                           
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="costElement"
                        options={costElementDDL || []}
                        value={values?.costElement}
                        label="Cost Element"
                        onChange={(valueOption) => {
                          setFieldValue("costElement", valueOption);
                        }}
                        placeholder="Select Cost Element"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                           
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-0">
                      <label>Amount</label>
                      <IInput
                        value={values?.costElementAmount || ""}
                        name="costElementAmount"
                        type="number"
                        placeholder="Amount"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setFieldValue("costElementAmount", e.target.value);
                          } else {
                            setFieldValue("costElementAmount", "");
                          }
                        }}
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-1 pl-2 bank-journal">
                      <button
                        type="button"
                        disabled={true}
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          const payload = {
                            billOfExpenseId: 0,
                            costElementId: values?.costElement?.value,
                            costElementName: values?.costElement?.label,
                            amount: values?.costElementAmount,
                          };
                          setter(payload, "C");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className={"table mt-1 bj-table"}>
                        <thead
                          className={costElementRowData?.length < 1 && "d-none"}
                        >
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "80px" }}>Cost Center</th>
                            <th style={{ width: "100px" }}>Cost Of Element</th>
                            <th style={{ width: "100px" }}>Cost Type</th>
                            <th style={{ width: "60px" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {costElementRowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {item?.costCenterName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.costElementName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.productionCostType}
                                </div>
                              </td>
                              <td>
                                <div className="text-center pr-2">
                                  {item?.amount}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                  {/* Bill Of Expense Start End Here */}
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
