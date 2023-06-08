import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import BasicModal from "./../../../_helper/_BasicModal";

const initData = {
  date: _todayDate(),
  driverName: "",
  driverMobileNo: "",
  vehicleNo: "",
  inTimeBL: "",
  outTimeBL: "",
  inTimeAL: "",
  outTimeAL: "",
  comment: "",
};
export default function RentalVehicleInOutCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const [modifyData, setModifyData] = useState(initData);
  const { id } = useParams();
  const location = useLocation();
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
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        driverName: location?.state?.strDriverName,
        driverMobileNo: location?.state?.strMobileNo,
        vehicleNo: location?.state?.strVehicleNo,
        inTimeBL: location?.state?.tmInTimeBeforeLunch,
        outTimeBL: location?.state?.tmOutTimeBeforeLunch,
        inTimeAL: location?.state?.tmInTimeAfterLunch,
        outTimeAL: location?.state?.tmOutTimeAfterLunch,
        comment: location?.state?.strRemarks,
      });
    }
  }, [id, location]);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/GateRentalVehicleRegisterCreateAndEdit`,
      {
        intGateRentalVehicleRegisterId: id || 0,
        dteDate: values?.date,
        intBusinessUnitId: selectedBusinessUnit?.value,
        strDriverName: values?.driverName,
        strMobileNo: values?.driverMobileNo,
        strVehicleNo: values?.vehicleNo,
        tmInTimeBeforeLunch: values?.inTimeBL,
        tmOutTimeBeforeLunch: values?.outTimeBL,
        tmInTimeAfterLunch: values?.inTimeAL,
        tmOutTimeAfterLunch: values?.outTimeAL,
        strRemarks: values?.comment,
        intActionBy: profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true,
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

  return (
    <IForm title="Create Rental Vehicle In Out" getProps={setObjprops}>
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
                        value={values?.vehicleNo}
                        label="গাড়ীর নাম্বার"
                        name="vehicleNo"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.inTimeBL}
                        label="প্রবেশের সময়(লাঞ্চের আগে)"
                        name="inTimeBL"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.outTimeBL}
                        label="বহির্গমনের সময়(লাঞ্চের আগে)"
                        name="outTimeBL"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.inTimeAL}
                        label="প্রবেশের সময়(লাঞ্চের পরে)"
                        name="inTimeAL"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.outTimeAL}
                        label="বহির্গমনের সময়(লাঞ্চের পরে)"
                        name="outTimeAL"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.comment}
                        label="Comment"
                        name="comment"
                        type="text"
                      />
                    </div>
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
