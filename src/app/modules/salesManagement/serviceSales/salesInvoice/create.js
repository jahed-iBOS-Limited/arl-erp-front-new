import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import ScheduleListTable from "./scheduleListTable";
const initData = {};
export default function SalesInvoiceCreate() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [rowData, getRowData, Loading] = useAxiosGet();
  const [showModal, setShowModal] = useState(false);
  const [singleItem, setSingleItem] = useState(null);
  const [, collectionHandler] = useAxiosPost();

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
            title="Create Sales Invoice"
            isHiddenReset
            isHiddenBack
            isHiddenSave
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
                          <td>{item?.header?.strCustomerName}</td>
                          <td>{item?.header?.strCustomerAddress}</td>
                          <td>{item?.header?.strScheduleTypeName}</td>
                          <td>{item?.header?.strSalesTypeName}</td>
                          <td>{item?.header?.strServiceSalesOrderCode}</td>
                          <td>
                            <div className="d-flex justify-content-between">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">{"Create"}</Tooltip>
                                }
                              >
                                <span>
                                  <i
                                    className={`fas fa-pen-square pointer `}
                                    onClick={() => {
                                      setShowModal(true);
                                      setSingleItem(item);
                                    }}
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
                <ScheduleListTable
                  item={singleItem}
                  setShowModal={setShowModal}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
