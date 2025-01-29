import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  weightNo: "",
  firstWeight: "",
  secondWeight: "",
  netWeight: "",
};
export default function WeightbridgeEdit() {
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const { editId } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState({});

  useEffect(() => {
    if (editId) {
      setModifyData({
        weightNo: location?.state?.strWeightNo,
        firstWeight: location?.state?.numVehicleWeightWithScrap,
        secondWeight: location?.state?.numVehicleWeightWithoutScrap,
        netWeight: location?.state?.numScrapWeight,
      });
    }
  }, [editId, location]);

  console.log("location", location);

  const saveHandler = async (values, cb) => {
    saveData(
      `/mes/MSIL/CreateWeightBridge`,
      {
        intGateEntryItemListId: +editId,
        numVehicleWeightWithoutScrap: +values?.secondWeight,
        numVehicleWeightWithScrap: +values?.firstWeight,
        numScrapWeight: +values?.firstWeight - +values?.secondWeight,
        strWeightNo: values?.weightNo || "",
        intUpdatedBy: profileData?.userId,
        dteUpdatedDate: _todayDate(),
      },
      cb,
      true
    );
  };

  return (
    <IForm title="Create Weighbridge" getProps={setObjprops}>
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={editId ? modifyData : initData}
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

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>তারিখ</th>
                            <th>পণ্যের নাম</th>
                            <th>সাপ্লায়ারের নাম</th>
                            <th>ড্রাইভারের নাম</th>
                            <th>মোবাইল নাম্বার</th>
                            <th>গাড়ীর নাম্বার</th>
                            <th>চালান নাম্বার</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-center">
                              {_dateFormatter(location?.state?.dteDate)}
                            </td>
                            <td>{location?.state?.strItemName}</td>
                            <td>{location?.state?.strSupplierName}</td>
                            <td>{location?.state?.strDriverName}</td>
                            <td>{location?.state?.strDriverMobileNo}</td>
                            <td>{location?.state?.strTruckNumber}</td>
                            <td>{location?.state?.strInvoiceNumber}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.weightNo}
                        label="Weight No"
                        name="weightNo"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("weightNo", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.firstWeight}
                        label="1st Weight"
                        name="firstWeight"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0) return;
                          if (+e.target.value <= values?.firstWeight)
                            return toast.warn(
                              "2nd weight must be less than 1st weight"
                            );
                          setFieldValue("firstWeight", e.target.value);
                          setFieldValue(
                            "netWeight",
                            +e.target.value - values?.secondWeight || 0
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.secondWeight}
                        label="2nd Weight"
                        name="secondWeight"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0) return;
                          if (!values?.firstWeight)
                            return toast.warn("Please input 1st weight first");
                          if (+e.target.value >= values?.firstWeight)
                            return toast.warn(
                              "2nd weight must be less than 1st weight"
                            );
                          setFieldValue("secondWeight", e.target.value);
                          setFieldValue(
                            "netWeight",
                            (values?.firstWeight || 0) - +e.target.value
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.netWeight}
                        label="Net Weight"
                        name="netWeight"
                        type="number"
                        disabled
                        onChange={(e) => {
                          if (+e.target.value < 0) return;
                          setFieldValue("netWeight", e.target.value);
                        }}
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
