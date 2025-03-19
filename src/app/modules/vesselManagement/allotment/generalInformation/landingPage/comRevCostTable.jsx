import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";

export default function CommissionRevenueCostTable({
  rowData,
  values,
  selectedAll,
  allSelect,
  rowDataHandler,
}) {
  let totalQty = 0;
  let totalBillAmount = 0;

  return (
    <>
      {rowData?.length > 0 && [2, 3, 4].includes(values?.status?.value) && (
        <div className="row cash_journal">
          <div className="col-lg-12">
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th
                      onClick={() => allSelect(!selectedAll())}
                      style={{ width: "30px" }}
                    >
                      <input
                        type="checkbox"
                        value={selectedAll()}
                        checked={selectedAll()}
                        onChange={() => {}}
                      />
                    </th>

                    <th style={{ width: "40px" }}>SL</th>
                    <th>Mother Vessel</th>
                    <th>Quantity</th>
                    {[2, 3].includes(values?.status?.value) && (
                      <>
                        <th>Total Freight (USD)</th>
                        <th>Conversion Rate (BDT)</th>
                      </>
                    )}
                    {[4].includes(values?.status?.value) && (
                      <>
                        <th>CNF Rate</th>
                        <th>Steve Dore Rate</th>
                        <th>Surveyor Rate</th>
                      </>
                    )}
                    {[2].includes(values?.status?.value) && (
                      <th>Commission Rate</th>
                    )}
                    {[3, 4].includes(values?.status?.value) && (
                      <th>Total Amount</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((item, index) => {
                    totalQty += item?.quantity;
                    totalBillAmount += item?.billAmount;
                    return (
                      <tr key={index}>
                        <td
                          onClick={() => {
                            rowDataHandler(
                              "isSelected",
                              index,
                              !item.isSelected
                            );
                          }}
                          className="text-center"
                          style={
                            item?.isSelected
                              ? {
                                  backgroundColor: "#aacae3",
                                  width: "30px",
                                }
                              : { width: "30px" }
                          }
                        >
                          <input
                            type="checkbox"
                            value={item?.isSelected}
                            checked={item?.isSelected}
                            onChange={() => {}}
                          />
                        </td>
                        <td className="text-center"> {index + 1}</td>{" "}
                        <td>{item?.motherVesselName}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.quantity, true, 0)}
                        </td>
                        {[2, 3].includes(values?.status?.value) && (
                          <>
                            <td className="text-right">
                              {_fixedPoint(item?.freightRate, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.freightRateBDT, true)}
                            </td>
                          </>
                        )}
                        {[4].includes(values?.status?.value) && (
                          <>
                            <td className="text-right">
                              {_fixedPoint(item?.cnfrate, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.stevdorRate, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.serveyorRate, true)}
                            </td>
                          </>
                        )}
                        {[2].includes(values?.status?.value) && (
                          <td className="text-right">
                            <InputField
                              name="billAmount"
                              value={item?.commissionRate || ""}
                              onChange={(e) => {
                                if (+e.target.value < 0) return;
                                rowDataHandler(
                                  "commissionRate",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                        )}
                        {[3, 4].includes(values?.status?.value) && (
                          <td className="text-right">
                            {_fixedPoint(item?.billAmount, true)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {rowData?.length > 0 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td className="text-right" colSpan={3}>
                        Total
                      </td>
                      <td className="text-right">
                        {_fixedPoint(totalQty, true, 0)}
                      </td>
                      <td
                        colSpan={[3].includes(values?.status?.value) ? 2 : 3}
                      ></td>
                      {[3, 4].includes(values?.status?.value) && (
                        <td className="text-right">
                          {_fixedPoint(totalBillAmount, true)}
                        </td>
                      )}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
