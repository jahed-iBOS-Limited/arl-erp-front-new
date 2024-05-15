import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import Report from "./report";

const initData = {
  date: "",
  receiveType: "",
  businessUnit: "",
  shipPoint: "",
};

function SecondWeight() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);
  const [weightmentId, setWeightmentId] = useState(null);
  const [shipPoint, getShipPoint, shipPointLoader] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit) {
      initData.businessUnit = selectedBusinessUnit;
    }
    getShipPoint(
      `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${initData?.businessUnit?.value}&AutoId=${profileData?.userId}`,
      (data) => {
        initData.shipPoint = data[0];
        getRowData(
          `/mes/WeightBridge/GetAllWeightBridgeLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${
            profileData?.accountId
          }&BusinessUnitId=${initData.businessUnit?.value}&shipPointId=${
            initData?.shipPoint?.value
          }&WeightDate=${""}&WeightTypeId=2&Status=1`
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    const weightDate = values?.date ? `&WeightDate=${values?.date}` : ``;
    getRowData(
      `/mes/WeightBridge/GetAllWeightBridgeLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&shipPointId=${values?.shipPoint?.value}&WeightTypeId=2${weightDate}&search=${searchValue}&Status=1`
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
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Second Weight"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(lodar || shipPointLoader) && <Loading />}
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
                            setFieldValue("businessUnit", valueOption);
                            setRowData([]);
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
                    <div className="col-lg-2">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary"
                        disabled={!values?.businessUnit?.value}
                        onClick={() => {
                          const weightDate = values?.date
                            ? `&WeightDate=${values?.date}`
                            : ``;
                          getRowData(
                            `/mes/WeightBridge/GetAllWeightBridgeLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&shipPointId=${values?.shipPoint?.value}&WeightTypeId=2${weightDate}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <PaginationSearch
                    placeholder="Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>তারিখ</th>
                            <th>গাড়ীর নাম্বার</th>
                            <th>রেজি. নং</th>
                            <th>চালান নাম্বার</th>
                            <th>পণ্যের নাম</th>
                            <th>সাপ্লায়ারের নাম</th>
                            <th>ওজন নং</th>
                            <th>1st Weight</th>
                            <th>2nd Weight</th>
                            <th>Net Weight</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.weightBridge?.length > 0 &&
                            rowData?.weightBridge?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteLastWeightDateTime)}
                                </td>
                                <td>{item?.strTruckNumber}</td>
                                <td className="text-center">
                                  {item?.strGateEntryCode}
                                </td>
                                <td className="text-center">
                                  {item?.strInvoiceNumber}
                                </td>
                                <td>{item?.strMaterialName}</td>
                                <td>{item?.strSupplierName}</td>
                                <td className="text-center">
                                  {item?.strWeightmentNo}
                                </td>
                                <td className="text-center">
                                  {item?.numFirstWeight}
                                </td>
                                <td className="text-center">
                                  {item?.numLastWeight}
                                </td>
                                <td className="text-center">
                                  {item?.numNetWeight}
                                </td>
                                <td className="text-center">
                                  <div>
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          {"Print"}
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i
                                          style={{
                                            fontSize: "15px",
                                            cursor: "pointer",
                                          }}
                                          className={`fa fa-print`}
                                          onClick={() => {
                                            setWeightmentId(
                                              item?.intWeightmentId
                                            );
                                            setIsShowModal(true);
                                          }}
                                        ></i>
                                      </span>
                                    </OverlayTrigger>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.weightBridge?.length > 0 && (
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      <div>
        <IViewModal
          show={isShowModal}
          onHide={() => {
            setIsShowModal(false);
          }}
          // backdrop="static"
        >
          <Report weightmentId={weightmentId} />
        </IViewModal>
      </div>
    </>
  );
}

export default SecondWeight;
