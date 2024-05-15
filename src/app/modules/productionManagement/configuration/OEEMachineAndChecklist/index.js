import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import { shallowEqual, useSelector } from "react-redux";
import IView from "../../../_helper/_helperIcons/_view";

const initData = {};
export default function OEEMachineAndChecklistLanding() {
  const history = useHistory();
  const saveHandler = (values, cb) => {};
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [tabledata, getTableData, tableDataLoader] = useAxiosGet();
  // const history = useHistory();

  // get selected business unit from store
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue = "") => {
    getTableData(
      `/asset/AssetMaintanance/GetAssetHealthCheckLanding?businessUnitId=${selectedBusinessUnit?.value}&search=${searchValue}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  useEffect(() => {
    getTableData(
      `/asset/AssetMaintanance/GetAssetHealthCheckLanding?businessUnitId=${selectedBusinessUnit?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
            title="OEE Machine And Checklist"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {/* <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/production-management/configuration/OEEMachineNChecklist/create"
                      );
                    }}
                  >
                    Create
                  </button> */}
                </div>
              );
            }}
          >
            <Form>
              <div className="mt-2">
                <PaginationSearch
                  placeholder="OEE Machine Search"
                  paginationSearchHandler={paginationSearchHandler}
                />
              </div>
              <div className="mt-2">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Plant Name</th>
                        <th>Shop floor Name</th>
                        <th>Machine Name</th>
                        <th>Sub Machine Name</th>
                        <th>Schedule Type</th>
                        <th>Helth Check Person Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabledata?.data?.length > 0
                        ? tabledata?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strPlantname}</td>
                              <td>{item?.strShopfloorName}</td>
                              <td>{item?.strMachineName}</td>
                              <td>{item?.strSubMachineName}</td>
                              <td>{item?.strScheduleTypee}</td>
                              <td>{item?.strHelthCheckPersonName}</td>
                              <td className="text-center">
                                <div className="d-flex justify-content-around">
                                  <span className="mx-1">
                                    <IView
                                      clickHandler={(e) => {
                                        history.push(
                                          `/production-management/configuration/OEEMachineNChecklist/view/${item?.intAssetHealthCheckId}`,
                                          { landingData: item }
                                        );
                                      }}
                                    />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
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
                    rowsPerPageOptions={[25, 50, 100, 200, 400, 600]}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
