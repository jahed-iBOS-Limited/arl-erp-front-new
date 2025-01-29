import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const initData = {
  unitName: "",
  registrationNo: "",
  donationPurpose: "",
  causeOfDonation: "",
  fromDate: "",
  toDate: "",
  beneficiary: "",
  approvalPerson: "",
  status: "",
  paymentType: ""
};

export const DateWiseReportForm = ({ getData, setFilterObj }) => {
  const [unitDDL, getUnits] = useAxiosGet();
  const [donationPurposeDDL, getDonationPurpose] = useAxiosGet();
  const [causeOfDonationDDL, getCauseOfDonation] = useAxiosGet();

  const getLadingData = (
    name,
    fromDate,
    toDate,
    unitId,
    regNo,
    donationPurposeId,
    causeOfDonationId,
    beneficiaryName,
    status,
    paymentType
  ) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${name}&UnitId=${unitId}&FromDate=${fromDate}&ToDate=${toDate}&RegistrationNo=${regNo}&DonationPurposeId=${donationPurposeId}&CauseOfDonationId=${causeOfDonationId}&BeneficiaryName=${beneficiaryName}&Status=${status}&paymentTypeId=${paymentType}`;
  };

  const generateAPI = (name, autoId = 0, typeId = 0) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}`;
  };

  useEffect(() => {
    getUnits(generateAPI("UnitDDL"));
    getDonationPurpose(generateAPI("DonationPurpose"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    setFilterObj({values, saveHandler})
    getData(
      getLadingData(
        "GetAllDonationApplicationList",
        values?.fromDate,
        values?.toDate,
        values?.unitName?.value || 4,
        values?.registrationNo || "",
        values?.donationPurpose?.value || 0,
        values?.causeOfDonation?.value || 0,
        values?.beneficiary || "",
        values?.status?.value || "All",
        values?.paymentType?.value || 0,
      )
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={{
          ...initData,
          status:{value:"Approved", label:"Approved"},
        }}
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
          setValues,
        }) => (
          <>
            <Form className="form form-label-left">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    label="Unit Name"
                    isHiddenToolTip={true}
                    name="unitName"
                    //isHiddenLabel={true}
                    options={unitDDL || []}
                    value={values?.unitName}
                    onChange={(valueOption) => {
                      setFieldValue("unitName", valueOption);
                    }}
                    placeholder="Unit Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Registration No</label>
                  <InputField
                    value={values?.registrationNo}
                    name="registrationNo"
                    placeholder="Registration No"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Donation Purpose"
                    isHiddenToolTip={true}
                    name="donationPurpose"
                    //isHiddenLabel={true}
                    options={donationPurposeDDL || []}
                    value={values?.donationPurpose}
                    onChange={(valueOption) => {
                      setFieldValue("donationPurpose", valueOption);
                      if (valueOption === null) {
                        setFieldValue("causeOfDonation", "");
                      }
                      getCauseOfDonation(
                        generateAPI(
                          "CauseOfDonationOrZakat",
                          valueOption?.value
                        )
                      );
                      setFieldValue("causeOfDonation", "");
                    }}
                    placeholder="Donation Purpose"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Cause Of Donation"
                    isHiddenToolTip={true}
                    name="causeOfDonation"
                    //isHiddenLabel={true}
                    options={causeOfDonationDDL || []}
                    value={values?.causeOfDonation}
                    onChange={(valueOption) => {
                      setFieldValue("causeOfDonation", valueOption);
                    }}
                    placeholder="Cause Of Donation"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    type="date"
                    min={values?.fromDate}
                    disabled={!values?.fromDate}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Beneficiary Name</label>
                  <InputField
                    value={values?.beneficiary}
                    name="beneficiary"
                    placeholder="Beneficiary Name"
                    type="text"
                  />
                </div>
                
                <div className="col-lg-3">
                  <NewSelect
                    label="Payment Type"
                    isHiddenToolTip={true}
                    name="paymentType"
                    options={[
                      {value:0, label:"All"},
                      {value: 1, label:"Zakat"},
                      {value: 2, label:"Donation/Sadaka"}
                    ]}
                    value={values?.paymentType}
                    onChange={(valueOption) => {
                      setFieldValue("paymentType", valueOption);
                    }}
                    placeholder="Payment Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Status"
                    isHiddenToolTip={true}
                    name="status"
                    options={[
                      {value:"All", label:"All"},
                      {value:"Awaiting Audit", label:"Awaiting Audit"},
                      {value:"Pending", label:"Pending"},
                      {value:"Approved", label:"Approved"},
                      {value:"Rejected", label:"Rejected"}
                    ]}
                    value={values?.status}
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                    }}
                    placeholder="Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2 mt-5">
                  <button
                    type="submit"
                    style={{ fontSize: "12px" }}
                    className="btn btn-primary"
                    onSubmit={() => handleSubmit()}
                  >
                    Show Report
                  </button>
                </div>
                <div className="col-lg-2 mt-5">
                  <ReactHTMLTableToExcel
                    id="date-wise-table-xls-button-att-reports"
                    className="btn btn-primary"
                    table="date-wise-table-to-xlsx"
                    filename={"Date Wise Report"}
                    sheet={"Date Wise Report"}
                    buttonText="Export To Excel"
                  />
                </div>              
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
