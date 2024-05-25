import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { getRowMaterialsById } from "../helper";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";

// Validation schema
const validationSchema = Yup.object().shape({
  taxItemName: Yup.object().shape({
    value: Yup.string().required("Item Name is required"),
    label: Yup.string().required("Item Name is required"),
  }),

  validFrom: Yup.date().required("Valid Date From is required"),
  validTo: Yup.date().required("Valid Date To is required"),
  basePrice: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000, "Maximum 1000000000000 range")
    .required("Base Price is required"),

  sdpercentage: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000, "Maximum 1000000000000 range")
    .required("SD(%) is required"),
  vatpercentage: Yup.number()
    .min(0, "Minimum 0 range")
    .required("VAT is required"),
  surchargePercentage: Yup.number()
    .min(0, "Minimum 0 range")
    .max(100, "Maximum 100 range")
    .required("Surcharge(%) is required"),
  isOnQty: Yup.bool(),
  priceDeclare: Yup.bool(),
  matItemName: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
  quantity: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000, "Maximum 1000000000000 range"),
  westageQty: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000, "Maximum 1000000000000 range"),
  rate: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000, "Maximum 1000000000000 range"),
  valueAdditionName: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
  valueAmount: Yup.number()
    .min(0, "Minimum 0 range")
    .max(1000000000000, "Maximum 1000000000000 range"),
  isPriceIncludingTax: Yup.bool(),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  supplyTypeDDL,
  totalTaxPrice,
  setTotalTaxPrice,
  setVatAmount,
  setValueAddRowDto,
  setDisabled,
  matItemNameDDL,
  matRowDto,
  matSetter,
  matRemover,
  valueAdditionDDL,
  valueAddRowDto,
  valueAddSetter,
  valueAddRemover,
  isEdit,
  copyFromItems,
  setMatRowDto,
}) {
  // const dispatch = useDispatch();

  // get tax item name ddl from store
  const taxItemNameDDL = useSelector((state) => {
    return state?.taxPriceSetup?.taxItemNameDDL;
  }, shallowEqual);
  const [itemTotal, setItemTotal] = useState(0);

  useEffect(() => {
    const total1 = matRowDto?.reduce((acc, obj) => acc + +obj?.numRate, 0);
    const total2 = valueAddRowDto?.reduce(
      (acc, obj) => acc + obj?.numTotalValue,
      0
    );
    const total = total1 + total2;
    setItemTotal(total);
  }, [matRowDto, valueAddRowDto]);

  const calculation = (values) => {
    let basePriceAmount = +values?.basePrice || 0;
    let sdAmount = (basePriceAmount / 100) * (+values?.sdpercentage || 0);
    let surchargeAmount =
      (basePriceAmount / 100) * (+values?.surchargePercentage || 0);

    const vatAmount = values?.isOnQty
      ? +values?.vatpercentage || 0
      : (basePriceAmount + sdAmount) * ((+values?.vatpercentage || 0) / 100);

    setTotalTaxPrice(
      values?.basePrice + sdAmount + vatAmount + surchargeAmount
    );
    setVatAmount(vatAmount);
  };
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
            {calculation(values)}

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <>
                      <div className="col-lg-3 offset-9 mb-2">
                        <div className="text-right">
                          <b>
                            Total Tax Price :
                            {values?.basePrice ? _fixedPoint(totalTaxPrice) : 0}
                          </b>{" "}
                        </div>
                      </div>
                      <div className="col-lg-2 mb-2">
                        <NewSelect
                          name="taxItemName"
                          options={taxItemNameDDL}
                          value={values?.taxItemName}
                          label="Tax Item Name"
                          onChange={(valueOption) => {
                            setFieldValue("uom", valueOption?.uomName);
                            setFieldValue("uomId", valueOption?.uomId);
                            setFieldValue("taxItemName", valueOption);
                          }}
                          placeholder="Tax Item Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <label>UOM</label>
                        <InputField
                          value={values?.uom || ""}
                          name="uom"
                          placeholder="UOM"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <div>Valid From Date</div>
                        <input
                          className="trans-date cj-landing-date"
                          value={values?.validFrom}
                          name="validFrom"
                          onChange={(e) => {
                            setFieldValue("validFrom", e.target.value);
                          }}
                          type="date"
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <div>Valid To Date</div>
                        <input
                          className="trans-date cj-landing-date"
                          value={values?.validTo}
                          name="validTo"
                          onChange={(e) => {
                            setFieldValue("validTo", e.target.value);
                          }}
                          type="date"
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <label>Base Price</label>
                        <InputField
                          value={values?.basePrice || ""}
                          name="basePrice"
                          placeholder="Base Price"
                          type="number"
                          min="0"
                          step="any"
                        />
                      </div>
                      <div className="col-lg-2">
                        <div
                          style={{ position: "relative", top: "15px" }}
                          className="mr-2"
                        >
                          <label htmlFor="isPriceIncludingTax">
                            Price Including Tax
                          </label>
                          <Field
                            name="isPriceIncludingTax"
                            component={() => (
                              <input
                                id="isPriceIncludingTax"
                                type="checkbox"
                                style={{ position: "relative", top: "2px" }}
                                label="Price Including Tax"
                                className="ml-2"
                                value={values?.isPriceIncludingTax || false}
                                checked={values?.isPriceIncludingTax}
                                name="isPriceIncludingTax"
                                onChange={(e) => {
                                  setFieldValue(
                                    "isPriceIncludingTax",
                                    e.target.checked
                                  );
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="taxSupplyType"
                          options={supplyTypeDDL || []}
                          value={values?.taxSupplyType}
                          label="Tax Supply Type"
                          onChange={(valueOption) => {
                            setFieldValue("taxSupplyType", valueOption);
                            if (valueOption?.value === 5) {
                              setFieldValue("isOnQty", true);
                            } else if (valueOption?.value === 3) {
                              setFieldValue("sdpercentage", 10);
                              setFieldValue("vatpercentage", 15);
                              setFieldValue("surchargePercentage", 10);
                              setFieldValue("isOnQty", false);
                            } else {
                              setFieldValue("sdpercentage", 0);
                              setFieldValue("vatpercentage", 0);
                              setFieldValue("surchargePercentage", 0);
                              setFieldValue("isOnQty", false);
                            }
                          }}
                          placeholder="Tax Supply Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <label>SD(%)</label>
                        <InputField
                          value={values?.sdpercentage}
                          name="sdpercentage"
                          placeholder="SD(%)"
                          type="number"
                          min="0"
                          disabled={values?.isOnQty}
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <label>VAT {values?.isOnQty ? "Amount" : "(%)"}</label>
                        <InputField
                          value={values?.vatpercentage}
                          name="vatpercentage"
                          placeholder={`VAT ${
                            values?.isOnQty ? "Amount" : "(%)"
                          }`}
                          type="number"
                          min="0"
                          onChange={(e) => {
                            if (!values?.isOnQty) {
                              if (e.target.value <= 100) {
                                setFieldValue("vatpercentage", e.target.value);
                              }
                            } else {
                              setFieldValue("vatpercentage", e.target.value);
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <label>Surcharge(%)</label>
                        <InputField
                          value={values?.surchargePercentage}
                          name="surchargePercentage"
                          placeholder="Surcharge(%)"
                          type="number"
                          min="0"
                          disabled={values?.isOnQty}
                        />
                      </div>
                      <div className="col-lg-2">
                        <div
                          style={{ position: "relative", top: "15px" }}
                          className="mr-2"
                        >
                          <label htmlFor="isOnQty">Fix Rate?</label>
                          <Field
                            name="isOnQty"
                            component={() => (
                              <input
                                id="isOnQty"
                                type="checkbox"
                                style={{ position: "relative", top: "2px" }}
                                label="Fix Rate?"
                                className="ml-2"
                                value={values?.isOnQty || false}
                                checked={values?.isOnQty}
                                name="isOnQty"
                                onChange={(e) => {
                                  setFieldValue("isOnQty", e.target.checked);
                                  setFieldValue("vatpercentage", 0);
                                  if (e.target.checked) {
                                    setFieldValue("surchargePercentage", 0);
                                    setFieldValue("sdpercentage", 0);
                                  }
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="d-flex align-items-center my-2">
                    <h5 className="mr-2">Want to 4.3 ?</h5>
                    <div>
                      <Field
                        name="priceDeclare"
                        component={() => (
                          <input
                            id="priceDeclare"
                            type="checkbox"
                            label="Want to Declare Price?"
                            className="ml-2"
                            value={values?.priceDeclare || false}
                            checked={values?.priceDeclare}
                            name="priceDeclare"
                            onChange={(e) => {
                              setFieldValue("priceDeclare", e.target.checked);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right col-lg-6 pt-3">
                  <b>
                    {values?.taxItemName?.label}: {_fixedPoint(itemTotal)}
                  </b>{" "}
                </div>
              </div>
              {values?.priceDeclare === true && (
                <div className="row">
                  <div className="col-lg-8">
                    <div className="row bank-journal bank-journal-custom bj-left mr-1">
                      <>
                        <div className="col-lg-6 mb-2">
                          <NewSelect
                            name="copyFromItem"
                            options={copyFromItems || []}
                            value={values?.copyFromItem}
                            label="Copy From"
                            onChange={(valueOption) => {
                              setFieldValue("copyFromItem", valueOption);
                              // setMatRowDto([])
                              // setValueAddRowDto([])
                              getRowMaterialsById(
                                valueOption?.taxPricingId,
                                setMatRowDto,
                                setValueAddRowDto,
                                setDisabled
                              );
                            }}
                            placeholder="Select Item Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6"></div>
                        <div className="col-lg-3 mb-2">
                          <NewSelect
                            name="matItemName"
                            options={matItemNameDDL}
                            value={values?.matItemName}
                            label="Item Name"
                            onChange={(valueOption) => {
                              setFieldValue("matItemUom", valueOption?.name);
                              setFieldValue("matItemName", valueOption);
                            }}
                            placeholder="Select Item Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2 mb-2">
                          <label>Quantity</label>
                          <InputField
                            value={values?.quantity || ""}
                            name="quantity"
                            placeholder="Quantity"
                            type="number"
                            onChange={(e) => {
                              if (e.target.value >= 0) {
                                setFieldValue("quantity", e.target.value);
                              }
                            }}
                            min="0"
                            step="any"
                          />
                        </div>
                        <div className="col-lg-3 mb-2">
                          <label>Westage Quantity</label>
                          <InputField
                            value={values?.westageQty || ""}
                            name="westageQty"
                            placeholder="WestageQty"
                            onChange={(e) => {
                              if (e.target.value >= 0) {
                                setFieldValue("westageQty", e.target.value);
                              }
                            }}
                            type="number"
                            min="0"
                            step="any"
                          />
                        </div>
                        <div className="col-lg-2 mb-2">
                          <label>Rate</label>
                          <InputField
                            value={values?.rate || ""}
                            name="rate"
                            placeholder="Rate"
                            type="number"
                            min="0"
                            step="any"
                          />
                        </div>
                        <div className="col-lg-2 mb-2">
                          <button
                            onClick={() => {
                              const obj = {
                                intTaxItemGroupIdMat:
                                  values?.matItemName?.value,
                                intTaxItemGroupNameFg:
                                  values?.matItemName?.label,
                                uomName: values?.matItemUom,
                                numTotalQuantity: values?.quantity,
                                numWastageQuantity: values?.westageQty,
                                numRate: values?.rate,
                                numWastagePercentage:
                                  (values?.westageQty * 100) / values?.quantity,
                              };
                              matSetter(obj);
                            }}
                            className="btn btn-primary"
                            style={{ marginTop: "10px" }}
                            disabled={
                              !values.matItemName ||
                              !values.quantity ||
                              !values.westageQty ||
                              !values.rate
                            }
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </>
                    </div>

                    <div className="row cash_journal bank-journal bank-journal-custom mr-1">
                      <div className="col-lg-12 pr-0 pl-0">
                        {matRowDto?.length > 0 ? (
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th style={{ width: "190px" }}>Item</th>
                                <th style={{ width: "190px" }}>UOM</th>
                                <th>Quantity</th>
                                <th>Westage Quantity</th>
                                <th>Rate</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matRowDto?.map((itm, idx) => {
                                return (
                                  <tr key={itm?.intTaxItemGroupIdMat}>
                                    <td className="text-center">{++idx}</td>
                                    <td>
                                      <div className="pl-2">
                                        {itm?.intTaxItemGroupNameFg}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="pl-2">{itm?.uomName}</div>
                                    </td>
                                    <td>
                                      <div className="text-right">
                                        {_fixedPointVat(
                                          itm?.numTotalQuantity,
                                          3
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-right">
                                        {_fixedPointVat(
                                          itm?.numWastageQuantity,
                                          3
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-right">
                                        {_fixedPoint(itm?.numRate)}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <IDelete
                                        remover={matRemover}
                                        id={itm?.intTaxItemGroupIdMat}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td
                                  colSpan="3"
                                  className="text-right font-weight-bold"
                                >
                                  Total
                                </td>
                                <td
                                  colSpan="1"
                                  className="text-right font-weight-bold"
                                >
                                  {_fixedPointVat(
                                    matRowDto?.reduce(
                                      (acc, obj) =>
                                        acc + +obj?.numTotalQuantity,
                                      0
                                    ),
                                    3
                                  )}
                                </td>
                                <td
                                  colSpan="1"
                                  className="text-right font-weight-bold"
                                >
                                  {_fixedPointVat(
                                    matRowDto?.reduce(
                                      (acc, obj) =>
                                        acc + +obj?.numWastageQuantity,
                                      0
                                    ),
                                    3
                                  )}
                                </td>
                                <td
                                  colSpan="1"
                                  className="text-right font-weight-bold"
                                >
                                  {_fixedPoint(
                                    matRowDto?.reduce(
                                      (acc, obj) => acc + +obj?.numRate,
                                      0
                                    )
                                  )}
                                </td>
                                <td colSpan="1"></td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 pl-1">
                    <div className="row bank-journal bank-journal-custom bj-left">
                      <>
                        <div className="col-xl-5 col-lg-8 mb-2">
                          <NewSelect
                            name="valueAdditionName"
                            options={valueAdditionDDL}
                            value={values?.valueAdditionName}
                            label="Value Addition"
                            onChange={(valueOption) => {
                              setFieldValue("valueAdditionName", valueOption);
                            }}
                            placeholder="Value Addition"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-xl-4 col-lg-4 mb-2">
                          <label>Amount</label>
                          <InputField
                            value={values?.valueAmount || ""}
                            name="valueAmount"
                            placeholder="Amount"
                            type="number"
                            min="0"
                            step="any"
                          />
                        </div>
                        <div className="col-lg-3 mb-2">
                          <button
                            onClick={() => {
                              const obj = {
                                intValueAdditionId:
                                  values?.valueAdditionName?.value,
                                strValueAdditionName:
                                  values?.valueAdditionName?.label,
                                numTotalValue: values?.valueAmount,
                              };
                              valueAddSetter(obj);
                            }}
                            className="btn btn-primary"
                            style={{ marginTop: "10px" }}
                            disabled={
                              !values.valueAdditionName || !values.valueAmount
                            }
                            type="button"
                          >
                            Add
                          </button>
                        </div>
                      </>
                    </div>

                    <div className="row cash_journal bank-journal bank-journal-custom">
                      <div className="col-lg-12 pr-0 pl-0">
                        {valueAddRowDto.length > 0 ? (
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Value Addition Name</th>
                                <th>Amount</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {valueAddRowDto?.map((itm, idx) => {
                                return (
                                  <tr key={itm?.intValueAdditionId}>
                                    <td className="text-center">{++idx}</td>
                                    <td>
                                      <div className="pl-2">
                                        {itm?.strValueAdditionName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-right">
                                        {_fixedPoint(itm?.numTotalValue)}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <IDelete
                                        remover={valueAddRemover}
                                        id={itm?.intValueAdditionId}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}

                              <tr>
                                <td
                                  colSpan="2"
                                  className="text-right font-weight-bold"
                                >
                                  Total
                                </td>
                                <td
                                  colSpan="1"
                                  className="text-right font-weight-bold"
                                >
                                  {_fixedPoint(
                                    valueAddRowDto?.reduce(
                                      (acc, obj) => acc + obj?.numTotalValue,
                                      0
                                    )
                                  )}
                                </td>
                                <td colSpan="1"></td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
