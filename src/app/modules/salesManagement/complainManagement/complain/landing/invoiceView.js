import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getComplainByIdWidthOutModify
} from "../../resolution/helper";
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
          <ICustomCard title={"Complaint View "}>
            {loading && <Loading />}
            <div
              style={{
                display: "flex",
                gap: '10px',
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
                  <b>Respondent Name:</b> {singleData?.respondentName}
                </p>
                <p>
                  <b>Respondent Contact:</b> {singleData?.contactNo}
                </p>
                <p>
                  <b>Designation/Relationship:</b>{" "}
                  {singleData?.designationOrRelationship}
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
                <p>
                  <b>Attachment: </b>
                </p>
              </div>
            </div>

            {rowDto?.length > 0 && (
              <div className='table-responsive'>
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
              </div>
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default InvoiceView;
