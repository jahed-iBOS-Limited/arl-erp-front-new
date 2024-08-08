import { Form, Formik } from "formik";
import React from "react";
import IForm from "../../../../_helper/_form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

export default function InvoiceList({ item, setInvoiceDataShow, data }) {
  console.log({ item });
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const dispatch = useDispatch();

  const saveHandler = (values, cb) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          <IForm
            title="Sales Invoice Cancellation"
            isHiddenBack
            isHiddenReset
            isHiddenSave
          >
            <Form>
              {data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Partner</th>

                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((i, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.strPartnerName}
                          </td>

                          <td className="text-center">
                            {i?.attachment ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(i?.attachment)
                                    );
                                  }}
                                  className="mt-2 ml-2"
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className={`fa pointer fa-eye`}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            ) : null}
                          </td>
                          {/* <td className="text-center">
                            {item?.strMutitaionKhotianNo || ""}
                          </td>
                          <td className="text-center">{item?.monBroker}</td>
                          <td className="text-center">
                            {item?.monRegistrationCost}
                          </td>
                          <td className="text-center">
                            {item?.monMutationFees || ""}
                          </td>
                          <td className="text-center">
                            {item?.strRemark || ""}
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
