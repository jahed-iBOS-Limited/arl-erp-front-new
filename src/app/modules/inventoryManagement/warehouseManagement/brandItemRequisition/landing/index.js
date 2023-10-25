/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import BrandItemRequisitionLandingTable from "./table";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function BrandItemRequisitionLanding() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowData, getRowData] = useAxiosGet();

  const getLandingData = (values, pageNo = 0, pageSize = 15) => {};

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title="Brand Item Requisition"
        createHandler={() =>
          history.push(
            `/inventory-management/warehouse-management/branditemrequisition/entry`
          )
        }
      >
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <form>
                <div className="row global-form">
                  <FromDateToDateForm obj={{ values, setFieldValue }} />
                </div>

                <BrandItemRequisitionLandingTable obj={{ rowData }} />

                {gridData?.objdata?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default BrandItemRequisitionLanding;
