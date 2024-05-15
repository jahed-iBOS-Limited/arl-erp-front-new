import React, { useEffect, useState } from "react";
import { getSalesPlanById } from "../salesAndProductionPlan/helper";

const ViewModal = ({ id }) => {
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState([]);

  useEffect(() => {
    if (id) {
      getSalesPlanById(id, setSingleData, setRowDto);
    }
  }, [id]);

  return (
    <div>
                <div className="table-responsive">
<table className="global-table table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Name</th>
            <th>BOM</th>
            <th>UoM Name</th>
            <th style={{ width: "150px" }}>Sales Plan Quantity</th>
            <th style={{ width: "150px" }}>Rate</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.data?.map((item, index) => {
            if (item?.itemPlanQty > 0) {
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="pl-2">{item?.itemName}</td>
                  <td className="pl-2">{item?.bomname}</td>
                  <td className="text-center">{item?.uomName}</td>
                  <td className="text-center">{item?.itemPlanQty}</td>
                  <td className="text-center">{item?.rate}</td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
</div>
      
    </div>
  );
};

export default ViewModal;
