import React from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import {
  calculateBillAmount,
  calculateCostAmount,
  calculateProfitAmount,
  calculateRangesRate,
  calculateTaxVat,
  calculateTotalCost,
  calculateTotalRate,
  calculateTotalRecieve,
  distributeDistance,
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
                  {
                    <InputField
                      value={item?.distance || ""}
                      type="number"
                      placeholder="0"
                      onChange={(e) => {
                        const newValue = +e.target.value || 0;
                        const distributedDistance = distributeDistance(
                          newValue
                        );
                        const rangesRate = calculateRangesRate(
                          distributedDistance,
                          values
                        );

                        const totalRate = calculateTotalRate(rangesRate);
                        const totalTaxVat = calculateTaxVat(totalRate);
                        const totalCost = calculateTotalCost(
                          item?.additionalCost,
                          item?.labourBill,
                          item?.invoiceCost,
                          item?.transPortCost
                        );
                        const totalRecieve = calculateTotalRecieve(
                          totalRate - totalCost
                        );
                        const billAmount = calculateBillAmount(
                          item?.quantity,
                          totalRate
                        );
                        const costAmount = calculateCostAmount(
                          item?.quantity,
                          totalCost
                        );
                        const profitAmount = calculateProfitAmount(
                          billAmount,
                          costAmount
                        );

                        const newMopRowsData = [...mopRowsData];

                        newMopRowsData[index] = {
                          ...newMopRowsData[index],
                          distance: newValue,
                          rangOto100: rangesRate.rangOto100Rate,
                          rang101to200: rangesRate.rang101to200Rate,
                          rang201to300: rangesRate.rang201to300Rate,
                          rang301to400: rangesRate.rang301to400Rate,
                          rang401to500: rangesRate.rang401to500Rate,
                          totalRate,
                          totalTaxVat,
                          totalRecieve,
                          billAmount,
                          costAmount,
                          profitAmount,
                        };

                        updateMopRowsData(newMopRowsData);
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
