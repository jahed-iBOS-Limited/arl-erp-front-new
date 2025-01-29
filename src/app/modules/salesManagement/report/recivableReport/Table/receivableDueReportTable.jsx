import React from "react";
import BootstrapTable from "react-bootstrap-table-next";

  // Table columns
  const columns = [
    {
      dataField: "businessPartnerName",
      text: "Partner Name",
    },
    {
      dataField: "invoiceCode",
      text: "Invoice Code",
    },
    {
      dataField: "amount",
      text: "Amount",
      classes: "text-right",
    },
    {
      dataField: "clearedAmount",
      text: "Clear Amount",
      classes: "text-right",
    },
    {
      dataField: "adjustmentPendingAmount",
      text: "Pending Amount",
      classes: "text-right",
    },
  ];
function ReceivableDueReportTable({gridData}) {
  return (
    <>
      <div
        style={{ lineHeight: "1rem" }}
        className='Recivable-Due-Report table table-striped table-bordered mt-3 bj-table bj-table-landing'
      >
        <BootstrapTable
          bootstrap4
          bordered={false}
          remote
          keyField='controllingUnitId'
          data={gridData || []}
          columns={columns}
        ></BootstrapTable>
      </div>
    </>
  );
}

export default ReceivableDueReportTable;
