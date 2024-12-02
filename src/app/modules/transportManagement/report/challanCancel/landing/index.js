/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getChallanInfo, getDistributionChannelDDL_api } from "../helper";
import TextArea from "../../../../_helper/TextArea";

const initData = {
  distributionChannel: "",
  customer: "",
  challan: "",
  strNarration: "",
};

function ChallanCancel() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (buId && accId) {
      getDistributionChannelDDL_api(accId, buId, setDistributionChannelDDL);
    }
  }, [buId, accId]);

  const getChallan = (values, partId) => {
    getChallanInfo(
      userId,
      buId,
      values?.customer?.value,
      values?.challan,
      values?.strNarration,
      partId,
      setGridData,
      setLoading
    );
  };

  const isDisabled = (values) => {
    return !gridData?.length > 0;
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{ ...initData }}>
        {({ values, setFieldValue, errors, touched, resetForm }) => (
          <>
            <Form>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Challan Cancel"}>
                  <CardHeaderToolbar>
                    <button
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={(e) => {
                        getChallan(values, 3);
                      }}
                      disabled={isDisabled(values)}
                    >
                      Cancel Challan
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  {loading && <Loading />}
                  <div className="row global-form">
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
                          // if (searchValue?.length < 3) return [];
                          return axios
                            .get(
                              `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.distributionChannel?.value}`
                            )
                            .then((res) => res?.data);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Challan No</label>
                      <InputField
                        value={values?.challan}
                        name="challan"
                        placeholder="Challan No"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("challan", e.target.value);
                          setGridData([]);
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Narration</label>
                      <TextArea
                        placeholder="Write your narration"
                        value={values?.strNarration}
                        name="strNarration"
                        type="text"
                      />
                    </div>
                    <div className="col d-flex  align-items-end">
                      <button
                        type="button"
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          setGridData([]);
                          getChallan(values, 1);
                        }}
                        // disabled={
                        //   !values?.customer ||
                        //   !values?.challan ||
                        //   !values?.previousDate
                        // }
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Challan Number</th>
                          <th>Unit Name</th>
                          <th>Sales JV ID</th>
                          <th>Challan Status</th>
                          <th>Order Number</th>
                          <th>Order Complete</th>
                          <th>Order Quantity</th>
                          <th>Delivered Quantity</th>
                          <th>Undelivered Quantity</th>
                          <th>Sales Order ID</th>
                          <th>Item Name</th>
                          <th>Item ID</th>
                          <th>Delivery Quantity</th>
                          <th>Product Price</th>
                          <th>Delivery Amount</th>
                          <th>Damaged Quantity</th>
                          <th>Delivery ID</th>
                          <th>Challan Date</th>
                          <th>Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.strchallan || "N/A"}</td>
                            <td>{item?.strunint || "N/A"}</td>
                            <td>{item?.intsalesjvid || "N/A"}</td>
                            <td>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "0.15em 0.5em",
                                  borderRadius: "1em",
                                  color:
                                    item?.strChallanStatus === "Active"
                                      ? "white"
                                      : "#3a3a3a",
                                  backgroundColor:
                                    item?.strChallanStatus === "Active"
                                      ? "green"
                                      : "#ffbf00",
                                  fontWeight: "bold",
                                }}
                              >
                                {item?.strChallanStatus || "N/A"}
                              </span>
                            </td>
                            <td>{item?.stroder || "N/A"}</td>
                            <td>{item?.ordercomplete ? "Yes" : "No"}</td>
                            <td>{item?.orderqnt || "N/A"}</td>
                            <td>{item?.orderDeliverdqnt || "N/A"}</td>
                            <td>{item?.orderundeliverqnt || "N/A"}</td>
                            <td>{item?.intSOID || "N/A"}</td>
                            <td>{item?.strItemName || "N/A"}</td>
                            <td>{item?.intItemID || "N/A"}</td>
                            <td>{item?.numDeliveryQnt || "N/A"}</td>
                            <td>{item?.numProductPrice || "N/A"}</td>
                            <td>{item?.numDeliveryAmount || "N/A"}</td>
                            <td>{item?.numDamageQnt || "N/A"}</td>
                            <td>{item?.intDeliveryID || "N/A"}</td>
                            <td>
                              {_dateFormatter(item?.dteChallanDate) || "N/A"}
                            </td>
                            <td>{item?.strMsg || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default ChallanCancel;
