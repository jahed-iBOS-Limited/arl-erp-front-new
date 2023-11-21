import React from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";

const LandingTable = ({ obj }) => {
  const { gridData } = obj;
  const history = useHistory();

  return (
    <div className="table-responsive">
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>SBU</th>
            <th>Vessel</th>
            <th>Voyage No</th>
            <th>Working Port</th>
            <th>Customer Name</th>
            <th>Activity</th>
            <th>Currency</th>
            <th>Exchange Rate</th>
            <th>Estimated Amount</th>
            <th>Final Amount</th>
            <th>Actual Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>
                <div
                  className='d-flex justify-content-around'
                  style={{
                    gap: "8px",
                  }}
                >
                  <span
                    onClick={() => {
                      history.push(
                        `/ShippingAgency/Transaction/EstimatePDA/edit/${item?.complainId}`
                      );
                    }}
                  >
                    <IEdit />
                  </span>

                  <span onClick={() => {}}>
                    <IView />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LandingTable;
