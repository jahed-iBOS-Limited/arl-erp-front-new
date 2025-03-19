import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../_helper/iButton";
import ICard from "../../../_helper/_card";
import NewSelect from "../../../_helper/_select";


const initData = {
  channel: "",
  region: "",
  area: "",
  territory: "",
  reportType: "",
};

// Validation schema
const validationSchema = Yup.object().shape({

  channel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
  region: Yup.object().shape({
    label: Yup.string().required("Region is required"),
    value: Yup.string().required("Region is required"),
  }),
  area: Yup.object().shape({
    label: Yup.string().required("Area is required"),
    value: Yup.string().required("Area is required"),
  }),
  territory: Yup.object().shape({
    label: Yup.string().required("Territory is required"),
    value: Yup.string().required("Territory is required"),
  }),
  reportType: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
});

function AgingReportForAccounts() {

  const [showReport, setShowReport] = useState(false);


  // get selected business unit from store
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);


  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = "c12445ca-e396-4786-9367-0a70c584de7b";


  const parameterValues = (values) => {
    const agingParameters = [
      { name: "unitID", value: `${buId}` },
      { name: "RegionId", value: `${values?.region?.value}` },
      { name: "areaId", value: `${values?.area?.value}` },
      { name: "TerritoryId", value: `${values?.territory?.value}` },
      { name: "DCId", value: `${values?.channel?.value}` },
      { name: "ViewType", value: `${values?.reportType?.value}` },
    ];

    return agingParameters;
  };

  return (
    <>
      <ICard title="Aging Report for Accounts">
      <div>
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  // saveHandler(values, () => {
                  //   resetForm(initData);
                  // });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form">
                          <RATForm
                            obj={{
                              values,
                              setFieldValue,
                              channel: true,
                              region: true,
                              area: true,
                              territory: true,
                              columnSize: "col-lg-2",
                              onChange: () => {
                                setShowReport(false);
                              },
                            }}
                          />
                          <div className="col-lg-2">
                            <NewSelect
                              name="reportType"
                              options={[{value: 1, label: "Summary"}, {value: 2, label: "Details"}]}
                              value={values?.reportType}
                              label="Report Type"
                              onChange={(valueOption) => {
                                setFieldValue("reportType", valueOption);
                                setShowReport(false);
                              }}
                              placeholder="Report Type"
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                        <IButton
                          colSize={"col-lg-2"}
                          onClick={() => {
                            setShowReport(true);
                          }}
                          disabled={!values?.channel || !values?.area 
                                    || !values?.region || !values?.territory || !values?.reportType}
                        />
                      </div>
                    </Form>
                    {showReport && (
                      <PowerBIReport
                        reportId={reportId}
                        groupId={groupId}
                        parameterValues={parameterValues(values)}
                        parameterPanel={false}
                      />
                    )}
                  </>
                )}
              </Formik>
            </div>
          </div>
      </ICard>
    </>
  );
}

export default AgingReportForAccounts;
