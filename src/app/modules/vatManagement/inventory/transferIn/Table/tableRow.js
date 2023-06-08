import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getItemTransferInPagination,
  getTaxBranchDDL,
  getTaxItemTypeDDL,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import IViewModal from "../../../../_helper/_viewModal";
import ItemTransferInViewForm from "../view/addForm";
import { _todayDate } from "./../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import { Formik, Form } from "formik";
export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // tax branch ddl
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  // const [selectedTaxBranchDDL, setSelectedTaxBranchDDL] = useState("");
  // const [fromDate, setFromDate] = useState(_todayDate());
  // const [toDate, setToDate] = useState(_todayDate());

  // item type ddl
  const [itemType, setItemType] = useState([]);
  // const [selectedItemType, setSelectedItemType] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getTaxBranchDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
      getTaxItemTypeDDL(setItemType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const commonGridDataFunc = (
    values,
    _pageNo = pageNo,
    _pageSize = pageSize,
    searchValue
  ) => {
    getItemTransferInPagination(
      values?.itemType?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.branch?.value,
      setGridData,
      setLoading,
      _pageNo,
      _pageSize,
      searchValue,
      values?.fromDate,
      values?.toDate
    );
  };
  useEffect(() => {
    if (taxBranchDDL?.[0]?.value && itemType?.[0]?.value) {
      commonGridDataFunc({
        itemType: itemType[0],
        branch: taxBranchDDL[0],
        fromDate: _todayDate(),
        toDate: _todayDate(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxBranchDDL, itemType]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGridDataFunc(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (searchValue, values) => {
    commonGridDataFunc(values, null, null, searchValue);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          branch: taxBranchDDL?.[0] || "",
          itemType: itemType?.[0] || "",
          fromDate: _todayDate(),
          toDate: _todayDate(),
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <ICustomCard
            title="Item Transfer-In"
            renderProps={() => (
              <button
                className="btn btn-primary"
                disabled={!values?.branch}
                onClick={() => {
                  history.push({
                    pathname: "/mngVat/inventory/transferin/create",
                    state: {
                      selectedItemType: values?.itemType,
                      selectedTaxBranchDDL: values?.branch,
                    },
                  });
                }}
              >
                Create new
              </button>
            )}
          >
            <Form className="form form-label-right">
              <div className="row global-form ">
                <div className="col-lg-3">
                  <label>Tax Branch Name</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("branch", valueOption);
                    }}
                    value={values?.branch || ""}
                    options={taxBranchDDL || []}
                    isSearchable={true}
                    styles={customStyles}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Type</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                    }}
                    value={values?.itemType || ""}
                    options={itemType || []}
                    isSearchable={true}
                    styles={customStyles}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate || ""}
                    name="fromDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col d-flex  justify-content-end mt-5">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      commonGridDataFunc(values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              {/* Table Start */}
              <div className="row cash_journal">
                {loading && <Loading />}
                <div className="col-lg-12">
                  <PaginationSearch
                    placeholder="Tax Purchase Code Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Tax Purchase Code</th>
                        <th>Purchase Date</th>
                        <th>Tax Branch Name</th>
                        <th>Transaction Type</th>
                        <th>Vehicle No.</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td> {item?.taxPurchaseCode}</td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item?.purchaseDateTime)}
                            </div>
                          </td>
                          <td>
                            {" "}
                            <div className="pl-2">
                              {item?.taxBranchName}
                            </div>{" "}
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.taxTransactionTypeName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.vehicleNo}</div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span className="view">
                                <IView
                                  clickHandler={() => {
                                    setShowModal(true);
                                    setId(item?.taxPurchaseId);
                                  }}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <IViewModal show={showModal} onHide={() => setShowModal(false)}>
                  <ItemTransferInViewForm
                    id={id}
                    location={{
                      selectedItemType: values?.itemType,
                      selectedTaxBranchDDL: values?.branch,
                    }}
                  />
                </IViewModal>

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
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
