import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import ClearInvoiceViewModel from "./clearInvoiceViewModel";

function ClearInvoiceGrid({
  gridData,
  allGridCheck,
  itemSlectedHandler,
  setClearInvoiceGridData,
}) {
  const [isClearInvViewModel, setIsClearInvViewModel] = useState(false);
  const [gridRowItem, setGridRowItem] = useState("");
  return (
    <>
      {gridData?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 global-table">
            <thead>
              <tr>
                {/* <th style={{ width: "25px" }}>
                  <input
                    type="checkbox"
                    id="parent"
                    onChange={(event) => {
                      setClearInvoiceGridData(
                        allGridCheck(event.target.checked, gridData)
                      );
                    }}
                  />
                </th> */}
                <th style={{ width: "25px" }}>Sl</th>
                <th>Invoice Code</th>
                <th>Transaction Date</th>
                <th>Supplier</th>
                <th>Warehouse Name</th>
                <th>PO Amount</th>
                <th>GRN Amount</th>
                <th>Invoice Amount</th>
                <th style={{ width: "90px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => (
                <tr key={index}>
                  {/* <td>
                    <input
                      id="itemCheck"
                      type="checkbox"
                      className=""
                      value={item?.itemCheck}
                      checked={item?.itemCheck}
                      name={item?.itemCheck}
                      onChange={(e) => {
                        setClearInvoiceGridData(
                          itemSlectedHandler(e.target.checked, index, gridData)
                        );
                      }}
                    />
                  </td> */}
                  <td>{item?.sl}</td>
                  <td>
                    <div className="pl-2">{item?.invoiceCode}</div>
                  </td>
                  <td>
                    <div className="text-right pr-2">
                      {item?.transanctionDate
                        ? _dateFormatter(item?.transanctionDate)
                        : "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.partnerName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.wareHouseName}</div>
                  </td>
                  <td>
                    <div className="text-right pr-2">{item?.poAmount}</div>
                  </td>
                  <td>
                    <div className="text-right pr-2">{item?.grnAmount}</div>
                  </td>
                  <td>
                    <div className="text-right pr-2">{item?.invoiceAmount}</div>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-around">
                      <span className="view">
                        <IView
                          clickHandler={() => {
                            setGridRowItem(item);
                            setIsClearInvViewModel(true);
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
      )}
      <ClearInvoiceViewModel
        show={isClearInvViewModel}
        gridRowItem={gridRowItem}
        onHide={() => setIsClearInvViewModel(false)}
      />
    </>
  );
}

export default ClearInvoiceGrid;
