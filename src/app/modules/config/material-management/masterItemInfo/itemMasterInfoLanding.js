import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import PaginationTable from "../../../_helper/_tablePagination";
import PaginationSearch from "../../../_helper/_search";
const initData = {};
export default function ItemMasterInfoLanding() {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading] = useAxiosGet();
  const history = useHistory();

  const saveHandler = (values, cb) => {};

  const getLandingData = (pageNo, pageSize, searchValue = "") => {
    getGridData(
      `/item/ItemMaster/GetItemMasterPasignation?AccountId=${profileData?.accountId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&searchTerm=${searchValue}`
    );
  };
  useEffect(() => {
    getLandingData(pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const setPositionHandler = (pageNo, pageSize ) => {
    getLandingData(pageNo, pageSize,);
  };

  const paginationSearchHandler = (searchValue) => {
    getLandingData(0, pageSize, searchValue);
    setPageNo(0);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Master Item"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mr-10"
                    onClick={() =>
                      history.push("/config/material-management/itembasicinfo-master/bulk-upload")
                    }
                  >
                    Bulk Upload
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                        history.push("/config/material-management/itembasicinfo-master/add")
                      }
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              {/* <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="loanType"
                    options={[
                      { value: 1, label: "Loan Issue", type: "Issue" },
                      { value: 2, label: "Loan Receive", type: "Receive" },
                    ]}
                    value={values?.loanType}
                    label="Loan Type"
                    onChange={(valueOption) => {
                      setFieldValue("loanType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize, "");
                    }}
                    type="button"
                    className="btn btn-primary mt-5"
                  >
                    View
                  </button>
                </div>
              </div> */}
              {loading && <Loading />}
            <PaginationSearch
              placeholder="Item Name and Code Search"
              paginationSearchHandler={paginationSearchHandler}
              values={values}
              setter={(searchValue) => setFieldValue("search", searchValue)}
            />
              {gridData?.data?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Code</th>
                        <th>Item</th>
                        <th>Item Type</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.itemMasterCode}</td>
                          {/* <td>{item?.businessUnitIdReceivedName}</td> */}
                          <td>{item?.itemMasterName}</td>
                          <td>{item?.itemMasterTypeName}</td>
                          <td>
                            {item?.itemMasterCategoryName}
                          </td>
                          <td>{item?.itemMasterSubCategoryName}</td>

                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center">
                                <span className="mr-3">
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">
                                        Business Unit Expand
                                      </Tooltip>
                                    }
                                  >
                                    <span 
                                      style={{ cursor: "pointer"}}
                                      onClick={() => {
                                        history.push({
                                          pathname: `/config/material-management/itembasicinfo-master/expand/${item?.itemMasterId}`,
                                          state: { ...item },
                                        });
                                      }}
                                    >
                                      <i
                                        className={`fa fa-arrows-alt`}
                                        onClick={() => {}}
                                      ></i>
                                    </span>
                                  </OverlayTrigger>
                                </span>
                                <span>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">
                                        View
                                      </Tooltip>
                                    }
                                  >
                                    <span 
                                      style={{ cursor: "pointer"}}
                                      onClick={() => {
                                        history.push({
                                          pathname: `/config/material-management/itembasicinfo-master/view/${item?.itemMasterId}`,
                                          state: { ...item },
                                        });
                                      }}
                                    >
                                      <i
                                        className={`fa fa-eye`}
                                        onClick={() => {}}
                                      ></i>
                                    </span>
                                  </OverlayTrigger>
                                </span>
                              </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "50vh" }} // Adjusts height to center vertically
                >
                    <h4 style={{ fontSize: "18px", color: "#333" }}>No data found</h4>
                </div>
              )}

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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
