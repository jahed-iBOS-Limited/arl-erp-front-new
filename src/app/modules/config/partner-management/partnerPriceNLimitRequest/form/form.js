/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { validationSchema } from "../helper";
import TextArea from "../../../../_helper/TextArea";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

export default function _Form({
  buId,
  accId,
  state,
  SOList,
  addRow,
  rowData,
  viewType,
  initData,
  itemList,
  setQuery,
  deleteRow,
  setRowData,
  getItemList,
  saveHandler,
  channelList,
  conditionDDL,
  rowDataChange,
  conditionTypeRefList,
  approveOrRejectHandler,
}) {
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={`${
                  viewType === "view"
                    ? "View"
                    : viewType === "edit"
                    ? "Edit"
                    : "New"
                } Partner Price and Limit Request`}
              >
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    {viewType !== "view" && (
                      <button
                        type="reset"
                        onClick={() => {
                          setRowData([]);
                          resetForm(initData);
                        }}
                        className="btn btn-light ml-2"
                        disabled={viewType === "view"}
                      >
                        <i className="fa fa-redo"></i>
                        Reset
                      </button>
                    )}
                    {viewType === "view" ? (
                      !state?.isApproveByAccounts ||
                      !state?.isApproveSupervisor ? (
                        <div>
                          <button
                            type="button"
                            className="btn btn-danger ml-2"
                            onClick={() => {
                              approveOrRejectHandler(values, false);
                            }}
                            disabled={!rowData?.length}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ml-2"
                            onClick={() => {
                              approveOrRejectHandler(values, true);
                            }}
                            disabled={!rowData?.length}
                          >
                            Approve
                          </button>
                        </div>
                      ) : null
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary ml-2"
                        onClick={handleSubmit}
                        disabled={!rowData?.length}
                      >
                        Save
                      </button>
                    )}
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="channelName"
                          options={channelList || []}
                          value={values?.channelName}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channelName", valueOption);
                          }}
                          placeholder="Select Distribution Channel"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Customer</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customer}
                          handleChange={(valueOption) => {
                            setFieldValue("customer", valueOption);
                          }}
                          placeholder="Search Customer"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channelName?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                          isDisabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Business Address"
                          value={values?.address}
                          name="address"
                          placeholder="Business Address"
                          type="text"
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Contact Person"
                          value={values?.contactPerson}
                          name="contactPerson"
                          placeholder="Contact Person"
                          type="text"
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Contact Number"
                          value={values?.contactNumber}
                          name="contactNumber"
                          placeholder="Contact Number"
                          type="text"
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Payment Mode"
                          value={values?.paymentMode}
                          name="paymentMode"
                          type="text"
                          placeholder="% Advance % PDC"
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="creditLimitType"
                          options={[
                            { value: 1, label: "Day" },
                            { value: 2, label: "Amount" },
                            { value: 3, label: "Both" },
                          ]}
                          value={values?.creditLimitType}
                          label="Credit Limit Type"
                          onChange={(valueOption) => {
                            setFieldValue("creditLimitType", valueOption);
                            setFieldValue("limitDays", "");
                            setFieldValue("limitAmount", "");
                          }}
                          placeholder="Select Credit Limit Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType === "view"}
                        />
                      </div>
                      {[1, 3]?.includes(values?.creditLimitType?.value) && (
                        <div className="col-lg-3">
                          <InputField
                            label="Days Limit"
                            value={values?.limitDays}
                            name="limitDays"
                            placeholder="Days Limit"
                            type="number"
                            disabled={
                              (!state?.isApproveByAccounts ||
                                !state?.isApproveSupervisor) &&
                              !state?.isRejected
                                ? false
                                : viewType === "view"
                            }
                          />
                        </div>
                      )}
                      {[2, 3]?.includes(values?.creditLimitType?.value) && (
                        <div className="col-lg-3">
                          <InputField
                            label="Amount Limit"
                            value={values?.limitAmount}
                            name="limitAmount"
                            placeholder="Amount Limit"
                            type="number"
                            disabled={
                              (!state?.isApproveByAccounts ||
                                !state?.isApproveSupervisor) &&
                              !state?.isRejected
                                ? false
                                : viewType === "view"
                            }
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <NewSelect
                          name="conditionType"
                          options={conditionDDL || []}
                          value={values?.conditionType}
                          label="Condition Type"
                          onChange={(valueOption) => {
                            setFieldValue("conditionType", valueOption);
                            setQuery(valueOption?.value);
                          }}
                          placeholder="Condition Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="conditionTypeRef"
                          options={conditionTypeRefList || []}
                          value={values?.conditionTypeRef}
                          label="Condition Type Ref"
                          onChange={(valueOption) => {
                            setFieldValue("conditionTypeRef", valueOption);
                          }}
                          placeholder="Condition Type Ref"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Start Date"
                          value={values?.startDate}
                          name="startDate"
                          type="date"
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="End Date"
                          value={values?.endDate}
                          name="endDate"
                          type="date"
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="">Remarks</label>
                        <TextArea
                          label="Remarks"
                          value={values?.remarks}
                          name="remarks"
                          placeholder="Remarks"
                          type="text"
                          disabled={viewType === "view"}
                        />
                      </div>

                      <div className="col-12"></div>
                      {viewType !== "view" && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="soName"
                              options={SOList || []}
                              value={values?.soName}
                              label="Sales Organization"
                              onChange={(valueOption) => {
                                setFieldValue("soName", valueOption);
                                if (valueOption && values?.channelName) {
                                  getItemList(
                                    `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${values?.channelName?.value}&SalesOrgId=${valueOption.value}`
                                  );
                                }
                              }}
                              placeholder="Select Sales Organization"
                              errors={errors}
                              touched={touched}
                              isDisabled={rowData?.length}
                              disabled={viewType === "view"}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="itemName"
                              options={itemList || []}
                              value={values?.itemName}
                              label="Item"
                              onChange={(valueOption) => {
                                setFieldValue("itemName", valueOption);
                              }}
                              placeholder="Select Item"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                !values?.soName || !values?.channelName
                              }
                              disabled={viewType === "view"}
                            />
                          </div>
                          <div className="col-lg-2">
                            <InputField
                              label="Rate"
                              value={values?.rate}
                              name="rate"
                              placeholder="Rate"
                              type="number"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-1 mt-5">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                addRow(values, () => {
                                  setFieldValue("itemName", "");
                                  setFieldValue("rate", "");
                                });
                              }}
                              disabled={!values?.itemName || !values?.rate}
                            >
                              + Add
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {rowData?.length > 0 && (
                  <div className="table-responsive">
                      <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>Proposed Rate</th>
                          {state?.isApproveByAccounts &&
                            state?.isApproveSupervisor && (
                              <th>Approved Rate</th>
                            )}
                          {viewType !== "view" && <th>Action</th>}
                        </tr>
                      </thead>
                      {rowData.map((row, index) => (
                        <tr key={index}>
                          <td className="text-center" style={{ width: "40px" }}>
                            {index + 1}
                          </td>
                          <td>{row?.strItemName}</td>
                          <td className="text-right" style={{ width: "140px" }}>
                            {viewType === "view" &&
                            (!state?.isApproveByAccounts ||
                              !state?.isApproveSupervisor) ? (
                              <InputField
                                value={
                                  state?.isApproveByAccounts
                                    ? row?.numApprovePrice
                                    : row?.numProposePrice
                                }
                                name="numProposePrice"
                                placeholder="Rate"
                                type="number"
                                onChange={(e) => {
                                  rowDataChange(
                                    index,
                                    "numProposePrice",
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              row?.numProposePrice
                            )}
                          </td>
                          {state?.isApproveByAccounts &&
                            state?.isApproveSupervisor && (
                              <td
                                style={{ width: "140px" }}
                                className="text-right"
                              >
                                {row?.numApprovePrice}
                              </td>
                            )}
                          {viewType !== "view" && (
                            <td
                              className="text-center"
                              style={{ width: "60px" }}
                            >
                              <IDelete remover={deleteRow} id={index} />
                            </td>
                          )}
                        </tr>
                      ))}
                    </table>
                  </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
