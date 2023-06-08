/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getKpiTargetGridData } from "../../../_redux/Actions";
import ICustomTable from "../../../../_helper/_customTable";
import { useHistory } from "react-router";

export function TableRow() {
  const dispatch = useDispatch();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { gridData } = useSelector((state) => {
    return state.performanceMgt;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getKpiTargetGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          3
        )
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const history = useHistory();

  return (
    <>
      <div className="kpi-landing sbu-kpi-landing">
        <ICustomTable
          ths={["SL", "SBU", "Section", "NUMBER OF KPI", "UNIT", "YEAR", "ACTIONS"]}
        >
          {gridData?.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item?.sbuName}</td>
              <td>{item?.sectionName}</td>
              <td>{item?.countofKpi}</td>
              <td>{item?.unitName}</td>
              <td>{item?.yearName}</td>
              <td>
                <div className="d-flex justify-content-around">
                  <i
                    onClick={() => {
                      history.push(
                        `/performance-management/sbu-kpi/target/view/${item?.pmsId}/${item?.sectionId}`
                      );
                    }}
                    className="view_fa fa fa-eye view_fa"
                  ></i>
                  <i
                    onClick={() => {
                      history.push(
                        `/performance-management/sbu-kpi/target/perform-chart/${item?.sbuId}/${item?.yearId}/${item?.yearName}`
                      );
                    }}
                    className="fas fa-chart-bar"
                  ></i>
                </div>
              </td>
            </tr>
          ))}
        </ICustomTable>
      </div>
    </>
  );
}
