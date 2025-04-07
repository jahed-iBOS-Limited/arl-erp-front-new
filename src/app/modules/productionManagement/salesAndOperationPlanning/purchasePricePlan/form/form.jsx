import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { ExcelRenderer } from 'react-excel-renderer';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import { exportToCSV } from './utils';
import { getHorizonDDL } from '../../../../_helper/_commonApi';

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  selectedBusinessUnit,
  profileData,
  rowDto,
  setRowDto,
  getRowDto,
  remover,
  plantDDL,
  yearDDL,
  setYearDDL,
  horizonDDL,
  setHorizonDDL,
  id,
  dataHandler,
  removeItem,
  fiscalYearDDL,
}) {
  const [fileObject, setFileObject] = useState('');
  const hiddenFileInput = React.useRef(null);
  useEffect(() => {
    if (fileObject) {
      ExcelRenderer(fileObject, (err, resp) => {
        if (err) {
        } else {
          let rowData = [];
          for (let i = 1; i < resp.rows.length; i++) {
            rowData.push({
              salesPlanRowId: 0,
              bomid: resp.rows[i][4],
              bomname: resp.rows[i][3],
              itemCode: resp.rows[i][2],
              itemId: resp.rows[i][0],
              itemName: resp.rows[i][1],
              itemPlanQty: resp.rows[i][7],
              numRate: resp.rows[i][8],
              uomName: resp.rows[i][5],
              uomid: resp.rows[i][6],
            });
          }
          setRowDto({
            ...rowDto,
            data: rowData,
            totalCount: rowDto?.totalCount,
          });
        }
      });
    }
  }, [fileObject]);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            getRowDto(
              `/fino/BudgetFinancial/GetMaterialRequirementPlanningByMonth?accountId=${
                profileData?.accountId
              }&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${
                values?.plant?.value
              }&yearId=${
                values?.horizon?.monthId > 6
                  ? values?.fiscalYear?.value
                  : values?.fiscalYear?.value + 1
              }&monthId=${values?.horizon?.monthId}`
            );
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            {false && <Loading />}
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-4">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Plant"
                      placeholder="Plant"
                      onChange={(valueOption) => {
                        setRowDto([]);
                        if (valueOption) {
                          setFileObject('');
                          setFieldValue('plant', valueOption);

                          if (values?.fiscalYear?.value) {
                            getHorizonDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              valueOption?.value,
                              setHorizonDDL
                            );
                          }
                        } else {
                          setYearDDL([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={id ? true : false}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="fiscalYear"
                      options={fiscalYearDDL || []}
                      value={values?.fiscalYear}
                      label="Year"
                      disabled={!values?.plant}
                      onChange={(valueOption) => {
                        setRowDto([]);
                        if (valueOption) {
                          setFieldValue('fiscalYear', valueOption);
                          setFileObject('');
                          setFieldValue('horizon', '');
                          getHorizonDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plant?.value,
                            valueOption?.value,
                            setHorizonDDL
                          );
                        } else {
                          setHorizonDDL([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="horizon"
                      options={horizonDDL}
                      value={values?.horizon}
                      label="Planning Horizon"
                      placeholder="Planning Horizon"
                      onChange={(valueOption) => {
                        setRowDto([]);
                        getRowDto(
                          `/fino/BudgetFinancial/GetMaterialRequirementPlanningByMonth?accountId=${
                            profileData?.accountId
                          }&businessUnitId=${
                            selectedBusinessUnit?.value
                          }&PlantId=${values?.plant?.value}&yearId=${
                            valueOption?.monthId > 6
                              ? values?.fiscalYear?.value
                              : values?.fiscalYear?.value + 1
                          }&monthId=${valueOption?.monthId}`
                        );
                        setFieldValue('horizon', valueOption);
                        setFieldValue(
                          'startDate',
                          _dateFormatter(valueOption?.startdatetime)
                        );
                        setFieldValue(
                          'endDate',
                          _dateFormatter(valueOption?.enddatetime)
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        !values?.plant?.label || !values?.fiscalYear?.label
                      }
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Start Date</label>
                    <InputField
                      value={values?.startDate}
                      name="startDate"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>End Date</label>
                    <InputField
                      value={values?.endDate}
                      name="endDate"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="global-form mt-4 d-flex">
                <div className="form-group row text-right">
                  <button
                    className="btn btn-primary"
                    onClick={handleClick}
                    type="button"
                    style={{
                      marginLeft: '10px',
                      height: '30px',
                    }}
                  >
                    Import Excel
                  </button>
                  <input
                    type="file"
                    onChange={(e) => {
                      setFileObject(e.target.files[0]);
                      e.target.value = '';
                    }}
                    ref={hiddenFileInput}
                    style={{ display: 'none' }}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    exportToCSV(rowDto?.data);
                  }}
                  type="button"
                  style={{
                    marginLeft: '20px',
                    height: '30px',
                  }}
                >
                  Export Excel
                </button>
              </div>

              <div className="table-responsive">
                <table className="global-table table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>Item Code</th>
                      <th>UoM Name</th>
                      <th>MRP Quantity</th>
                      <th>Purchase Quantity</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.length > 0 &&
                      rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="pl-2">{item?.strItemName}</td>
                          <td className="pl-2">{item?.strItemCode}</td>
                          <td className="text-center">{item?.strUomName}</td>
                          <td className="text-center">{item?.numMRPQty}</td>
                          <td
                            style={{ width: '150px' }}
                            className="text-center"
                          >
                            <input
                              type="number"
                              name="purchaseQty"
                              value={+item?.purchaseQty || ''}
                              onChange={(e) => {
                                if (+e.target.value < 0) {
                                  return toast.warn(
                                    'Purchase quantity can"t be negative'
                                  );
                                } else {
                                  dataHandler(
                                    'purchaseQty',
                                    index,
                                    +e.target.value
                                  );
                                }
                              }}
                              className="quantity-field form-control"
                              // disabled={item?.numMRPQty < 0}
                            />
                          </td>
                          <td
                            style={{ width: '150px' }}
                            className="text-center"
                          >
                            <input
                              type="number"
                              name="numRate"
                              value={+item?.numRate || ''}
                              onChange={(e) => {
                                if (+e.target.value < 0) {
                                  return toast.warn("Rate can't be negative");
                                }
                                dataHandler('numRate', index, +e.target.value);
                              }}
                              className="quantity-field form-control"
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}
