/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function _Form({
  buId,
  accId,
  rowData,
  viewType,
  initData,
  setRowData,
  saveHandler,
  channelList,
  getSalesOrderList,
  soList,
}) {
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue, resetForm }) => (
          <>
            <ICustomCard
              title={`Export Payment Posting`}
              saveHandler={() => {
                saveHandler(values, () => {
                  resetForm(initData);
                  setRowData([]);
                });
              }}
              resetHandler={
                viewType
                  ? ""
                  : () => {
                      resetForm(initData);
                    }
              }
              backHandler={
                viewType
                  ? ""
                  : () => {
                      history.goBack();
                    }
              }
            >
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    {!viewType && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="channel"
                          options={[{ value: 0, label: "All" }, ...channelList]}
                          value={values?.channel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channel", valueOption);
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType}
                        />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <label>Customer</label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          if (valueOption) {
                            getSalesOrderList({
                              ...values,
                              customer: valueOption,
                            });
                          }
                        }}
                        isDisabled={!values?.channel || viewType}
                        placeholder="Search Customer"
                        loadOptions={(v) => {
                          const searchValue = v.trim();
                          if (searchValue?.length < 3) return [];
                          return axios
                            .get(
                              `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                            )
                            .then((res) => res?.data);
                        }}
                      />
                    </div>
                    {!viewType && (
                      <FromDateToDateForm
                        obj={{
                          values,
                          setFieldValue,
                          onChange: (allValues) => {
                            getSalesOrderList(allValues);
                          },
                        }}
                      />
                    )}
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesOrder"
                        options={soList || []}
                        value={values?.salesOrder}
                        label="Sales Order"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrder", valueOption);
                          setFieldValue(
                            "soDate",
                            _dateFormatter(valueOption?.salesOrderDate)
                          );
                          setFieldValue("soRef", valueOption?.label);
                          setFieldValue(
                            "salesContractRef",
                            valueOption?.salesQuotationCode
                          );
                          setFieldValue(
                            "country",
                            valueOption?.strCountryOfOrigin
                          );
                        }}
                        placeholder="Sales Order"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.customer || viewType}
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        label="Country"
                        value={values?.country}
                        name="country"
                        placeholder="Country"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="SO Ref"
                        value={values?.soRef}
                        name="soRef"
                        placeholder="SO Ref"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Sales Contract Ref"
                        value={values?.salesContractRef}
                        name="salesContractRef"
                        placeholder="Sales Contract Ref"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={viewType}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="SO Date"
                        value={values?.soDate}
                        name="soDate"
                        placeholder="SO Date"
                        type="date"
                        errors={errors}
                        touched={touched}
                        disabled={viewType}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="TT Amount"
                        value={values?.ttAmount}
                        name="ttAmount"
                        placeholder="TT Amount"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="ERQ Value"
                        value={values?.erqValue}
                        name="erqValue"
                        placeholder="ERQ Value"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="ORQ Value"
                        value={values?.orqValue}
                        name="orqValue"
                        placeholder="ORQ Value"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={viewType === "view"}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    {rowData?.length > 0 && (
                      <table
                        className={
                          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                        }
                      >
                        <thead>
                          <tr className="cursor-pointer">
                            <th>SL</th>
                            <th>Expense Name</th>
                            <th>Amount (BDT)</th>
                          </tr>
                        </thead>
                        {rowData.map((row, index) => (
                          <tr key={index}>
                            <td
                              className="text-center"
                              style={{ width: "40px" }}
                            >
                              {index + 1}
                            </td>
                            <td>{row?.expenseName}</td>
                            <td>
                              {viewType !== "view" ? (
                                <InputField
                                  value={row?.expenseAmountBdt}
                                  name="expenseAmountBdt"
                                  placeholder="Amount"
                                  type="number"
                                  onChange={(e) => {
                                    rowData[index]["expenseAmountBdt"] = +e
                                      ?.target?.value;
                                    setRowData([...rowData]);
                                  }}
                                />
                              ) : (
                                _fixedPoint(row?.expenseAmountBdt, true)
                              )}
                            </td>
                          </tr>
                        ))}
                      </table>
                    )}
                  </div>
                </div>
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
