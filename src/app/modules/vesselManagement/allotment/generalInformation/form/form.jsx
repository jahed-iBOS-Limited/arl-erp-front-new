import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { BADCBCICForm } from "../../../common/components";
import { getMotherVesselDDL } from "../../tenderInformation/helper";
import { GetLighterVesselList, validationSchema } from "../helper";

export default function _Form({
  type,
  buId,
  title,
  accId,
  btnRef,
  initData,
  allSelect,
  setLoading,
  selectedAll,
  lighterList,
  saveHandler,
  resetBtnRef,
  shipPointDDL,
  organizationDDL,
  lighterDDL,
  lighterCNFDDL,
  getTenderInfo,
  setLighterList,
  rowDataHandler,
  motherVesselDDL,
  domesticPortDDL,
  setMotherVesselDDL,
  lighterStevedoreDDL,
}) {
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            setLighterList([]);
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
            saveHandler={
              type === "view"
                ? false
                : () => {
                    handleSubmit();
                  }
            }
            resetHandler={
              type === "view"
                ? false
                : () => {
                    resetForm(initData);
                  }
            }
            backHandler={() => {
              history.goBack();
            }}
          >
            <Form className="form form-label-right">
              <div className="row global-form ">
                {buId === 94 && (
                  <BADCBCICForm
                    values={values}
                    setFieldValue={setFieldValue}
                    disabled={type}
                  />
                )}
                {buId === 178 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="organization"
                      options={organizationDDL || []}
                      value={values?.organization}
                      label="Organization"
                      onChange={(valueOption) => {
                        setFieldValue("organization", valueOption);
                      }}
                      placeholder="Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <NewSelect
                    name="loadingPort"
                    options={domesticPortDDL || []}
                    value={values?.loadingPort}
                    label="Port"
                    onChange={(valueOption) => {
                      setFieldValue("loadingPort", valueOption);
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
                      // setFieldValue("programNo", valueOption?.programNo || "");
                      if (valueOption) {
                        const callBack = (resData) => {
                          setFieldValue("item", {
                            value: resData?.itemId,
                            label: resData?.itemName,
                          });
                          setFieldValue("cnf", {
                            value: resData?.cnfid,
                            label: resData?.cnfname,
                          });
                          setFieldValue("steveDore", {
                            value: resData?.stevdoreId,
                            label: resData?.stevdoreName,
                          });
                          setFieldValue("lotNo", resData?.lotNo);
                          setFieldValue("programNo", resData?.programNo);
                          GetLighterVesselList(
                            values?.loadingPort?.value,
                            valueOption?.value,
                            resData?.programNo,
                            setLighterList,
                            setLoading
                          );
                        };

                        getTenderInfo(
                          `/wms/FertilizerOperation/GetTenderInformation?AccountId=${accId}&BusinessUnitId=${buId}&MothervesselId=${valueOption?.value}&PortId=${values?.loadingPort?.value}`,
                          callBack
                        );
                      }

                      setLighterList([]);
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

                {lighterList?.length > 0 && (
                  <>
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
                              `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&SearchTerm=${searchValue}`
                            )
                            .then((res) => res?.data);
                        }}
                        isDisabled={true}
                      />
                      <FormikError
                        errors={errors}
                        name="item"
                        touched={touched}
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
                        isDisabled={true}
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
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.allotmentDate}
                        name="allotmentDate"
                        label="Allotment Date"
                        placeholder="Date"
                        type="date"
                        disabled={type}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                disabled={lighterList?.length < 1}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button> */}
            </Form>
            <div className="col-lg-6">
              {lighterList?.length > 0 && (
                <div
                  style={{ maxHeight: "450px" }}
                  className="scroll-table _table"
                >
                  <table className="global-table table table-font-size-sm">
                    <thead>
                      <tr>
                        {(!type || type === "edit") && (
                          <th
                            onClick={() => allSelect(!selectedAll())}
                            style={{ width: "40px" }}
                          >
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                        )}
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Lighter Vessel</th>
                        <th style={{ width: "130px" }}>Quantity</th>
                        {/* <th style={{ width: "200px" }}>Unloading Port</th> */}
                        <th style={{ width: "200px" }}>
                          Unloading Destination
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ overflow: "scroll" }}>
                      {lighterList?.map((itm, index) => (
                        <tr key={index}>
                          {(!type || type === "edit") && (
                            <td
                              onClick={() => {
                                rowDataHandler(
                                  "isSelected",
                                  index,
                                  !itm.isSelected
                                );
                              }}
                              className="text-center"
                              style={
                                itm?.isSelected
                                  ? {
                                      backgroundColor: "#aacae3",
                                      width: "40px",
                                    }
                                  : { width: "40px" }
                              }
                            >
                              <input
                                type="checkbox"
                                value={itm?.isSelected}
                                checked={itm?.isSelected}
                                onChange={() => {}}
                              />
                            </td>
                          )}
                          <td>{index + 1}</td>
                          <td>{itm?.label}</td>
                          <td className="text-right">
                            {type === "view" ? (
                              _fixedPoint(itm?.surveyQty, true)
                            ) : (
                              <InputField
                                value={itm?.surveyQty}
                                name="surveyQty"
                                placeholder="Survey Qty"
                                type="number"
                                min={0}
                                onChange={(e) => {
                                  rowDataHandler(
                                    "surveyQty",
                                    index,
                                    e?.target?.value
                                  );
                                }}
                              />
                            )}
                          </td>
                          {/* <td>
                              {type === "view" ? (
                                itm?.unloadingPort?.label
                              ) : (
                                <NewSelect
                                  name="unloadingPort"
                                  options={shipPointDDL || []}
                                  value={itm?.unloadingPort}
                                  onChange={(e) => {
                                    rowDataHandler("unloadingPort", index, e);
                                  }}
                                />
                              )}
                            </td> */}
                          <td>
                            {type === "view" ? (
                              itm?.lighterDestinationName
                            ) : (
                              <NewSelect
                                name="lighterDestination"
                                options={lighterDDL || []}
                                value={itm?.lighterDestination}
                                onChange={(e) => {
                                  rowDataHandler(
                                    "lighterDestination",
                                    index,
                                    e
                                  );
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                      {type === "view" && (
                        <tr>
                          <td colSpan={type ? 2 : 3} className="text-right">
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            {_fixedPoint(
                              lighterList?.reduce(
                                (a, b) => a + b?.surveyQty,
                                0
                              ),
                              true
                            )}
                          </td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
