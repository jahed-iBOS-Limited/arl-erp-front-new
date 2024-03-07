/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import WarehouseApproveFrom from "./approve";
import TruckToDamApproveForm from "./truckToDamApprove";

const initData = {
  shipPoint: "",
  status: { value: 0, label: "All" },
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const headers = [
  "SL",
  "Program",
  "Ghat Name",
  "Lighter Name",
  "Mother Vessel Name",
  "Received At",
  "Unloading Start",
  "Unloaded Qty",
  "Unloading Complete",
  "Action",
  "Truck to Dam",
  "Warehouse Approve",
];

const UnLoadingInformationTable = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [levelOfApprove, setLevelOfApprove] = useState("");

  // get user profile data from store
  const {
    // profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [searchTerm, setSearchTerm] = useState("");

  const getData = (values, pageNo, pageSize, searchTerm) => {
    const searchTxt = searchTerm || "";
    const url = `/tms/LigterLoadUnload/GetLighterUnLoadingPagination?BusinessUnitId=${buId}&ShippingPoint=${values
      ?.shipPoint?.value || 0}&FromDate=${values?.fromDate}&ToDate=${
      values?.toDate
    }&PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchTxt}&IsInventoryApprove=${values
      ?.status?.value || 0}`;

    getRowData(url);
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize, searchTerm);
  }, []);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize, "");
  };

  let totalQuantity = 0;

  const paginationSearchHandler = (searchValue, values) => {
    setSearchTerm(searchValue);
    // getData(values, pageNo, pageSize, searchValue);

    const url = `/tms/LigterLoadUnload/GetLighterUnLoadingPagination?BusinessUnitId=${buId}&ShippingPoint=${values
      ?.shipPoint?.value ||
      0}&PageNo=${pageNo}&PageSize=${pageSize}&SearchTerm=${searchValue}`;

    getRowData(url);
  };

  // const approveSubmitHandler = (voyageNo, lighterVesselId, values) => {
  //   const payload = {
  //     voyageNo: voyageNo,
  //     lighterVesselId: lighterVesselId,
  //     actionBy: userId,
  //   };
  //   StockInToInventoryApproval(payload, () => {
  //     getData(values, pageNo, pageSize, searchTerm);
  //   });
  // };

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
              <ModalProgressBar />
              <CardHeader title="Unloading Information">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        history.push(
                          "/vessel-management/allotment/unloadinginformation/create"
                        );
                      }}
                      className="btn btn-primary ml-2"
                      disabled={isLoading}
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isLoading && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <FromDateToDateForm obj={{ values, setFieldValue }} />
                      <div className="col-lg-3">
                        <NewSelect
                          name="status"
                          value={values?.status}
                          label="Status"
                          placeholder="Status"
                          options={[
                            { value: 0, label: "All" },
                            { value: 1, label: "Pending" },
                            { value: 2, label: "Approved" },
                          ]}
                          onChange={(e) => {
                            setFieldValue("status", e);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="btn btn-primary btn-sm mt-5"
                          type="button"
                          onClick={() => {
                            getData(values, pageNo, pageSize);
                          }}
                          disabled={isLoading}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="mt-2">
                  <PaginationSearch
                    placeholder="ShipPoint & MotherVessel & LighterVessel Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                {rowData?.data?.length > 0 && (
                  <div>
                    <table
                      id="table-to-xlsx"
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {headers?.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.map((item, index) => {
                          totalQuantity += item?.receiveQnt;
                          return (
                            <tr
                              key={index}
                              style={
                                !item?.isInventoryApprove
                                  ? { backgroundColor: "#FFF8DC" }
                                  : !item?.isApproveBySupervisor
                                  ? { backgroundColor: "#F0FFFF" }
                                  : !item?.isDumpApproveLM
                                  ? { backgroundColor: "#B0E0E6" }
                                  : { backgroundColor: "#00FA9A" }
                              }
                            >
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.program}</td>
                              <td>{item?.shipPointName}</td>
                              <td>{item?.lighterVesselName}</td>
                              <td>{item?.motherVesselName}</td>
                              <td>
                                {item?.receivedDate
                                  ? moment(item?.receivedDate).format("lll")
                                  : ""}
                              </td>
                              <td>
                                {item?.unLoadingStartDate
                                  ? moment(item?.unLoadingStartDate).format(
                                      "lll"
                                    )
                                  : ""}
                              </td>

                              <td className="text-right">
                                {_fixedPoint(item?.receiveQnt, true, 0)}
                              </td>
                              <td>
                                {item?.unLoadingCompleteDate
                                  ? moment(item?.unLoadingCompleteDate).format(
                                      "lll"
                                    )
                                  : ""}
                              </td>

                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                <div className="d-flex justify-content-around align-items-center">
                                  <span>
                                    <IView
                                      clickHandler={() => {
                                        history.push({
                                          pathname: `/vessel-management/allotment/unloadinginformation/view/${item?.voyageNo}`,
                                          state: item,
                                        });
                                      }}
                                    />
                                  </span>
                                  {!item?.isInventoryApprove && (
                                    <span
                                      className="edit"
                                      onClick={() => {
                                        history.push({
                                          pathname: `/vessel-management/allotment/unloadinginformation/modify/${item?.voyageNo}`,
                                          state: item,
                                        });
                                      }}
                                    >
                                      <IEdit />
                                    </span>
                                  )}
                                  {!item?.unLoadingCompleteDate &&
                                    !item?.isInventoryApprove && (
                                      <span>
                                        <ICon
                                          title="Add"
                                          onClick={() => {
                                            history.push({
                                              pathname: `/vessel-management/allotment/unloadinginformation/edit/${item?.voyageNo}`,
                                              state: item,
                                            });
                                          }}
                                        >
                                          <i class="fas fa-plus-circle"></i>
                                        </ICon>
                                      </span>
                                    )}
                                </div>
                              </td>
                              <td className="text-center">
                                <span>
                                  <IApproval
                                    title="Truck to Damp Delivery"
                                    onClick={() => {
                                      setSingleData(item);
                                      setShow(true);
                                      setLevelOfApprove("fourth");
                                    }}
                                  />
                                </span>
                              </td>
                              <td className="text-center">
                                {!item?.isInventoryApprove ? (
                                  // {!item?.isBillSubmitted ? (
                                  <span>
                                    <IApproval
                                      title="Warehouse Approve"
                                      onClick={() => {
                                        setSingleData(item);
                                        setShow(true);
                                        setLevelOfApprove("first");
                                      }}
                                    />
                                  </span>
                                ) : !item?.isApproveBySupervisor ? (
                                  <span>
                                    <IApproval
                                      title="Supervisor Approve"
                                      onClick={() => {
                                        setSingleData(item);
                                        setShow(true);
                                        setLevelOfApprove("second");
                                      }}
                                    />
                                  </span>
                                ) : !item?.isDumpApproveLM ? (
                                  <span>
                                    <IApproval
                                      title="Dump Approve (LM)"
                                      onClick={() => {
                                        setSingleData(item);
                                        setShow(true);
                                        setLevelOfApprove("third");
                                      }}
                                    />
                                  </span>
                                ) : (
                                  "Approved"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {rowData?.data?.length > 0 && (
                          <tr>
                            <td colSpan={7} className="text-right">
                              <b>Total</b>
                            </td>
                            <td className="text-right">
                              <b>{_fixedPoint(totalQuantity, true, 0)}</b>
                            </td>
                            <td colSpan={4}></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <IViewModal show={show} onHide={() => setShow(false)}>
                  {levelOfApprove === "fourth" ? (
                    <TruckToDamApproveForm
                      preValues={values}
                      singleItem={singleData}
                      pageNo={pageNo}
                      pageSize={pageSize}
                      setShow={setShow}
                      getData={getData}
                    />
                  ) : (
                    <WarehouseApproveFrom
                      preValues={values}
                      singleItem={singleData}
                      pageNo={pageNo}
                      pageSize={pageSize}
                      setShow={setShow}
                      getData={getData}
                      levelOfApprove={levelOfApprove}
                    />
                  )}
                </IViewModal>

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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default UnLoadingInformationTable;
