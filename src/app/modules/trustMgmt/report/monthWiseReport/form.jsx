/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

export default function _Form({
  initData,
  rowDto,
  getData,
}) {

  const [unitNameDDL, getUnitNameDDL] = useAxiosGet();

  const generateAPI = (name, autoId = 0, typeId = 0) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}`;
  };

  const getTrustAllLanding = (partName, unitId, fromDate, toDate) => {
    return `/hcm/TrustManagement/GetTrustAllLanding?PartName=${partName}&UnitId=${unitId}&FromDate=${fromDate}&ToDate=${toDate}`;
  }

  useEffect(() => {
    getUnitNameDDL(generateAPI("UnitDDL"));
  }, []);

  const saveHandler = (values, cb) => {
    
  }

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
                    <div className="col-lg-2">
                      <div className="d-flex align-items-center h-100">
                        Unit Name
                      </div>
                    </div>
                    <div className="col-lg-4">
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
                    <div className="col-lg-6">
                      <div className="text-right">
                        <button
                        type="button"
                        style={{fontSize: "12px"}}
                        className="btn btn-primary"
                        disabled={!values?.fromDate || !values?.toDate}
                        onClick={() => {
                          getData( 
                            getTrustAllLanding(
                              "MonthWiseGetAllDonationApplicationList",
                              values?.unitName?.value || 4,
                              values?.fromDate,
                              values?.toDate,
                            )
                          )
                        }}
                      >Show Report</button>
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
}
