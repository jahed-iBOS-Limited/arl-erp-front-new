import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../../_helper/_select";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";

// Validation schema
const validationSchema = Yup.object().shape({
  employmentActivity: Yup.object().shape({
    label: Yup.string().required("Employment Activity is required"),
    value: Yup.string().required("Employment Activity is required"),
  }),

    
});

export default function _Form({
  initData,
  saveHandler,
  disableHandler,
  setEdit,
  edit,
  rowDto,
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
          <div className={!edit ? "editForm" : ""}>
            {disableHandler(!isValid)}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Employment Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                        }}
                        className="btn btn-light "
                        type="button"
                      >
                        <i className="fas fa-times pointer"></i>
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEdit(true)}
                      className="btn btn-light"
                      type="button"
                    >
                      <i className="fas fa-pen-square pointer"></i>
                      Edit
                    </button>
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3">
                      <NewSelect
                        name="employmentActivity"
                        options={[]}
                        value={values?.employmentActivity}
                        label="Employment Activity"
                        onChange={(valueOption) => {
                          setFieldValue("employmentActivity", valueOption);
                        }}
                        placeholder="Employment Activity"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    
                   
                    <div className={!edit ? "d-none" : "col-lg-3 mt-2"}>
                      <button
                        className="btn btn-primary"
                        type="button"
                        // onClick={() => rowDataAddHandler(values)}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  {/* row end */}
                  {/* Table Start */}
                  <div className="row global-form global-form-custom bg_none">
                    <div className="col-lg-12 pr-0 pl-0">
                      {rowDto?.length > 0 && (
                         <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                          <thead>
                            <tr>
                              <th style={{ width: "35px" }}>SL</th>
                              <th style={{ width: "35px" }}>Employment Activity</th>
                              <th style={{ width: "35px" }}>Description</th>
                              <th style={{ width: "35px" }}>Effective Date</th>
                              <th style={{ width: "35px" }}>Attachment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((itm, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  <IDelete id={index} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Table End */}
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
