import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getBranchDDl, getDebitNoteLandingGridData } from "../helper/helper";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
// import IEdit from "../../../../../_helper/_helperIcons/_edit";
import { setPurchaseDebitNoteLanding_Actions } from "../../../../../_helper/reduxForLocalStorage/Actions";
import PaginationSearch from "./../../../../../_helper/_search";
import Loading from "./../../../../../_helper/_loading";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import PaginationTable from "../../../../../_helper/_tablePagination";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../../_metronic/_partials/controls";
import IView from "./../../../../../_helper/_helperIcons/_view";

import IViewModal from "./../../../../../_helper/_viewModal";
import DebitNoteView from "./grid";

export function TableRow() {
  const history = useHistory();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState({});

  const [isShowModel, setShowModel] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [viewClick, setViewClick] = React.useState();

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
                        pathname: `/operation/purchase/debit-note/add`,
                        state: values,
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
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th style={{ width: "50px" }}>Purchase Invoice</th>
                          <th style={{ width: "50px" }}>Transaction Date</th>
                          <th style={{ width: "50px" }}>Supplier Name</th>
                          <th style={{ width: "50px" }}>Vehicle No</th>
                          <th style={{ width: "50px" }}>Address</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && <Loading />}
                        {gridData?.data?.map((data, index) => (
                          <tr key={index} style={{ textAlign: "center" }}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="pl-2">
                                {data?.taxPurchaseCode}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {_dateFormatter(data?.purchaseDateTime)}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{data?.supplierName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{data?.vehicleNo}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {data?.supplierAddress}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      setShowModel(true);
                                      setViewClick(data);
                                    }}
                                  />
                                </span>
                                {/* <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/operation/purchase/debit-note/edit/${data?.taxPurchaseId}`
                                    );
                                  }}
                                >
                                  <IEdit />
                                </span> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Form>
                <IViewModal
                  show={isShowModel}
                  onHide={() => setShowModel(false)}
                  title="Debit Note Report View"
                >
                  <DebitNoteView viewClick={viewClick} title={"DEBIT NOTE"} />
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
