import { Formik } from "formik";
import React, { useEffect } from "react";
import TextArea from "../../../../_helper/TextArea";
import ICard from "../../../../_helper/_card";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";

const _Form = ({
  initData,
  validationSchema,
  saveHandler,
  setOpen,
  pageNo,
  pageSize,
  commonGridFunc,
  landingValues,
  rowDto,
}) => {
  const challanVerificationFunc = (values) => {
    if (values?.challanNo && values?.challanVerification) {
      return values?.challanNo === values?.challanVerification;
    } else {
      return false;
    }
  };
  const [issueDDL, getIssueDDL, issueDDLloader] = useAxiosGet();
  useEffect(() => {
    getIssueDDL(`/wms/CustomerDeliveryInquery/GetIssueTypeDDL`, (data) => {
      console.log("data", data);
    });
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            setOpen(false);
            commonGridFunc(pageNo, pageSize, landingValues);
            resetForm(initData);
          });
        }}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
        }) => (
          <ICard title="Daily Delivery Status">
            {issueDDLloader && <Loading />}
            <form className="global-form form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <InputField
                    name="agentName"
                    value={values?.agentName}
                    label="Agent Name"
                    placeholder="Agent Name"
                    touched={touched}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="unit"
                    value={values?.unit}
                    label="Unit"
                    placeholder="Unit"
                    touched={touched}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="customerName"
                    value={values?.customerName}
                    label="Customer Name"
                    placeholder="Customer Name"
                    touched={touched}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="vehicleNo"
                    value={values?.vehicleNo}
                    label="Vehicle No"
                    placeholder="Vehicle No"
                    touched={touched}
                    disabled
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    name="customerAddress"
                    value={values?.customerAddress}
                    label="Customer Address"
                    placeholder="Customer Address"
                    touched={touched}
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="customerPhone"
                    value={values?.customerPhone}
                    label="Customer Phone"
                    placeholder="Customer Phone"
                    touched={touched}
                    disabled
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    name="productDescription"
                    value={values?.productDescription}
                    label="Product Description"
                    placeholder="Product Description"
                    touched={touched}
                    onChange={(e) => {
                      setFieldValue("productDescription", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    value={rowDto[0]?.strContactPerson}
                    label="Challan Contact Name"
                    disabled
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    value={rowDto[0]?.contactNo}
                    label="Challan Contact No"
                    disabled
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    value={rowDto[0]?.customerName}
                    label="Customer Contact Name"
                    disabled
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    value={rowDto[0]?.customerPhoneNo}
                    label="Customer Contact No"
                    disabled
                  />
                </div>
                <div className="col-md-12 mt-3">
                  {/* <div>
                    <strong>
                      {" "}
                      {` Delivery Challan - [Contact Name: ${rowDto[0]?.contactNo}] [Contact Number: ${rowDto[0]?.strShipToPartnerContactNo}]`}
                    </strong>
                  </div>
                  <div>
                    <strong>{` Customer Profile - [Contact Person: ${rowDto[0]?.strContactPerson}] [Contact Number: ${rowDto[0]?.strContactNumber2} (Contact Person)] Contact Number: ${rowDto[0]?.strContactNumber3} (Other)]`}</strong>
                  </div> */}
                </div>
                <div className="col-lg-6">
                  <label>Problem Details</label>
                  <TextArea
                    name="problemDetails"
                    value={values?.problemDetails}
                    label="Problem Details"
                    placeholder="Problem Details"
                    touched={touched}
                    rows="3"
                  />
                </div>
                <div className="col-lg-6">
                  <label> Remarks </label>
                  <TextArea
                    name="remarks"
                    value={values?.remarks}
                    label="Remarks"
                    placeholder="Remarks"
                    touched={touched}
                    rows="3"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="receivedStatus"
                    value={values?.receivedStatus}
                    options={[
                      { value: false, label: "No" },
                      { value: true, label: "Yes" },
                    ]}
                    placeholder="Received Status"
                    onChange={(e) => {
                      setFieldValue("receivedStatus", e);
                    }}
                    label="Received Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="challanNo"
                    value={values?.challanNo}
                    label="Challan No"
                    placeholder="Challan No"
                    touched={touched}
                    onChange={(e) => {
                      setFieldValue("challanNo", e.target.value);
                      setFieldValue(
                        "challanVerify",
                        challanVerificationFunc({
                          ...values,
                          challanNo: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="challanVerification"
                    value={values?.challanVerification}
                    label="Challan Verification"
                    placeholder="challanVerification"
                    touched={touched}
                    onChange={(e) => {
                      setFieldValue("challanVerification", e.target.value);
                      setFieldValue(
                        "challanVerify",
                        challanVerificationFunc({
                          ...values,
                          challanVerification: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <div className="pt-3">
                    <input
                      type="checkbox"
                      name="challanVerify"
                      value={values?.challanVerify}
                      onChange={(e) => console.log(e?.target?.checked)}
                      checked={values?.challanVerify}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="destinationReachTime"
                    value={values?.destinationReachTime}
                    label="Destination Reach Time"
                    type="datetime-local"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <div className="d-flex">
                    <p>
                      <label>is Right Form</label>
                    </p>
                    <p className="pl-3 pt-2">
                      <input
                        type="checkbox"
                        name="isRightForm"
                        value={values?.isRightForm}
                        onChange={(e) =>
                          setFieldValue("isRightForm", e.target.checked)
                        }
                        checked={values?.isRightForm}
                      />
                    </p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="issueType"
                    value={values?.issueType}
                    options={issueDDL || []}
                    placeholder="issueType"
                    onChange={(valuOption) => {
                      if (valuOption) {
                        setFieldValue("issueType", valuOption);
                      } else {
                        setFieldValue("issueType", "");
                      }
                    }}
                    label="Issue Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </form>
            <div className="text-right">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() => handleSubmit()}
                disabled={
                  values?.receivedStatus?.value ? !values?.challanVerify : false
                }
              >
                Submit
              </button>
            </div>
         <div className="table-responsive">
         <table className="table table-striped table-bordered  global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Lest Call Date</th>
                  <th>User Name</th>
                  <th>Problem Details</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {rowDto.length >= 0 &&
                  rowDto.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{_dateFormatter(item?.lastActionDateTime)}</td>
                      <td>{item?.userName}</td>
                      <td>{item?.problemDetails}</td>
                      <td>{item?.remarks}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
         </div>
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default _Form;
