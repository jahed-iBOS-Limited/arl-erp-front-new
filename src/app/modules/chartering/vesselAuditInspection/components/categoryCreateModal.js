import { Form, Formik } from "formik";
import React from "react";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import FormikInput from "../../_chartinghelper/common/formikInput";
import * as Yup from "yup";

export default function CategoryCreateModal({ title, setter, onHide }) {
  const [createCategory, loading] = useAxiosPost();
  const validationSchema = Yup.object().shape({
    strVesselAuditInspectionCategoryName: Yup.string().required(
      "Vessel Audit Inspection Category is required"
    ),
  });
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        intVesselAuditInspectionCategoryId: 0,
        strVesselAuditInspectionCategoryName: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
        createCategory(
          `/hcm/VesselAuditInspection/CreateVesselAuditInspectionCategory`,
          { ...values, isActive: true },
          () => {
            resetForm({
              intVesselAuditInspectionCategoryId: 0,
              strVesselAuditInspectionCategoryName: "",
            });
          },
          true
        );
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
          {loading && <Loading />}
          <IForm title={`${title}`} isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <label> Vessel AuditInspection Category Name</label>
                  <FormikInput
                    value={values?.strVesselAuditInspectionCategoryName}
                    name="strVesselAuditInspectionCategoryName"
                    placeholder="Vessel AuditInspection Category"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    className={"btn btn-primary mt-5 ml-2 px-3 py-2"}
                    onClick={handleSubmit}
                  >
                    Create
                  </button>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
