import React, { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";

const ActivityListModal = ({ clickedItem }) => {
  const [rowData, getRowData, rowDataLoader] = useAxiosGet();
  useEffect(() => {
    if (clickedItem) {
      console.log("clickedItem", clickedItem);
      //   getRowData()
    }
  }, [clickedItem]);

  return (
    <div>
      {rowDataLoader && <Loading />}
      <table className="table table-striped table-bordered global-table mt-0">
        <thead>
          <tr>
            <th>Sl</th>
            <th>Activity</th>
            <th>Supplier</th>
            <th>Currency</th>
            <th>Budget Amount</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.length &&
            rowData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.activityName}</td>
                <td>{item?.supplierName}</td>
                <td>{item?.currencyName}</td>
                <td>{item?.budgetAmount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityListModal;
