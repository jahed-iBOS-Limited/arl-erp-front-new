import React from "react";
import InputField from "../../../../_helper/_inputField";
import {
  commonFieldValueChange,
  mopTenderCreateDataTableHeader,
} from "../helper";

const BADCMOPRowsData = ({
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
            {mopTenderCreateDataTableHeader?.map((head, index) => (
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
                <td>
                  <InputField
                    value={item?.distance || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) =>
                      commonFieldValueChange(
                        e,
                        item,
                        index,
                        values,
                        mopRowsData,
                        updateMopRowsData,
                        "distance"
                      )
                    }
                  />
                </td>
                <td>{item?.rang0to100}</td>
                <td>{item?.rang101to200}</td>
                <td>{item?.rang201to300}</td>
                <td>{item?.rang301to400}</td>
                <td>{item?.rang401to500}</td>
                <td>{item?.totalRate}</td>
                <td>{item?.taxVat}</td>
                <td>
                  <InputField
                    value={item?.invoiceCost || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      commonFieldValueChange(
                        e,
                        item,
                        index,
                        values,
                        mopRowsData,
                        updateMopRowsData,
                        "invoiceCost"
                      );
                    }}
                  />
                </td>
                <td>
                  <InputField
                    value={item?.labourBill || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      commonFieldValueChange(
                        e,
                        item,
                        index,
                        values,
                        mopRowsData,
                        updateMopRowsData,
                        "labourBill"
                      );
                    }}
                  />
                </td>
                <td>
                  <InputField
                    value={item?.transPortCost || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      commonFieldValueChange(
                        e,
                        item,
                        index,
                        values,
                        mopRowsData,
                        updateMopRowsData,
                        "transPortCost"
                      );
                    }}
                  />
                </td>
                <td>
                  <InputField
                    value={item?.additionalCost || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      commonFieldValueChange(
                        e,
                        item,
                        index,
                        values,
                        mopRowsData,
                        updateMopRowsData,
                        "additionalCost"
                      );
                    }}
                  />
                </td>
                <td>{item?.totalCost}</td>
                <td>{item?.totalRecieve}</td>
                <td>
                  <InputField
                    value={item?.quantity || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      commonFieldValueChange(
                        e,
                        item,
                        index,
                        values,
                        mopRowsData,
                        updateMopRowsData,
                        "quantity"
                      );
                    }}
                  />
                </td>
                <td>{item?.billAmount}</td>
                <td>{item?.costAmount}</td>
                <td>{item?.profitAmount}</td>
                {/* <td>
                  <IDelete
                    remover={() => {
                      const updatedData = mopRowsData?.filter(
                        (_, id) => index !== id
                      );
                      updateMopRowsData(updatedData);
                    }}
                    id={index}
                  />
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BADCMOPRowsData;
