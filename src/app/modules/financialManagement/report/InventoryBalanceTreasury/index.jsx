import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import ICard from '../../../_helper/_card';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { shallowEqual, useSelector } from 'react-redux';

const initData = {
  date: _todayDate(),
  itemType: '',
  reportType: '',
  businessUnit: '',
  plant: '',
  warehouse: '',
};

function InventoryBalanceTreasury() {
  const {
    authData: { profileData },
  } = useSelector((store) => store, shallowEqual);
  const [showReport, setShowReport] = useState(false);
  const [itemTypeList, getItemTypeList] = useAxiosGet();
  const [buDDL, getBuDDL] = useAxiosGet();
  const [plantDDL, getPlantDDL, , setPlantDDL] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL, , setWareHouseDDL] = useAxiosGet();

  useEffect(() => {
    getItemTypeList(`/wms/WmsReport/GetItemTypeListDDL`);
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
  }, []);

  const groupId = 'e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a';
  const reportId = '9fe6b313-c031-41cb-ac5c-b4c8a8d156f4';

  const parameterValues = (values) => {
    return [
      { name: 'dteToDate', value: `${values?.date}` },
      { name: 'intUnit', value: `${values?.businessUnit?.value}` },
      { name: 'intItemTypeId', value: `${values?.itemType?.value}` },
      { name: 'reportType', value: `${values?.reportType?.value}` },
      { name: 'intWarehouseId', value: `${values?.warehouse?.value || 0}` },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <ICard title="Inventory Balance Variance Report">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={buDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue('businessUnit', valueOption);
                        setFieldValue('plant', '');
                        setFieldValue('warehouse', '');
                        setShowReport(false);

                        getPlantDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${
                            profileData?.userId
                          }&AccId=${profileData?.accountId}&BusinessUnitId=${
                            valueOption?.value
                          }&OrgUnitTypeId=${7}`
                        );
                      } else {
                        setShowReport(false);

                        setFieldValue('businessUnit', '');
                        setFieldValue('plant', '');
                        setFieldValue('warehouse', '');
                        setPlantDDL([]);
                        setWareHouseDDL([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue('plant', valueOption);
                        setFieldValue('warehouse', '');
                        getWareHouseDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                        );
                      } else {
                        setFieldValue('plant', valueOption);
                        setFieldValue('warehouse', '');
                        setWareHouseDDL([]);
                      }
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={
                      [{ value: 0, label: 'All' }, ...wareHouseDDL] || []
                    }
                    value={values?.warehouse}
                    label="WareHouse"
                    onChange={(valueOption) => {
                      setFieldValue('warehouse', valueOption);
                    }}
                    placeholder="WareHouse"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 0, label: 'Summary' },
                      { value: 1, label: 'Details' },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue('reportType', valueOption);
                      setShowReport(false);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemType"
                    options={itemTypeList || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue('itemType', valueOption);
                      setShowReport(false);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    type="date"
                    name="date"
                    onChange={(e) => {
                      setFieldValue('date', e.target.value);
                      setShowReport(false);
                    }}
                  />
                </div>
                <div className="mt-5 ml-5">
                  <button
                    type="button"
                    disabled={
                      !values?.date ||
                      !values?.businessUnit ||
                      !values?.itemType ||
                      !values?.reportType
                    }
                    onClick={() => {
                      setShowReport(true);
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>
            </form>
            {showReport && (
              <PowerBIReport
                reportId={reportId}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default InventoryBalanceTreasury;
