import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getInvestigateComplainbyApi,
  investigateComplainApi,
} from "../../resolution/helper";
export const validationSchema = Yup.object().shape({});

function InvoiceView({ clickRowData }) {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    // rowDto empty check
    if (rowDto.length === 0) {
      return toast.error("Please add at least one row");
    }
    let payload = {
      complainId: clickRowData?.complainId || 0,
      statusId: 3,
      status: "Investigate",
      actionById: userId,
      investigationInfo: rowDto || [],
    };

    investigateComplainApi(payload, setLoading, () => {
      cb();
    });
  };

  useEffect(() => {
    if (
      clickRowData?.status === "Investigate" ||
      clickRowData?.status === "Close"
    ) {
      getInvestigateComplainbyApi(clickRowData?.complainId, setRowDto);
    }
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
          <ICustomCard title={"Complaint View "}>
            {loading && <Loading />}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px 35px",
              }}
            >
              <p>
                <b>Issue Id:</b> {clickRowData?.complainNo}
              </p>
              <p>
                <b>Issue Title:</b> {clickRowData?.issueTitle}
              </p>
              <p>
                <b>Respondent Type:</b> {clickRowData?.respondentTypeName}
              </p>
              <p>
                <b>Respondent Name:</b> {clickRowData?.respondentName}
              </p>
              <p>
                <b>Distribution Channel:</b>{" "}
                {clickRowData?.distributionChannelName}
              </p>
              <p>
                <b>Product:</b> {clickRowData?.itemName}
              </p>
              <p>
                <b>Contact: </b> {clickRowData?.contactNo}
              </p>
              <p>
                <b>Create By: </b> {clickRowData?.actionByName}
              </p>
              <p>
                <b>Create Date: </b>{" "}
                {clickRowData?.lastActionDateTime &&
                  moment(clickRowData?.lastActionDateTime).format(
                    "YYYY-MM-DD hh:mm A"
                  )}
              </p>
            </div>
            {(clickRowData?.status === "Delegate" ||
              clickRowData?.status === "Close" ||
              clickRowData?.status === "Investigate") && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2px 35px",
                    marginTop: "15px",
                  }}
                >
                  <p>
                    <b>Delegate By:</b> {clickRowData?.delegateByName}
                  </p>
                  <p>
                    <b>Delegate Date:</b>{" "}
                    {clickRowData?.delegateDateTime &&
                      moment(clickRowData?.delegateDateTime).format(
                        "YYYY-MM-DD hh:mm A"
                      )}
                  </p>
                  <p>
                    <b>Remarks: </b> {clickRowData?.statusRemarks}
                  </p>
                </div>
              </>
            )}

            {rowDto?.length > 0 && (
              <>
                <table className='table table-striped table-bordered global-table'>
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
                        <td className='text-center'> {index + 1}</td>
                        <td>{_dateFormatter(item?.investigationDateTime)}</td>
                        <td>{item?.investigatorName}</td>
                        <td>{item?.rootCause}</td>
                        <td>{item?.correctiveAction}</td>
                        <td>
                          <div className='d-flex align-items-center justify-content-center'>
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
                                  class='fa fa-paperclip pointer'
                                  aria-hidden='true'
                                ></i>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default InvoiceView;
