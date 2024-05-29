import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import * as Yup from "yup";
import ICalendar from "../../../../_helper/_inputCalender";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import IButton from "../../../../_helper/iButton";
import customStyles from "../../../../selectCustomStyle";
import { getItemByChannelIdAciton } from "../_redux/Actions";

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
  selectedBusinessUnit,
  setAppsItemRateAll,
  accountId,
  setDisabled,
  setRowDto,
  businessUnitSet,
  postData,
  token,
}) {
  const dispatch = useDispatch();

  const addClickHandler = (values, setFieldValue) => {
    if (values.isAllItem) {
      setAll(values);
    } else if (values.appsItemRate) {
      setAppsItemRateAll(values);
      setFieldValue("appsItemRate", false);
    } else {
      const obj = {
        ...values,
        itemName: values.item.label,
        itemId: values.item.value,
        price: 0,
      };
      setter(obj);
    }
  };

  const addDisableHandler = (values) => {
    const result =
      (!values.isAllItem && !values.item?.value && !values.appsItemRate) ||
      (businessUnitSet && (!values?.minPrice || !values?.maxPrice));

    return result;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
                    onChange={(valueOption) => {
                      setFieldValue("appsItemRate", false);
                      setFieldValue("conditionTypeRef", valueOption);
                    }}
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
                {selectedBusinessUnit?.value === 144 && (
                  <IButton
                    className={"btn-success"}
                    onClick={() => {
                      postData(
                        `https://automation.ibos.io/ItemPriceEntry`,
                        {
                          bearer_token: token,
                        },
                        () => {},
                        true
                      );
                    }}
                    disabled={
                      values?.conditionType?.value !== 2 ||
                      values?.conditionTypeRef?.value !== 67
                    }
                  >
                    Update from Google Sheet
                  </IButton>
                )}
              </div>

              <div className="row mt-2 global-form">
                <div className="col-lg-3 mt-5 text-center d-flex justify-content-around">
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isAllItem"
                      id="isAllItem"
                      onChange={(e) => {
                        setFieldValue("isAllItem", e.target.checked);
                        setFieldValue(
                          "appsItemRate",
                          e.target.checked ? false : values.appsItemRate
                        );
                      }}
                      checked={values?.isAllItem}
                    />
                    <label className="text-center pt-1" htmlFor="isAllItem">
                      All Item
                    </label>
                  </div>
                  {businessUnitSet && (
                    <div>
                      <input
                        type="checkbox"
                        className="form-check-input "
                        name="appsItemRate"
                        id="appsItemRate"
                        onChange={(e) => {
                          setFieldValue("appsItemRate", e.target.checked);
                          setFieldValue("isAllItem", false);
                          dispatch(
                            getItemByChannelIdAciton(
                              accountId,
                              selectedBusinessUnit?.value,
                              setDisabled,
                              values?.conditionTypeRef?.value
                            )
                          );
                        }}
                        checked={values?.appsItemRate}
                        disabled={!values?.conditionTypeRef?.value}
                      />
                      <label
                        className="text-center pt-1"
                        htmlFor="appsItemRate"
                      >
                        Apps Item Rate
                      </label>
                    </div>
                  )}
                </div>
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
                {businessUnitSet && (
                  <>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.minPrice}
                        placeHolder="Min Price"
                        label="Min Price"
                        name="minPrice"
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.maxPrice}
                        placeHolder="Max Price"
                        label="Max Price"
                        name="maxPrice"
                      />
                    </div>
                  </>
                )}

                <IButton
                  onClick={() => {
                    addClickHandler(values, setFieldValue);
                  }}
                  disabled={addDisableHandler(values)}
                >
                  ADD
                </IButton>
              </div>

              <div>
                {rowDto.length ? (
                 <div className="table-responsive">
                   <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        {/* <th>Item Code</th> */}
                        <th>Item Name</th>
                        <th>Price</th>
                        {businessUnitSet && (
                          <>
                            <th>Max price addition</th>
                            <th>Min price deduction</th>
                          </>
                        )}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto.map((itm, idx) => (
                        <tr key={itm?.itemId}>
                          <td>{idx + 1}</td>
                          <td>{itm?.itemName}</td>
                          <td>
                            <input
                              type="number"
                              value={itm?.price}
                              onChange={(e) =>
                                setPrice(idx, e.target.value, "price", values)
                              }
                              min="0"
                              step="any"
                            />
                          </td>
                          {businessUnitSet && (
                            <>
                              <td>
                                <input
                                  type="number"
                                  value={itm?.maxPriceAddition}
                                  onChange={(e) =>
                                    setPrice(
                                      idx,
                                      e.target.value,
                                      "maxPriceAddition"
                                    )
                                  }
                                  min="0"
                                  step="any"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={itm?.minPriceDeduction}
                                  onChange={(e) =>
                                    setPrice(
                                      idx,
                                      e.target.value,
                                      "minPriceDeduction"
                                    )
                                  }
                                  min="0"
                                  step="any"
                                />
                              </td>
                            </>
                          )}
                          <td className="text-center">
                            <span>
                              <i
                                onClick={() => remover(itm?.itemId)}
                                className="fa fa-trash deleteBtn"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
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
                onClick={() => {
                  setRowDto([]);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
