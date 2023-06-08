import { Formik } from "formik";
import React from "react";
import {
  Card,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";

const Form = ({ initData, territoryDDL, loading, saveHandler }) => {
  return (
    <>
      <Card>
        <ModalProgressBar />
        {loading && <Loading />}
        <Formik
          initialValues={initData}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <>
              <form className="form form-label-right">
                <div className="d-flex justify-content-between p-3">
                  <h3> Edit Partner Territory Information </h3>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSubmit}
                  >
                    save
                  </button>
                </div>
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      name="channelName"
                      label="Distribution Channel"
                      value={values?.channelName}
                      disabled
                    ></InputField>
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="partnerName"
                      label="Partner Name"
                      value={values?.partnerName}
                      disabled
                    ></InputField>
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="partnerCode"
                      label="Partner Code"
                      value={values?.partnerCode}
                      disabled
                    ></InputField>
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territory"
                      options={territoryDDL || []}
                      value={values?.territory}
                      onChange={(e) => {
                        setFieldValue("territory", e);
                      }}
                      label="Territory"
                      placeholder="Territory"
                    ></NewSelect>
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default Form;
