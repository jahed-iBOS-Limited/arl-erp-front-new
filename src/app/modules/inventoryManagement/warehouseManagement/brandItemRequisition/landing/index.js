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
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  area: "",
  territory: "",
};

function BrandItemRequisitionLanding() {
  const {
    profileData,
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, loader] = useAxiosGet();

  const getLandingData = (values, pageNo = 0, pageSize = 15) => {
    getRowData(
      `/wms/ItemRequest/GetBrandItemRequest?areaId=${values?.area?.value ||
        0}&businessUnitId=${buId}&fromDate=${values?.fromDate}&todate=${
        values?.toDate
      }&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize);
  }, [profileData, buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="Brand Item Requisition"
        createHandler={() =>
          history.push(
            `/inventory-management/warehouse-management/branditemrequisition/entry`
          )
        }
      >
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue }) => (
            <>
              <form>
                <div className="row global-form">
                  <RATForm obj={{ values, setFieldValue, territory: false }} />
                  <FromDateToDateForm obj={{ values, setFieldValue }} />
                  <IButton
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize);
                    }}
                  />
                </div>

                <BrandItemRequisitionLandingTable obj={{ rowData }} />

                {rowData?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
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
