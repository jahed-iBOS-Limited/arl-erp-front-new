import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import IViewModal from "../../../_helper/_viewModal";
import ScheduleListTable from "./scheduleListTable";
const initData = {};
export default function SalesInvoiceLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [rowData, getRowData, Loading] = useAxiosGet();
  const [showModal, setShowModal] = useState(false);
  const [singleItem, setSingleItem] = useState(null);

  useEffect(() => {
    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemDDL(
      `/oms/SalesOrder/GetgetServiceItemList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {};
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Sales Invoice"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("/sales-management/servicesales/servsalesinvoice/create");
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="customer"
                      options={customerList || []}
                      value={values?.customer}
                      label="Customer"
                      onChange={(valueOption) => {
                        setFieldValue("customer", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={itemDDL || []}
                      value={values?.item}
                      label="Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ marginTop: "17px" }}
                      // disabled={!values?.customer && !values?.item}
                      onClick={() => {
                        getRowData(
                          `/oms/ServiceSales/GetServiceSalesWithSchedules?accountId=${
                            profileData?.accountId
                          }&businessUnitId=${
                            selectedBusinessUnit?.value
                          }&customerId=${values?.customer?.value ||
                            0}&itemId=${values?.item?.value || 0}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {rowData?.map((item, i) => (
                  <div
                    onClick={() => {
                      setShowModal(true);
                      setSingleItem(item);
                    }}
                    className="mt-5"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="form-group  global-form row">
                      <table style={{ width: "100%" }}>
                        <tr>
                          <td>
                            Customer:{" "}
                            <strong>{item?.header?.strCustomerName}</strong>
                          </td>
                          <td>
                            Address:{" "}
                            <strong>{item?.header?.strCustomerAddress}</strong>
                          </td>
                          <td>
                            Schedule Type:{" "}
                            <strong>{item?.header?.strScheduleTypeName}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Sales Type:{" "}
                            <strong>{item?.header?.strSalesTypeName}</strong>
                          </td>
                          <td>
                            S Service Sales Order Code:{" "}
                            <strong>
                              {item?.header?.strServiceSalesOrderCode}
                            </strong>
                          </td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                    {/* <div className="">
                      <div>
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>Customer</th>
                              <th>Schedule Type</th>
                              <th>Item Name</th>
                              <th>Due Date</th>
                              <th>Payment Percent</th>
                              <th>Schedule Amount</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item?.scheduleList?.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.strCustomerName}</td>
                                <td>{item?.strScheduleTypeName}</td>
                                <td>{item?.strItemName}</td>
                                <td>{_dateFormatter(item?.dteDueDateTime)}</td>
                                <td>{item?.intPaymentByPercent}</td>
                                <td>{item?.numScheduleAmount}</td>
                                <td>{item?.isInvoiceComplete}</td>
                                <td>{item?.isInvoiceComplete}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div> */}
                  </div>
                ))}
              </div>
              <IViewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title="Schedule List"
              >
                <ScheduleListTable item={singleItem} />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
