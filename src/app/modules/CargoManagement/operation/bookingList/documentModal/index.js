import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { imarineBaseUrl } from "../../../../../App";
import "./style.css";
import * as Yup from "yup";
import { Form, Formik } from "formik";
const validationSchema = Yup.object().shape({});
function DocumentModal({ rowClickData }) {
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
            const documents  =  resDataShipBookingRequest?.[0]?.documents || [];
            const documentsUploadTypeList = resDataDocumentsUpload?.map(
              (item) => {
                const isExist = documents?.find(
                  (doc) => doc?.documentTypeId
                  === item?.value
                );
                return {
                  ...item,
                  checked: isExist ? true : false,
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
  const saveHandler = (values, cb) => {};

  return (
    <div className="documentChecklist">
      {(documentsUploadTypeLoading || shipBookingRequestLoading) && <Loading />}
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
              {/* <div className="">
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div> */}
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
