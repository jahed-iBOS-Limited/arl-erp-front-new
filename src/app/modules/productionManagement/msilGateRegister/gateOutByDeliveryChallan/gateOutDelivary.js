import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import PaginationSearch from "./../../../_helper/_search";

const initData = {
  businessUnit: "",
  shipPoint: "",
};

function GateOutDelivary({ item, date }) {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [
    shipPoint,
    getShipPoint,
    shipPointLoader,
    setShipPoint,
  ] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit) {
      setLoading(true);
      initData.businessUnit = selectedBusinessUnit;
      getShipPoint(
        `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${initData?.businessUnit?.value}&AutoId=${profileData?.userId}`,
        (data) => {
          initData.shipPoint = data[0];
          setLoading(false);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/VehicleGateOutLanding?intBusinessUnitId=${selectedBusinessUnit?.value}&shipPointId=${values?.shipPoint?.value}&status=true&search=${searchValue}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {(lodar || shipPointLoader || loading) && <Loading />}
            <div className="form-group  global-form">
              <div className="row">
                <div className="col-lg-2">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shipPoint", "");
                        setRowData([]);
                        setFieldValue("businessUnit", valueOption);
                        getShipPoint(
                          `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${valueOption?.value}&AutoId=${profileData?.userId}`,
                          (data) => {
                            if (data === [])
                              return toast.warn("No Ship Point Found");
                            setFieldValue("shipPoint", data[0]);
                          }
                        );
                      } else {
                        setFieldValue("businessUnit", "");
                        setFieldValue("shipPoint", "");
                        setRowData([]);
                        setShipPoint([]);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="shipPoint"
                    options={shipPoint}
                    value={values?.shipPoint}
                    label="Ship Point"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shipPoint", valueOption);
                        setRowData([]);
                      } else {
                        setFieldValue("shipPoint", "");
                        setRowData([]);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary ml-2"
                    disabled={!values?.businessUnit || !values?.shipPoint}
                    onClick={() => {
                      getRowData(
                        `/mes/MSIL/VehicleGateOutLanding?intBusinessUnitId=${selectedBusinessUnit?.value}&shipPointId=${values?.shipPoint?.value}&status=true&pageNo=${pageNo}&pageSize=${pageSize}`
                      );
                    }}
                  >
                    Show
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="ml-5 mt-3">
                <PaginationSearch
                  placeholder="Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Reg. No</th>
                        <th>Net Weight</th>
                        <th>Vehicle No</th>
                        <th>Driver Name</th>
                        <th>Driver Mobile Number</th>
                        <th>Date</th>
                        <th>Entry Time</th>
                        <th>Server Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.gateOut?.length > 0 &&
                        rowData?.gateOut?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.strEntryCode}
                            </td>
                            <td className="text-center">
                              {item?.numNetWeight}
                            </td>
                            <td>{item?.strVehicleNo}</td>
                            <td>{item?.strDriverName}</td>
                            <td className="text-center">
                              {item?.strDriverMobileNo}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteGateOutDate)}
                            </td>
                            <td className="text-center">
                              {_timeFormatter(item?.tmOutTime || "")}
                            </td>
                            <td className="text-center">
                              {_timeFormatter(item?.tmServerTime || "")}
                            </td>
                            <td
                              style={{ color: "green", fontWeight: "bold" }}
                              className="text-center"
                            >
                              {item?.strStatus}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {rowData?.gateOut?.length > 0 && (
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
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}

export default GateOutDelivary;
