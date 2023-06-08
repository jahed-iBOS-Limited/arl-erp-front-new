import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../../_helper/_helperIcons/_edit";
// import IView from "../../../../../_helper/_helperIcons/_view";
import Loading from "../../../../../_helper/_loading";
import PaginationTable from "../../../../../_helper/_tablePagination";
import { getOutletAttributeLanding } from "../helper";

export function TableRow() {
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getOutletAttributeLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLoading,
        pageNo,
        pageSize,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getOutletAttributeLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      pageNo,
      pageSize,
      setGridData
    );
  };

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12 pr-0 pl-0">
          {gridData?.data?.length > 0 && (
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Section Name</th>
                  <th>Attribute Name</th>
                  <th>Control Name</th>
                  <th>Is Mandatory</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td> {item?.sl}</td>
                    <td>
                      <div className="pl-2">{item?.strSectionName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.strAttributeName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.strControlType}</div>
                    </td>
                    <td>
                      <div className="text-center">
                        {item?.isMandatory === true ? "Yes" : "No"}
                        {/* <input
                          type="checkbox"
                          value={item?.isMandatory}
                          checked={item?.isMandatory}
                          name="isMandatory"
                          onChange={() => {
                            return false;
                          }}
                        /> */}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/human-capital-management/hcmconfig/profile-setup/edit/${item?.intAttributeId}`
                            );
                          }}
                        >
                          <IEdit />
                        </span>
                        {/* <span
                          className="view"
                          onClick={() => {
                            history.push(
                              `/human-capital-management/humanresource/other-information/view/${item?.intOutletAttributeId}`
                            );
                          }}
                        >
                          <IView />
                        </span> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </div>
    </>
  );
}
