import axios from 'axios';
import { Form, Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import { getMotherVesselInfo } from '../../../../_helper/_commonApi';
import ICustomCard from '../../../../_helper/_customCard';
import FormikError from '../../../../_helper/_formikError';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';
import IButton from '../../../../_helper/iButton';
import { getMotherVesselDDL, validationSchema } from '../helper';

export default function FormCmp({
  type,
  buId,
  title,
  accId,
  portDDL,
  initData,
  setLoading,
  saveHandler,
  organizationDDL,
  motherVesselDDL,
  setMotherVesselDDL,
  approveTenderInformation,
}) {
  const radioStyle = { height: '25px', width: '25px' };
  const history = useHistory();
  const loadOptions = async (v) => {
    await [];
    if (v.length < 3) return [];
    return axios
      .get(
        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
        }));
        return [...updateList];
      });
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => resetForm(initData)}
            saveHandler={() => handleSubmit()}
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                {buId === 94 && (
                  <div
                    className={
                      type === 'edit'
                        ? 'col-9 mt-3 d-flex'
                        : 'col-12 mt-3 d-flex'
                    }
                  >
                    <div className="d-flex align-items-center mr-5">
                      <input
                        style={radioStyle}
                        type="radio"
                        name="type"
                        id="badc"
                        value={values?.type}
                        checked={values?.type === 'badc'}
                        onChange={() => {
                          setFieldValue('type', 'badc');
                        }}
                        disabled={type === 'view'}
                      />
                      <label htmlFor="badc" className="ml-1">
                        <h3>BADC</h3>
                      </label>
                    </div>
                    <div className="d-flex align-items-center ml-5">
                      <input
                        style={radioStyle}
                        type="radio"
                        name="type"
                        id="bcic"
                        value={values?.type}
                        checked={values?.type === 'bcic'}
                        onChange={() => {
                          setFieldValue('type', 'bcic');
                        }}
                        disabled={type === 'view'}
                      />
                      <label htmlFor="bcic" className="ml-1">
                        <h3>BCIC</h3>
                      </label>
                    </div>
                  </div>
                )}
                {type === 'edit' && (
                  <IButton
                    className={'btn-info'}
                    onClick={() => {
                      approveTenderInformation(values);
                    }}
                  >
                    Approve
                  </IButton>
                )}
                {buId === 178 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="organization"
                      options={organizationDDL || []}
                      value={values?.organization}
                      label="Organization"
                      onChange={(valueOption) => {
                        setFieldValue('organization', valueOption);
                      }}
                      placeholder="Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <NewSelect
                    name="port"
                    options={portDDL || []}
                    value={values?.port}
                    label="Port"
                    onChange={(valueOption) => {
                      setFieldValue('port', valueOption);
                      setFieldValue('motherVessel', '');
                      getMotherVesselDDL(
                        accId,
                        buId,
                        setMotherVesselDDL,
                        valueOption?.value
                      );
                    }}
                    placeholder="Port"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={motherVesselDDL}
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    onChange={(valueOption) => {
                      setFieldValue('motherVessel', valueOption);

                      if (values?.port && valueOption) {
                        getMotherVesselInfo(
                          valueOption?.value,
                          values?.port?.value,
                          setLoading,
                          (resData) => {
                            setFieldValue(
                              'programNo',
                              resData?.programNo || ''
                            );
                            setFieldValue('item', {
                              value: resData?.intProductId,
                              label: resData?.strProductName,
                            });
                            setFieldValue('lotNo', resData?.strLotNumber || '');
                          }
                        );
                      }
                    }}
                    placeholder="Mother Vessel"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Program No</label>
                  <InputField
                    value={values?.programNo}
                    name="programNo"
                    placeholder="Program No"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item</label>
                  <SearchAsyncSelect
                    selectedValue={values?.item}
                    handleChange={(valueOption) => {
                      setFieldValue('item', valueOption);
                    }}
                    placeholder="Search Item"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      const corporationTypeId =
                        buId === 94
                          ? values?.type === 'badc'
                            ? 73244
                            : 73245
                          : values?.organization?.value;
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${corporationTypeId}&SearchTerm=${searchValue}`
                        )
                        .then((res) => res?.data);
                    }}
                    isDisabled={true}
                  />
                  <FormikError errors={errors} name="item" touched={touched} />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="UoM"
                    options={[{ value: 1, label: 'Ton' }]}
                    value={values?.UoM}
                    label="UoM"
                    onChange={(valueOption) => {
                      setFieldValue('UoM', valueOption);
                    }}
                    placeholder="UoM"
                    errors={errors}
                    touched={touched}
                    isDisabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.lotNo}
                    name="lotNo"
                    label="Lot No"
                    placeholder="Lot No"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.award}
                    name="award"
                    label="Award"
                    placeholder="Award"
                    type="text"
                    disabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.programQuantity}
                    name="programQuantity"
                    placeholder="Program Quantity"
                    label="Program Quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue('programQuantity', e.target.value);
                      setFieldValue('weight', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.weight}
                    name="weight"
                    placeholder="Weight"
                    label="Weight"
                    type="text"
                  />
                </div>

                <div className="col-lg-3">
                  <label>CNF</label>
                  <SearchAsyncSelect
                    selectedValue={values?.cnf}
                    handleChange={(valueOption) => {
                      setFieldValue('cnf', valueOption);
                    }}
                    placeholder={'Search CNF'}
                    loadOptions={loadOptions}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.cnfRate}
                    name="cnfRate"
                    placeholder="CNF Rate"
                    label="CNF Rate"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Steve Dore</label>
                  <SearchAsyncSelect
                    selectedValue={values?.steveDore}
                    handleChange={(valueOption) => {
                      setFieldValue('steveDore', valueOption);
                    }}
                    placeholder={'Search Steve Dore'}
                    loadOptions={loadOptions}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.steveDoreRate}
                    name="steveDoreRate"
                    placeholder="Steve Dore Rate"
                    label="Steve Dore Rate"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Surveyor</label>
                  <SearchAsyncSelect
                    selectedValue={values?.surveyor}
                    handleChange={(valueOption) => {
                      setFieldValue('surveyor', valueOption);
                    }}
                    placeholder={'Search Surveyor'}
                    loadOptions={loadOptions}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.surveyorRate}
                    name="surveyorRate"
                    placeholder="Surveyor Rate"
                    label="Surveyor Rate"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Hatch Labour</label>
                  <SearchAsyncSelect
                    selectedValue={values?.hatchLabour}
                    handleChange={(valueOption) => {
                      setFieldValue('hatchLabour', valueOption);
                    }}
                    placeholder={'Search Hatch Labour'}
                    loadOptions={loadOptions}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.hatchLabourRate}
                    name="hatchLabourRate"
                    placeholder="Hatch Labour Rate"
                    label="Hatch Labour Rate"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="hasTransportBill"
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                    ]}
                    value={values?.hasTransportBill}
                    label="Has Transport Bill"
                    onChange={(valueOption) => {
                      setFieldValue('hasTransportBill', valueOption);
                    }}
                    placeholder="Has Transport Bill"
                    // isDisabled={type}
                  />
                </div>
              </div>
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
