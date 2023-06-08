import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { getLandingPageData } from "../helper";
import ICustomTable from "../../../../_helper/_customTable";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

const headers = ["SL", "Department Code", "Department Name", "Is Corporate"];

const TBody = ({ landingPageData, loader }) => {
  console.log(landingPageData, "landingPageDataaa");

  return (
    <>
      {loader && <Loading />}
      {landingPageData?.data?.length > 0 &&
        landingPageData?.data?.map((data, index) => (
          <tr key={index}>
            {/* {console.log(data)} */}
            <td>{data.sl}</td>
            {/* <td>{data.businessUnit}</td> */}
            <td>{data.functionalDepartmentCode}</td>
            <td>{data.functionalDepartmentName}</td>
            <td>{data.isCorporate ? "Yes" : "No"}</td>
          </tr>
        ))}
    </>
  );
};

const EmpDepartmentLanding = () => {
  const history = useHistory();
  const [landingPageData, setLandingPageData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  console.log(landingPageData, "landingPageData");

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingPageData(
        profileData.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        setLandingPageData,
        setLoader
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getLandingPageData(
      profileData.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setLandingPageData,
      setLoader,
      searchValue
    );
  };
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <ICustomCard
      title="Department"
      createHandler={() =>
        history.push("/human-capital-management/hcmconfig/empdepartment/create")
      }
    >
      <PaginationSearch
        placeholder="Department Name & Code Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <ICustomTable
        ths={headers}
        children={<TBody loader={loader} landingPageData={landingPageData} />}
      ></ICustomTable>

      <div>
        {landingPageData?.data?.length > 0 && (
          <PaginationTable
            count={landingPageData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </ICustomCard>
  );
};

export default EmpDepartmentLanding;
