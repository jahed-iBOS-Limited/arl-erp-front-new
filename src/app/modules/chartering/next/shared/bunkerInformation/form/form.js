import { Formik } from "formik";
import React from "react";
import { useHistory, useLocation } from "react-router";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import ICustomTable from "../../../../_chartinghelper/_customTable";

export default function Form({
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  // bunkerPurchase,
  purchaseList,
  getConsumption,
  isCalculated,
}) {
  const { state: preData } = useLocation();
  const history = useHistory();

  const headers = [
    { name: "SL" },
    { name: "Item Name" },
    { name: "Item Quantity" },
  ];

  const setData = (
    values,
    targetValue,
    value,
    setFieldValue,
    qtyFieldOne,
    qtyFieldTwo,
    valueFieldOne,
    valueFieldTwo,
    rateFieldOne,
    rateFieldTwo
  ) => {
    if (preData?.shipType?.value === 1) {
      if (targetValue > value) {
        setFieldValue(qtyFieldOne, targetValue - value);
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(
          valueFieldTwo,
          (targetValue - value) * values[rateFieldTwo]
        );
        setFieldValue(valueFieldOne, "");
      } else if (targetValue < value) {
        setFieldValue(qtyFieldTwo, value - targetValue);
        setFieldValue(qtyFieldOne, "");
        setFieldValue(
          valueFieldOne,
          (value - targetValue) * values[rateFieldOne]
        );
        setFieldValue(valueFieldTwo, "");
      } else {
        setFieldValue(qtyFieldOne, "");
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(valueFieldOne, "");
        setFieldValue(valueFieldTwo, "");
      }
    } else if (preData?.shipType?.value === 2) {
      if (targetValue > value) {
        setFieldValue(qtyFieldTwo, targetValue - value); // targetValue = bor, value = bod
        setFieldValue(qtyFieldOne, "");
        setFieldValue(
          valueFieldOne,
          (targetValue - value) * values[rateFieldTwo]
        );
        setFieldValue(valueFieldTwo, "");
      } else if (targetValue < value) {
        setFieldValue(qtyFieldOne, value - targetValue);
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(
          valueFieldTwo,
          (value - targetValue) * values[rateFieldOne]
        );
        setFieldValue(valueFieldOne, "");
      } else {
        setFieldValue(qtyFieldOne, "");
        setFieldValue(qtyFieldTwo, "");
        setFieldValue(valueFieldOne, "");
        setFieldValue(valueFieldTwo, "");
      }
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Bunker Information</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.push({
                        pathname: `/chartering/next/${
                          preData?.voyageType?.value === 1
                            ? "ballastPassage"
                            : "bunkerCost"
                        }`,
                        state: preData,
                      });
                    }}
                    className={"btn btn-danger px-3 py-2"}
                  >
                    Skip
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save & Next
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row p-3">
                  <div className="col-lg-6">
                    <p style={{ fontSize: "15px" }}>
                      <b>Vessel Name & Voyage No: </b>{" "}
                      {values?.vesselName?.label} & V{values?.voyageNo?.label}{" "}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <p style={{ fontSize: "15px" }}>
                      <b>Voyage Type: </b> {values?.voyageType?.label}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <p style={{ fontSize: "15px" }}>
                      <b>Ship Type: </b> {values?.shipType?.label}
                    </p>
                  </div>

                  {/* 
                  
                  BOD
                  
                  */}

                  <div className="pt-3 px-2 col-lg-4">
                    <div
                      className="p-3 shadow-sm rounded"
                      style={{ backgroundColor: "#dbeafe" }}
                    >
                      <h6 className="text-center">
                        <b>BOD</b>{" "}
                      </h6>

                      <div className="">
                        <label>LSMGO QTY</label>
                        <FormikInput
                          value={values?.bodLsmgoQty}
                          name="bodLsmgoQty"
                          placeholder="LSMGO QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={values?.voyageNo?.label !== "1" || viewType}
                        />
                      </div>
                      <div className="">
                        <label>LSFO-1 QTY</label>
                        <FormikInput
                          value={values?.bodLsfo1Qty}
                          name="bodLsfo1Qty"
                          placeholder="LSFO-1 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={values?.voyageNo?.label !== "1" || viewType}
                        />
                      </div>
                      <div className="">
                        <label>LSFO-2 QTY</label>
                        <FormikInput
                          value={values?.bodLsfo2Qty}
                          name="bodLsfo2Qty"
                          placeholder="LSFO-2 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={values?.voyageNo?.label !== "1" || viewType}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 
                  
                  BOR
                  
                  */}
                  <div className="pt-3 px-2 col-lg-4">
                    <div
                      className="p-3 shadow-sm rounded"
                      style={{ backgroundColor: "#dbeafe" }}
                    >
                      <div className="text-center">
                        <h6>
                          {" "}
                          <b>BOR</b>{" "}
                        </h6>
                      </div>
                      <div className="">
                        <label>LSMGO QTY</label>
                        <FormikInput
                          value={values?.borLsmgoQty}
                          name="borLsmgoQty"
                          placeholder="LSMGO QTY"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("borLsmgoQty", e?.target?.value);
                            setData(
                              values,
                              e?.target?.value,
                              values?.bodLsmgoQty,
                              setFieldValue,
                              "bunkerPurchaseLsmgoQty",
                              "bunkerSaleLsmgoQty",
                              "bunkerSaleLsmgoValue",
                              "bunkerPurchaseLsmgoValue",
                              "bunkerSaleLsmgoRate",
                              "bunkerPurchaseLsmgoRate"
                            );
                            // setFieldValue(
                            //   "consumptionLsmgoQty",
                            //   values?.bodLsmgoQty - e?.target?.value
                            // );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="">
                        <label>LSFO-1 QTY</label>
                        <FormikInput
                          value={values?.borLsfo1Qty}
                          name="borLsfo1Qty"
                          placeholder="LSFO-1 QTY"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("borLsfo1Qty", e?.target?.value);
                            setData(
                              values,
                              e?.target?.value,
                              values?.bodLsfo1Qty,
                              setFieldValue,
                              "bunkerPurchaseLsfo1Qty",
                              "bunkerSaleLsfo1Qty",
                              "bunkerSaleLsfo1Value",
                              "bunkerPurchaseLsfo1Value",
                              "bunkerSaleLsfo1Rate",
                              "bunkerPurchaseLsfo1Rate"
                            );
                            // setFieldValue(
                            //   "consumptionLsfo1Qty",
                            //   values?.bodLsfo1Qty - e?.target?.value
                            // );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="">
                        <label>LSFO-2 QTY</label>
                        <FormikInput
                          value={values?.borLsfo2Qty}
                          name="borLsfo2Qty"
                          placeholder="LSFO-2 QTY"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("borLsfo2Qty", e.target.value);

                            setData(
                              values,
                              e?.target?.value,
                              values?.bodLsfo2Qty,
                              setFieldValue,
                              "bunkerPurchaseLsfo2Qty",
                              "bunkerSaleLsfo2Qty",
                              "bunkerSaleLsfo2Value",
                              "bunkerPurchaseLsfo2Value",
                              "bunkerSaleLsfo2Rate",
                              "bunkerPurchaseLsfo2Rate"
                            );
                            // setFieldValue(
                            //   "consumptionLsfo2Qty",
                            //   values?.bodLsfo2Qty - e?.target?.value
                            // );
                          }}
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 
                  
                  Adjustment
                  
                */}

                  <div className="pt-3 px-2 col-lg-4">
                    <div
                      className="p-3 shadow-sm rounded"
                      style={{ backgroundColor: "#dbeafe" }}
                    >
                      <div className="text-center">
                        <h6>
                          {" "}
                          <b>Adjustment</b>{" "}
                        </h6>
                      </div>
                      <div className=" ">
                        <label>LSMGO QTY</label>
                        <FormikInput
                          value={values?.adjustmentLsmgoQty}
                          name="adjustmentLsmgoQty"
                          placeholder="LSMGO QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className=" ">
                        <label>LSFO-1 QTY</label>
                        <FormikInput
                          value={values?.adjustmentLsfo1Qty}
                          name="adjustmentLsfo1Qty"
                          placeholder="LSFO-1 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className=" ">
                        <label>LSFO-2 QTY</label>
                        <FormikInput
                          value={values?.adjustmentLsfo2Qty}
                          name="adjustmentLsfo2Qty"
                          placeholder="LSFO-2 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                    </div>
                  </div>

                  {((values?.voyageNo?.voyageTypeName || values?.voyageType) ===
                    "Voyage Charter" ||
                    viewType === "view") && (
                    <>
                      <div className="col-lg-6"> </div>
                      <div className="col-lg-6">
                        <ICustomTable ths={headers}>
                          {purchaseList?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.itemQty}</td>
                            </tr>
                          ))}
                        </ICustomTable>{" "}
                      </div>
                    </>
                  )}

                  {/* 
                  
                  Bunker Sale
                  
                  */}

                  {(values?.voyageType?.value === 1 ||
                    values?.voyageType?.value === 1) && (
                    <>
                      <div className="pt-3 px-2 col-lg-6">
                        <div
                          className="p-3 shadow-sm rounded"
                          style={{ backgroundColor: "#dbeafe" }}
                        >
                          <div className="text-center">
                            <h6>
                              <b>Bunker Sale</b>{" "}
                            </h6>
                          </div>
                          <div className="row">
                            <div className="col-lg-4">
                              <label>LSMGO QTY</label>
                              <FormikInput
                                value={values?.bunkerSaleLsmgoQty}
                                name="bunkerSaleLsmgoQty"
                                placeholder="LSMGO QTY"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSMGO Rate</label>
                              <FormikInput
                                value={values?.bunkerSaleLsmgoRate}
                                name="bunkerSaleLsmgoRate"
                                placeholder="LSMGO Rate"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSMGO Value</label>
                              <FormikInput
                                value={values?.bunkerSaleLsmgoValue}
                                name="bunkerSaleLsmgoValue"
                                placeholder="LSMGO Value"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSFO-1 QTY</label>
                              <FormikInput
                                value={values?.bunkerSaleLsfo1Qty}
                                name="bunkerSaleLsfo1Qty"
                                placeholder="LSFO-1 QTY"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSFO-1 Rate</label>
                              <FormikInput
                                value={values?.bunkerSaleLsfo1Rate}
                                name="bunkerSaleLsfo1Rate"
                                placeholder="LSFO-1 Rate"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSFO-1 Value</label>
                              <FormikInput
                                value={values?.bunkerSaleLsfo1Value}
                                name="bunkerSaleLsfo1Value"
                                placeholder="LSFO-1 Value"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSFO-2 QTY</label>
                              <FormikInput
                                value={values?.bunkerSaleLsfo2Qty}
                                name="bunkerSaleLsfo2Qty"
                                placeholder="LSFO-2 QTY"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSFO-2 Rate</label>
                              <FormikInput
                                value={values?.bunkerSaleLsfo2Rate}
                                name="bunkerSaleLsfo2Rate"
                                placeholder="LSFO-2 Rate"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label>LSFO-2 Value</label>
                              <FormikInput
                                value={values?.bunkerSaleLsfo2Value}
                                name="bunkerSaleLsfo2Value"
                                placeholder="LSFO-2 Value"
                                type="number"
                                errors={errors}
                                touched={touched}
                                disabled={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      {/* 
                      
                      Bunker Purchase
                      
                      */}
                      <>
                        <div className="pt-3 px-2 col-lg-6">
                          <div
                            className="p-3 shadow-sm rounded"
                            style={{ backgroundColor: "#dbeafe" }}
                          >
                            <div className="text-center">
                              <h6>
                                {" "}
                                <b>Bunker Purchase</b>{" "}
                              </h6>
                            </div>
                            <div className="row">
                              <div className="col-lg-4">
                                <label>LSMGO QTY</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsmgoQty}
                                  name="bunkerPurchaseLsmgoQty"
                                  placeholder="LSMGO QTY"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSMGO Rate</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsmgoRate}
                                  name="bunkerPurchaseLsmgoRate"
                                  placeholder="LSMGO Rate"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSMGO Value</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsmgoValue}
                                  name="bunkerPurchaseLsmgoValue"
                                  placeholder="LSMGO Value"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSFO-1 QTY</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsfo1Qty}
                                  name="bunkerPurchaseLsfo1Qty"
                                  placeholder="LSFO-1 QTY"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSFO-1 Rate</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsfo1Rate}
                                  name="bunkerPurchaseLsfo1Rate"
                                  placeholder="LSFO-1 Rate"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSFO-1 Value</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsfo1Value}
                                  name="bunkerPurchaseLsfo1Value"
                                  placeholder="LSFO-1 Value"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSFO-2 QTY</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsfo2Qty}
                                  name="bunkerPurchaseLsfo2Qty"
                                  placeholder="LSFO-2 QTY"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSFO-2 Rate</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsfo2Rate}
                                  name="bunkerPurchaseLsfo2Rate"
                                  placeholder="LSFO-2 Rate"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                              <div className="col-lg-4">
                                <label>LSFO-2 Value</label>
                                <FormikInput
                                  value={values?.bunkerPurchaseLsfo2Value}
                                  name="bunkerPurchaseLsfo2Value"
                                  placeholder="LSFO-2 Value"
                                  type="number"
                                  errors={errors}
                                  touched={touched}
                                  disabled={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </>
                  )}
                  {/* 
                  
                  Consumption
                  
                  */}
                  <div className="pt-3 px-2 col-lg-4">
                    <div
                      className="p-3 shadow-sm rounded"
                      style={{ backgroundColor: "#dbeafe" }}
                    >
                      <div className="">
                        <div className="d-flex justify-content-center align-items-center">
                          <h6>
                            {" "}
                            <b>Consumption</b>{" "}
                          </h6>
                          {(values?.voyageType?.value ||
                            values?.voyageType?.value) === 2 && (
                            <button
                              className="btn btn-primary ml-2"
                              type="button"
                              onClick={() => {
                                getConsumption(values, setFieldValue);
                              }}
                              disabled={
                                viewType === "view" ||
                                (values?.borLsmgoQty < 1 &&
                                  values?.borLsfo1Qty < 1 &&
                                  values?.borLsfo2Qty < 1) ||
                                isCalculated
                              }
                            >
                              Calculate
                            </button>
                          )}
                        </div>
                      </div>
                      <div className=" ">
                        <label>LSMGO QTY</label>
                        <FormikInput
                          value={
                            values?.consumptionLsmgoQty ||
                            values?.consumptionLsmgoqty
                          }
                          name="consumptionLsmgoQty"
                          placeholder="LSMGO QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className=" ">
                        <label>LSFO-1 QTY</label>
                        <FormikInput
                          value={
                            values?.consumptionLsfo1Qty ||
                            values?.consumptionLsfo1qty
                          }
                          name="consumptionLsfo1Qty"
                          placeholder="LSFO-1 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                      <div className=" ">
                        <label>LSFO-2 QTY</label>
                        <FormikInput
                          value={
                            values?.consumptionLsfo2Qty ||
                            values?.consumptionLsfo2qty
                          }
                          name="consumptionLsfo2Qty"
                          placeholder="LSFO-2 QTY"
                          type="number"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
