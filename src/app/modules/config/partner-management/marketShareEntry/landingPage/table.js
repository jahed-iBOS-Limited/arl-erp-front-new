/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { monthDDL } from "../../../../inventoryManagement/warehouseManagement/liftingEntry/form/addEditForm";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";

const headers = ["SL", "Territory", "Year", "Month", "Action"];

const GridView = ({ rowData }) => {
  const history = useHistory();

  return (
    <>
      {rowData?.data?.length > 0 && (
        <div className="table-responsive">
          <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              {headers?.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{item?.territoryName}</td>
                  <td>{item?.yearId}</td>
                  <td>{monthDDL[item?.monthId - 1]?.label}</td>

                  <td style={{ width: "80px" }} className="text-center">
                    {
                      <div className="d-flex justify-content-around">
                        <span>
                          <IEdit
                            onClick={() => {
                              history.push({
                                pathname: `/config/partner-management/marketshareentry/edit/${item?.territoryId}`,
                                state: item,
                              });
                            }}
                          />
                        </span>
                        <span>
                          <ICon
                            title="View"
                            onClick={() => {
                              history.push({
                                pathname: `/config/partner-management/marketshareentry/view/${item?.territoryId}`,
                                state: item,
                              });
                            }}
                          >
                            <i class="fas fa-eye"></i>
                          </ICon>
                        </span>
                      </div>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}
    </>
  );
};

export default GridView;
