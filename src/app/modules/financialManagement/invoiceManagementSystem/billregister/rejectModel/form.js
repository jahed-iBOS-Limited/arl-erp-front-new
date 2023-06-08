import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loading from "./../../../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import InputField from "./../../../../_helper/_inputField";
import { rejectBillRegister_api } from "../helper"


const initData = {
  remarks: "",
};

const validationSchema = Yup.object().shape({
  // approveAmount: Yup.number()
  //   .min(0, "Minimum 0 number")
  //   .required("Approve amount required")
  //   .test("approveAmount", "Max net payment amount", function(value) {
  //     return this.parent.approveAmountMax >= value;
  //   }),
});
function RejectModel({
  gridItem,
  setIsReject,
  laingValues,
  profileData, 
  cb,
  selectedBusinessUnit
}) {

  const rejectSaveHandler = (values, setDisabled) => {
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        typeId: 2,
        remarks: values?.remarks,
        billIds: gridItem?.billRegisterId,
        actionById: profileData?.userId
      }

    rejectBillRegister_api(
      payload,
      setDisabled,
      cb,
      laingValues,
      setIsReject
    );
  };

  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            rejectSaveHandler(values, setDisabled);
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <div className="">
              {disabled && <Loading />}
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Bill Register Reject"}>
                  <CardHeaderToolbar>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary ml-2"
                      type="submit"
                      isDisabled={disabled}
                    >
                      Save
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <Form className="form form-label-right">
                    <div className="row global-form">
                      <div className="col-lg-5 offset-lg-7">
                        <label>Remarks</label>
                        <InputField
                          value={values?.remarks}
                          name="remarks"
                          placeholder="Remarks"
                          type="test"
                        />
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
          )}
        </Formik>
      </>
    </div>
  );
}

export default RejectModel;
