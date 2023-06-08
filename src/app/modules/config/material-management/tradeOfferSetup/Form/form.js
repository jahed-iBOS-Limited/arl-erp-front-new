import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import shortid from "shortid";

// Validation schema
const validationSchema = Yup.object().shape({
  conditionType: Yup.object().shape({
    label: Yup.string().required("Condition type is required"),
    value: Yup.string().required("Condition type is required"),
  }),
  itemGrouping: Yup.object().shape({
    label: Yup.string().required("Item grouping is required"),
    value: Yup.string().required("Item grouping is required"),
  }),
  partnerGrouping: Yup.object().shape({
    label: Yup.string().required("Partner grouping is required"),
    value: Yup.string().required("Partner grouping is required"),
  }),
  roundingType: Yup.object().shape({
    label: Yup.string().required("Rounding type is required"),
    value: Yup.string().required("Rounding type is required"),
  }),
  startDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Start Date is required"),
  endDate: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("End Date is required"),
  offerBasedOn: Yup.object().shape({
    label: Yup.string().required("Offer based on is required"),
    value: Yup.string().required("Offer based on is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  roundingTypeDDL,
  conditionTypeDDL,
  setConditionType,
  itemDDL,
  itemListDDL,
  partnerDDL,
  row,
  addRowHandler,
  setRowDto,
  rowDto,
  setRow,
  rowDtoHandler,
  remover,
  uomDDL,
}) {
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-2">
                        <label>Select Condition Type</label>
                        <Field
                          name="conditionType"
                          placeholder="Condition Type"
                          component={() => (
                            <Select
                              options={conditionTypeDDL}
                              placeholder="Condition Type"
                              value={values?.conditionType}
                              onChange={(valueOption) => {
                                setFieldValue("conditionType", valueOption);
                                setFieldValue("itemGrouping", {
                                  value: "",
                                  label: "",
                                });
                                setFieldValue("partnerGrouping", {
                                  value: "",
                                  label: "",
                                });
                                let val = valueOption?.label?.split("/");
                                setConditionType({
                                  queryOne: val[0],
                                  queryTwo: val[1],
                                });
                              }}
                              isSearchable={true}
                              styles={customStyles}
                            />
                          )}
                        />
                        <p
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 400,
                            width: "100%",
                            marginTop: "0.25rem",
                          }}
                          className="text-danger"
                        >
                          {errors &&
                          errors.conditionType &&
                          touched &&
                          touched.conditionType
                            ? errors.conditionType.value
                            : ""}
                        </p>
                      </div>

                      <div className="col-lg-2">
                        <ISelect
                          label="Item Grouping"
                          options={itemDDL}
                          isDisabled={!values?.conditionType}
                          value={values?.itemGrouping}
                          name="itemGrouping"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-2">
                        <ISelect
                          label="Partner Grouping"
                          options={partnerDDL}
                          value={values?.partnerGrouping}
                          name="partnerGrouping"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.conditionType}
                        />
                      </div>

                      <div className="col-lg-2">
                        <ISelect
                          label="Rounding Type"
                          options={roundingTypeDDL}
                          value={values?.roundingType}
                          name="roundingType"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-2">
                        <ICalendar
                          value={values?.startDate}
                          label="Start Date"
                          name="startDate"
                        />
                      </div>

                      <div className="col-lg-2">
                        <ICalendar
                          value={values?.endDate}
                          label="End Date"
                          name="endDate"
                        />
                      </div>

                      <div className="col-lg-2 mb-2">
                        <label>Offer Based On</label>
                        <Field
                          name="offerBasedOn"
                          placeholder="Offer Based On"
                          component={() => (
                            <Select
                              options={[
                                { value: "quantity", label: "Quantity" },
                                { value: "value", label: "Value" },
                              ]}
                              placeholder="Offer Based On"
                              value={values?.offerBasedOn}
                              onChange={(valueOption) => {
                                setFieldValue("offerBasedOn", valueOption);
                                setRow([
                                  {
                                    id: shortid(),
                                  },
                                ]);
                                setRowDto({
                                  0: {},
                                });
                              }}
                              isSearchable={true}
                              styles={customStyles}
                            />
                          )}
                        />
                      </div>

                      <div className="col-lg-2 d-flex align-items-center justify-content-center">
                        <label>Is Minimum Applied</label>
                        <Field
                          name={values.isMinimumApplied}
                          component={() => (
                            <input
                              id={values.isMinimumApplied}
                              type="checkbox"
                              className="ml-2"
                              value={values.isMinimumApplied || ""}
                              checked={values.isMinimumApplied}
                              name={values.isMinimumApplied}
                              onChange={(e) => {
                                setFieldValue(
                                  "isMinimumApplied",
                                  e.target.checked
                                );
                              }}
                            />
                          )}
                          label="allocation"
                        />
                      </div>

                      <div className="col-lg-2 d-flex align-items-center justify-content-center">
                        <label className="d-block">Is Slab Program</label>
                        <Field
                          name={values.isSlabProgram}
                          component={() => (
                            <input
                              id={values.isSlabProgram}
                              type="checkbox"
                              className="ml-2"
                              value={values.isSlabProgram || ""}
                              checked={values.isSlabProgram}
                              name={values.isSlabProgram}
                              onChange={(e) => {
                                setFieldValue(
                                  "isSlabProgram",
                                  e.target.checked
                                );
                              }}
                            />
                          )}
                          label="Is slab program"
                        />
                        {values.isSlabProgram && (
                          <button
                            onClick={() => addRowHandler()}
                            type="button"
                            className="btn btn-primary ml-4"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </>
                  </div>
                </div>
              </div>

              {/* second form group row */}

              {row.map((item, index) => {
                return (
                  <div className="form-group row global-form">
                    {values.offerBasedOn?.value === "quantity" ? (
                      <>
                        <div className="col-lg">
                          <IInput
                            onChange={(e) =>
                              rowDtoHandler(
                                e.target.name,
                                e.target.value,
                                index
                              )
                            }
                            value={rowDto[index]?.fromQuantity}
                            label="From quantity"
                            name="fromQuantity"
                            type="number"
                            required
                            disabled={!values.offerBasedOn}
                            min="0"
                          />
                        </div>

                        <div className="col-lg">
                          <IInput
                            onChange={(e) =>
                              rowDtoHandler(
                                e.target.name,
                                e.target.value,
                                index
                              )
                            }
                            value={rowDto[index]?.toQuantity}
                            label="To quantity"
                            name="toQuantity"
                            type="number"
                            required
                            disabled={!values.offerBasedOn}
                            min="0"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg">
                          <IInput
                            onChange={(e) =>
                              rowDtoHandler(
                                e.target.name,
                                e.target.value,
                                index
                              )
                            }
                            value={rowDto[index]?.fromValue}
                            label="From Value"
                            name="fromValue"
                            type="number"
                            required
                            disabled={!values.offerBasedOn}
                            min="0"
                          />
                        </div>

                        <div className="col-lg">
                          <IInput
                            onChange={(e) =>
                              rowDtoHandler(
                                e.target.name,
                                e.target.value,
                                index
                              )
                            }
                            value={rowDto[index]?.toValue}
                            label="To Value"
                            name="toValue"
                            type="number"
                            required
                            disabled={!values.offerBasedOn}
                            min="0"
                          />
                        </div>
                      </>
                    )}

                    <div className="col-lg">
                      <label>Promotion Type</label>
                      <Field
                        name="promotionType"
                        placeholder="Promotion Type"
                        component={() => (
                          <Select
                            options={[
                              { value: "percent", label: "Percent amount" },
                              { value: "fixed", label: "Fixed amount" },
                              { value: "item", label: "Item" },
                            ]}
                            placeholder="Promotion Type"
                            value={rowDto[index]?.promotionType}
                            onChange={(valueOption) => {
                              rowDtoHandler(
                                "promotionType",
                                valueOption,
                                index
                              );
                            }}
                            isSearchable={true}
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>

                    {rowDto[index]?.promotionType?.value === "item" ? (
                      <>
                        <div className="col-lg">
                          <label>Offer Item</label>
                          <Field
                            name="offerItem"
                            placeholder="Offer Item"
                            component={() => (
                              <Select
                                options={itemListDDL}
                                placeholder="Offer Item"
                                value={rowDto[index]?.offerItem}
                                onChange={(valueOption) => {
                                  rowDtoHandler(
                                    "offerItem",
                                    valueOption,
                                    index
                                  );
                                }}
                                isSearchable={true}
                                styles={customStyles}
                              />
                            )}
                          />
                        </div>

                        <div className="col-lg">
                          <label>Offer item UoM</label>
                          <Field
                            name="itemUom"
                            placeholder="Offer item UoM"
                            component={() => (
                              <Select
                                options={uomDDL}
                                placeholder="Offer item UoM"
                                value={rowDto[index]?.itemUom}
                                onChange={(valueOption) => {
                                  rowDtoHandler("itemUom", valueOption, index);
                                }}
                                isSearchable={true}
                                styles={customStyles}
                              />
                            )}
                          />
                        </div>

                        <div className="col-lg">
                          <IInput
                            onChange={(e) =>
                              rowDtoHandler(
                                e.target.name,
                                e.target.value,
                                index
                              )
                            }
                            value={rowDto[index]?.offerQuantity}
                            label="Offer Qnty"
                            type="number"
                            name="offerQuantity"
                            required
                            min="0"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="col-lg">
                        <IInput
                          onChange={(e) =>
                            rowDtoHandler(e.target.name, e.target.value, index)
                          }
                          value={rowDto[index]?.offerAmount}
                          label="Offer Amount"
                          type="number"
                          name="offerAmount"
                          disabled={!rowDto[index]?.promotionType?.value}
                          required
                          min="0"
                          max={
                            rowDto[index]?.promotionType?.value === "percent"
                              ? 100
                              : 999999999
                          }
                        />
                      </div>
                    )}
                    {index === row.length - 1 && row.length > 1 && (
                      <div className="col-lg-1">
                        <span>
                          <i
                            style={{ marginTop: "36px" }}
                            onClick={() => remover(index)}
                            className="fa fa-trash deleteBtn"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

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
