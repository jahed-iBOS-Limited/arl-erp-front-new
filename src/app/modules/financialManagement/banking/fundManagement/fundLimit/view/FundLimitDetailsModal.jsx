import React, { useEffect, useMemo, useState } from "react";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import { getFundLimitDetails } from "../../helper";
import IViewModal from "../../../../../_helper/_viewModal";
import LCSummaryDetails from "./lcSummeryDetails";

const FundLimitDetailsModal = ({ singleItem }) => {
  const [details, setDetails] = useState([]);
  const [, setLoading] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [fundLimitDetails, setFundLimitDetails] = useState([]);

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
          <div className="table-responsive">
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
                  <td>
                    {/* {item?.strUtilizationBy} */}
                    <span
                      className="text-primary font-weight-bold cursor-pointer mr-2"
                      style={{ textDecoration: "underline" }}
                      onClick={() => {
                        setIsModalShow(true);
                        setFundLimitDetails(item);
                      }}
                    >
                      {item?.strUtilizationBy ? item?.strUtilizationBy : ""}
                    </span>
                  </td>
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
      </div>
      <IViewModal
        show={isModalShow}
        onHide={() => setIsModalShow(false)}
        title={"LC Summary"}
      >
        <LCSummaryDetails fundLimitDetails={fundLimitDetails} />
      </IViewModal>
    </>
  );
};

export default FundLimitDetailsModal;
