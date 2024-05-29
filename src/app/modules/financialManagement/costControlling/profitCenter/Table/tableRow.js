import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { GetProfitCenterPagination } from "../helper";

export function TableRow() {
  const [gridData, setGridData] = useState([]);

  const history = useHistory();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      GetProfitCenterPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Code</th>
                  <th>Profit Center Name</th>
                  <th>Controlling Unit</th>
                  <th>Group Name</th>
                  <th>Responsible Person</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((item, index) => (
                  <tr>
                    {/* key={item.profitCenterId} */}
                    <td> {item.sl}</td>
                    <td>
                      <div className="pl-2">{item.profitCenterCode}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item.profitCenterName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.controllingUnitName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.profitCenterGroupName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.responsiblePersonName}</div>
                    </td>

                    <td>
                      <div className="d-flex justify-content-around">
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/financial-management/cost-controlling/profitcenter/edit/${item.profitCenterId}`
                            );
                          }}
                        >
                          <IEdit />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
