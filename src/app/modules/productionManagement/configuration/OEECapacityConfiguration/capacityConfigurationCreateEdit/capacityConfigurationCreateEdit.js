import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IForm from '../../../../_helper/_form';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { plantNameDDLApi, shopFloorNameDDLApi } from './util/api';
import { CapacityConfigurationValidationSchema } from './util/validations';

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
  const history = useHistory();

  //Redux State
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId, userId },
  } = useSelector((state) => state.authData);

  //Call Apis
  //PlantName
  const [plantNameDDL, getPlantNameDDL, plantNameDDLLoading] = useAxiosGet();
  //ShopFloor
  const [shopFloorDDL, getShopFloorDDL, shopFloorDDLLoading] = useAxiosGet();
  //machineName
  const [
    machineNameDDL,
    getMachineNameDDL,
    machineNameDDLLoading,
  ] = useAxiosGet();
  //machineNo
  const [machineNoDDL, getMachineNoDDL, machineNoDDLLoading] = useAxiosGet();
  //itemName
  const [itemNameDDL, getItemNameDDL, itemNameDDLLoading] = useAxiosGet();
  //bomName
  const [bomNameDDL, getBomNameDDL, bomNameDDLLoading] = useAxiosGet();



  useEffect(() => {
    getPlantNameDDL(plantNameDDLApi(buId, accId, userId), data => console.log({data}));
  }, [buId, userId, accId]);

  const saveHandler = (values, cb) => {
    alert('Working...');
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          <IForm title={`Create Capacity Configuration`} getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="Plant Name"
                    options={plantNameDDL ||[]}
                    value={values?.plantName}
                    label="Plant Name"
                    onChange={(valueOption) => {
                      setFieldValue('plantName', valueOption);
                      if(valueOption) {
                        getShopFloorDDL(shopFloorNameDDLApi(accId, buId, valueOption.value))
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="Shop Floor/Section"
                    options={shopFloorDDL || []}
                    value={values?.shopFloor}
                    label="Shop Floor/Section"
                    onChange={(valueOption) => {
                      setFieldValue('shopFloor', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="Machine Name"
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
                  <NewSelect
                    name="Machine No"
                    options={machineNoDDL || []}
                    value={values?.machineNo}
                    label="Machin No"
                    onChange={(valueOption) => {
                      setFieldValue('machineNo', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="Item Name"
                    options={itemNameDDL || []}
                    value={values?.itemName}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue('itemName', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="BoM Name"
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
                    name="Machine Capacity Per Hr"
                    value={values?.machineCapacityPerHr}
                    label="Machine Capacity Per Hr"
                    onChange={(valueOption) => {
                      setFieldValue('machineCapacityPerHr', valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="SMV Cycle Time"
                    value={values?.SMVCycleTime}
                    label="SMV Cycle Time"
                    onChange={(valueOption) => {
                      setFieldValue('SMVCycleTime', valueOption);
                    }}
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
                  />
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
