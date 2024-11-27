import { Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
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
import { _currentTime } from "../../../_helper/_currentTime";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import BulkDetails from "./bulkDetails";
import { calculateTimeDifference } from "./helper";

const initData = {
  date: _todayDate(),
  businessUnit: "",
  shipPoint: "",
};
function GateItemEntry() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [
    shipPoint,
    getShipPoint,
    shipPointLoader,
    setShipPoint,
  ] = useAxiosGet();
  const [isShowModel, setIsShowModel] = useState(false);
  const [itemList, setItemList] = useState();
  const [landingValues, setLandingValues] = useState();

  const {
    userRole,
    profileData,
    businessUnitList: businessUnitDDL,
    selectedBusinessUnit,
  } = useSelector((store) => store?.authData, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit) {
      initData.businessUnit = selectedBusinessUnit;
    }
  }, [selectedBusinessUnit]);

  const landingData = (values) => {
    let date = values?.date ? `&date=${values?.date}` : "";
    getRowData(
      `/mes/MSIL/GateEntryItemLanding?businessUnitId=${values?.businessUnit?.value}&shipPointId=${values?.shipPoint?.value}&pageNo=${pageNo}&pageSize=${pageSize}${date}`
    );
  };

  useEffect(() => {
    getShipPoint(
      `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${initData?.businessUnit?.value}&AutoId=${profileData?.userId}`,
      (data) => {
        initData.shipPoint = data[0];
        getRowData(
          `/mes/MSIL/GateEntryItemLanding?businessUnitId=${initData?.businessUnit?.value}&shipPointId=${initData?.shipPoint?.value}&pageNo=${pageNo}&pageSize=${pageSize}&date=${initData?.date}`
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    let date = values?.date ? `&date=${values?.date}` : "";
    getRowData(
      `/mes/MSIL/GateEntryItemLanding?businessUnitId=${values?.businessUnit?.value}&shipPointId=${values?.shipPoint?.value}&pageNo=${pageNo}&pageSize=${pageSize}&search=${searchValue}${date}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const isBulkEdit = useMemo(
    () => userRole?.find((item) => item?.intFeatureId === 1256) || null,
    [userRole]
  );
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Gate Item Entry"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-gate-register/Gate-Item-Entry/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(lodar || shipPointLoader) && <Loading />}
                <div className="row global-form">
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
                              if (data === [])
                                return toast.warn("No Ship Point Found");
                              setFieldValue("shipPoint", data[0]);
                            }
                          );
                          setFieldValue("businessUnit", valueOption);
                          setRowData([]);
                          setFieldValue("shipPoint", "");
                        } else {
                          setFieldValue("shipPoint", "");
                          setFieldValue("businessUnit", "");
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
                  <div className="col-lg-2">
                    <InputField
                      type="date"
                      name="date"
                      label="Date"
                      value={values?.date}
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        !values?.businessUnit ||
                        !values?.shipPoint ||
                        !values?.date
                      }
                      onClick={(e) => {
                        landingData(values);
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div>
                  <PaginationSearch
                    placeholder="Search here..."
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
                            <th>তারিখ </th>
                            <th>সাপ্লায়ার/কাস্টমারের নাম </th>
                            <th>ড্রাইভারের নাম </th>
                            <th>ড্রাইভারের মোবাইল নাম্বার </th>
                            <th>গাড়ীর নাম্বার </th>
                            <th>রেজি. নং</th>
                            <th>প্রবেশের সময়</th>
                            <th>বহির্গমনের সময়</th>
                            <th>সময়কাল</th>
                            <th>চালান নাম্বার </th>
                            {selectedBusinessUnit?.value === 4 ? (
                              <th>ভ্যাট চালান নাম্বার</th>
                            ) : null}
                            <th>পণ্যের নাম</th>
                            <th>শিফট ইনচার্জ </th>
                            <th style={{ width: "50px" }}>Action</th>
                            {isBulkEdit?.isEdit && (
                              <th style={{ width: "50px" }}>Is Bulk</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.length > 0 &&
                            rowData?.data?.map((item, index) => {
                              const {
                                exceed,
                                formattedTimeDiff,
                              } = calculateTimeDifference(
                                _currentTime(),
                                item?.tmInTime
                              );

                              return (
                                <tr key={index}>
                                  <td>{pageNo * pageSize + index + 1}</td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.dteDate)}
                                  </td>
                                  <td>{item?.strSupplierName}</td>
                                  <td>{item?.strDriverName}</td>
                                  <td className="text-center">
                                    {item?.strDriverMobileNo}
                                  </td>
                                  <td className="text-center">
                                    {item?.strTruckNumber}
                                  </td>
                                  <td className="text-center">
                                    {item?.strEntryCode}
                                  </td>
                                  <td className="text-center">
                                    {_timeFormatter(item?.tmInTime || "")}
                                  </td>
                                  <td className="text-center">
                                    {_timeFormatter(item?.tmOutTime || "")}
                                  </td>
                                  <td className={exceed ? "text-danger" : ""}>
                                    {formattedTimeDiff}
                                  </td>
                                  <td className="text-center">
                                    {item?.strInvoiceNumber}
                                  </td>
                                  {selectedBusinessUnit?.value === 4 ? (
                                    <td>{item?.strVatChallanNo}</td>
                                  ) : null}
                                  <td>{item?.strItemName}</td>
                                  <td>{item?.strShiftIncharge}</td>
                                  <td className="text-center">
                                    <IEdit
                                      onClick={() =>
                                        history.push({
                                          pathname: `/production-management/msil-gate-register/Gate-Item-Entry/edit/${item?.intGateEntryItemListId}`,
                                          state: { ...item },
                                        })
                                      }
                                    />
                                  </td>
                                  {isBulkEdit?.isEdit && (
                                    <>
                                      {item?.isBulk === null ? (
                                        <td className="text-center">
                                          <OverlayTrigger
                                            overlay={
                                              <Tooltip id="cs-icon">
                                                {"Bulk"}
                                              </Tooltip>
                                            }
                                          >
                                            <span>
                                              <i
                                                style={{ fontSize: "18px" }}
                                                className={`fa fa-bullseye pointer`}
                                                onClick={() => {
                                                  setIsShowModel(true);
                                                  setItemList(item);
                                                  setLandingValues(values);
                                                }}
                                              ></i>
                                            </span>
                                          </OverlayTrigger>
                                        </td>
                                      ) : (
                                        <td className="text-center">
                                          {item?.isBulk ? "Yes" : "No"}
                                        </td>
                                      )}
                                    </>
                                  )}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.data?.length > 0 && (
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
      {/* Create Bulk modal*/}
      <IViewModal
        modelSize="xl"
        show={isShowModel}
        onHide={() => {
          setIsShowModel(false);
        }}
      >
        <BulkDetails
          item={itemList}
          landingData={landingData}
          setIsShowModel={setIsShowModel}
          landingValues={landingValues}
        />
      </IViewModal>
    </>
  );
}

export default GateItemEntry;
