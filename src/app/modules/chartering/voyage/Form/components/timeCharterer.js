import React from "react";
import FormikInput from "../../../_chartinghelper/common/formikInput";

export default function TimeCharterer({
  values,
  setFieldValue,
  viewType,
  errors,
  touched,
  setTotalAmountHandler,
}) {
  return (
    <>
      <div className="marine-form-card-content">
        <div className="row">
          <div className="col-lg-3">
            <label>LSMGO Price/MT</label>
            <FormikInput
              value={values?.lsmgoPrice}
              name="lsmgoPrice"
              placeholder="LSMGO Price/MT"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>
          <div className="col-lg-3">
            <label>LSFO Price/MT</label>
            <FormikInput
              value={values?.lsifoPrice}
              name="lsifoPrice"
              placeholder="LSFO Price/MT"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>
          <div className="col-lg-3">
            <label>Daily Hire</label>
            <FormikInput
              value={values?.dailyHire}
              name="dailyHire"
              placeholder="Daily Hire"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
              onChange={(e) => {
                setFieldValue("dailyHire", e?.target?.value);

                /* Func For Total Amount Value Handler */
                // setTotalAmountHandler(
                //   {
                //     ...values,
                //     dailyHire: e?.target?.value,
                //   },
                //   setFieldValue
                // );
              }}
            />
          </div>

          <div className="col-lg-3">
            <label>ILOHC</label>
            <FormikInput
              value={values?.iloch}
              name="iloch"
              placeholder="ILOHC"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          <div className="col-lg-3">
            <label>C/V/E 30 Days</label>
            <FormikInput
              value={values?.cve30Days}
              name="cve30Days"
              placeholder="C/V/E 30 Days"
              type="text"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          <div className="col-lg-3">
            <label>AP</label>
            <FormikInput
              value={values?.ap}
              name="ap"
              placeholder="AP"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          <div className="col-lg-3">
            <label>Others</label>
            <FormikInput
              value={values?.others}
              name="others"
              placeholder="Others"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          {/* <div className="col-lg-3">
            <label>Total Amount</label>
            <FormikInput
              value={values?.totalAmount}
              name="totalAmount"
              placeholder="Total Amount"
              type="number"
              onChange={(e) => {
                setFieldValue("totalAmount", e.target.value);
              }}
              errors={errors}
              touched={touched}
              disabled={true}
            />
          </div> */}
        </div>
      </div>
    </>
  );
}
