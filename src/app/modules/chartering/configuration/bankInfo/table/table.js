/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router";
import ICustomTable from "../../../../../helper/_customTable";
import IEdit from "../../../../../helper/icons/_edit";
import { GetBankInfoLandingData } from "../helper";
import Loading from "../../../../../helper/loading/_loading";
import PaginationTable from "../../../../../helper/_tablePagination";

const headers = [
  { name: "SL" },
  { name: "Bank Name" },
  { name: "Country Name" },
  { name: "Address" },
  { name: "Swift Code" },
  { name: "Actions" },
];

export default function BankInfoTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetBankInfoLandingData(pageNo, pageSize, setGridData, setLoading);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize) => {
    GetBankInfoLandingData(pageNo, pageSize, setGridData, setLoading);
  };

  return (
    <>
      {loading && <Loading />}
      <form className="form-card">
        <div className="form-card-heading">
          <p>Bank Information</p>
          <div>
            <button
              type="button"
              className={"btn btn-primary"}
              onClick={() =>
                history.push("/chartering/configuration/bankInformation/create")
              }
            >
              Create
            </button>
          </div>
        </div>

        <ICustomTable ths={headers}>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{item?.bankName}</td>
              <td>{item?.countryName}</td>
              <td>{item?.bankAddress}</td>
              <td>{item?.swiftCode}</td>

              <td className="text-center">
                <div className="d-flex justify-content-around">
                  <IEdit
                    clickHandler={() => {
                      history.push({
                        pathname: `/chartering/configuration/bankInformation/edit/${item?.bankId}`,
                        state: item,
                      });
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </ICustomTable>
      </form>
      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
