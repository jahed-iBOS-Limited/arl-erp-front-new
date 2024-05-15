/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { GetDocumentTypePagination } from "../helper";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  console.log(gridData, "gridData");

  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetDocumentTypePagination(
        profileData?.accountId,
        setGridData,
        setLoader,
        pageNo,
        pageSize
      );
    }
  }, []);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    GetDocumentTypePagination(
      profileData?.accountId,
      setGridData,
      setLoader,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };
  return (
    <>
      {loader && <Loading />}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <PaginationSearch
            placeholder="Item Name & Code Search"
            paginationSearchHandler={paginationSearchHandler}
          />
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th style={{ width: "50px" }}>Document Type</th>
                <th style={{ width: "30px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.length > 0 &&
                gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    {/* key={item.businessUnitId} */}
                    <td>{item.sl}</td>
                    <td>
                      <div className="pl-2">{item.strDocType}</div>
                    </td>

                    <td>
                      <div className="d-flex justify-content-around">
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/human-capital-management/hcmconfig/documenttype/edit/${item?.intDocTypeId}`
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
      </div>
    </>
  );
}
