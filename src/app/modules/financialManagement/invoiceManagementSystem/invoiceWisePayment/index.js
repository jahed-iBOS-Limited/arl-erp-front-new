import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import IViewModal from "../../../_helper/_viewModal";
import DetailsViewModal from "./detailsViewModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import { _formatMoney } from "../../../_helper/_formatMoney";
import ReceiveEntryModal from "./receiveEntryModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const initData = {
  businessUnit: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: "",
};
const InvoiceWisePaymentLanding = () => {
  const { businessUnitList: businessUnitDDL } = useSelector(
    (store) => store?.authData,
    shallowEqual
  );

  const saveHandler = (values, cb) => {};
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const [clickedItem, setClickedItem] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);

  const getData = (values) => {
    getTableData(
      // `/fino/PaymentOrReceive/GetInvoiceWisePayment?businessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&status=${values?.status?.value}`,
      `/fino/PaymentOrReceive/GetInvoiceWisePayment?partName=Report&businessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&status=${values?.status?.value}`,
      (data) => {
        console.log("data", data);
      }
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Invoice Wise Payment"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitDDL}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("businessUnit", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("businessUnit", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      type="date"
                      name="fromDate"
                      label="From Date"
                      value={values?.fromDate}
                      onChange={(e) => {
                        if (e) {
                          setFieldValue("fromDate", e.target.value);
                          setTableData([]);
                        } else {
                          setFieldValue("fromDate", "");
                          setTableData([]);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      type="date"
                      name="toDate"
                      label="To Date"
                      value={values?.toDate}
                      onChange={(e) => {
                        if (e) {
                          setFieldValue("toDate", e.target.value);
                          setTableData([]);
                        } else {
                          setFieldValue("toDate", "");
                          setTableData([]);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={[
                        {
                          value: 1,
                          label: "All",
                        },
                        {
                          value: 2,
                          label: "Pending",
                        },
                        {
                          value: 3,
                          label: "Completed",
                        },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("status", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("status", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        !values?.businessUnit ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.status
                      }
                      onClick={(e) => {
                        getData(values);
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>
                          Customer <br /> Code
                        </th>
                        <th>Customer Name</th>
                        <th>
                          Challan <br /> No
                        </th>
                        <th
                          style={{
                            minWidth: "70px",
                          }}
                        >
                          Shipment <br /> Date
                        </th>
                        <th>
                          Cr <br /> Days
                        </th>
                        <th
                          style={{
                            minWidth: "70px",
                          }}
                        >
                          Due <br /> Date
                        </th>
                        {/* delivery part start */}
                        <th
                          style={{
                            background: "#AFEEEE",
                          }}
                        >
                          Delivery <br /> Amount
                        </th>
                        <th>
                          Collected <br /> Amount
                        </th>
                        <th>
                          Pending <br /> Amount
                        </th>
                        {/* delivery part end */}
                        {/* vat part start */}
                        <th
                          style={{
                            background: "#F6F1E8",
                          }}
                        >
                          Vat <br /> Amount
                        </th>
                        <th>
                          Collected <br /> Vat
                        </th>
                        <th>
                          Pending <br /> Vat
                        </th>
                        <th>
                          AIT <br /> Amount
                        </th>
                        <th>
                          Collected <br /> AIT
                        </th>
                        <th>
                          Pending AIT <br />
                          Amount
                        </th>
                        <th
                          style={{
                            width: "50px",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {tableData?.length > 0 &&
                        tableData?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.strCutomerCode}</td>
                            <td>{item?.strCustomerName}</td>
                            <td>{item?.strChallanNo}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteShipmentDate)}
                            </td>
                            <td>{item?.intCrDays}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteDueDate)}
                            </td>
                            <td
                              className="text-right"
                              style={{
                                background: "rgb(233 255 255)",
                              }}
                            >
                              {_formatMoney(item?.numDeliveryAmount)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numDeliveryAmountCollected)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numDeliveryAmountPending)}
                            </td>
                            <td
                              className="text-right"
                              style={{
                                background: "rgb(255 220 220)",
                              }}
                            >
                              {_formatMoney(item?.numVatAmount)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numVatAmountCollected)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numVatAmountPending)}
                            </td>
                            <td
                              className="text-right"
                              style={{
                                background: "rgb(232 224 255)",
                              }}
                            >
                              {_formatMoney(item?.numTaxAmount)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numTaxAmountCollected)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numTaxAmountPending)}
                            </td>
                            <td
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                height: "auto",
                              }}
                            >
                              <span
                                onClick={() => {
                                  setClickedItem(item);
                                  setViewModal(true);
                                }}
                              >
                                <IView />
                              </span>
                              <span
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">Receive</Tooltip>
                                  }
                                >
                                  <span
                                    onClick={() => {
                                      setClickedItem(item);
                                      setReceiveModal(true);
                                    }}
                                  >
                                    <i
                                      className={`flaticon-download-1`}
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* view modal */}
              <IViewModal
                show={viewModal}
                onHide={() => {
                  setViewModal(false);
                  setClickedItem("");
                }}
              >
                <DetailsViewModal
                  clickedItem={clickedItem}
                  landingValues={values}
                />
              </IViewModal>
              {/* receive modal */}
              <IViewModal
                show={receiveModal}
                onHide={() => {
                  setReceiveModal(false);
                  setClickedItem("");
                }}
              >
                <ReceiveEntryModal
                  clickedItem={clickedItem}
                  getData={getData}
                  landingValues={values}
                  setReceiveModal={setReceiveModal}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default InvoiceWisePaymentLanding;
