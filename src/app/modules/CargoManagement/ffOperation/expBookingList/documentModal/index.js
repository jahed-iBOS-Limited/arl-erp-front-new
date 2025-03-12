import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { imarineBaseUrl } from "../../../../../App";
import "./style.css";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { commonBookingRequestStatusUpdate } from "../helper";
const validationSchema = Yup.object().shape({});

function DocumentModal({ rowClickData, CB }) {
  const [
    ,
    getBookingRequestStatusUpdate,
    bookingRequestloading,
  ] = useAxiosPut();
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    ,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const [documentsUploadTypeList, setDocumentsUploadTypeList] = useState([]);
  const [, getDocumentsUploadType, documentsUploadTypeLoading] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  useEffect(() => {
    getDocumentsUploadType(
      `${imarineBaseUrl}/domain/ShippingService/GetDocumentsUploadType`,
      (resDataDocumentsUpload) => {
        setShipBookingRequestGetById(
          `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
          (resDataShipBookingRequest) => {
            const documents = resDataShipBookingRequest?.documents || [];
            const documentsUploadTypeList = resDataDocumentsUpload?.map(
              (item) => {
                const isExist = documents?.find(
                  (doc) => doc?.documentTypeId === item?.value
                );
                return {
                  ...item,
                  checked: isExist ? true : false,
                  documentFileId: isExist?.documentFileId,
                };
              }
            );
            setDocumentsUploadTypeList(documentsUploadTypeList);
          }
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, cb) => {
    const commonPaylaod = commonBookingRequestStatusUpdate(rowClickData);
    const payload = {
      ...commonPaylaod,
      bookingRequestId: rowClickData?.bookingRequestId,
      documentChecklistDate: new Date(),
      isDocumentChecklist: true,
    };
    getBookingRequestStatusUpdate(
      `${imarineBaseUrl}/domain/ShippingService/BookingRequestStatusUpdate`,
      payload,
      () => {
        CB();
      }
    );
  };
  const dispatch = useDispatch();

  return (
    <div className="documentChecklist">
      {(documentsUploadTypeLoading || shipBookingRequestLoading || bookingRequestloading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="">
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              {/* <div className="form-group row global-form">
                
              </div> */}
              <div className="col-lg-12">
                {" "}
                <div className="table-responsive">
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="p-0">SL</th>
                        <th className="p-0">Document Type</th>
                        <th className="p-0">Document File ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentsUploadTypeList?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center align-middle">
                            <input
                              type="checkbox"
                              checked={item?.checked}
                              className="documentChecklistCheckbox"
                            />
                          </td>
                          <td> {index + 1} </td>
                          <td className="align-middle">
                            <label>{item?.label}</label>
                          </td>
                          <td>
                            <span
                              onClick={() => {
                                dispatch(
                                  getDownlloadFileView_Action(
                                    item?.documentFileId
                                  )
                                );
                              }}
                              style={{
                                textDecoration: "underline",
                                color: "blue",
                                cursor: "pointer",
                              }}
                            >
                              {item?.documentFileId}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default DocumentModal;
