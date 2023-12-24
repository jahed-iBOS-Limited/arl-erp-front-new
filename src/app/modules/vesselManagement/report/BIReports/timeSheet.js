import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ICustomCard from '../../../_helper/_customCard';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import FromDateToDateForm from '../../../_helper/commonInputFieldsGroups/dateForm';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import IButton from '../../../_helper/iButton';
import { PortAndMotherVessel } from '../../common/components';
import { GetLighterVesselDDL, getShippointDDL } from './helper';

const TimeSheetReport = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;

  const reportId = (values) => {
    const typeId = values?.type?.value;
    const timeSheet = `50b5c487-69a5-4a7c-addc-59d65a19ec3e`;
    const ghatOperations = `2e26b151-7a1f-4dd8-acdc-683a57165e7a`;

    return [1, 2].includes(typeId)
      ? timeSheet
      : [3].includes(typeId)
      ? ghatOperations
      : '';
  };

  const [showReport, setShowReport] = useState(false);
  const [lighterVessel, setLighterVessel] = useState([]);
  const [shippointDDL, setShippointDDL] = useState([]);
  const [supplierDDL, getSupplierDDL] = useAxiosGet();

  const initData = {
    type: '',
    shippoint: '',
    supplier: '',
    motherVessel: '',
    lighterVessel: '',
    port: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  };

  const parameterValues = (values) => {
    // console.log("program", values);
    const typeId = values?.type?.value;

    const timeSheet = [
      { name: 'RptTypeId', value: `${+values?.type?.value}` },
      { name: 'Port', value: `${+values?.port?.value}` },
      { name: 'ShipPointId', value: `${+values?.shippoint?.value}` },
      { name: 'MotherVesselId', value: `${+values?.motherVessel?.value}` },
      { name: 'LighterVesselId', value: `${+values?.lighterVessel?.value}` },
      { name: 'fromdate', value: `${values?.fromDate}` },
      { name: 'todate', value: `${values?.toDate}` },
    ];

    const ghatOperations = [
      { name: 'intShipPointId', value: `${+values?.shippoint?.value}` },
      { name: 'intSupplierId', value: `${+values?.supplier?.value}` },
      { name: 'fromDate', value: `${values?.fromDate}` },
      { name: 'toDate', value: `${values?.toDate}` },
    ];

    return [1, 2].includes(typeId)
      ? timeSheet
      : [3].includes(typeId)
      ? ghatOperations
      : '';
  };

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getShippointDDL(accId, buId, setShippointDDL);
    getSupplierDDL(
      `/wms/TransportMode/GetTransportMode?intParid=2&intBusinessUnitId=${buId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Time sheet">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: 'Details Report' },
                      { value: 2, label: 'Top Sheet Report' },
                      { value: 3, label: 'Ghat Operations Report' },
                      {
                        value: 4,
                        label: 'Local and International Rate Details',
                      },
                    ]}
                    label="Type"
                    value={values?.type}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue('type', valueOption);
                    }}
                    placeholder="Type"
                  />
                </div>
                {![4].includes(values.type?.value) && (
                  <div className="col-lg-2">
                    <NewSelect
                      name="shippoint"
                      options={
                        [{ value: 0, label: 'All' }, ...shippointDDL] || []
                      }
                      label="Shippoint"
                      value={values?.shippoint}
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setFieldValue('shippoint', valueOption);
                      }}
                      placeholder="Shippoint"
                    />
                  </div>
                )}
                {values?.type?.value === 3 && (
                  <div className="col-lg-2">
                    <NewSelect
                      name="supplier"
                      options={[
                        { value: 0, label: 'All' },
                        ...(supplierDDL || []),
                      ]}
                      value={values?.supplier}
                      label="Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue('supplier', valueOption);
                      }}
                      placeholder="Supplier Name"
                    />
                  </div>
                )}

                {[1, 2].includes(values?.type?.value) && (
                  <>
                    <PortAndMotherVessel
                      obj={{
                        values,
                        setFieldValue,
                        colSize: 'col-lg-2',
                        onChange: (filedName, allValues) => {
                          if (filedName === 'motherVessel') {
                            GetLighterVesselDDL(
                              allValues?.motherVessel?.value,
                              setLighterVessel,
                            );
                            setFieldValue('lighterVessel', '');
                          }
                        },
                      }}
                    />
                    <div className="col-lg-2">
                      <NewSelect
                        name="lighterVessel"
                        options={
                          [{ value: 0, label: 'All' }, ...lighterVessel] || []
                        }
                        label="Lighter Vessel"
                        value={values?.lighterVessel}
                        onChange={(valueOption) => {
                          setShowReport(false);
                          setFieldValue('lighterVessel', valueOption);
                        }}
                        placeholder="Lighter Vessel"
                      />
                    </div>
                  </>
                )}
                {![4].includes(values.type?.value) && (
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: () => {
                        setShowReport(false);
                      },
                      colSize: 'col-lg-2',
                    }}
                  />
                )}
                <IButton
                  colSize={'col-lg-1'}
                  onClick={() => {
                    setShowReport(false);
                    setShowReport(true);
                  }}
                />
              </div>
            </form>
            {showReport && (
              <PowerBIReport
                reportId={reportId(values)}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default TimeSheetReport;
