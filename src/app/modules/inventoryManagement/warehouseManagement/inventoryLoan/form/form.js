import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import {
  getBusinessPartnerDDL,
  getItemDDL,
  getSBUListDDL_api,
  getShipmentDDL,
  getWarehouseDDL,
  SaveInventoryLoanValidationSchema,
} from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  modifySingleData,
  loanSingleData
}) {
  const [shipmentDDL, setShipmentDDL] = useState([]);
  const [warehouseDDL, setWarehouseDDL] = useState([]);
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [sbuDDL, setsbuDDL] = useState([])
  const polcList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    ).then((res) => res?.data);
  };

  useEffect(() => {
    getBusinessPartnerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPartnerDDL
    );
    getSBUListDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setsbuDDL
    )
    getWarehouseDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWarehouseDDL
    );
    getItemDDL(profileData?.accountId, selectedBusinessUnit?.value, setItemDDL);
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={loanSingleData?.loanId ? modifySingleData :{ ...initData }}
        validationSchema={SaveInventoryLoanValidationSchema}
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
          setValues,
        }) => (
          <>
            {console.log("Values", values)}
            {console.log("Errors", errors)}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row mb-2">
                  <div className="col-lg-3 d-flex align-items-center">
                    <input
                      type="radio"
                      name="createType"
                      disabled={loanSingleData?.loanId}
                      checked={values?.createType === 1}
                      onChange={() => {
                        setValues({ ...initData, createType: 1 });
                      }}
                    />
                    <label className="mx-2">Issue</label>

                    <input
                      type="radio"
                      name="createType"
                      disabled={loanSingleData?.loanId}
                      checked={values?.createType === 2}
                      onChange={() => {
                        setValues({ ...initData, createType: 2 });
                      }}
                    />
                    <label className="mx-2">Receive</label>
                  </div>
                </div>

                <div className="row">
                <div className="col-lg-3">
                    <NewSelect
                      name="sbu"
                      options={sbuDDL}
                      isDisabled={loanSingleData?.loanId}
                      value={values?.sbu}
                      label="Select SBU"
                      onChange={(valueOption) => {
                        setFieldValue("sbu", valueOption);
                      }}
                      placeholder="Select SBU"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={partnerDDL}
                      isDisabled={loanSingleData?.loanId}
                      value={values?.partner}
                      label="Business Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                      }}
                      placeholder="Business Partner"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Create Type For Issue */}
                  {values?.createType === 1 ? (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="issueFrom"
                          options={[
                            { value: 1, label: "Warehouse" },
                            { value: 2, label: "Shipment" },
                          ]}
                          value={values?.issueFrom}
                          isDisabled={loanSingleData?.loanId}
                          label="Issue From"
                          onChange={(valueOption) => {
                            setFieldValue("issueFrom", valueOption);
                          }}
                          placeholder="Issue From"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      {values?.issueFrom?.value === 1 ? (
                        <div className="col-lg-3">
                          <NewSelect
                            name="warehouse"
                            options={warehouseDDL}
                            value={values?.warehouse}
                            label="Warehouse"
                            isDisabled={loanSingleData?.loanId}
                            onChange={(valueOption) => {
                              setFieldValue("lcNo", "");
                              setFieldValue("shipment", "");
                              setFieldValue("warehouse", valueOption);
                            }}
                            placeholder="Warehouse"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      ) : null}

                      {values?.issueFrom?.value === 2 ? (
                        <>
                          <div className="col-lg-3">
                            <label>LC No</label>
                            <SearchAsyncSelect
                              selectedValue={values?.lcNo}
                              isSearchIcon={true}
                              isDisabled={loanSingleData?.loanId}
                              handleChange={(valueOption) => {
                                setFieldValue("lcNo", valueOption);
                                getShipmentDDL(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  valueOption?.label,
                                  setShipmentDDL
                                );
                              }}
                              loadOptions={polcList}
                              placeholder="Search by LC No"
                            />
                          </div>

                          <div className="col-lg-3">
                            <NewSelect
                              name="shipPoint"
                              options={shipmentDDL}
                              value={values?.shipPoint}
                              isDisabled={loanSingleData?.loanId}
                              label="Ship Point"
                              onChange={(valueOption) => {
                                setFieldValue("shipPoint", valueOption);
                              }}
                              placeholder="Ship Point"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}

                  <div className="col-lg-3">
                    <label>Lighter Vessel</label>
                    <InputField
                      value={values?.lighterVessel}
                      disabled={loanSingleData?.loanId}
                      name="lighterVessel"
                      onChange={(e) => {
                        setFieldValue("lighterVessel", e.target.value);
                      }}
                      placeholder="Lighter Vessel"
                      type="text"
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Mother Vessel</label>
                    <InputField
                      value={values?.motherVessel}
                      name="motherVessel"
                      disabled={loanSingleData?.loanId}
                      onChange={(e) => {
                        setFieldValue("motherVessel", e.target.value);
                      }}
                      placeholder="Mother Vessel"
                      type="text"
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Date</label>
                    <InputField
                      value={values?.date}
                      name="date"
                      disabled={loanSingleData?.loanId}
                      placeholder="Date"
                      type="date"
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Survey Report No</label>
                    <InputField
                      value={values?.surveyReportNo}
                      disabled={loanSingleData?.loanId}
                      name="surveyReportNo"
                      onChange={(e) => {
                        setFieldValue("surveyReportNo", e.target.value);
                      }}
                      placeholder="Survey Report No"
                      type="text"
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={itemDDL}
                      value={values?.item}
                      isDisabled={loanSingleData?.loanId}
                      label="Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      placeholder="Item Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Quantity</label>
                    <InputField
                      value={values?.quantity}
                      disabled={loanSingleData?.loanId}
                      name="quantity"
                      onChange={(e) => {
                        setFieldValue("quantity", e.target.value);
                      }}
                      placeholder="Quantity"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Narration</label>
                    <InputField
                      value={values?.narration}
                      name="narration"
                      disabled={loanSingleData?.loanId}
                      onChange={(e) => {
                        setFieldValue("narration", e.target.value);
                      }}
                      placeholder="Narration"
                      type="text"
                    />
                  </div>
                </div>
              </div>

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
                // onClick={() => setItemTypeId("")}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
