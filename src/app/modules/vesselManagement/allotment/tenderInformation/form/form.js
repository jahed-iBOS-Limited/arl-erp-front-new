import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  getMotherVesselDDL,
  getMotherVesselInfo,
  validationSchema
} from "../helper";

export default function _Form({
  type,
  buId,
  title,
  accId,
  portDDL,
  initData,
  setLoading,
  saveHandler,
  lighterCNFDDL,
  motherVesselDDL,
  setMotherVesselDDL,
  lighterStevedoreDDL,
}) {
  const radioStyle = { height: "25px", width: "25px" };
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => resetForm(initData)}
            saveHandler={() => handleSubmit()}
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-12 mt-3 d-flex">
                  <div className="d-flex align-items-center mr-5">
                    <input
                      style={radioStyle}
                      type="radio"
                      name="type"
                      id="badc"
                      value={values?.type}
                      checked={values?.type === "badc"}
                      onChange={() => {
                        setFieldValue("type", "badc");
                      }}
                      disabled={type === "view"}
                    />
                    <label htmlFor="badc" className="ml-1">
                      <h3>BADC</h3>
                    </label>
                  </div>
                  <div className="d-flex align-items-center ml-5">
                    <input
                      style={radioStyle}
                      type="radio"
                      name="type"
                      id="bcic"
                      value={values?.type}
                      checked={values?.type === "bcic"}
                      onChange={() => {
                        setFieldValue("type", "bcic");
                      }}
                      disabled={type === "view"}
                    />
                    <label htmlFor="bcic" className="ml-1">
                      <h3>BCIC</h3>
                    </label>
                  </div>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="port"
                    options={portDDL || []}
                    value={values?.port}
                    label="Port"
                    onChange={(valueOption) => {
                      setFieldValue("port", valueOption);
                      setFieldValue("motherVessel", "");
                      getMotherVesselDDL(
                        accId,
                        buId,
                        setMotherVesselDDL,
                        valueOption?.value
                      );
                    }}
                    placeholder="Port"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={motherVesselDDL}
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    onChange={(valueOption) => {
                      setFieldValue("motherVessel", valueOption);

                      if (values?.port && valueOption) {
                        getMotherVesselInfo(
                          valueOption?.value,
                          values?.port?.value,
                          setLoading,
                          (resData) => {
                            setFieldValue(
                              "programNo",
                              resData?.programNo || ""
                            );
                            setFieldValue("item", {
                              value: resData?.intProductId,
                              label: resData?.strProductName,
                            });
                            setFieldValue("lotNo", resData?.strLotNumber || "");
                          }
                        );
                      }
                    }}
                    placeholder="Mother Vessel"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Program No</label>
                  <InputField
                    value={values?.programNo}
                    name="programNo"
                    placeholder="Program No"
                    type="text"
                    disabled
                  />
                </div>

                <div className="col-lg-3">
                  <label>Item</label>
                  <SearchAsyncSelect
                    selectedValue={values?.item}
                    handleChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    placeholder="Search Item"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${
                            values?.type === "badc" ? 73244 : 73245
                          }&SearchTerm=${searchValue}`
                        )
                        .then((res) => res?.data);
                    }}
                    isDisabled={true}
                  />
                  <FormikError errors={errors} name="item" touched={touched} />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="UoM"
                    options={[{ value: 1, label: "Ton" }]}
                    value={values?.UoM}
                    label="UoM"
                    onChange={(valueOption) => {
                      setFieldValue("UoM", valueOption);
                    }}
                    placeholder="UoM"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.lotNo}
                    name="lotNo"
                    label="Lot No"
                    placeholder="Lot No"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.award}
                    name="award"
                    label="Award"
                    placeholder="Award"
                    type="text"
                    disabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="cnf"
                    options={lighterCNFDDL || []}
                    value={values?.cnf}
                    label="CNF"
                    onChange={(valueOption) => {
                      setFieldValue("cnf", valueOption);
                    }}
                    placeholder="CNF"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="steveDore"
                    options={lighterStevedoreDDL || []}
                    value={values?.steveDore}
                    label="Steve Dore"
                    onChange={(valueOption) => {
                      setFieldValue("steveDore", valueOption);
                    }}
                    placeholder="Steve Dore"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.programQuantity}
                    name="programQuantity"
                    placeholder="Program Quantity"
                    label="Program Quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("programQuantity", e.target.value);
                      setFieldValue("weight", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.weight}
                    name="weight"
                    placeholder="Weight"
                    label="Weight"
                    type="text"
                  />
                </div>
              </div>
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
