import React from "react";
import { withRouter } from "react-router-dom";

const GridData = ({ rowDto }) => {
  console.log("rowDto", rowDto);
  return (
    <>
      <div className="row global-table">
        <div className="col-lg-12">
          <div className="report_top mt-5 d-flex flex-column justify-content-center align-items-center">
            <h4>Akij Food & Beverage Ltd</h4>
            <h4 className="mb-3">Krishnapur,Dhamrai,Dhaka</h4>
            <h4>Finished Goods Inventory Register (All Warehouse)</h4>
            <h5>Vat Reg: 12345678</h5>
            <h5>Top Sheet Year: 2020 - 2021</h5>
          </div>
        </div>
        <div className="col-lg-12 pr-0 pl-0 my-2">
          <div className="inventory-register-scrollable-table">
            <div className="scroll-table _table">
              <table className="table table-striped table-bordered bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th rowSpan="3">SL</th>
                    <th rowSpan="3">Product Name</th>
                    <th rowSpan="2" colSpan="2">
                      Opening Balance
                    </th>
                    <th colSpan="6">Production</th>
                    <th colSpan="16">Sales</th>
                    <th colSpan="2" rowSpan="2">
                      Closing Balance
                    </th>
                    <th rowSpan="3">Local Rate</th>
                    <th rowSpan="3">Export Rate</th>
                  </tr>

                  <tr>
                    <th colSpan="2">Production</th>
                    <th rowSpan="2">Cr. Note (Qty)</th>
                    <th rowSpan="2">Cr. Note (Value)</th>
                    <th rowSpan="2">Total Stock (Qty)</th>
                    <th rowSpan="2">Total Stock (Value)</th>
                    <th colSpan="4">Local Sales</th>
                    <th rowSpan="2">(Qty) Total Local Sales</th>
                    <th rowSpan="2">
                      Total Local Sales (Value) Without SD + VAT
                    </th>
                    <th colSpan="2">Export Sales</th>
                    <th rowSpan="2">Debit Note</th>
                    <th rowSpan="2">Debit Note Value</th>
                    <th rowSpan="2">Total Sales (Qty)</th>
                    <th rowSpan="2">Total Sales Value (Without SD + VAT)</th>
                    <th colSpan="3">Output Tax/ Payable</th>
                    <th rowSpan="2">Total Sales Value (With SD + VAT)</th>
                    {/* <th rowSpan="3">Local Rate</th>
                    <th rowSpan="3">Export Rate</th> */}
                  </tr>

                  <tr>
                    <th>Quantity</th>
                    <th>Value</th>
                    <th>Production (Qty)</th>
                    <th>Production (Value)</th>
                    <th>Actual Local Sales (Qty)</th>
                    <th>Actual Local Sales (Value) Without SD + VAT</th>
                    <th>Free/Trade Sales (Qty)</th>
                    <th>Free/Trade Sales (Value) Without SD + VAT</th>
                    <th>Export Sales (Qty)</th>
                    <th>Export Sales (Value)</th>
                    <th>SD Payable</th>
                    <th>Vat Payable</th>
                    <th>Sarcharge</th>
                    <th>Quantity</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {rowDto.length >= 0 && */}
                  {rowDto?.map((data, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <div className="text-left pl-2">
                          {data?.productName}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{data?.openingQty}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.openingValue}</div>
                      </td>
                      <td>
                        <div className="pl-2">{data?.productionQty}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.productionValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{data?.crNoteQty}</div>
                      </td>
                      <td>
                        <div className="text-center">{data?.crNoteValue}</div>
                      </td>
                      <td>
                        <div className="text-center">{data?.totalStockQty}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.totalStockValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.actualLocalSalesQty}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.actualLocalSalesValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{data?.freeSalesQty}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.freeSalesValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.totalLocalSalesQty}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.totalLocalSalesValue}
                        </div>
                      </td>

                      <td>
                        <div className="text-center">
                          {data?.exportSalesQty}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.exportSalesValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{data?.debitNoteQty}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.debitNoteValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{data?.totalSalesQty}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.totalSalesValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{data?.sdPayable}</div>
                      </td>
                      <td>
                        <div className="text-center">{data?.vatPayable}</div>
                      </td>
                      <td>
                        <div className="text-center">{data?.surcharge}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.totalSalesValueSDVat}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.closingBalanceQty}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {data?.closingBalanceValue}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{data?.localRate}</div>
                      </td>
                      <td>
                        <div className="text-center">{data?.exportRate}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
