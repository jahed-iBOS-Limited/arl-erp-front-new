/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { useEffect } from "react";
import {
  getProductDDL,
  getMaterialDDL,
  getGrossWeight,
  getSingleDataById,
  getShopFloorDDL,
  getUOMDDL,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { CostForBOMLanding } from "./../helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

const validationSchema = {
  bomName: Yup.string().required("Bom Name is required"),
  bomVersion: Yup.string()
    .required("Bom Version is required")
    .nullable(),
  lotSize: Yup.number().required("Lot Size is required"),
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
  bomId,
  itemSelectHandler,
  isEdit,
  setRowDto,
  plantId,
  id,
  UOMDDL,
  setUOMDDL,
  setDisabled,
  dataHandler,

  businessUnitId,
  accountId,

  // Cost Element Props
  costElementDDL,
  costElementRowData,
  removerCostElement,
  setCostElementRowData,
  costCenterDDL,
  headerItemUomDDL,
  setHeaderItemUomDDL,
  costTypeDDL,
  bomTypeDDL,
}) {
  const [, setValid] = useState(true);
  const [cost, setCost] = useState(0);
  //to get materialDDL in Edit
  useEffect(() => {
    if (plantId) {
      getMaterialDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plantId,
        setMaterial
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (plantId) {
      getMaterialDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plantId,
        setMaterial
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const withoutSelectedMaterialProducts = (values) => {
    if (product?.length > 0) {
      const modifiedProductDDL = product?.filter(
        (item) => item?.value !== values?.material?.value
      );
      return modifiedProductDDL;
    }
    return [];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          // material: id
          //   ? {
          //       value: id ? rowDto[0]?.material?.value : "",
          //       label: id ? rowDto[0]?.material?.label : "",
          //       description: id ? rowDto[0]?.material?.description : "",
          //       code: id ? rowDto[0]?.material?.code : "",
          //     }
          //   : "",
          // quantity: id ? rowDto[0]?.quantity : "",
        }}
        validationSchema={isEdit ? editValidation : createValiadtion}
        onSubmit={(values, { resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
            setCostElementRowData([]);
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
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-1 my-2">
                      <button
                        type="button"
                        disabled={!values?.copyfrombomname}
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          getSingleDataById(
                            values?.copyfrombomname?.value,
                            setSingleData,
                            setRowDto,
                            setCostElementRowData,
                            setDisabled
                          );
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
                          getShopFloorDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setShopFloor
                          );
                          getProductDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setProduct
                          );
                          getMaterialDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setMaterial
                          );
                          setFieldValue("plant", valueOption);
                          setFieldValue("plantId", valueOption?.value);
                          setFieldValue("shopFloor", "", "product", "");
                          setFieldValue("material", "");
                        }}
                        placeholder="Select Plant"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
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
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12">
                      <NewSelect
                        name="product"
                        options={
                          values?.material
                            ? withoutSelectedMaterialProducts(values)
                            : product || []
                        }
                        value={values?.product}
                        label="Item"
                        onChange={(valueOption) => {
                          getGrossWeight(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plant?.value,
                            valueOption?.value,
                            setNetWeight
                          );
                          setFieldValue("bomName", valueOption?.label);
                          setFieldValue("product", valueOption);
                          getUOMDDL(
                            valueOption?.value,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            setHeaderItemUomDDL,
                            setFieldValue,
                            "headerUOM"
                          );
                          CostForBOMLanding(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.shopFloor?.value,
                            valueOption?.value,
                            1,
                            setDisabled,
                            setCost
                          );
                        }}
                        placeholder="Select Item"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12">
                      <label>Bom Name</label>
                      <InputField
                        value={values?.bomName || ""}
                        name="bomName"
                        type="text"
                        placeholder="Bom Name"
                        disabled
                      />
                    </div>
                    <div className="col-lg-12">
                      <label>Bom Version</label>
                      <InputField
                        value={values?.bomVersion}
                        name="bomVersion"
                        type="text"
                        placeholder="Bom Version"
                      />
                    </div>
                    {[144, 188, 189].includes(selectedBusinessUnit?.value) && (
                      <div className="col-lg-12">
                        <NewSelect
                          name="bomType"
                          options={bomTypeDDL || []}
                          value={values?.bomType}
                          label="BOM Type"
                          onChange={(valueOption) => {
                            setFieldValue("bomType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          // isDisabled={isEdit}
                        />
                      </div>
                    )}
                    {/* <div className="col-lg-6">
                      <label>Bom Code</label>
                      <InputField
                        value={values?.bomCode || ""}
                        name="bomCode"
                        type="string"
                        placeholder="Bom Code"
                        disabled={isEdit ? true : false}
                      />
                    </div> */}

                    <div className="col-lg-6">
                      <NewSelect
                        name="headerUOM"
                        options={headerItemUomDDL || []}
                        value={values?.headerUOM}
                        label="Select UoM"
                        onChange={(valueOption) => {
                          setFieldValue("headerUOM", valueOption);
                        }}
                        placeholder="UoM"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>

                    <div className="col-lg-6">
                      <label>Lot Size</label>
                      <InputField
                        value={values?.lotSize || ""}
                        name="lotSize"
                        type="text"
                        step="any"
                        placeholder="Lot Size"
                      />
                    </div>
                    <div className="col-lg-6">
                      <label>Wastage %</label>
                      <InputField
                        value={values?.wastage || ""}
                        name="wastage"
                        type="string"
                        placeholder="Wastage"
                      />
                    </div>

                    <div className="col-lg-6 mt-3 mb-2 d-flex align-items-center">
                      <span>
                        <b> {`Total Cost: ${parseFloat(cost).toFixed(2)}`} </b>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 p-0 m-0">
                  {console.log(values?.material)}
                  {/* Table Header input */}
                  <div className={"row global-form m-0 px-0 py-2"}>
                    <div className="col-lg-4">
                      <label>Material</label>
                      <SearchAsyncSelect
                        selectedValue={values?.material || ""}
                        handleChange={(valueOption) => {
                          setFieldValue("material", valueOption);

                          getUOMDDL(
                            valueOption?.value,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            setUOMDDL,
                            setFieldValue,
                            "UOM"
                          );
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return axios
                            .get(
                              `/mes/MesDDL/GetItemNameRMDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&PlantId=${values?.plant?.value}&search=${v}`
                            )
                            .then((res) => {
                              const modifiedData = res?.data?.filter(
                                (item) => item?.value !== values?.product?.value
                              );
                              return modifiedData;
                            });
                        }}
                      />
                      {/* <NewSelect
                        name="material"
                        options={material || []}
                        value={values?.material || ""}
                        label="Material"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("material", valueOption);
                            getUOMDDL(
                              valueOption?.value,
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              setUOMDDL,
                              setFieldValue,
                              "UOM"
                            );


                          } else { }

                        }}
                        placeholder="Material"
                        errors={errors}
                        touched={touched}
                      /> */}
                    </div>
                    <div className="col-lg-4">
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
                        placeholder="UOM"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2 pl pr-1 mb-0">
                      <label>Quantity</label>
                      <IInput
                        value={values?.quantity || ""}
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
                      />
                    </div>

                    <div className="col-lg-1 pl-2 bank-journal">
                      <button
                        type="button"
                        disabled={!values?.material || !values?.quantity}
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          const isUniq = {
                            material: {
                              ...values?.material,
                              baseUomid: values?.UOM?.value,
                              description: values?.UOM?.label,
                            },
                            quantity: values?.quantity,
                            bommainItem: false,
                          };
                          setter(isUniq, "M", setFieldValue);
                          console.log("isUniq", isUniq);
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
                              <th style={{ width: "20px" }}>SL</th>
                              <th style={{ width: "50px" }}>Item Code</th>
                              <th style={{ width: "160px" }}>
                                <div className="text-left ml-2">Material</div>
                              </th>
                              <th style={{ width: "50px" }}>Qty</th>
                              <th style={{ width: "50px" }}>UoM</th>
                              <th style={{ width: "50px" }}>Is Main Item</th>
                              <th style={{ width: "30px" }}>Actions</th>
                            </tr>
                          </thead>
                          {console.log("rowDto", rowDto)}
                          <tbody>
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="pl-2 text-center">
                                    {item?.material?.code || item?.rowItemCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {item?.material?.label}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className="text-center"
                                    style={{ margin: "5px" }}
                                  >
                                    <input
                                      onChange={(e) => {
                                        dataHandler(
                                          "quantity",
                                          Math.abs(e.target.value),
                                          index
                                        );
                                      }}
                                      value={rowDto[index]?.quantity}
                                      step={"any"}
                                      min="0"
                                      required
                                      className="form-control"
                                      type="number"
                                      name="quantity"
                                    />
                                    {/* {item?.quantity} */}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.uomName ||
                                      item?.material?.description ||
                                      item?.values?.description}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    <input
                                      type="checkbox"
                                      checked={item?.bommainItem}
                                      onChange={(e) => {
                                        let data = [...rowDto];
                                        rowDto[index][
                                          "bommainItem"
                                        ] = !item?.bommainItem;
                                        setRowDto(data);
                                      }}
                                    />
                                  </div>
                                </td>

                                <td className="text-center">
                                  <IDelete
                                    remover={remover}
                                    id={item?.boMrowId}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Bill Of Expense Start Here */}
                  <div className={"row global-form m-0 px-0 py-2 mt-10"}>
                    <div className="col-lg-3">
                      <NewSelect
                        name="costCenter"
                        options={costCenterDDL || []}
                        value={values?.costCenter}
                        label="Cost Center"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", valueOption);
                        }}
                        placeholder="Cost Center"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="costElement"
                        options={costElementDDL || []}
                        value={values?.costElement}
                        label="Cost Element"
                        onChange={(valueOption) => {
                          setFieldValue("costElement", valueOption);
                        }}
                        placeholder="Cost Element"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="costType"
                        options={costTypeDDL || []}
                        value={values?.costType}
                        label="Cost Type"
                        onChange={(valueOption) => {
                          setFieldValue("costType", valueOption);
                        }}
                        placeholder="Cost Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}

                    <div className="col-lg-3 pl pr-1 mb-0">
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
                      />
                    </div>

                    <div className="col-lg-3 mt-5">
                      <button
                        type="button"
                        disabled={
                          !values?.costElementAmount ||
                          !values?.costElement?.value ||
                          !values?.costCenter?.value
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          const payload = {
                            // billOfExpenseId: 0,
                            costElementId: values?.costElement?.value,
                            costElementName: values?.costElement?.label,
                            amount: values?.costElementAmount,
                            costCenterId: values?.costCenter?.value,
                            costCenterName: values?.costCenter?.label,
                            productionCostType: values?.costType?.label,
                            ProductionCostTypeId: values?.costType?.value,
                            bommainItem: false,
                          };
                          setter(payload, "C", setFieldValue);
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
                            className={
                              costElementRowData?.length < 1 && "d-none"
                            }
                          >
                            <tr>
                              <th style={{ width: "20px" }}>SL</th>
                              <th style={{ width: "80px" }}>
                                <div className="text-left ml-2">
                                  Cost Center
                                </div>
                              </th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-2">
                                  Cost Of Element
                                </div>
                              </th>
                              {/* <th style={{ width: "100px" }}>Cost Type</th> */}
                              <th style={{ width: "60px" }}>
                                <div className="text-right">Amount</div>
                              </th>
                              <th style={{ width: "30px" }}>Actions</th>
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
                                {/* <td>
                                <div className="pl-2">
                                  {item?.productionCostType}
                                </div>
                              </td> */}
                                <td>
                                  <div className="text-right pr-2">
                                    {item?.amount}
                                  </div>
                                </td>

                                <td className="text-center">
                                  <IDelete
                                    remover={removerCostElement}
                                    id={index}
                                  />
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

// {/* <div className="col-lg-6 mt-2 d-flex align-items-center">
// <label>IsStandardBoM</label>
// <Field
//   name="isStandardBoM"
//   component={() => (
//     <input
//       type="checkbox"
//       className="checkbox ml-3 mb-3"
//       value={values?.isStandardBoM}
//       checked={values?.isStandardBoM}
//       name="isStandardBoM"
//       onChange={(e) => {
//         setFieldValue("isStandardBoM", e.target.checked);
//       }}
//     />
//   )}
// />
// </div> */}
