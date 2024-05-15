import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import IDelete from "../../../_helper/_helperIcons/_delete";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import {
  getCargoUnloadingStatementInitialData,
  getCargoUnloadingStatementValidationSchema,
  loadPoListForCargoUnloading,
  onCreateOrEditCargoUnloadingStatement,
  renitializeCargoUnloadingState,
} from "./helper";
import { toast } from "react-toastify";
import FormikError from "../../../_helper/_formikError";

export default function CargoUnloadingStatementCreate() {
  const [objProps, setObjprops] = useState({});
  const [
    rawMaterialDDL,
    getRawMaterialDDL,
    loadingOnGetRawMaterialDDL,
  ] = useAxiosGet();
  const [, createHandler, loadingOnCreateOredit] = useAxiosPost();
  const [modifyData, setModifyData] = useState({});
  const [, getLcDDL, loadingOnGetLcDDL] = useAxiosGet();
  const [viewType, setViewType] = useState(1);
  const [lighterVesselDDL, getLighterVesselDDL] = useAxiosGet();
  const [selectedRawMaterial, setSelectedRawMaterial] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const [
    ,
    getCargoUnloadingStatementById,
    loadingOnGetCargoUnloadingStatement,
  ] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector(
    (store) => store?.authData,
    shallowEqual
  );
  useEffect(() => {
    if (id) {
      setViewType(location?.state?.isOwnLighterVessel);
      renitializeCargoUnloadingState(
        setModifyData,
        setSelectedRawMaterial,
        id,
        getCargoUnloadingStatementById
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, id]);

  useEffect(() => {
    getRawMaterialDDL(`/mes/MSIL/GetProductionUnloadingItemDDL`);
    getLighterVesselDDL(
      `/mes/MSIL/GetLighterVesselDDL?intAccountId=${
        profileData?.accountId
      }&intBusinessUnitId=${17}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  return (
    <IForm title="Create Cargo Unloading Statement" getProps={setObjprops}>
      {(loadingOnCreateOredit ||
        loadingOnGetLcDDL ||
        loadingOnGetCargoUnloadingStatement ||
        loadingOnGetRawMaterialDDL) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={
            id ? modifyData : getCargoUnloadingStatementInitialData()
          }
          validationSchema={getCargoUnloadingStatementValidationSchema()}
          onSubmit={(values, { resetForm, setFieldValue }) => {
            onCreateOrEditCargoUnloadingStatement(
              setFieldValue,
              profileData,
              selectedBusinessUnit,
              id,
              viewType,
              selectedRawMaterial,
              setSelectedRawMaterial,
              values,
              createHandler,
              () => {
                if (id) {
                  history.goBack();
                } else {
                  resetForm();
                  setSelectedRawMaterial([]);
                }
              }
            );
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <>
                  <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 1}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(valueOption) => {
                          setViewType(1);
                          setFieldValue("lighterVessel", "");
                        }}
                      />
                      Own Lighter Vessel
                    </label>
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 0}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setViewType(0);
                          setFieldValue("lighterVessel", "");
                        }}
                      />
                      Others
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === null}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setViewType(null);
                          setFieldValue("lighterVessel", "");
                        }}
                      />
                      Loan
                    </label>
                  </div>
                </>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    {viewType === 1 ? (
                      <NewSelect
                        name="lighterVessel"
                        options={lighterVesselDDL || []}
                        value={values?.lighterVessel}
                        label="Lighter Vessel"
                        onChange={(valueOption) => {
                          setFieldValue("lighterVessel", valueOption);
                          setFieldValue("lighterVesselError", null);
                        }}
                      />
                    ) : (
                      <InputField
                        value={values?.lighterVessel}
                        label="Lighter Vessel"
                        name="lighterVessel"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("lighterVessel", e.target.value);
                          setFieldValue("lighterVesselError", null);
                        }}
                      />
                    )}
                    {values?.lighterVesselError && (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 400,
                          width: "100%",
                          marginTop: "0",
                          marginBottom: "0",
                        }}
                        className="text-danger"
                      >
                        {values?.lighterVesselError}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.motherVessel}
                      label="Mother Vessel"
                      name="motherVessel"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("motherVessel", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.mobileNo}
                      label="Mobile Number"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("mobileNo", e.target.value);
                      }}
                    />
                    <FormikError
                      errors={errors}
                      touched={touched}
                      name="mobileNo"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.bnQyt}
                      label="BN QTY"
                      name="bnQyt"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        setFieldValue("bnQyt", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.surveyQty}
                      label="Survey QTY"
                      name="surveyQty"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        setFieldValue("surveyQty", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.surveyNo}
                      label="Survey No"
                      name="surveyNo"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("surveyNo", e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.receiveDTime}
                      label="Receive Date & Time"
                      name="receiveDTime"
                      type="datetime-local"
                      onChange={(e) => {
                        setFieldValue("receiveDTime", e.target.value);
                      }}
                      disabled={id}
                    />
                  </div>
                  {id ? (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.startDTime}
                        label="Start Date & Time"
                        name="startDTime"
                        type="datetime-local"
                        onChange={(e) => {
                          setFieldValue("startDTime", e.target.value);
                        }}
                      />
                    </div>
                  ) : null}

                  {id ? (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.endDTime}
                        label="End Date & Time"
                        name="endDTime"
                        type="datetime-local"
                        onChange={(e) => {
                          setFieldValue("endDTime", e.target.value);
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.hatchNo}
                      label="Number of Hatch"
                      name="hatchNo"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        setFieldValue("hatchNo", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.coo}
                      label="C.O.O"
                      name="coo"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("coo", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.remarks}
                      label="Remarks"
                      name="remarks"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("remarks", e.target.value);
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onClick={handleSubmit}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onClick={() => {
                    setSelectedRawMaterial([]);
                    resetForm();
                  }}
                ></button>
              </Form>
              <div className="form-group  global-form row">
                <div className="col-md-3">
                  <NewSelect
                    name="rawMaterialName"
                    options={rawMaterialDDL || []}
                    value={values?.rawMetarialItem}
                    label="Raw Material"
                    onChange={(valueOption) => {
                      let alreadyExist = selectedRawMaterial.some(
                        (item) => item?.value === valueOption?.value
                        // (id ? item?.rawMaterialId : item?.value) === valueOption?.value
                      );
                      if (alreadyExist) {
                        toast.warn(`${valueOption?.label} already added`);
                      } else {
                        setFieldValue("rawMetarialItem", valueOption);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    style={{ marginTop: "18px" }}
                    type="button"
                    className="btn btn-primary ml-3"
                    onClick={() => {
                      setSelectedRawMaterial((prev) => [
                        ...prev,
                        values?.rawMetarialItem,
                      ]);
                      setFieldValue("rawMetarialItem", null);
                    }}
                    disabled={!values?.rawMetarialItem}
                  >
                    Add
                  </button>
                </div>
              </div>
              {selectedRawMaterial?.length > 0 && (
                <div className="row mt-5">
                  <div className="col-md-12">
                  <div className="table-responsive">
 <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}>SL</th>
                          <th>Raw Material</th>
                          <th style={{ width: "100px" }}>UoM</th>
                          <th style={{ width: "200px" }}>Quantity</th>
                          {viewType !== null ? (
                            <>
                              <th style={{ width: "200px" }}>PO Number</th>
                              <th style={{ width: "200px" }}>LC Number</th>
                            </>
                          ) : null}
                          <th style={{ width: "70px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRawMaterial.map((item, index) => (
                          <tr>
                            <td className="text-center">{index + 1}</td>
                            <td>{item?.label}</td>
                            <td className="text-center">{item?.uoM}</td>
                            <td>
                              <InputField
                                name="quantity"
                                value={item?.quantity}
                                type="number"
                                onChange={(e) => {
                                  const modifiedSelectedRawMaterial = selectedRawMaterial.map(
                                    (nestedItem) =>
                                      nestedItem?.value === item?.value
                                        ? {
                                            ...nestedItem,
                                            quantity: e.target.value || "",
                                            quantityError: null,
                                          }
                                        : nestedItem
                                  );
                                  setSelectedRawMaterial(
                                    modifiedSelectedRawMaterial
                                  );
                                }}
                              />
                              {item?.quantityError && (
                                <p
                                  style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 400,
                                    width: "100%",
                                    marginTop: "0",
                                    marginBottom: "0",
                                  }}
                                  className="text-danger"
                                >
                                  {item?.quantityError}
                                </p>
                              )}
                            </td>
                            {viewType !== null ? (
                              <>
                                <td>
                                  <SearchAsyncSelect
                                    selectedValue={item?.poNo}
                                    handleChange={(valueOption) => {
                                      if (valueOption) {
                                        getLcDDL(
                                          `/mes/MSIL/GetLcDDL?intAccountId=${profileData?.accountId}&intBusinessUnitId=${selectedBusinessUnit?.value}&intPoId=${valueOption?.value}`,
                                          (data) => {
                                            const modifiedSelectedRawMaterial = selectedRawMaterial.map(
                                              (nestedItem) =>
                                                nestedItem?.value ===
                                                item?.value
                                                  ? {
                                                      ...nestedItem,
                                                      lcDDL: data,
                                                      lcNo: "",
                                                      poNo: valueOption,
                                                      poNoError: null,
                                                    }
                                                  : nestedItem
                                            );
                                            setSelectedRawMaterial(
                                              modifiedSelectedRawMaterial
                                            );
                                          }
                                        );
                                      } else {
                                        const modifiedSelectedRawMaterial = selectedRawMaterial.map(
                                          (nestedItem) =>
                                            nestedItem?.value === item?.value
                                              ? {
                                                  ...nestedItem,
                                                  lcDDL: [],
                                                  lcNo: "",
                                                  poNo: "",
                                                  poNoError: null,
                                                }
                                              : nestedItem
                                        );
                                        setSelectedRawMaterial(
                                          modifiedSelectedRawMaterial
                                        );
                                      }
                                    }}
                                    loadOptions={(v) =>
                                      loadPoListForCargoUnloading(
                                        v,
                                        profileData,
                                        selectedBusinessUnit
                                      )
                                    }
                                  />
                                  {item?.poNoError && (
                                    <p
                                      style={{
                                        fontSize: "0.9rem",
                                        fontWeight: 400,
                                        width: "100%",
                                        marginTop: "0",
                                        marginBottom: "0",
                                      }}
                                      className="text-danger"
                                    >
                                      {item?.poNoError}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  <NewSelect
                                    name="lcNo"
                                    options={item?.lcDDL || []}
                                    value={item?.lcNo}
                                    onChange={(valueOption) => {
                                      const modifiedSelectedRawMaterial = selectedRawMaterial.map(
                                        (nestedItem) =>
                                          nestedItem?.value === item?.value
                                            ? {
                                                ...nestedItem,
                                                lcNo: valueOption,
                                                lcNoError: null,
                                              }
                                            : nestedItem
                                      );
                                      setSelectedRawMaterial(
                                        modifiedSelectedRawMaterial
                                      );
                                    }}
                                  />
                                  {item?.lcNoError && (
                                    <p
                                      style={{
                                        fontSize: "0.9rem",
                                        fontWeight: 400,
                                        width: "100%",
                                        marginTop: "0",
                                        marginBottom: "0",
                                      }}
                                      className="text-danger"
                                    >
                                      {item?.lcNoError}
                                    </p>
                                  )}
                                </td>
                              </>
                            ) : null}
                            <td
                              className="text-center"
                              style={{ width: "60px" }}
                            >
                              <IDelete
                                remover={(givenValue) => {
                                  let modifiedSelectedRawMaterial = selectedRawMaterial.filter(
                                    (nestedItem) =>
                                      nestedItem?.value !== givenValue
                                  );
                                  setSelectedRawMaterial(
                                    modifiedSelectedRawMaterial
                                  );
                                }}
                                id={item?.value}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
</div>
                   
                  </div>
                </div>
              )}
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
