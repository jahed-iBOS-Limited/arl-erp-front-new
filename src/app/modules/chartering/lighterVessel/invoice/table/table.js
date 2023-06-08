/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { useHistory } from "react-router-dom";
import { getInvoiceById, getInvoiceList } from "../helper";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { Formik } from "formik";
import PaginationSearch from "../../../_chartinghelper/_search";
import IView from "../../../_chartinghelper/icons/_view";
import IViewModal from "../../../_chartinghelper/_viewModal";
import InvoicePrintView from "../Form/printView";

const headers = [
  { name: "SL" },
  { name: "Bill No" },
  { name: "Survey No" },
  { name: "LC Number" },
  { name: "Total Amount" },
  { name: "JV Code" },
  { name: "Actions" },
];

const initData = {
  fromDate: "",
  toDate: "",
};

export default function InvoiceTable() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const viewHandler = (pageNo, pageSize, values, search) => {
    getInvoiceList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      search,
      pageNo,
      pageSize,
      values?.fromDate || "",
      values?.toDate || "",
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    viewHandler(pageNo, pageSize, initData, "");
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchTerm = "") => {
    viewHandler(pageNo, pageSize, values, searchTerm);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      {" "}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Invoice</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() => {
                      history.push(
                        "/chartering/lighterVessel/lighterInvoice/create"
                      );
                    }}
                    disabled={false}
                  >
                    + Create
                  </button>
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <FormikInput
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <FormikInput
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mt-5">
                    <button
                      className="btn btn-primary px-3 py-2"
                      type="button"
                      onClick={() => {
                        viewHandler(pageNo, pageSize, values);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <PaginationSearch
                    placeholder="Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
              </div>
              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center" style={{ width: "40px" }}>
                      {index + 1}
                    </td>
                    <td>{item?.billNo}</td>
                    <td>{item?.surveyNo}</td>
                    <td>{item?.lcnumber}</td>
                    <td>{item?.numTotalAmount}</td>
                    <td>{item?.journalCode}</td>
                    <td className="text-center">
                      <IView
                        clickHandler={() => {
                          getInvoiceById(
                            item?.invoiceId,
                            setSingleData,
                            setLoading,
                            () => {
                              setShow(true);
                            }
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </ICustomTable>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </form>
            <IViewModal show={show} onHide={() => setShow(false)}>
              <InvoicePrintView singleData={singleData} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
