/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import { Formik } from "formik";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import PaginationSearch from "../../../../_helper/_search";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { deleteMotherVesselVoyageInfo } from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";

const initData = {
  shipPoint: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const headers = [
  "SL",
  "Voyage Code",
  "Mother Vessel",
  "LC No",
  "BL Qty",
  "ETA",
  "Loading Port",
  "Discharging Port",
  "CNF",
  "Steve Dore",
  "Narration",
  "Action",
];

const MotherVesselVoyageInformationTable = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize, search) => {
    const SearchTerm = search ? `SearchTerm=${search}&` : "";
    const url = `/tms/LigterLoadUnload/GetMotherVesselVoyageInfoPagination?${SearchTerm}AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`;

    getRowData(url);
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize, "");
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize, "");
  };

  const paginationSearchHandler = (search, values) => {
    getData(values, pageNo, pageSize, search);
  };

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this voyage information?",
      yesAlertFunc: () => {
        deleteMotherVesselVoyageInfo(id, setLoading, () => {
          getData(values, pageNo, pageSize, "");
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
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
              <ModalProgressBar />
              <CardHeader title="Mother Vessel Voyage Information">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        history.push(
                          "/vessel-management/allotment/mothervesselvoyageinfo/entry"
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
                {(isLoading || loading) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <FromDateToDateForm obj={{ values, setFieldValue }} />
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
                {rowData?.data?.length > 0 && (
                  <div className="col-lg-3 mt-3">
                    <PaginationSearch
                      placeholder="Search"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )}
                {rowData?.data?.length > 0 && (
                  <div className="table-responsive">
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
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.voyageCode}</td>
                              <td>{item?.motherVesselName}</td>
                              <td>{item?.lcnumber}</td>
                              <td>{item?.blqnt}</td>
                              <td>({_dateFormatter(item?.eta)}</td>

                              <td>{item?.loadingPortName}</td>
                              <td>{item?.dischargingPortName}</td>
                              <td>{item?.cnfName}</td>
                              <td>{item?.stebdoreName}</td>
                              <td>{item?.narration}</td>

                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                {
                                  <div className="d-flex justify-content-around">
                                    <span>
                                      <IEdit
                                        onClick={() => {
                                          history.push({
                                            pathname: `/vessel-management/allotment/mothervesselvoyageinfo/edit/${item?.voyageNo}`,
                                            state: item,
                                          });
                                        }}
                                      ></IEdit>
                                    </span>
                                    <span>
                                      <IView
                                        clickHandler={() => {
                                          history.push({
                                            pathname: `/vessel-management/allotment/mothervesselvoyageinfo/view/${item?.voyageNo}`,
                                            state: item,
                                          });
                                        }}
                                      ></IView>
                                    </span>
                                    <span
                                      onClick={() => {
                                        deleteHandler(item?.voyageNo, values);
                                      }}
                                    >
                                      <IDelete />
                                    </span>
                                  </div>
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
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

export default MotherVesselVoyageInformationTable;
