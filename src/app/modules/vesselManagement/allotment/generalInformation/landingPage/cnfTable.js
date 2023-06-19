import React from "react";
import InputField from "../../../../_helper/_inputField";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function CNFTable({ obj }) {
  const { rowData, selectedAll, allSelect, rowDataHandler } = obj;

  return (
    <>
      {rowData?.length > 0 && (
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
              <th style={{ width: "200px" }}>VAT on CNF</th>
              <th style={{ width: "200px" }}>Income Tax on CNF</th>
              <th>River Due (rate-33)</th>
              <th>LC (rate-32)</th>
              <th>VAT (15%)</th>
              <th>Commission (rate-4)</th>
              <th style={{ width: "200px" }}>Others</th>
              {/* <th>Total</th> */}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              const riverDueRate = item?.programQnt * 33;
              const lcRate = item?.programQnt * 32;
              const vatRate = (riverDueRate + lcRate) * 0.15;
              const commission = item?.programQnt * 4;
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
                        rowDataHandler("incomeTaxOnCnf", index, e.target.value);
                      }}
                    />
                  </td>
                  <td className="text-right">
                    {_fixedPoint(riverDueRate, true, 0)}
                  </td>
                  <td className="text-right">{_fixedPoint(lcRate, true, 0)}</td>
                  <td className="text-right">
                    {_fixedPoint(vatRate, true, 0)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(commission, true, 0)}
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
                  {/* <td>{item?.total}</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
