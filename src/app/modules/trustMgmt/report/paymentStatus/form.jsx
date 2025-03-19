import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function _Form({ initData, rowDto, getData }) {
  const [unitNameDDL, getUnitNameDDL] = useAxiosGet();

  const generateAPI = (name, autoId = 0, typeId = 0) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}`;
  };

  const getTrustAllLanding = (
    partName,
    unitId,
    fromDate,
    toDate,
    paymentStatusId,
    paymentTypeId,
  ) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${partName}&UnitId=${unitId}&FromDate=${fromDate}&ToDate=${toDate}&PaymentStatusId=${paymentStatusId}&paymentTypeId=${paymentTypeId || 0}`;
  };

  useEffect(() => {
    getUnitNameDDL(generateAPI("UnitDDL"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={initData}
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8">
                  <div className="form-group row global-form">
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Unit Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="unitName"
                          isHiddenLabel={true}
                          options={unitNameDDL || []}
                          value={values?.unitName}
                          onChange={(valueOption) => {
                            setFieldValue("unitName", valueOption);
                          }}
                          placeholder="Select"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Payment Type
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="paymentType"
                          options={[
                            { value: 0, label: "All" },
                            { value: 1, label: "Zakat" },
                            { value: 2, label: "Donation/Sadaka" },
                          ]}
                          value={values?.paymentType}
                          onChange={(valueOption) => {
                            setFieldValue("paymentType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Payment Status
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <NewSelect
                          isHiddenToolTip={true}
                          name="paymentStatus"
                          isHiddenLabel={true}
                          options={[
                            { value: 1, label: "Paid" },
                            { value: 2, label: "Unpaid" },
                          ]}
                          value={values?.paymentStatus}
                          onChange={(valueOption) => {
                            setFieldValue("paymentStatus", valueOption);
                          }}
                          placeholder="Select"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        From Date
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.fromDate}
                            name="fromDate"
                            placeholder=""
                            type="date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        To Date
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <InputField
                            value={values?.toDate}
                            name="toDate"
                            placeholder=""
                            type="date"
                            min={values?.fromDate}
                            disabled={!values?.fromDate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6"></div>
                    <div className="col-lg-6">
                      <div className="text-right">
                        <ReactHTMLTableToExcel
                          id="payment-status-xls-button-att-reports"
                          className="btn btn-primary"
                          table="payment-status-table-to-xlsx"
                          filename="Payment Status"
                          sheet="Payment Status"
                          buttonText="Export To Excel"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="text-right">
                        <button
                          type="button"
                          style={{ fontSize: "12px" }}
                          className="btn btn-primary mt-1"
                          onClick={() => {
                            getData(
                              getTrustAllLanding(
                                "GetAllPaymentStatusNDonationReciverList",
                                values?.unitName?.value || 4,
                                values?.fromDate,
                                values?.toDate,
                                values?.paymentStatus?.value || 0,
                                values?.paymentType?.value || 0
                              )
                            );
                          }}
                          // disabled={!values?.fromDate || !values?.toDate}
                        >
                          Show Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
            <div className="text-center" style={{ marginTop: "30px" }}>
              {rowDto?.length > 0 && values?.paymentStatus && (
                <>
                  <h6 className="mb-0">
                    Payment Status Report ({values?.paymentStatus?.label})
                  </h6>
                </>
              )}
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
