import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import IForm from "../../../_helper/_form";
import { IInput } from "../../../_helper/_input";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import CommonTable from "../../../_helper/commonTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import {
  tblCostComponentHeaders,
  tblHeaders,
  tblMaterialCostHeaders,
} from "./helper";

const initData = {};
export default function CostConfigurationCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState(initData);
  const [keyLocationDDL, getKeyLocationDDL] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // getKeyLocationDDL(
    //   `/mes/MesDDL/GetKeyLocationDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}`
    // );
    // getKeyProviderDDL(
    //   `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}`
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // if (id) {
    //   setModifyData({
    //     date: _dateFormatter(location?.state?.dteDate),
    //     keyReceiverName: {
    //       value: location?.state?.intKeyReceiverEnroll,
    //       label: location?.state?.strKeyReceiverName,
    //     },
    //     designation: location?.state?.strDesignation,
    //     keyLocation: {
    //       value: location?.state?.intKeyLocationId,
    //       label: location?.state?.strKeyLocation,
    //     },
    //     keyQuantity: location?.state?.numKeyQuantity,
    //     keyProvideTime: location?.state?.tmKeyProvideTime,
    //     keyReceiveTime: location?.state?.tmKeyReceiveTime,
    //     keyProviderName: {
    //       value: location?.state?.intKeyProviderEnroll,
    //       label: location?.state?.strKeyProviderName,
    //     },
    //     keyProviderNameForEdit: location?.state?.strKeyReceivedFrom || "",
    //     keyReceiverNameForEdit: (location?.state?.intKeyReceivedBy && location?.state?.strKeyReceivedBy) ? { value: location?.state?.intKeyReceivedBy, label: location?.state?.strKeyReceivedBy } : "",
    //   });
    // }
  }, [id, location]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/KeyRegisterCreateAndEdit`,
      {
        intGateKeyRegisterId: id || 0,
        dteDate: values?.date,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intKeyReceiverEnroll: values?.keyReceiverName?.value,
        strKeyReceiverName: values?.keyReceiverName?.label,
        intDesignationId: 0,
        strDesignation: values?.designation,
        intKeyLocationId: values?.keyLocation?.value,
        strKeyLocation: values?.keyLocation?.label,
        numKeyQuantity: +values?.keyQuantity,
        tmKeyProvideTime: values?.keyProvideTime,
        tmKeyReceiveTime: values?.keyReceiveTime,
        intKeyProviderEnroll: values?.keyProviderName?.value,
        strKeyProviderName: values?.keyProviderName?.label,
        strRemarks: "",
        intActionBy: profileData?.userId,
        // dteInsertDate: _todayDate(),
        isActive: true,
        strKeyReceivedFrom: values?.keyProviderNameForEdit || "",
        intKeyReceivedBy: values?.keyReceiverNameForEdit?.value || 0,
        strKeyReceivedBy: values?.keyReceiverNameForEdit?.label || "",
      },
      id ? "" : cb,
      true
    );
  };

  return (
    <IForm title="Create Cost Calculation" getProps={setObjprops}>
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={id ? modifyData : initData}
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
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        label="Product"
                        options={[]}
                        value={values?.product}
                        name="product"
                        onChange={(valueOption) => {
                          setFieldValue("product", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="UOM"
                        options={[]}
                        value={values?.uomName}
                        name="uomName"
                        onChange={(valueOption) => {
                          setFieldValue("uomName", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="Finish Good"
                        options={[]}
                        value={values?.finishGood}
                        name="finishGood"
                        onChange={(valueOption) => {
                          setFieldValue("finishGood", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <label>চাবি গ্রহনকারীর নাম</label>
                      <SearchAsyncSelect
                        selectedValue={values?.keyReceiverName}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("keyReceiverName", valueOption);
                          setFieldValue("designation", valueOption?.employeeInfoDesignation || "");
                        }}
                        loadOptions={loadKeyReceiverName}
                        isDisabled={id}
                      />
                    </div> */}
                  </div>
                </div>
                <h2 className="mt-3">Material Cost</h2>
                <CommonTable headersData={tblMaterialCostHeaders}>
                  <tbody>
                    {[1, 2, 3]?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{item?.dispatchType}</td>
                        <td className="text-center">
                          {item?.documentMaterialName}
                        </td>
                        <td className="disabled-feedback disable-border">
                          <IInput
                            value={values?.convRate || ""}
                            name="convRate"
                            style={{ fontSize: "10px" }}
                            onChange={(e) => {
                              setFieldValue("convRate", e.target.value);
                            }}
                          />
                        </td>
                        <td className="disabled-feedback disable-border">
                          <IInput
                            value={values?.percentigeInput || ""}
                            name="percentigeInput"
                            style={{ fontSize: "10px" }}
                            onChange={(e) => {
                              setFieldValue("percentigeInput", e.target.value);
                            }}
                          />
                        </td>
                        <td className="disabled-feedback disable-border">
                          <IInput
                            value={values?.yield || ""}
                            name="yield"
                            style={{ fontSize: "10px" }}
                            placeholder=""
                            onChange={(e) => {
                              setFieldValue("yield", e.target.value);
                            }}
                          />
                        </td>
                        <td className="text-center">{item?.quantity}</td>
                        <td className="text-center">{item?.quantity}</td>
                        <td className="text-center">{item?.quantity}</td>
                        <td className="disabled-feedback disable-border">
                          <IInput
                            value={values?.newQty || ""}
                            name="newQty"
                            style={{ fontSize: "10px" }}
                            onChange={(e) => {
                              setFieldValue("newQty", e.target.value);
                            }}
                          />
                        </td>
                        <td className="disabled-feedback disable-border">
                          <IInput
                            value={values?.newPrice || ""}
                            name="newPrice"
                            style={{ fontSize: "10px" }}
                            onChange={(e) => {
                              setFieldValue("newPrice", e.target.value);
                            }}
                          />
                        </td>
                        <td className="text-center">{item?.quantity}</td>
                        <td className="text-center">{item?.uom}</td>
                        <td className="text-center">{item?.remaks}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={11}> Total RM Price</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={12}> Total Material Cost by SKU</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </CommonTable>

                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <IInput
                        value={values?.packingMaterial || ""}
                        name="packingMaterial"
                        label="Packing Material"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("packingMaterial", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <IInput
                        value={values?.manufacturingOverhead || ""}
                        name="manufacturingOverhead"
                        label="Manufaturing Overhead"
                        type="number"
                        onChange={(e) => {
                          setFieldValue(
                            "manufacturingOverhead",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-6">
                      {/* <IInput
                        value={values?.totalManufacturingCost || ""}
                        name="totalManufacturingCost"
                        label="Total Manufaturing Cost"
                        type="number"
                        onChange={(e) => {
                          setFieldValue(
                            "totalManufacturingCost",
                            e.target.value
                          );
                        }}
                      /> */}
                      <h5 className="mt-6">
                        Total Manufacturing Cost: {426.54}
                      </h5>
                    </div>
                  </div>
                </div>
                <h2 className="mt-3"> Cost Component</h2>
                <CommonTable headersData={tblCostComponentHeaders}>
                  <tbody>
                    {[1]?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{item?.dispatchType}</td>
                        <td className="disabled-feedback disable-border">
                          <IInput
                            value={values?.costComponentAmount || ""}
                            name="costComponentAmount"
                            style={{ fontSize: "10px" }}
                            onChange={(e) => {
                              setFieldValue(
                                "costComponentAmount",
                                e.target.value
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Total Period Cost</strong>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Total Overhead</strong>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Total Cost</strong>
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Mark-Up / Profit</strong>
                      </td>
                      <td>
                        <div className="d-flex">
                          <IInput
                            value={values?.markupOrProfit || ""}
                            name="markupOrProfit"
                            style={{ fontSize: "10px" }}
                            onChange={(e) => {
                              setFieldValue("markupOrProfit", e.target.value);
                            }}
                          />
                          <p className="mt-2 ml-2">6.9</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <strong>Product Price</strong>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </CommonTable>

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
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
