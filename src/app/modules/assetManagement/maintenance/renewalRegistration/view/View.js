import React, { useEffect, useState } from "react";
import { getSingleDataById } from "../helper";

const ViewRowItem = ({ currentRowId, item }) => {
  // singledata
  const [data, setData] = useState("");

  // get single data by id
  useEffect(() => {
    getSingleDataById(currentRowId, setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="text-center mt-2">
        <strong className="mr-5">
          Asset Name : {item?.assetName || item?.strAssetName}
        </strong>{" "}
        <strong className="ml-5">
          Service Name : {item?.renewalServiceName}
        </strong>
      </div>
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
