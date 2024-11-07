import React, { useContext } from "react";
// import CommonTable from "../../../_helper/commonTable";
import IDelete from "../../../_helper/_helperIcons/_delete";
import { headerRowTableHeaders } from "./helper";
import { QcManagementContext } from "./qcManagementContext";

export default function ItemTable({ grandParentIndex, parentIndex, itemRows }) {
  const {
    actualValueHandler,
    handleManualDeduction,
    handleRemarks,
    handleRowItemDelete,
  } = useContext(QcManagementContext);
  const tableHead = (
    <thead>
      <tr>
        {headerRowTableHeaders?.map((item) => (
          <th>{item}</th>
        ))}
      </tr>
    </thead>
  );

  let totalActualValue = 0;
  let totalManualDeduction = 0;
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          {tableHead}
          <tbody>
            {itemRows &&
              itemRows?.map((item, childIndex) => {
                // totalSystemDeduction += item?.systemDeduction || 0;
                totalActualValue += item?.actualValue || 0;
                totalManualDeduction += item?.manualDeduction || 0;
                return (
                  <tr key={childIndex}>
                    <td>{childIndex + 1}</td>
                    <td>{item?.parameterName}</td>
                    <td>{item?.standardValue}</td>
                    <td>
                      <input
                        value={item?.actualValue || ""}
                        name="actualValue"
                        type="number"
                        onChange={(e) =>
                          actualValueHandler(
                            e,
                            grandParentIndex,
                            parentIndex,
                            childIndex
                          )
                        }
                      />
                    </td>
                    <td>{item?.systemDeduction}</td>
                    {/* <td>
                      <input
                        value={item?.manualDeduction || ""}
                        name="manualDeduction"
                        type="number"
                        onChange={(e) =>
                          handleManualDeduction(
                            e,
                            grandParentIndex,
                            parentIndex,
                            childIndex
                          )
                        }
                      />
                    </td> */}
                    <td>
                      <input
                        value={item?.remarks || ""}
                        name="remarks"
                        type="text"
                        onChange={(e) =>
                          handleRemarks(
                            e,
                            grandParentIndex,
                            parentIndex,
                            childIndex
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <span
                        onClick={() =>
                          handleRowItemDelete(
                            grandParentIndex,
                            parentIndex,
                            childIndex
                          )
                        }
                      >
                        <IDelete />
                      </span>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan={3}>Total</td>
              <td>{totalActualValue}</td>

              <td>{""}</td>
              {/* <td>{totalManualDeduction}</td> */}
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
