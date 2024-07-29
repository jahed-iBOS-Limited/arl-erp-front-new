/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import HomeBuildersInfoLandingForm from "./form";
import HomeBuildersInfoLandingTable from "./table";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  type: "",
  month: "",
  year: "",
};

const HomeBuildersInfoLanding = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading] = useAxiosGet();
  const [employeeInfo, getEmployeeInfo] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getEmployeeInfo(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}`
    );
  }, [accId, buId]);

  const getData = (values, _pageNo, _pageSize) => {
    getGridData(
      `/oms/SitePeopleInfos/SitePeopleDetailsInfoReport?LevelId=${
        employeeInfo?.empLevelId
      }&RegionId=${values?.region?.value || 0}&AreaId=${values?.region?.value ||
        0}&TerritoryId=${values?.region?.value ||
        0}&BusinessId=${buId}&TypeId=3&employeeId=${employeeId}&PageNo=${_pageNo}&PageSize=${_pageSize}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard
              title="Home Builders Information"
              isCreteBtn={true}
              createHandler={() => {
                history.push(
                  "/config/partner-management/HomeBuildersInfo/entry"
                );
              }}
            >
              {loading && <Loading />}
              <HomeBuildersInfoLandingForm
                obj={{ values, setFieldValue, getData, pageNo, pageSize }}
              />
              <HomeBuildersInfoLandingTable
                obj={{
                  pageNo,
                  values,
                  gridData,
                  getData,
                  pageSize,
                  setPageNo,
                  setPageSize,
                }}
              />
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default HomeBuildersInfoLanding;
