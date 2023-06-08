import React from "react";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const ClosingLanding = ({ data, closingTotalBookedAmount , total }) => {

  const totalCalculation = (itm) => {
    total.TotalBillAmount += itm?.numAdvanceAmount;
    total.TotalActualBill += itm?.numBillAmount;
    total.TotalVat += itm?.numVatAmount;
  };

  return (
    <>
      <div className="react-bootstrap-table table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Supplier</th>
              <th>Advance</th>
              <th>Bill with VAT</th>
              <th>VAT</th>
            </tr>
          </thead>
          <tbody>
            {data?.row?.length > 0 &&
              data?.row?.map((item, index) => {
                totalCalculation(item);
                return (
                  <>
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>
                        <span className="pl-2">{item?.supplierName}</span>
                      </td>
                      <td className="text-center">
                        <span>{numberWithCommas(item?.numAdvanceAmount)}</span>
                      </td>
                      <td className="text-center">
                        <span>{numberWithCommas(item?.numBillAmount)}</span>
                      </td>
                      <td className="text-center">
                        <span>{numberWithCommas(item?.numVatAmount)}</span>
                      </td>
                    </tr>
                  </>
                );
              })}
              {
                <tr>
                <td></td>
                <td className="text-right">
                  <b>Total:</b>{" "}
                </td>
                <td className="text-center" style={{ fontWeight: "700" }}>{numberWithCommas(total?.TotalBillAmount)}</td>
                <td className="text-center" style={{ fontWeight: "700" }}>{numberWithCommas(total?.TotalActualBill)}</td>
                <td className="text-center" style={{ fontWeight: "700" }}>{numberWithCommas(total?.TotalVat)}</td>
              </tr>
              }
          </tbody>
        </table>
        <div className="d-flex align-items-center justify-content-center">
          <span className="mx-4">
            <span style={{ fontWeight: "900" }}>Total Booked Amount: </span>
            {closingTotalBookedAmount}
          </span>
          <span className="mx-4">
            <span style={{ fontWeight: "900" }}>Total Actual Bill: </span>
            {total?.TotalActualBill}
          </span>
          <span className="mx-4">
            <span style={{ fontWeight: "900" }}>Adjustment Amount: </span>
            {closingTotalBookedAmount - total?.TotalActualBill}
          </span>
        </div>
      </div>
    </>
  );
};

export default ClosingLanding;
