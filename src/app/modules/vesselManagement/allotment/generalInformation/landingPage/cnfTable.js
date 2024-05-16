import React from "react";
import InputField from "../../../../_helper/_inputField";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function CNFTable({ obj }) {
  const { rowData, selectedAll, allSelect, rowDataHandler } = obj;

  return (
    <>
      {rowData?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th
                  onClick={() => allSelect(!selectedAll())}
                  style={{ width: "30px" }}
                  rowSpan={2}
                >
                  <input
                    type="checkbox"
                    value={selectedAll()}
                    checked={selectedAll()}
                    onChange={() => {}}
                  />
                </th>

                <th rowSpan={2} style={{ width: "40px" }}>
                  SL
                </th>
                <th rowSpan={2} style={{ width: "200px" }}>
                  Mother Vessel
                </th>
                <th rowSpan={2}>Quantity</th>
                <th rowSpan={2} style={{ width: "120px" }}>
                  VAT on CNF
                </th>
                <th rowSpan={2} style={{ width: "120px" }}>
                  Income Tax on CNF
                </th>
                <th colSpan={2}>River Due </th>
                <th colSpan={2}>LC</th>
                <th rowSpan={2}>
                  Total <br /> (River Due + LC){" "}
                </th>
                <th colSpan={2}>VAT</th>
                <th colSpan={2}>Commission</th>
                <th style={{ width: "120px" }} rowSpan={2}>
                  Others
                </th>
                <th rowSpan={2}>Total</th>
              </tr>
              <tr>
                <th style={{ width: "100px" }}>Rate</th>
                <th>Amount</th>
                <th style={{ width: "100px" }}>Rate</th>
                <th>Amount</th>
                <th style={{ width: "100px" }}>Rate</th>
                <th>Amount</th>
                <th style={{ width: "100px" }}>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.map((item, index) => {
                const riverDueAmount = +item?.programQnt * +item?.riverDueRate;
                const lcAmount = +item?.programQnt * +item?.lcRate;
                const total = riverDueAmount + lcAmount;
                const vatAmount = (total / 100) * +item?.vatRate;
                const commissionAmount = +item?.programQnt * +item?.commission;
                const totalAmount = total + vatAmount + +item?.others;

                return (
                  <tr key={index}>
                    <td
                      onClick={() => {
                        rowDataHandler("isSelected", index, !item.isSelected);
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
                      {_fixedPoint(item?.programQnt, true, 0)}
                    </td>
                    <td>
                      <InputField
                        name="vatOnCnf"
                        value={item?.vatOnCnf}
                        placeholder={"VAT on CNF"}
                        onChange={(e) => {
                          rowDataHandler("vatOnCnf", index, e.target.value);
                        }}
                      />
                    </td>
                    <td>
                      <InputField
                        name="incomeTaxOnCnf"
                        value={item?.incomeTaxOnCnf}
                        placeholder={"Income Tax on CNF"}
                        onChange={(e) => {
                          rowDataHandler(
                            "incomeTaxOnCnf",
                            index,
                            e.target.value
                          );
                        }}
                      />
                    </td>
                    <td className="text-right">
                      <InputField
                        name="riverDueRate"
                        value={item?.riverDueRate}
                        placeholder={"Rivers Due Rate"}
                        onChange={(e) => {
                          rowDataHandler("riverDueRate", index, e.target.value);
                        }}
                      />
                    </td>
                    <td className="text-right">
                      {_fixedPoint(riverDueAmount, true, 0)}
                    </td>
                    <td className="text-right">
                      <InputField
                        name="lcRate"
                        value={item?.lcRate}
                        placeholder={"LC Rate"}
                        onChange={(e) => {
                          rowDataHandler("lcRate", index, e.target.value);
                        }}
                      />
                    </td>
                    <td className="text-right">
                      {_fixedPoint(lcAmount, true, 0)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(total, true, 0)}
                    </td>
                    <td className="text-right">
                      <InputField
                        name="vatRate"
                        value={item?.vatRate}
                        placeholder={"VAT Rate"}
                        onChange={(e) => {
                          rowDataHandler("vatRate", index, e.target.value);
                        }}
                      />
                    </td>
                    <td className="text-right">
                      {_fixedPoint(vatAmount, true, 0)}
                    </td>
                    <td className="text-right">
                      <InputField
                        name="commission"
                        value={item?.commission}
                        placeholder={"Commission Rate"}
                        onChange={(e) => {
                          rowDataHandler("commission", index, e.target.value);
                        }}
                      />
                    </td>
                    <td className="text-right">
                      {_fixedPoint(commissionAmount, true, 0)}
                    </td>
                    <td>
                      <InputField
                        name="others"
                        value={item?.others}
                        placeholder={"Others"}
                        onChange={(e) => {
                          rowDataHandler("others", index, e.target.value);
                        }}
                      />
                    </td>
                    <td className="text-right">
                      {_fixedPoint(totalAmount, true, 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
