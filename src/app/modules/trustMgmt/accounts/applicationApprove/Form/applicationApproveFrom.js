import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const initData = {
  unitName: "",
  fromDate: "",
  toDate: "",
};

export const ApplicationApproveForm = ({ getData, setFilterObj }) => {
  const [unitDDL, getUnits] = useAxiosGet();

  const getLadingData = (name, fromDate, toDate, unitId) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${name}&UnitId=${unitId}&FromDate=${fromDate}&ToDate=${toDate}`;
  };

  const generateAPI = (name, autoId = 0, typeId = 0) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}`;
  };

  useEffect(() => {
    getUnits(generateAPI("UnitDDL"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                <div className="col-lg-9">
                  <div className="form-group row global-form">
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
                            type="date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Unit Name
                      </div>
                    </div>
                    <div className="col-lg-4 mb-2">
                      <div className="d-flex align-items-center">
                        <span className="mr-2">:</span>
                        <div className="w-100">
                          <NewSelect
                            isHiddenToolTip={true}
                            name="unitName"
                            isHiddenLabel={true}
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
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="text-right">
                        <button
                          type="button"
                          style={{ fontSize: "12px" }}
                          className="btn btn-primary"
                          onClick={() => {
                            getData(
                              getLadingData(
                                "GetAllPendingDonationApplicationList",
                                values?.fromDate,
                                values?.toDate,
                                values?.unitName?.value || 4
                              )
                            );
                            setFilterObj({
                              fromDate: values?.fromDate,
                              toDate: values?.toDate,
                              unitId: values?.unitName?.value,
                            });
                          }}
                        >
                          Show Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
