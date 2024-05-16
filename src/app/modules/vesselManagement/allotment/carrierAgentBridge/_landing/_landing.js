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
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IConfirmModal from "../../../../_helper/_confirmModal";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import { deleteCarrierAgent } from "../helper";
import GudamAllotmentForm from "../_form/_form";

const headers = ["SL", "Port", "Carrier Agent", "Number", "Action"];

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

const CarrierAgentBridge = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("");
  // const [singleItem, setSingleItem] = useState({});

  // get user data from store
  const {
    profileData: { accountId: accId, userId: uId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    const url = `/wms/FertilizerOperation/GetLighterCarrierAgentPagination?BusinessUnitId=${buId}&FromDate=${values?.fromDate}&Todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`;
    getRowData(url);
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize);
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this information?",
      yesAlertFunc: () => {
        deleteCarrierAgent(id, uId, setLoading, () => {
          getData(values, pageNo, pageSize);
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
              <CardHeader title="Carrier Agent Bridge">
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
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(isLoading || loading) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form row">
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <div className="col-12 mt-5 text-right">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getData(values, pageNo, pageSize);
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
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
                              <td>{item?.portName}</td>
                              <td>{item?.carrierName}</td>
                              <td>{item?.phone}</td>
                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                <div className="d-flex justify-content-around">
                                  {/* <span>
                                  <IEdit
                                    onClick={() => {
                                      setFormType("edit");
                                      setSingleItem(item);
                                      setShow(true);
                                    }}
                                    id={item?.id}
                                  />
                                </span> */}
                                  <span
                                    onClick={() => {
                                      deleteHandler(item?.autoId, values);
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                </div>
                              </td>
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
                </form>
              </CardBody>
              <IViewModal show={show} onHide={() => setShow(false)}>
                <GudamAllotmentForm
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

export default CarrierAgentBridge;
