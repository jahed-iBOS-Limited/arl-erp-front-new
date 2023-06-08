import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { GetCreditNotePasignation, getTaxBranchDDL_api } from "../helper";
import { Formik, Form } from "formik";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import PaginationSearch from "../../../../_helper/_search";
import Loading from "../../../../_helper/_loading";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";
import { setCreditNoteLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
const initData = {
  taxbranch: "",
  formDate: _todayDate(),
  toDate: _todayDate(),
};
export function TableRow() {
  const [gridData, setGridData] = useState({});

  const [taxbranchDDL, setTaxBranchDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const creditNoteLanding = useSelector(
    (state) => state.localStorage.creditNoteLanding
  );
  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getTaxBranchDDL_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const dispatch = useDispatch();
  const girdDataFunc = (values, pageNo, pageSize, serchTax) => {
    GetCreditNotePasignation(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.taxbranch?.value,
      values?.formDate,
      values?.toDate,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      serchTax
    );
  };

  //setPagination Handler
  const setPositionHandler = (pageNo, pageSize, values) => {
    girdDataFunc(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (searchValue, values) => {
    girdDataFunc(values, pageNo, pageSize, searchValue);
  };

  useEffect(() => {
    if (creditNoteLanding?.taxbranch?.value) {
      girdDataFunc(creditNoteLanding, pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditNoteLanding, taxbranchDDL]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={creditNoteLanding || initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          setValues,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Credit Note">
                <CardHeaderToolbar>
                  <button
                    className="btn btn-primary"
                    disabled={!values?.taxbranch}
                    onClick={() => {
                      history.push({
                        pathname: "/mngVat/sales/credit-note/add",
                        state: {
                          transferoutLandingInitData: values?.taxbranch,
                        },
                      });
                    }}
                  >
                    Create new
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  <div className=" row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="taxbranch"
                        options={taxbranchDDL || []}
                        value={values?.taxbranch}
                        label="Tax Branch"
                        onChange={(valueOption) => {
                          setFieldValue("taxbranch", valueOption);
                        }}
                        placeholder="Tax Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.formDate}
                        name="formDate"
                        placeholder="Name"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Name"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-2 mt-4 d-flex align-items-end">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(setCreditNoteLandingAction(values));
                          girdDataFunc(values, pageNo, pageSize);
                        }}
                        disabled={!values.taxbranch}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div className="row ">
                    {loading && <Loading />}
                    <div className="col-lg-12 mt-2">
                      <PaginationSearch
                        placeholder="Sales Invoice Search"
                        paginationSearchHandler={paginationSearchHandler}
                        values={creditNoteLanding}
                      />
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th style={{ width: "25px" }}>SL</th>
                              <th style={{ width: "50px" }}>Partner</th>
                              <th style={{ width: "50px" }}>Sales Invoice</th>
                              <th style={{ width: "50px" }}>Fiscal Year</th>
                              <th style={{ width: "30px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.length > 0 &&
                              gridData?.data?.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.sl}</td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.soldtoPartnerName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {item?.taxSalesCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2 text-center">
                                      {item?.fiscalYear}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-around">
                                      <span
                                        className="edit"
                                        onClick={() => {
                                          history.push({
                                            pathname: `/mngVat/sales/credit-note/edit/${item?.taxSalesId}`,
                                          });
                                        }}
                                      >
                                        <IEdit />
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
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
                        values={creditNoteLanding}
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
