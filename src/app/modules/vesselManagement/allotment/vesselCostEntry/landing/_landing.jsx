import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import IButton from '../../../../_helper/iButton';
import ICustomCard from '../../../../_helper/_customCard';
import { _fixedPoint } from '../../../../_helper/_fixedPoint';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import IView from '../../../../_helper/_helperIcons/_view';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import { GetDomesticPortDDL } from '../../generalInformation/helper';
import { GetVesselCostData, getMotherVesselDDL } from '../helper';
import FromDateToDateForm from '../../../../_helper/commonInputFieldsGroups/dateForm';
import {
  _dateFormatter,
  _dateFormatterTwo,
  formatDate,
} from '../../../../_helper/_dateFormate';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';

const initData = {
  type: { label: 'Details', value: 1 },
  port: { label: 'All', value: 0 },
  motherVessel: { label: 'All', value: 0 },
};
const headers1 = [
  'SL',
  'Mother Vessel',
  'Survey Qty',
  'Challan Qty (Ton)',
  'Challan Bag Qty (Bag)',
  'Action',
];

const headers2 = [
  'SL',
  'Mother Vessel',
  'Godown Name',
  'Qty (ton)',
  'Qty (bag)',
  'Rate (tk)',
  'Rate ($)',
  'VAT & TAX',
  'Demurrage',
  'Others',
];

const headers3 = ['SL', 'Complete Date', 'Total Qty (Ton)', 'Process'];

const getHeaders = (values) => {
  const typeId = values?.type?.value;
  if (typeId === 1) {
    return headers1;
  } else if (typeId === 2) {
    return headers2;
  } else {
    return headers3;
  }
};

const VesselCostEntry = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [portDDL, setPortDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [, getGridData] = useAxiosGet();
  const [, saveVesselData] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const setLandingData = (values) => {
    if (values?.type?.value === 1) {
      GetVesselCostData(
        buId,
        values?.motherVessel?.value,
        values?.port?.value,
        setGridData,
        setLoading
      );
    } else if (values?.type?.value === 2) {
      getGridData(
        `/wms/FertilizerOperation/ViewVesselCostTopSheetDetails?type=2&MotherVesselId=${
          values?.motherVessel?.value || 0
        }`,
        (resData) => {
          setGridData(resData);
        }
      );
    } else {
      getGridData(
        `/oms/SalesInformation/GetsprG2GStandardCostingGenerateAll?BusinessUnitId=${buId}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intrPart=${values?.type?.value}&Message=${'""'}&isGenerate=${false}`,
        (res) => {
          setGridData(res);
        }
      );
    }
  };

  useEffect(() => {
    setLandingData(initData);
    GetDomesticPortDDL(setPortDDL);
  }, [accId, buId]);

  let totalSurveyQty = 0;
  let totalChallanQty = 0;
  let totalChallanBagQty = 0;

  let totalQtyTon = 0;
  let totalQtyBag = 0;
  let totalVATnTax = 0;
  let totalDemurrage = 0;
  let totalOthers = 0;

  const saveHandler = function (values, cb) {
    saveVesselData(
      `/oms/SalesInformation/PostsprG2GStandardCostingGenerateAll?BusinessUnitId=${buId}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intrPart=${values?.type?.value}&Message=${'""'}&isGenerate=${true}`,
      null,
      cb,
      true
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <>
            <ICustomCard
              title="Vessel Cost"
              saveHandler={() => {
                saveHandler(values, () => {
                  resetForm();
                  setGridData([]);
                });
              }}
              saveDisabled={gridData?.length < 1}
            >
              {loading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { label: 'Details', value: 1 },
                        { label: 'Top Sheet', value: 2 },
                        { label: 'G2G Truck Bill', value: 16 },
                        { label: 'G2G Lighter Bill', value: 17 },
                        { label: 'G2G Ghat Load Unload Bill', value: 22 },
                        { label: 'G2G Dump Unload Bill', value: 31 },
                        {
                          label: 'G2G Standard Costing Challan  Bill',
                          value: 36,
                        },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        setFieldValue('type', valueOption);
                        setFieldValue('motherVessel', '');
                        setFieldValue('port', '');
                        setGridData([]);
                      }}
                      placeholder="Select Type"
                    />
                  </div>
                  {[1, 2].includes(values?.type?.value) ? (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="port"
                          options={
                            [{ label: 'All', value: 0 }, ...portDDL] || []
                          }
                          value={values?.port}
                          label="Loading Port"
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
                          placeholder="Loading Port"
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="motherVessel"
                          options={[
                            { label: 'All', value: 0 },
                            ...motherVesselDDL,
                          ]}
                          value={values?.motherVessel}
                          label="Mother Vessel"
                          onChange={(valueOption) => {
                            setFieldValue('motherVessel', valueOption);
                          }}
                          placeholder="Mother Vessel"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <FromDateToDateForm obj={{ values, setFieldValue }} />
                    </>
                  )}

                  <IButton
                    onClick={() => {
                      setLandingData(values);
                    }}
                  />
                </div>
                {gridData?.length > 0 && (
                  <div className="table-responsive">
                    <table
                      id="table-to-xlsx"
                      className={
                        'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {getHeaders(values)?.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                      {values?.type?.value === 1 ? (
                        <tbody>
                          {gridData?.map((item, index) => {
                            totalSurveyQty += item?.numSurveyQnt;
                            totalChallanQty += item?.NumChallanQntTon;
                            totalChallanBagQty += item?.NumChallanQntBag;
                            return (
                              <tr key={index}>
                                <td> {index + 1}</td>
                                <td>{item?.strMotherVesselName}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.numSurveyQnt, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.NumChallanQntTon, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.NumChallanQntBag, true)}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-around">
                                    <span className="text-center">
                                      <IView
                                        clickHandler={() =>
                                          history.push({
                                            pathname: `/vessel-management/allotment/vesselcostentry/view/${item?.intMotherVesselId}`,
                                          })
                                        }
                                      />
                                    </span>
                                    <span
                                      className="edit"
                                      onClick={() => {
                                        history.push({
                                          pathname: `/vessel-management/allotment/vesselcostentry/update/${item?.intMotherVesselId}`,
                                        });
                                      }}
                                    >
                                      <IEdit title={'Rate Entry'} />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {gridData?.length > 0 && (
                            <tr style={{ fontWeight: 'bold' }}>
                              <td className="text-right" colSpan={2}>
                                Total
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalSurveyQty, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalChallanQty, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalChallanBagQty, true)}
                              </td>
                              <td></td>
                            </tr>
                          )}
                        </tbody>
                      ) : values?.type?.value === 2 ? (
                        <tbody>
                          {gridData?.map((item, index) => {
                            totalQtyTon += item?.quantityTon;
                            totalQtyBag += item?.quantityBag;
                            totalVATnTax += item?.vatNtax;
                            totalDemurrage += item?.demurrage;
                            totalOthers += item?.others;
                            return (
                              <tr key={index}>
                                <td> {index + 1}</td>
                                <td>{item?.motherVesselName}</td>
                                <td>{item?.goDownName}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.quantityTon, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.quantityBag, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.revenueRate, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.revenueRateDollar, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.vatNtax, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.demurrage, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.others, true)}
                                </td>
                              </tr>
                            );
                          })}
                          {gridData?.length > 0 && (
                            <tr style={{ fontWeight: 'bold' }}>
                              <td className="text-right" colSpan={3}>
                                Total
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalQtyTon, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalQtyBag, true)}
                              </td>
                              <td></td>
                              <td></td>
                              <td className="text-right">
                                {_fixedPoint(totalVATnTax, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalDemurrage, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(totalOthers, true)}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      ) : (
                        <>
                          <tbody>
                            {gridData?.map((item, index) => {
                              totalQtyTon += item?.TotalQuantityTon;
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{formatDate(item?.CompletedDate)}</td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.TotalQuantityTon, true)}
                                  </td>
                                  <td>{item?.isprocess ? 'True' : 'False'}</td>
                                </tr>
                              );
                            })}
                            {gridData?.length > 0 && (
                              <tr style={{ fontWeight: 'bold' }}>
                                <td className="text-right" colSpan={2}>
                                  Total
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(totalQtyTon, true)}
                                </td>
                                <td></td>
                              </tr>
                            )}
                          </tbody>
                        </>
                      )}
                    </table>
                  </div>
                )}
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default VesselCostEntry;
