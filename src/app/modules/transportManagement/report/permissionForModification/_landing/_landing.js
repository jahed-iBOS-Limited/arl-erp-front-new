/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
// import { deleteCarrierAgent } from "../helper";
import CreatePermissionForm from "../_form/_form";

const headers = [
  "SL",
  "User Name",
  "Unit Name",
  "Ghat Info",
  "Transporter Info",
  "Item Info",
  "SO Inactive",
  "Chalan Info",
  "Bill Info",
  "Territory Info",
  "FuelCash Nexpense Rpt",
  "Target",
  "OverDue Request",
  "G2G Configuration",
  "G2G Operation",
  // "Action",
];

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const PermissionForModification = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [formType, setFormType] = useState("");

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (pageNo, pageSize, searchValue) => {
    const url = `/wms/FertilizerOperation/GetPermissionForModification?SearchTerm=${searchValue}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}`;
    getRowData(url);
  };

  useEffect(() => {
    getData(pageNo, pageSize);
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(pageNo, pageSize);
  };

  const paginationSearchHandler = (search) => {
    getData(pageNo, pageSize, search);
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
              <CardHeader title="Permission">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        setFormType("create");
                        setShow(true);
                      }}
                      className="btn btn-primary ml-2"
                      disabled={isLoading}
                    >
                      Add New
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isLoading && <Loading />}
                <div className="form form-label-right">
                  <div className="col-lg-3 mt-5">
                    <PaginationSearch
                      placeholder="Enter Enroll"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                  <div className="loan-scrollable-table">
                    <div className="scroll-table _table table-responsive">
                      <table
                        id=""
                        className={
                          "table table-striped table-bordered global-table table-font-size-sm"
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
                                  style={{ width: "20px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>{item?.userName}</td>
                                <td>{item?.strUnitName}</td>
                                <td>{item?.ysnGhatInfo}</td>
                                <td>{item?.ysnTransportZoneInfo}</td>
                                <td>{item?.ysnItemInfo}</td>
                                <td>{item?.ysnSoinactive}</td>
                                <td>{item?.ysnChalanInfo}</td>
                                <td>{item?.ysnBillInfo}</td>
                                <td>{item?.ysnTerritoryInfo}</td>
                                <td>{item?.ysnFuelCashNexpenseRpt}</td>
                                <td>{item?.ysnTarget}</td>
                                <td>{item?.ysnOverDueRequest}</td>
                                <td>{item?.ysnG2gconfiguration}</td>
                                <td>{item?.ysnG2goperation}</td>
                                <td
                                  style={{ width: "80px" }}
                                  className="text-center"
                                >
                                  {/* <div className="d-flex justify-content-around">
                                    <span>
                                  <IEdit
                                    onClick={() => {
                                      setFormType("edit");
                                      setSingleItem(item);
                                      setShow(true);
                                    }}
                                    id={item?.id}
                                  />
                                </span>
                                    <span
                                      onClick={() => {
                                        deleteHandler(item?.autoId, values);
                                      }}
                                    >
                                      <IDelete />
                                    </span>
                                  </div> */}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
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
              </CardBody>
              <IViewModal show={show} onHide={() => setShow(false)}>
                <CreatePermissionForm
                  setShow={setShow}
                  getData={getData}
                  formType={formType}
                  singleItem={{}}
                  tableValues={values}
                />
              </IViewModal>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default PermissionForModification;
