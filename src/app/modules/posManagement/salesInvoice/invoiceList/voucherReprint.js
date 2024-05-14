import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import { Formik, Form } from "formik";
import InputField from "../../../_helper/_inputField";
import { getSalesInvoiceLandingData } from "../helper"
import { _todayDate } from "../../../_helper/_todayDate";
import printIcon from "../../../_helper/images/printIcon.svg"
import SalesInvoicePrint from "../invoice/salesInvoicePrint"
import { getSalesDataById } from "../helper"
import SalesInvoiceDetails from "../invoice/salesInvoiceDetails"
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";

const initData = {
  counter:'',
  fromDate: _todayDate(),
  toDate: _todayDate()
}

export default function VoucherReprint({
  counter, 
  loadCustomerList, 
  voucherReprintData, 
  setVoucherReprintData
}) {
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState({});
  const [rowData, setRowData] = useState([])
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [showSalesInvoiceModal, setShowSalesInvoiceModal] = React.useState(false);
  
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);


  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getSalesInvoiceLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVoucherReprintData,
      setLoading,
      pageNo,
      pageSize,
      counter?.value,
      values?.fromDate,
      values?.toDate,
      values?.customer?.value
    )
  };

  console.log(voucherReprintData)

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      {loading && <Loading />}
      <Formik
        initialValues={initData}
        onSubmit={(values, { setSubmitting }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            <Form>
              <div className="row global-form" 
                style={{ width:'100%', padding:"0px 0px 8px 0px", marginBottom:"0px"}}
              >
                <div className="col-lg-3">
                  <label>Customer</label>
                  <SearchAsyncSelect
                    selectedValue={values?.customer}
                    name="customer"
                    handleChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                    }}
                    placeholder="Search By Mobile Number"
                    loadOptions={loadCustomerList}
                  />
                </div>
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

                <div className="col-lg-2">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setPositionHandler(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  {voucherReprintData.length >= 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table sales_order_landing_table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Shipping Point</th>
                          <th>Customer Name</th>
                          <th>
                            Delivery Quantity
                          </th>
                          <th>Delivery Code</th>
                          <th>Delivery Date</th>
                          <th style={{ width: "60px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {voucherReprintData.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center"> {td.sl} </td>
                            <td>
                              <div className="pl-2">{td.shipPointName} </div>
                            </td>
                            <td className="text-center">
                              {td.shipToPartnerName}
                            </td>
                            <td className="text-center">
                              {td.totalDeliveryQuantity}
                            </td>
                            <td> {td.deliveryCode} </td>
                            <td> {_dateFormatter(td.deliveryDate)} </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={async () => {
                                      await getSalesDataById(
                                        td?.deliveryId, 
                                        setHeader, 
                                        setRowData
                                      )
                                      setShowSalesInvoiceModal(true)
                                    }}
                                  />
                                </span>
                                <span
                                  style={{cursor:'pointer'}}
                                  onClick={async () => {
                                    await getSalesDataById(
                                      td?.deliveryId, 
                                      setHeader, 
                                      setRowData
                                    )
                                    handlePrint()
                                  }}
                                >
                                  <img src={printIcon} height="18px" alt="Print" />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  )}
                </div>
                {voucherReprintData?.data?.length > 0 && (
                  <PaginationTable
                    count={voucherReprintData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </Form>
            <SalesInvoicePrint 
              printRef={printRef} 
              header={header} 
              rowDto={rowData} 
              selectedBusinessUnit={selectedBusinessUnit}
              profileData={profileData}
              counter={counter}
            />
            <SalesInvoiceDetails
              show={showSalesInvoiceModal}
              onHide={()=> setShowSalesInvoiceModal(false)}
              header={header}
              rowData={rowData}
            />
          </>
        )}
      </Formik>
    </>
  );
}
