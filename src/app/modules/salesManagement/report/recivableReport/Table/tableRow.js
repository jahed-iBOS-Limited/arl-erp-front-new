import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import {
  getCustomerNameDDL,
  getDistributionDDL,
  getItemRequestGridData
} from "../helper";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import PowerBIReport from "./../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import ReceivableDueReportTable from "./receivableDueReportTable";
const initialValues = {
  reportType: { value: 0, label: "Receivable Due Report" },
  dueDate: _todayDate(),
  transactionDate: _todayDate(),
  month: "",
  year: "",
  salesOrg: "",
  distributionChannel: "",
  customerNameDDL: "",
};
export function TableRow(props) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);
  const [showReport, setShowReport] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  //Get Api Data
  useEffect(() => {
    if (initialValues?.reportType?.value === 0) {
      getItemRequestGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        initialValues?.transactionDate,
        initialValues?.dueDate,
        setGridData,
        setLoading
      );
    }

    getDistributionDDL(
      profileData.accountId,
      selectedBusinessUnit.value,
      setDistributionChannelDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = "9962e8c5-114a-4b50-8ef4-e3368e0248b6";

  const parameterValues = (values) => {

    
    return [
   
      { name: "intunit", value: `${selectedBusinessUnit.value}` },
      { name: "YearID", value: `${values?.year?.value}` },
      { name: "MonthID", value: `${values?.month?.value}` },
      { name: "intpartid", value: `${values?.reportType?.value}` },
      { name: "channelid", value: `${values?.distributionChannel?.value}` },
      { name: "partnerid", value: `${values?.customerNameDDL?.value}` },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className='form form-label-right'>
            <ICustomCard title='Recivable Due Report'>
              <div className='row my-3 global-form'>
                <div className='col-lg-2'>
                  <NewSelect
                    name='reportType'
                    options={[
                      { value: 0, label: "Receivable Due Report" },
                      { value: 1, label: "Day Base Collection" },
                      { value: 2, label: "Month Basis" },
                    ]}
                    value={values?.reportType}
                    label='Report Type'
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                      setShowReport(false);
                    }}
                    placeholder='Report Type'
                    errors={errors}
                    touched={touched}
                    isClearable={false}
                  />
                </div>
                {/* if Receivable Due Report */}
                {[0].includes(values?.reportType?.value) && (
                  <>
                    <div className='col-lg-2'>
                      <div className='form-group'>
                        <label>Transaction Date</label>
                        <InputField
                          className='trans-date cj-landing-date'
                          onChange={(e) => {
                            setFieldValue("transactionDate", e.target.value);
                          }}
                          type='date'
                          value={values?.transactionDate || ""}
                          name='transactionDate'
                        />
                      </div>
                    </div>
                    <div className='col-lg-2'>
                      <div className='form-group'>
                        <label>Due Date</label>
                        <InputField
                          className='trans-date cj-landing-date'
                          onChange={(e) => {
                            setFieldValue("dueDate", e.target.value);
                          }}
                          type='date'
                          value={values?.dueDate || ""}
                          name='dueDate'
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* if Day Base Collection */}
                {[1, 2].includes(values?.reportType?.value) && (
                  <>
                    <YearMonthForm
                      obj={{
                        values,
                        setFieldValue,
                        onChange: () => {
                          setShowReport(false);
                        },
                        colSize: "col-lg-2",
                      }}
                    />
                   
                    <div className='col-lg-2'>
                      <NewSelect
                        name='distributionChannel'
                        options={[
                          { value: 0, label: "All" },
                          ...distributionChannelDDL,
                        ]}
                        value={values?.distributionChannel}
                        label='Distribution Channel'
                        onChange={(valueOption) => {
                          setShowReport(false);
                          setFieldValue("customerNameDDL", "");
                          setFieldValue("distributionChannel", valueOption);
                          setCustomerNameDDL([]);
                          getCustomerNameDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            6,
                            valueOption?.value,
                            setCustomerNameDDL
                          );
                        }}
                        placeholder='Distribution Channel'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-2'>
                      <NewSelect
                        name='customerNameDDL'
                        options={customerNameDDL || []}
                        value={values?.customerNameDDL}
                        label='Customer Name'
                        onChange={(valueOption) => {
                          setFieldValue("customerNameDDL", valueOption);
                          setShowReport(false);
                        }}
                        placeholder='Customer name'
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.distributionChannel}
                      />
                    </div>
                  </>
                )}

                <div className='col-lg-2 mt-5'>
                  <button
                    className='btn btn-primary'
                    type='button'
                    disabled={
                      !values?.reportType?.value ||
                      [0].includes(values?.reportType?.value)
                        ? !values?.dueDate || !values?.transactionDate
                        : !values?.month ||
                          !values?.year ||
                          !values?.distributionChannel ||
                          !values?.customerNameDDL
                    }
                    onClick={() => {
                      // Receivable Due Report
                      if (values?.reportType?.value === 0) {
                        getItemRequestGridData(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          values?.transactionDate,
                          values?.dueDate,
                          setGridData,
                          setLoading
                        );
                      }
                      // Day Base Collection and Month Basis
                      if ([1, 2].includes(values?.reportType?.value)) {
                        setShowReport(true);
                      }
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              {loading && <Loading />}
              {[0].includes(values?.reportType?.value) && (
                <>
                  <ReceivableDueReportTable gridData={gridData} />
                </>
              )}

              {/* if Day Base Collection */}
              {[1, 2].includes(values?.reportType?.value) && (
                <>
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
            </ICustomCard>
          </Form>
        )}
      </Formik>
    </>
  );
}
