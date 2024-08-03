import React from "react";
import IForm from "../../../../_helper/_form";

// Sample data as provided in the JSON

const ServiceSalesOrderView = ({ serviceSalesOrderData }) => {
  const { items, schedules } = serviceSalesOrderData;

  return (
    <IForm
      title="Service Sales Order Details"
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      <div className="container mx-auto p-4">
        {/* <h2 className="text-2xl font-bold mb-4">Service Sales Order Details</h2> */}
        {/* Header Information */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">
                Sales Order Code:{" "}
                <span className="font-normal">
                  {serviceSalesOrderData?.strServiceSalesOrderCode}
                </span>
              </p>
              <p className="font-semibold">
                Customer Name:{" "}
                <span className="font-normal">
                  {serviceSalesOrderData?.strCustomerName}
                </span>
              </p>
              <p className="font-semibold">
                Sales Type:{" "}
                <span className="font-normal">
                  {serviceSalesOrderData?.strSalesTypeName}
                </span>
              </p>
              <p className="font-semibold">
                Payment Type:{" "}
                <span className="font-normal">
                  {serviceSalesOrderData?.strPaymentType}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <h3 className=" font-semibold my-2">Items</h3>
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Item Name</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">Rate</th>
                <th className="border border-gray-300 p-2">UOM</th>
                <th className="border border-gray-300 p-2">Sales Amount</th>
                <th className="border border-gray-300 p-2">VAT Amount</th>
                <th className="border border-gray-300 p-2">Net Sales Amount</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr key={item?.intServiceSalesOrderRowId}>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.strItemName}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.numSalesQty}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.numRate}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.strUom}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.numSalesAmount}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.numSalesVatAmount}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.numNetSalesAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Schedules Table */}
        <div className="table-responsive">
          <h3 className=" font-semibold my-2">Schedules</h3>
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Create Date</th>
                <th className="border border-gray-300 p-2">Due Date</th>
                <th className="border border-gray-300 p-2">Payment (%)</th>
                <th className="border border-gray-300 p-2">Schedule Amount</th>
                <th className="border border-gray-300 p-2">VAT Amount</th>
                <th className="border border-gray-300 p-2">Invoice Complete</th>
                <th className="border border-gray-300 p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {schedules?.map((schedule) => (
                <tr key={schedule.intServiceSalesScheduleId}>
                  <td className="border border-gray-300 p-2 text-center">
                    {new Date(
                      schedule?.dteScheduleCreateDateTime
                    ).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {new Date(schedule.dteDueDateTime).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {schedule?.intPaymentByPercent}%
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {schedule?.numScheduleAmount}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {schedule?.numScheduleVatAmount}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {schedule?.isInvoiceComplete ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {schedule?.strRemarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </IForm>
  );
};

export default ServiceSalesOrderView;
