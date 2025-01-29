import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import { useLocation, useParams } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";

const initData = {
  date: _todayDate(),
  keyReceiverName: "",
  designation: "",
  keyLocation: "",
  keyQuantity: "",
  keyProvideTime: "",
  keyReceiveTime: "",
  keyProviderName: "",
  keyProviderNameForEdit: "",
  keyReceiverNameForEdit: "",
};
export default function KeyRegisterCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState(initData);
  const [keyLocationDDL, getKeyLocationDDL] = useAxiosGet();
  const [keyProviderDDL, getKeyProviderDDL] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getKeyLocationDDL(
      `/mes/MesDDL/GetKeyLocationDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getKeyProviderDDL(
      `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        keyReceiverName: {
          value: location?.state?.intKeyReceiverEnroll,
          label: location?.state?.strKeyReceiverName,
        },
        designation: location?.state?.strDesignation,
        keyLocation: {
          value: location?.state?.intKeyLocationId,
          label: location?.state?.strKeyLocation,
        },
        keyQuantity: location?.state?.numKeyQuantity,
        keyProvideTime: location?.state?.tmKeyProvideTime,
        keyReceiveTime: location?.state?.tmKeyReceiveTime,
        keyProviderName: {
          value: location?.state?.intKeyProviderEnroll,
          label: location?.state?.strKeyProviderName,
        },
        keyProviderNameForEdit: location?.state?.strKeyReceivedFrom || "",
        keyReceiverNameForEdit: (location?.state?.intKeyReceivedBy && location?.state?.strKeyReceivedBy) ? { value: location?.state?.intKeyReceivedBy, label: location?.state?.strKeyReceivedBy } : "",
      });
    }
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
        dteInsertDate: _todayDate(),
        isActive: true,
        strKeyReceivedFrom: values?.keyProviderNameForEdit || "",
        intKeyReceivedBy: values?.keyReceiverNameForEdit?.value || 0,
        strKeyReceivedBy: values?.keyReceiverNameForEdit?.label || "",
      },
      id ? "" : cb,
      true
    );
  };

  const loadKeyReceiverName = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/mes/MesDDL/GetAllEmployeeInfoCommonDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <IForm title="Create Key Register" getProps={setObjprops}>
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
                      <InputField
                        value={values?.date}
                        label="তারিখ"
                        name="date"
                        type="date"
                        disabled={id}
                      />
                    </div>
                    <div className="col-lg-3">
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
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.designation}
                        label="পদবী"
                        name="designation"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="keyLocation"
                        options={keyLocationDDL || []}
                        value={values?.keyLocation}
                        label="চাবির স্থান"
                        onChange={(valueOption) => {
                          setFieldValue("keyLocation", valueOption);
                        }}
                        isDisabled={id}
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.keyQuantity}
                        label="চাবির সংখ্যা"
                        name="keyQuantity"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0) return;
                          setFieldValue("keyQuantity", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.keyProvideTime}
                        label="চাবি প্রদানের সময়"
                        name="keyProvideTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.keyReceiveTime}
                        label="চাবি গ্রহনের সময়"
                        name="keyReceiveTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="keyProviderName"
                        options={keyProviderDDL || []}
                        value={values?.keyProviderName}
                        label="চাবি প্রদানকারীর নাম"
                        onChange={(valueOption) => {
                          setFieldValue("keyProviderName", valueOption);
                        }}
                        isDisabled={id}
                      />
                    </div>
                    {id ? <div className="col-lg-3">
                      <InputField
                        value={values?.keyProviderNameForEdit}
                        label="চাবি প্রদানকারীর নাম (User)"
                        name="keyProviderNameForEdit"
                        type="text"
                      />
                    </div> : null}
                    {id ? <div className="col-lg-3">
                      <NewSelect
                        name="keyReceiverNameForEdit"
                        options={keyProviderDDL || []}
                        value={values?.keyReceiverNameForEdit}
                        label="চাবি গ্রহনকারীর নাম (Security)"
                        onChange={(valueOption) => {
                          setFieldValue("keyReceiverNameForEdit", valueOption);
                        }}
                      />
                    </div>
                      : null}
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
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
