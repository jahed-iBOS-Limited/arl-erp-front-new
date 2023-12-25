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
import LocalAndInternationalRateDetailsTable from './localAndInternationalRateDetailsTable';

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
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet();
  const [godownDDL, getGodownDDL] = useAxiosGet();
  const [portDDL, getPortDDL] = useAxiosGet();
  const [motherVesselWiseRate, getMotherVesselWiseRate] = useAxiosGet();

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

  const handleGetGetMotherVesselWiseRate = (values) => {
    const api = `/tms/LigterLoadUnload/GetMotherVesselWiseRateDetails?accountId=${accId}&businessUnitId=${buId}&businessPartnerId=${values.organization?.value}&motherVesselId=${values.motherVessel?.value}&godownId=${values.godown?.value}&portId=${values.port?.value}`;
    getMotherVesselWiseRate(api, (data) => console.log({ data }));
  };

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const fetchForLocalAndGlobalReportDDL = () => {
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`,
    );

    getMotherVesselDDL(
      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    getPortDDL(`/wms/FertilizerOperation/GetDomesticPortDDL`);
  };

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
                      if (valueOption?.value === 4) {
                        //fetch all ddl data
                        fetchForLocalAndGlobalReportDDL()
                      }
                    }}
                    placeholder="Type"
                  />
                </div>

                {/* conditional Rendering ddl and input fields*/}

                {[1, 2].includes(values?.type?.value) && (
                  <>
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
                  </>
                )}

                {[3].includes(values?.type?.value) && (
                  <>
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
                  </>
                )}

                {[4].includes(values?.type?.value) && (
                  <>
                    <div className="col-lg-2">
                      <NewSelect
                        name="shippoint"
                        options={organizationDDL || []}
                        label="Organization"
                        value={values?.organization}
                        onChange={(valueOption) => {
                          setFieldValue('organization', valueOption);
                          setFieldValue('godown', '');
                          if (valueOption?.value) {
                            getGodownDDL(
                              `/tms/LigterLoadUnload/GetShipToPartnerG2GDDL?BusinessUnitId=${buId}&BusinessPartnerId=${valueOption?.value}`,
                            );
                          }
                        }}
                        placeholder="Organization"
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="port"
                        options={portDDL || []}
                        value={values?.port}
                        label="Port"
                        onChange={(valueOption) => {
                          setFieldValue('port', valueOption);
                        }}
                        placeholder="Port"
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="motherVessel"
                        options={motherVesselDDL}
                        value={values?.motherVessel}
                        label="Mother Vessel"
                        onChange={(valueOption) => {
                          setFieldValue('motherVessel', valueOption);
                        }}
                        placeholder="Mother Vessel"
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="godown"
                        options={
                          [{ value: 0, label: 'All' }, ...godownDDL] || []
                        }
                        value={values?.godown}
                        label="Destination/Godown Name"
                        placeholder="Destination/Godown Name"
                        onChange={(valueOption) => {
                          setFieldValue('godown', valueOption);
                        }}
                      />
                    </div>
                  </>
                )}

                <IButton
                  colSize={'col-lg-1'}
                  onClick={() => {
                    if (values?.type?.value === 4) {
                      handleGetGetMotherVesselWiseRate(values);
                    } else {
                      setShowReport(false);
                      setShowReport(true);
                    }
                  }}
                />
              </div>
            </form>

            {[4].includes(values?.type.value) ? (
              <LocalAndInternationalRateDetailsTable
                rowData={motherVesselWiseRate}
              />
            ) : (
              showReport && (
                <PowerBIReport
                  reportId={reportId(values)}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={false}
                />
              )
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default TimeSheetReport;
