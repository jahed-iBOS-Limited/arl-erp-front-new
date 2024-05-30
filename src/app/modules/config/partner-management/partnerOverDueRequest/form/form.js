/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getCusterInformation, ValidationSchema } from "../helper";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import { getDifference } from "../../../../chartering/_chartinghelper/_getDateDiff";
import {
  getOrderPendingDetails,
  GetPendingQuantityDetails,
} from "../../../../salesManagement/orderManagement/salesOrder/helper";
import { useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import DetailsView from "./DetailsView";
import TextArea from "../../../../_helper/TextArea";

export default function _Form({
  buId,
  accId,
  initData,
  channelDDL,
  setLoading,
  saveHandler,
  setDisabled,
}) {
  const history = useHistory();
  const [partnerBalance, getPartnerBalance] = useAxiosGet();
  const [unDeliveredAmount, getUndeliveredAmount] = useAxiosGet();
  const [isView, setIsView] = React.useState(false);
  const [, getPriceStructureCheck] = useAxiosGet();
  const [availableBalance, getAvailableBalance] = useAxiosGet();
  const [creditLimit, getCreditLimit] = useAxiosGet();
  const [orderPendingDetails, setOrderPendingDetails] = React.useState([]);
  const [show, setShow] = useState(false);

  const getCustomerInfo = (values) => {
    getCusterInformation(
      getPartnerBalance,
      getUndeliveredAmount,
      getPriceStructureCheck,
      getAvailableBalance,
      getCreditLimit,
      values?.customer?.value,
      setLoading
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={ValidationSchema}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Partner Over Due Request">
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
                    <button
                      type="reset"
                      onClick={() => resetForm(initData)}
                      className="btn btn-light ml-2"
                      disabled={false}
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={handleSubmit}
                      disabled={!values.customer}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="channel"
                          options={[{ value: 0, label: "All" }, ...channelDDL]}
                          value={values?.channel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channel", valueOption);
                          }}
                          placeholder="Distribution Channel"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Customer</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customer}
                          handleChange={(valueOption) => {
                            setFieldValue("customer", valueOption);
                            if (valueOption) {
                              getCustomerInfo({
                                ...values,
                                customer: valueOption,
                              });
                            }
                          }}
                          isDisabled={!values?.channel}
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
                      {partnerBalance[0]?.isDayLimit && (
                        <>
                          <div className="col-lg-3">
                            <InputField
                              label="From Date"
                              value={values?.fromDate}
                              max={values?.toDate}
                              name="fromDate"
                              onChange={(e) => {
                                setFieldValue("fromDate", e.target.value);
                                setFieldValue(
                                  "updatedDaysLimit",
                                  getDifference(
                                    e.target.value,
                                    values?.toDate,
                                    0
                                  ) + 1
                                );
                              }}
                              type="date"
                              disabled={false}
                            />
                          </div>

                          <div className="col-lg-3">
                            <InputField
                              label="To Date"
                              value={values?.toDate}
                              name="toDate"
                              min={values?.fromDate}
                              onChange={(e) => {
                                setFieldValue("toDate", e.target.value);
                                setFieldValue(
                                  "updatedDaysLimit",
                                  getDifference(
                                    values?.fromDate,
                                    e.target.value,
                                    0
                                  ) + 1
                                );
                              }}
                              type="date"
                              disabled={false}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Updated Days Limit"
                              value={values?.updatedDaysLimit}
                              name="updatedDaysLimit"
                              placeholder="Days Limit"
                              type="number"
                              disabled={true}
                            />
                          </div>
                        </>
                      )}
                      {(creditLimit > 0 || !partnerBalance[0]?.isDayLimit) && (
                        <div className="col-lg-3">
                          <InputField
                            label="Credit Limit"
                            value={values?.creditLimit}
                            name="creditLimit"
                            placeholder="Credit Limit"
                            type="number"
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <InputField
                          label="OverDue Amount"
                          value={values?.overDueAmount}
                          name="overDueAmount"
                          placeholder="OverDue Amount"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Request Quantity"
                          value={values?.reqQty}
                          name="reqQty"
                          placeholder="Request Quantity"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Request Amount"
                          value={values?.reqAmount}
                          name="reqAmount"
                          placeholder="Request Amount"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Present Debit Amount"
                          value={values?.presentDebitAmount}
                          name="presentDebitAmount"
                          placeholder="Present Debit Amount"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Last Delivery Date"
                          value={values?.lastDeliveryDate}
                          name="lastDeliveryDate"
                          placeholder="Last Delivery Date"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Commitment</label>
                        <TextArea
                          value={values?.commitment || ""}
                          name="commitment"
                          placeholder="Commitment"
                          type="text"
                          rows="3"
                        />
                      </div>
                      <div className="col-lg-12">
                        {partnerBalance?.length > 0 && (
                          <p className="m-0 my-2">
                            <b>Ledger Balance: </b>
                            {_fixedPoint(
                              partnerBalance[0]?.ledgerBalance,
                              true
                            )}
                            ,<b className="ml-2">Credit Limit: </b>{" "}
                            {_fixedPoint(creditLimit, true)},
                            <b className="ml-2">Unbilled Amount: </b>
                            {_fixedPoint(
                              partnerBalance[0]?.unbilledAmount,
                              true
                            )}
                            ,<b className="ml-2">Available Balance: </b>{" "}
                            {_fixedPoint(availableBalance, true)},
                            <b className="ml-2">Undelivered Amount: </b>
                            {_fixedPoint(
                              unDeliveredAmount?.unlideliveredValues,
                              true
                            )}
                            <b className="ml-2">Pending Qty: </b>
                            {_fixedPoint(
                              partnerBalance[0]?.pendingQty,
                              true
                            )}{" "}
                            <button
                              className="btn btn-sm btn-primary px-1 py-1"
                              type="button"
                              onClick={() => {
                                getOrderPendingDetails(
                                  accId,
                                  buId,
                                  values?.customer?.value,
                                  setOrderPendingDetails,
                                  setDisabled,
                                  () => {
                                    setIsView(true);
                                  }
                                );
                              }}
                            >
                              Details
                            </button>
                            <b className="ml-2">Transport Qty: </b>
                            {_fixedPoint(
                              partnerBalance[0]?.transportQty,
                              true
                            )}{" "}
                            <button
                              className="btn btn-sm btn-primary px-1 py-1"
                              type="button"
                              onClick={() => {
                                GetPendingQuantityDetails(
                                  accId,
                                  buId,
                                  values?.customer?.value,
                                  setOrderPendingDetails,
                                  setDisabled,
                                  () => {
                                    setShow(true);
                                  }
                                );
                              }}
                            >
                              Details
                            </button>
                            {partnerBalance?.isDayLimit && (
                              <>
                                <b className="ml-2">Day Limit: </b>
                                {"true"}
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <IViewModal
                    title="Pending Order Details"
                    show={isView}
                    onHide={() => setIsView(false)}
                  >
                    <DetailsView
                      tableType="order"
                      gridData={orderPendingDetails}
                    />
                  </IViewModal>
                  <IViewModal
                    title="Pending Delivery Details"
                    show={show}
                    onHide={() => setShow(false)}
                  >
                    <DetailsView
                      tableType="delivery"
                      gridData={orderPendingDetails}
                    />
                  </IViewModal>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
