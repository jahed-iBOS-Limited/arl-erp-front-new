import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  orgDDL,
  setter,
  rowDto,
  remover,
  partnerTypeDDL,
  glDDL,
  businessTransDDL
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
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
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg">
                  <NewSelect
                    name="partnerType"
                    options={partnerTypeDDL}
                    value={values?.partnerType}
                    label="Partner Type"
                    onChange={(valueOption) => {
                      setFieldValue("configType", "");
                      setFieldValue("partnerType", valueOption);
                    }}
                    placeholder="Partner Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <NewSelect
                    name="org"
                    options={orgDDL}
                    value={values?.org}
                    label="Organization"
                    onChange={(valueOption) => {
                      setFieldValue("org", valueOption);
                    }}
                    placeholder="Organization"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <NewSelect
                    name="configType"
                    options={values?.partnerType?.innerData || []}
                    value={values?.configType}
                    label="Config Type"
                    onChange={(valueOption) => {
                      setFieldValue("configType", valueOption);
                    }}
                    isDisabled={!values?.partnerType}
                    placeholder="Config Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <NewSelect
                    name="gl"
                    options={glDDL}
                    value={values?.gl}
                    label="General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("gl", valueOption);
                    }}
                    placeholder="General Ledger"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <NewSelect
                    name="businessTrans"
                    options={businessTransDDL}
                    value={values?.businessTrans}
                    label="Business Transaction"
                    onChange={(valueOption) => {
                      setFieldValue("businessTrans", valueOption);
                    }}
                    placeholder="Business Transaction"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                
                <div style={{ marginTop: "18px" }} className="col-lg-1">
                  <ButtonStyleOne type="button" label="Add" onClick={() => setter(values)} />
                </div>
              </div>

              <ICustomTable
                ths={[
                  "SL",
                  "Config Type",
                  "General Ledger",
                  "Organization",
                  "Action",
                ]}
              >
                {rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.configType?.label}</td>
                    <td>{item?.gl?.label}</td>
                    <td>{item?.org?.label}</td>
                    <td className="text-center">
                      <IDelete remover={remover} id={index} />
                    </td>
                  </tr>
                ))}
              </ICustomTable>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
