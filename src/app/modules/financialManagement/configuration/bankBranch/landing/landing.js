import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {};

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export default function BankBranchLanding() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [searchByText, setSearchByText] = useState("");
  const [landingData, getLandingData, landingDataLoader] = useAxiosGet();

  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const handleFetchRowData = (searchText, pageNo, pageSize) => {
    const api = `/fino/BankBranch/GetBankBranchLandingPasignation?search=${searchText}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=asc`;
    getLandingData(api);
  };

  const paginationSearchHandler = (searchValue) => {
    setSearchByText(searchValue);
    debounce(handleFetchRowData(searchValue, pageNo, pageSize), 500);
  };

  const setPositionHandler = (pageNo, pageSize, values = {}) => {
    //load data
    debounce(handleFetchRowData(searchByText, pageNo, pageSize), 500);
  };

  useEffect(() => {
    handleFetchRowData(searchByText, pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchByText, pageNo, pageSize]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {landingDataLoader && <Loading />}
          <IForm
            title="Bank Branch"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {
                    <button
                      type="button"
                      className="btn btn-primary mr-1"
                      onClick={() => {
                        history.push({
                          pathname: `/financial-management/configuration/bankbranch/create`,
                        });
                      }}
                    >
                      Create
                    </button>
                  }
                </div>
              );
            }}
          >
            <Form>
              <>
                <PaginationSearch
                  placeholder="🔎 Bank name, Branch, Routing No."
                  paginationSearchHandler={paginationSearchHandler}
                />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Bank Name</th>
                        <th>Branch Name</th>
                        <th>Branch Code</th>
                        <th>Routing No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {landingData?.data?.length > 0 &&
                        landingData?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.bankName}</td>
                              <td>{item?.bankBranchName}</td>
                              <td>{item?.bankBranchCode}</td>
                              <td>{item?.routingNo}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </>
              <div
                className="mt-3 mb-20"
                style={{
                  position: "absolute",
                  right: "30px",
                  border: "1px solid gray",
                }}
              >
                <PaginationTable
                  count={landingData.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
