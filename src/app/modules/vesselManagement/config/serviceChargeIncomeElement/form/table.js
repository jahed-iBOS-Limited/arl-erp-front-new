import React from "react";
import InputField from "../../../../_helper/_inputField";

const Table = ({ obj }) => {
  const {
    costs,
    revenues,
    allSelect,
    selectedAll,
    rowDataHandler,
    allSelect2,
    selectedAll2,
    rowDataHandler2,
  } = obj;

  return (
    <>
      <div className="row">
        <div className="col-lg-6">
          <div className="react-bootstrap-table table-responsive">
            <table
              className={"table table-striped table-bordered global-table "}
            >
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
                  <th style={{ minWidth: "30px" }}>SL</th>
                  <th>Cost Element</th>
                  <th>Rate (BDT)</th>
                </tr>
              </thead>
              <tbody>
                {costs?.map((item, i) => {
                  return (
                    <tr>
                      <td
                        onClick={() => {
                          rowDataHandler("isSelected", i, !item.isSelected);
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
                      <td style={{ minWidth: "30px" }} className="text-center">
                        {i + 1}
                      </td>
                      <td>{item?.element}</td>
                      <td>
                        <InputField
                          type="number"
                          name="rate"
                          value={item?.rate}
                          onChange={(e) => {
                            if (+e.target.value < 0) return;
                            rowDataHandler("rate", i, e?.target?.value);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="react-bootstrap-table table-responsive">
            <table
              className={"table table-striped table-bordered global-table "}
            >
              <thead>
                <tr>
                  <th
                    onClick={() => allSelect2(!selectedAll2())}
                    style={{ minWidth: "30px" }}
                  >
                    <input
                      type="checkbox"
                      value={selectedAll2()}
                      checked={selectedAll2()}
                      onChange={() => {}}
                    />
                  </th>
                  <th>SL</th>
                  <th>Revenue Element</th>
                  <th>Rate (BDT)</th>
                </tr>
              </thead>
              <tbody>
                {revenues?.map((item, i) => {
                  return (
                    <tr>
                      <td
                        onClick={() => {
                          rowDataHandler2("isSelected", i, !item.isSelected);
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
                      <td className="text-center">{i + 1}</td>
                      <td>{item?.element}</td>
                      <td>
                        <InputField
                          type="number"
                          name="rate"
                          value={item?.rate}
                          onChange={(e) => {
                            if (+e.target.value < 0) return;
                            rowDataHandler2("rate", i, e?.target?.value);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
