/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import {
  CancelProductionEntry_api,
  GetProdutionPagination,
  getTaxBranchDDL_api,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useDispatch } from "react-redux";
import { setTaxProductionLanding_Action } from "./../../../../_helper/reduxForLocalStorage/Actions";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import IViewModal from "./../../../../_helper/_viewModal";
import ProductionForm from "./../Form/addEditForm";
import IView from "./../../../../_helper/_helperIcons/_view";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

export function TableRow({ setformData }) {
  const [showModal, setShowModal] = useState(false);
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [rowClickData, setRowClickData] = useState("");
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // const [branchId, setBranchId] = React.useState('')

  const [taxbranchDDL, setTaxBranchDDL] = useState([]);
  const taxProductionLanding = useSelector(
    (state) => state.localStorage.taxProductionLanding
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getTaxBranchDDL_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    GetProdutionPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.formDate,
      values?.toDate,
      values?.taxBranch?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };

  useEffect(() => {
    if (taxProductionLanding) {
      GetProdutionPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        taxProductionLanding?.formDate,
        taxProductionLanding?.toDate,
        taxProductionLanding?.taxBranch?.value || taxbranchDDL[0]?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
  }, [taxProductionLanding, taxbranchDDL]);

  const confirmToCancel = (taxPurchaseId, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you cancel this, it can not be undone",
      yesAlertFunc: async () => {
        CancelProductionEntry_api(taxPurchaseId, setLoading, () => {
          GetProdutionPagination(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            values?.formDate,
            values?.toDate,
            values?.taxBranch?.value,
            setGridData,
            setLoading,
            pageNo,
            pageSize
          );
        });
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          taxProductionLanding?.taxBranch
            ? {
                ...taxProductionLanding,
              }
            : {
                ...taxProductionLanding,
                taxBranch: taxbranchDDL[0] || "",
              }
        }
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Production"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: "/mngVat/inventory/production/add",
                        state: values,
                      });
                    }}
                    disabled={!values?.taxBranch}
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
                        label="Tax Branch Name"
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
                          GetProdutionPagination(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.formDate,
                            values?.toDate,
                            values?.taxBranch?.value,
                            setGridData,
                            setLoading,
                            pageNo,
                            pageSize
                          );
                          dispatch(setTaxProductionLanding_Action(values));
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
                  <div className="row global-table">
                    {loading && <Loading />}

                    <PaginationSearch
                      placeholder="Tax Branch Name Search"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                    <table className="table table-striped table-bordered mt-3">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "25px" }}>SL</th>
                          <th style={{ minWidth: "50px" }}>Tax Branch Name</th>
                          <th style={{ minWidth: "50px" }}>
                            Tax Branch Address
                          </th>
                          <th style={{ minWidth: "50px" }}>Referance No</th>
                          <th style={{ minWidth: "50px" }}>Referance Date</th>
                          <th style={{ minWidth: "50px" }}>Quantity</th>
                          <th style={{ minWidth: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.length > 0 &&
                          gridData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.sl}</td>
                              <td>
                                <div className="pl-2">
                                  {item?.taxBranchName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.taxBranchAddress}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{item?.referanceNo}</div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {_dateFormatter(item?.referanceDate)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {Number(item?.quantity.toFixed(3))}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-around">
                                  <span
                                    className="edit"
                                    onClick={() => {
                                      history.push(
                                        `/mngVat/inventory/production/edit/${item.taxPurchaseId}`
                                      );
                                    }}
                                  >
                                    <IEdit />
                                  </span>

                                  <span className="view">
                                    <IView
                                      clickHandler={() => {
                                        setRowClickData({
                                          ...item,
                                          isView: true,
                                        });
                                        setShowModal(true);
                                      }}
                                    />
                                  </span>

                                  <span>
                                    <button
                                      className="btn btn-outline-dark mr-1 pointer"
                                      type="button"
                                      onClick={() => {
                                        confirmToCancel(
                                          item.taxPurchaseId,
                                          values
                                        );
                                      }}
                                      style={{
                                        padding: "1px 5px",
                                        width: "100px",
                                      }}
                                    >
                                      Cancel
                                    </button>
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
            <IViewModal
              show={showModal}
              onHide={() => setShowModal(false)}
              children={<ProductionForm viewClick={rowClickData} />}
            />
          </>
        )}
      </Formik>
    </>
  );
}
