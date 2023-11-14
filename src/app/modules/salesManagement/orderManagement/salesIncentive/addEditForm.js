import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IView from "../../../_helper/_helperIcons/_view";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";

const initData = {
  businessUnit: "",
  fromDate: "",
  toDate: "",
};

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});

export default function SalesIncentiveForm() {
  const [objProps, setObjprops] = useState({});
  const {
    profileData: { accountId: accId },
    // selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [incentiveData, getIncentiveData, loadIncentiveData] = useAxiosGet();
  const [, incentiveSave, loadIncentiveSave] = useAxiosPost();
  // DDL
  const [boninessUnitDDL, getBusinessUnitDDL] = useAxiosGet();

  const saveHandler = (values, cb) => {
    const newData = [...incentiveData];
    const payload = newData?.map((item) => ({
      businessId: values?.businessUnit?.value,
      region: item?.strRegoin,
      area: item?.strArea,
      territory: item?.strTeritory,
      employeeId: item?.intEmployeeId,
      employeeName: item?.strEmployeeName,
      monthId: +values?.toDate?.split("-")[1],
      yearId: +values?.toDate?.split("-")[2],
      salesAmount: item?.numSalesAmount,
      targetAmount: item?.numTargetAmount,
      achievement: item?.numAchievement,
      incentiveAmount: item?.numIncentiveAmount,
    }));
    incentiveSave(
      `/oms/IncentiveConfig/SaveIncentiveConfig`,
      payload,
      () => {},
      true
    );
  };
  useEffect(() => {
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
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
          {(loadIncentiveData || loadIncentiveSave) && <Loading />}
          <IForm title="Sales Incentive" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={boninessUnitDDL}
                    value={values?.item}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="fromDate"
                    value={values?.fromDate}
                    label="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    name="toDate"
                    value={values?.toDate}
                    label="To Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <button
                    disabled={
                      !values?.businessUnit?.value ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                    onClick={() => {
                      getIncentiveData(
                        `/oms/IncentiveConfig/GetIncenttiveView?businessUnitId=${values?.businessUnit?.value}&certainDate=${values?.toDate}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                      );
                    }}
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    type="button"
                  >
                    Show
                  </button>
                </div>
              </div>

              <div>
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Employee</th>
                      <th>Region</th>
                      <th>Area</th>
                      <th>Territory</th>
                      <th>Target Amount</th>
                      <th>Sales Amount</th>
                      <th>Achievement</th>
                      <th>Incentive Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incentiveData?.length > 0 &&
                      incentiveData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.strEmployeeName}
                          </td>
                          <td className="text-center">{item?.strRegoin}</td>
                          <td className="text-center">{item?.strArea}</td>
                          <td className="text-center">{item?.strTeritory}</td>
                          <td className="text-center">
                            {item?.numTargetAmount}
                          </td>
                          <td className="text-center">
                            {item?.numSalesAmount}
                          </td>
                          <td className="text-center">
                            {item?.numAchievement}
                          </td>
                          <td className="text-center">
                            {item?.numIncentiveAmount}
                          </td>
                          <td className="text-center">
                            {" "}
                            <IView
                              title="View"
                              clickHandler={() => alert("hello")}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => {
                  if (incentiveData?.length > 0) {
                    handleSubmit();
                  } else {
                    toast.warn("No Data found");
                  }
                }}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
