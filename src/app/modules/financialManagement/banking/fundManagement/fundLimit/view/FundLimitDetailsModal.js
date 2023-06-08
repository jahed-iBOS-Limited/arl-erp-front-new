import React, { useEffect, useMemo, useState } from "react";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import { getFundLimitDetails } from "../../helper";

const FundLimitDetailsModal = ({ singleItem }) => {
  const [details, setDetails] = useState([]);
  const [, setLoading] = useState(false);

  useEffect(() => {
    getFundLimitDetails(
      singleItem?.businessUnitId,
      singleItem?.bankId,
      singleItem?.facilityId,
      setDetails,
      setLoading
    );
  }, [singleItem]);

  const totalAmount = useMemo(
    () => details?.reduce((a, c) => a + c?.numAmount, 0),
    [details]
  );
  return (
    <>
      <div className="row">
        <div className="col-12">
          <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
            <thead className="bg-secondary">
              <tr>
                <th>SL</th>
                <th>Facility</th>
                <th>Loan Class</th>
                <th>Utilization By</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {details?.map((item, index) => (
                <tr className="index">
                  <td>{index + 1}</td>
                  <td>{item?.strFacility}</td>
                  <td>{item?.strLoanClass}</td>
                  <td>{item?.strUtilizationBy}</td>
                  <td className="text-right">
                    {_formatMoney(item?.numAmount)}
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={4} className="text-right">
                  <b>Total</b>
                </td>
                <td className="text-right">
                  <b>{_formatMoney(totalAmount)}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FundLimitDetailsModal;
