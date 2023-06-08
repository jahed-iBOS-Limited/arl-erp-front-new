import React from "react";

export default function TaxpayerInfoReport({ gridData }) {
  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="4">Part-1: TAXPAYER'S INFORMATION</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="text-right pr-2">1</div>
            </td>
            <td>
              <div className="pl-2"><b>BIN</b></div>
            </td>
            <td>
              <div className="text-center">:</div>
            </td>
            <td>
              <div className="text-left pl-2"><b>{gridData?.bin}</b></div>
            </td>
          </tr>
          {/* 2nd row */}
          <tr>
            <td>
              <div className="text-right pr-2">2</div>
            </td>
            <td>
              <div className="pl-2"><b>Name of Taxpayer</b></div>
            </td>
            <td>
              <div className="text-center">:</div>
            </td>
            <td>
              <div className="text-left pl-2"><b>{gridData?.nameOfTaxpayer}</b></div>
            </td>
          </tr>
          {/* 3rd row */}
          <tr>
            <td>
              <div className="text-right pr-2">3</div>
            </td>
            <td>
              <div className="pl-2"><b>Address of Taxpayer</b></div>
            </td>
            <td>
              <div className="text-center">:</div>
            </td>
            <td>
              <div className="text-left pl-2"><b>{gridData?.addressOfTaxpayer}</b></div>
            </td>
          </tr>
          {/* 4th row */}
          <tr>
            <td>
              <div className="text-right pr-2">4</div>
            </td>
            <td>
              <div className="pl-2"><b>Type of Ownership</b></div>
            </td>
            <td>
              <div className="text-center">:</div>
            </td>
            <td>
              <div className="text-left pl-2"><b>{gridData?.typeOfOwnership}</b></div>
            </td>
          </tr>
          {/* 5th row */}
          <tr>
            <td>
              <div className="text-right pr-2">5</div>
            </td>
            <td>
              <div className="pl-2"><b>Type of Ownership</b></div>
            </td>
            <td>
              <div className="text-center">:</div>
            </td>
            <td>
              <div className="text-left pl-2"><b>{gridData?.economicActivity}</b></div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
