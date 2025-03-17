import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import IViewModal from '../../../_helper/_viewModal';
import { YearDDL } from '../../../_helper/_yearDDL';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { generateMonthlyData, months } from './helper';
import MonthTable from './monthTable';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InputField from '../../../_helper/_inputField';
import { getPlantDDL } from '../../../financialManagement/invoiceManagementSystem/billregister/helper';
import { toast } from 'react-toastify';

const initData = {
  businessUnit: '',
  year: '',
  month: '',
};

export default function ProductionScheduling() {
  const { profileData } = useSelector((state) => state.authData, shallowEqual);
  const formikRef = React.useRef(null);
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [buDDL, getBuDDL, buDDLloader, setBuDDL] = useAxiosGet();
  const [singleData, setSingleData] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);


  console.log('tableData', tableData);

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const saveHandler = (values, cb) => { };

  const getData = (values) => {
    // Generate daily schedules based on the provided month and year
    const dailySchedulesList = generateMonthlyData(
      values?.month?.value,
      values?.year?.value,
    );

    getTableData(
      `/mes/ProductionEntry/GetProductScheduleListAsync?businessUnitId=${values?.businessUnit?.value}&date=${values?.year?.value}-${values?.month?.value}-1&isForecast=false&plantId=${values?.plant?.value || 0}`,
      (res) => {
        // Modify data to replace null or empty dailySchedules with dailySchedulesList
        const modifiedData = res?.map((product) => {
          const modifiedWorkCenters = product.workCenters.map((workCenter) => {
            return {
              ...workCenter,
              dailySchedules:
                !workCenter.dailySchedules ||
                  workCenter.dailySchedules.length === 0
                  ? dailySchedulesList
                  : workCenter.dailySchedules,
            };
          });

          return {
            ...product,
            workCenters: modifiedWorkCenters,
          };
        });

        // Update the table data state with the modified data
        setTableData(modifiedData);
      },
    );
  };

  const onViewButtonClick = (values) => {
    getData(values);
  };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => { });
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
          {(tableDataLoader || buDDLloader) && <Loading />}
          <IForm
            title={'Production Scheduling'}
            getProps={setObjprops}
            isHiddenReset={true}
            isHiddenBack={true}
            isHiddenSave={true}
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
                      setFieldValue('plant', '');
                      setFieldValue('strManagementUomName', valueOption?.strManagementUomName || "");
                      getPlantDDL(profileData?.userId, profileData?.accountId, valueOption?.value, setPlantDDL)
                      setTableData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL}
                    value={values?.plant}
                    label="Select Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      setTableData([]);
                    }}
                    placeholder="Select Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={YearDDL() || []}
                    value={values?.year}
                    label="Financial Year"
                    onChange={(valueOption) => {
                      setFieldValue('year', valueOption);
                      setTableData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="month"
                    options={months || []}
                    value={values?.month}
                    label="Month"
                    onChange={(valueOption) => {
                      setFieldValue('month', valueOption);
                      setTableData([]);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    name="strManagementUomName"
                    value={values?.strManagementUomName || ""}
                    label="Management UOM"
                    disabled
                  />
                </div>

                {/* View Button */}
                <div className="mt-5">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => onViewButtonClick(values)}
                    disabled={
                      !values?.year || !values?.businessUnit || !values?.month
                    }
                  >
                    View
                  </button>
                </div>
                {tableData.length > 0 && (
                  <div className="mt-5 ml-4">
                    <ReactHTMLTableToExcel
                      id="date-wise-table-xls-button-production-scheduling"   // this id always uniqe for every table 
                      className="btn btn-primary"
                      table="production-scheduling-table-to-xlsx"  // always same with table id
                      filename={"Date Wise Report"}
                      sheet={"Production Scheduling Report"}
                      buttonText="Export Excel"
                    />
                  </div>
                )}
              </div>
              {/* Table Display */}
              {tableData.length > 0 && (
                <div className="common-scrollable-table two-column-sticky mt-2">
                  <div
                    style={{ maxHeight: '500px' }}
                    className="scroll-table _table"
                  >
                    <table id="production-scheduling-table-to-xlsx" className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Monthly Schedule Qty</th>
                          {tableData.length > 0 &&
                            tableData[0].workCenters.map((workCenter, i) => (
                              <th key={i}>{`Workcenter ${i + 1}`}</th>
                            ))}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((product, index) => (
                          <tr key={index}>
                            <td>{product.productName}</td>
                            <td className="text-center">
                              {product.productQty}
                            </td>
                            {product.workCenters.map((workCenter, i) => (
                              <td className="text-center" key={i}>
                                <span
                                  onClick={() => {
                                    if (!values?.plant?.value) {
                                      return toast.warn("Please select plant first")
                                    }
                                    setSingleData({
                                      ...product,
                                      productIndex: index,
                                      workCenterIndex: i,
                                      plantId: values?.plant?.value,
                                    });
                                    setIsShowModal(true);
                                  }}
                                  className="pointer"
                                  style={{ color: 'purple' }}
                                >
                                  {workCenter.workCenterName} (
                                  {workCenter?.workCenterQty || 0})
                                </span>
                              </td>
                            ))}
                            <td className="text-center">
                              {product?.workCenters.reduce(
                                (sum, workCenter) => sum + (workCenter.workCenterQty || 0),
                                0
                              ) || 0}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="text-center font-weight-bold">Total</td>
                          <td className="text-center font-weight-bold">
                            {tableData.reduce((sum, product) => sum + (product.productQty || 0), 0)}
                          </td>
                          {tableData[0]?.workCenters.map((_, i) => (
                            <td key={i} className="text-center font-weight-bold">
                              {tableData.reduce(
                                (sum, product) => sum + (product.workCenters[i]?.workCenterQty || 0),
                                0
                              )}
                            </td>
                          ))}
                          <td className="text-center font-weight-bold">
                            {tableData.reduce(
                              (grandTotal, product) =>
                                grandTotal +
                                product.workCenters.reduce(
                                  (sum, workCenter) => sum + (workCenter.workCenterQty || 0),
                                  0
                                ),
                              0
                            )}
                          </td>
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
          {isShowModal && (
            <IViewModal
              show={isShowModal}
              onHide={() => {
                setIsShowModal(false);
                setSingleData(null);
              }}
              modelSize="lg"
            >
              <div className="p-5">
                <MonthTable
                  tableData={tableData}
                  setTableData={setTableData}
                  singleData={singleData}
                  values={values}
                  cb={() => {
                    getData(values);
                  }}
                />
              </div>
            </IViewModal>
          )}
        </>
      )}
    </Formik>
  );
}
