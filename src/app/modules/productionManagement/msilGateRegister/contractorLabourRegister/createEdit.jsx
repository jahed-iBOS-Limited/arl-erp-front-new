import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  date: _todayDate(),
  labourSupplierName: "",
  inTime: "",
  outTime: "",
  totalLabour: "",
  workSection: "",
  workDescription: "",
  workPlace: "",
  comments: "",
};
export default function ContractorLabourRegisterCreate() {
  const [objProps, setObjprops] = useState({});
  const [workingSectionDDL, setWorkingSectionDDL] = useAxiosGet()
  const [, saveData] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState(initData);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    setWorkingSectionDDL(`/mes/MesDDL/GetWorkingSectionDDL?BusinessunitId=${selectedBusinessUnit?.value}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if (id) {
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        labourSupplierName: location?.state?.strLabourSupplierName,
        inTime: location?.state?.tmInTime,
        outTime: location?.state?.tmOutTime,
        totalLabour: location?.state?.numTotalLabour,
        workSection: {
          value: location?.state?.intWorkSectionId,
          label: location?.state?.strWorkSectionName
        },
        workDescription: location?.state?.strWorkDescription,
        workPlace: location?.state?.strWorkPlace,
        comments: location?.state?.strRemarks,
      });
    }
  }, [id, location]);

  const saveHandler = async (values, cb) => {
    if (!values?.date) return toast.warn("Please add তারিখ");

    saveData(
      `/mes/MSIL/LabourInOutCreateAndEdit`,
      {
        intGateLabourInOutRegisterId: id ? id : 0,
        intBusinessUnitId: selectedBusinessUnit?.value,
        dteDate: values?.date || "",
        strLabourSupplierName: values?.labourSupplierName || "",
        tmInTime: values?.inTime || "",
        tmOutTime: values?.outTime || "",
        numTotalLabour: values?.totalLabour || 0,
        intWorkSectionId: values?.workSection?.value || 0,
        strWorkSectionName: values?.workSection?.label || "",
        strWorkDescription: values?.workDescription || "",
        strWorkPlace: values?.workPlace || "",
        strRemarks: values?.comments || "",
        intActionBy:  profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true
      },
      id ? "" : cb,
      true
    );
  };

  return (
    <IForm title="Create Contractor Labour Register" getProps={setObjprops}>
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
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.labourSupplierName}
                        label="শ্রমিক / সরবরাহকারীর নাম"
                        name="labourSupplierName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.inTime}
                        label="প্রবেশের সময়"
                        name="inTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.outTime}
                        label="বহির্গমনের সময়"
                        name="outTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.totalLabour}
                        label="মোট শ্রমিক"
                        name="totalLabour"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="workSection"
                        options={workingSectionDDL}
                        value={values?.workSection}
                        label="কাজের বিভাগ"
                        onChange={(valueOption) => {
                          setFieldValue("workSection", valueOption);
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.workDescription}
                        label="কাজের বর্ণনা"
                        name="workDescription"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">                      
                      <InputField
                        value={values?.workPlace}
                        label="কাজের স্থান"
                        name="workPlace"
                        type="text"
                      />
                    </div>                
                    <div className="col-lg-3">
                      <InputField
                        value={values?.comments}
                        label="মন্তব্য"
                        name="comments"
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
      </>
    </IForm>
  );
}
