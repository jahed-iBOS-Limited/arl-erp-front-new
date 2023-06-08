import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import BasicModal from "./../../../_helper/_BasicModal";

const initData = {
  date: _todayDate(),
  enroll: "",
  visitorName: "",
  visitorCompanyName: "",
  visitorMobileNo: "",
  companyAddress: "",
  vehicleNo: "",
  driverName: "",
  driverMobileNo: "",
  visitorReason: "",
  officePersonName: "",
  officePersonDesignation: "",
  inTime: "",
  outTime: "",
  comment: "",
};
export default function VisitorRegisterCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const [modifyData, setModifyData] = useState(initData);
  const { id } = useParams();
  const location = useLocation();
  const [viewType, setViewType] = useState(1);
  const [entryCode, setEntryCode] = useState("");
  const [isShowModel, setIsShowModel] = useState(false);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      setViewType(location?.state?.intEmployeeId === 0 ? 2 : 1);
      setModifyData({
        date: _dateFormatter(location.state?.dteDate),
        enroll: {
          value: location?.state?.intEmployeeId,
          label: location?.state?.intEmployeeId,
        },
        visitorName: location?.state?.strVisitorName,
        visitorCompanyName: location?.state?.strVisitorCompany,
        visitorMobileNo: location?.state?.strVisitorMobileNo,
        companyAddress: location?.state?.strAddress,
        vehicleNo: location?.state?.strCarNo,
        driverName: location?.state?.strDriverName,
        driverMobileNo: location?.state?.strDriverMobileNo,
        visitorReason: location?.state?.strVisitingReason,
        officePersonName: location?.state?.strOfficePersonName,
        officePersonDesignation: location?.state?.strOfficePersonDesignation,
        inTime: location?.state?.tmInTime,
        outTime: location?.state?.tmOutTime,
        comment: location?.state?.strRemarks,
      });
    }
  }, [id, location]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/VisitorRegisterCreateAndEdit`,
      {
        intGateVisitorRegisterId: id || 0,
        dteDate: values?.date,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intEmployeeId: values?.enroll?.value || 0,
        strVisitorName: values?.visitorName || "",
        strVisitorCompany: values?.visitorCompanyName || "",
        strVisitorMobileNo: values?.visitorMobileNo || "",
        strAddress: values?.companyAddress || "",
        strCarNo: values?.vehicleNo || "",
        strDriverName: values?.driverName || "",
        strDriverMobileNo: values?.driverMobileNo || "",
        strVisitingReason: values?.visitorReason || "",
        strOfficePersonName: values?.officePersonName || "",
        strOfficePersonDesignation: values?.officePersonDesignation || "",
        tmInTime: values?.inTime,
        tmOutTime: values?.outTime,
        intActionBy: profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true,
        strRemarks: values?.comment,
      },
      id
        ? ""
        : (data) => {
            setEntryCode(data?.code);
            cb();
            setIsShowModel(true);
          },
      true
    );
  };

  const loadEnrollList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(`/mes/MSIL/GetEmployeeProfileAll?search=${v}`)
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <IForm title="Create Visitor Register" getProps={setObjprops}>
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
                          setFieldValue("enroll", "");
                          setFieldValue("visitorName", "");
                          setFieldValue("visitorCompanyName", "");
                          setFieldValue("visitorMobileNo", "");
                          setFieldValue("companyAddress", "");
                        }}
                        disabled={id && viewType !== 1}
                      />
                      এআরএল পরিদর্শক
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 2}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setViewType(2);
                          setFieldValue("enroll", "");
                          setFieldValue("visitorName", "");
                          setFieldValue("visitorCompanyName", "");
                          setFieldValue("visitorMobileNo", "");
                          setFieldValue("companyAddress", "");
                        }}
                        disabled={id && viewType !== 2}
                      />
                      অন্যান্য পরিদর্শক
                    </label>
                  </div>
                </>
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

                    {viewType === 1 ? (
                      <div className="col-lg-3">
                        <label>এনরোল</label>
                        <SearchAsyncSelect
                          selectedValue={values?.enroll}
                          isSearchIcon={true}
                          handleChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue("enroll", valueOption);
                              setFieldValue(
                                "visitorName",
                                valueOption?.strEmployeeFullName
                              );
                              setFieldValue(
                                "visitorCompanyName",
                                valueOption?.strBusinessUnitName
                              );
                              setFieldValue(
                                "visitorMobileNo",
                                valueOption?.personalContactNo
                              );
                              setFieldValue(
                                "companyAddress",
                                valueOption?.strWorkplaceName
                              );
                            } else {
                              setFieldValue("enroll", "");
                              setFieldValue("visitorName", "");
                              setFieldValue("visitorCompanyName", "");
                              setFieldValue("visitorMobileNo", "");
                              setFieldValue("companyAddress", "");
                            }
                          }}
                          loadOptions={loadEnrollList}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.visitorName}
                        label="পরিদর্শকের নাম"
                        name="visitorName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.visitorCompanyName}
                        label="পরিদর্শকের প্রতিষ্ঠানের নাম"
                        name="visitorCompanyName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.visitorMobileNo}
                        label="পরিদর্শকের মোবাইল নাম্বার"
                        name="visitorMobileNo"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.companyAddress}
                        label="প্রতিষ্ঠানের ঠিকানা"
                        name="companyAddress"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.vehicleNo}
                        label="গাড়ীর নাম্বার"
                        name="vehicleNo"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.driverName}
                        label="ড্রাইভারের নাম"
                        name="driverName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.driverMobileNo}
                        label="ড্রাইভার মোবাইল নাম্বার"
                        name="driverMobileNo"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.visitorReason}
                        label="যে কারণে প্রবেশ করতে চান"
                        name="visitorReason"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.officePersonName}
                        label="যার সাথে দেখা করতে চান তার নাম"
                        name="officePersonName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.officePersonDesignation}
                        label="যার সাথে দেখা করতে চান তার পদবী"
                        name="officePersonDesignation"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.inTime}
                        label="প্রবেশের সময়"
                        name="inTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.outTime}
                        label="বহির্গমনের সময়"
                        name="outTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.comment}
                        label="মন্তব্য"
                        name="comment"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onClick={() => handleSubmit()}
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
        <div>
          <BasicModal
            open={isShowModel}
            handleOpen={() => setIsShowModel(true)}
            handleClose={() => setIsShowModel(false)}
            myStyle={{
              width: 400,
            }}
            hideBackdrop={true}
          >
            <h1 className="text-center">Entry Code : {entryCode}</h1>
          </BasicModal>
        </div>
      </>
    </IForm>
  );
}
