import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import NewSelect from '../../../_helper/_select';
import InputField from '../../../_helper/_inputField';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { toast } from 'react-toastify';

const initData = {
  channel: '',
  region: '',
  area: '',
  territory: '',
  transportType: '',
  fromDate: '',
  toDate: '',
  month: '',
};

const validationSchema = Yup.object().shape({
  channel: Yup.object()
    .shape({
      label: Yup.string().required("Channel is required"),
      value: Yup.string().required("Channel is required"),
    })
    .typeError("Channel is required"),
    region: Yup.object()
    .shape({
      label: Yup.string().required("Region is required"),
      value: Yup.string().required("Region is required"),
    })
    .typeError("Region is required"),
    area: Yup.object()
    .shape({
      label: Yup.string().required("Area is required"),
      value: Yup.string().required("Area is required"),
    })
    .typeError("Area is required"),
    territory: Yup.object()
    .shape({
      label: Yup.string().required("Territory is required"),
      value: Yup.string().required("Territory is required"),
    })
    .typeError("Territory is required"),
    transportType: Yup.object()
    .shape({
      label: Yup.string().required("transport Type is required"),
      value: Yup.string().required("Transport Type is required"),
    })
    .typeError("Transport Type is required"),
    month: Yup.string().required(),
});

export default function DistributionPlanCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [channelDDL, getChannelDDL] = useAxiosGet();
  const [regionDDL, getRegionDDL, , setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, , setAreaDDl] = useAxiosGet();
  const [territoryDDL, getTerritoryDDL, , setTerritoryDDL] = useAxiosGet();
  const [rowDto, getRowDto, rowDtoLoading, setRowDto] = useAxiosGet();
  const [, saveDistributionPlan, saveDistributionLoading] = useAxiosPost()

  // get user data from store
  const {
    profileData: { accountId: accId, employeeId },
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

  function getFirstAndLastDateOfMonth(dateString) {
    const [year, month] = dateString.split("-").map(Number);
    const lastDateOfMonth = new Date(year, month, 0);

    const formattedFirstDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const formattedLastDate = `${year}-${month.toString().padStart(2, "0")}-${lastDateOfMonth.getDate().toString().padStart(2, "0")}`;

    return {
      firstDate: formattedFirstDate,
      lastDate: formattedLastDate,
    };
  }

  const saveHandler = (values, cb) => {
    if(!rowDto?.length) {
      return toast.warn("No Item Found");
    }
    const distributionRowList = rowDto?.map((item)=> {
      return {
        rowId: 0,
        distributionPlanningId: 0,
        itemId: item?.itemId,
        itemName: item?.itemName,
        itemCode: item?.itemCode,
        itemUoM: item?.itemUoM,
        planQty: +item?.planQty || 0,
        planRate: +item?.planRate || 0,
        isActive: true,
        actinoBy: item?.actionBy,
      }
    })

    const payload = {
      distributionPlanningId: 0,
      businessUnitId: buId,
      distributionChannelId: values?.channel?.value,
      regionId: values?.region?.value,
      areaId: values?.area?.value,
      territoryId: values?.territory?.value,
      transportTypeId: values?.transportType?.value,
      transportTypeName: values?.transportType?.label,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      isActive: true,
      actinoBy: employeeId,
      distributionRowList: distributionRowList,
    }
    saveDistributionPlan(
      `/oms/DistributionChannel/createDistributionPlanning`,
      payload,
      cb,
      true
    )
  };

  useEffect(() => {
    getRowDto(
      `/oms/DistributionChannel/GetDistributionPlanningItemList?buisnessUnitId=${buId}&plantId=0&wareHouseId=0`,
      (res) => {
        const newRowDto = res?.map((item)=> ({
          ...item,
          planQty: "",
          planRate: "",
          actinoBy: employeeId,
        }))
        setRowDto(newRowDto);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ buId]);

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue, isValid, errors, touched }) => (
        <>
          {(rowDtoLoading || saveDistributionLoading) && <Loading />}
          <IForm title="Distribution Plan Create" getProps={setObjprops}>
            <Form>
              <div className="row global-form">
                <div className="col-lg-12 row m-0 p-0">
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(channelDDL) ? channelDDL : []),
                      ]}
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
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(regionDDL) ? regionDDL : []),
                      ]}
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
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(areaDDL) ? areaDDL : []),
                      ]}
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
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(territoryDDL) ? territoryDDL : []),
                      ]}
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="transportType"
                      options={[{ value: 1, label: 'Direct'}, {value: 2, label: 'Via Transshipment' }]}
                      value={values?.type}
                      label="Transport Type"
                      onChange={(valueOption) => {
                        setFieldValue('transportType', valueOption);
                      }}
                      placeholder="Transport Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="Month"
                      placeholder="Month"
                      name="month"
                      type="month"
                      value={values?.month}
                      onChange={(e) => {
                        setFieldValue('month', e.target.value);
                        setFieldValue('fromDate', getFirstAndLastDateOfMonth(e?.target?.value)?.firstDate)
                        setFieldValue('toDate', getFirstAndLastDateOfMonth(e?.target?.value)?.lastDate)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                  <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th className="text-left">Item Code </th>
                          <th>Item Name</th>
                          <th>Item UoM Name </th>
                          <th>Plan Qty</th>
                          <th>Plan Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.length > 0 &&
                          rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td className="">{index + 1}</td>
                              <td className="">{item?.itemCode}</td>
                              <td className="">{item?.itemName}</td>
                              <td className="">{item?.itemUoMName}</td>
                              <td className="">
                                <InputField
                                  placeholder="Plan Qty"
                                  name="planQty"
                                  type="number"
                                  value={item?.planQty}
                                  onChange={(e) => {
                                    const newItem = {...item};
                                    newItem.planQty = e?.target?.value < 0 ? "" : e?.target?.value;
                                    const newRowDto = rowDto?.map((itm)=> {
                                      return itm?.itemId === newItem?.itemId ? newItem : itm;
                                    })
                                    setRowDto(newRowDto);
                                  }}
                                />
                              </td>
                              <td className="">
                                <InputField
                                  placeholder="Plan Rate"
                                  name="planRate"
                                  type="number"
                                  value={item?.planRate}
                                  onChange={(e) => {
                                    const newItem = {...item};
                                    newItem.planRate = e?.target?.value < 0 ? "" : e?.target?.value;
                                    const newRowDto = rowDto?.map((itm)=> {
                                      return itm?.itemId === newItem?.itemId ? newItem : itm;
                                    })
                                    setRowDto(newRowDto);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
