/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import IView from "../../../../_helper/_helperIcons/_view";
import { GetYearlyLeavePolicyPagination } from "../helper";
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
import { shallowEqual, useSelector } from "react-redux";
import PaginationSearch from "../../../../_helper/_search";
import IViewModal from "../../../../_helper/_viewModal";

const initData = {
  id: undefined,
};
export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modelView, setModelView] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, search, values) => {
    GetYearlyLeavePolicyPagination(
      selectedBusinessUnit?.value,
      profileData?.accountId,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      search
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };

  useEffect(() => {
    GetYearlyLeavePolicyPagination(
      selectedBusinessUnit?.value,
      profileData?.accountId,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Yearly Leave Policy">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/human-capital-management/leavemovement/yearlyleavepolicy/create`,
                      });
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  <div className="row cash_journal">
                    {loading && <Loading />}
                    <div className="col-lg-12">
                      <PaginationSearch
                        placeholder="Search Position/Emp. Type"
                        paginationSearchHandler={paginationSearchHandler}
                        values={values}
                      />
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "15px" }}>SL</th>
                            <th style={{ width: "50px" }}>Employment Type</th>
                            <th style={{ width: "50px" }}>Year</th>
                            <th style={{ width: "15px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.length > 0 &&
                            gridData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.sl}</td>
                                <td>
                                  <div className="pl-2">
                                    {item?.strEmploymentType}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">{item?.intYearId}</div>
                                </td>

                                <td>
                                  <div className="d-flex justify-content-around">
                                    <span className="view">
                                      <IView
                                        clickHandler={() => {
                                          history.push({
                                            pathname: `/human-capital-management/leavemovement/yearlyleavepolicy/view/${item?.intEmploymentTypeId}`,
                                            state: item,
                                          });
                                        }}
                                      />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
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
                      />
                    )}
                  </div>
                </Form>

                <IViewModal
                  show={modelView}
                  onHide={() => setModelView(false)}
                  title={"Transfer Out"}
                  btnText="Close"
                ></IViewModal>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
