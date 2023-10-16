import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../_helper/_todayDate";
import IConfirmModal from "../../../_helper/_confirmModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _dateFormatter } from "../../../_helper/_dateFormate";
const initData = {
  customer: "",
  item: "",
  type: { value: 1, label: "Pending for Invoice" },
};
export default function SalesInvoiceLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [, saveHandler] = useAxiosPost();
  const [, collectionHandler] = useAxiosGet();

  // const [showModal, setShowModal] = useState(false);
  // const [singleItem, setSingleItem] = useState(null);
  // const [, collectionHandler] = useAxiosPost();

  useEffect(() => {
    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemDDL(
      `/oms/SalesOrder/GetgetServiceItemList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );

    getData({ typeId: 1, values: {} });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getData = ({ typeId, values }) => {
    let apiUrl = [2]?.includes(typeId)
      ? `/oms/ServiceSales/GetServiceSalesInvocieList?accountId=${
          profileData?.accountId
        }&businessUnitId=${
          selectedBusinessUnit?.value
        }&customerId=0&isCollectionComplte=${false}`
      : `/oms/ServiceSales/GetServiceScheduleList?accountId=${
          profileData?.accountId
        }&businessUnitId=${
          selectedBusinessUnit?.value
        }&ServiceSalesOrderId=${0}&dteTodate=${_todayDate()}`;

    getRowData(apiUrl, (data) => {
      const result = data?.map((item) => ({ ...item, isChecked: false }));
      setRowData(result);
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log(values);
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
                    disabled={!rowData?.some((item) => item?.isChecked)}
                    onClick={() => {
                      let data = rowData?.filter((item) => item?.isChecked);

                      let payload = data.map((item) => ({
                        header: {
                          //   intServiceSalesInvoiceId: 0,
                          //   strServiceSalesInvoiceCode: "",
                          strServiceSalesOrderCode: item?.strServiceSalesOrderCode,
                          intServiceSalesOrderId: item?.intServiceSalesOrderId,
                          dteInvoiceDateTime: _todayDate(),
                          intAccountId: profileData?.accountId,
                          intBusinessUnitId: selectedBusinessUnit?.value,
                          intSalesTypeId: item?.intSalesTypeId,
                          strSalesTypeName: item?.strSalesTypeName,
                          intCustomerId: item?.intCustomerId,
                          strCustomerCode: item?.strCustomerCode || "",
                          strCustomerName: item?.strCustomerName,
                          strCustomerAddress: item?.strCustomerAddress,
                          strCustomerAddress2: "",
                          intScheduleTypeId: item?.intScheduleTypeId,
                          strScheduleTypeName: item?.strScheduleTypeName,
                          intActionBy: profileData?.userId,
                        },
                        // row: data?.map((item) => ({
                        //   //   intServiceSalesInvoiceRowId: 0,
                        //   //   intServiceSalesInvoiceId: 0,
                        //   intServiceSalesScheduleId:
                        //     item?.intServiceSalesScheduleId,
                        //   dteScheduleCreateDateTime:
                        //     item?.dteScheduleCreateDateTime,
                        //   dteDueDateTime: item?.dteDueDateTime,
                        //   numScheduleAmount: item?.numScheduleAmount,
                        //   //   numCollectionAmount: 0,
                        //   //   numPendingAmount: 0,
                        //   //   numAdjustPreviousAmount: 0,
                        //   isActive: true,
                        // })),
                        row:[{
                          //   intServiceSalesInvoiceRowId: 0,
                          //   intServiceSalesInvoiceId: 0,
                          intServiceSalesScheduleId:
                            item?.intServiceSalesScheduleId,
                          dteScheduleCreateDateTime:
                            item?.dteScheduleCreateDateTime,
                          dteDueDateTime: item?.dteDueDateTime,
                          numScheduleAmount: item?.numScheduleAmount,
                          //   numCollectionAmount: 0,
                          //   numPendingAmount: 0,
                          //   numAdjustPreviousAmount: 0,
                          isActive: true,
                        }],
                      }));

                      saveHandler(
                        `/oms/ServiceSales/CreateServiceSalesInvocie`,
                        payload,
                        () => {
                          getData({ typeId: values?.type?.value, values });
                        },
                        true
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Pending for Invoice" },
                        { value: 2, label: "Pending for Collection" },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                        setRowData([]);
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
                        getData({ typeId: values?.type?.value, values });
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {[1]?.includes(values?.type?.value) ? (
                  <div className="mt-5">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={
                                rowData?.length > 0 &&
                                rowData?.every((item) => item?.isChecked)
                              }
                              onChange={(e) => {
                                setRowData(
                                  rowData?.map((item) => {
                                    return {
                                      ...item,
                                      isChecked: e?.target?.checked,
                                    };
                                  })
                                );
                              }}
                            />
                          </th>
                          <th>Customer</th>
                          <th>Schedule Type</th>
                          <th>Item Name</th>
                          <th>Due Date</th>
                          <th>Payment Percent</th>
                          <th>Schedule Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                value={item?.isChecked}
                                checked={item?.isChecked}
                                onChange={(e) => {
                                  const data = [...rowData];
                                  data[index]["isChecked"] = e.target.checked;
                                  setRowData(data);
                                }}
                              />
                            </td>
                            <td>{item?.strCustomerName}</td>
                            <td>{item?.strScheduleTypeName}</td>
                            <td>{item?.strItemName}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteDueDateTime)}
                            </td>
                            <td className="text-center">
                              {item?.intPaymentByPercent}
                            </td>
                            <td className="text-right">
                              {item?.numScheduleAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="mt-5">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Address</th>
                          <th>Schedule Type</th>
                          <th>Sales Type</th>
                          <th> S Service Sales Order Code</th>
                          {values?.type?.value ? null : <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.invocieHeader?.strCustomerName}</td>
                            <td>{item?.invocieHeader?.strCustomerAddress}</td>
                            <td>{item?.invocieHeader?.strScheduleTypeName}</td>
                            <td>{item?.invocieHeader?.strSalesTypeName}</td>
                            <td>
                              {item?.invocieHeader?.strServiceSalesOrderCode}
                            </td>
                            <td>
                              <div className="d-flex justify-content-between">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Collection"}
                                    </Tooltip>
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
                )}
                {/* <div className="mt-5">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              rowData?.length > 0 &&
                              rowData?.every((item) => item?.isChecked)
                            }
                            onChange={(e) => {
                              setRowData(
                                rowData?.map((item) => {
                                  return {
                                    ...item,
                                    isChecked: e?.target?.checked,
                                  };
                                })
                              );
                            }}
                          />
                        </th>
                        <th>Customer</th>
                        <th>Schedule Type</th>
                        <th>Sales Type</th>
                        <th> S Service Sales Order Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              value={item?.isChecked}
                              checked={item?.isChecked}
                              onChange={(e) => {
                                const data = [...rowData];
                                data[index]["isChecked"] = e.target.checked;
                                setRowData(data);
                              }}
                            />
                          </td>
                          <td>{item?.header?.strCustomerName}</td>
                          <td>{item?.header?.strScheduleTypeName}</td>
                          <td>{item?.header?.strSalesTypeName}</td>
                          <td className="text-center">
                            {item?.header?.strServiceSalesOrderCode}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
              </div>
              {/* <IViewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title="Schedule List"
              >
                <ScheduleListTable item={singleItem} />
              </IViewModal> */}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
