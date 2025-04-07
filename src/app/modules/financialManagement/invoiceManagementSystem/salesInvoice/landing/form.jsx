import React from 'react';
import NewSelect from '../../../../_helper/_select';
import RATForm from '../../../../_helper/commonInputFieldsGroups/ratForm';
import FromDateToDateForm from '../../../../_helper/commonInputFieldsGroups/dateForm';
import IButton from '../../../../_helper/iButton';

function SalesInvoiceLandingForm({ obj }) {
  const {
    pageNo,
    values,
    pageSize,
    setRowDto,
    getGridData,
    setFieldValue,
    setTopSheetData,
    getCustomerDDL,
    customerDDL,
    accId,
    buId,
  } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="row global-form global-form-custom">
          <div className="col-lg-3">
            <NewSelect
              name="type"
              value={values?.type}
              label="Type"
              placeholder="Type"
              options={[
                { value: 1, label: 'Details' },
                // { value: 2, label: 'Top Sheet' },
              ]}
              onChange={(valueOption) => {
                setFieldValue('type', valueOption);
                setRowDto([]);
                setTopSheetData([]);
              }}
            />
          </div>

          <RATForm
            obj={{
              values,
              setFieldValue,
              region: false,
              area: false,
              territory: false,
              allElement: false,
              onChange: (formValues) => {
                setRowDto([]);
                setTopSheetData([]);
                getCustomerDDL(
                  `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}&channelId=${formValues?.channel?.value}`
                );
              },
            }}
          />
          <div className="col-lg-3">
            <NewSelect
              name="customer"
              value={values?.customer}
              label="Customer"
              options={[{ value: 0, label: 'All' }, ...customerDDL] || []}
              onChange={(valueOption) => {
                setFieldValue('customer', valueOption);
                setRowDto([]);
                setTopSheetData([]);
              }}
            />
          </div>
          <FromDateToDateForm
            obj={{
              values,
              setFieldValue,
              onChange: () => {
                setRowDto([]);
                setTopSheetData([]);
              },
            }}
          />
          {values?.type?.value !== 2 && (
            <div className="col-lg-3">
              <NewSelect
                name="status"
                value={values?.status}
                label="Status"
                placeholder="Status"
                options={[
                  { value: 1, label: 'Complete' },
                  { value: 2, label: 'Pending' },
                  { value: 3, label: 'Canceled' },
                ]}
                onChange={(valueOption) => {
                  setFieldValue('status', valueOption);
                  setRowDto([]);
                  setTopSheetData([]);
                }}
              />
            </div>
          )}
          <IButton
            onClick={() => {
              getGridData(values, pageNo, pageSize);
            }}
            disabled={
              !values?.fromDate ||
              !values?.toDate ||
              !values?.channel ||
              !values?.status
            }
          />
        </div>
      </form>
    </>
  );
}

export default SalesInvoiceLandingForm;
