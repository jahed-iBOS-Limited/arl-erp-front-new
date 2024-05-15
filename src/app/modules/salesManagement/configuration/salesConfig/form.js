import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getSalesConfigPagination } from "./helper";

const BusTaxConfigSchema = Yup.object().shape({
  isUse: Yup.bool(),
  partnerBalanceCheckOnOrder: Yup.bool(),
  partnerBalanceCheckOnDelivery: Yup.bool(),
  balanceBlockDuringOrder: Yup.bool(),
  balanceBlockDuringDelivery: Yup.bool(),
  stockCheckOnOrder: Yup.bool(),
  stockCheckOnDelivery: Yup.bool(),
  stockBlockOnOrder: Yup.bool(),
  stockBlockOnDelivery: Yup.bool(),
  pgitoAccountPosting: Yup.bool(),
  inventory: Yup.bool(),
  isSouseOnProductionOrder: Yup.bool(),
});

export default function RoleExForm({
  initData,
  rowDto,
  saveBusTaxConfig,
  disableHandler,
  btnRef,
  itemSelectHandler,
  profileData,
  selectedBusinessUnit,
  itemRowSlectedHandler,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={BusTaxConfigSchema}
        onSubmit={(values, { resetForm }) => {
          saveBusTaxConfig(values, () => {
            resetForm(initData);
            getSalesConfigPagination(
              profileData?.accountId,
              selectedBusinessUnit?.value
            );
          });
        }}
      >
        {({ values, errors, setFieldValue, isValid }) => (
          <>
            {/* {disableHandler(!errors)} */}
            <Form className="form form-label-right">
              <div className="form-group row align-items-center">
                <div className="col-lg-12">
                  {rowDto?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">Uses</div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">Order Type</div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Partner Balance Check On Order
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Partner Balance Check On Delivery
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Balance Block During Order
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Balance Block During Delivery
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Stock Check On Order
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Stock Check On Delivery
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Stock Block On Order
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Stock Block On Delivery
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">Account Posting</div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">Inventory</div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Order Required For Production Order{" "}
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Stock Check on Shipment
                              </div>
                            </th>
                            <th style={{ fontSize: "10px" }}>
                              <div className="test-rotate">
                                Auto Sales Invoice
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="isUse"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        value={item?.isUse || values?.isUse}
                                        checked={item?.isUse || values?.isUse}
                                        name="isUse"
                                        onChange={(e) => {
                                          itemRowSlectedHandler(
                                            e.target.checked,
                                            index
                                          );
                                        }}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item.salesOrderTypeName}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="partnerBalanceCheckOnOrder"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.partnerBalanceCheckOnOrder ||
                                          values.partnerBalanceCheckOnOrder
                                        }
                                        checked={
                                          item.partnerBalanceCheckOnOrder ||
                                          values.partnerBalanceCheckOnOrder
                                        }
                                        name="partnerBalanceCheckOnOrder"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="partnerBalanceCheckOnDelivery"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.partnerBalanceCheckOnDelivery ||
                                          values.partnerBalanceCheckOnDelivery
                                        }
                                        checked={
                                          item.partnerBalanceCheckOnDelivery ||
                                          values.partnerBalanceCheckOnDelivery
                                        }
                                        name="partnerBalanceCheckOnDelivery"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="balanceBlockDuringOrder"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.balanceBlockDuringOrder ||
                                          values.balanceBlockDuringOrder
                                        }
                                        checked={
                                          item.balanceBlockDuringOrder ||
                                          values.balanceBlockDuringOrder
                                        }
                                        name="balanceBlockDuringOrder"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="balanceBlockDuringDelivery"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.balanceBlockDuringDelivery ||
                                          values.balanceBlockDuringDelivery
                                        }
                                        checked={
                                          item.balanceBlockDuringDelivery ||
                                          values.balanceBlockDuringDelivery
                                        }
                                        name="balanceBlockDuringDelivery"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="stockCheckOnOrder"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.stockCheckOnOrder ||
                                          values.stockCheckOnOrder
                                        }
                                        checked={
                                          item.stockCheckOnOrder ||
                                          values.stockCheckOnOrder
                                        }
                                        name="stockCheckOnOrder"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                    disabled={!item?.isUse}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="stockCheckOnDelivery"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.stockCheckOnDelivery ||
                                          values.stockCheckOnDelivery
                                        }
                                        checked={
                                          item.stockCheckOnDelivery ||
                                          values.stockCheckOnDelivery
                                        }
                                        name="stockCheckOnDelivery"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="stockBlockOnOrder"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.stockBlockOnOrder ||
                                          values.stockBlockOnOrder
                                        }
                                        checked={
                                          item.stockBlockOnOrder ||
                                          values.stockBlockOnOrder
                                        }
                                        name="stockBlockOnOrder"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="stockBlockOnDelivery"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.stockBlockOnDelivery ||
                                          values.stockBlockOnDelivery
                                        }
                                        checked={
                                          item.stockBlockOnDelivery ||
                                          values.stockBlockOnDelivery
                                        }
                                        name="stockBlockOnDelivery"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="pgitoAccountPosting"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.pgitoAccountPosting ||
                                          values.pgitoAccountPosting
                                        }
                                        checked={
                                          item.pgitoAccountPosting ||
                                          values.pgitoAccountPosting
                                        }
                                        name="pgitoAccountPosting"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="inventory"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.inventory || values.inventory
                                        }
                                        checked={
                                          item.inventory || values.inventory
                                        }
                                        name="inventory"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="isSouseOnProductionOrder "
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={
                                          item.isSouseOnProductionOrder ||
                                          values.isSouseOnProductionOrder
                                        }
                                        checked={
                                          item.isSouseOnProductionOrder ||
                                          values.isSouseOnProductionOrder
                                        }
                                        name="isSouseOnProductionOrder"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="isSouseOnProductionOrder "
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={item.isStockCheckOnShipment}
                                        checked={item.isStockCheckOnShipment}
                                        name="isStockCheckOnShipment"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Field
                                    name="autoInvoice"
                                    component={() => (
                                      <input
                                        type="checkbox"
                                        className="ml-2"
                                        value={item.autoInvoice}
                                        checked={item.autoInvoice}
                                        name="autoInvoice"
                                        onChange={(e) => {
                                          itemSelectHandler(
                                            index,
                                            e.target.checked,
                                            e.target.name
                                          );
                                        }}
                                        disabled={!item?.isUse}
                                      />
                                    )}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>{" "}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
