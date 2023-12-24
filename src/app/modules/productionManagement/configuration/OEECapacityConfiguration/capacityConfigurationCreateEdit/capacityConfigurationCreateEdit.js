import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import IForm from '../../../../_helper/_form';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import {
  bomNameDDLApi,
  itemNameDDLApi,
  machineNameDDLApi,
  plantNameDDLApi,
  shopFloorNameDDLApi,
} from '../util/api';
import { CapacityConfigurationValidationSchema } from '../util/validations';

const initData = {
  plantName: '',
  shopFloor: '',
  machineName: '',
  machineNo: '',
  itemName: '',
  bomName: '',
  machineCapacityPerHr: '',
  SMVCycleTime: '',
  standardRPM: '',
  stdWastage: '',
};

export default function CapacityConfigurationCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [pageTitle, setPageTitle] = useState('');
  const { location } = useHistory();

  //Redux State
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId, userId },
  } = useSelector((state) => state.authData);

  //Call Apis - get
  const [plantNameDDL, getPlantNameDDL, plantNameDDLLoading] = useAxiosGet();
  const [shopFloorDDL, getShopFloorDDL, shopFloorDDLLoading] = useAxiosGet();
  const [
    machineNameDDL,
    getMachineNameDDL,
    machineNameDDLLoading,
  ] = useAxiosGet();
  //   const [machineNoDDL, getMachineNoDDL, machineNoDDLLoading] = useAxiosGet();
  const [itemNameDDL, getItemNameDDL, itemNameDDLLoading] = useAxiosGet();
  const [bomNameDDL, getBomNameDDL, bomNameDDLLoading] = useAxiosGet();

  //Call Apis - post
  const [, saveCapacityConfiguration] = useAxiosPost();
  const [, editCapacityConfiguration] = useAxiosPost();

  useEffect(() => {
    getPlantNameDDL(plantNameDDLApi(buId, accId, userId));
  }, [buId, accId, userId]);

  const loadItemNameDDL = (searchText, PlantId) => {
    if (searchText?.length < 3) return [];
    return axios
      .get(itemNameDDLApi(accId, buId, PlantId, searchText))
      .then((res) => res?.data);
  };

  let editableInitData;
  if (location?.state?.rowData) {
    const rowData = location?.state?.rowData;
    editableInitData = {
      plantName: { value: rowData?.plantId, label: rowData?.plantName },
      shopFloor: { value: rowData?.shopfloorId, label: rowData?.shopFloorName },
      machineName: { value: rowData?.machineId, label: rowData?.machineName },
      itemName: { value: rowData?.itemId, label: rowData?.itemName },
      bomName: { value: rowData?.bomId, label: rowData?.bomName },
      machineCapacityPerHr: rowData?.machineCapacityPerHour,
      SMVCycleTime: rowData?.smvcycleTime,
      standardRPM: rowData?.standerdRpm,
      stdWastage: rowData?.stdWastagesQty,
      nptConfigId: rowData?.nptConfigId,
    };
  }

  const saveHandler = (values, cb) => {
    const savePayload = {
      businessUnitId: buId,
      plantId: values?.plantName?.value,
      plantName: values?.plantName?.label,
      shopfloorId: values?.shopFloor?.value,
      shopFloorName: values?.shopFloor?.label,
      machineId: values?.machineName?.value,
      machineName: values?.machineName?.label,
      machineCode: '',
      itemId: values?.itemName?.value,
      itemName: values?.itemName?.label,
      bomId: values?.bomName?.value,
      bomName: values?.bomName?.label,
      machineCapacityPerHour: values?.machineCapacityPerHr,
      smvcycleTime: values?.SMVCycleTime,
      standerdRpm: values?.standardRPM,
      stdWastagesQty: values?.stdWastage,
      isActive: true,
      createBy: userId,
    };

    const editingPayload = {
      nptConfigId: values?.nptConfigId,
      machineCapacityPerHour: values?.machineCapacityPerHr,
      smvcycleTime: values?.SMVCycleTime,
      standerdRpm: values?.standardRPM,
      stdWastagesQty: values?.stdWastage,
      isActive: true,
      updateBy: userId,
    };

    if (location?.state?.isEditPage) {
      editCapacityConfiguration(
        `/mes/OeeProductWaste/EditCapacityConfiguration`,
        editingPayload,
        null,
        true,
      );
    } else {
      saveCapacityConfiguration(
        `/mes/OeeProductWaste/CreateCapacityConfiguration`,
        savePayload,
        null,
        true,
      );
    }
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        location?.state?.rowData
          ? { ...initData, ...editableInitData }
          : initData
      }
      validationSchema={CapacityConfigurationValidationSchema}
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
          {false && <Loading />}
          {console.log({errors, touched})}
          <IForm
            title={`${
              location?.state?.rowData ? 'Edit' : 'Create'
            } Capacity Configuration`}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plantName"
                    options={plantNameDDL || []}
                    value={values?.plantName}
                    label="Plant Name"
                    onChange={(valueOption) => {
                      setFieldValue('itemName', '');
                      setFieldValue('bomName', '');
                      setFieldValue('plantName', valueOption);
                      if (valueOption?.value) {
                        getShopFloorDDL(
                          shopFloorNameDDLApi(accId, buId, valueOption.value),
                        );
                        getItemNameDDL(
                          itemNameDDLApi(accId, buId, valueOption.value),
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloor"
                    options={shopFloorDDL || []}
                    value={values?.shopFloor}
                    label="Shop Floor/Section"
                    onChange={(valueOption) => {
                      setFieldValue('bomName', '');
                      setFieldValue('shopFloor', valueOption);
                      if (valueOption) {
                        getMachineNameDDL(
                          machineNameDDLApi(buId, valueOption.value),
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="machineName"
                    options={machineNameDDL || []}
                    value={values?.machineName}
                    label="Machine Name"
                    onChange={(valueOption) => {
                      setFieldValue('machineName', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.itemName}
                    isSearchIcon={true}
                    isDisabled={!values?.plantName?.value}
                    handleChange={(valueOption) => {
                      setFieldValue('itemName', valueOption);
                      if (valueOption) {
                        getBomNameDDL(
                          bomNameDDLApi({
                            buId,
                            accId,
                            plantId: values?.plantName.value,
                            itemId: valueOption.value,
                            shopFloorId: values?.shopFloor.value,
                          }),
                        );
                      }
                    }}
                    loadOptions={(s) =>
                      loadItemNameDDL(s, values?.plantName?.value)
                    }
                    placeholder="Search by - "
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bomName"
                    options={bomNameDDL || []}
                    value={values?.bomName}
                    label="BoM Name"
                    onChange={(valueOption) => {
                      setFieldValue('bomName', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="machineCapacityPerHr"
                    type="text"
                    value={values?.machineCapacityPerHr}
                    label="Machine Capacity Per Hr"
                    onChange={(e) => {
                      setFieldValue('machineCapacityPerHr', e.target.value);
                    }}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="SMVCycleTime"
                    type="text"
                    value={values?.SMVCycleTime}
                    label="SMV Cycle Time"
                    onChange={(e) => {
                      setFieldValue('SMVCycleTime', e.target.value);
                    }}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.standardRPM}
                    label="Standard RPM"
                    name="standardRPM"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('standardRPM', e.target.value);
                    }}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.stdWastage}
                    label="Std Wastage"
                    name="stdWastage"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('stdWastage', e.target.value);
                    }}
                    errors={errors}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                // disabled={
                //   !values?.plantName?.value ||
                //   !values?.shopFloor?.value ||
                //   !values?.machineName?.value ||
                //   !values?.itemName?.value ||
                //   !values?.bomName?.value ||
                //   !values?.machineCapacityPerHr ||
                //   !values?.SMVCycleTime
                // }
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
