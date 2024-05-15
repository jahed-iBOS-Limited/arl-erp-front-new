import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IConfirmModal from "../../../_helper/_confirmModal";
import ICustomCard from "../../../_helper/_customCard";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import IDelete from "../../../_helper/_helperIcons/_delete";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import { deleteCollectionTarget, getBusinessUnitDDL } from "./helper";
import { getMonth } from "./utils";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const headers = [
  "SL",
  "Customer",
  "Region",
  "Area",
  "Territory",
  "Month",
  "Year",
  "Target Amount",
  "Action",
];

const CustomerCollectionTarget = () => {
  const [sbuDDL, setSbuDDL] = useState([]);
  const history = useHistory();
  const [gridData, getGridData, loading] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    getGridData(
      `/oms/CustomerSalesTarget/GetCollectionTargetPagination?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  useEffect(() => {
    if (buId && accId) {
      getBusinessUnitDDL(setSbuDDL, accId, buId);
      getData(initData, pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this collection target?",
      yesAlertFunc: () => {
        deleteCollectionTarget(id, setIsLoading, () => {
          getData(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  return (
    <ICustomCard title="Customer Collection Target">
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {(loading || isLoading) && <Loading />}
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                          }}
                          placeholder="Select SBU"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <FromDateToDateForm obj={{ values, setFieldValue }} />

                      <div className="col-lg-3 d-flex">
                        <button
                          type="button"
                          className="btn btn-primary mt-4 mr-4"
                          disabled={false}
                          onClick={() => {
                            getData(values, pageNo, pageSize);
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary mt-4"
                          disabled={!values?.sbu}
                          onClick={() => {
                            history.push({
                              pathname: `/sales-management/report/customercollectiontarget/entry`,
                              state: values,
                            });
                          }}
                        >
                          Create New
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>

              <div className="row cash_journal">
                <div className="col-lg-12">
                  {gridData?.data?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            {headers?.map((th, i) => (
                              <th key={i}>{th}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.map((td, index) => (
                            <tr key={index}>
                              <td className="text-center">{td?.sl}</td>
                              <td>{td?.customerName}</td>
                              <td>{td?.regionName}</td>
                              <td>{td?.areaName}</td>
                              <td>{td?.territoryName}</td>
                              <td>{getMonth(td?.monthId)}</td>
                              <td>{td?.yearId}</td>
                              <td className="text-right">
                                {_fixedPoint(td?.amount, true)}
                              </td>
                              <td style={{ width: "70px" }}>
                                <div className="d-flex justify-content-around">
                                  {
                                    <>
                                      {/* <span onClick={() => {}}>
                                      <IEdit />
                                    </span> */}
                                      <span
                                        onClick={() => {
                                          deleteHandler(
                                            td?.collectionTargetId,
                                            values
                                          );
                                        }}
                                      >
                                        <IDelete />
                                      </span>
                                    </>
                                  }
                                </div>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={7} className="text-right">
                              <b>Total</b>
                            </td>
                            <td className="text-right">
                              <b>
                                {_fixedPoint(
                                  gridData?.data?.reduce(
                                    (a, b) => a + b?.amount,
                                    0
                                  ),
                                  true
                                )}
                              </b>
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>{" "}
                    </div>
                  )}
                </div>
              </div>
            </Form>
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
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default CustomerCollectionTarget;
