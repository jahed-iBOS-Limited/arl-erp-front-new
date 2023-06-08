import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { ISelect } from "../../../../_helper/_inputDropDown";
import ICalendar from "../../../../_helper/_inputCalender";

// Validation schema
const validationSchema = Yup.object().shape({
  conditionType: Yup.object().shape({
    label: Yup.string().required("Condition Type is required"),
    value: Yup.string().required("Condition Type is required"),
  }),
  conditionTypeRef: Yup.object().shape({
    label: Yup.string().required("Condition Type Ref is required"),
    value: Yup.string().required("Condition Type Ref is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  conditionDDL,
  conditionTypeRefDDL,
  setter,
  setQuery,
  itemSalesDDL,
  rowDto,
  remover,
  setPrice,
  setAll,
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <label>Select Condition Type</label>
                  <Select
                    styles={customStyles}
                    value={values?.conditionType}
                    options={conditionDDL}
                    label="Select Condition Type"
                    name="conditionType"
                    onChange={(valueOption) => {
                      setFieldValue("conditionTypeRef", {
                        value: "",
                        label: "",
                      });
                      setFieldValue("conditionType", valueOption);
                      // setQuery(valueOption?.label.split("/")[1]);
                      setQuery(valueOption?.value);
                    }}
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
                    {errors && errors.conditionType && touched.conditionType
                      ? errors.conditionType.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-3">
                  <ISelect
                    value={values?.conditionTypeRef}
                    options={conditionTypeRefDDL}
                    label="Select Condition Type Ref"
                    name="conditionTypeRef"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values.conditionType?.value}
                  />
                </div>

                <div className="col-lg-3">
                  <ICalendar
                    label="Start Date"
                    name="startDate"
                    type="date"
                    errors={errors}
                    touched={touched}
                    value={values.startDate}
                  />
                </div>
                <div className="col-lg-3">
                  <ICalendar
                    label="End Date"
                    min={values.startDate}
                    value={values.endDate}
                    name="endDate"
                    type="date"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="row mt-1 global-form">
                <div className="col-lg-3">
                  <ISelect
                    value={values?.item}
                    options={itemSalesDDL}
                    label="Select Item List"
                    name="item"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    // isDisabled={!values.item?.value}
                  />
                </div>
                <div className="col-lg-1 text-center">
                  <label className="text-center ml-5">All Item</label> <br />
                  <input
                    type="checkbox"
                    className="form-check-input ml-3"
                    name="isAllItem"
                    onChange={(e) =>
                      setFieldValue("isAllItem", e.target.checked)
                    }
                  />
                </div>
                <div className="col-lg-2 text-right">
                  <button
                    onClick={() => {
                      if (values.isAllItem) {
                        setAll(values);
                      } else {
                        const obj = {
                          ...values,
                          itemName: values.item.label,
                          itemId: values.item.value,
                          price: 0,
                        };
                        setter(obj);
                      }
                    }}
                    disabled={!values.isAllItem && !values.item?.value}
                    type="button"
                    className="btn btn-primary mt-2"
                  >
                    ADD
                  </button>
                </div>
              </div>

              <div>
                {rowDto.length ? (
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        {/* <th>Item Code</th> */}
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto.map((itm, idx) => (
                        <tr key={itm.itemId}>
                          <td>{idx + 1}</td>
                          <td>{itm.itemName}</td>
                          <td>
                            <input
                              type="number"
                              value={itm.price}
                              onChange={(e) => setPrice(idx, e.target.value)}
                              min="0"
                              step="any"
                            />
                          </td>
                          <td className="text-center">
                            <span>
                              <i
                                onClick={() => remover(itm.itemId)}
                                className="fa fa-trash deleteBtn"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}
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
