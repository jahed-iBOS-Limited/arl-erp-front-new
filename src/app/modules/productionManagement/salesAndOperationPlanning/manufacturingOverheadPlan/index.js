import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import { getHorizonDDL, getPlantDDL, getYearDDL } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import MonthlyModal from "./monthlyModal";

const initData = {
  plant: "",
  year: "",
  // horizon: "",
  gl: "",
  glType: "",
};

// const validationSchema = Yup.object().shape({
//   item: Yup.object()
//     .shape({
//       label: Yup.string().required("Item is required"),
//       value: Yup.string().required("Item is required"),
//     })
//     .typeError("Item is required"),

//   remarks: Yup.string().required("Remarks is required"),
//   amount: Yup.number().required("Amount is required"),
//   date: Yup.date().required("Date is required"),
// });

export default function ManufacturingOverheadPlanLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [isShowModal, setisShowModal] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [horizonDDL, setHorizonDDL] = useState([]);
  const [glDDL, getGlDDL] = useAxiosGet();
  const [subGlRow, getSubGlRow, loading, setSubGlRow] = useAxiosGet();

  useEffect(() => {
    getPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
    getGlDDL(
      `/mes/SalesPlanning/GetGeneralLedgers?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&accountGroupId=4`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Manufacturing Overhead Plan"
            getProps={setObjprops}
            isHiddenBack
            isHiddenReset
            isHiddenSave
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL}
                    value={values?.plant}
                    label="Plant"
                    placeholder="Plant"
                    onChange={async (valueOption) => {
                      setFieldValue("plant", valueOption);
                      getYearDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setYearDDL
                      );
                      if (values?.year?.value) {
                        getHorizonDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          valueOption?.value,
                          setHorizonDDL
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={yearDDL}
                    value={values?.year}
                    label="Year"
                    placeholder="Year"
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                      setFieldValue("horizon", "");
                      getHorizonDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plant?.value,
                        valueOption?.value,
                        setHorizonDDL
                      );
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.plant}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="horizon"
                    options={horizonDDL}
                    value={values?.horizon}
                    label="Planning Horizon"
                    placeholder="Planning Horizon"
                    onChange={(valueOption) => {
                      setFieldValue("horizon", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.plant || !values?.year}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="gl"
                    options={glDDL || []}
                    value={values?.gl}
                    label="GL Name"
                    onChange={(valueOption) => {
                      setFieldValue("gl", valueOption);
                      getSubGlRow(
                        `/mes/SalesPlanning/GetBusinessTransactionsAsync?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&generalLedgerId=${valueOption?.value}`,
                        (data) => {
                          let modiFyRow = data?.map((item) => ({
                            ...item,
                            overheadType: null,
                            standardValue: null,
                          }));
                          setSubGlRow(modiFyRow);
                        }
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered  global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Code</th>
                        <th>Sub GL Name</th>
                        <th style={{ minWidth: "200px" }}>Overhead Type</th>
                        <th>Standard Value Per Unit/Montly</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subGlRow?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.businessTransactionCode}</td>
                          <td>{item?.businessTransactionName}</td>
                          <td>
                            <NewSelect
                              name="overheadType"
                              options={[
                                { value: "Fixed", label: "Fixed" },
                                {
                                  value: "Variable/Per unit",
                                  label: "Variable/Per unit",
                                },
                              ]}
                              value={item?.overheadType}
                              onChange={(valueOption) => {
                                let modiFyRow = [...subGlRow];
                                modiFyRow[index]["overheadType"] = valueOption;
                                setSubGlRow(modiFyRow);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.standardValue}
                              type="number"
                              onChange={(e) => {
                                let modiFyRow = [...subGlRow];
                                modiFyRow[index]["standardValue"] =
                                  +e.target.value || "";
                                setSubGlRow(modiFyRow);
                              }}
                            />
                          </td>
                          <td className="text-center">
                            <div>
                              {item?.overheadType && item?.standardValue ? (
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">{"Create"}</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      className={`fas fa-pen-square pointer`}
                                      onClick={() => {
                                        setisShowModal(true);
                                      }}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>

          <IViewModal
            modelSize="md"
            show={isShowModal}
            onHide={() => setisShowModal(false)}
          >
            <MonthlyModal />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
