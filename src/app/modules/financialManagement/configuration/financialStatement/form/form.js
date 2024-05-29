import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../_helper/_select";
import { getAccountCategoryDDL, getGeneralLedgerDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  fsComponentName: Yup.string().required("FS Componet Name is required"),
  accountCategory: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
  generalLedger: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  selectedBusinessUnit,
  locationData,
  generalLedgerRowDto,
  addGlGrid,
  setGeneralLedgerDDL,
  generalLedgerDDL,
  remover,
  isEdit,
}) {
  const [accountCategoryDDL, setAccountCategoryDDL] = useState([]);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getAccountCategoryDDL(profileData?.accountId, setAccountCategoryDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          fsComponentName: locationData?.fscomponentName,
          accountCategory: {
            value: generalLedgerRowDto
              ? generalLedgerRowDto[0]?.accountCategoryId
              : "",
            label: generalLedgerRowDto
              ? generalLedgerRowDto[0]?.accountCategoryName
              : "",
          },
          generalLedger: {
            value: generalLedgerRowDto
              ? generalLedgerRowDto[0]?.generalLedgerId
              : "",
            label: generalLedgerRowDto
              ? generalLedgerRowDto[0]?.generalLedgerName
              : "",
          },
        }}
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-4 ">
                     <label>FS Component Standard Name</label>               
                    <InputField
                      value={locationData?.fscomponentName}
                      name="fsComponent"
                      placeholder="FS Component Standard Name"
                      disabled
                    />
                                      
                  </div>
                  <div className="col-lg-4 ">
                     <label>FS Component Coustomize Name</label>               
                    <InputField
                      value={values?.fsComponentName}
                      name="fsComponentName"
                      placeholder="FS Component Coustomize Name"
                      //disabled={generalLedgerRowDto.length > 0 ? true : false}
                    />
                                 
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-3">
                    <label>Account Category</label>
                    <NewSelect
                      name="accountCategory"
                      options={accountCategoryDDL || []}
                      value={values?.accountCategory}
                      onChange={(valueOption) => {
                        getGeneralLedgerDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setGeneralLedgerDDL
                        );
                        setFieldValue("generalLedger", "");
                        setFieldValue("accountCategory", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                               
                  </div>
                  <div className="col-lg-3">
                     <label>General Ledger</label>               
                    <NewSelect
                      name="generalLedger"
                      options={generalLedgerDDL || []}
                      value={values?.generalLedger}
                      onChange={(valueOption) => {
                        setFieldValue("generalLedger", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.checkGl === true}
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    <div className="d-flex mt-6">
                      <div className="mr-2">
                        <input
                          style={{ marginTop: "8px" }}
                          type="checkbox"
                          name="checkGl"
                          checked={values?.checkGl}
                          onChange={(e) => {
                            setFieldValue("checkGl", e.target.checked);
                            e.target.checked === true &&
                              setFieldValue(
                                "generalLedger",
                                generalLedgerDDL[0]
                              );
                          }}
                          disabled={!values?.accountCategory?.label}
                        />
                      </div>
                      <label>All GL</label>
                    </div>
                  </div> */}
                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => {
                        addGlGrid(values);
                      }}
                      style={{
                        marginTop: "24px",
                      }}
                      disabled={
                        !values?.fsComponentName ||
                        !values?.accountCategory?.label ||
                        !values?.generalLedger?.label
                        // values?.checkGl
                        //   ? false
                        //   : true
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              {generalLedgerRowDto?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Accounts Category</th>
                        <th>General Ledger</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generalLedgerRowDto?.map((itm, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {itm?.accountCategoryName}
                          </td>
                          <td className="text-center">
                            {itm?.generalLedgerName}
                          </td>

                          <td
                            className="text-center"
                            onClick={() => remover(itm?.generalLedgerId)}
                          >
                            <IDelete id={itm?.generalLedgerId} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
                                              
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
