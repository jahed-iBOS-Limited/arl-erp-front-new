import React from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";

const LandingTable = ({ obj }) => {
  const { gridData } = obj;
  const history = useHistory();

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Expense Particular</th>
              <th>Category</th>
              <th>isActive</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => (
              <tr key={index}>
                <td className="text-center"> {index + 1}</td>
                <td>{item?.particularName}</td>
                <td>{item?.category}</td>
                <td>{item?.isActive ? "True" : "False"} </td>
                <td>
                  <div
                    className="d-flex justify-content-around"
                    style={{
                      gap: "8px",
                    }}
                  >
                    <span
                      onClick={() => {
                        history.push(
                          `/ShippingAgency/Configuration/ExpenseParticulars/edit/${item?.expenseParticularsId}`
                        );
                      }}
                    >
                      <IEdit />
                    </span>

                    {/* <span onClick={() => {}}>
                    <IView />
                  </span> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LandingTable;
