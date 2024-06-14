import { Form, Formik } from "formik";
import React, { useState } from "react";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import FormikInput from "../../_chartinghelper/common/formikInput";
import * as Yup from "yup";
import ICustomTable from "../../_chartinghelper/_customTable";
import IDelete from "../../_chartinghelper/icons/_delete";

export default function CategoryCreateModal({ title, setter, onHide }) {
  const [, createCategory, loading] = useAxiosPost();
  const validationSchema = Yup.object().shape({
    strVesselAuditInspectionCategoryName: Yup.string().required(
      "Vessel Audit Inspection Category is required"
    ),
  });
  const [rowDto, setRowDto] = useState([]);
  const deleteHandler = (index) => {
    const filterArr = rowDto?.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };
  const headers = [
    { name: "SL" },
    { name: "Category", style: { minWidth: "65px" } },
    { name: "Action", style: { minWidth: "40px" } },
  ];
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        intVesselAuditInspectionCategoryId: 0,
        strVesselAuditInspectionCategoryName: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, setFieldValue }) => {
        setRowDto([...rowDto, { ...values, isActive: true }]);
        setFieldValue("strVesselAuditInspectionCategoryName", "");
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
          <IForm
            title={`${title}`}
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      createCategory(
                        `/hcm/VesselAuditInspection/CreateVesselAuditInspectionCategory`,
                        rowDto,
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
                    Save
                  </button>
                </div>
              );
            }}
          >
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
                    Add
                  </button>
                </div>
              </div>
              {rowDto?.length > 0 ? (
                <ICustomTable ths={headers}>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {item?.strVesselAuditInspectionCategoryName}
                      </td>
                      <td className="text-center">
                        <div
                          onClick={() => {
                            deleteHandler(index);
                          }}
                        >
                          <IDelete />
                        </div>
                      </td>
                    </tr>
                  ))}
                </ICustomTable>
              ) : null}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
