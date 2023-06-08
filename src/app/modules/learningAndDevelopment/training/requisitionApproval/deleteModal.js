import { Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";

import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import InputField from "../../../_helper/_inputField";
const initData = {
  comment: "",
};
export default function DeleteModal({
  isApprove,
  allData,
  setisShowModal,
  getRowData,
  setAllData,
  id,
}) {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [, approveHandler] = useAxiosPost();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form
              style={{ marginBottom: "15px" }}
              className="form form-label-right"
            >
              <div className="form-group  global-form">
                <div className="w-100">
                  <h6 className="text-center">{`Are you want to ${
                    isApprove ? "approve" : "reject"
                  } ?`}</h6>
                </div>
                {!isApprove ? (
                  <div className="row">
                    <div className="col-lg-12">
                      <InputField
                        value={values?.comment}
                        label="Reason"
                        name="comment"
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="mt-2 d-flex justify-content-center">
                  <div className="col-lg-2 mr-5">
                    <button
                      disabled={false}
                      onClick={() => {
                        if (!isApprove && !values?.comment)
                          return toast.warn("Reason is required");
                        approveHandler(
                          `/hcm/Training/TrainingRequisitionApproval`,
                          {
                            intRequisitionId: allData
                              .filter((data) => data.selectCheckbox)
                              .map((item) => item?.intRequisitionId),
                            isApproved: isApprove ? true : false,
                            strApprovedBy: isApprove ? profileData?.userId : "",
                            strRejectedBy: !isApprove
                              ? profileData?.userId
                              : "",
                            comments: !isApprove ? values?.comment : "",
                          },
                          () => {
                            setisShowModal(false);
                            getRowData(
                              `/hcm/Training/GetTrainingRequisitionLanding?intScheduleId=${id}`,
                              (data) => {
                                setAllData(data);
                              }
                            );
                          },
                          true
                        );
                      }}
                      className="btn btn-primary"
                    >
                      Yes
                    </button>
                  </div>
                  <div className="col-lg-2 ml-5">
                    <button
                      disabled={false}
                      onClick={() => {
                        setisShowModal(false);
                      }}
                      className="btn btn-primary"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
