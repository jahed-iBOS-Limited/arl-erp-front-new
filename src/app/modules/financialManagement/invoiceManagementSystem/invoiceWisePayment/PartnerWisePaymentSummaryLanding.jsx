import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { exportInvoiceWisePayment } from "./helper";

const initData = {
  businessUnit: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: "",
};
const PartnerWisePaymentSummaryLanding = () => {
  const history = useHistory();
  const { businessUnitList: businessUnitDDL } = useSelector(
    (store) => store?.authData,
    shallowEqual
  );

  const [
    teritoryDDL,
    getTeritoryDDL,
    teritoryDDLloader,
    setTeritoryDDL,
  ] = useAxiosGet();

  const saveHandler = (values, cb) => {};
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const getData = (values) => {
    getTableData(
      `/fino/PaymentOrReceive/GetInvoiceWisePayment?partName=Summary&businessUnitId=${
        values?.businessUnit?.value
      }&customerId=${0}&fromDate=${values?.fromDate}&toDate=${
        values?.toDate
      }&status=${values?.status?.value}&TerritoryId=${values?.teritory?.value ||
        0}`
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
          {(tableDataLoader || teritoryDDLloader) && <Loading />}
          <IForm
            title="Partner Wise Payment Summary"
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
                          setFieldValue("customer", "");
                          getTeritoryDDL(
                            `/oms/TerritoryInfo/GetTerritoryByBusinessUnitDDL?businessUnitId=${valueOption?.value}&distributionChannelId=0`,
                            (data) => {
                              setTeritoryDDL([
                                { value: 0, label: "All" },
                                ...data,
                              ]);
                            }
                          );
                          setTableData([]);
                        } else {
                          setFieldValue("businessUnit", "");
                          setFieldValue("customer", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="teritory"
                      options={teritoryDDL}
                      value={values?.teritory}
                      label="Teritory"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("teritory", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("teritory", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
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
                  <div className="col-lg-3">
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
                  <div className="col-lg-3">
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
                  <div className="col-lg-4">
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
                          <th style={{ width: "180px" }}>Customer Name</th>
                          <th>
                            Customer <br /> Code
                          </th>
                          <th>
                            Cr <br /> Days
                          </th>
                          <th>
                            Overdue <br /> Days
                          </th>
                          <th>
                            Delivery <br /> Amount
                          </th>
                          <th>
                            Collected <br /> Amount
                          </th>
                          <th>
                            Pending <br /> Amount{" "}
                          </th>
                          <th>
                            VAT <br /> Amount
                          </th>
                          <th>
                            Collected <br /> VAT{" "}
                          </th>
                          <th>
                            Pending <br /> VAT
                          </th>
                          <th>
                            Tax <br /> Amount
                          </th>
                          <th>
                            Tax <br /> Collected
                          </th>
                          <th>
                            Tax <br /> Pending
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {tableData?.length > 0 &&
                          tableData?.map((item, index) => (
                            <tr>
                              <td className="text-left">
                                {item?.strCustomerName}
                              </td>
                              <td className="text-center">
                                {item?.strCutomerCode}
                              </td>
                              <td className="text-center">{item?.intCrDays}</td>
                              <td className="text-center">
                                {item?.intOverdueDays}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numDeliveryAmount)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numDeliveryAmountCollected)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numDeliveryAmountPending)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numVatAmount)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numVatAmountCollected)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numVatAmountPending)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numTaxAmount)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numTaxAmountCollected)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numTaxAmountPending)}
                              </td>
                              <td className="d-flex justify-content-center">
                                <button
                                  style={{}}
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    history.push({
                                      pathname:
                                        "/financial-management/invoicemanagement-system/InvoiceWisePayment/individualReport",
                                      state: {
                                        values,
                                        rowData: {
                                          customerId: item?.intCustomerId,
                                          customerName: item?.strCustomerName,
                                        },
                                      },
                                    });
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default PartnerWisePaymentSummaryLanding;
