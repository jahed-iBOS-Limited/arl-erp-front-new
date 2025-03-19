/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const Table = ({ obj }) => {
  const {
    costs,
    // revenues,
    allSelect,
    selectedAll,
    rowDataHandler,
    // allSelect2,
    // selectedAll2,
    // rowDataHandler2,
  } = obj;

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [costCenterDDL, getCostCenterDDL] = useAxiosGet();
  const [costElementDDL, getCostElementDDL] = useAxiosGet();
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    ,
    setProfitCenterDDL,
  ] = useAxiosGet();

  useEffect(() => {
    getCostCenterDDL(
      `/procurement/PurchaseOrder/CostCenter?AccountId=${accId}&UnitId=${buId}`
    );
    getProfitCenterDDL(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`,
      (resData) => {
        const modifyData = resData?.map((item) => {
          return {
            ...item,
            value: item?.profitCenterId,
            label: item?.profitCenterName,
          };
        });
        setProfitCenterDDL(modifyData);
      }
    );
  }, [accId, buId]);

  return (
    <>
      <div className="react-bootstrap-table table-responsive">
        <table className={"table table-striped table-bordered global-table "}>
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
              <th>Cost Center</th>
              <th>Cost Element</th>
              <th>Profit Center</th>
            </tr>
          </thead>
          <tbody>
            {costs?.map((item, i) => {
              return (
                <tr>
                  <td
                    style={{ width: "40px" }}
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
                  <td style={{ width: "40px" }} className="text-center">
                    {i + 1}
                  </td>
                  <td style={{ width: "260px" }}>{item?.element}</td>
                  <td style={{ width: "130px" }}>
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
                  <td>
                    <NewSelect
                      name="costCenter"
                      options={costCenterDDL || []}
                      value={item?.costCenter}
                      onChange={(e) => {
                        rowDataHandler("costCenter", i, e);
                        getCostElementDDL(
                          `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accId}&UnitId=${buId}&CostCenterId=${e?.value}`
                        );
                      }}
                    />
                  </td>
                  <td>
                    <NewSelect
                      name="costElement"
                      options={costElementDDL || []}
                      value={item?.costElement}
                      onChange={(e) => {
                        rowDataHandler("costElement", i, e);
                      }}
                    />
                  </td>
                  <td>
                    <NewSelect
                      name="profitCenter"
                      options={profitCenterDDL || []}
                      value={item?.profitCenter}
                      onChange={(e) => {
                        rowDataHandler("profitCenter", i, e);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="col-lg-6">
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
        </div> */}
    </>
  );
};

export default Table;
