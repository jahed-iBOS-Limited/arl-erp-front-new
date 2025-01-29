import moment from "moment";
import React from "react";
import TextArea from "../../../../../_helper/TextArea";
import InputField from "../../../../../_helper/_inputField";

export function ApprovedList(props) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th
              onClick={() => props.allSelect(!props.selectedAll())}
              className="text-center cursor-pointer"
              style={{
                width: "40px",
              }}
            >
              <input
                type="checkbox"
                value={props.selectedAll()}
                checked={props.selectedAll()}
                onChange={() => {}}
              />
            </th>
            <th
              style={{
                width: "30px",
              }}
            >
              SL
            </th>
            <th
              style={{
                width: "100px",
              }}
            >
              Area
            </th>
            <th>Date</th>
            <th>Average Target</th>
            <th
              style={{
                width: "150px",
              }}
            >
              Lifting Qty
            </th>
            <th
              style={{
                width: "500px",
              }}
            >
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {props.rowData?.map((td, index) => (
            <tr key={index}>
              <td
                onClick={() => {
                  props.dataChangeHandler(index, "isSelected", !td.isSelected);
                }}
                className="text-center"
              >
                <input
                  type="checkbox"
                  value={td?.isSelected}
                  checked={td?.isSelected}
                  onChange={() => {}}
                />
              </td>
              <td className="text-center">{index + 1}</td>
              <td>
                <div className="pl-1">{td?.areaName}</div>
              </td>
              <td>
                <div className="pl-2">{moment(td?.date).format("LL")}</div>
              </td>
              <td className="text-right">
                <div className="pl-2">
                  {td?.avgTargetQty ? td?.avgTargetQty : 0}
                </div>
              </td>
              <td>
                <InputField
                  value={td?.liftingQty}
                  name="liftingQty"
                  placeholder="Lifting Qty"
                  type="number"
                  onChange={(e) => {
                    props.dataChangeHandler(
                      index,
                      "liftingQty",
                      e?.target?.value
                    );

                    if (e?.target?.value > 0 && !td?.isSelected) {
                      props.dataChangeHandler(index, "isSelected", true);
                    } else if (td?.isSelected && e?.target?.value <= 0) {
                      props.dataChangeHandler(index, "isSelected", false);
                    }
                  }}
                />
              </td>
              <td>
                <TextArea
                  value={td?.remarks}
                  name="remarks"
                  placeholder="Remarks"
                  type="text"
                  onChange={(e) => {
                    props.dataChangeHandler(index, "remarks", e?.target?.value);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
