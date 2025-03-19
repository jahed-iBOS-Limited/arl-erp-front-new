import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getComplainByIdWidthOutModify } from "../../resolution/helper";
export const validationSchema = Yup.object().shape({});

function InvoiceView({ clickRowData }) {
  const [singleData, setSingleData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {};

  useEffect(() => {
    if (clickRowData?.complainId) {
      const id = clickRowData?.complainId;
      getComplainByIdWidthOutModify(id, accId, buId, setLoading, (resData) => {
        setSingleData(resData);
        setRowDto(resData?.investigationInfo || []);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          investigationDate: _todayDate(),
          investigationPerson: "",
          rootCause: "",
          correctiveAction: "",
        }}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
        }) => (
          <>
            {loading && <Loading />}
            <div className="d-flex justify-content-between pt-4 pb-2 pr-5 mb-2 border-bottom">
              <h4>Feedback Details</h4>
              <h6>
                Status:{" "}
                <span
                  style={{
                    fontSize: "14px",
                    color:
                      clickRowData?.status === "Open"
                        ? "red"
                        : clickRowData?.status === "Delegate"
                        ? "blue"
                        : clickRowData?.status === "Investigate"
                        ? "orrage"
                        : "green",
                  }}
                >
                  {clickRowData?.status}
                </span>
              </h6>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p>
                  <b>Issue Id:</b> {singleData?.complainNo}
                </p>
                <p>
                  <b>Issue Type:</b> {singleData?.complainCategoryName}
                </p>
                <p>
                  <b>Sub Issue Type:</b> {singleData?.complainSubCategoryName}
                </p>
                <p>
                  <b>Occurrence Date Time: </b>{" "}
                  {singleData?.requestDateTime &&
                    moment(singleData?.requestDateTime).format(
                      "YYYY-MM-DD"
                    )}{" "}
                  {singleData?.occurrenceTime &&
                    moment(singleData?.occurrenceTime, "HH:mm:ss").format(
                      "hh:mm A"
                    )}
                </p>

                <p>
                  <b>Issue Details:</b> {singleData?.description}
                </p>
                <p>
                  <b>Respondent Type:</b> {singleData?.respondentTypeName}
                </p>
                <p>
                  <b>Respondent Name:</b> {singleData?.respondentType}
                </p>
                <p>
                  <b>Respondent Contact:</b> {singleData?.contactNo}
                </p>
                {singleData?.respondentAddress && (
                  <p>
                    <b>Respondent Address:</b> {singleData?.respondentAddress}
                  </p>
                )}

                <p>
                  <b>Designation/Relationship:</b>{" "}
                  {singleData?.designationOrRelationship}
                </p>
                <p>
                  <b>Contact Source:</b> {singleData?.contactSourceName}
                </p>
                <p>
                  <b>Customer Name :</b> {singleData?.sourceCustomerType}
                </p>
              </div>
              <div>
                <p>
                  <b>Business Unit:</b>{" "}
                  {singleData?.respondentBusinessUnitIdName}
                </p>
                <p>
                  <b>Create By: </b> {singleData?.actionByName}
                </p>
                <p>
                  <b>Create Date: </b>{" "}
                  {singleData?.lastActionDateTime &&
                    moment(singleData?.lastActionDateTime).format(
                      "YYYY-MM-DD hh:mm A"
                    )}
                </p>
                <p>
                  <b>Distribution Channel:</b>{" "}
                  {singleData?.distributionChannelName}
                </p>
                <p>
                  <b>Product Category:</b> {singleData?.itemCategoryName}
                </p>
                <p>
                  <b>Delegate Date Time:</b>{" "}
                  {singleData?.delegateDateTime &&
                    moment(singleData?.delegateDateTime).format(
                      "YYYY-MM-DD, HH:mm A"
                    )}
                </p>
                <p>
                  <b>Delegate To:</b> {singleData?.delegateToName}
                </p>
                <p>
                  <b> Remarks:</b> {singleData?.statusRemarks}
                </p>
                {singleData?.respondentTypeName === "Employee" && (
                  <p>
                    <b> Work Place:</b> {singleData?.workPlace}
                  </p>
                )}
                {singleData?.respondentTypeName === "End User" && (
                  <>
                    <p>
                      <b>Territory Name:</b> {singleData?.territoryName}
                    </p>
                    <p>
                      <b>Area Name:</b> {singleData?.areaName}
                    </p>
                    <p>
                      <b>Region Name:</b> {singleData?.regionName}
                    </p>
                  </>
                )}
                <p>
                  <b>Attachment:</b>{" "}
                  {singleData?.attachment && (
                    <span>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">View Attachment</Tooltip>
                        }
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              getDownlloadFileView_Action(
                                singleData?.attachment
                              )
                            );
                          }}
                          className="ml-2"
                        >
                          <i
                            style={{ fontSize: "16px" }}
                            className={`fa pointer fa-eye`}
                            aria-hidden="true"
                          ></i>
                        </span>
                      </OverlayTrigger>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {rowDto?.length > 0 && (
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Investigation Date</th>
                      <th>Investigation Person</th>
                      <th>Root Cause</th>
                      <th>Corrective Action</th>
                      <th>Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center"> {index + 1}</td>
                        <td>
                          {item?.investigationDateTime &&
                            moment(item?.investigationDateTime).format(
                              "YYYY-MM-DD HH:mm A"
                            )}
                        </td>
                        <td>{item?.investigatorName}</td>
                        <td>{item?.rootCause}</td>
                        <td>{item?.correctiveAction}</td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center">
                            {item?.attachment && (
                              <span
                                onClick={() => {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      item?.attachment
                                    )
                                  );
                                }}
                              >
                                <i
                                  class="fa fa-paperclip pointer"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Formik>
    </>
  );
}

export default InvoiceView;
