/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { validationSchema } from "../helper";
import TextArea from "../../../../_helper/TextArea";

export default function _Form({
  title,
  viewType,
  initData,
  saveHandler,
  motherVesselDDL,
  onChangeHandler,
  domesticPortDDL,
  steveDoreDDL,
  cnfDDL,
}) {
  const history = useHistory();
  const commonDisableHandler = () => {
    return viewType === "view";
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={title}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    {viewType !== "view" && (
                      <>
                        <button
                          type="reset"
                          onClick={() => {
                            resetForm(initData);
                          }}
                          className="btn btn-light ml-2"
                          disabled={viewType === "view"}
                        >
                          <i className="fa fa-redo"></i>
                          Reset
                        </button>{" "}
                        <button
                          type="submit"
                          className="btn btn-primary ml-2"
                          onClick={handleSubmit}
                          disabled={false}
                        >
                          Save
                        </button>
                      </>
                    )}
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <InputField
                          label="Voyage Code"
                          value={values?.voyageCode}
                          name="voyageCode"
                          placeholder="Voyage Code"
                          type="text"
                          disabled={commonDisableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="motherVessel"
                          options={motherVesselDDL}
                          value={values?.motherVessel}
                          label="Mother Vessel"
                          onChange={(e) => {
                            onChangeHandler(
                              "motherVessel",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Mother Vessel"
                          errors={errors}
                          touched={touched}
                          isDisabled={commonDisableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="LC Number"
                          value={values?.lcNumber}
                          name="lcNumber"
                          placeholder="LC Number"
                          type="text"
                          disabled={commonDisableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="BL Quantity"
                          value={values?.blQty}
                          name="blQty"
                          placeholder="BL Quantity"
                          type="text"
                          disabled={commonDisableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="ETA"
                          value={values?.eta}
                          name="eta"
                          placeholder="ETA"
                          type="date"
                          disabled={commonDisableHandler()}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="loadingPort"
                          options={domesticPortDDL || []}
                          value={values?.loadingPort}
                          label="Loading Port"
                          onChange={(e) => {
                            onChangeHandler(
                              "loadingPort",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Loading Port"
                          errors={errors}
                          touched={touched}
                          isDisabled={commonDisableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="dischargingPort"
                          options={domesticPortDDL || []}
                          value={values?.dischargingPort}
                          label="Discharging Port"
                          onChange={(e) => {
                            onChangeHandler(
                              "dischargingPort",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Discharging Port"
                          errors={errors}
                          touched={touched}
                          isDisabled={commonDisableHandler()}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="cnf"
                          options={cnfDDL || []}
                          value={values?.cnf}
                          label="CNF"
                          onChange={(e) => {
                            onChangeHandler("cnf", values, e, setFieldValue);
                          }}
                          placeholder="CNF"
                          errors={errors}
                          touched={touched}
                          isDisabled={commonDisableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="stevedore"
                          options={steveDoreDDL || []}
                          value={values?.stevedore}
                          label="Steve Dore"
                          onChange={(e) => {
                            onChangeHandler(
                              "stevedore",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Steve Dore"
                          errors={errors}
                          touched={touched}
                          isDisabled={commonDisableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="narration">Narration</label>
                        <TextArea
                          value={values?.narration}
                          name="narration"
                          placeholder="Narration"
                          type="text"
                          disabled={commonDisableHandler()}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
