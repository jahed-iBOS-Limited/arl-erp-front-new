/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import OrderDetailsReport from "./orderDetailsReport";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: { value: 1, label: "Order Details Report" },
};

function OrderDetailsReportLanding() {
  const [landingData, setLandingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPowerBIReport, setShowPowerBIReport] = useState(false);
  const [ihbDDL, getIHBDDL, ihbLoading] = useAxiosGet();
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

  useEffect(() => {
    getIHBDDL(
      `/wms/AssetTransection/GetLabelNValueForDDL?BusinessUnitId=${selectedBusinessUnit?.value}&TypeId=4&RefferencePKId=0&ShipPointId=0`
    );
  }, [selectedBusinessUnit]);

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
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "Order Details Report" },
                        { value: 2, label: "IHB Program Details" },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        setShowPowerBIReport(false);
                        setLandingData({});
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.reportType?.value === 2 ? (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="ihbName"
                          options={ihbDDL}
                          value={values?.ihbName}
                          label="IHB"
                          onChange={(valueOption) => {
                            setFieldValue("ihbName", valueOption);
                            setShowPowerBIReport(false);
                          }}
                          placeholder="IHB"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <RATForm
                        obj={{
                          values,
                          setFieldValue,
                        }}
                      />

                      <div className="col-lg-3">
                        <label>From Date</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="viewType"
                          options={[
                            { value: 1, label: "Product Request" },
                            { value: 2, label: "Product Inquiry" },
                          ]}
                          value={values?.viewType}
                          label="View Type"
                          onChange={(valueOption) => {
                            setFieldValue("viewType", valueOption);
                            setShowPowerBIReport(false);
                          }}
                          placeholder="View Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-lg-3">
                      <label>Order No</label>
                      <InputField
                        value={values?.orderId}
                        name="orderId"
                        placeholder="Order No"
                        type="text"
                      />
                    </div>
                  )}

                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (values?.reportType?.value === 2) {
                          setShowPowerBIReport(true);
                        } else {
                          getReportView(values);
                        }
                      }}
                      disabled={
                        values?.reportType?.value === 1
                          ? !values?.orderId
                          : false
                      }
                    >
                      View
                    </button>
                  </div>
                </div>

                {values?.reportType?.value === 2 && showPowerBIReport ? (
                  <PowerBIReport
                    reportId={"cabbb7a5-db51-4dbe-8687-1bee73b8c1cb"}
                    groupId={"e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a"}
                    parameterPanel={false}
                    parameterValues={[
                      { name: "intIHBId", value: `${values?.ihbName?.value}` },
                      {
                        name: "intUnitid",
                        value: `${selectedBusinessUnit?.value}`,
                      },
                      {
                        name: "viewType",
                        value: `${values?.viewType?.value}`,
                      },
                      {
                        name: "intRegionid",
                        value: `${values?.region?.value}`,
                      },
                      {
                        name: "intArea",
                        value: `${values?.area?.value}`,
                      },
                      {
                        name: "intTerritoryid",
                        value: `${values?.territory?.value}`,
                      },
                      {
                        name: "dteFromdate",
                        value: `${values?.fromDate}`,
                      },
                      {
                        name: "dteTodate",
                        value: `${values?.toDate}`,
                      },
                    ]}
                  />
                ) : (
                  <OrderDetailsReport landingData={landingData} />
                )}
                {/* {landingData?.objSalesHeader ? (
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label style={{ fontWeight: 600, fontSize: "11px" }}>
                        Sales Order No:
                      </label>
                      <div className="d-flex">
                        {landingData?.objSalesHeader?.salesOrderId}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Sales Order Date:</label>
                      <div className="d-flex">
                        {_dateFormatter(
                          landingData?.objSalesHeader?.salesOrderDate
                        )}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Sales Order Amount:</label>
                      <div className="d-flex">
                        {landingData?.objSalesHeader?.numTotalOrderValue}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {landingData?.objSalesRow?.length > 0 && (
                  <div className="table-responsive">
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
                            <td>{index + 1}</td>
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
                  </div>
                )}
                {landingData?.objDelivery ? (
                  <>
                    <div className="row mt-5">
                      <div className="col-lg-3">
                        <h6>Delivery Info:</h6>
                      </div>
                    </div>
                    {landingData?.objDelivery?.map((data) => (
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
                              {_dateFormatter(
                                data?.objDeliveryHeader?.deliveryDate
                              )}
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
                        <div className="table-responsive">
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
                                  <td>{index + 1}</td>
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
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  ""
                )}
                {landingData?.objShipment ? (
                  <>
                    <div className="row mt-5">
                      <div className="col-lg-3">
                        <h6>Shipment Info:</h6>
                      </div>
                    </div>
                    {landingData?.objShipment?.map((data) => (
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
                  </>
                ) : (
                  ""
                )}
                {landingData?.objTaxSalesCommon ? (
                  <>
                    <div className="row mt-5">
                      <div className="col-lg-3">
                        <h6>Vat Info:</h6>
                      </div>
                    </div>
                    {landingData?.objTaxSalesCommon?.map((data) => (
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
                              {_dateFormatter(
                                data?.objTaxSalesHeader?.deliveryDateTime
                              )}
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Branch:</label>
                            <div className="d-flex">
                              {data?.objTaxSalesHeader?.taxBranchName}
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
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
                                  <td>{index + 1}</td>
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
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  ""
                )} */}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default OrderDetailsReportLanding;
