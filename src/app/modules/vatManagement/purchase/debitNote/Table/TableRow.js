import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getBranchDDl, getDebitNoteLandingGridData } from "../helper/helper";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { setPurchaseDebitNoteLanding_Actions } from "../../../../_helper/reduxForLocalStorage/Actions";

export function TableRow() {
  const history = useHistory();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState({});

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      purchaseDebitNoteLanding: state.localStorage.purchaseDebitNoteLanding,
    };
  }, shallowEqual);

  const {
    profileData,
    selectedBusinessUnit,
    purchaseDebitNoteLanding,
  } = storeData;

  const [taxbranchDDL, setTaxBranchDDL] = useState([]);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getBranchDDl(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
    getDebitNoteLandingGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.taxBranch?.value,
      values?.formDate,
      values?.toDate,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  useEffect(() => {
    if (purchaseDebitNoteLanding?.taxBranch?.value) {
      setPositionHandler(
        pageNo,
        pageSize,
        {
          taxBranch: purchaseDebitNoteLanding?.taxBranch,
          formDate: purchaseDebitNoteLanding?.formDate,
          toDate: purchaseDebitNoteLanding?.toDate,
        },
        null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseDebitNoteLanding]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...purchaseDebitNoteLanding,
          taxBranch: purchaseDebitNoteLanding?.taxBranch
            ? purchaseDebitNoteLanding?.taxBranch
            : taxbranchDDL[0],
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Debit Note"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/mngVat/purchase/debit-note/add`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary"
                    disabled={!values?.taxBranch}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="taxBranch"
                        options={taxbranchDDL || []}
                        value={values?.taxBranch}
                        label="Branch Name"
                        onChange={(valueOption) => {
                          setFieldValue("taxBranch", valueOption);
                        }}
                        placeholder="Branch Name"
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
                    <div className="col-lg-2 mt-4">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(setPurchaseDebitNoteLanding_Actions(values));
                          getDebitNoteLandingGridData(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.taxBranch?.value,
                            values?.formDate,
                            values?.toDate,
                            setGridData,
                            setLoading,
                            pageNo,
                            pageSize
                          );
                        }}
                        disabled={
                          !values.taxBranch ||
                          !values?.toDate ||
                          !values?.formDate
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {/* table  start */}

                  <PaginationSearch
                    placeholder="Purchase Invoice Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th style={{ width: "50px" }}>Partner</th>
                          <th style={{ width: "50px" }}>Purchase Invoice</th>
                          <th style={{ width: "50px" }}>Fiscal Year</th>
                          <th style={{ width: "50px" }}>Transaction Date</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && <Loading />}
                        {gridData?.data?.map((data, index) => (
                          <tr key={index} style={{ textAlign: "center" }}>
                            <td>{index + 1}</td>
                            <td className="text-left">
                              <div className="pl-2">{data.supplierName}</div>
                            </td>
                            <td>{data.taxPurchaseCode}</td>
                            <td>{_dateFormatter(data.purchaseDateTime)}</td>
                            <td>{_dateFormatter(data.referanceDate)}</td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/mngVat/purchase/debit-note/edit/${data.taxPurchaseId}`
                                    );
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
