import React from "react";
import { IInput } from "../../../../_helper/_input";

const PrevTargetAchTable = ({ target, rowDto, rowDtoHandler }) => {
  return (
    <div className="mt-5">
      {target?.objRow?.length && (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th></th>
              {target?.objHeader &&
                Object.values(target?.objHeader)?.map((th, index) => {
                  return <th key={index}>{th}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="align-middle">Previous Target</td>
              {target?.objRow &&
                target?.objRow.map((itm, index) => (
                  <td
                    key={index}
                    className="disabled-feedback disable-border target-input"
                  >
                    <IInput
                      value={itm?.previousYearTarget}
                      // placeholder={itm}
                      name=""
                      type="number"
                      disabled={true}
                      min="0"
                    />
                  </td>
                ))}
            </tr>
            <tr>
              <td className="align-middle">Previous Actual</td>
              {target?.objRow &&
                target.objRow.map((itm, index) => (
                  <td
                    key={index}
                    className="disabled-feedback disable-border str-achievement"
                    // onClick={() => {
                    //   setClickedMonth(Object.keys(target?.objRow)[index]);
                    // }}
                  >
                    <IInput
                      value={
                        !rowDto?.[index]?.dontsShowPrevYearAchivmentPlaceHolder
                          ? itm?.previousYearAchivement
                          : rowDto[index]?.previousYearAchivement
                      }
                      type="number"
                      min="0"
                      name="previousYearAchivement"
                      step="any"
                      onKeyDown={(e) => {
                        rowDtoHandler(
                          "dontsShowPrevYearAchivmentPlaceHolder",
                          true,
                          index,
                          itm.rowId
                        );
                      }}
                      onChange={(e) =>
                        rowDtoHandler(
                          "previousYearAchivement",
                          e.target.value,
                          index,
                          itm.rowId
                        )
                      }
                    />
                  </td>
                ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PrevTargetAchTable;
