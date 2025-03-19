/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  getSalesOrderInActiveLandingData,
  getSalesOrderInactiveViewData,
  getDistributionChannelDDL,
  getCustomerDDL,
} from "../helper";
import { Formik } from "formik";
import { Form } from "formik";

import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import IView from "../../../../_helper/_helperIcons/_view";
import SalesOrderReportModal from "./salesOrderReportModal";
import NewSelect from "./../../../../_helper/_select";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  distributionChannel: "",
  customer: "",
};

function SalesOrderInActiveLanding() {
  const [details, setDetails] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  const [customerDDL, setCustomerDDL] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const getLandingData = (values) => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      values?.customer?.value
    ) {
      getSalesOrderInActiveLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.customer?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    }
  };
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <ICustomCard title="Sales Order Inactive">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="distributionChannel"
                      options={distributionChannelDDL}
                      value={values?.distributionChannel}
                      label="Dist. Channel"
                      onChange={(valueOption) => {
                        setFieldValue("distributionChannel", valueOption);
                        setFieldValue("customer", "");
                        getCustomerDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setCustomerDDL
                        );
                        setGridData([]);
                      }}
                      placeholder="Dist. Channel"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="customer"
                      options={customerDDL}
                      value={values?.customer}
                      label="Customer"
                      onChange={(valueOption) => {
                        setFieldValue("customer", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Customer"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getLandingData(values);
                      }}
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.customer?.value
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
                {gridData?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Sales Order</th>
                          <th>Partner Name</th>
                          <th style={{ width: "120px" }}>
                            Undelivery Quantity
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="pl-2">{item?.salesOrderCode}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strShipToPartnerName}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {item?.totalUndeliveryQuantity}
                              </div>
                            </td>

                            <td className="action-att-report-print-disabled">
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      setModalShow(true);
                                      getSalesOrderInactiveViewData(
                                        profileData?.accountId,
                                        selectedBusinessUnit?.value,
                                        values?.customer?.value,
                                        item?.salesOrderId,
                                        setDetails,
                                        setLoading
                                      );
                                    }}
                                    classes="text-primary"
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Form>

              {/* Modal */}
              <SalesOrderReportModal
                data={details}
                setData={setDetails}
                show={modalShow}
                landingDataCallback={() => {
                  getLandingData(values);
                  setModalShow(false);
                }}
                onHide={() => setModalShow(false)}
                setLoading={setLoading}
              />
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default SalesOrderInActiveLanding;
