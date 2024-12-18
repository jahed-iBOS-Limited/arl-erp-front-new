import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { demoMonthData } from './helper';

const initData = {
  businessUnit: '',
  year: '',
  isForecast: false,
  gl: '',
  businessTransaction: '',
  profitCenter: '',
};

export default function BreakdownEntry() {
  const formikRef = React.useRef(null);
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [objProps, setObjprops] = useState({});
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    profitCenterLoder,
    setProfitCenterDDL,
  ] = useAxiosGet();

  const [monthDataForHeader, setMonthDataForHeader] = useState(demoMonthData);

  const [buDDL, getBuDDL, buDDLloader, setBuDDL] = useAxiosGet();
  const [glList, getGLList] = useAxiosGet();
  const [
    businessTransactionList,
    getBusinessTransactionList,
    transLoader,
    setBusinessTransactionList,
  ] = useAxiosGet();
  const [, getBudgetDataForPrevYear, budgetLoader] = useAxiosGet();
  const [, getBudgetDataForNextYear, budgetNextLoader] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL] = useAxiosGet();
  const [, getPreviousSaveData, previousSaveLoader] = useAxiosGet();

  const previousSaveDataHandler = ({ values, tableData }) => {
    getPreviousSaveData(
      `/fino/BudgetaryManage/GetFilteredAccountHeadBudget?BusinessUnitId=${values?.businessUnit?.value}&GlId=${values?.gl?.value}&SubGlId=${values?.businessTransaction?.value}&ProfitCenterId=${values?.profitCenter?.value}&Forecast=${values?.isForecast}&fiscalYear=${values?.year?.label}`,
      (apiData) => {
        if (!apiData || !apiData.length || !tableData?.length) return;

        const updatedTableData = tableData.map((tableRow) => {
          // Find the corresponding API data for the current accountHeadId
          const matchingApiAccount = apiData.find(
            (apiAccount) => apiAccount.accountHeadId === tableRow.accountHeadId,
          );

          if (
            !matchingApiAccount ||
            !matchingApiAccount?.monthlyBudgets?.length ||
            !tableRow?.monthData?.length
          )
            return tableRow;

          const monthData = tableRow?.monthData?.map((item) => {
            const matchingBudget =
              matchingApiAccount?.monthlyBudgets?.find(
                (month) => month?.monthId === item?.monthId,
              ) || {};

            return {
              ...item,
              budgetAmount: matchingBudget.budgetAmount ?? '',
              autoId: matchingBudget.intAutoId ?? 0,
            };
          });

          return {
            ...tableRow,
            monthData,
          };
        });

        setTableData(updatedTableData);
      },
    );
  };

  const { profileData } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);

    getBuDDL(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}`,
      (data) =>
        setBuDDL(
          data.map((item) => ({
            value: item?.organizationUnitReffId,
            label: item?.organizationUnitReffName,
          })),
        ),
    );
    getGLList(
      `/fino/FinanceCommonDDL/GetGeneralLedegerForBudgetDDL?accountId=${profileData?.accountId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const getLastDateOfMonth = (year, month) => {
    const fiscalYear = month >= 7 && month <= 12 ? year : year + 1;
    return moment(`${fiscalYear}-${month}-01`)
      .endOf('month')
      .format('YYYY-MM-DD');
  };

  const saveHandler = (values, cb) => {
    if (!values?.businessUnit || !values?.year || !tableData.length) {
      return toast.warn('No data to save');
    }

    const filteredData = tableData.filter((item) =>
      item.monthData.some((month) => parseFloat(month.budgetAmount) >= 0),
    );

    if (!filteredData.length) {
      return toast.warn('No data to save');
    }

    // Create payload for saving data
    const payload = filteredData.flatMap((item) => {
      return item.monthData.map((month) => ({
        autoId: month?.autoId || 0,
        ProfitCenterId: values?.profitCenter?.value,
        businessUnitId: values?.businessUnit?.value,
        glId: item.generalLedgerId,
        subGlId: values?.businessTransaction?.value,
        accountHeadId: item.accountHeadId,
        budget: parseFloat(month.budgetAmount) || 0, // Using month.budgetAmount for the budget
        budgetDate: getLastDateOfMonth(values?.year?.value, month.monthId),
        yearId:
          month.monthId >= 7 && month.monthId <= 12
            ? values?.year?.value
            : values?.year?.value + 1,
        monthId: month.monthId,
        isForecast: values?.isForecast,
      }));
    });

    // Filter out items with no valid budget
    const validPayload = payload.filter(
      (item) => parseFloat(item?.budget) >= 0,
    );

    if (validPayload.length) {
      saveData(
        '/fino/BudgetaryManage/CreateUpdateBudgetEntry',
        validPayload,
        cb, // Reset tableData after saving
        true,
      );
    } else {
      toast.warn('No valid data to save');
    }
  };

  const onViewButtonClick = (values) => {
    getTableData(
      `/fino/BudgetaryManage/GetSubGlAccountHead?GeneralLedgerId=${values?.gl?.value}&SubGlCode=${values?.businessTransaction?.buesinessTransactionCode}`,
      (data) => {
        const modiFyData =
          data?.length > 0
            ? data.map((item) => ({
                ...item,
                monthData: demoMonthData,
              }))
            : [];
        setTableData(modiFyData);
        previousSaveDataHandler({ tableData: modiFyData, values });
        getBudgetDataForPrevYear(
          `/fino/BudgetaryManage/GetBudgetOperatingExpenses?businessUnitId=${values?.businessUnit?.value}&generalLedgerId=${values?.gl?.value}&yearId=${values?.year?.value}&SubGlId=${values?.businessTransaction?.value}`,
          (dataForPrev) => {
            getBudgetDataForNextYear(
              `/fino/BudgetaryManage/GetBudgetOperatingExpenses?businessUnitId=${
                values?.businessUnit?.value
              }&generalLedgerId=${values?.gl?.value}&yearId=${values?.year
                ?.value + 1}&SubGlId=${values?.businessTransaction?.value}`,
              (dataForNext) => {
                updateMonthlyData(dataForPrev, dataForNext);
              },
            );
          },
        );
      },
    );
  };

  const updateMonthlyData = (dataForPrev, dataForNext) => {
    const data = monthDataForHeader.map((month) => {
      // For July to December, get data from the previous year (dataForPrev)
      if (month.monthId >= 7 && month.monthId <= 12) {
        return {
          ...month,
          budgetAmount:
            dataForPrev?.find((item) => item?.monthId === month.monthId)
              ?.amount || '',
        };
      }
      // For January to June, get data from the next year (dataForNext)
      else {
        return {
          ...month,
          budgetAmount:
            dataForNext?.find((item) => item?.monthId === month.monthId)
              ?.amount || '',
        };
      }
    });

    setMonthDataForHeader(data);
  };

  const getUpdatedRowObjectForManual = (data, newValue) => {
    const updatedRow = { ...data, fillAllManual: newValue };

    // Update the budgetAmount for each month in monthData
    updatedRow.monthData = updatedRow.monthData.map((monthItem) => ({
      ...monthItem,
      budgetAmount: newValue, // Set the new value for all months
    }));

    return updatedRow;
  };

  console.log('tableData', tableData);
  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          // resetForm(initData);
          previousSaveDataHandler({ values, tableData });
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
      }) => (
        <>
          {(tableDataLoader ||
            profitCenterLoder ||
            transLoader ||
            previousSaveLoader ||
            budgetLoader ||
            budgetNextLoader ||
            saveDataLoader ||
            buDDLloader) && <Loading />}
          <IForm
            title={'Breakdown Entry'}
            getProps={setObjprops}
            isHiddenReset={true}
          >
            <Form>
              {/* Form Fields */}
              <div className="form-group  global-form row">
                {/* Business Unit Select */}
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={buDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue('businessUnit', valueOption);
                      setFieldValue('profitCenter', '');
                      setFieldValue('gl', '');
                      setFieldValue('businessTransaction', '');
                      setProfitCenterDDL([]);
                      setBusinessTransactionList([]);
                      setTableData([]);
                      if (valueOption) {
                        getProfitCenterDDL(
                          `/costmgmt/ProfitCenter/GetProfitCenterInformation?AccountId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value}`,
                          (data) => {
                            const newData = data?.map((itm) => {
                              itm.value = itm?.profitCenterId;
                              itm.label = itm?.profitCenterName;
                              return itm;
                            });
                            setProfitCenterDDL(newData);
                          },
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenter"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue('profitCenter', valueOption);
                      setFieldValue('gl', '');
                      setFieldValue('businessTransaction', '');
                      setBusinessTransactionList([]);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.businessUnit}
                  />
                </div>
                {/* GL Select */}
                <div className="col-lg-3">
                  <NewSelect
                    name="gl"
                    options={glList || []}
                    value={values?.gl}
                    label="GL"
                    onChange={(valueOption) => {
                      setFieldValue('gl', valueOption);
                      setFieldValue('businessTransaction', '');
                      setBusinessTransactionList([]);
                      setTableData([]);
                      if (valueOption) {
                        getBusinessTransactionList(
                          `/fino/FinanceCommonDDL/GetBusinessTransactionForBudgetDDL?accountId=${profileData?.accountId}&businessUnitId=${values?.businessUnit?.value}&generalLedgerId=${valueOption?.value}`,
                          (res) => {
                            const data = res.map((item) => ({
                              ...item,
                              value: item?.buesinessTransactionId,
                              label: item?.buesinessTransactionName,
                            }));
                            setBusinessTransactionList(data);
                          },
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.businessUnit}
                  />
                </div>
                {/* Business Transaction Select */}
                <div className="col-lg-3">
                  <NewSelect
                    name="businessTransaction"
                    options={businessTransactionList || []}
                    value={values?.businessTransaction}
                    label="Business Transaction"
                    onChange={(valueOption) => {
                      setFieldValue('businessTransaction', valueOption);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.businessUnit || !values?.gl}
                  />
                </div>
                {/* Year Select */}
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={fiscalYearDDL || []}
                    value={values?.year}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue('year', valueOption);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Checkbox for Forecast */}
                <div className="col-lg-1 mt-5">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={values?.isForecast}
                      onChange={(e) =>
                        setFieldValue('isForecast', e.target.checked)
                      }
                    />
                    <label className="pl-2">Is Forecast</label>
                  </div>
                </div>
                {/* View Button */}
                <div className="col-lg-3 mt-5">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => onViewButtonClick(values)}
                    disabled={
                      !values?.year ||
                      !values?.businessUnit ||
                      !values?.gl ||
                      !values?.businessTransaction ||
                      !values?.profitCenter
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              {/* Table Display */}
              {values?.year?.value && tableData.length > 0 && (
                <div className="common-scrollable-table two-column-sticky mt-2">
                  <div
                    style={{ maxHeight: '500px' }}
                    className="scroll-table _table"
                  >
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ minWidth: '60px' }}>SL</th>
                          <th style={{ minWidth: '200px' }}>Element Name</th>
                          <th style={{ minWidth: '140px' }}>Value</th>
                          {monthDataForHeader?.length > 0 &&
                            monthDataForHeader.map((month) => (
                              <th
                                key={month.monthId}
                                style={{ minWidth: '140px' }}
                              >
                                {month.monthName} ({month?.budgetAmount || ''})
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.length > 0 &&
                          tableData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.accountHeadName}</td>
                              <td>
                                <InputField
                                  value={item?.fillAllManual}
                                  type="number"
                                  name="fillAllManual"
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    setTableData(
                                      tableData.map((data, idx) =>
                                        idx === index
                                          ? getUpdatedRowObjectForManual(
                                              data,
                                              newValue,
                                            )
                                          : data,
                                      ),
                                    );
                                  }}
                                />
                              </td>
                              {item.monthData?.length > 0 &&
                                item.monthData.map((month) => (
                                  <td key={month.monthId}>
                                    <InputField
                                      value={month.budgetAmount} // Access the budgetAmount directly
                                      type="number"
                                      name={`entryTypeValue-${month.monthId}`}
                                      onChange={(e) => {
                                        const updatedData = [...tableData];
                                        updatedData[
                                          index
                                        ].monthData = updatedData[
                                          index
                                        ].monthData.map((m) =>
                                          m.monthId === month.monthId
                                            ? {
                                                ...m,
                                                budgetAmount: e.target.value,
                                              }
                                            : m,
                                        );
                                        setTableData(updatedData);
                                      }}
                                    />
                                  </td>
                                ))}
                            </tr>
                          ))}
                        <tr>
                          <td colSpan="3">Total</td>
                          {monthDataForHeader.length > 0 &&
                            monthDataForHeader.map((month) => {
                              // Calculate the total for the current month by summing up the budgetAmount
                              const monthTotal =
                                tableData?.length > 0 &&
                                tableData.reduce((sum, item) => {
                                  const monthItem = item?.monthData?.find(
                                    (m) => m.monthId === month.monthId,
                                  );
                                  return (
                                    sum +
                                    (parseFloat(monthItem?.budgetAmount) || 0)
                                  );
                                }, 0);
                              return (
                                <td className="text-center" key={month.monthId}>
                                  {monthTotal}
                                </td>
                              );
                            })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
              ></button>
              <button
                type="reset"
                style={{ display: 'none' }}
                ref={objProps?.resetBtnRef}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
