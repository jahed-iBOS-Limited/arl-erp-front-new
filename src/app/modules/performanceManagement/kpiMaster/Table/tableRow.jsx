import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";

const initData = {
  bscPerspective: { value: 0, label: "All" },
  status: { value: true, label: "Active" },
};
// Validation schema
const validationSchema = Yup.object().shape({});

export function TableRow({ saveHandler }) {
  const history = useHistory();

  //paginationState
  const [gridData, getGridData, loader] = useAxiosGet([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [bscPerspectiveDDL, getBscPerspectiveDDL] = useAxiosGet();
  const [bscSelectedData, setBscSelectedData] = useState({
    value: 0,
    label: "All",
  });
  const [selectedStatus, setSelectedStatus] = useState({
    value: true,
    label: "Active",
  });

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getGridData(
      `/pms/KPI/GetKPIMasterDataPagination?accountId=${
        profileData?.accountId
      }&search=${""}&bscPerspectiveId=${
        bscSelectedData?.value
      }&status=${selectedStatus?.value}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    getBscPerspectiveDDL(`/pms/CommonDDL/BSCPerspectiveDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getGridData(
      `/pms/KPI/GetKPIMasterDataPagination?accountId=${
        profileData?.accountId
      }&search=${searchValue || ""}&bscPerspectiveId=${
        bscSelectedData?.value
      }&status=${selectedStatus?.value}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };

  return (
    <>
      {loader && <Loading />}
      <div className="kpi-landing">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
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
            errors,
            touched,
            setFieldValue,
            setValues,
            isValid,
          }) => (
            <>
              {/* Table Start */}
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="bscPerspective"
                      options={
                        [{ value: 0, label: "All" }, ...bscPerspectiveDDL] || []
                      }
                      value={values?.bscPerspective}
                      label="BSC Perspective"
                      onChange={(valueOption) => {
                        if (!valueOption) {
                          setFieldValue("bscPerspective", {
                            value: 0,
                            label: "All",
                          });
                          setBscSelectedData({
                            value: 0,
                            label: "All",
                          });
                        } else {
                          setFieldValue("bscPerspective", valueOption);
                          setBscSelectedData(valueOption);
                        }
                      }}
                      placeholder="BSC Perspective"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: true, label: "Active" },
                        { value: false, label: "Inactive" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        if (!valueOption) {
                          setFieldValue("status", {
                            value: true,
                            label: "Active",
                          });
                          setSelectedStatus({ value: true, label: "Active" });
                        } else {
                          setFieldValue("status", valueOption);
                          setSelectedStatus(valueOption);
                        }
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div style={{ marginTop: "19px" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getGridData(
                          `/pms/KPI/GetKPIMasterDataPagination?accountId=${
                            profileData?.accountId
                          }&search=${""}&bscPerspectiveId=${
                            values?.bscPerspective?.value
                          }&status=${selectedStatus?.value}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="row cash_journal">
                  <div className="col-lg-12">
                    <>
                      <PaginationSearch
                        placeholder="Name or Code"
                        paginationSearchHandler={paginationSearchHandler}
                      />
                      <table className="table mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>Sl</th>
                            <th>KPI Name</th>
                            <th style={{ minWidth: "60px" }}>KPI Code</th>
                            <th style={{ minWidth: "90px" }}>
                              BSC Perspective
                            </th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.length > 0 &&
                            gridData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strKpiMasterName}</td>
                                <td>{item?.strKpiMasterCode}</td>
                                <td>{item?.strBscPerspectiveName}</td>
                                <td>
                                  <div className="d-flex justify-content-around">
                                    <span
                                      className="edit"
                                      onClick={() => {
                                        history.push({
                                          pathname: `/performance-management/configuration/kpiMasterData/edit`,
                                          state: { item },
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
                      {/* Pagination Code */}
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
                    </>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}
