/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import { getEmployeeGroupNameLanding } from "../helper";
import IExtend from "../../../../_helper/_helperIcons/_extend";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getEmployeeGroupNameLanding(profileData?.accountId, setGridData);
    }
  }, [profileData]);

  return (
    <>
  
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th style={{ width: "50px" }}>Group Name</th>
                <th style={{ width: "50px" }}>Created By</th>
                <th style={{ width: "30px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.length > 0 &&
                gridData?.map((item, index) => (
                  <tr key={item?.employeeGroupId}>
                    <td>{item?.sl}</td>
                    <td>
                      <div className="pl-2">{item?.employeeGroupName}</div>
                    </td>
                    <td>
                      <div className="text-center">
                        {item?.employeeFullName}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              history.push({
                                pathname: `/human-capital-management/hcmconfig/emp-group/view/${item?.employeeGroupId}`,
                                state: item,
                              });
                            }}
                          />
                        </span>
                        <span
                          onClick={() => {
                            history.push({
                              pathname: `/human-capital-management/hcmconfig/emp-group/extendEmpGroup`,
                              state: item,
                            });
                          }}
                        >
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Extend Employee Group"}
                              </Tooltip>
                            }
                          >
                            <span>
                              <IExtend />
                            </span>
                          </OverlayTrigger>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
