import React, { useEffect, useState } from "react";
import { getSingleDataById } from "../helper";

const ViewRowItem = ({ currentRowId }) => {
  // singledata
  const [data, setData] = useState("");

  // get single data by id
  useEffect(() => {
    if (currentRowId) {
      getSingleDataById(currentRowId, setData);
    }
  }, [currentRowId]);

  return (
    <div>
      <div className="table-responsive">
        <table style={{ width: "50%" }} className="table global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Attribute</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data?.objRow?.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.attributeName}</td>
                  <td className="text-right">{item?.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewRowItem;
