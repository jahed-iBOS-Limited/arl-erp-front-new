import React from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import {
  calculateTotalRate,
  distributeDistance,
  mopTenderCreateDataTableHeader,
} from "../helper";
import InputField from "../../../../_helper/_inputField";

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
                    value={item?.distance || ""}
                    name={`mopRowsData[${index}]?.distance`}
                    type="number"
                    onChange={(e) => {
                      let newValue = +e.target.value || 0;

                      console.log(newValue);
                      const newMopRowsData = [...mopRowsData];
                      newMopRowsData[index]["distance"] = newValue;

                      newMopRowsData[index]["rangOto100"] =
                        distributeDistance(newValue).rangOto100 *
                        values?.distance0100;

                      newMopRowsData[index]["rang101to200"] =
                        distributeDistance(newValue)?.rang101to200 *
                        values?.distance101200;

                      newMopRowsData[index]["rang201to300"] =
                        distributeDistance(newValue).rang201to300 *
                        values?.distance201300;

                      newMopRowsData[index]["rang301to400"] =
                        distributeDistance(newValue).rang301to400 *
                        values?.distance301400;

                      newMopRowsData[index]["rang401to500"] =
                        distributeDistance(newValue).rang401to500 *
                        values?.distance401500;

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
              <td>
                {calculateTotalRate(item?.rangOto100, item?.rang101to200,item?.rang201to300,item?.rang301to400,item?.rang401to500)}
              </td>
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
