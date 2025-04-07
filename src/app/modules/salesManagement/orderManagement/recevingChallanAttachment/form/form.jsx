import axios from 'axios';
import { Formik } from 'formik';
import React from 'react';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import ICustomCard from '../../../../_helper/_customCard';
import FromDateToDateForm from '../../../../_helper/commonInputFieldsGroups/dateForm';
import RATForm from '../../../../_helper/commonInputFieldsGroups/ratForm';
import IButton from '../../../../_helper/iButton';
import PartialChallanTable from './partialChallanTable';

function Form({
  initData,
  saveHandler,
  gridData,
  setGridData,
  history,
  commonGridFunc,
  selectedAll,
  allSelect,
  accId,
  buId,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <ICustomCard
            title={'Receving Challan Attachment Entry Form'}
            backHandler={() => {
              history.goBack();
            }}
            saveHandler={() => {
              handleSubmit();
            }}
          >
            <form>
              <div className="row global-form">
                <RATForm
                  obj={{
                    values,
                    setFieldValue,
                    region: false,
                    area: false,
                    territory: false,
                    onChange: () => {
                      setFieldValue('customer', '');
                      setGridData([]);
                    },
                  }}
                />

                <div className="col-lg-3">
                  <label>Customer</label>
                  <SearchAsyncSelect
                    selectedValue={values?.customer}
                    handleChange={(valueOption) => {
                      setFieldValue('customer', valueOption);
                      setGridData([]);
                    }}
                    isDisabled={!values?.channel}
                    placeholder="Search Customer"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3 || !searchValue) return [];
                      return axios
                        .get(
                          `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                        )
                        .then((res) => res?.data);
                    }}
                  />
                </div>

                <FromDateToDateForm obj={{ values, setFieldValue }} />

                <IButton
                  onClick={() => {
                    setGridData([]);
                    commonGridFunc(values);
                  }}
                  disabled={!values?.channel}
                />
              </div>
            </form>

            <PartialChallanTable
              obj={{ gridData, allSelect, selectedAll, setGridData }}
            />
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default Form;
