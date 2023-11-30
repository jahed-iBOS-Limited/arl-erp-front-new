import { Rating } from "@material-ui/lab";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import TextArea from "../../../../_helper/TextArea";
import Loading from "../../../../_helper/_loading";
import { getComplainByIdWidthOutModify, investigateReviewApi } from "../helper";
function FeedbackModal({ clickRowData, landingCB }) {
  const [loading, setLoading] = React.useState(false);
  const [review, setReview] = React.useState(0);
  const {
    profileData: { accountId: accId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const formikRef = React.useRef(null);


  useEffect(() => {
    if (clickRowData?.complainId) {
      const id = clickRowData?.complainId;
      getComplainByIdWidthOutModify(id, accId, buId, setLoading, (resData) => {
        if (clickRowData?.status === "Close") {
          formikRef.current.setFieldValue(
            "feedback",
            resData?.closingReviewMessage || ""
          );
          setReview(resData?.closingReview || 0);
          formikRef.current.setFieldValue("status", 'Close');
        } else {
          const matchEmployee = resData?.investigationInfo?.find(
            (itm) => itm?.investigatorId === employeeId
          );
          if (formikRef.current) {
            formikRef.current.setFieldValue(
              "feedback",
              matchEmployee?.investigationReviewMessage || ""
            );

            setReview(matchEmployee?.investigationReview || 0);
            formikRef.current.setFieldValue(
              "autoId",
              matchEmployee?.autoId || ""
            );
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowData]);

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          feedback: "",
        }}
        innerRef={formikRef}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <div className='row'>
            <div className='col-lg-12 mt-3'>
              <p>
                Do you want to <b>{clickRowData?.status}</b>{" "}
                <b
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                  }}
                >
                  {clickRowData?.complainNo}
                </b>
                ? Please rate us.
              </p>
              <div className='mt-2 d-flex justify-content-center mb-2'>
                <div className='d-flex justify-content-center align-items-center'>
                  {" "}
                  <b>Low</b>
                  <Rating
                    name='pristine'
                    value={review}
                    onChange={(event, newValue) => {
                      setReview(newValue);
                    }}
                  />{" "}
                  <b>High</b>
                </div>
              </div>
            </div>
            <div className='col-lg-12'>
              <TextArea
                name='feedback'
                value={values?.feedback || ""}
                placeholder='FeedBack'
                touched={touched}
                rows='3'
                onChange={(e) => {
                  setFieldValue("feedback", e.target.value);
                }}
                errors={errors}
              />
            </div>

            <div className='col-lg-12 d-flex justify-content-center mb-2'>
              <button
                className='btn btn-primary mt-3'
                onClick={() => {
                  const payload = {
                    autoId: values?.autoId || 0,
                    complainId: clickRowData?.complainId || 0,
                    review: +review || 0,
                    reviewMessage: values?.feedback || "",
                    reviewType: values?.status === "Close" ? "Close" : "",
                  };
                  investigateReviewApi(payload, setLoading, () => {
                    landingCB();
                  });
                }}
                type='button'
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}

export default FeedbackModal;
