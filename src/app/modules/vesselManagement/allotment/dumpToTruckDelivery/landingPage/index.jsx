/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import DumpToTruckDeliveryLandingForm from "./form";
import DumpToTruckDeliveryLandingTable from "./table";

const initData = {
  shipPoint: "",
  port: "",
  motherVessel: "",
  lighterVessel: "",
  status: { value: 0, label: "All" },
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const DumpToTruckDeliveryLanding = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();
  const [lighterDDL, getLighterDDL] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    const url = `/tms/LigterLoadUnload/GetLighterDumpToTruckDeliveryPagination?BusinessUnitId=${buId}&lighterVesselId=${values?.lighterVessel?.value}&shipPointId=${values?.shipPoint?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}&isDumpToTruckApprove=${values?.status?.value}`;

    getRowData(url);
  };

  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );

    // getData(initData, pageNo, pageSize);
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize, "");
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
            <ICustomCard title={"Dump to Truck Delivery"}>
              {isLoading && <Loading />}
              <DumpToTruckDeliveryLandingForm
                obj={{
                  values,
                  pageNo,
                  getData,
                  pageSize,
                  isLoading,
                  lighterDDL,
                  shipPointDDL,
                  getLighterDDL,
                  setFieldValue,
                }}
              />

              <DumpToTruckDeliveryLandingTable
                obj={{
                  values,
                  pageNo,
                  rowData,
                  pageSize,
                  setPageNo,
                  setPageSize,
                  setPositionHandler,
                }}
              />
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default DumpToTruckDeliveryLanding;
