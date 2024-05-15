import React from "react";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { getDisbursementcenterPasignation_api } from "../helper";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

const GridData = ({
  rowDto,
  loading,
  paginationState,
  values,
  setGirdData,
  setLoading,
}) => {
  let receivepaymentAuthData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit } = receivepaymentAuthData;
  let history = useHistory();
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getDisbursementcenterPasignation_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbu?.value,
      setGirdData,
      setLoading,
      pageNo,
      pageSize
    );
  };
  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>SL</th>
                  <th style={{ width: "30px" }}>Disbursement Center Code</th>
                  <th style={{ width: "30px" }}>Disbursement Center Name</th>
                  <th style={{ width: "30px" }}>SBU</th>
                  <th style={{ width: "30px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.objData?.map((item, index) => (
                  <tr>
                    <td className="text-center"> {index + 1}</td>
                    <td className=""> {item?.disbursementCenterCode}</td>
                    <td className=""> {item?.disbursementCenterName}</td>
                    <td className=""> {item?.sbuname}</td>
                    <td
                      className=""
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {" "}
                      <span
                        onClick={() =>
                          history.push({
                            pathname: `/financial-management/configuration/disbursementCenter/edit/${item?.disbursementCenterId}`,
                          })
                        }
                      >
                        <IEdit />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rowDto?.objData?.length > 0 && (
            <PaginationTable
              count={rowDto?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </div>
      {/* Table End */}
    </>
  );
};

export default withRouter(GridData);
