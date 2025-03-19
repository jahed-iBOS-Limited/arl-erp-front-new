import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import DetailsViewModal from "./detailsViewModal";
import { exportInvoiceWisePayment } from "./helper";
import ReceiveEntryModal from "./receiveEntryModal";

const initData = {
  businessUnit: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: "",
};
const InvoiceWisePaymentLanding = () => {
  const { location } = useHistory();

  // const profileData = useSelector((state) => {
  //   return state.authData.profileData;
  // }, shallowEqual);

  // const { selectedBusinessUnit } = useSelector(
  //   (state) => state?.authData,
  //   shallowEqual
  // );

  const saveHandler = (values, cb) => {};
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();

  const [clickedItem, setClickedItem] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);

  const getData = (values) => {
    getTableData(
      `/fino/PaymentOrReceive/GetInvoiceWisePayment?partName=Report&businessUnitId=${
        values?.businessUnit?.value
      }&customerId=${location?.state?.rowData?.customerId}&fromDate=${
        values?.fromDate
      }&toDate=${values?.toDate}&status=${
        values?.status?.value
      }&TerritoryId=${values?.teritory?.value || 0}`
    );
  };

  useEffect(() => {
    const businessUnitId = location?.state?.values?.businessUnit?.value || "";
    const customerId = location?.state?.rowData?.customerId;
    const fromDate = location?.state?.values?.fromDate || "";
    const toDate = location?.state?.values?.toDate || "";
    const status = location?.state?.values?.status?.value || "";
    const territoryId = location?.state?.values?.teritory?.value || 0;

    // Checking if customerId is defined before making the API call
    if (customerId !== undefined) {
      const url = `/fino/PaymentOrReceive/GetInvoiceWisePayment?partName=Report&businessUnitId=${businessUnitId}&customerId=${customerId}&fromDate=${fromDate}&toDate=${toDate}&status=${status}&TerritoryId=${territoryId}`;

      getTableData(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.rowData?.customerId, location]);

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
            // isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      name="Business Unit"
                      label="Business Unit"
                      value={location?.state?.values?.businessUnit?.label}
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      name="Teritory"
                      label="Teritory"
                      value={location?.state?.values?.teritory?.label}
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      name="Customer"
                      label="Customer"
                      value={location?.state?.rowData?.customerName}
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="date"
                      name="fromDate"
                      label="From Date"
                      value={location?.state?.values?.fromDate}
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="date"
                      name="toDate"
                      label="To Date"
                      value={location?.state?.values?.toDate}
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      name="Status"
                      label="Status"
                      value={location?.state?.values?.status?.label}
                      disabled
                    />
                  </div>
                  <div className="col-lg-4">
                    {/* <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        !values?.businessUnit ||
                        !values?.customer ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.status
                      }
                      onClick={(e) => {
                        getData(values);
                      }}
                    >
                      Show
                    </button> */}
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary ml-2"
                      onClick={(e) => {
                        if (!tableData?.length) {
                          return toast.warn("No data found for export excel");
                        } else {
                          exportInvoiceWisePayment(tableData);
                        }
                      }}
                    >
                      Export Excel
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="table-responsive">
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
                          <th
                            style={{
                              minWidth: "70px",
                            }}
                          >
                            Overdue <br /> Days
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
                          {values?.businessUnit?.value !== 186 ? (
                            <th>
                              AIT <br /> Amount
                            </th>
                          ) : null}
                          <th>
                            Collected <br /> AIT
                          </th>
                          {values?.businessUnit?.value !== 186 ? (
                            <th>
                              Pending AIT <br />
                              Amount
                            </th>
                          ) : null}
                          <th
                            style={{
                              width: "80px",
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
                              <td className="text-center">
                                {/* {_dateFormatter(item?.dteDueDate)} */}
                                {item?.intOverdueDays}
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
                              {values?.businessUnit?.value !== 186 ? (
                                <td
                                  className="text-right"
                                  style={{
                                    background: "rgb(232 224 255)",
                                  }}
                                >
                                  {_formatMoney(item?.numTaxAmount)}
                                </td>
                              ) : null}
                              <td className="text-right">
                                {_formatMoney(item?.numTaxAmountCollected)}
                              </td>
                              {values?.businessUnit?.value !== 186 ? (
                                <td className="text-right">
                                  {_formatMoney(item?.numTaxAmountPending)}
                                </td>
                              ) : null}
                              <td className="text-center d-flex justify-content-around align-items-center">
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
                        {tableData?.length > 0 ? (
                          <tr>
                            <td colSpan={7}>Total</td>
                            <td
                              className="text-right"
                              style={{
                                background: "rgb(233 255 255)",
                              }}
                            >
                              {_formatMoney(
                                tableData?.reduce(
                                  (acc, cur) => acc + cur?.numDeliveryAmount,
                                  0
                                )
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                tableData?.reduce(
                                  (acc, cur) =>
                                    acc + cur?.numDeliveryAmountCollected,
                                  0
                                )
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                tableData?.reduce(
                                  (acc, cur) =>
                                    acc + cur?.numDeliveryAmountPending,
                                  0
                                )
                              )}
                            </td>
                            <td
                              className="text-right"
                              style={{
                                background: "rgb(255 220 220)",
                              }}
                            >
                              {_formatMoney(
                                tableData?.reduce(
                                  (acc, cur) => acc + cur?.numVatAmount,
                                  0
                                )
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                tableData?.reduce(
                                  (acc, cur) =>
                                    acc + cur?.numVatAmountCollected,
                                  0
                                )
                              )}
                            </td>
                            <td className="text-right">
                              {_formatMoney(
                                tableData?.reduce(
                                  (acc, cur) => acc + cur?.numVatAmountPending,
                                  0
                                )
                              )}
                            </td>
                            {values?.businessUnit?.value !== 186 ? (
                              <td
                                className="text-right"
                                style={{
                                  background: "rgb(232 224 255)",
                                }}
                              >
                                {_formatMoney(
                                  tableData?.reduce(
                                    (acc, cur) => acc + cur?.numTaxAmount,
                                    0
                                  )
                                )}
                              </td>
                            ) : null}
                            <td className="text-right">
                              {_formatMoney(
                                tableData?.reduce(
                                  (acc, cur) =>
                                    acc + cur?.numTaxAmountCollected,
                                  0
                                )
                              )}
                            </td>
                            {values?.businessUnit?.value !== 186 ? (
                              <td className="text-right">
                                {_formatMoney(
                                  tableData?.reduce(
                                    (acc, cur) =>
                                      acc + cur?.numTaxAmountPending,
                                    0
                                  )
                                )}
                              </td>
                            ) : null}
                            <td></td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
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
                  landingValues={location?.state?.values}
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
                  landingValues={location?.state?.values}
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
