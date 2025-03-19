import React from "react";
import InputField from "../../../../_helper/_inputField";

const Table = ({ rowDto, setRowDto, rowDtoHandler }) => {
  const allSelect = (value) => {
    let _data = [...rowDto];
    const modify = _data.map((item) => {
      return { ...item, isSelected: value };
    });
    setRowDto(modify);
  };

  const selectedAll = () => {
    return rowDto?.filter((item) => item.isSelected)?.length ===
      rowDto?.length && rowDto?.length > 0
      ? true
      : false;
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 global-table sales_order_landing_table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                className="text-center cursor-pointer"
                style={{ width: "40px" }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th>SL</th>
              <th>Customer Code</th>
              <th>Customer Name</th>
              <th>Region</th>
              <th>Area</th>
              <th>Territory</th>
              <th style={{ width: "150px" }}>Target Amount</th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.map((itm, index) => (
              <tr key={index}>
                <td className="text-center">
                  <input
                    className="mt-2"
                    name="isSelected"
                    type="checkbox"
                    value={itm?.isSelected}
                    checked={itm?.isSelected}
                    onChange={(e) => {
                      rowDtoHandler(e, index);
                    }}
                  />
                </td>
                <td className="text-center">{index + 1}</td>
                <td>{itm?.businessPartnerCode}</td>
                <td>{itm?.businessPartnerName}</td>
                <td>{itm?.nl5}</td>
                <td>{itm?.nl6}</td>
                <td>{itm?.nl7}</td>
                <td className="text-center">
                  <InputField
                    value={itm.targetAmount}
                    name="targetAmount"
                    placeholder="Target Amount"
                    type="number"
                    onChange={(e) => rowDtoHandler(e, index)}
                    min="0"
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
