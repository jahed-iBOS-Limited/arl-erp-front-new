import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { getVatBranches, getPartnerDDL } from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import ReportBody from "./reportBody";
import ReportBodyOther from "./reportBodyOther";
import ReportBodyGenerate from "./reportBodyGenerate";

const initData = {
  taxBranch: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  partner: "",
  viewType: "",
  radio: "unGenerate",
};

export function SearchForm({
  onSubmit,
  setTaxBranchDDL,
  taxBranchDDL,
  loading,
  gridData,
  setPositionHandler,
  paginationState,
  setGridData,
  setGridDataOthers,
}) {
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  const [viewClick, setViewClick] = useState({});
  const [modalShow, setModalShow] = useState(false); // This modal for single View
  const [modalShowOther, setModalShowOther] = useState(false);
  const [generateModalShow, setGenerateModalShow] = useState(false);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const [partnerDDL, setPartnerDDL] = useState([]);
  const viewTypeDDL = [
    // { value: 0, label: "All Partner" },
    { value: 1, label: "Single Partner" },
    { value: 2, label: "Single Challan" },
  ];

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
      getPartnerDDL(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setPartnerDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          taxBranch: taxBranchDDL[0],
          viewType: {
            value: 2,
            label: "Single Challan",
          },
          partner: {
            value: partnerDDL[0]?.value,
            label: partnerDDL[0]?.label,
          },
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values, setModalShowOther);
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
              {values?.radio === "unGenerate" && (
                <>
                  {" "}
                  <div className="col-lg-3">
                    <NewSelect
                      name="viewType"
                      options={viewTypeDDL}
                      value={values?.viewType}
                      label="Select Type"
                      onChange={(valueOption) => {
                        setFieldValue("viewType", valueOption);
                        setGridData({});
                        setGridDataOthers({});
                      }}
                      isDisabled={values?.radio === "generate"}
                      placeholder="Select Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </>
              )}

              {/* When Single User Called in View Type */}
              {values?.viewType?.value === 1 && (
                <div className="col-lg-3">
                  <NewSelect
                    name="partner"
                    options={partnerDDL}
                    value={values?.partner}
                    label="Select Customer"
                    onChange={(valueOption) => {
                      setFieldValue("partner", valueOption);
                    }}
                    placeholder="Select Customer"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              )}
              <div className="col-lg-3 d-flex align-items-center mt-4">
                <input
                  value={values?.radio}
                  type="radio"
                  name="radio"
                  checked={values?.radio === "generate"}
                  onChange={() => {
                    setFieldValue("radio", "generate");
                    setFieldValue("viewType", {
                      value: 2,
                      label: "Single Challan",
                    });
                    setGridData({});
                    setGridDataOthers({});
                  }}
                  id="generate"
                />
                <label className="pr-3 pl-1" for="generate">
                  Genarated
                </label>
                <input
                  value={values?.radio}
                  checked={values?.radio === "unGenerate"}
                  onChange={() => {
                    setFieldValue("radio", "unGenerate");
                    setFieldValue("viewType", {
                      value: 2,
                      label: "Single Challan",
                    });
                    setGridData({});
                    setGridDataOthers({});
                  }}
                  type="radio"
                  name="radio"
                  id="unGenerate"
                />
                <label className="pr-3 pl-1" for="unGenerate">
                  Draft
                </label>
              </div>
              <div className="col-lg-3">
                <button
                  disabled={
                    !values?.fromDate ||
                    !values?.toDate ||
                    !values?.taxBranch ||
                    (values?.radio === "unGenerate" ? !values?.viewType : false)
                  }
                  type="submit"
                  class="btn btn-primary"
                  style={{ marginTop: "16px" }}
                  onSubmit={() => handleSubmit()}
                >
                  View
                </button>
              </div>
            </div>

            {/* Generate Table Data */}
            {values?.radio === "generate" && (
              <div className="row cash_journal">
                {loading && <Loading />}
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Purchase Code</th>
                        <th>Date of issue</th>
                        <th>Certificate No</th>
                        <th>Chalan No</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td>
                            <div className="pl-2">{item?.taxPurchaseCode}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {_dateFormatter(item?.date)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.certificateNo}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.challanNo}</div>
                          </td>

                          <td>
                            <div className="d-flex justify-content-around">
                              <span className="view">
                                <IView
                                  clickHandler={() => {
                                    setViewClick(item);
                                    setGenerateModalShow(true);
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
            )}

            {/* UnGenerate Table Data */}
            {values?.radio === "unGenerate" && (
              <div className="row cash_journal">
                {loading && <Loading />}
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Purchase Code</th>
                        <th>Purchase Date</th>
                        <th>Partner Name</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Chalan No</th>
                        <th>Refference No</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td>
                            <div className="pl-2">{item?.taxPurchaseCode}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {_dateFormatter(item?.purchaseDateTime)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.supplierName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.quantity}</div>
                          </td>

                          <td>
                            <div className="pl-2">{item?.amount}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              <div className="pl-2">{item?.chalanNo66}</div>
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">
                              <div className="pl-2">{item?.referanceNo}</div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span className="view">
                                <IView
                                  clickHandler={() => {
                                    setViewClick(item);
                                    setModalShow(true);
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
            )}

            {/*unGenerate Single View modal */}
            <IViewModal
              show={modalShow}
              onHide={() => {
                setModalShow(false);
                onSubmit(values, setModalShowOther);
              }}
              title={"6.6"}
              btnText="Close"
            >
              <ReportBody viewClick={viewClick} />
            </IViewModal>
            {/* Single View modal end */}

            {/* Modal For Get Generate Value Data */}
            <IViewModal
              show={generateModalShow}
              onHide={() => {
                setGenerateModalShow(false);
              }}
              title={"6.6"}
              btnText="Close"
            >
              <ReportBodyGenerate viewClick={viewClick} />
            </IViewModal>

            {/*Single Partner unGenerate*/}
            <IViewModal
              show={modalShowOther}
              onHide={() => {
                setModalShowOther(false);
              }}
              title={"6.6"}
              btnText="Close"
            >
              <ReportBodyOther
                values={values}
                setModalShowOther={setModalShowOther}
              />
            </IViewModal>
          </Form>
        )}
      </Formik>
    </>
  );
}
