import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import NewSelect from '../../../_helper/_select';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { toast } from 'react-toastify';
import EntryTable from './entryTable';
import ViewTable from './viewTable';

const initData = {
  channel: '',
  region: '',
  area: '',
  territory: '',
  fromDate: '',
  toDate: '',
  plant: '',
  warehouse: '',
  year: '',
  horizon: '',
};

const validationSchema = Yup.object().shape({
  channel: Yup.object()
    .shape({
      label: Yup.string().required('Channel is required'),
      value: Yup.string().required('Channel is required'),
    })
    .typeError('Channel is required'),
  region: Yup.object()
    .shape({
      label: Yup.string().required('Region is required'),
      value: Yup.string().required('Region is required'),
    })
    .typeError('Region is required'),
  area: Yup.object()
    .shape({
      label: Yup.string().required('Area is required'),
      value: Yup.string().required('Area is required'),
    })
    .typeError('Area is required'),
  territory: Yup.object()
    .shape({
      label: Yup.string().required('Territory is required'),
      value: Yup.string().required('Territory is required'),
    })
    .typeError('Territory is required'),
});

export default function DistributionPlanCreate() {
  const location = useLocation();
  const [objProps, setObjprops] = useState({});
  const [modifiedData, setModifiedData] = useState({});
  const [channelDDL, getChannelDDL] = useAxiosGet();
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL, warehouseLoading, setWarehouseDDL] = useAxiosGet();
  const [yearDDL, getYearDDL, yearLoading, setYearDDL] = useAxiosGet();
  const [horizonDDL, getHorizonDDL, horizonLoading, setHorizonDDL] = useAxiosGet();
  const [regionDDL, getRegionDDL, regionLoading, setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, areaLoading, setAreaDDl] = useAxiosGet();
  const [territoryDDL, getTerritoryDDL, territoryLoading, setTerritoryDDL] = useAxiosGet();
  const [rowDto, getRowDto, rowDtoLoading, setRowDto] = useAxiosGet();
  const [, saveDistributionPlan, saveDistributionLoading] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId, employeeId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // handle channel change
  const handleChannelChange = (valueOption) => {
    const channelId = valueOption?.value || 0;
    getRegionDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.regionId,
          label: item?.regionName,
        }));
        setRegionDDL(newDDL);
      }
    );
  };

  // handle region change
  const handleRegionChange = (values, valueOption) => {
    const regionId = valueOption?.label ? `&regionId=${valueOption?.value}` : '';
    getAreaDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.channel?.value}${regionId}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.areaId,
          label: item?.areaName,
        }));
        setAreaDDl(newDDL);
      }
    );
  };

  // handle Area change
  const handleAreaChange = (values, valueOption) => {
    const areaId = valueOption?.label ? `&areaId=${valueOption?.value}` : '';
    getTerritoryDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.channel?.value}&regionId=${values?.region?.value}${areaId}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.territoryId,
          label: item?.territoryName,
        }));
        setTerritoryDDL(newDDL);
      }
    );
  };

  // function getFirstAndLastDateOfMonth(dateString) {
  //   const [year, month] = dateString.split('-').map(Number);
  //   const lastDateOfMonth = new Date(year, month, 0);

  //   const formattedFirstDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  //   const formattedLastDate = `${year}-${month.toString().padStart(2, '0')}-${lastDateOfMonth
  //     .getDate()
  //     .toString()
  //     .padStart(2, '0')}`;

  //   return {
  //     firstDate: formattedFirstDate,
  //     lastDate: formattedLastDate,
  //   };
  // }

  const saveHandler = (values, cb) => {
    if (!rowDto?.itemList?.length) {
      return toast.warn('No Item Found');
    }

    for (let item of rowDto?.itemList) {
      if (item?.planQty || item?.planRate) {
        if (!item?.planQty) {
          return toast.warn('Plan Qty(Direct) is required!');
        }
        if (!item?.planRate) {
          return toast.warn('Plan Rate(Direct) is required!');
        }
      }
      if (item?.planTransQty || item?.planTransRate) {
        if (!item?.planTransQty) {
          return toast.warn('Plan Qty(Via Transshipment) is required!');
        }
        if (!item?.planTransRate) {
          return toast.warn('Plan Rate(Via Transshipment) is required!');
        }
      }
    }

    const distributionRowList = rowDto?.itemList?.map((item) => {
      return {
        rowId: item?.rowId || 0,
        distributionPlanningId: item?.distributionPlanningId || 0,
        itemId: item?.itemId,
        itemName: item?.itemName,
        itemCode: item?.itemCode,
        itemUoM: item?.itemUoM,
        planQty: +item?.planQty || 0,
        planRate: +item?.planRate || 0,
        planTransQty: +item?.planTransQty || 0,
        planTransRate: +item?.planTransRate || 0,
        isActive: true,
        actinoBy: employeeId,


        // itemUoMName: "string",
      };
    });


    const payload = {
      distributionPlanningId: location?.state?.item?.distributionPlanningId || 0,
      businessUnitId: buId,
      distributionChannelId: values?.channel?.value,
      regionId: values?.region?.value,
      areaId: values?.area?.value,
      territoryId: values?.territory?.value,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      isActive: true,
      actinoBy: employeeId,
      distributionRowList: distributionRowList,

      // businessUnitName: "string",
      // distributionChannelName: "string",
      // regionName: "string",
      // areaName: "string",
      // territoryName: "string",
      // transportTypeId: 0,
      // transportTypeName: "string",
      plantHouseId: values?.plant?.value,
      wareHouseId: values?.warehouse?.value,
      monthId: values?.horizon?.value,
      yearId: values?.year?.value,
    };
    saveDistributionPlan(
      `/oms/DistributionChannel/CreateAndEditDistributionPlanning`,
      payload,
      location?.state?.isEdit ? null : cb,
      true
    );
  };

  useEffect(() => {
    const { state } = location || {};
    const { isEdit, item } = state || {};
    if (isEdit) {
      const modifiedInitData = {
        channel: { value: item?.distributionChannelId, label: item?.distributionChannelName },
        region: { value: item?.regionId, label: item?.regionName },
        area: { value: item?.areaId, label: item?.areaName },
        territory: { value: item?.territoryId, label: item?.territoryName },
        plant: { value: item?.plantHouseId, label: item?.plantHouseName },
        warehouse: { value: item?.wareHouseId, label: item?.wareHouseName },
        year: { value: item?.yearId, label: item?.yearId },
        horizon: { value: item?.monthId, label: item?.monthName },
        fromDate: item?.fromDate,
        toDate: item?.toDate,
      };
      setModifiedData(modifiedInitData);
      handleChannelChange(modifiedInitData?.channel);
      handleRegionChange(modifiedInitData, modifiedInitData?.region);
      handleAreaChange(modifiedInitData, modifiedInitData?.area);
      getWarehouseDDL(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${item?.plantHouseId}&OrgUnitTypeId=8`
      );
      getYearDDL(
        `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${item?.plantHouseId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { state } = location || {};
    if (state?.isEdit) {
      setRowDto({itemList : state?.item?.distributionRowList});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={location?.state?.isEdit ? modifiedData : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          setRowDto({});
        });
      }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue, isValid, errors, touched }) => (
        <>
          {(rowDtoLoading ||
            saveDistributionLoading ||
            territoryLoading ||
            areaLoading ||
            regionLoading ||
            warehouseLoading ||
            yearLoading ||
            horizonLoading) && <Loading />}
          <IForm
            title={location?.state?.isEdit ? 'Distribution Plan Edit' : 'Distribution Plan Create'}
            getProps={setObjprops}
          >
            <Form>
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={channelDDL || []}
                      value={values?.channel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setFieldValue('channel', valueOption);
                        setFieldValue('region', '');
                        setFieldValue('area', '');
                        setFieldValue('territory', '');
                        handleChannelChange(valueOption);
                      }}
                      placeholder="Select Distribution Channel"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="region"
                      options={regionDDL || []}
                      value={values?.region}
                      label="Region"
                      onChange={(valueOption) => {
                        setFieldValue('region', valueOption);
                        setFieldValue('area', '');
                        setFieldValue('territory', '');
                        handleRegionChange(values, valueOption);
                      }}
                      placeholder="Region"
                      isDisabled={!values?.channel}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="area"
                      options={areaDDL || []}
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        setFieldValue('area', valueOption);
                        setFieldValue('territory', '');
                        handleAreaChange(values, valueOption);
                      }}
                      placeholder="Area"
                      isDisabled={!values?.region}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territory"
                      options={territoryDDL || []}
                      value={values?.territory}
                      label="Territory"
                      onChange={(valueOption) => {
                        setFieldValue('territory', valueOption);
                      }}
                      placeholder="Territory"
                      isDisabled={!values?.area}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('plant', valueOption);
                          getWarehouseDDL(
                            `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                          );
                          getYearDDL(
                            `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue('plant', '');
                          setFieldValue('warehouse', '');
                          setFieldValue('year', '');
                          setFieldValue('horizon', '');
                          setWarehouseDDL([]);
                          setYearDDL([]);
                          setHorizonDDL([]);
                        }
                      }}
                      placeholder="Select plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      options={warehouseDDL || []}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('warehouse', valueOption);
                        } else {
                          setFieldValue('warehouse', '');
                        }
                      }}
                      placeholder="Select Warehouse"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.plant}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={yearDDL || []}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('year', valueOption);
                          getHorizonDDL(
                            `/mes/MesDDL/GetPlanningHorizonDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${values.plant?.value}&YearId=${valueOption?.value}`
                          );
                        } else {
                          setFieldValue('year', '');
                          setFieldValue('horizon', '');
                          setHorizonDDL([]);
                        }
                      }}
                      placeholder="Select year"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.plant}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="horizon"
                      options={horizonDDL || []}
                      value={values?.horizon}
                      label="Planning Horizon"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('horizon', valueOption);
                          setFieldValue('fromDate', valueOption?.startdatetime);
                          setFieldValue('toDate', valueOption?.enddatetime);
                        } else {
                          setFieldValue('horizon', '');
                          setFieldValue('fromDate', '');
                          setFieldValue('toDate', '');
                        }
                      }}
                      placeholder="Select horizon"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.year}
                    />
                  </div>
                  <div className="col-lg-1">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: '18px' }}
                      disabled={
                        !values?.plant || !values?.warehouse || !values?.year || !values?.horizon
                      }
                      onClick={() => {
                        getRowDto(
                          `/oms/DistributionChannel/GetDistributionPlanningItemList?buisnessUnitId=${buId}&plantId=${values?.plant?.value}&warehouseId=${values?.warehouse?.value}&year=${values?.year?.value}&month=${values?.horizon?.value}`,
                          (res) => {
                            if (res?.response === "Already Exists") {
                              toast.warn("Already Exist this entry!")
                            }
                          }
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  {
                    rowDto?.response === "Already Exists" ? <ViewTable rowDto={rowDto}/> : <EntryTable rowDto={rowDto} setRowDto={setRowDto}/>
                  }
                </div>
              </div>

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
