import React from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { mopTenderCreateDataTableHeader } from "../helper";
import InputField from "../../../../_helper/_inputField";

const BADCMOPRowsData = ({ mopRowsData, updateMopRowsData, tenderId }) => {
  return (
    <div className="table-responsive">
      <table
        id="table-to-xlsx"
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table"
        }
      >
        <thead>
          <tr>
            {mopTenderCreateDataTableHeader?.map((head) => (
              <th>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mopRowsData?.map((item, index) => (
            <tr key={index}>
              <td>{item?.portName}</td>
              <td>{item?.ghatName}</td>
              <td>
                {
                  <InputField
                    value={mopRowsData[index]?.distance}
                    name={`mopRowsData[${index}].distance`}
                    type="number"
                    onChange={(e) => {
                        updateMopRowsData(
                        `mopRowsData[${index}].distance`,
                        e.target.value
                      );
                    }}
                  />
                }
              </td>
              <td>{item?.rangOto100}</td>
              <td>{item?.rang101to200}</td>
              <td>{item?.rang201to300}</td>
              <td>{item?.rang301to400}</td>
              <td>{item?.rang401to500}</td>
              <td>{item?.totalRate}</td>
              <td>{item?.taxVat}</td>
              <td>{item?.invoiceCost}</td>
              <td>{item?.labourBill}</td>
              <td>{item?.transPortCost}</td>
              <td>{item?.additionalCost}</td>
              <td>{item?.totalCost}</td>
              <td>{item?.totalRecive}</td>
              <td>{item?.quantity}</td>
              <td>{item?.billAmount}</td>
              <td>{item?.costAmount}</td>
              <td>{item?.profitAmount}</td>
              <td>
                <IDelete
                  remover={() => {
                    const updatedData = mopRowsData?.filter(
                      (_, id) => index !== id
                    );
                    updateMopRowsData(updatedData);
                  }}
                  id={index}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BADCMOPRowsData;
