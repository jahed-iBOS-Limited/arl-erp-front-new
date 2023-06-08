import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import ICustomTable from "../../../../_helper/_customTable";
import IViewModal from "../../../../_helper/_viewModal";
import JoditEditor from "jodit-react";
import { SpDescriptionModal } from "../spDescriptionModal/addEditForm";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { getDocumentDetails, removeTags } from "../helper";
import DesciptionDetails from "../descriptionDetailsModal/DesciptionDetails";
import MyIcon from "../myIcon";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  documentTypeDDL,
  getDocumentTypeDDL,
  setDocumentTypeDDL,
  documentDetails,
  setDocumentDetails,
  setDocumentId,
  documentId,
}) {
  const [isShowModal, setisShowModal] = useState(false);
  const [isShowModalTwo, setisShowModalTwo] = useState(false);
  let ths = ["System Define Name", "Dispaly Name", "Description", "Action"];

  const editHandler = (setFieldValue, item) => {
    setFieldValue("systemDefineName", item?.strSystemName);
    setFieldValue("displayName", item?.strDisplayName);
    setFieldValue("description", item?.strDescription);
    setFieldValue("documentType", {
      value: item?.intDocumentTypeId,
      label: item?.strDocumentTypeName,
    });
    setDocumentId(item?.intId);
  };

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
              <div className="form-group global-form">
                <div className="row">
                  <div className="col-lg-4 d-flex">
                    <div style={{ width: "300px" }}>
                      <NewSelect
                        label="Document Type"
                        placeholder="Document Type"
                        name="documentType"
                        options={documentTypeDDL}
                        value={values?.documentType}
                        onChange={(valueOption) => {
                          setFieldValue("documentType", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        disabled={documentId > 0}
                      />
                    </div>
                    <div
                      style={{ marginTop: "16px" }}
                      className="p-1 text-primary"
                    >
                      <i
                        onClick={() => {
                          setisShowModal(true);
                        }}
                        style={{ color: "#187DE4" }}
                        class="fas fa-plus-circle"
                      ></i>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <InputField
                      label="System Define Name"
                      placeholder="System Define Name"
                      name="systemDefineName"
                      value={values?.systemDefineName}
                      onChange={(e) => {
                        setFieldValue("systemDefineName", e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-lg-4">
                    <InputField
                      label="Display Name"
                      placeholder="Display Name"
                      name="displayName"
                      value={values?.displayName}
                      onChange={(e) => {
                        setFieldValue("displayName", e.target.value);
                      }}
                    />
                  </div>

                  <div style={{ marginTop: "40px" }} className="col-lg-12">
                    <JoditEditor
                      value={values?.description}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) =>
                        setFieldValue("description", newContent)
                      } // preferred to use only this option to update the content for performance reasons
                      onChange={(newContent) => {}}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{ marginTop: "40px" }}
                className="form-group row global-form"
              >
                <div className="col-lg-4">
                  <NewSelect
                    label="Document Type"
                    placeholder="Document Type"
                    name="documentTypeTwo"
                    options={documentTypeDDL}
                    value={values?.documentTypeTwo}
                    onChange={(valueOption) => {
                      setFieldValue("documentTypeTwo", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div style={{ marginTop: "14px" }} className="col-lg-2">
                  <ButtonStyleOne
                    style={{ fontSize: "12px" }}
                    disabled={!values?.documentTypeTwo}
                    label="View"
                    type="button"
                    onClick={() => {
                      getDocumentDetails(
                        setDocumentDetails,
                        values?.documentTypeTwo?.value
                      );
                      resetForm(initData);
                    }}
                  />
                </div>
              </div>

              <ICustomTable ths={ths} className="table-font-size-sm">
                {documentDetails?.map((item) => (
                  <tr>
                    <td className="text-left">{item?.strSystemName}</td>
                    <td>{item.strDisplayName}</td>
                    <td>
                      {removeTags(item?.strDescription)}
                      {removeTags(item?.strDescription)?.length > 234 && (
                        <span
                          onClick={() => {
                            setisShowModalTwo(true);
                          }}
                          className="text-primary"
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            marginLeft: "5px",
                            cursor: "pointer",
                          }}
                        >
                          more...
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      <div className="sp-description-icon">
                        <MyIcon
                          editHandler={editHandler}
                          setFieldValue={setFieldValue}
                          item={item}
                          setisShowModalTwo={setisShowModalTwo}
                        />
                      </div>
                    </td>

                    <IViewModal
                      show={isShowModalTwo}
                      onHide={() => setisShowModalTwo(false)}
                      modelSize={"lg"}
                    >
                      <DesciptionDetails description={item?.strDescription} />
                    </IViewModal>
                  </tr>
                ))}
              </ICustomTable>

              {/* modal */}
              <IViewModal
                show={isShowModal}
                onHide={() => setisShowModal(false)}
                modelSize={"lg"}
              >
                <SpDescriptionModal
                  setDocumentTypeDDL={setDocumentTypeDDL}
                  getDocumentTypeDDL={getDocumentTypeDDL}
                />
              </IViewModal>

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
