/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CharteringContext } from "../../../charteringContext";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import IViewModal from "../../../_chartinghelper/_viewModal";
import { getChartererCPData, getCPLandingData } from "../helper";
import PrintView from "./printView";

export default function CPTable() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [state, setState] = useContext(CharteringContext);
  const [show, setShow] = useState(false);
  const [cpData, setCPData] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (values) => {
    getCPLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    getGridData(state?.cpClauseLandingInitData);
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={state?.cpClauseLandingInitData}
        onSubmit={() => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>CP Clause</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push("/chartering/report/cpClause/create")
                    }
                  >
                    Create +
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
                      placeholder="From Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        getGridData({ ...values, fromDate: e.target.value });
                      }}
                      // disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <FormikInput
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        getGridData({ ...values, toDate: e.target.value });
                      }}
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>
                </div>
              </div>

              <table className="table mt-3 bj-table bj-table-landing">
                <thead style={{ borderTop: "1px solid rgb(207, 203, 203)" }}>
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    <th>File Name</th>
                    <th style={{ width: "80px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{}}>{index + 1}</td>
                        <td>{item.docName}</td>
                        <td className="d-flex justify-content-center">
                          <span
                            className="mx-2"
                            onClick={() => {
                              setState({
                                ...state,
                                cpClauseLandingInitData: values,
                              });
                              history.push(
                                `/chartering/report/cpClause/edit/${item.docId}`
                              );
                            }}
                          >
                            <IEdit />
                          </span>

                          <span
                            className="mx-2"
                            onClick={() => {
                              getChartererCPData({
                                accId: profileData?.accountId,
                                buId: selectedBusinessUnit?.value,
                                reportType: 0,
                                docId: item?.docId,
                                setter: setCPData,
                                setLoading: setLoading,
                                cb: () => {
                                  setShow(true);
                                },
                              });
                              setState({
                                ...state,
                                cpClauseLandingInitData: values,
                              });
                            }}
                          >
                            <IView title="View & Print" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <IViewModal show={show} onHide={() => setShow(false)}>
                <PrintView data={cpData?.varDataFile} />
              </IViewModal>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
