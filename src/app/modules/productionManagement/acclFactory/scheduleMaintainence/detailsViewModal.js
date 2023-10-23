import { Form, Formik } from "formik";
import React from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const DetailsViewModal = ({ clickedRowData }) => {
  const saveHandler = (values, cb) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
          {false && <Loading />}
          <IForm
            title="Schedule Maintainence Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="row">
                  <div className="col-lg-4">
                    <strong>Schedule End Date: </strong>{" "}
                    {_dateFormatter(clickedRowData?.scheduleEndDateTime)}
                  </div>
                  <div className="col-lg-4">
                    <strong>Machine Name: </strong>
                    {clickedRowData?.machineName}
                  </div>
                  <div className="col-lg-4">
                    <strong>Frequency: </strong>
                    {clickedRowData?.frequency}
                  </div>
                  <br />
                  <br />
                  {/*    */}
                  <div className="col-lg-4">
                    <strong>Responsible Person: </strong>{" "}
                    {clickedRowData?.resposiblePersonName}
                  </div>
                  <div className="col-lg-4"></div>
                  <div className="col-lg-4">
                    <strong>Completed Date: </strong>{" "}
                    {_dateFormatter(clickedRowData?.completedDateTime)}
                  </div>
                  <br />
                  <br />
                  <div className="col-lg-12">
                    <strong>Maintainance Task: </strong>{" "}
                    {clickedRowData?.maintainanceTask}
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default DetailsViewModal;
