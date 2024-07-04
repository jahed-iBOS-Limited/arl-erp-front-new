import React from "react";
import InputField from "../../../../_helper/_inputField";

const SalesCommissionConfigureFormTable = ({ obj }) => {
  const { rowData, setRowData, values } = obj;

  const rowDataHandler = (index, name, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  return (
    <div>
      {[15, 19, 22].includes(values?.commissionType?.value) && (
        <TableOne obj={{ selectedAll, allSelect, rowData, rowDataHandler }} />
      )}
      {[14, 16, 20, 23].includes(values?.commissionType?.value) && (
        <TableTwo obj={{ selectedAll, allSelect, rowData, rowDataHandler }} />
      )}
      {[17, 18, 25].includes(values?.commissionType?.value) && (
        <TableThree obj={{ selectedAll, allSelect, rowData, rowDataHandler }} />
      )}
    </div>
  );
};

export default SalesCommissionConfigureFormTable;

const TableOne = ({ obj }) => {
  const { selectedAll, allSelect, rowData, rowDataHandler } = obj;
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                style={{ minWidth: "30px" }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th style={{ width: "40px" }}>SL</th>
              <th>Area Name</th>
              <th>BP Rate/bag</th>
              <th>BA Rate/bag</th>
              <th>CP Rate/bag</th>
              {/* <th>Sales Qty</th>
            <th>Rate/bag</th>
            <th>Commission</th> */}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => {
                      rowDataHandler(index, "isSelected", !item.isSelected);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td> {index + 1}</td>
                  <td>{item?.areaName}</td>
                  <td>
                    <InputField
                      value={item?.bpcommissionRate}
                      name="bpcommissionRate"
                      placeholder="BP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "bpcommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.bacommissionRate}
                      name="bacommissionRate"
                      placeholder="BA"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "bacommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.cpcommissionRate}
                      name="cpcommissionRate"
                      placeholder="CP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "cpcommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const TableTwo = ({ obj }) => {
  const { selectedAll, allSelect, rowData, rowDataHandler } = obj;
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                style={{ minWidth: "30px" }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th style={{ width: "40px" }}>SL</th>
              <th>Date</th>
              <th>Area Name</th>
              <th>BP Rate/bag</th>
              <th>BA Rate/bag</th>
              <th>CP Rate/bag</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => {
                      rowDataHandler(index, "isSelected", !item.isSelected);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td> {index + 1}</td>
                  <td>
                    <InputField
                      value={item?.commissionDate}
                      name="commissionDate"
                      placeholder="Commission Date"
                      type="date"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "commissionDate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>{" "}
                  <td>{item?.areaName}</td>
                  <td>
                    <InputField
                      value={item?.bpcommissionRate}
                      name="bpcommissionRate"
                      placeholder="BP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "bpcommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.bacommissionRate}
                      name="bacommissionRate"
                      placeholder="BA"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "bacommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.cpcommissionRate}
                      name="cpcommissionRate"
                      placeholder="CP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "cpcommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const TableThree = ({ obj }) => {
  const { selectedAll, allSelect, rowData, rowDataHandler } = obj;
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                style={{ minWidth: "30px" }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th style={{ width: "40px" }}>SL</th>
              <th>Area Name</th>
              <th>BP Rate/bag</th>
              <th>BA Rate/bag</th>
              <th>CP Rate/bag</th>
              <th>1-99%</th>
              <th>100-999%</th>
              <th> {">"}999% </th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => {
                      rowDataHandler(index, "isSelected", !item.isSelected);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td> {index + 1}</td>
                  <td>{item?.areaName}</td>
                  <td>
                    <InputField
                      value={item?.bpcommissionRate}
                      name="bpcommissionRate"
                      placeholder="BP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "bpcommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.bacommissionRate}
                      name="bacommissionRate"
                      placeholder="BA"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "bacommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.cpcommissionRate}
                      name="cpcommissionRate"
                      placeholder="CP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "cpcommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.firstSlabCommissionRate}
                      name="firstSlabCommissionRate"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "firstSlabCommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.secondSlabCommissionRate}
                      name="secondSlabCommissionRate"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "secondSlabCommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.thirdSlabCommissionRate}
                      name="thirdSlabCommissionRate"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "thirdSlabCommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
