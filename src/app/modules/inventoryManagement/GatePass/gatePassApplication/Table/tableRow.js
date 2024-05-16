/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import IView from "../../../../_helper/_helperIcons/_view";
// import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import { getWarehouseDDL, getGridData, getPlantDDL } from "../helper";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

import {
  Card,
  CardHeader,
  ModalProgressBar,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import PaginationSearch from "./../../../../_helper/_search";
import IViewModal from "./../../../../_helper/_viewModal";
import ViewReport from "../View/viewReport";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useDispatch } from "react-redux";
import { setGatePassLandingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
import ReturnableModal from "../View/viewReturnable";
import ReceiveIcon from "../../../../_helper/_helperIcons/_receive";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [warehouseList, setWarehouseList] = useState([]);
  const [, setWarehouseListId] = useState({});
  const [, setPlantListId] = useState({});
  const [plantList, setPlantList] = useState([]);
  const [gridDataId, setGridDataId] = useState("");
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isReturnableModal, setIsReturnableModal] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    localStorage: { gatePaseLanding: landingData },
    authData: { profileData, selectedBusinessUnit },
  } = useSelector((store) => store, shallowEqual);

  useEffect(() => {
    getPlantDDL(
      setPlantList,
      profileData?.accountId,
      selectedBusinessUnit?.value
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.warehouse?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      values?.fromDate,
      values?.toDate,
      values?.plant?.value,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          landingData
            ? landingData
            : {
                warehouse: "",
                plant: "",
                fromDate: _todayDate(),
                toDate: _todayDate(),
              }
        }
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Gate Pass Application">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/inventory-management/gate-pass/gate-pass-application/create`,
                        state: {
                          plant: values?.plant,
                          warehouse: values?.warehouse,
                        },
                      });
                      dispatch(setGatePassLandingAction(values));
                    }}
                    className="btn btn-primary"
                    disabled={!values?.plant || !values?.warehouse}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-2">
                      <NewSelect
                        name="plant"
                        options={plantList}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setGridData(null);
                          setWarehouseList([]);
                          setFieldValue("warehouse", "");
                          setFieldValue("plant", valueOption);
                          setPlantListId(valueOption);
                          if (valueOption) {
                            getWarehouseDDL(
                              setWarehouseList,
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value
                            );
                          }
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="warehouse"
                        options={warehouseList}
                        value={values?.warehouse}
                        label="Warehouse"
                        isDisabled={!values?.plant}
                        onChange={(valueOption) => {
                          setGridData(null);
                          setFieldValue("formAddress", valueOption?.address);
                          setWarehouseListId(valueOption);
                          setFieldValue("warehouse", valueOption);
                        }}
                        placeholder="Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        onChange={(e) => {
                          setGridData(null);
                          setFieldValue("fromDate", e.target.value);
                        }}
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        onChange={(e) => {
                          setGridData(null);
                          setFieldValue("toDate", e.target.value);
                        }}
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-2 mt-5">
                      <button
                        className="btn btn-primary"
                        disabled={
                          !values?.plant ||
                          !values?.warehouse ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                        type="button"
                        onClick={() => {
                          getGridData(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.warehouse?.value,
                            setGridData,
                            setLoading,
                            pageNo,
                            pageSize,
                            values?.fromDate,
                            values?.toDate,
                            values?.plant?.value
                          );
                          dispatch(setGatePassLandingAction(values));
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>

                  <div className="row cash_journal">
                    {loading && <Loading />}
                    <div className="col-lg-12">
                      <PaginationSearch
                        placeholder="Search Position/Emp. Type"
                        paginationSearchHandler={paginationSearchHandler}
                        values={values}
                      />
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th style={{ width: "20px" }}>SL</th>
                              <th style={{ width: "50px" }}>Gate Pass Code</th>
                              <th style={{ width: "50px" }}>Date</th>
                              <th style={{ width: "50px" }}>Remarks</th>
                              <th style={{ width: "50px" }}>To Address</th>
                              <th style={{ width: "50px" }}>Status</th>
                              <th style={{ width: "50px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.length > 0 &&
                              gridData?.data?.map((item, index) => (
                                <tr key={index}>
                                  <td>{pageNo * pageSize + index + 1}</td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.gatePassCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {_dateFormatter(
                                        item?.gatePassRequestDate
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.strRemarks}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">{item?.to}</div>
                                  </td>
                                  <td>
                                    <div className="pl-2 text-center">
                                      {item?.status}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      {item?.returnableItem ? (
                                        <span className="mr-3 view">
                                          <ReceiveIcon
                                            clickHandler={() => {
                                              setIsReturnableModal(true);
                                              setGridDataId(item?.gatePassId);
                                            }}
                                          />
                                        </span>
                                      ) : null}
                                      <span className="view">
                                        <IView
                                          clickHandler={() => {
                                            setIsShowModal(true);
                                            setGridDataId(item?.gatePassId);
                                          }}
                                        />
                                      </span>
                                      {item?.status !== "Approved" &&
                                        item?.status !== "Rejected" && (
                                          <span
                                            className="ml-3 edit"
                                            onClick={() => {
                                              history.push({
                                                pathname: `/inventory-management/gate-pass/gate-pass-application/edit/${item?.gatePassId}`,
                                                state: item,
                                              });
                                            }}
                                          >
                                            <IEdit />
                                          </span>
                                        )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* modal  */}
                    <IViewModal
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewReport
                        setIsShowModal={setIsShowModal}
                        gridDataId={gridDataId}
                      />
                    </IViewModal>

                    <IViewModal
                      show={isReturnableModal}
                      onHide={() => setIsReturnableModal(false)}
                    >
                      <ReturnableModal
                        setIsReturnableModal={setIsReturnableModal}
                        gridDataId={gridDataId}
                        profileData={profileData?.accountId}
                        warehouse={values?.warehouse?.value}
                        setGridData={setGridData}
                        loader={setLoading}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        fromDate={values?.fromDate}
                        toDate={values?.toDate}
                        plant={values?.plant?.value}
                      />
                    </IViewModal>

                    {gridData?.data?.length > 0 && (
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
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
