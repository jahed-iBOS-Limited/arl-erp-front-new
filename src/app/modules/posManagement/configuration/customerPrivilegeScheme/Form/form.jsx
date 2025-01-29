import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import { useSelector, shallowEqual } from "react-redux";
import {
  getWareHouseDDL,
  conditionTypeOnChangeHandler,
  GetConditionTypeDDL_api,
  valuesEmptyFunc,
  GetSalesWiseItem_api,
  customersPurchaseTypeDDL,
  offerBasedOnDDL,
  schemeTypeDDL,
} from "../helper";
import InputField from "./../../../../_helper/_inputField";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import RowAddForm from "./rowAddForm";
// Validation schema
const validationSchema = Yup.object().shape({
  // outletName: Yup.array()
  //   .required("Outlet Name is required")
  //   .nullable(),
  nameOfScheme: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Name Of Scheme is required"),
  conditionType: Yup.object().shape({
    label: Yup.string().required("Condition Type is required"),
    value: Yup.string().required("Condition Type is required"),
  }),
  itemGroup: Yup.object().shape({
    label: Yup.string().required("Item Group is required"),
    value: Yup.string().required("Item Group is required"),
  }),
  outletName: Yup.object().shape({
    label: Yup.string().required("Outlet Name is required"),
    value: Yup.string().required("Outlet Name is required"),
  }),
  customerGroup: Yup.object().shape({
    label: Yup.string().required("Customer Group is required"),
    value: Yup.string().required("Customer Group is required"),
  }),
  offerBasedOn: Yup.object().shape({
    label: Yup.string().required("Offer Based On is required"),
    value: Yup.string().required("Offer Based On is required"),
  }),
  customersPurchaseType: Yup.object().shape({
    label: Yup.string().required("Customers Purchase Type On is required"),
    value: Yup.string().required("Customers Purchase Type On is required"),
  }),
  schemeType: Yup.object().shape({
    label: Yup.string().required("Scheme Type On is required"),
    value: Yup.string().required("Scheme Type On is required"),
  }),
  schemeStartDate: Yup.date().required("Scheme Start Date is required"),
  schemeEndDate: Yup.date().required("Scheme End Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setter,
  remover,
  setRowDto,
}) {
  const [WareHouseDDL, setWareHouseDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [itemOfferDDL, setItemOfferDDL] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  const [conditionTypeDDL, setConditionTypeDDL] = useState([]);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWareHouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.plantId,
        profileData?.userId,
        setWareHouseDDL
      );
      GetConditionTypeDDL_api(setConditionTypeDDL);
      GetSalesWiseItem_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemOfferDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right mt-2">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="outletName"
                    options={WareHouseDDL || []}
                    value={values?.outletName || ""}
                    label="Outlet Name"
                    onChange={(valueOption) => {
                      setFieldValue("outletName", valueOption || "");
                    }}
                    placeholder="Outlet Name"
                    errors={errors}
                    touched={touched}
                    // isMulti
                    // closeMenuOnSelect={false}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Name Of Scheme</label>
                  <InputField
                    value={values?.nameOfScheme || ""}
                    name="nameOfScheme"
                    placeholder="Name Of Scheme"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="conditionType"
                    options={conditionTypeDDL || []}
                    value={values?.conditionType || ""}
                    label="Condition Type"
                    onChange={(valueOption) => {
                      setFieldValue("conditionType", valueOption || "");
                      setFieldValue("itemGroup", "");
                      setFieldValue("customerGroup", "");
                      setRowDto([]);
                      valuesEmptyFunc(setFieldValue);
                      conditionTypeOnChangeHandler({
                        setFieldValue,
                        valueOption,
                        setItemDDL,
                        profileData,
                        selectedBusinessUnit,
                        setCustomerDDL,
                      });
                    }}
                    placeholder="Condition Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemGroup"
                    options={itemDDL || []}
                    value={values?.itemGroup || ""}
                    label="Item / Item Group"
                    onChange={(valueOption) => {
                      setFieldValue("itemGroup", valueOption || "");
                    }}
                    placeholder="Item / Item Group"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      [1, 3, 7].includes(values?.conditionType?.value) ||
                      !values?.conditionType?.value
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customerGroup"
                    options={customerDDL || []}
                    value={values?.customerGroup || ""}
                    label="Customer / Customer Group"
                    onChange={(valueOption) => {
                      setFieldValue("customerGroup", valueOption || "");
                    }}
                    placeholder="Customer / Customer Group"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      [1, 2, 5].includes(values?.conditionType?.value) ||
                      !values?.conditionType?.value
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <label>Scheme Start Date</label>
                  <InputField
                    value={values?.schemeStartDate || ""}
                    name="schemeStartDate"
                    placeholder="Scheme Start Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Scheme End Date</label>
                  <InputField
                    value={values?.schemeEndDate || ""}
                    name="schemeEndDate"
                    placeholder="Scheme End Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="offerBasedOn"
                    options={offerBasedOnDDL() || []}
                    value={values?.offerBasedOn || ""}
                    label="Offer Based On"
                    onChange={(valueOption) => {
                      setFieldValue("offerBasedOn", valueOption || "");
                      setFieldValue("minimumQuantity", "");
                      valuesEmptyFunc(setFieldValue);
                    }}
                    placeholder="Offer Based On"
                    errors={errors}
                    touched={touched}
                    isDisabled
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customersPurchaseType"
                    options={customersPurchaseTypeDDL() || []}
                    value={values?.customersPurchaseType || ""}
                    label="Customers Purchase Type"
                    onChange={(valueOption) => {
                      setFieldValue("customersPurchaseType", valueOption || "");
                    }}
                    placeholder="Customers Purchase Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="schemeType"
                    options={schemeTypeDDL() || []}
                    value={values?.schemeType || ""}
                    label="Scheme Type"
                    onChange={(valueOption) => {
                      setFieldValue("schemeType", valueOption || "");
                      setRowDto([]);
                      valuesEmptyFunc(setFieldValue);
                    }}
                    placeholder="Scheme Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              {/* row label form */}
              {values?.schemeType?.value &&
                values?.offerBasedOn?.value &&
                values?.conditionType?.value && (
                  <RowAddForm
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    setter={setter}
                    setRowDto={setRowDto}
                    itemOfferDDL={itemOfferDDL}
                    rowDto={rowDto}
                  />
                )}

              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Minimum Quantity/Amount</th>
                      <th>Maximum Quantity/Amount</th>
                      {/* if  Scheme Type- Item */}
                      {[2].includes(values?.schemeType?.value) && (
                        <>
                          <th>Offer Item</th>
                          <th>Item UoM</th>
                          <th>Offer Quantity</th>
                        </>
                      )}
                      {/* if  Scheme Type- Discount */}
                      {[1].includes(values?.schemeType?.value) && (
                        <>
                          <th>Discount Format</th>
                          <th>Discount (% / Amount)</th>
                        </>
                      )}
                      <th>Duration Type</th>
                      {/* if duration Type - widthouts One Time*/}
                      {![1].includes(values?.durationType?.value) &&
                        values?.durationType?.value && (
                          <>
                            <th>Duration</th>
                            <th>Based On</th>
                          </>
                        )}

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.length >= 0 &&
                      rowDto?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="text-right">
                            {item?.minimumQuantityOrAmount}
                          </td>
                          <td className="text-right">
                            {item?.maximumQuantityOrAmount}
                          </td>
                          {/* if  Scheme Type- Item */}
                          {[2].includes(values?.schemeType?.value) && (
                            <>
                              <td>{item?.itemName}</td>
                              <td>{item?.itemUomName}</td>
                              <td className="text-right">
                                {item?.offerQuantity}
                              </td>
                            </>
                          )}

                          {/* if  Scheme Type- Discount */}
                          {[1].includes(values?.schemeType?.value) && (
                            <>
                              <td>{item?.discountFormatName}</td>
                              <td className="text-right">
                                {item?.discountAmount}
                              </td>
                             
                            </>
                          )}
                           <td>{item?.durationTypeName}</td>
                          {/* if duration Type -  widthouts One Time*/}
                          {![1].includes(values?.durationType?.value) &&
                            values?.durationType?.value && (
                              <>
                                <td className="text-right">
                                  {item?.monthDuration}
                                </td>
                                <td>{item?.basedOnName}</td>
                              </>
                            )}

                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <span
                                onClick={() => {
                                  remover(idx);
                                }}
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
