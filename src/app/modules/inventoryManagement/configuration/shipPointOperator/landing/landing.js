import { Formik } from 'formik';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ICustomCard from '../../../../_helper/_customCard';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import ShipPointOperatorForm from './shipPointOperator/form';
import ShipmentPointOperatorTable from './shipPointOperator/table';
import ShipPointAndTerritoryForm from './shippingPointAndTerritory/form';
import ShipmentPointAndTerritoryTable from './shippingPointAndTerritory/table';

const initData = {
  type: { value: 1, label: 'Shipping Point Operator' },
  businessUnit: { value: 0, label: 'All Business Unit' },
};

export default function ShipPointOperatorLanding() {
  const history = useHistory();
  const [pageTitle, setPageTitle] = useState('Shipping Point Operator');
  const [pageType, setPageType] = useState({
    value: 1,
    label: 'Shipping Point Operator',
  });
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [rowData, getRowData, rowDataLoading] = useAxiosGet();
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const handleGetRowData = (values, pageNo, pageSize) => {
    const api = `/wms/ShipPoint/GetShippingPointNTerritoryBridge?businessUnitId=${buId}&channelId=${values?.channel?.value}&regionId=${values?.region?.value}&areaId=${values?.area?.value}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=asc`;

    getRowData(api, (data) => console.log({ data }));
  };

  return (
    <ICustomCard
      title={pageTitle}
      createHandler={() => {
        history.push({
          pathname: `/inventory-management/configuration/shippingpointoperator/add`,
          state: pageType,
        });
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={({ resetForm }) => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            {rowDataLoading && <Loading />}
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: 'Shipping Point Operator' },
                      { value: 2, label: 'Shipping Point & Territory Bridge' },
                    ]}
                    value={
                      values?.type ?? {
                        value: 1,
                        label: 'Shipping Point Operator',
                      }
                    }
                    label="Type"
                    onChange={(valueOption) => {
                      setPageTitle(valueOption?.label);
                      setPageType(valueOption);
                      setFieldValue('type', valueOption);
                    }}
                  />
                </div>

                {values?.type?.value === 1 && (
                  <ShipPointOperatorForm
                    values={values}
                    setFieldValue={setFieldValue}
                  />
                )}
                {values?.type?.value === 2 && (
                  <>
                    <ShipPointAndTerritoryForm
                      values={values}
                      setFieldValue={setFieldValue}
                    />

                    <div className="col-lg-3 col d-flex align-items-end justify-content-evaly">
                      <button
                        className="btn btn-primary mt-3"
                        type="text"
                        disabled={
                          !values.channel || !values.area || !values.region
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          handleGetRowData(values, pageNo, pageSize);
                          console.log('clickkk');
                        }}
                      >
                        View
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
            {values?.type?.value === 1 && (
              <ShipmentPointOperatorTable values={values} />
            )}
            {values?.type?.value === 2 && (
              <ShipmentPointAndTerritoryTable
                values={values}
                pageNo={pageNo}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
                handleGetRowData={handleGetRowData}
                rowData={rowData}
              />
            )}
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
