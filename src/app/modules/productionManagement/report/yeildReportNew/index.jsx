import { Form, Formik } from 'formik';
import React from 'react';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import NewSelect from '../../../_helper/_select';
import InputField from '../../../_helper/_inputField';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { _todayDate } from '../../../_helper/_todayDate';
import { shallowEqual, useSelector } from 'react-redux';
import WIPTable from './wipTable';
import YeildReport from './yeildReport';
import { toast } from 'react-toastify';
import { bomTypeDDL } from '../../../_helper/_commonDDL';
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: { value: 1, label: 'Yeild Report' },
  shopFloor: '',
  plant: '',
  bomType: {
    value: 1,
    label: 'Main (Paddy to Rice)',
  },
};

export default function Yeildreport() {
  const [gridData, setGridData] = React.useState([]);
  const [, getTableData, tableDataLoader] = useAxiosGet();
  const [, getYearldReportPivot, YearldReportPivotLoading] = useAxiosGet();
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [shopFloorDDL, getShopFloorDDL] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  React.useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantDDL(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
      );
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  return (
    <Formik
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
          {(tableDataLoader || YearldReportPivotLoading) && <Loading />}
          <IForm
            title="Yield Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: 'Yeild Report' },
                      { value: 2, label: 'WIP' },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue('reportType', valueOption);
                      setGridData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {[1, 2].includes(values?.reportType?.value) && (
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          setGridData([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                          setGridData([]);
                        }}
                      />
                    </div>
                  </>
                )}

                {/*  if reportType Yeild Report */}
                {[1].includes(values?.reportType?.value) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plantDDL || []}
                        value={values?.plant}
                        label="Select Plant"
                        onChange={(valueOption) => {
                          setFieldValue('shopFloor', '');
                          getShopFloorDDL(
                            `/mes/MesDDL/GetShopfloorDDL?AccountId=${profileData.accountId}&BusinessUnitid=${selectedBusinessUnit.value}&PlantId=${valueOption?.value}`
                          );
                          setGridData([]);
                          setFieldValue('plant', valueOption);
                        }}
                        placeholder="Select Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shopFloor"
                        options={shopFloorDDL || []}
                        value={values?.shopFloor}
                        label="Shop Floor"
                        onChange={(valueOption) => {
                          setFieldValue('shopFloor', valueOption);
                          setGridData([]);
                        }}
                        placeholder="Shop Floor"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="bomType"
                        options={bomTypeDDL || []}
                        value={values?.bomType}
                        label="BOM Type"
                        onChange={(valueOption) => {
                          setFieldValue('bomType', valueOption);
                          setGridData([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}

                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mr-2"
                    style={{
                      marginTop: '20px',
                    }}
                    type="button"
                    disabled={
                      !values?.fromDate ||
                      !values?.toDate ||
                      !values?.reportType
                    }
                    onClick={() => {
                      setGridData([]);
                      if (values?.reportType?.value === 1) {
                        // plant, shopFloor, bomType empty check
                        if (!values?.plant) {
                          return toast.warning('Plant is required');
                        }
                        if (!values?.shopFloor) {
                          return toast.warning('Shop Floor is required');
                        }
                        if (!values?.bomType) {
                          return toast.warning('BOM Type is required');
                        }
                        getYearldReportPivot(
                          `/mes/ProductionEntry/GetYearldReport?unitId=${selectedBusinessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intPartId=4&ShopFloorId=${values?.shopFloor?.value}&BillTypeId=${values?.bomType?.value}&Variant=''&ConsumptionQty=0`,
                          (data) => {
                            setGridData(data);
                          }
                        );
                      } else {
                        // WIP api call
                        getTableData(
                          `/mes/ProductionEntry/GetYearldReport?unitId=${selectedBusinessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intPartId=${values?.reportType?.value}&Variant=''&ConsumptionQty=0`,
                          (data) => {
                            setGridData(data);
                          }
                        );
                      }
                    }}
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Yeild Report table */}
              {values?.reportType?.value === 1 && (
                <YeildReport tableData={gridData} values={values} />
              )}

              {/*  WIP Table */}
              {values?.reportType?.value === 2 && (
                <WIPTable tableData={gridData} />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
