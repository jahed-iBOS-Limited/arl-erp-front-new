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
  getItemRequestGridData,
  getParameterValues,
  getReportId,
  groupId,
  reportType
} from "../helper";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import PowerBIReport from "./../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import ReceivableDueReportTable from "./receivableDueReportTable";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";

const initialValues = {
  reportType: { value: 3, label: 'Sales Analysis as Per Receivable' },
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


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className='form form-label-right'>
            <ICustomCard title='Recivable Due Report'>
              <div className='row my-3 global-form'>
                <div className='col-lg-2'>
                  <NewSelect
                    name='reportType'
                    options={reportType}
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

                {/* Field & DDL For Report Type 3 */}
                {
                  [3].includes(values?.reportType?.value) && (
                    <>
                      <RATForm
                        obj={{
                          values,
                          setFieldValue,
                          channel: true,
                          region: true,
                          area: true,
                          territory: true,
                          onChange: (allValues, fieldName) => {
                            if (fieldName === 'channel') {
                              setShowReport(false);
                              setFieldValue('customerNameDDL', "")
                              setCustomerNameDDL([]);
                              getCustomerNameDDL(
                                profileData.accountId,
                                selectedBusinessUnit.value,
                                6,
                                allValues?.channel?.value,
                                setCustomerNameDDL
                              );
                            }
                          }
                        }}
                      />
                      <div className='col-lg-2'>
                        <NewSelect
                          name='customerNameDDL'
                          options={customerNameDDL || []}
                          value={values?.customerNameDDL}
                          label='Customer Name'
                          onChange={(valueOption) => {
                            setShowReport(false);
                            setFieldValue("customerNameDDL", valueOption);
                          }}
                          placeholder='Customer name'
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.channel}
                        />
                      </div>
                      <FromDateToDateForm
                        obj={{
                          values,
                          setFieldValue,
                        }}
                      />
                    </>
                  )
                }

                <div className='col-lg-2 mt-5'>
                  <button
                    className='btn btn-primary'
                    type='button'
                    disabled={
                      !values?.reportType?.value ||
                        [0].includes(values?.reportType?.value)
                        ? !values?.dueDate || !values?.transactionDate
                        : [3].includes(values?.reportType?.value) ? !values?.customerNameDDL || !values?.channel || !values?.toDate || !values?.fromDate || !values?.region || !values?.area || !values?.territory : !values?.month ||
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
                      // Day Base Collection and Month Basis and Sales Analysis as Per Receiveable
                      if ([1, 2, 3].includes(values?.reportType?.value)) {
                        console.log(values)
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
              {[1, 2, 3].includes(values?.reportType?.value) && (
                <>
                  {showReport && (
                    <PowerBIReport
                      reportId={getReportId(values?.reportType?.value)}
                      groupId={groupId}
                      parameterValues={getParameterValues(values, selectedBusinessUnit.value)}
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
