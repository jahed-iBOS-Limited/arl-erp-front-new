/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IndustrialTestingCostLandingForm from "./form";
import IndustrialTestingCostLandingTable from "./table";

const initData = {
  testType: { value: 0, label: "All" },
  projectType: { value: 0, label: "All" },
  testPerformPlace: { value: 0, label: "All" },
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const IndustrialTestingCostLanding = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, isLoading] = useAxiosGet();
  const [projectTypes, getProjectTypes] = useAxiosGet();
  const [testTypes, getTestTypes] = useAxiosGet();
  const [performPlaces, getPerformPlaces] = useAxiosGet();

  // get user data from store
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getLandingData = (_pageNo, _pageSize, values) => {
    const url = `/oms/IndustrialTestExpense/GetIndustrialTestExpensePagination?businessUnitId=${buId}&testTypeId=${values
      ?.testType?.value || 0}&projectTypeId=${values?.projectType?.value ||
      0}&testPerformPlaceId=${values?.testPerformPlace?.value ||
      0}&pageNo=${_pageNo}&pageSize=${_pageSize}`;

    getGridData(url);
  };

  useEffect(() => {
    getProjectTypes(`/oms/ShipPoint/GetDDLByTypeNUnit?TypeId=3&UnitId=${buId}`);
    getTestTypes(`/oms/ShipPoint/GetDDLByTypeNUnit?TypeId=2&UnitId=${buId}`);
    getPerformPlaces(
      `/oms/ShipPoint/GetDDLByTypeNUnit?TypeId=1&UnitId=${buId}`
    );
    getLandingData(pageNo, pageSize, initData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const loading = isLoading;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title="Industrial Testing Cost"
              createHandler={() => {
                history.push({
                  pathname: `/financial-management/expense/industrialtestingcost/entry`,
                });
              }}
            >
              {loading && <Loading />}
              <IndustrialTestingCostLandingForm
                obj={{
                  values,
                  pageNo,
                  pageSize,
                  testTypes,
                  projectTypes,
                  performPlaces,
                  setFieldValue,
                  getLandingData,
                }}
              />
              <IndustrialTestingCostLandingTable obj={{ gridData }} />
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default IndustrialTestingCostLanding;
