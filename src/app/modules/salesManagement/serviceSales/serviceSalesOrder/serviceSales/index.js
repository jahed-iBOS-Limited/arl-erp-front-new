import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import ServiceSalesCreateRecurring from "./createRecurring";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import ServiceSalesOrderView from "./View";
import ServiceSalesCreate from "./create";

const initData = {
  customer: "",
};
export default function ServiceSalesLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [, getItemDDL] = useAxiosGet();
  const [scheduleList, getScheduleList, loader] = useAxiosGet();
  const [salesOrder, getSalesOrder, load] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [showModal, setShowModal] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);

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

  const setPositionHandler = (pageNo, pageSize, values) => {
    getScheduleList(
      `/oms/ServiceSales/GetServiceSalesLanding?accountId=${
        profileData?.accountId
      }&businessUnitId=${selectedBusinessUnit?.value}&customerId=${values
        ?.customer?.value || 0}&itemId=${values?.item?.value ||
        0}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

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
          {loader && <Loading />}
          <IForm
            title="Service Sales Order"
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
                        "/sales-management/servicesales/servsalesorder/create"
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
                        getScheduleList(
                          `/oms/ServiceSales/GetServiceSalesLanding?accountId=${
                            profileData?.accountId
                          }&businessUnitId=${
                            selectedBusinessUnit?.value
                          }&customerId=${values?.customer?.value ||
                            0}&itemId=${0}&pageNo=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ maxWidth: "20px" }}>SL</th>
                          <th>Order Code</th>
                          <th>Customer</th>
                          <th>Item Name</th>
                          <th>Salaes Type Name</th>
                          <th>Payment Type</th>
                          <th>Schedule Type</th>
                          <th>Due Invoice</th>
                          <th>Actual Live Date</th>
                          <th>Warranty Month</th>
                          <th>Warranty End Date</th>
                          <th>Account Manager Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleList?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.strServiceSalesOrderCode}</td>
                            <td>
                              {(() => {
                                const itemStrings = item?.items?.map(
                                  (singleItem) => {
                                    const itemName =
                                      singleItem.strItemName || "N/A";
                                    const qty =
                                      typeof singleItem.numSalesQty === "number"
                                        ? singleItem.numSalesQty
                                        : "N/A";
                                    const rate =
                                      typeof singleItem.numRate === "number"
                                        ? singleItem.numRate
                                        : "N/A";

                                    return `${itemName} - Qty: ${qty}, Rate: ${rate}`;
                                  }
                                );

                                return itemStrings?.join(" / ");
                              })()}
                            </td>
                            <td>{item?.strCustomerName}</td>
                            <td>{item?.strSalesTypeName}</td>
                            <td>{item?.strPaymentType}</td>
                            <td>{item?.strScheduleTypeName}</td>
                            <td className="text-center">
                              {`${item?.invoiceCollectionCount} / ${item?.intInvoiceCount}`}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteActualLiveDate)}
                            </td>
                            <td className="text-center">
                              {item?.intWarrantyMonth}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteWarrantyEndDate)}
                            </td>
                            <td>{item?.strAccountManagerName}</td>
                            <td>
                              {" "}
                              <div className="d-flex">
                                <span
                                  onClick={() => {
                                    setSingleData(item);
                                    setShowModal(true);
                                  }}
                                  className=""
                                >
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip
                                        className="mytooltip"
                                        id="info-tooltip"
                                      >
                                        Create Recurring
                                      </Tooltip>
                                    }
                                  >
                                    <i
                                      style={{ fontSize: "16px" }}
                                      class="fa fa-plus-square"
                                      aria-hidden="true"
                                    ></i>
                                  </OverlayTrigger>
                                </span>
                                <span
                                  className="mx-2"
                                  onClick={() => {
                                    getSalesOrder(
                                      `/oms/ServiceSales/GetServiceSalesOrderById?ServiceSalesOrderId=${item?.intServiceSalesOrderId}`,
                                      (data) => {
                                        setSingleData(data);
                                        setEdit(true);
                                        console.log({ data });
                                      }
                                    );
                                  }}
                                >
                                  <IEdit />
                                </span>
                                <span className="">
                                  <IView
                                    clickHandler={(e) => {
                                      getSalesOrder(
                                        `/oms/ServiceSales/GetServiceSalesOrderById?ServiceSalesOrderId=${item?.intServiceSalesOrderId}`,
                                        (data) => {
                                          setSingleData(data);
                                          setView(true);
                                          console.log({ data });
                                        }
                                      );
                                    }}
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {scheduleList?.data?.length > 0 && (
                    <PaginationTable
                      count={scheduleList?.totalCount}
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
                  <div>
                    <IViewModal
                      show={showModal}
                      onHide={() => {
                        setShowModal(false);
                      }}
                    >
                      <ServiceSalesCreateRecurring singleData={singleData} />
                    </IViewModal>
                    <IViewModal
                      show={view}
                      onHide={() => {
                        setView(false);
                      }}
                    >
                      <ServiceSalesOrderView
                        serviceSalesOrderData={singleData}
                      />
                    </IViewModal>
                    <IViewModal
                      show={edit}
                      onHide={() => {
                        setEdit(false);
                      }}
                    >
                      <ServiceSalesCreate
                        isEdit={true}
                        singleData={singleData}
                      />
                    </IViewModal>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
