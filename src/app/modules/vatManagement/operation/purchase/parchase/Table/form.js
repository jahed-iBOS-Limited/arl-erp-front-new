import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { getVatBranches } from "../helper";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { shallowEqual } from "react-redux";
import PurchaseView from "../view/addEditForm";
import NewSelect from "./../../../../../_helper/_select";
import InputField from "./../../../../../_helper/_inputField";
import Loading from "./../../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import IView from "./../../../../../_helper/_helperIcons/_view";
import PaginationTable from "./../../../../../_helper/_tablePagination";
import IViewModal from "./../../../../../_helper/_viewModal";
import { getDownlloadFileView_Action } from "./../../../../../_helper/_redux/Actions";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
export function SearchForm({
  onSubmit,
  setTaxBranchDDL,
  taxBranchDDL,
  loading,
  gridData,
  setPositionHandler,
  paginationState,
}) {
  const history = useHistory();
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  const [modelShow, setModelShow] = useState(false);
  const [viewClick, setViewClick] = useState({});
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      purchaseLanding: state.localStorage.purchaseLanding,
    };
  }, shallowEqual);

  const dispatch = useDispatch();

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
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

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
                paddingBottom: "10px",
                marginTop: "-41px",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() =>
                  history.push({
                    pathname: "/operation/purchase/purchase/create",
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
            {/* Table Start */}
            <div className="row">
              {loading && <Loading />}
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Purchase Inv No</th>
                        <th>Trade Type</th>
                        <th>Purchase Date</th>
                        <th>Partner Name</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Refference No</th>
                        <th style={{ width: "90px" }}>Attachment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td> {item?.taxPurchaseCode}</td>
                          <td> {item?.tradeTypeName}</td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item.purchaseDateTime)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item.supplierName}</div>
                          </td>
                          <td>
                            <div className="text-center">{item.quantity}</div>
                          </td>

                          <td className="text-right">
                            <div className="pr-2">{_fixedPoint(item.amount, true, 0)}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              <div className="pl-2">{item.referanceNo}</div>
                            </div>
                          </td>
                          <td>
                            {item?.fileName && (
                              <div className="text-center pl-2">
                                <button
                                  className="btn btn-primary"
                                  type="button"
                                  dispatch={!item?.fileName}
                                  style={{
                                    backgroundColor: "#b5b5c3",
                                    borderColor: "#b5b5c3",
                                  }}
                                  onClick={() => {
                                    if (item?.fileName) {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          item?.fileName
                                        )
                                      );
                                    }
                                  }}
                                >
                                  View
                                </button>
                              </div>
                            )}
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
                                    `/operation/purchase/purchase/edit/${item.taxPurchaseId}`
                                  );
                                }}
                              >
                                <IEdit />
                              </span> */}
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
              }}
              title={"View Purchase"}
              btnText="Close"
            >
              <PurchaseView viewClick={viewClick} />
            </IViewModal>
          </Form>
        )}
      </Formik>
    </>
  );
}
