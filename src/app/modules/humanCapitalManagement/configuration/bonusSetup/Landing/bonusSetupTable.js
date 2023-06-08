/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { fetchLandingData } from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";

const headers = [
  "SL",
  "Bonus Name",
  "Bonus Description",
  "Religion",
  "Employee Type",
  "Service Length",
  "Bonus Percentage On",
  "Bonus Percentage",
  "Action",
];

const TBody = ({ loader, rowData }) => {
  const history = useHistory();

  return (
    <>
      {loader && <Loading />}
      {rowData?.data?.length > 0 &&
        rowData?.data?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td>
                <div className="pl-2">{item?.bonusName}</div>
              </td>
              <td>
                <div className="pl-2">{item?.bonusDescription}</div>
              </td>
              <td>
                <div className="pl-2">{item?.religion}</div>
              </td>
              <td>
                <div className="pl-2">{item?.employmentType}</div>
              </td>
              <td>
                <div className="text-right pr-2">
                  {item?.minimumServiceLengthMonth}
                </div>
              </td>
              <td>
                <div className="pl-2">{item?.bonusPercentageOn}</div>
              </td>
              <td>
                <div className="text-right pr-2">{item?.bonusPercentage}</div>
              </td>
              <td colSpan="" style={{ textAlign: "center" }}>
                <span
                  onClick={(e) =>
                    history.push(
                      `/human-capital-management/hcmconfig/bonussetup/edit/${item.bonusSetupId}`
                    )
                  }
                  className="mx-2"
                >
                  <IEdit title="Edit" />
                </span>
              </td>
            </tr>
          );
        })}
    </>
  );
};

export function BonusSetupTable() {
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Landing Pasignation Data
  useEffect(() => {
    if (selectedBusinessUnit?.value) {
      fetchLandingData(
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        setRowData,
        setLoader
      );
    }
  }, [selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    fetchLandingData(
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setRowData,
      setLoader,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <PaginationSearch
        placeholder="Bonus Name Search"
        paginationSearchHandler={paginationSearchHandler}
      />

      <ICustomTable
        ths={headers}
        children={<TBody loader={loader} rowData={rowData} />}
      />

      <div>
        {rowData?.data?.length > 0 && (
          <PaginationTable
            count={rowData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
