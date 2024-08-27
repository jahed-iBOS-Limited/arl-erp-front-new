import React from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import {
  handleDistanceChange,
  mopTenderCreateDataTableHeader
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
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table"
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
            // const newMopRowsData = [...mopRowsData];
            // newMopRowsData[index].totalRecive =
            //   newMopRowsData[index].totalRate - newMopRowsData[index].totalCost;

            // updateMopRowsData(newMopRowsData);

            return (
              <tr key={index}>
                <td>{item?.portName}</td>
                <td>{item?.ghatName}</td>
                <td>
                  <InputField
                    value={item?.distance || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) =>
                      handleDistanceChange(
                        e,
                        item,
                        index,
                        values,
                        mopRowsData,
                        updateMopRowsData
                      )
                    }
                  />
                </td>
                <td>{item?.rangOto100}</td>
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
                      let newValue = +e.target.value || 0;
                      const newMopRowsData = [...mopRowsData];
                      newMopRowsData[index].invoiceCost = newValue;

                      newMopRowsData[index].totalCost =
                        newValue +
                        (+item?.labourBill || 0) +
                        (+item?.transPortCost || 0) +
                        (+item?.additionalCost || 0);

                      newMopRowsData[index].totalRecieve = Math.abs(
                        item?.totalRate - newMopRowsData[index].totalCost
                      );

                      updateMopRowsData(newMopRowsData);
                    }}
                  />
                </td>
                <td>
                  <InputField
                    value={item?.labourBill || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      let newValue = +e.target.value || 0;
                      const newMopRowsData = [...mopRowsData];
                      newMopRowsData[index]["labourBill"] = newValue;

                      newMopRowsData[index].totalCost =
                        newValue +
                        (+item?.invoiceCost || 0) +
                        (+item?.transPortCost || 0) +
                        (+item?.additionalCost || 0);

                      newMopRowsData[index].totalRecieve = Math.abs(
                        item?.totalRate - newMopRowsData[index].totalCost
                      );

                      updateMopRowsData(newMopRowsData);
                    }}
                  />
                </td>
                <td>
                  <InputField
                    value={item?.transPortCost || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      let newValue = +e.target.value || 0;
                      const newMopRowsData = [...mopRowsData];
                      newMopRowsData[index]["transPortCost"] = newValue;

                      newMopRowsData[index].totalCost =
                        newValue +
                        (+item?.invoiceCost || 0) +
                        (+item?.labourBill || 0) +
                        (+item?.additionalCost || 0);

                      newMopRowsData[index].totalRecieve = Math.abs(
                        item?.totalRate - newMopRowsData[index].totalCost
                      );

                      updateMopRowsData(newMopRowsData);
                    }}
                  />
                </td>
                <td>
                  <InputField
                    value={item?.additionalCost || ""}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      let newValue = +e.target.value || 0;
                      const newMopRowsData = [...mopRowsData];
                      newMopRowsData[index]["additionalCost"] = newValue;

                      newMopRowsData[index].totalCost =
                        newValue +
                        (+newMopRowsData[index].invoiceCost || 0) +
                        (+newMopRowsData[index].labourBill || 0) +
                        (+newMopRowsData[index].transPortCost || 0);

                      newMopRowsData[index].totalRecieve = Math.abs(
                        item?.totalRate - newMopRowsData[index].totalCost
                      );

                      updateMopRowsData(newMopRowsData);
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
                      let newValue = +e.target.value || 0;
                      const newMopRowsData = [...mopRowsData];
                      newMopRowsData[index]["quantity"] = newValue;

                      newMopRowsData[index].billAmount =
                        newValue * +newMopRowsData[index].totalRate;

                      newMopRowsData[index].costAmount =
                        newValue * +newMopRowsData[index].totalCost;

                      newMopRowsData[index].billAmount =
                        +newMopRowsData[index].totalRate -
                        +newMopRowsData[index].totalCost;

                      updateMopRowsData(newMopRowsData);
                    }}
                  />
                </td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BADCMOPRowsData;
