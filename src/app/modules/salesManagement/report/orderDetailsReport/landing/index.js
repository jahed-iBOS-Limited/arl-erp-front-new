/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { getOrderDetailsReportData } from "../helper";
import { Formik } from "formik";
import { Form } from "formik";

// React Pivote Table module Import
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" }
};

function OrderDetailsReportLanding() {
  const [landingData, setLandingData] = useState({});
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getOrderDetailsReportData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.orderId,
        setLandingData,
        setLoading
      );
    }
  };

  console.log(landingData)

  return (
    <>
      <ICustomCard title="Order Details Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>Order No</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.orderId}
                        name="orderId"
                        placeholder="Order No"
                        type="text"
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={!values?.orderId}
                    >
                      View
                    </button>
                  </div>
                </div>
                {landingData?.objSalesHeader?
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label style={{fontWeight:600, fontSize:'11px'}}>Sales Order No:</label>
                      <div className="d-flex">
                        {landingData?.objSalesHeader?.salesOrderId}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Sales Order Date:</label>
                      <div className="d-flex">
                      {_dateFormatter(landingData?.objSalesHeader?.salesOrderDate)}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Sales Order Amount:</label>
                      <div className="d-flex">
                        {landingData?.objSalesHeader?.numTotalOrderValue}
                      </div>
                    </div>
                  </div>:""
                }
                
                {landingData?.objSalesRow?.length > 0 && (
                  <table className="table table-striped table-bordered bj-table bj-table-landing text-center">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>SL</th>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>UOM</th>
                        <th>Quantity</th>
                        <th>Item Price</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {landingData?.objSalesRow?.map((item, index) => (
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{item?.itemCode}</td>
                          <td>{item?.itemName}</td>
                          <td>{item?.uomName}</td>
                          <td>{item?.numOrderQuantity}</td>
                          <td>{item?.numItemPrice}</td>
                          <td>{item?.numItemPrice}</td>
                          <td>{item?.numOrderValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {landingData?.objDelivery?
                  <>
                    <div className="row mt-5">
                      <div className="col-lg-3">
                        <h6>Delivery Info:</h6>
                      </div>
                    </div>
                    {landingData?.objDelivery?.map(data=>(
                      <>
                        <div className="row global-form">
                          <div className="col-lg-3">
                            <label>Delivery No:</label>
                            <div className="d-flex">
                              {data?.objDeliveryHeader?.deliveryId}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Delivery Date:</label>
                            <div className="d-flex">
                            {_dateFormatter(data?.objDeliveryHeader?.deliveryDate)}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Shippoint:</label>
                            <div className="d-flex">
                              {data?.objDeliveryHeader?.shipPointName}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Delivery Amount:</label>
                            <div className="d-flex">
                              {data?.objDeliveryHeader?.totalDeliveryAmount}
                            </div>
                          </div>
                        </div>
                        <table className="table table-striped table-bordered bj-table bj-table-landing text-center">
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>SL</th>
                              <th>Item Code</th>
                              <th>Item Name</th>
                              <th>UOM</th>
                              <th>Quantity</th>
                              <th>Item Price</th>
                              <th>Rate</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.objDeliveryRow?.map((item, index) => (
                              <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item?.itemCode}</td>
                                <td>{item?.itemName}</td>
                                <td>{item?.uomName}</td>
                                <td>{item?.quantity}</td>
                                <td>{item?.rate}</td>
                                <td>{item?.rate}</td>
                                <td>{item?.rate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ))}
                  </>: ""
                }
                {landingData?.objShipment?
                  <>
                    <div className="row mt-5">
                      <div className="col-lg-3">
                        <h6>Shipment Info:</h6>
                      </div>
                    </div>
                    {landingData?.objShipment?.map(data=>(
                      <div className="row global-form">
                        <div className="col-lg-3">
                          <label>Shipment No:</label>
                          <div className="d-flex">
                            {data?.objShipHeader?.shipmentCode}
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <label>Shipment Date:</label>
                          <div className="d-flex">
                          {_dateFormatter(data?.objShipHeader?.shipmentDate)}
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <label>Vehicle Name:</label>
                          <div className="d-flex">
                            {data?.objShipHeader?.vehicleName}
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <label>Vehicle Supplier:</label>
                          <div className="d-flex">
                            {data?.objShipHeader?.supplierName}
                          </div>
                        </div>
                      </div>   
                    ))}
                  </>: ""
                }
                {landingData?.objTaxSalesCommon?
                  <>
                    <div className="row mt-5">
                      <div className="col-lg-3">
                        <h6>Vat Info:</h6>
                      </div>
                    </div>
                    {landingData?.objTaxSalesCommon?.map(data=>(
                      <>
                        <div className="row global-form">
                          <div className="col-lg-3">
                            <label>Vat Invoice No:</label>
                            <div className="d-flex">
                              {data?.objTaxSalesHeader?.taxSalesCode}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Date:</label>
                            <div className="d-flex">
                            {_dateFormatter(data?.objTaxSalesHeader?.deliveryDateTime)}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Branch:</label>
                            <div className="d-flex">
                              {data?.objTaxSalesHeader?.taxBranchName}
                            </div>
                          </div>
                        </div>
                        <table className="table table-striped table-bordered bj-table bj-table-landing text-center">
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>SL</th>
                              <th>Item Name</th>
                              <th>UOM</th>
                              <th>Quantity</th>
                              <th>Item Price</th>
                              <th>Sub Total</th>
                              <th>Vat Total</th>
                              <th>Grand Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.objTaxSalesRow?.map((item, index) => (
                              <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item?.taxItemGroupName}</td>
                                <td>{item?.uomname}</td>
                                <td>{item?.quantity}</td>
                                <td>{item?.basePrice}</td>
                                <td>{item?.subTotal}</td>
                                <td>{item?.vatTotal}</td>
                                <td>{item?.grandTotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ))}
                  </>: ""
                }
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default OrderDetailsReportLanding;
