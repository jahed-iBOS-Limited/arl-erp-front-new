import React from "react";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import IView from "./../../../../_helper/_helperIcons/_view";
const SalesTable = ({
  setOneLabelModel,
  gridData,
  values,
  setParentRowClickData,
}) => {
  return (
    <>
      <div>
        <div className="row global-table">
          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>S/N</th>
                  <th style={{ width: "150px" }}>Sales Inv No</th>
                  <th>Invoice Date</th>
                  <th>SD Total</th>
                  <th>VAT Total</th>

                  <th>Grand Total</th>
                  <th>Action By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((tableData, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.salesCode} </td>
                      <td> {_dateFormatter(tableData?.purchaseDate)} </td>
                      <td className="text-right">
                        {" "}
                        {_fixedPoint(tableData?.sdTotal)}{" "}
                      </td>
                      <td className="text-right">
                        {" "}
                        {_fixedPoint(tableData?.vatTotal)}{" "}
                      </td>

                      <td className="text-right">
                        {" "}
                        {_fixedPoint(tableData?.grandTotal)}{" "}
                      </td>
                      <td> {tableData?.createdBy} </td>
                      <td>
                        <span className="d-flex justify-content-center align-items-center">
                          <span
                            onClick={() => {
                              setOneLabelModel(true);
                              setParentRowClickData(tableData);
                            }}
                          >
                            <IView />
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesTable;
