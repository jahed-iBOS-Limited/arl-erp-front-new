import { Rating } from '@material-ui/lab';
import { Formik } from 'formik';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import TextArea from '../../../../_helper/TextArea';
import Loading from '../../../../_helper/_loading';
import { feedbackReviewApi } from '../../resolution/helper';
function FeedbackModalAfterClosing({ clickRowData, landingCB }) {
  const [loading, setLoading] = React.useState(false);
  const [review, setReview] = React.useState(0);
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const formikRef = React.useRef(null);

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          feedback: '',
        }}
        innerRef={formikRef}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <div className="row">
            <div className="col-lg-12 mt-3">
              {/* <p>
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
              </p> */}
              <div className="mt-2 d-flex justify-content-center mb-2">
                <div className="d-flex justify-content-center align-items-center">
                  {' '}
                  <b>Low</b>
                  <Rating
                    name="pristine"
                    value={review}
                    onChange={(event, newValue) => {
                      setReview(newValue);
                    }}
                  />{' '}
                  <b>High</b>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <TextArea
                name="feedback"
                value={values?.feedback || ''}
                placeholder="FeedBack"
                touched={touched}
                rows="3"
                onChange={(e) => {
                  setFieldValue('feedback', e.target.value);
                }}
                errors={errors}
              />
            </div>

            <div className="col-lg-12 d-flex justify-content-center mb-2">
              <button
                className="btn btn-primary mt-3"
                onClick={() => {
                  const payload = {
                    complainId: clickRowData?.complainId,
                    reviewFeedbackCount: +review,
                    reviewFeedbackMessage: values?.feedback || '',
                    reviewFeedbackByUserId: userId,
                  };
                  feedbackReviewApi(payload, setLoading, () => {
                    landingCB && landingCB();
                  });
                }}
                type="button"
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

export default FeedbackModalAfterClosing;
