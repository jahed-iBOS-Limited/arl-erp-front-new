import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
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
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import QcViewModal from "./qcViewModal";

const initData = {
  date: "",
  receiveType: "",
  status: { value: 1, label: "Pending" },
  businessUnit: "",
  shipPoint: "",
};

function FirstWeight() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);
  const [weightmentId, setWeightmentId] = useState(null);
  const [
    shipPoint,
    getShipPoint,
    shipPointLoader,
    setShipPoint,
  ] = useAxiosGet();

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
          }&WeightDate=${""}&WeightTypeId=1&Status=1`
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/WeightBridge/GetAllWeightBridgeLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${values?.businessUnit?.value}&shipPointId=${
        initData?.shipPoint?.value
      }&WeightDate=${values?.date ||
        ""}&WeightTypeId=1&search=${searchValue}&Status=${
        values?.status?.value
      }`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const extractTimeFromDateTime = (dateTime) => {
    let date = new Date(dateTime);
    let time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return time;
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
              <CardHeader title={"First Weight"}>
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
                            getShipPoint(
                              `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${valueOption?.value}&AutoId=${profileData?.userId}`,
                              (data) => {
                                if (data?.length < 1)
                                  return toast.warn("No Ship Point Found");
                                setFieldValue("shipPoint", data[0]);
                              }
                            );
                            setFieldValue("businessUnit", valueOption);
                            setFieldValue("shipPoint", "");
                            setRowData([]);
                          } else {
                            setFieldValue("shipPoint", "");
                            setFieldValue("businessUnit", "");
                            setShipPoint([]);
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
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="status"
                        options={[
                          { value: 0, label: "All" },
                          { value: 1, label: "Pending" },
                        ]}
                        value={values?.status}
                        label="Status"
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                          setRowData([]);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary"
                        disabled={!values?.status}
                        onClick={() => {
                          getRowData(
                            `/mes/WeightBridge/GetAllWeightBridgeLanding?PageNo=${pageNo}&PageSize=${pageSize}&AccountId=${
                              profileData?.accountId
                            }&BusinessUnitId=${
                              values?.businessUnit?.value
                            }&shipPointId=${
                              values?.shipPoint?.value
                            }&WeightDate=${values?.date ||
                              ""}&WeightTypeId=1&Status=${
                              values?.status?.value
                            }`
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
                            <th>ক্লায়েন্টের ধরণ</th>
                            <th>সাপ্লায়ার/কাস্টমারের নাম</th>
                            <th>ওজন নং</th>
                            <th>1st Weight</th>
                            <th>1st Weight Time</th>
                            <th>Packer Name</th>

                            {selectedBusinessUnit?.value === 171 ||
                            selectedBusinessUnit?.value === 224 ? (
                              <>
                                <th style={{ width: "110px" }}>
                                  Quality Checked
                                </th>
                                <th style={{ width: "60px" }}>Action</th>
                              </>
                            ) : null}
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.weightBridge?.length > 0 &&
                            rowData?.weightBridge?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteFirstWeightDateTime)}
                                </td>
                                <td>{item?.strTruckNumber}</td>
                                <td className="text-center">
                                  {item?.strGateEntryCode}
                                </td>
                                <td>{item?.strInvoiceNumber}</td>
                                <td>{item?.strMaterialName}</td>
                                <td>
                                  {item?.intClientTypeId === 2
                                    ? "কাস্টমার"
                                    : "সাপ্লায়ার"}
                                </td>
                                <td>{item?.strSupplierName}</td>
                                <td className="text-center">
                                  {item?.strWeightmentNo}
                                </td>

                                <td className="text-center">
                                  {item?.numFirstWeight}
                                </td>
                                <td className="text-center">
                                  {extractTimeFromDateTime(
                                    item?.dteFirstWeightDateTime
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.strPackerName}
                                </td>
                                {selectedBusinessUnit?.value === 171 ||
                                selectedBusinessUnit?.value === 224 ? (
                                  <>
                                    {item?.intClientTypeId === 1 ? (
                                      <td
                                        style={{
                                          backgroundColor: item?.isQualityChecked
                                            ? "#2EFF2E"
                                            : "#FF5C5C",
                                        }}
                                        className="text-center"
                                      >
                                        {item?.isQualityChecked
                                          ? "QC Passed"
                                          : "QC Not Passed"}
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                    <td className="text-center">
                                      {item?.intClientTypeId === 1 ? (
                                        <div className="d-flex justify-content-around">
                                          <div>
                                            <OverlayTrigger
                                              overlay={
                                                <Tooltip id="cs-icon">
                                                  {"Grading"}
                                                </Tooltip>
                                              }
                                            >
                                              <span>
                                                <i
                                                  className={`fas fa-plus-square`}
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                    if (item?.isQualityChecked)
                                                      return toast.warn(
                                                        "QC already passed"
                                                      );
                                                    history.push({
                                                      pathname: `/production-management/msil-gate-register/First-Weight/grading/${item?.intWeightmentId}`,
                                                      state: { ...item },
                                                    });
                                                  }}
                                                ></i>
                                              </span>
                                            </OverlayTrigger>
                                          </div>
                                          <div>
                                            <span
                                              onClick={() => {
                                                if (!item?.isQualityChecked)
                                                  return toast.warn(
                                                    "Please enter QC grade first"
                                                  );
                                                setWeightmentId(
                                                  item?.intWeightmentId
                                                );
                                                setIsShowModal(true);
                                              }}
                                            >
                                              <IView
                                                styles={{ fontSize: "17px" }}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                      ) : null}
                                    </td>
                                  </>
                                ) : null}
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
        <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
          <QcViewModal weightmentId={weightmentId} />
        </IViewModal>
      </div>
    </>
  );
}

export default FirstWeight;
