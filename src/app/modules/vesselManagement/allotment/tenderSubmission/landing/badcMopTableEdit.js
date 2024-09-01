import React from "react";
import InputField from "../../../../_helper/_inputField";
import {
    mopTenderEditDataTableHeader
} from "../helper";

const BADCMopTableEdit = ({
  mopRowsData,
  updateMopRowsData,
  values,
  tenderId,
}) => {
  return (
    <div className="table-responsive">
      <table
        id="table-to-xlsx"
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table common-scrollable-table two-column-sticky"
        }
      >
        <thead>
          <tr>
            {mopTenderEditDataTableHeader?.map((head, index) => (
              <th key={index} className="text-right">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mopRowsData?.map((item, index) => {
            return (
              <tr key={index} className="text-right">
                <td>{index + 1}</td>
                <td className="text-center">{item?.portName}</td>
                <td className="text-center">{item?.ghatName}</td>
                <td className="text-center">{item?.quantity}</td>

                <td>
                  <InputField
                    value={item?.actualQuantity || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      const newValue = e.target?.value || 0;
                      const newMopRowsData = [...mopRowsData];
                      newMopRowsData[index] = {
                        ...newMopRowsData[index],
                        actualQuantity: newValue,
                      };
                      updateMopRowsData(newMopRowsData)
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BADCMopTableEdit;
