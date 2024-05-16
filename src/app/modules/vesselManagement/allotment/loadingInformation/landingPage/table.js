import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  DeleteLoadingInformation,
  GetDomesticPortDDL,
  getLighterLoadUnloadPagination,
} from "../helper";

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
  port: { value: 0, label: "All" },
  organization: "",
};

export function LoadingLandingTable() {
  const history = useHistory();

  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [portDDL, setPortDDL] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  //setLandingData
  const setLandingData = (pageNo, pageSize, values, searchValue) => {
    getLighterLoadUnloadPagination(
      accId,
      buId,
      searchValue,
      values?.port?.value || 0,
      values?.organization?.value || 0,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    if (accId && buId) {
      setLandingData(pageNo, pageSize, initData, searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  let totalQuantity = 0;

  const paginationSearchHandler = (searchValue, values) => {
    setSearchTerm(searchValue);
    setLandingData(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <ICustomCard
            title="Loading Information"
            createHandler={() => {
              history.push({
                pathname: `/vessel-management/allotment/loadinginformation/Create`,
                state: values,
              });
            }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="organization"
                    options={[
                      { value: 73244, label: "G2G BADC" },
                      { value: 73245, label: "G2G BCIC" },
                    ]}
                    value={values?.organization}
                    label="Organization"
                    onChange={(valueOption) => {
                      setFieldValue("organization", valueOption);
                    }}
                    placeholder="Organization"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="port"
                    options={[{ value: 0, label: "All" }, ...portDDL] || []}
                    value={values?.port}
                    label="Port"
                    placeholder="Port"
                    onChange={(valueOption) => {
                      setFieldValue("port", valueOption);
                    }}
                  />
                </div>
                <FromDateToDateForm obj={{ values, setFieldValue }} />
                <IButton
                  onClick={() => {
                    setLandingData(pageNo, pageSize, values, searchTerm);
                  }}
                />
              </div>
              <div className="row cash_journal">
                {loading && <Loading />}
                <div className="col-lg-12">
                  <div className="mt-2">
                    <PaginationSearch
                      placeholder="Mother Vessel & Program No Search"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>SL</th>
                          <th>Mother Vessel</th>
                          <th>Program No</th>
                          <th>Survey Quantity</th>
                          <th style={{ width: "70px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => {
                          totalQuantity += item?.surveyQnt;
                          return (
                            <tr key={index}>
                              <td> {item?.sl}</td>
                              <td> {item?.motherVesselName}</td>
                              <td> {item?.program}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.surveyQnt, true)}
                              </td>
                              <td>
                                <div className="d-flex justify-content-around">
                                  <span className="text-center">
                                    <IView
                                      clickHandler={() =>
                                        history.push({
                                          pathname: `/vessel-management/allotment/loadinginformation/view/${item?.voyageNo}`,
                                          state: item,
                                        })
                                      }
                                    />
                                  </span>
                                  <span
                                    className="edit"
                                    onClick={() => {
                                      history.push(
                                        `/vessel-management/allotment/loadinginformation/edit/${item?.voyageNo}`
                                      );
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                  <span
                                    className="mr-1"
                                    onClick={() => {
                                      let confirmObject = {
                                        title: "Are you sure?",
                                        message:
                                          "Are you sure you want to delete this Loading Information",
                                        yesAlertFunc: async () => {
                                          DeleteLoadingInformation(
                                            item?.voyageNo,
                                            setLoading,
                                            () => {
                                              setLandingData(
                                                pageNo,
                                                pageSize,
                                                values,
                                                searchTerm
                                              );
                                            }
                                          );
                                        },
                                        noAlertFunc: () => {},
                                      };
                                      IConfirmModal(confirmObject);
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {gridData?.data?.length > 0 && (
                          <tr>
                            <td colSpan={3} className="text-right">
                              <b>Total</b>
                            </td>
                            <td className="text-right">
                              <b>{_fixedPoint(totalQuantity, true)}</b>
                            </td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setLandingData}
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
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
