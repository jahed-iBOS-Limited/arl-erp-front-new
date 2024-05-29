import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import PaginationTable from "./../../../_helper/_tablePagination";
import { Formik, Form } from "formik";
import NewSelect from "./../../../_helper/_select";
import InputField from "./../../../_helper/_inputField";
import { getSalesInvoiceLandingData } from "../helper"
import IViewModal from './../../../_helper/_viewModal';
import { _todayDate } from "./../../../_helper/_todayDate";
//import Invoice from "../invoice/Invoice"


const initData = {
  counter:'',
  fromDate: _todayDate(),
  toDate: _todayDate()
}

export default function InvoiceList({show, onHide, shippointDDL, gridData, setGridData}) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [, setSalesId] = React.useState('')
  const [, setShowInvoiceModal] = React.useState(false)
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
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      shippointDDL?.value,
      values?.fromDate,
      values?.toDate
    )
  };

  return (
    <IViewModal
        show={show}
        onHide={onHide}
        isShow={false}
        title="Invoice List"
        style={{ fontSize: "1.2rem !important" }}
    >
      {/* Table Start */}
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
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="counter"
                    value={shippointDDL}
                    label="Counter"
                    onChange={(valueOption) => {
                      setFieldValue("counter", valueOption);
                    }}
                    placeholder="Counter"
                    errors={errors}
                    touched={touched}
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

                <div className="col-lg-3">
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
                  {gridData?.data?.length >= 0 && (
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
                        {gridData?.data?.map((td, index) => (
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
                                    clickHandler={() => {
                                      setSalesId(td?.deliveryId)
                                      setShowInvoiceModal(true);
                                    }}
                                  />
                                </span>
                                {!values?.status?.value && (
                                  <span
                                    className="edit"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/pos-management/sales/sales-invoice/edit/${td.deliveryId}`,
                                        state: td,
                                      });
                                      onHide()
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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
              {/* <Invoice 
                title="Invoice Recept"
                show={showInvoceModal} 
                onHide={()=> setShowInvoiceModal(false)} 
                salesId={salesId}
              /> */}
            </Form>
          </>
        )}
      </Formik>
    </IViewModal>
  );
}
