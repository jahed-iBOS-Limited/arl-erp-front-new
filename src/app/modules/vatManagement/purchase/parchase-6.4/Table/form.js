import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getVatBranches, CancelPurchaseEntry_Api } from "../helper";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IView from "./../../../../_helper/_helperIcons/_view";
import PaginationTable from "./../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import ViewPurchase from "../view/addEditForm";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import PaginationSearch from "./../../../../_helper/_search";
export function SearchForm({
  onSubmit,
  setTaxBranchDDL,
  taxBranchDDL,
  loading,
  setLoading,
  gridData,
  setPositionHandler,
  paginationState,
  paginationSearchHandler,
}) {
  const history = useHistory();
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  const [modelShow, setModelShow] = useState(false);
  const [viewClick, setViewClick] = useState({});
  const [singleData, setSingleData] = useState("");
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      purchaseLanding: state.localStorage.purchaseLanding,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, purchaseLanding } = storeData;

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getVatBranches(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const confirmToCancel = (taxPurchaseId, handleSubmit) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you cancel this, it can not be undone",
      yesAlertFunc: async () => {
        CancelPurchaseEntry_Api(taxPurchaseId, setLoading, () => {
          handleSubmit();
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...purchaseLanding,
          taxBranch: purchaseLanding?.taxBranch
            ? purchaseLanding?.taxBranch
            : taxBranchDDL[0],
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values);
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <Form>
            <div
              className="text-right"
              style={{
                paddingBottom: "19px",
                marginTop: "-41px",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!values?.taxBranch}
                onClick={() =>
                  history.push({
                    pathname: "/mngVat/purchase/6.4/create",
                    state: { taxBranch: values.taxBranch },
                  })
                }
              >
                Create
              </button>
            </div>
            <div className="row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="taxBranch"
                  options={taxBranchDDL}
                  value={values?.taxBranch}
                  label="Select Branch"
                  onChange={(valueOption) => {
                    setFieldValue("taxBranch", valueOption);
                  }}
                  placeholder=" Branch"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.fromDate}
                  label="From Date"
                  type="date"
                  name="fromDate"
                  placeholder="From Date"
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.toDate}
                  label="To Date"
                  type="date"
                  name="toDate"
                  placeholder="To Date"
                />
              </div>

              <div className="col-lg-3">
                <button
                  type="submit"
                  class="btn btn-primary"
                  style={{ marginTop: "16px" }}
                  // ref={btnRef}
                  onSubmit={() => handleSubmit()}
                >
                  View
                </button>
              </div>
            </div>
            <PaginationSearch
              placeholder="Search Purchase Inv No"
              paginationSearchHandler={paginationSearchHandler}
              values={values}
            />
            {/* Table Start */}
            <div className="row">
              {loading && <Loading />}
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Trade Type</th>
                        <th>Purchase Inv No</th>
                        <th>Purchase Date</th>
                        <th>Partner Name</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Refference No</th>
                        <th style={{ width: "230px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td> {item?.tradeTypeName}</td>
                          <td> {item?.taxPurchaseCode}</td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item.purchaseDateTime)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item.supplierName}</div>
                          </td>
                          <td>
                            <div className="text-center">
                              {Number(item?.quantity?.toFixed(3))}
                            </div>
                          </td>

                          <td className="text-right">
                            <div className="pr-2">
                              {Number(item.amount.toFixed(2))}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">
                              <div className="pl-2">{item.referanceNo}</div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span className="view">
                                <IView
                                  clickHandler={() => {
                                    setViewClick(item);
                                    setModelShow(true);
                                  }}
                                />
                              </span>
                              {/* <span
                                className="edit"
                                onClick={() => {
                                  history.push(
                                    `/mngVat/purchase/6.4/edit/${item.taxPurchaseId}`
                                  );
                                }}
                              >
                                <IEdit />
                              </span> */}
                              {[171, 224].includes(selectedBusinessUnit?.value) ? (
                                <></>
                              ) : (
                                <span>
                                  <button
                                    className="btn btn-outline-dark mr-1 pointer"
                                    type="button"
                                    onClick={() => {
                                      confirmToCancel(
                                        item.taxPurchaseId,
                                        handleSubmit
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
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
            </div>
            <IViewModal
              show={modelShow}
              onHide={() => {
                setModelShow(false);
                setSingleData("");
              }}
              title={"View Purchase (6.4)"}
              btnText="Close"
            >
              <ViewPurchase
                viewClick={viewClick}
                singleData={singleData}
                setSingleData={setSingleData}
              />
            </IViewModal>
          </Form>
        )}
      </Formik>
    </>
  );
}
