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
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  search: "",
};

const SupplierUserPassword = () => {
  const [rowData, getRowData, lodar] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/hcm/Report/GetSupplierCredential?AccountId=${profileData?.accountId}&BusinessUnitId=102&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getRowData(
      `/hcm/Report/GetSupplierCredential?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=102&Search=${searchValue ||
        ""}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Supplier User List"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {/* <div className="form-group row mb-4 global-form">
                           <div className="col-lg-3">
                              <InputField
                                 value={values?.search}
                                 label="Search"
                                 placeholder="Search (min 3 letter)"
                                 type="string"
                                 name="search"
                                 onChange={e => {
                                    setFieldValue('search', e.target.value);
                                 }}
                              />
                           </div>
                           <div className="col-lg-3">
                              <button
                                 type="button"
                                 className="btn btn-primary mt-5"
                                 onClick={() => {
                                    getRowData(
                                       `/domain/Information/GetUserPassword?search=${values.search}&securityCode=${values?.userPassword}`
                                    );
                                 }}
                              >
                                 View
                              </button>
                           </div>
                        </div> */}
                {rowData?.data?.length > 0 && (
                  <PaginationSearch
                    placeholder="User Name or LogIn Id"
                    paginationSearchHandler={paginationSearchHandler}
                  />
                )}

                {lodar && <Loading />}
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Login Id</th>
                            <th>Password</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.map((user, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{user?.strUserName}</td>
                              <td>{user?.strEmailAddress}</td>
                              <td>{user?.strLoginId}</td>
                              <td>{user?.strPassword}</td>
                            </tr>
                          ))}
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
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default SupplierUserPassword;
