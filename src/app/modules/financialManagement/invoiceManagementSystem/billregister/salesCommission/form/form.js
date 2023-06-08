import React from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { empAttachment_action } from "../../helper";
import GridView from "../Table/table";
import Loading from "../../../../../_helper/_loading";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";

const _Form = ({
  initData,
  saveHandler,
  loading,
  headerData,
  gridData,
  shipPointDDL,
  getData,
  accOfPartnerDDl,
  getSoldToPartner,
  distributionChannelDDL,
  open,
  setOpen,
  setFileObjects,
  fileObjects,
  setUploadImage,
  setGridData,
}) => {
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
        {({ errors, touched, setFieldValue, values, handleSubmit }) => (
          <>
            {loading && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={`${headerData?.billType?.label} (${"Bill Register"})`}
              >
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={gridData?.length < 1}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={shipPointDDL || []}
                        value={values?.shipPoint}
                        label="Shippoint"
                        placeholder="Shippoint"
                        onChange={(valuesOption) => {
                          setFieldValue("shipPoint", valuesOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="distributionChannel"
                        options={distributionChannelDDL || []}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        placeholder="Select Distribution Channel"
                        onChange={(valuesOption) => {
                          setFieldValue("distributionChannel", valuesOption);
                          // getSoldToPartner(valuesOption?.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="partner"
                        options={partnerDDL || []}
                        value={values?.partner}
                        label="Partner"
                        placeholder="Select Partner"
                        onChange={(valuesOption) => {
                          setFieldValue("partner", valuesOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <NewSelect
                        name="accOfPartner"
                        options={accOfPartnerDDl || []}
                        value={values?.accOfPartner}
                        label="Account Of"
                        onChange={(valueOption) => {
                          setFieldValue("accOfPartner", valueOption);
                          setFieldValue("partner", valueOption);
                        }}
                        placeholder="Account Of"
                        errors={errors}
                        touched={touched}
                        // isDisabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Remarks</label>
                      <InputField
                        value={values?.remarks}
                        name="remarks"
                        placeholder="Remarks"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-6">
                      <button
                        className="btn btn-primary mr-2 mt-5"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                    </div>
                    <div className="col-lg-6 text-right">
                      <button
                        className="btn btn-primary mr-2 mt-5"
                        type="button"
                        onClick={() =>
                          getData(
                            values?.shipPoint?.value,
                            values?.partner?.value
                          )
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>

                  <DropzoneDialogBase
                    filesLimit={5}
                    acceptedFiles={["image/*"]}
                    fileObjects={fileObjects}
                    cancelButtonText={"cancel"}
                    submitButtonText={"submit"}
                    maxFileSize={1000000}
                    open={open}
                    onAdd={(newFileObjs) => {
                      setFileObjects([].concat(newFileObjs));
                    }}
                    onDelete={(deleteFileObj) => {
                      const newData = fileObjects.filter(
                        (item) => item.file.name !== deleteFileObj.file.name
                      );
                      setFileObjects(newData);
                    }}
                    onClose={() => setOpen(false)}
                    onSave={() => {
                      setOpen(false);
                      empAttachment_action(fileObjects).then((data) => {
                        setUploadImage(data);
                      });
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </Form>
                <GridView gridData={gridData} setGridData={setGridData} />
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default _Form;
