import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import { useDispatch } from "react-redux";
import { getDeliveryAddressAction } from "../_redux/Actions";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import NewSelect from "./../../../../_helper/_select";
import { _numberValidation } from "../../../../_helper/_numberValidation";
import IViewModal from "../../../../_helper/_viewModal";
import StockInfo from "../../salesOrder/Form/stockInfo";

// common schema
const commonSchema = {
  partnerReffNo: Yup.string()
    .min(2, "Minimum 2 strings")
    .max(100, "Maximum 100 strings")
    .required("Reference No is required"),
  deliveryAddress: Yup.string()
    .min(2, "Minimum 2 strings")
    .max(100, "Maximum 100 strings")
    .required("Delivery Address is required"),
  plant: Yup.object().shape({
    label: Yup.string().required("Plant is required"),
    value: Yup.string().required("Plant is required"),
  }),
  salesOrg: Yup.object().shape({
    label: Yup.string().required("Sales Organization is required"),
    value: Yup.string().required("Sales Organization is required"),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
  salesOffice: Yup.object().shape({
    label: Yup.string().required("Sales Office is required"),
    value: Yup.string().required("Sales Office is required"),
  }),
  soldToParty: Yup.object().shape({
    label: Yup.string().required("Sold to Party is required"),
    value: Yup.string().required("Sold to Party is required"),
  }),

  paymentTerms: Yup.object().shape({
    label: Yup.string().required("Payment Term is required"),
    value: Yup.string().required("Payment Term is required"),
  }),
  vehicleBy: Yup.object().shape({
    label: Yup.string().required("Vehicle By is required"),
    value: Yup.string().required("Vehicle By is required"),
  }),
  pricingDate: Yup.date().required("Pricing Date required"),
  startDate: Yup.date().required("Start Date required"),
  endDate: Yup.date().required("End Date required"),
  itemLists: Yup.array().of(
    Yup.object().shape({
      contactQuantity: Yup.number()
        .min(1, "Minimum 1 number")
        .required("Quantity is required"),
      itemPrice: Yup.number()
        .min(1, "Minimum 1 number")
        .required("Price is required"),
    })
  ),
};
// Edit Schema
const editSchema = Yup.object().shape({
  ...commonSchema,
});

// createSchema
const createSchema = Yup.object().shape({
  ...commonSchema,
  itemSale: Yup.object().shape({
    label: Yup.string().required("Item List is required"),
    value: Yup.string().required("Item List is required"),
  }),
  price: Yup.number()
    .min(1, "Minimum 1 number")
    .max(10000000000000000, "Maximum 10000000000000000 numbers")
    .required("Price is required"),
  quantity: Yup.number()
    .min(1, "Minimum 1 number")
    .max(100000000000, "Maximum 100000000000 numbers")
    .required("Quantity is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  plantDDL,
  salesOrgDDL,
  distributionChannelDDL,
  salesOfficeDDL,
  soldToPartyDDL,
  itemSaleDDL,
  paymentTermsDDL,
  salesOfficeDDLDispatcher,
  addBtnHandler,
  uomDDL,
  itemListHandelar,
}) {
  const dispatch = useDispatch();
  const [isStockModal, setIsStockModalShow] = useState(false);
  const [controls, setControls] = useState([]);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    setControls([
      {
        label: "Select Plant",
        placeholder: "Plant",
        name: "plant",
        options: plantDDL,
        value: initData.plant,
        isDisabled: true,
      },
      {
        label: "Select Sales Organization",
        placeholder: "Sales Organization",
        name: "salesOrg",
        options: salesOrgDDL || [],
        value: initData.salesOrg,
        isDisabled: true,
        dependencyFunc: (currentValue, values, setter) => {
          salesOfficeDDLDispatcher(currentValue);
          setter("salesOffice", "");
          setter("BUsalesOrgIncoterm", "");
        },
      },
      {
        label: "Select Dist Channel",
        placeholder: "Dist Channel",
        name: "distributionChannel",
        options: distributionChannelDDL,
        value: initData.distributionChannel,
        isDisabled: true,
      },
      {
        label: "Select Sales Office",
        placeholder: "Sales Office",
        name: "salesOffice",
        options: salesOfficeDDL,
        value: initData.salesOffice,
        isDisabled: true,
      },
      {
        label: "Select Sold to Party",
        placeholder: "Sold to Party",
        name: "soldToParty",
        options: soldToPartyDDL,
        value: initData.soldToParty,
        isDisabled: true,
        dependencyFunc: (currentValue, values, setter) => {
          dispatch(
            getDeliveryAddressAction(
              profileData.accountId,
              selectedBusinessUnit.value,
              currentValue,
              setter
            )
          );
        },
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    plantDDL,
    salesOrgDDL,
    distributionChannelDDL,
    salesOfficeDDL,
    soldToPartyDDL,
  ]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? editSchema : createSchema}
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
              <div className="row mt-2">
                <div className="col-lg-12 m-0 p-0">
                  <div className="row global-form m-0">
                    <>
                      {controls.map((itm, idx) => {
                        return (
                          <div className="col-xl-2 col-lg-3" key={idx}>
                            <ISelect
                              label={itm.label}
                              placeholder={itm.placeholder}
                              options={itm.options}
                              value={values[itm.name]}
                              name={itm.name}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              values={values}
                              touched={touched}
                              dependencyFunc={itm.dependencyFunc}
                              isDisabled={isEdit && itm?.isDisabled}
                            />
                          </div>
                        );
                      })}
                      <div className="col-lg-2">
                        <IInput
                          value={values.partnerReffNo || ""}
                          label="Reference No"
                          name="partnerReffNo"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ICalendar
                          value={_dateFormatter(values.pricingDate || "")}
                          label="Pricing Date"
                          name="pricingDate"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ISelect
                          label="Select Payment Term"
                          options={paymentTermsDDL}
                          value={values.paymentTerms}
                          name="paymentTerms"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          placeholder="Payment Term"
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2 d-flex justify-content-around text-center">
                        <div>
                          <label className="d-block" htmlFor="partialShipment">
                            Is Partial Shipment
                          </label>
                          <Field
                            name={values.partialShipment}
                            component={() => (
                              <input
                                id="partialShipment"
                                type="checkbox"
                                className="ml-2"
                                disabled={
                                  values.refType?.value ===
                                    "Is Partial Shipment" || isEdit
                                }
                                value={values.partialShipment || ""}
                                checked={values.partialShipment}
                                name={values.partialShipment}
                                onChange={(e) => {
                                  setFieldValue(
                                    "partialShipment",
                                    e.target.checked
                                  );
                                }}
                              />
                            )}
                            label="Is Partial Shipment"
                          />
                        </div>
                        <div>
                          <label className="d-block" htmlFor="unlimited">
                            Is Unlimited
                          </label>
                          <Field
                            name={values.unlimited}
                            component={() => (
                              <input
                                id="unlimited"
                                type="checkbox"
                                className="ml-2"
                                disabled={
                                  values.refType?.value === "IS Unlimited" ||
                                  isEdit
                                }
                                value={values.unlimited || ""}
                                checked={values.unlimited}
                                name={values.unlimited}
                                onChange={(e) => {
                                  setFieldValue("unlimited", e.target.checked);
                                }}
                              />
                            )}
                            label="IS Unlimited"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <ICalendar
                          value={_dateFormatter(values.startDate || "")}
                          label="Start Date"
                          name="startDate"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ICalendar
                          value={_dateFormatter(values.endDate || "")}
                          label="End Date"
                          name="endDate"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ISelect
                          label="Select Transport Provider"
                          options={[
                            { value: 1, label: "Company" },
                            { value: 2, label: "Customer" },
                          ]}
                          value={values.vehicleBy}
                          name="vehicleBy"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          placeholder="Transport Provider"
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2 pb-2">
                        <IInput
                          value={values.deliveryAddress}
                          label="Delivery Address"
                          name="deliveryAddress"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>Remarks</label>
                        <InputField
                          value={values?.remark || ""}
                          name="remark"
                          placeholder="Remarks"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2 d-flex align-items-center flex-column">
                        <label htmlFor="offerInclude">Offer Include</label>
                        <Field
                          name={values.offerInclude}
                          component={() => (
                            <input
                              id="offerInclude"
                              type="checkbox"
                              className="ml-2"
                              disabled={
                                values.refType?.value === "Offer Include" ||
                                isEdit
                              }
                              value={values.offerInclude || ""}
                              checked={values.offerInclude}
                              name={values.offerInclude}
                              onChange={(e) => {
                                setFieldValue("offerInclude", e.target.checked);
                              }}
                            />
                          )}
                          label="Offer Include"
                        />
                      </div>

                      {isEdit && (
                        <div className="col-lg-2 pb-2 text-warning">
                          <IInput
                            value={values.salesContactCode}
                            label="Contact Code"
                            name="salesContactCode"
                            disabled={true}
                          />
                        </div>
                      )}
                    </>
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>
              <div className="row">
                <div className="col-lg-12 p-0 m-0">
                  <div className="row global-form m-0">
                    <div className="col-lg-2">
                      {[
                        144,
                        178,
                        180,
                        181,
                        182,
                        183,
                        209,
                        212,
                        216,
                        221,
                      ].includes(selectedBusinessUnit?.value) &&
                        values?.itemSale?.value && (
                          <>
                            <button
                              style={{
                                position: "absolute",
                                right: "13px",
                                top: "-10px",
                                zIndex: "9",
                              }}
                              onClick={() => {
                                setIsStockModalShow(true);
                              }}
                              type="button"
                              className="btn btn-primary"
                            >
                              Stock
                            </button>
                          </>
                        )}
                      <NewSelect
                        label="Select Item List"
                        placeholder="Item List"
                        options={itemSaleDDL}
                        value={values.itemSale}
                        name="itemSale"
                        onChange={(valueOption) => {
                          setFieldValue("itemSale", valueOption);
                          itemListHandelar(valueOption?.value, setFieldValue);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        type="number"
                        value={values.quantity}
                        label="Quantity"
                        name="quantity"
                        min="1"
                        // onChange={(e) => {
                        //   setFieldValue("quantity", _numberValidation(e));
                        // }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        type="number"
                        value={values.price}
                        label="Price"
                        name="price"
                        min="1"
                        // onChange={(e) => {
                        //   setFieldValue("price", _numberValidation(e));
                        // }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        label="Item UoM"
                        placeholder="Item UoM"
                        options={uomDDL || []}
                        name="uom"
                        onChange={(valueOption) => {
                          setFieldValue("uom", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        value={values.uom}
                      />
                    </div>
                    <div className="col-lg-4 mt-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          className="btn btn-primary ml-2 mt-2"
                          onClick={() => {
                            addBtnHandler(values, setFieldValue);
                          }}
                          disabled={
                            values?.itemSale &&
                            values?.quantity &&
                            values.price &&
                            values?.uom
                              ? false
                              : true
                          }
                        >
                          Add
                        </button>
                        <div className="left d-flex justify-content-start align-content-center">
                          <div className="d-flex ">
                            <b className="mx-2">
                              Total Qty :{" "}
                              {values?.itemLists?.reduce(
                                (acc, cur) => acc + +cur?.contactQuantity,
                                0
                              )}
                            </b>
                            <b>
                              Total Amount :{" "}
                              {values?.itemLists?.reduce(
                                (acc, cur) => acc + +cur?.contactValue,
                                0
                              )}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-12 pr-0 pl-0">
                  {values?.itemLists?.length >= 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "35px" }}>SL</th>
                            <th>Item Name</th>
                            <th>Item Code</th>
                            <th>UoM Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values?.itemLists.map((itm, index) => (
                            <tr key={itm.itemId}>
                              <td className="text-center">{index + 1}</td>
                              <td className="pl-2">{itm.itemName}</td>
                              <td className="pl-2">{itm.itemCode}</td>
                              <td className="pl-2">{itm.uomName}</td>
                              <td className="pr-2">
                                <InputField
                                  value={
                                    values?.itemLists[index]?.contactQuantity
                                  }
                                  name={`itemLists.${index}.contactQuantity`}
                                  placeholder="Quantity"
                                  type="tel"
                                  min="0"
                                  onChange={(e) => {
                                    setFieldValue(
                                      e.target.name,
                                      _numberValidation(e)
                                    );
                                    setFieldValue(
                                      `itemLists.${index}.contactValue`,
                                      values?.itemLists[index]?.itemPrice *
                                        _numberValidation(e)
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`itemLists.${index}.contactQuantity`}
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </td>
                              <td className="pr-2">
                                <InputField
                                  value={values?.itemLists[index]?.itemPrice}
                                  name={`itemLists.${index}.itemPrice`}
                                  placeholder="Price"
                                  type="tel"
                                  min="0"
                                  onChange={(e) => {
                                    setFieldValue(
                                      e.target.name,
                                      _numberValidation(e)
                                    );
                                    setFieldValue(
                                      `itemLists.${index}.contactValue`,
                                      _numberValidation(e) *
                                        values?.itemLists[index]
                                          ?.contactQuantity
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name={`itemLists.${index}.itemPrice`}
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </td>
                              <td className="text-right pr-2">
                                {itm.contactValue}
                              </td>
                              <td className="text-center">
                                <i
                                  className="fa fa-trash"
                                  onClick={() => {
                                    let ccdata = values?.itemLists.filter(
                                      (itm, ind) => ind !== index
                                    );
                                    setFieldValue("itemLists", ccdata);
                                  }}
                                ></i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>{" "}
                    </div>
                  )}
                </div>
              </div>

              {isStockModal && (
                <>
                  <IViewModal
                    title={`Stock Info [${values?.itemSale?.label}]`}
                    show={isStockModal}
                    onHide={() => setIsStockModalShow(false)}
                  >
                    <StockInfo
                      values={{
                        ...values,
                        item: values?.itemSale,
                      }}
                    />
                  </IViewModal>
                </>
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
