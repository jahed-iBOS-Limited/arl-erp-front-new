/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import {
  getItemRequestGridData,
  getSBUDDL,
  getPlantDDL,
  getWarehouseDDL,
} from "../helper";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import NewSelect from "../../../../_helper/_select";
import IView from "../../../../_helper/_helperIcons/_view";
import { setItemRequestPPRAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import IClose from "../../../../_helper/_helperIcons/_close";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import { postItemReqCancelAction } from "../helper";
import IViewModal from "../../../../_helper/_viewModal";
import { ItemReqViewTableRow } from "../report/tableRow";

const statusData = [
  { label: "Approved", value: true },
  { label: "Pending", value: false },
];
const validationSchema = Yup.object().shape({});

export function TableRow(props) {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const dispatch = useDispatch();

  //const dispatch = useDispatch();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const { profileData, selectedBusinessUnit, userRole } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  const [gridData, setGridData] = useState([]);

  //From DDL State
  const [SBUDDL, setSBUDDL] = useState([]);
  const [plant, setPlant] = useState([]);
  const [warehouse, setWarehouse] = useState([]);

  const itemRequestPublic = userRole.filter(
    (item) => item?.intFeatureId === 1242
  );

  useEffect(() => {
    getSBUDDL(profileData.accountId, selectedBusinessUnit.value, setSBUDDL);
    getPlantDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlant
    );
  }, [profileData, selectedBusinessUnit]);

  const warehouseDLLFind = (plantId) => {
    getWarehouseDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit.value,
      plantId,
      setWarehouse
    );
  };

  const itemRequestLanding = useSelector((state) => {
    return state.localStorage.itemRequestLanding;
  });

  const itemTableIndex = useSelector((state) => {
    return state.localStorage.tableItemIndex;
  });

  const viewGridData = (values) => {
    getItemRequestGridData(
      profileData.accountId,
      selectedBusinessUnit.value,
      profileData?.userId,
      setGridData,
      setLoading,
      setTotalCount,
      pageNo,
      pageSize,
      values?.privacyType,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.status?.value,
      values?.fromDate,
      values?.toDate
    );
  };

  useEffect(() => {
    cb();
  }, []);

  let cb = () => {
    if (itemRequestLanding) {
      if (profileData.accountId && selectedBusinessUnit.value) {
        getItemRequestGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          profileData?.userId,
          setGridData,
          setLoading,
          setTotalCount,
          pageNo,
          pageSize,
          itemRequestLanding?.privacyType,
          itemRequestLanding?.sbu?.value,
          itemRequestLanding?.plant?.value,
          itemRequestLanding?.wh?.value,
          itemRequestLanding?.status?.value,
          itemRequestLanding?.fromDate,
          itemRequestLanding?.toDate
        );
      }
    } else {
      if (profileData.accountId && selectedBusinessUnit.value) {
        getItemRequestGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          profileData?.userId,
          setGridData,
          setLoading,
          setTotalCount,
          pageNo,
          pageSize,
          itemRequestPublic[0]?.isView ? 2 : 1
        );
      }
    }
  };

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    if (itemRequestLanding) {
      getItemRequestGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        profileData?.userId,
        setGridData,
        setLoading,
        setTotalCount,
        pageNo,
        pageSize,
        itemRequestLanding?.privacyType,
        itemRequestLanding?.sbu?.value,
        itemRequestLanding?.plant?.value,
        itemRequestLanding?.wh?.value,
        itemRequestLanding?.status?.value,
        itemRequestLanding?.fromDate,
        itemRequestLanding?.toDate,
        searchValue
      );
    } else {
      getItemRequestGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        profileData?.userId,
        setGridData,
        setLoading,
        setTotalCount,
        pageNo,
        pageSize,
        1,
        0,
        0,
        0,
        undefined,
        "",
        "",
        searchValue
      );
    }
  };

  const pushData = (values) => {
    history.push({
      pathname: "/inventory-management/warehouse-management/item-request/add",
      state: values,
    });
    dispatch(setItemRequestPPRAction(values));
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (Ired) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to inactive this item req`,
      yesAlertFunc: () => {
        postItemReqCancelAction(Ired).then(() => cb());
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");

  return (
    <>
      <ICustomCard title="Item Request">
        <>
          <Formik
            enableReinitialize={true}
            initialValues={{ ...itemRequestLanding }}
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
                    disabled={!values?.sbu || !values?.wh || !values?.plant}
                    onClick={() => {
                      pushData(values);
                    }}
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
                    <div className="col-lg-12">
                      <div className="mt-5">
                        {itemRequestPublic[0]?.isView === true ? (
                          <label>
                            <input
                              type="radio"
                              name="privacyType"
                              checked={values?.privacyType === 2}
                              className="mr-1 pointer"
                              style={{ position: "relative", top: "2px" }}
                              onChange={(e) => {
                                setFieldValue("privacyType", 2);
                                dispatch(setItemRequestPPRAction(values));
                                setPageNo(0);
                                setPageSize(20);
                              }}
                            />
                            Public
                          </label>
                        ) : (
                          ""
                        )}
                        <label className="ml-3">
                          <input
                            type="radio"
                            name="privacyType"
                            checked={values?.privacyType === 1}
                            className="mr-1 pointer"
                            style={{ position: "relative", top: "2px" }}
                            onChange={(valueOption) => {
                              setFieldValue("privacyType", 1);
                              dispatch(setItemRequestPPRAction(values));
                              setPageNo(0);
                              setPageSize(20);
                            }}
                          />
                          Private
                        </label>
                      </div>
                    </div>
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
                          if (v) {
                            setFieldValue("plant", v);
                            warehouseDLLFind(v.value);
                            setFieldValue("wh", "");
                          } else {
                            setFieldValue("plant", v);
                            // warehouseDLLFind(v.value);
                            setFieldValue("wh", "");
                          }
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
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        options={statusData || []}
                        value={values?.status}
                        label="Status"
                        onChange={(v) => {
                          setFieldValue("status", v);
                        }}
                        placeholder="Status"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <div className="flex-fill">
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From date"
                          type="date"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <div className="flex-fill">
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To date"
                          type="date"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3" style={{ marginTop: 20 }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => {
                          viewGridData(values);
                          dispatch(setItemRequestPPRAction(values));
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
                            <th>Request Code</th>
                            <th>Request Date</th>
                            <th>Approval Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.length > 0 &&
                            gridData?.map((item, index) => {
                              return (
                                <tr key={item?.sl}>
                                  <td
                                    style={{ width: "30px" }}
                                    className="text-center"
                                  >
                                    {item?.sl}
                                  </td>
                                  <td>
                                    <span className="pl-2">
                                      {item?.itemRequestCode}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="pl-2">
                                      {item?.requestDate}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="pl-2 text-center">
                                      {item.strApproved}
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
                                      {item.strApproved !== "Approved" &&
                                        !itemRequestPublic[0]?.isView && (
                                          <>
                                            <span
                                              className="edit"
                                              onClick={(e) =>
                                                history.push(
                                                  `/inventory-management/warehouse-management/item-request/edit/${item?.itemRequestId}`
                                                )
                                              }
                                            >
                                              <IEdit />
                                            </span>
                                            <span className="">
                                              <IClose
                                                title="In Active"
                                                closer={() =>
                                                  approveSubmitlHandler(
                                                    item?.itemRequestId
                                                  )
                                                }
                                              />
                                            </span>
                                          </>
                                        )}

                                      <IView
                                        classes={
                                          itemTableIndex === item?.itemRequestId
                                            ? "text-primary"
                                            : ""
                                        }
                                        clickHandler={(e) => {
                                          setCurrentRowData(item);
                                          setIsShowModal(true);
                                        }}
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
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                >
                  <ItemReqViewTableRow IrId={currentRowData?.itemRequestId} />
                </IViewModal>
                {gridData?.length > 0 && (
                  <PaginationTable
                    count={totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    rowsPerPageOptions={[
                      5,
                      10,
                      20,
                      50,
                      100,
                      200,
                      300,
                      400,
                      500,
                    ]}
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
