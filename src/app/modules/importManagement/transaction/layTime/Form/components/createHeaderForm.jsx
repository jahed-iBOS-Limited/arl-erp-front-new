import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';
import FormikInput from '../../../../../chartering/_chartinghelper/common/formikInput';
import FormikSelect from '../../../../../chartering/_chartinghelper/common/formikSelect';
import customStyles from '../../../../../chartering/_chartinghelper/common/selectCustomStyle';
import { getBusinessPartnerNameByVoyageDDL } from '../../../../../chartering/helper';
import { initData } from '../addEditForm';
import { daysToDDHHMM } from '../utils';

const HeaderLabelComponent = ({ name }) => {
  return (
    <div className="col-lg-3 d-flex align-items-center font-md">{name} :</div>
  );
};

export function CreateHeaderForm({
  values,
  setFieldValue,
  errors,
  touched,
  setValues,
  setValuesState,
  stackHolderTypeDDL,
  setStackHolderNameDDL,
  rowData,
  setRowData,
  id, // For View Or Disabled Input Field
  setId,
  setSingleData,
}) {
  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [portDDL, getPortDDL] = useAxiosGet();
  const [itemList, getItemList, , setItemList] = useAxiosGet();
  const [itemCategoryDDL, getItemCategoryDDL] = useAxiosGet();
  const [partnerDDL, getPartnerDDL] = useAxiosGet();
  const [bankDDL, getBankDDL, , setBankDDL] = useAxiosGet();

  useEffect(() => {
    getItemCategoryDDL(
      `/wms/ItemPlantWarehouse/GetItemCategoryDDL?accountId=${accId}&businessUnitId=${buId}`,
    );
    getPortDDL(
      `/imp/ImportCommonDDL/GetPortName?accountId=${accId}&businessUnitId=${buId}`,
    );
    getPartnerDDL(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  return (
    <>
      <div className="my-4">
        <>
          <div className="row my-2">
            <HeaderLabelComponent name="Name of Vessel" />

            <div className="col-lg-3">
              <FormikSelect
                value={values?.layTimeType || ''}
                isSearchable={true}
                options={[
                  { value: 1, label: 'Load Port' },
                  { value: 2, label: 'Discharge Port' },
                ]}
                styles={customStyles}
                name="layTimeType"
                label="Lay Time Type"
                onChange={(valueOption) => {
                  setRowData([]);
                  id
                    ? setSingleData({ ...initData, layTimeType: valueOption })
                    : setValues({
                        ...initData,
                        layTimeType: valueOption,
                      });
                }}
                errors={errors}
                touched={touched}
                isClearable={false}
              />
            </div>
            <div className="col-lg-3">
              <FormikInput
                value={values?.vesselName}
                name="vesselName"
                type="text"
                label="Vessel Name"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3 pl-0">
              <FormikInput
                value={values?.voyageNo}
                name="voyageNo"
                type="text"
                label="Voyage No"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>

          <div className="row mt-2">
            <HeaderLabelComponent name="Business Partner Name" />
            <div className="col-lg-3">
              <FormikSelect
                value={values?.stackHolderType || ''}
                isSearchable={true}
                options={stackHolderTypeDDL}
                styles={customStyles}
                name="stackHolderType"
                placeholder="Business Partner Type"
                // label="Business Partner Type"
                onChange={(valueOption) => {
                  setFieldValue('stackHolderType', valueOption);

                  setValuesState({
                    ...initData,
                    vesselName: values?.vesselName,
                    layTimeType: values?.layTimeType,
                    voyageNo: values?.voyageNo,
                    stackHolderType: valueOption,
                  });
                  setId(null);
                  setRowData([]);

                  if (values?.voyageNo?.value) {
                    getBusinessPartnerNameByVoyageDDL(
                      values?.voyageNo?.value,
                      valueOption?.value,
                      setStackHolderNameDDL,
                      setFieldValue, // For demurrage, despatch
                    );
                  }
                }}
                errors={errors}
                touched={touched}
              />
            </div>

            <div className="col-lg-3">
              <FormikSelect
                value={values?.stackHolderName || ''}
                isSearchable={true}
                options={partnerDDL}
                styles={customStyles}
                name="stackHolderName"
                placeholder="Business Partner Name"
                onChange={(valueOption) => {
                  setFieldValue('stackHolderName', valueOption);
                  getBankDDL(
                    `/partner/BusinessPartnerBankInfo/GetBusinessPartnerBankInfoByAccountIdBusinessUnitId?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${valueOption?.value}&Status=true`,
                    (data) => {
                      const modifyData = data?.map((item) => ({
                        ...item,
                        value: item?.bankId,
                        label: item?.bankName,
                      }));
                      setBankDDL(modifyData);
                    },
                  );
                }}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <FormikSelect
                value={values?.stackHolderBank || ''}
                isSearchable={true}
                options={bankDDL}
                styles={customStyles}
                name="stackHolderBank"
                placeholder="Business Partner Bank"
                onChange={(valueOption) => {
                  setFieldValue('stackHolderBank', valueOption);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="row my-2">
            <>
              <HeaderLabelComponent name="Item Category" />
              <div className="col-lg-3">
                <FormikSelect
                  value={values?.itemCategory || ''}
                  isSearchable={true}
                  options={itemCategoryDDL}
                  styles={customStyles}
                  name="itemCategory"
                  placeholder="Item Category"
                  onChange={(valueOption) => {
                    setFieldValue('itemCategory', valueOption || '');
                    setFieldValue('cargo', '');
                    setItemList([]);
                    if (valueOption) {
                      getItemList(
                        `wms/ItemPlantWarehouse/ItemByCategoryDDL?CategoryId=${valueOption?.value}`,
                      );
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
          </div>
          <div className="row my-2">
            <>
              <HeaderLabelComponent name="Item" />
              <div className="col-lg-3">
                <FormikSelect
                  value={values?.cargo || ''}
                  isSearchable={true}
                  options={itemList || []}
                  styles={customStyles}
                  name="cargo"
                  placeholder="Item"
                  onChange={(valueOption) => {
                    setFieldValue('cargo', valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
          </div>

          <div className="row my-2">
            <>
              <HeaderLabelComponent name="Vessel arrived" />
              <div className="col-lg-3">
                <FormikInput
                  value={values?.vesselArrived}
                  name="vesselArrived"
                  type="datetime-local"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>

            <>
              <HeaderLabelComponent name="Cargo Quantity" />
              <div className="col-lg-3 d-flex">
                <div style={{ width: '50%' }}>
                  <FormikInput
                    value={values?.cargoQty}
                    name="cargoQty"
                    type="number"
                    onChange={(e) => {
                      values?.loadingRate &&
                        setFieldValue(
                          'timeAllowedForLoading',
                          (
                            e.target.value / parseFloat(values?.loadingRate)
                          ).toFixed(4) || 0,
                        );

                      setFieldValue('cargoQty', e.target.value);
                    }}
                    placeholder="Cargo Qty"
                    errors={errors}
                    touched={touched}
                    disabled={rowData?.length > 0}
                  />
                </div>

                <div style={{ width: '50%' }}>
                  <FormikInput
                    value={values?.cargoUomSuffix}
                    name="cargoUomSuffix"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </>
          </div>
          <div className="row my-2">
            <>
              <HeaderLabelComponent name="BERTHED/Port at" />
              <div className="col-lg-3">
                <FormikSelect
                  value={values?.portAt || ''}
                  isSearchable={true}
                  options={portDDL || []}
                  styles={customStyles}
                  name="portAt"
                  placeholder="BERTHED/Port at"
                  onChange={(valueOption) => {
                    setFieldValue('portAt', valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
            <>
              <HeaderLabelComponent
                name={
                  values?.layTimeType?.value === 1
                    ? 'Loading Rate'
                    : 'Discharging Rate'
                }
              />
              <div className="col-lg-3 d-flex">
                <div style={{ width: '50%' }}>
                  <FormikInput
                    value={values?.loadingRate}
                    name="loadingRate"
                    type="number"
                    placeholder={
                      values?.layTimeType?.value === 1
                        ? 'Loading Rate'
                        : 'Discharging Rate'
                    }
                    onChange={(e) => {
                      const total = (
                        parseFloat(values?.cargoQty) / e.target.value
                      )?.toFixed(4);

                      values?.cargoQty && e.target.value > 0
                        ? setFieldValue('timeAllowedForLoading', total)
                        : setFieldValue('timeAllowedForLoading', '');
                      setFieldValue('loadingRate', e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                    disabled={rowData?.length > 0}
                  />
                </div>

                <div style={{ width: '50%' }}>
                  <FormikInput
                    value={values?.loadUnloadRateSuffix}
                    name="loadUnloadRateSuffix"
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </>
          </div>
          <div className="row my-2">
            <>
              <HeaderLabelComponent name="NOR Tendered" />
              <div className="col-lg-3">
                <FormikInput
                  value={values?.notTendered}
                  name="notTendered"
                  type="datetime-local"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
            <>
              <HeaderLabelComponent name={'Demurrage Rate'} />
              <div className="col-lg-3">
                <FormikInput
                  value={values?.demurrageRate}
                  name="demurrageRate"
                  type="number"
                  placeholder={'Demurrage Rate'}
                  onChange={(e) => {
                    setFieldValue('despatchRate', Number(e.target.value) / 2);
                    setFieldValue('demurrageRate', e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
          </div>
          <div className="row my-2">
            <>
              <HeaderLabelComponent
                name={
                  values?.layTimeType?.value === 1
                    ? 'Loading Commenced'
                    : 'Discharging Commenced'
                }
              />
              <div className="col-lg-3">
                <FormikInput
                  value={values?.loadingCommenced}
                  name="loadingCommenced"
                  type="datetime-local"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
            <>
              <HeaderLabelComponent name={'Despatch Rate'} />
              <div className="col-lg-3">
                <FormikInput
                  value={values?.despatchRate}
                  name="despatchRate}"
                  type="number"
                  placeholder="Despatch Rate"
                  errors={errors}
                  touched={touched}
                  disabled={true}
                />
              </div>
            </>
          </div>
          <div className="row my-2">
            <>
              <HeaderLabelComponent
                name={
                  values?.layTimeType?.value === 1
                    ? 'Loading Completed'
                    : 'Discharging Completed'
                }
              />
              <div className="col-lg-3">
                <FormikInput
                  value={values?.loadingCompleted}
                  name="loadingCompleted"
                  type="datetime-local"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>

            <>
              <HeaderLabelComponent
                name={`Time allowed for ${
                  values?.layTimeType?.value === 1 ? 'Loading' : 'Discharging'
                }`}
              />
              <div className="col-lg-3">
                <strong>
                  <span>{values?.timeAllowedForLoading}</span>
                  <span className="mx-1">DAYS</span>
                </strong>

                {+values?.timeAllowedForLoading ? (
                  <>
                    /{' '}
                    <strong>
                      <span>
                        {daysToDDHHMM(+values?.timeAllowedForLoading)}
                      </span>
                      <span className="ml-1">(DD:HH:MM)</span>
                    </strong>
                  </>
                ) : null}
              </div>
            </>
          </div>
        </>
      </div>
    </>
  );
}
