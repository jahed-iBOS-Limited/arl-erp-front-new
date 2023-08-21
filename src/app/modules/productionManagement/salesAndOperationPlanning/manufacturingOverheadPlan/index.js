import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import { getPlantDDL, getYearDDL, monthData } from "./helper";
import MonthlyModal from "./monthlyModal";

const initData = {
  plant: "",
  year: "",
  gl: "",
  glType: "",
};

export default function ManufacturingOverheadPlanLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [isShowModal, setisShowModal] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [glDDL, getGlDDL] = useAxiosGet();
  const [subGlRow, getSubGlRow, loading, setSubGlRow] = useAxiosGet();
  const [singleData, setSingleData] = useState();

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
            title="Overhead Plan"
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
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.plant}
                  />
                </div>
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
                            monthList: item?.monthList || monthData,
                            overheadType:
                              item?.overheadTypeId && item?.overheadTypeName
                                ? {
                                    value: item?.overheadTypeId,
                                    label: item?.overheadTypeName,
                                  }
                                : "",
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
                                { value: 1, label: "Fixed" },
                                {
                                  value: 2,
                                  label: "Variable/Per unit",
                                },
                              ]}
                              value={item?.overheadType}
                              onChange={(valueOption) => {
                                let modiFyRow = [...subGlRow];
                                modiFyRow[index]["overheadType"] = valueOption;
                                modiFyRow[index]["overheadTypeId"] =
                                  valueOption?.value;
                                modiFyRow[index]["overheadTypeName"] =
                                  valueOption?.label;
                                setSubGlRow(modiFyRow);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={+item?.universalAmount || ""}
                              type="number"
                              onChange={(e) => {
                                if (+e.target.value < 0) return;
                                let modiFyRow = [...subGlRow];
                                modiFyRow[index]["universalAmount"] =
                                  +e.target.value || "";
                                modiFyRow[index]["monthList"][0][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][1][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][2][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][3][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][4][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][5][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][6][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][7][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][8][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][9][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][10][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                modiFyRow[index]["monthList"][11][
                                  "intMonthLyValue"
                                ] = +e.target.value || "";
                                setSubGlRow(modiFyRow);
                              }}
                            />
                          </td>
                          <td className="text-center">
                            <div>
                              {item?.overheadType &&
                              item?.universalAmount &&
                              values?.plant &&
                              values?.year &&
                              values?.gl ? (
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">{"Create"}</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      className={`fas fa-pen-square pointer`}
                                      onClick={() => {
                                        setSingleData({ values, item });
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
            modelSize="lg"
            show={isShowModal}
            onHide={() => {
              setisShowModal(false);
            }}
          >
            <MonthlyModal
              singleData={singleData}
              setSingleData={setSingleData}
              setisShowModal={setisShowModal}
              getSubGlRow={getSubGlRow}
              setSubGlRow={setSubGlRow}
            />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
