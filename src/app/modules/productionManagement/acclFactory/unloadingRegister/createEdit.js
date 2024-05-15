import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import {
  onGetUnloadingRegister,
  onUnloadingRegister,
  unloadingRegisterValidationSchema,
} from "./helper";

const initData = {
  lighterVessel: "",
  rawMaterialName: "",
  uom: "",
  startDTime: "",
  endDTime: "",
  unloadPoint: "",
  remarks: "",
  //
  // for row
  rawMetarialItem: null,
};

export default function UnloadingRegisterCreate() {
  const [objProps, setObjprops] = useState({});
  const [
    rawMaterialDDL,
    getRawMaterialDDL,
    loadingOnGetRawMaterialDDL,
  ] = useAxiosGet();
  const [selectedRawMaterial, setSelectedRawMaterial] = useState([]);
  const [, createHandler, loadingOnCreate] = useAxiosPost();
  const [modifyData, setModifyData] = useState({});
  const [
    lighterVesselDDL,
    getLighterVesselDDL,
    loadingOnGetLghtrVsslDDL,
  ] = useAxiosGet();

  const { id } = useParams();
  const history = useHistory();
  const { profileData, selectedBusinessUnit } = useSelector(
    (store) => store?.authData,
    shallowEqual
  );
  const [
    cargoUnloadingStatementInfo,
    getCargoUnloadingStatementById,
    loadingOnGetData,
  ] = useAxiosGet();
  useEffect(() => {
    if (id) {
      onGetUnloadingRegister(
        id,
        getCargoUnloadingStatementById,
        setModifyData,
        setSelectedRawMaterial
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getRawMaterialDDL(`/mes/MSIL/GetProductionUnloadingItemDDL`);
    getLighterVesselDDL(
      `/mes/MSIL/GetLighterVesselDDLFromCargoUnloading?intAccountId=${profileData?.accountId}&intBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IForm title="Create Unloading Register" getProps={setObjprops}>
      {(loadingOnGetData ||
        loadingOnCreate ||
        loadingOnGetLghtrVsslDDL ||
        loadingOnGetRawMaterialDDL) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={id ? modifyData : initData}
          validationSchema={unloadingRegisterValidationSchema({
            isOwnLighterVessel:
              cargoUnloadingStatementInfo?.objHeader?.isOwnLighterVessel,
          })}
          onSubmit={(values, { resetForm }) => {
            onUnloadingRegister(
              createHandler,
              values,
              selectedRawMaterial,
              setSelectedRawMaterial,
              id,
              profileData,
              selectedBusinessUnit,
              () => {
                if (id) {
                  history.goBack();
                } else {
                  resetForm(initData);
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
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    {cargoUnloadingStatementInfo?.objHeader
                      ?.isOwnLighterVessel ? (
                      <NewSelect
                        name="lighterVessel"
                        options={lighterVesselDDL || []}
                        value={values?.lighterVessel}
                        label="Lighter Vessel"
                        onChange={(valueOption) => {
                          setFieldValue("lighterVessel", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    ) : (
                      <InputField
                        value={values?.lighterVessel}
                        label="Lighter Vessel"
                        name="lighterVessel"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("lighterVessel", e.target.value);
                        }}
                        touched={touched}
                      />
                    )}
                  </div>
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

                  <div className="col-lg-3">
                    <NewSelect
                      name="unloadPoint"
                      options={[
                        { value: 1, label: "Crane-1(700 Series) ACCL" },
                        { value: 2, label: "Crane-2(1500 Series) VRM-2" },
                      ]}
                      value={values?.unloadPoint}
                      label="Unload Point"
                      onChange={(valueOption) => {
                        setFieldValue("unloadPoint", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
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
                    resetForm(initData);
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
                  <div className="col-md-8">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "50px" }}>SL</th>
                            <th>Raw Material</th>
                            <th>UoM</th>
                            <th>Quantity</th>
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
