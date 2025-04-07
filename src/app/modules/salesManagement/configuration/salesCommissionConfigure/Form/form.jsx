import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import ICustomCard from '../../../../_helper/_customCard';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';
import FromDateToDateForm from '../../../../_helper/commonInputFieldsGroups/dateForm';
import RATForm from '../../../../_helper/commonInputFieldsGroups/ratForm';
import IButton from '../../../../_helper/iButton';
import SalesCommissionConfigureFormTable from './table';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { shallowEqual, useSelector } from 'react-redux';

const ValidationSchema = Yup.object().shape({});

export default function FormCmp({
  saveData,
  initData,
  getAreas,
  rowData,
  setRowData,
  commissionTypes,
  desginationList,
  akijAgroFeedCommissionTypeList,
  customerTypeDDL,
}) {
  const history = useHistory();
  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [itemGroupDDL, getItemGroupDDL] = useAxiosGet();
  const [businessPartnerList, getBusinessPartnerList] = useAxiosGet();

  useEffect(() => {
    getBusinessPartnerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemGroupDDL(
      `/oms/TradeOffer/GetDiscountOfferGroupDDL?businessUnitId=${selectedBusinessUnit?.value}`
    );
  }, [selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={ValidationSchema}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <ICustomCard
            title="Sales Commission Entry"
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => {
              resetForm(initData);
            }}
            saveHandler={() => {
              saveData(values, () => {
                resetForm(initData);
              });
            }}
          >
            <div className="global-form">
              <form className="form form-label-right">
                <div className="form-group row ">
                  <div className="col-lg-3">
                    <NewSelect
                      name="commissionType"
                      options={commissionTypes}
                      value={values?.commissionType}
                      label="Commission Type"
                      placeholder="Commission Type"
                      onChange={(e) => {
                        setFieldValue('commissionType', e);
                        setRowData([]);
                      }}
                    />
                  </div>

                  {[46].includes(values?.commissionType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessPartner"
                        options={businessPartnerList || []}
                        value={values?.businessPartner}
                        label="Business Partner"
                        placeholder="Business Partner"
                        onChange={(valueOption) => {
                          setFieldValue('businessPartner', valueOption);
                          setFieldValue('channel', {
                            value: valueOption?.channelId,
                            label: valueOption?.channelName,
                          });
                          setFieldValue('region', {
                            value: valueOption?.regionId,
                            label: valueOption?.regionName,
                          });
                          setFieldValue('area', {
                            value: valueOption?.areaId,
                            label: valueOption?.areaName,
                          });
                          setFieldValue('territory', {
                            value: valueOption?.territoryId,
                            label: valueOption?.territoryName,
                          });
                        }}
                      />
                    </div>
                  )}

                  {/* RTA Form */}
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      area: [
                        14, 16, 20, 23, 17, 18, 25, 27, 22, 35, 36, 37, 38, 39,
                        40, 41, 46,
                      ].includes(values?.commissionType?.value),
                      territory: false,
                      allElement: true,
                      channelDisable: [46].includes(
                        values?.commissionType?.value
                      ),
                      regionDisable: [46].includes(
                        values?.commissionType?.value
                      ),
                      areaDisable: [46].includes(values?.commissionType?.value),
                      territoryDisable: [46].includes(
                        values?.commissionType?.value
                      ),
                      onChange: () => {
                        if (
                          ![
                            17, 18, 25, 27, 22, 35, 36, 37, 38, 39, 40, 46,
                          ].includes(values?.commissionType?.value)
                        ) {
                          setRowData([]);
                        }
                      },
                    }}
                  />

                  <div className="col-lg-3">
                    <NewSelect
                      name="customerStatusType"
                      options={customerTypeDDL || []}
                      value={values?.customerStatusType}
                      label="Customer Status Type"
                      onChange={(e) => {
                        setFieldValue('customerStatusType', e);
                        setRowData([]);
                      }}
                    />
                  </div>

                  <FromDateToDateForm obj={{ values, setFieldValue }} />

                  {[
                    17,
                    18,
                    25,
                    27,
                    22,
                    35,
                    36,
                    37,
                    38,
                    39,
                    40,
                    41,
                    ...akijAgroFeedCommissionTypeList,
                  ].includes(values?.commissionType?.value) && (
                    <>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="From Achievement"
                          value={values?.fromAchievement}
                          name="fromAchievement"
                          placeholder="From Achievement"
                          type={`text`}
                        />
                      </div>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="To Achievement"
                          value={values?.toAchievement}
                          name="toAchievement"
                          placeholder="To Achievement"
                          type={`text`}
                        />
                      </div>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="From Quantity"
                          value={values?.fromQuantity}
                          name="fromQuantity"
                          placeholder="From Quantity"
                          type={`text`}
                        />
                      </div>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="To Quantity"
                          value={values?.toQuantity}
                          name="toQuantity"
                          placeholder="To Quantity"
                          type={`text`}
                        />
                      </div>
                    </>
                  )}
                  <div className={`col-lg-3`}>
                    <InputField
                      label="Common Rate"
                      value={values?.commonRate}
                      name="commonRate"
                      placeholder="Common Rate"
                      type={`text`}
                    />
                  </div>
                  {[35, 36, 37, 38, 39, 40, 41].includes(
                    values?.commissionType?.value
                  ) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemGroup"
                        options={itemGroupDDL?.data || []}
                        value={values?.itemGroup}
                        label="Item Group"
                        onChange={(e) => {
                          setFieldValue('itemGroup', e);
                        }}
                      />
                    </div>
                  )}
                  {[40].includes(values?.commissionType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="designation"
                        options={desginationList || []}
                        value={values?.designation}
                        label="Designation"
                        onChange={(e) => {
                          setFieldValue('designation', e);
                        }}
                      />
                    </div>
                  )}
                  <IButton
                    title={
                      [
                        17,
                        18,
                        25,
                        27,
                        22,
                        35,
                        36,
                        37,
                        38,
                        39,
                        40,
                        41,
                        ...akijAgroFeedCommissionTypeList,
                      ].includes(values?.commissionType?.value)
                        ? 'Add'
                        : 'Show'
                    }
                    onClick={() => {
                      getAreas(values, () => {
                        if (
                          [
                            17, 18, 25, 27, 22, 35, 36, 37, 38, 39, 40, 41, 46,
                          ].includes(values?.commissionType?.value)
                        ) {
                          setFieldValue('channel', '');
                          setFieldValue('region', '');
                          setFieldValue('area', '');
                          setFieldValue('fromAchievement', '');
                          setFieldValue('toAchievement', '');
                          setFieldValue('fromQuantity', '');
                          setFieldValue('toQuantity', '');
                          setFieldValue('businessPartner', '');
                        }
                      });
                    }}
                  />
                </div>
              </form>
            </div>
            <SalesCommissionConfigureFormTable
              obj={{
                rowData,
                setRowData,
                values,
                akijAgroFeedCommissionTypeList,
              }}
            />
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
