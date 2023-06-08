import React from "react";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { onUpdateWeightageInAdministration } from "./helper";
import { Form, Formik } from "formik";

const WeighmentEditOnAdministration = ({
  businessUnit,
  shipPoint,
  selectedRow,
  onHide,
}) => {
  const [, updateWeightage, loadingOnUpdateWeightage] = useAxiosPost();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={selectedRow}
      onSubmit={(formValues) => {
        onUpdateWeightageInAdministration({
          data: formValues,
          updateWeightage,
          onHide,
        });
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form>
          <div>
            {loadingOnUpdateWeightage && <Loading />}
            <div className="form-group  global-form">
              <div className="row">
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={businessUnit}
                    label="বিজনেস ইউনিট"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={shipPoint}
                    label="শিপ পয়েন্ট"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={values?.strGateEntryCode}
                    label="রেজি. নং"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={values?.strTruckNumber}
                    label="গাড়ীর নাম্বার"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={
                      values?.dteLastWeightDateTime
                        ? _dateFormatter(values?.dteLastWeightDateTime)
                        : "N/A"
                    }
                    label="তারিখ"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={values?.strInvoiceNumber}
                    label="চালান নাম্বার"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={values?.strMaterialName}
                    label="পণ্যের নাম"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={values?.strSupplierName}
                    label="সাপ্লায়ারের নাম"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={values?.strWeightmentNo}
                    label="ওজন নং"
                    type="text"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    value={values?.numFirstWeight}
                    onChange={(e) => {
                      setFieldValue("numFirstWeight", e.target.value);
                    }}
                    name="numLastWeight"
                    label="1st Weight"
                    type="number"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={!selectedRow?.numLastWeight}
                    value={values?.numLastWeight}
                    name="numLastWeight"
                    onChange={(e) => {
                      setFieldValue("numLastWeight", e.target.value);
                    }}
                    label="2nd Weight"
                    type="number"
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    disabled={true}
                    value={values?.numNetWeight}
                    label="Net Weight"
                    type="text"
                  />
                </div>
                <div className="col-md-12">
                  <button
                    type="button"
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary float-right"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(WeighmentEditOnAdministration);
