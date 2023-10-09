import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import IViewModal from "../../../_helper/_viewModal";
import ScheduleListTable from "./scheduleListTable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IConfirmModal from "../../../_helper/_confirmModal";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
const initData = {};
export default function SalesInvoiceLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [rowData, getRowData, Loading] = useAxiosGet();
  const [showModal, setShowModal] = useState(false);
  const [singleItem, setSingleItem] = useState(null);
  const [, collectionHandler] = useAxiosPost();

  useEffect(() => {
    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
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
                      history.push(
                        "/sales-management/servicesales/servsalesinvoice/create"
                      );
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
                  <div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ marginTop: "17px" }}
                      onClick={() => {
                        getRowData(
                          `/oms/ServiceSales/GetServiceSalesInvocieList?accountId=${
                            profileData?.accountId
                          }&businessUnitId=${
                            selectedBusinessUnit?.value
                          }&customerId=${values?.customer?.value ||
                            0}&isCollectionComplte=false`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Schedule Type</th>
                        <th>Sales Type</th>
                        <th> S Service Sales Order Code</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.invocieHeader?.strCustomerName}</td>
                          <td>{item?.invocieHeader?.strCustomerAddress}</td>
                          <td>{item?.invocieHeader?.strScheduleTypeName}</td>
                          <td>{item?.invocieHeader?.strSalesTypeName}</td>
                          <td>{item?.invocieHeader?.strServiceSalesOrderCode}</td>
                          <td>
                            <div className="d-flex justify-content-between">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">{"Collection"}</Tooltip>
                                }
                              >
                                <span>
                                  <i
                                    onClick={() => {
                                      IConfirmModal({
                                        title: "Are you sure ?",
                                        yesAlertFunc: () => {
                                          collectionHandler(
                                            `/oms/ServiceSales/InvoiceCollection?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&serviceSalesInvoiceId=${item?.invocieHeader?.intServiceSalesInvoiceId}`
                                          );
                                        },
                                        noAlertFunc: () => {},
                                      });
                                    }}
                                    style={{ fontSize: "16px" }}
                                    class="fa fa-archive"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
