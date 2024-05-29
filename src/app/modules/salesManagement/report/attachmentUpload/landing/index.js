/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import AttachmentUploadForm from "./entryModal";
import { getAttachmentUploads } from "../helper";
import NewSelect from "../../../../_helper/_select";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { toast } from "react-toastify";

const initData = { type: { value: 1, label: "BUET Test Report" } };

function AttachmentUpload() {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const getLandingData = (values, pageNo = 0, pageSize = 15) => {
    getAttachmentUploads(
      accId,
      buId,
      values?.type?.value,
      "",
      "",
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize);
  }, [accId, buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title="Attachment Upload"
        createHandler={() => {
          setShow(true);
        }}
      >
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.type}
                      name="type"
                      options={[
                        { value: 1, label: "BUET Test Report" },
                        { value: 2, label: "QC Report" },
                      ]}
                      onChange={(e) => {
                        setFieldValue("type", e);
                        getLandingData(
                          { ...values, type: e },
                          pageNo,
                          pageSize
                        );
                      }}
                      placeholder="Select One"
                      errors={errors}
                      touched={touched}
                      label="Type"
                    />
                  </div>
                </div>
                {gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Report Type</th>
                          {buId === 175 && values?.type?.value === 1 && (
                            <>
                              <th>Party Name</th>
                              <th>Casting Date</th>
                              <th>Test report Date</th>
                              <th>PSI</th>
                              <th>Delivery Qty</th>
                            </>
                          )}
                          <th style={{ width: "90px" }}>Attached File</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td> {td?.strTypeName} </td>
                            {buId === 175 && values?.type?.value === 1 && (
                              <>
                                <td> {td?.strBusinessPartnerName} </td>
                                <td> {_dateFormatter(td?.dteCastingDate)} </td>
                                <td>
                                  {" "}
                                  {_dateFormatter(td?.dteTestReportDate)}{" "}
                                </td>
                                <td> {td?.strItemName} </td>
                                <td className="text-right">
                                  {td?.numDeliveryQty}{" "}
                                </td>
                              </>
                            )}
                            <td className="text-center">
                              <ICon
                                title={
                                  td?.strAttatchment
                                    ? "View Attached File"
                                    : "No File Attached!"
                                }
                                onClick={() => {
                                  if (td?.strAttatchment) {
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        td?.strAttatchment
                                      )
                                    );
                                  } else {
                                    toast.warn("No File Attached!");
                                  }
                                }}
                              >
                                {td?.strAttachmentTypeName === "img" ? (
                                  <i class="far fa-file-image"></i>
                                ) : td?.strAttachmentTypeName === "pdf" ? (
                                  <i class="far fa-file-pdf"></i>
                                ) : (
                                  <i class="far fa-file-exclamation"></i>
                                )}
                              </ICon>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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
              </Form>
              <IViewModal show={show} onHide={() => setShow(false)}>
                <AttachmentUploadForm
                  value={values}
                  setShow={setShow}
                  getLandingData={getLandingData}
                />
              </IViewModal>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default AttachmentUpload;
