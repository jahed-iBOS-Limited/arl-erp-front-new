import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICard from "../../../../_helper/_card";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import { deleteG2GInfo } from "../helper";

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

export default function G2GItemInfo() {
  const history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading] = useAxiosGet();
  const [isLoading, setIsLoading] = useState(false);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  //setLandingData
  const setLandingData = (_pageNo, _pageSize, values) => {
    const fromDate = values?.fromDate || _todayDate();
    const toDate = values?.toDate || _todayDate();
    const pageNo = _pageNo || 0;
    const pageSize = _pageSize || 15;
    const url = `/tms/LigterLoadUnload/GetG2GItemInfoPagination?BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`;
    getGridData(url);
  };

  useEffect(() => {
    setLandingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this Empty Bag information?",
      yesAlertFunc: () => {
        deleteG2GInfo(id, setIsLoading, () => {
          setLandingData(pageNo, pageSize, values);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  return (
    <>
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <ICard
            title="Empty Bag Info"
            isCreteBtn={true}
            createHandler={() => {
              history.push(`/vessel-management/allotment/g2giteminfo/entry`);
            }}
          >
            <Form>
              <div className="row global-form">
                <FromDateToDateForm obj={{ values, setFieldValue }} />
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setLandingData(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row cash_journal">
                {(loading || isLoading) && <Loading />}
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>SL</th>
                          <th>Item Name</th>
                          <th>Ship Point Name</th>
                          <th>Busting Bag Qty</th>
                          <th>CNF Bag Qty</th>
                          <th>Others Bag Qty</th>
                          <th>Total Qty</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td> {item?.sl}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.shipPointName}</td>
                              <td>{item?.bustingBagQnt}</td>
                              <td>{item?.cnfbagQnt}</td>
                              <td>{item?.othersBagQnt}</td>
                              <td>
                                {item?.bustingBagQnt +
                                  item?.cnfbagQnt +
                                  item?.othersBagQnt}
                              </td>
                              <td className="text-right">
                                {_dateFormatter(item?.dteDate, true)}
                              </td>
                              <td className="text-center">
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IEdit
                                      onClick={() => {
                                        history.push({
                                          pathname: `/vessel-management/allotment/g2giteminfo/edit/${item?.intId}`,
                                          state: item,
                                        });
                                      }}
                                    ></IEdit>
                                  </span>
                                  <span>
                                    <IDelete
                                      id={item?.intId}
                                      remover={(id) => {
                                        deleteHandler(id, values);
                                      }}
                                    />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
          </ICard>
        )}
      </Formik>
    </>
  );
}
