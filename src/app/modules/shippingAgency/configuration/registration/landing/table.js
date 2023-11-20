import React from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";

const LandingTable = ({ obj }) => {
  const { gridData } = obj;
  const history = useHistory();

  return (
    <>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>Voyage No</th>
            <th>Vessel Type</th>
            <th>Vessel Name</th>
            <th>Voyage Owne</th>
            <th>Reg</th>
            <th>Load Por</th>
            <th>Arrived Time</th>
            <th>Cargo Na</th>
            <th>Quantity</th>
            <th>Stevedore</th>
            <th>Cargo Own</th>
            <th>Discharge Date</th>
            <th>Discharge</th>
            <th>Remark</th>
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
    </>
  );
};

export default LandingTable;
