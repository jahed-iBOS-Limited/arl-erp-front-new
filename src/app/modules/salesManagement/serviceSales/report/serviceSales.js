import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import { _dateFormatter } from "../../../_helper/_dateFormate";


const initData = {
  reportType: "",
  customer: "",
  paymentType: "",
  fromDate: "",
  toDate: "",
};

export default function ServiceSalesReport() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();

  useEffect(() => {
    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (values) => {
    const strFromAndToDate =
      values?.fromDate && values?.toDate
        ? `&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
        : "";
    const url =
      values?.reportType?.value === 1
        ? `/oms/ServiceSales/GetServiceSaleOrderReport?BusinessUnitId=${
            selectedBusinessUnit?.value
          }&CustomerId=${values?.customer?.value || 0}&PaymentTypeId=${values
            ?.paymentType?.value || 0}${strFromAndToDate}`
        : `/oms/ServiceSales/GetServiceSalesBillReport?BusinessUnitId=${
            selectedBusinessUnit?.value
          }&CustomerId=${values?.customer?.value || 0}${strFromAndToDate}`;
    getRowData(url);
  };

  // Calculate totals for Report Type 1
  const totals = rowData?.reduce(
    (acc, item) => {
      acc.totalScheduleCount += item?.totalScheduleCount || 0;
      acc.totalScheduleAmount += item?.totalScheduleAmount || 0;
      acc.totalInvoiceCount += item?.totalInvoiceCount || 0;
      acc.totalInvoiceAmount += item?.totalInvoiceAmount || 0;
      acc.totalCollectionAmount += item?.totalCollectionAmount || 0;
      acc.totalPendingAmount += item?.totalPendingAmount || 0;
      return acc;
    },
    {
      totalScheduleCount: 0,
      totalScheduleAmount: 0,
      totalInvoiceCount: 0,
      totalInvoiceAmount: 0,
      totalCollectionAmount: 0,
      totalPendingAmount: 0,
    }
  );

  // Calculate totals for Report Type 2
  const totalsType2 = rowData?.reduce(
    (acc, item) => {
      acc.licenceInvocieCount += item?.licenceInvocieCount || 0;
      acc.licenceTotalInvoiceAmount += item?.licenceTotalInvoiceAmount || 0;
      acc.licenceTotalCollectionAmount +=
        item?.licenceTotalCollectionAmount || 0;
      acc.licenceTotalPendingAmount += item?.licenceTotalPendingAmount || 0;
      acc.amcInvoiceCount += item?.amcInvoiceCount || 0;
      acc.amcInvoiceAmount += item?.amcInvoiceAmount || 0;
      acc.amcCollectionAmount += item?.amcCollectionAmount || 0;
      acc.amcPendingAmount += item?.amcPendingAmount || 0;
      return acc;
    },
    {
      licenceInvocieCount: 0,
      licenceTotalInvoiceAmount: 0,
      licenceTotalCollectionAmount: 0,
      licenceTotalPendingAmount: 0,
      amcInvoiceCount: 0,
      amcInvoiceAmount: 0,
      amcCollectionAmount: 0,
      amcPendingAmount: 0,
    }
  );

  const saveHandler = (values, cb) => {};

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
            title="Service Sales Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "Sales Order Wise Report" },
                        { value: 2, label: "Service Sales Bill Report" },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        setRowData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="paymentType"
                        options={[
                          { value: 1, label: "Re-Curring" },
                          { value: 2, label: "One Time" },
                        ]}
                        value={values?.paymentType}
                        label="Payment Type"
                        onChange={(valueOption) => {
                          setFieldValue("paymentType", valueOption);
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
                      />
                    </div>
                    <div className="col-lg-2">
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
                    <div className="col-lg-2">
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
                  <div>
                    <button
                      onClick={() => {
                        getData(values);
                      }}
                      type="button"
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  {values?.reportType?.value === 1 && (
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Order Code</th>
                          <th>Payment Type</th>
                          <th>Customer Name</th>
                          <th>Customer Code</th>
                          <th>Agreement Date</th>
                          <th>Actual Live Date</th>
                          <th>Warranty Month</th>
                          <th>Schedule Count</th>
                          <th>Schedule Amount</th>
                          <th>Invoice Count</th>
                          <th>Invoice Amount</th>
                          <th>Collection Amount</th>
                          <th>Pending Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.strServiceSalesOrderCode}
                            </td>
                            <td>{item?.strPaymentType}</td>
                            <td>{item?.strCustomerName}</td>
                            <td>{item?.strCustomerCode}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.agreementDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteActualLiveDate)}
                            </td>
                            <td className="text-center">
                              {item?.intWarrantyMonth}
                            </td>
                            <td className="text-right">
                              {item?.totalScheduleCount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.totalScheduleAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.totalInvoiceCount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.totalInvoiceAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.totalCollectionAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.totalPendingAmount || "N/A"}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="8" className="text-center">
                            <strong>Total</strong>
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalScheduleCount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalScheduleAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalInvoiceCount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalInvoiceAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalCollectionAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalPendingAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {values?.reportType?.value === 2 && (
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Customer Name</th>
                          <th>Licence Invoice Count</th>
                          <th>Licence Total Invoice Amount</th>
                          <th>Licence Total Collection Amount</th>
                          <th>Licence Total Pending Amount</th>
                          <th>AMC Invoice Count</th>
                          <th>AMC Invoice Amount</th>
                          <th>AMC Collection Amount</th>
                          <th>AMC Pending Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.strCustomerName}</td>
                            <td className="text-right">
                              {item?.licenceInvocieCount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.licenceTotalInvoiceAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.licenceTotalCollectionAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.licenceTotalPendingAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.amcInvoiceCount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.amcInvoiceAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.amcCollectionAmount || "N/A"}
                            </td>
                            <td className="text-right">
                              {item?.amcPendingAmount || "N/A"}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="2" className="text-center">
                            <strong>Total</strong>
                          </td>
                          <td className="text-right">
                            {Math.round(totalsType2.licenceInvocieCount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totalsType2.licenceTotalInvoiceAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(
                              totalsType2.licenceTotalCollectionAmount
                            )}
                          </td>
                          <td className="text-right">
                            {Math.round(totalsType2.licenceTotalPendingAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totalsType2.amcInvoiceCount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totalsType2.amcInvoiceAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totalsType2.amcCollectionAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totalsType2.amcPendingAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
