import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import PrintInvoiceModal from "./printInvoice";
import InputField from "../../../_helper/_inputField";
import { formatMonthYear } from "../../../_helper/_getMonthYearFormat";
import IDelete from "../../../_helper/_helperIcons/_delete";
const initData = {
  customer: "",
  type: { value: 1, label: "Pending for Invoice" },
  paymentType: "",
  fromDate: "",
  toDate: "",
};
export default function SalesCollectionLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [, saveHandler, saveLoader] = useAxiosPost();
  const [, collectionHandler] = useAxiosPost();
  const [receivableAmount, setReceivableAmount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [singleItem, setSingleItem] = useState(null);
  const [, onDelete] = useAxiosGet();
  // const [, collectionHandler] = useAxiosPost();

  console.log("rowData", rowData);

  // useEffect(() => {
  //   const data = [...rowData];
  //   // data.length = 1;
  //   let Ramount = +receivableAmount;
  //   const modifyData = data.map((item, index) => {
  //     let needCollectionAmount =
  //       (+item?.invocieRow[0]?.numScheduleAmount || 0) +
  //       (+item?.invocieRow[0]?.numScheduleVatAmount || 0);
  //     console.log("needCollectionAmount", needCollectionAmount);
  //     console.log("Ramount", Ramount);
  //     let CollectionAmount =
  //       +Ramount > +needCollectionAmount ? +needCollectionAmount : +Ramount;

  //     let PendingAmount =
  //       +Ramount > +needCollectionAmount ? 0 : +needCollectionAmount - +Ramount;

  //     Ramount = Math.abs(+needCollectionAmount - +Ramount);
  //     console.log("CollectionAmount", CollectionAmount);
  //     console.log("PendingAmount", PendingAmount);
  //     return {
  //       ...item,
  //       invocieRow: [
  //         {
  //           ...item?.invocieRow[0],
  //           numCollectionAmount: +Ramount > 0 ? CollectionAmount : 0,
  //           numPendingAmount: +Ramount > 0 ? PendingAmount : 0,
  //         },
  //       ],
  //     };
  //   });

  //   setRowData(modifyData);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [receivableAmount]);

  useEffect(() => {
    const data = [...rowData];
    let Ramount = +receivableAmount;

    const modifyData = data.map((item) => {
      const updatedInvoiceRow = item.invocieRow.map((invRow) => {
        const needCollectionAmount =
          (invRow.numScheduleAmount || 0) + (invRow.numScheduleVatAmount || 0);

        let CollectionAmount;
        let PendingAmount;

        if (Ramount >= needCollectionAmount) {
          CollectionAmount = needCollectionAmount;
          PendingAmount = 0;
          Ramount -= needCollectionAmount;
        } else {
          CollectionAmount = Ramount;
          PendingAmount = needCollectionAmount - Ramount;
          Ramount = 0;
        }

        return {
          ...invRow,
          numCollectionAmount: CollectionAmount,
          numPendingAmount: PendingAmount,
        };
      });

      return {
        ...item,
        invocieRow: updatedInvoiceRow,
      };
    });

    setRowData(modifyData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivableAmount]);

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
    const strFromAndToDate =
      values?.fromDate && values?.toDate
        ? `&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
        : "";
    let apiUrl = [2]?.includes(typeId)
      ? `/oms/ServiceSales/GetServiceSalesInvocieList?accountId=${
          profileData?.accountId
        }&businessUnitId=${selectedBusinessUnit?.value}&customerId=${values
          ?.customer?.value ||
          0}&isCollectionComplte=${false}${strFromAndToDate}`
      : `/oms/ServiceSales/GetServiceSalesInvocieList?accountId=${
          profileData?.accountId
        }&businessUnitId=${selectedBusinessUnit?.value}&customerId=${values
          ?.customer?.value ||
          0}&isCollectionComplte=${true}${strFromAndToDate}`;
    // : `/oms/ServiceSales/GetServiceScheduleList?accountId=${
    //     profileData?.accountId
    //   }&businessUnitId=${
    //     selectedBusinessUnit?.value
    //   }&serviceSalesOrderId=${0}&dteTodate=${_todayDate()}&paymentTypeId=${values
    //     ?.paymentType?.value || 0}`;

    getRowData(apiUrl, (data) => {
      const result = data?.map((item) => ({ ...item, isChecked: false }));
      setRowData(result);
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {(loader || saveLoader) && <Loading />}
          <IForm
            title="Sales Collection"
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
                          intDistributionChannelId:
                            item?.intDistributionChannelId,
                          strDistributionChannelName:
                            item?.strDistributionChannelName,

                          //   intServiceSalesInvoiceId: 0,
                          //   strServiceSalesInvoiceCode: "",
                          strServiceSalesOrderCode:
                            item?.strServiceSalesOrderCode,
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
                          strRemarks: item?.remarks || "",
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
                        row: [
                          {
                            //   intServiceSalesInvoiceRowId: 0,
                            //   intServiceSalesInvoiceId: 0,
                            intServiceSalesScheduleId:
                              item?.intServiceSalesScheduleId,
                            dteScheduleCreateDateTime:
                              item?.dteScheduleCreateDateTime,
                            dteDueDateTime: item?.dteDueDateTime,
                            numScheduleAmount: item?.numScheduleAmount,
                            numScheduleVatAmount:
                              item?.numScheduleVatAmount || 0,
                            //   numCollectionAmount: 0,
                            //   numPendingAmount: 0,
                            //   numAdjustPreviousAmount: 0,
                            isActive: true,
                          },
                        ],
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
                      name="type"
                      options={[
                        { value: 2, label: "Pending for Collection" },
                        { value: 1, label: "Collected" },
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
                      name="paymentType"
                      options={[
                        { value: 1, label: "Re-Curring" },
                        { value: 2, label: "One Time" },
                      ]}
                      value={values?.paymentType}
                      label="Bill Type"
                      onChange={(valueOption) => {
                        setFieldValue("paymentType", valueOption);
                        setRowData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.type?.value === 2 && (
                    <>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.fromDate}
                          label="From Date"
                          name="fromDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.toDate}
                          label="To Date"
                          name="toDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                          }}
                        />
                      </div>
                    </>
                  )}
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
                {/* {[1]?.includes(values?.type?.value) ? (
                  <div className="mt-5">
                    <div className="table-responsive">
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
                            <th>Payment Type</th>
                            <th>Due Date</th>
                            <th>Payment Percent</th>
                            <th>Schedule Amount</th>
                            <th>Remarks</th>
                            <th>Action</th>
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
                                    console.log("data", data);
                                    setRowData(data);
                                  }}
                                />
                              </td>
                              <td>{item?.strCustomerName}</td>
                              <td>{item?.strScheduleTypeName}</td>
                              <td>
                                {(() => {
                                  const itemStrings = item?.items?.map(
                                    (singleItem) => {
                                      const itemName =
                                        singleItem.strItemName || "N/A";
                                      const qty =
                                        typeof singleItem.numSalesQty ===
                                        "number"
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
                              <td>{item?.strPaymentType}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteDueDateTime)}
                              </td>
                              <td className="text-center">
                                {item?.intPaymentByPercent}
                              </td>
                              <td className="text-right">
                                {item?.numScheduleAmount}
                              </td>
                              <td>
                                <InputField
                                  type="text"
                                  onChange={(e) => {
                                    const data = [...rowData];
                                    data[index]["remarks"] =
                                      e.target.value || "";
                                    setRowData(data);
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    IConfirmModal({
                                      message: `Are you sure to delete?`,
                                      yesAlertFunc: () => {
                                        onDelete(
                                          `/oms/ServiceSales/InactiveServiceSales?ServiceSalesOrderId=${item?.intServiceSalesOrderId}`,
                                          null,
                                          () => {
                                            getData({
                                              typeId: values?.type?.value,
                                              values,
                                            });
                                          },
                                          true
                                        );
                                      },
                                      noAlertFunc: () => {},
                                    });
                                  }}
                                >
                                  <IDelete style={{ fontSize: "16px" }} />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                 
                )} */}
                <div className="row mt-5 flex-center">
                  <div className="col-lg-3">
                    <InputField
                      value={receivableAmount || ""}
                      type="number"
                      placeholder="Receivable Amount"
                      onChange={(e) => {
                        setReceivableAmount(+e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      disabled={!receivableAmount}
                      className="btn btn-primary"
                    >
                      Collection
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ maxWidth: "20px" }}>SL</th>
                          <th>Customer</th>
                          <th>Item Name</th>
                          <th>Address</th>
                          <th style={{ minWidth: "70px" }}>Month-Year</th>
                          <th>Schedule Type</th>
                          <th>Sales Type</th>
                          <th>Sales Order Code</th>
                          <th>Schedule Amount</th>
                          <th>Schedule Vat Amountt</th>
                          <th>Collection Amount</th>
                          <th>Pending Amount</th>
                          <th>Adjust Previous Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.invocieHeader?.strCustomerName}</td>
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
                            <td>{item?.invocieHeader?.strCustomerAddress}</td>
                            <td className="text-center">
                              {formatMonthYear(
                                item?.invocieRow?.[0]?.dteDueDateTime
                              )}
                            </td>
                            <td>{item?.invocieHeader?.strScheduleTypeName}</td>
                            <td>{item?.invocieHeader?.strSalesTypeName}</td>
                            <td>{item?.strServiceSalesOrderCode}</td>
                            <td>
                              {item?.invocieRow?.[0]?.numScheduleAmount || ""}
                              {/* <InputField
                                disabled
                                value={
                                  item?.invocieRow?.[0]?.numScheduleAmount || ""
                                }
                                type="number"
                                onChange={(e) => {
                                  const data = [...rowData];
                                  data[index]["invocieRow"][0][
                                    "numScheduleAmount"
                                  ] = e.target.value;
                                  setRowData(data);
                                }}
                              /> */}
                            </td>
                            <td className="text-rignt">
                              {item?.invocieRow?.[0]?.numScheduleVatAmount ||
                                ""}
                            </td>
                            <td className="text-rignt">
                              {item?.invocieRow?.[0]?.numCollectionAmount || ""}
                            </td>
                            <td className="text-rignt">
                              {item?.invocieRow?.[0]?.numPendingAmount || ""}
                            </td>
                            <td className="text-rignt">
                              {item?.invocieRow?.[0]?.numAdjustPreviousAmount ||
                                ""}
                            </td>
                            <td>
                              <div className="d-flex justify-content-between">
                                {/* <OverlayTrigger
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
                                              `/oms/ServiceSales/InvoiceCollection?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&serviceSalesInvoiceId=${item?.invocieHeader?.intServiceSalesInvoiceId}`,
                                              null,
                                              () => {
                                                getData({
                                                  typeId: values?.type?.value,
                                                  values,
                                                });
                                              },
                                              true
                                            );
                                          },
                                          noAlertFunc: () => {},
                                        });
                                      }}
                                      style={{
                                        fontSize: "16px",
                                        cursor: "pointer",
                                      }}
                                      class="fa fa-archive"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger> */}
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Print Invoice"}
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      onClick={() => {
                                        setSingleItem(item);
                                        setShowModal(true);
                                      }}
                                      style={{
                                        fontSize: "16px",
                                        cursor: "pointer",
                                      }}
                                      class="fa fa-print"
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
              </div>
              <IViewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title=""
              >
                <PrintInvoiceModal singleItem={singleItem} />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
