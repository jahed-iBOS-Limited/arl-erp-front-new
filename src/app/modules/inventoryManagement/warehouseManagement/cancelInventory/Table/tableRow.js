/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getCancelInvGridData,
  getSBUDDL,
  getPlantDDL,
  getWarehouseDDL,
} from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import IView from "../../../../_helper/_helperIcons/_view";
import { setCancelInvPPRAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import customStyles from "../../../../selectCustomStyle";
import NewSelect from "../../../../_helper/_select";

const validationSchema = Yup.object().shape({});

export function TableRow(props) {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [plant, setPlant] = useState([]);
  const [warehouse, setWarehouse] = useState([]);

  const location = useLocation();
  const dispatch = useDispatch();

  //const dispatch = useDispatch();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);

  //Get Api Data
  useEffect(() => {
    getSBUDDL(profileData.accountId, selectedBusinessUnit.value, setSBUDDL);
    getPlantDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlant
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const cancelInventoryLanding = useSelector((state) => {
    return state.localStorage.cancelInvLanding;
  });

  useEffect(() => {
    if (cancelInventoryLanding) {
      getCancelInvGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize,
        cancelInventoryLanding?.sbu?.value || 0,
        cancelInventoryLanding?.plant?.value || 0,
        cancelInventoryLanding?.wh?.value || 0
      );
    }
  }, []);

  const viewGridData = (values) => {
    getCancelInvGridData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value
    );
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getCancelInvGridData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      cancelInventoryLanding?.sbu?.value || 0,
      cancelInventoryLanding?.plant?.value || 0,
      cancelInventoryLanding?.wh?.value || 0,
      searchValue
    );
  };

  const pushData = (values) => {
    history.push({
      pathname:
        "/inventory-management/warehouse-management/cancelInventory/add",
      state: values,
    });
    dispatch(setCancelInvPPRAction(values));
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  const warehouseDLLFind = (plantId) => {
    getWarehouseDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit.value,
      plantId,
      setWarehouse
    );
  };

  return (
    <>
      <ICustomCard title="Cancel Inventory Transaction">
        <>
          <Formik
            enableReinitialize={true}
            initialValues={{ ...cancelInventoryLanding }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
          >
            {({ errors, touched, setFieldValue, isValid, values }) => (
              <>
                <div
                  style={{ transform: "translateY(-40px)" }}
                  className="text-right"
                >
                  <button
                    onClick={() => {
                      pushData(values);
                    }}
                    disabled={!values?.plant || !values?.sbu || !values?.wh}
                    className="btn btn-primary ml-3"
                  >
                    Create
                  </button>
                </div>
                <Form
                  className="form form-label-left"
                  style={{ marginTop: -35 }}
                >
                  <div
                    className="row global-form"
                    style={{ background: " #d6dadd" }}
                  >
                    <div className="col-lg-3">
                      <NewSelect
                        name="sbu"
                        placeholder="Select SBU"
                        label="Select SBU"
                        value={values?.sbu}
                        onChange={(v) => {
                          setFieldValue("sbu", v);
                        }}
                        options={SBUDDL}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        placeholder="Select Plant"
                        value={values?.plant}
                        label="Select Plant"
                        //value={values?.plant}
                        onChange={(v) => {
                          setFieldValue("plant", v);
                          warehouseDLLFind(v.value);
                          setFieldValue("wh", "");
                        }}
                        styles={customStyles}
                        options={plant}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="wh"
                        placeholder="Select Warehouse"
                        label="Select Warehouse"
                        value={values?.wh}
                        onChange={(v) => {
                          setFieldValue("wh", v);
                        }}
                        styles={customStyles}
                        options={warehouse}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3" style={{ marginTop: 15 }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!values?.plant || !values?.sbu || !values?.wh}
                        onClick={(e) => {
                          viewGridData(values);
                          dispatch(setCancelInvPPRAction(values));
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Form>
                <div className="row">
                  <div className="col-lg-12">
                    {loading && <Loading />}
                    <PaginationSearch
                      placeholder="Request Code Search"
                      paginationSearchHandler={paginationSearchHandler}
                    />
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Transaction Code</th>
                            <th>Reference Type</th>
                            <th>Transaction Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.length > 0 &&
                            gridData?.data.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{ width: "30px" }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>
                                    <span className="pl-2">
                                      {item?.inventoryTransactionCode}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="pl-2">
                                      {item?.referenceTypeName}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="pl-2 text-center">
                                      {item.transactionTypeName}
                                    </span>
                                  </td>

                                  <td
                                    style={{ width: "80px" }}
                                    className="text-center"
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                      }}
                                    >
                                      <IView
                                        clickHandler={(e) =>
                                          history.push(
                                            `/inventory-management/warehouse-management/cancelInventory/view/${item?.inventoryTransactionId}`
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                  />
                )}
              </>
            )}
          </Formik>
        </>
      </ICustomCard>
    </>
  );
}
