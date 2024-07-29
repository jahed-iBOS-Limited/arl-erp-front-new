/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import ICustomCard from "../../../../_helper/_customCard";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";

export default function _Form({ 
  viewType,
  initData,
  postData, 
  saveHandler,
}) {
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <ICustomCard
              title={`Ship To Party Target Entry`}
              backHandler={() => history.goBack()}
              resetHandler={
                viewType !== "view"
                  ? () => { 
                      resetForm(initData);
                    }
                  : ""
              }
              saveHandler={() => {
                handleSubmit();
              }} 
            >
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="conditionType"
                        options={[]}
                        value={values?.conditionType}
                        label="Condition Type"
                        onChange={(valueOption) => {
                          setFieldValue("conditionType", valueOption);
                        }}
                        placeholder="Select Condition Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={viewType}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="conditionTypeRef"
                        options={[]}
                        value={values?.conditionTypeRef}
                        label="Condition Type Ref"
                        onChange={(valueOption) => {
                          setFieldValue("conditionTypeRef", valueOption);
                        }}
                        placeholder="Select Condition Type Ref"
                        errors={errors}
                        touched={touched}
                        isDisabled={viewType}
                      />
                    </div>
                    <FromDateToDateForm obj={{ values, setFieldValue }} />

                    <IButton
                      onClick={() => {
                        postData(
                          `/fino/ReturnSales/ShipToPartnerTargetEntryFromGoogleSheet`,
                          {
                            // bearer_token: token,
                          },
                          () => {},
                          true
                        );
                      }}
                    >
                      Update from Google Sheet
                    </IButton>
                  </div>
                </div>
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
