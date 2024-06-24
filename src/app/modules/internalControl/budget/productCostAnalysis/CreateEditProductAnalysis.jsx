/* eslint-disable no-unused-vars */
import React, { useState, useEffet } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useLocation, useHistory } from "react-router";

// import {
//   getProductDDL,
//   getMaterialDDL,
//   getGrossWeight,
//   getSingleDataById,
//   getShopFloorDDL,
// } from "../helper";
import NewSelect from "../../../_helper/_select";
import { IInput } from "../../../_helper/_input";
import InputField from "../../../_helper/_inputField";
import ICustomCard from "../../../_helper/_customCard";

const validationSchema = {
  bomName: Yup.string().required("Bom Name is required"),
  bomVersion: Yup.string().required("Bom Version is required"),
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

export default function CreateEditProductAnalysis() {
  const [valid, setValid] = useState(true);
  //to get materialDDL in Edit
  //   useEffect(() => {
  //     if (plantId) {
  //       getMaterialDDL(
  //         profileData?.accountId,
  //         selectedBusinessUnit?.value,
  //         plantId,
  //         setMaterial
  //       );
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          {
            //   ...initData,
            //   material: {
            //     value: id ? rowDto[0]?.material?.value : "",
            //     label: id ? rowDto[0]?.material?.label : "",
            //     description: id ? rowDto[0]?.material?.description : "",
            //     code: id ? rowDto[0]?.material?.code : "",
            //   },
            //   quantity: id ? rowDto[0]?.quantity : "",
          }
        }
        validationSchema={{}} //isEdit ? editValidation : createValiadtion}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          //   saveHandler(values, () => {
          //     resetForm(initData);
          //     setRowDto([]);
          //   });
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
            <ICustomCard
              title="Product Cost Analysis"
              renderProps={() => (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    history.push({
                      pathname:
                        "/internal-control/budget/ProductCostAnalysis/create",
                    });
                  }}
                >
                  Create
                </button>
              )}
            >
              <Form className="form form-label-right">
                <div className="row mt-2">
                  <div className="col-lg-12 p-0 m-0">
                    {/* Table Header input */}
                    <div className={"row global-form m-0 px-0 py-2"}>
                      <div className="col-lg-4">
                        <NewSelect
                          name="material"
                          options={[]}
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
                          options={[]}
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
                            //   setter(isUniq, "M");
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
                            <thead className={[]?.length === 0 && "d-none"}>
                              <tr>
                                <th style={{ width: "30px" }}>SL</th>
                                <th style={{ width: "120px" }}>Material</th>
                                <th style={{ width: "120px" }}>Item Code</th>
                                <th style={{ width: "100px" }}>Qty</th>
                                <th style={{ width: "100px" }}>UoM</th>
                                {/* <th style={{ width: "50px" }}>Actions</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {[]?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.material?.label}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {item?.rowItemCode}
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
                          options={[]}
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
                              setFieldValue(
                                "costElementAmount",
                                e.target.value
                              );
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
                            //   setter(payload, "C");
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
                            <thead className={[]?.length < 1 && "d-none"}>
                              <tr>
                                <th style={{ width: "20px" }}>SL</th>
                                <th style={{ width: "80px" }}>Cost Center</th>
                                <th style={{ width: "100px" }}>
                                  Cost Of Element
                                </th>
                                <th style={{ width: "100px" }}>Cost Type</th>
                                <th style={{ width: "60px" }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[]?.map((item, index) => (
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
                                    <div className="text-right pr-2">
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

                {/* <button
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
              ></button> */}
              </Form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
