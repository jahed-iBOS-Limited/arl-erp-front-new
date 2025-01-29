/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import { storiedList } from "../helper";
import IButton from "../../../../_helper/iButton";
import AttachFile from "../../../../_helper/commonInputFieldsGroups/attachemntUpload";

export default function _Form({
  viewType,
  initData,
  saveHandler,
  setUploadedImage,
}) {
  const history = useHistory();
  const [open, setOpen] = useState(false);

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
              title={`Home Builders Information Entry`}
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
                        name="type"
                        options={[
                          { value: 1, label: "Engineer" },
                          { value: 2, label: "Mason" },
                          { value: 3, label: "IHB" },
                        ]}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                        }}
                        placeholder="Type"
                      />
                    </div>
                    <RATForm obj={{ values, setFieldValue }} />
                    <div className="col-lg-3">
                      <InputField
                        label="Name"
                        value={values?.name}
                        name="name"
                        placeholder="Name"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Address"
                        value={values?.address}
                        name="address"
                        placeholder="Address"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Contact Number"
                        value={values?.contactNumber}
                        name="contactNumber"
                        placeholder="Contact Number"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Email"
                        value={values?.email}
                        name="email"
                        placeholder="Email"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="NID Number"
                        value={values?.nidNumber}
                        name="nidNumber"
                        placeholder="NID Number"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Birth Date"
                        value={values?.birthDate}
                        name="birthDate"
                        placeholder="Birth Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Project Status"
                        value={values?.projectStatus}
                        name="projectStatus"
                        placeholder="Project Status"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="storiedType"
                        options={storiedList()}
                        value={values?.storiedType}
                        label="Storied Type"
                        onChange={(valueOption) => {
                          setFieldValue("storiedType", valueOption);
                        }}
                        placeholder="Storied Type"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Start Date"
                        value={values?.startDate}
                        name="startDate"
                        placeholder="Start Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Approximate End Date"
                        value={values?.approximateEndDate}
                        name="approximateEndDate"
                        placeholder="Approximate End Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Using Brand"
                        value={values?.usingBrand}
                        name="usingBrand"
                        placeholder="Using Brand"
                        type="text"
                      />
                    </div>
                    <IButton
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      NID Upload
                    </IButton>
                  </div>
                </div>
                <AttachFile
                  obj={{
                    open,
                    setOpen,
                    setUploadedImage,
                  }}
                />
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
