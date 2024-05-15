import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../_helper/_tablePagination";
import IEdit from "../../../_helper/_helperIcons/_edit";
const initData = {};
export default function RevenueElement() {
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  const [tabledata, getTableData, tableDataLoader] = useAxiosGet();
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const setPositionHandler = (pageNo, pageSize) => {
    getTableData(
      `/costmgmt/Revenue/GetRevenueElementLandingPaging?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&status=true&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
  };
  useEffect(() => {
    getTableData(
      `/costmgmt/Revenue/GetRevenueElementLandingPaging?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&status=true&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Revenue Element"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/internal-control/revenuecenter/revenue-element/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Element Name</th>
                          <th>Code</th>
                          <th>General Ledger</th>
                          <th>Controlling Unit</th>
                          <th>Allocation Based</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabledata?.data?.length > 0
                          ? tabledata?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.revenueElementName}</td>
                                <td>{item?.revenueElementCode}</td>
                                <td>{item?.generalLedgerName}</td>
                                <td>{item?.controllingUnitName}</td>
                                <td>
                                  {item?.isAllocationBased ? "Yes" : "No"}
                                </td>

                                <td className="text-center">
                                  <IEdit
                                    title="Edit"
                                    onClick={() =>
                                      history.push(
                                        `/internal-control/revenuecenter/revenue-element/edit/${item?.revenueElementId}`
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </table>
                  </div>

                  {tabledata?.data?.length > 0 && (
                    <PaginationTable
                      count={tabledata?.totalCount}
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
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
