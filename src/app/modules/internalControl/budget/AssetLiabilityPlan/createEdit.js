import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { shallowEqual, useSelector } from 'react-redux';
import InputField from '../../../_helper/_inputField';
import { toast } from 'react-toastify';
import NewSelect from '../../../_helper/_select';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { _todayDate } from '../../../_helper/_todayDate';

const initData = {
  businessUnit: '',
  fiscalYear: '',
};

export default function AssetLiabilityPlanCreateEdit() {
  const formikRef = React.useRef(null);
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const [, getInventoryData, inventoryDataLoader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();

  const [buDDL, getBuDDL, buDDLloader, setBuDDL] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const saveHandler = (values, cb) => {
    if (tableData?.length && tableData[0].msg !== 'already exists') {
      const payload = tableData.map((item) => {
        return {
          ...item,
          julAmount: +item?.julAmount || 0,
          augAmount: +item?.augAmount || 0,
          sepAmount: +item?.sepAmount || 0,
          octAmount: +item?.octAmount || 0,
          novAmount: +item?.novAmount || 0,
          decAmount: +item?.decAmount || 0,
          janAmount: +item?.janAmount || 0,
          febAmount: +item?.febAmount || 0,
          marAmount: +item?.marAmount || 0,
          aprAmount: +item?.aprAmount || 0,
          mayAmount: +item?.mayAmount || 0,
          junAmount: +item?.junAmount || 0,
          yearId: values?.fiscalYear?.value,
          yearName: values?.fiscalYear?.label,
          partName: 'Create',
          actionBy: profileData?.userId,
          businessUnitId: values?.businessUnit?.value,
        };
      });
      saveData(
        `/fino/BudgetFinancial/CreateAssetLiabilityPlan`,
        payload,
        () => {
          // setTableData([]);
          onViewButtonClick(formikRef?.current?.values);
        },
        true,
      );
    } else {
      return toast.warn('No data to save');
    }
  };

  useEffect(() => {
    getBuDDL(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}`,
      (data) => {
        const newData = data?.map((item) => {
          return {
            value: item?.organizationUnitReffId,
            label: item?.organizationUnitReffName,
          };
        });
        setBuDDL(newData);
      },
    );
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fillPersentageValueInRow = (PercentageValue, index, initialAmount) => {
    const updatedData = [...tableData];
    let updatedValue = initialAmount;
    const monthsToUpdate = [
      'julAmount',
      'augAmount',
      'sepAmount',
      'octAmount',
      'novAmount',
      'decAmount',
      'janAmount',
      'febAmount',
      'marAmount',
      'aprAmount',
      'mayAmount',
      'junAmount',
    ];
    for (const month of monthsToUpdate) {
      updatedValue += updatedValue * (PercentageValue / 100);
      updatedValue = parseFloat(updatedValue.toFixed(2));
      updatedData[index][month] = updatedValue;
    }
    setTableData(updatedData);
  };

  const onViewButtonClick = (values) => {
    getTableData(
      `/fino/BudgetFinancial/GetAssetLiabilityPlan?partName=GetForCreate&businessUnitId=${values?.businessUnit?.value}&yearId=${values?.fiscalYear?.value}&yearName=${values?.fiscalYear?.label}&monthId=0&autoId=0&glId=0`,
      (data) => {
        const updatedData = data?.map((item) => ({
          ...item,
          fillAllManual: item?.entryTypeValue,
        }));
        getInventoryData(
          `/mes/SalesPlanning/GetGlWiseMaterialBalance?unitId=${
            values?.businessUnit?.value
          }&dteFromDate=${_todayDate()}`,
          (invData) => {
            const updatedDataWithInventory = updatedData?.map((item) => {
              const invDataItem = invData?.find(
                (invItem) => invItem?.intGeneralLedgerId === item?.glId,
              );
              if (invDataItem) {
                return {
                  ...item,
                  initialAmount: invDataItem?.opnAmount?.toFixed(2),
                  julAmount: invDataItem?.julAmount.toFixed(2),
                  augAmount: invDataItem?.augAmount.toFixed(2),
                  sepAmount: invDataItem?.sepAmount.toFixed(2),
                  octAmount: invDataItem?.octAmount.toFixed(2),
                  novAmount: invDataItem?.novAmount.toFixed(2),
                  decAmount: invDataItem?.decAmount.toFixed(2),
                  janAmount: invDataItem?.janAmount.toFixed(2),
                  febAmount: invDataItem?.febAmount.toFixed(2),
                  marAmount: invDataItem?.marAmount.toFixed(2),
                  aprAmount: invDataItem?.aprAmount.toFixed(2),
                  mayAmount: invDataItem?.mayAmount.toFixed(2),
                  junAmount: invDataItem?.junAmount.toFixed(2),
                };
              } else {
                return item;
              }
            });
            setTableData(updatedDataWithInventory);
          },
        );
      },
    );
  };

  const getUpdatedRowObjectForManual = (data, newValue) => {
    return {
      ...data,
      fillAllManual: newValue,
      julAmount: newValue,
      augAmount: newValue,
      sepAmount: newValue,
      octAmount: newValue,
      novAmount: newValue,
      decAmount: newValue,
      janAmount: newValue,
      febAmount: newValue,
      marAmount: newValue,
      aprAmount: newValue,
      mayAmount: newValue,
      junAmount: newValue,
    };
  };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
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
      }) => (
        <>
          {(tableDataLoader ||
            fiscalYearDDLloader ||
            saveDataLoader ||
            inventoryDataLoader ||
            buDDLloader) && <Loading />}
          <IForm
            title={'Asset Liability Plan Create'}
            getProps={setObjprops}
            isHiddenReset={true}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={buDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue('businessUnit', valueOption);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="fiscalYear"
                    options={fiscalYearDDL || []}
                    value={values?.fiscalYear}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue('fiscalYear', valueOption);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.businessUnit}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    style={{
                      marginTop: '3px',
                    }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => onViewButtonClick(values)}
                    disabled={!values?.fiscalYear}
                  >
                    View
                  </button>
                </div>
              </div>

              {values?.fiscalYear?.value &&
              tableData.length &&
              tableData[0].msg === 'already exists' ? (
                <div className="text-center mt-5">
                  <p>{tableData[0].msg}</p>
                </div>
              ) : (
                <div className="common-scrollable-table two-column-sticky mt-2">
                  <div
                    style={{ maxHeight: '500px' }}
                    className="scroll-table _table"
                  >
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ minWidth: '60px' }}>SL</th>
                          <th style={{ minWidth: '200px' }}>GL Name</th>
                          <th style={{ minWidth: '100px' }}>GL Class</th>
                          <th style={{ minWidth: '80px' }}>GL Type</th>
                          <th style={{ minWidth: '100px' }}>Opening</th>
                          <th style={{ minWidth: '140px' }}>Value</th>
                          <th style={{ minWidth: '140px' }}>July</th>
                          <th style={{ minWidth: '140px' }}>August</th>
                          <th style={{ minWidth: '140px' }}>September</th>
                          <th style={{ minWidth: '140px' }}>October</th>
                          <th style={{ minWidth: '140px' }}>November</th>
                          <th style={{ minWidth: '140px' }}>December</th>
                          <th style={{ minWidth: '140px' }}>January</th>
                          <th style={{ minWidth: '140px' }}>February</th>
                          <th style={{ minWidth: '140px' }}>March</th>
                          <th style={{ minWidth: '140px' }}>April</th>
                          <th style={{ minWidth: '140px' }}>May</th>
                          <th style={{ minWidth: '140px' }}>June</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 &&
                          tableData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.glName}</td>
                              <td>{item?.glClassName}</td>
                              <td>{item?.entryType}</td>
                              <td>{item?.initialAmount}</td>
                              <td>
                                {item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.entryTypeValue}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].entryTypeValue = +e
                                          .target.value;
                                        setTableData(updatedData);
                                        fillPersentageValueInRow(
                                          +e.target.value,
                                          index,
                                          item?.initialAmount,
                                        );
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].entryTypeValue = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          'Value must be greater than 0',
                                        );
                                      }
                                    }}
                                  />
                                ) : item?.entryType === 'Inventory' ? (
                                  <span className="text-center pointer"></span>
                                ) : (
                                  <InputField
                                    value={item?.fillAllManual}
                                    type="number"
                                    name="fillAllManual"
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const updatedData = tableData.map(
                                        (data, idx) =>
                                          idx === index
                                            ? getUpdatedRowObjectForManual(
                                                data,
                                                newValue,
                                              )
                                            : data,
                                      );
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.julAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].julAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.julAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].julAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.julAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].julAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.augAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].augAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.augAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].augAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.augAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].augAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {/* {item?.sepAmount} */}
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.sepAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].sepAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.sepAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].sepAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.sepAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].sepAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.octAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].octAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.octAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].octAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.octAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].octAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.novAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].novAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.novAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].novAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.novAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].novAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {/* {item?.decAmount} */}
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.decAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].decAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.decAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].decAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.decAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].decAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.janAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].janAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.janAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].janAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.janAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].janAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.febAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].febAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.febAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].febAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.febAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].febAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.marAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].marAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.marAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].marAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.marAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].marAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.aprAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].aprAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.aprAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].aprAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.aprAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].aprAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.mayAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].mayAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.mayAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].mayAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.mayAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].mayAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === 'Manual' ? (
                                  <InputField
                                    value={item?.junAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].junAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : item?.entryType === 'Percentage' ? (
                                  <InputField
                                    value={item?.junAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].junAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                ) : (
                                  <InputField
                                    value={item?.junAmount}
                                    type="number"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      const updatedData = [...tableData];
                                      updatedData[index].junAmount =
                                        e.target.value;
                                      setTableData(updatedData);
                                    }}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
