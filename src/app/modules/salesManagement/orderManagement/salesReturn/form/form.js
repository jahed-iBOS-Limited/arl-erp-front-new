import React from "react";
import { Formik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import NewSelect from "../../../../_helper/_select";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function Form({
  initData,
  saveHandler,
  gridData,
  setGridData,
  history,
  distributionChannelDDL,
  commonGridFunc,
  selectedAll,
  allSelect,
  dataChangeHandler,
  profileData,
  selectedBusinessUnit,
}) {
  let totalDeliveryQty = 0;
  let totalAmount = 0;
  let totalDamage = 0;
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          resetForm,
          handleSubmit,
        }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Sales Return Entry">
              <CardHeaderToolbar>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>

                  <button
                    type="submit"
                    className={"btn btn-primary ml-2 px-3 py-2"}
                    onClick={handleSubmit}
                    disabled={false}
                  >
                    Save
                  </button>
                </div>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="returnType"
                      options={[
                        { value: 1, label: "Full Challan" },
                        // { value: 2, label: "Partial Challan" },
                      ]}
                      value={values?.returnType}
                      label="Return Type"
                      onChange={(valueOption) => {
                        setFieldValue("returnType", valueOption);
                        setFieldValue("customer", "");
                        setGridData([]);
                      }}
                      placeholder="Return Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="distributionChannel"
                      options={distributionChannelDDL}
                      value={values?.distributionChannel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setFieldValue("distributionChannel", valueOption);
                        setFieldValue("customer", "");
                        setGridData([]);
                      }}
                      placeholder="Distribution Channel"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <div>
                      <label>Customer</label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          setGridData([]);
                        }}
                        isDisabled={!values?.distributionChannel}
                        placeholder="Search Customer"
                        loadOptions={(v) => {
                          const searchValue = v.trim();
                          if (searchValue?.length < 3) return [];
                          return axios
                            .get(
                              `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${values?.distributionChannel?.value}`
                            )
                            .then((res) => res?.data);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>Challan</label>
                    <InputField
                      value={values?.challan}
                      name="challan"
                      placeholder="Challan"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("challan", e.target.value);
                        setGridData([]);
                      }}
                    />
                  </div>

                  <div className="col d-flex  align-items-end">
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={() => {
                        setGridData([]);
                        commonGridFunc(values);
                      }}
                      disabled={!values?.customer || !values?.challan}
                    >
                      View
                    </button>
                  </div>
                </div>

                {gridData?.length > 0 && (
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        {values?.returnType?.value === 2 && (
                          <th
                            onClick={() => allSelect(!selectedAll())}
                            className="text-center cursor-pointer"
                            style={{ width: "40px" }}
                          >
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                        )}
                        <th>SL</th>
                        <th>Challan No</th>
                        <th>Unit Name</th>
                        <th>Sales JV ID</th>
                        <th>Order No</th>
                        <th>Order Qty</th>
                        <th>Item Name</th>
                        <th>Delivery Qty</th>
                        <th>Product Price</th>
                        <th>Delivery Amount</th>
                        <th style={{ width: "120px" }}>Damage Qty</th>
                        <th>Challan Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => {
                        totalDeliveryQty += item?.numDeliveryQnt;
                        totalAmount += item?.numDeliveryAmount;
                        totalDamage +=
                          values?.returnType?.value === 2
                            ? +item?.numDamageQnt
                            : item?.numDeliveryQnt;

                        return (
                          <tr key={index}>
                            {values?.returnType?.value === 2 && (
                              <td
                                onClick={() => {
                                  dataChangeHandler(
                                    index,
                                    "isSelected",
                                    !item.isSelected
                                  );
                                }}
                                className="text-center"
                              >
                                <input
                                  type="checkbox"
                                  value={item?.isSelected}
                                  checked={item?.isSelected}
                                  onChange={() => {}}
                                />
                              </td>
                            )}
                            <td> {index + 1}</td>
                            <td> {item?.strchallan}</td>
                            <td> {item?.strunint}</td>
                            <td> {item?.intsalesjvid}</td>
                            <td> {item?.stroder}</td>
                            <td className="text-right"> {item?.orderqnt}</td>
                            <td> {item?.strItemName}</td>
                            <td className="text-right">
                              {" "}
                              {item?.numDeliveryQnt}
                            </td>
                            <td className="text-right">
                              {" "}
                              {item?.numProductPrice}
                            </td>
                            <td className="text-right">
                              {item?.numDeliveryAmount}
                            </td>
                            <td className="text-right">
                              {" "}
                              {item?.isSelected ? (
                                <InputField
                                  value={item?.numDamageQnt}
                                  name="numDamageQnt"
                                  placeholder="Damage qty"
                                  type="number"
                                  onChange={(e) => {
                                    dataChangeHandler(
                                      index,
                                      "numDamageQnt",
                                      +e?.target?.value
                                    );
                                  }}
                                  onBlur={(e) => {
                                    if (
                                      e?.target?.value > item?.numDeliveryQnt
                                    ) {
                                      toast.warn(
                                        "Damage qty can not be greater than delivery qty"
                                      );
                                    }
                                  }}
                                />
                              ) : values?.returnType?.value === 2 ? (
                                item?.numDamageQnt
                              ) : (
                                item?.numDeliveryQnt
                              )}
                            </td>
                            <td> {_dateFormatter(item?.dteChallanDate)}</td>
                          </tr>
                        );
                      })}
                      <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                        <td colSpan={values?.returnType?.value === 1 ? 7 : 8} className="text-right">
                          <b>Total</b>
                        </td>
                        <td>{_fixedPoint(totalDeliveryQty, true, 0)}</td>
                        <td></td>
                        <td>{_fixedPoint(totalAmount, true, 0)}</td>
                        <td>{_fixedPoint(totalDamage, true, 0)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </form>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default Form;
