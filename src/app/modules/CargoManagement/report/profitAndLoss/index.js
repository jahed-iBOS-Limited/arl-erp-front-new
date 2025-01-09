import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import ProfitAndLossInfo from './profitAndLossInfo';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

const initData = {
  modeOfTransport: {
    value: 1,
    label: 'Air',
  },
};

function ProfitAndLoss() {
  const [
    MBBLWiseProfitLossReport,
    GetMBLWiseProfitLossReport,
    MBBLWiseProfitLossReportLoading,
    setMBLWiseProfitLossReport,
  ] = useAxiosGet();
  const [
    genarateMasterBLDDL,
    getGenarateMasterBLDDL,
    genarateMasterBLDDLLoading,
  ] = useAxiosGet();

  const [
    HBLFromMasterBL,
    getHBLFromMasterBL,
    getHBLFromMasterBLLoading,
    setHBLFromMasterBL,
  ] = useAxiosGet();
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    modeOfTransportHandelar(initData);
    // getLandingData(initData, pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getLandingData = (masterBlId) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetMBLWiseProfitLossReport(
        `${imarineBaseUrl}/domain/ShippingService/GetMBLWiseProfitLossReport?masterBlId=${masterBlId}`,
        (resData) => {
          const collecttionBillingDatas = resData?.collecttionBillingDatas?.map(
            (item) => {
              const converstionrate = +item?.converstionrate || 0;
              const collectionActualAmount = +item?.collectionActualAmount || 0;
              const collectionDummyAmount = +item?.collectionDummyAmount || 0;
              const converstionRateUsd = item?.converstionRateUsd || 0;

              const collectionActualAmountInBDT =
                collectionActualAmount * converstionrate;

              const collectionDummyAmountInBDT =
                collectionDummyAmount * converstionrate;

              const lossAndGain =
                collectionActualAmountInBDT - collectionDummyAmountInBDT;

              const grandTotal = collectionActualAmountInBDT + lossAndGain;
              const amontUSD = grandTotal / converstionRateUsd;

              const totalAmontUSD = isFinite(amontUSD) ? amontUSD : 0;
              return {
                ...item,
                collectionActualAmountInBDT,
                lossAndGain,
                grandTotal,
                amontUSD: totalAmontUSD,
              };
            },
          );

          const paymentBillingDatas = resData?.paymentBillingDatas?.map(
            (item) => {
              const paymentActualAmount = +item?.paymentActualAmount || 0;
              const converstionrate = +item?.converstionrate || 0;
              const paymentDummyAmount = +item?.paymentDummyAmount || 0;
              const converstionRateUsd = item?.converstionRateUsd || 0;

              const paymentActualAmountInBDT =
                paymentActualAmount * converstionrate;

              const paymentDummyAmountInBDT =
                paymentDummyAmount * converstionrate;

              const lossAndGain = paymentDummyAmount - paymentDummyAmountInBDT;
              const grandTotal = paymentActualAmountInBDT + lossAndGain;
              const amontUSD = grandTotal * converstionRateUsd;
              const totalAmontUSD = isFinite(amontUSD) ? amontUSD : 0;
              return {
                ...item,
                paymentActualAmountInBDT,
                lossAndGain,
                grandTotal,
                amontUSD: totalAmontUSD,
              };
            },
          );

          setMBLWiseProfitLossReport({
            ...resData,
            collecttionBillingDatas,
            paymentBillingDatas,
          });
        },
      );
    }
  };

  const modeOfTransportHandelar = (values) => {
    getGenarateMasterBLDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetGenarateMasterBLDDL?typeId=${values?.modeOfTransport?.value}`,
    );
  };

  const masterBLHandelar = (values) => {
    getHBLFromMasterBL(
      `${imarineBaseUrl}/domain/ShippingService/GetHBLFromMasterBL?masterBlId=${values?.masterBL?.value}&typeId=${values?.modeOfTransport?.value}`,
      (resData) => {
        const modifyData = resData?.map((item) => ({
          value: item?.label,
          label: item?.label,
        }));
        setHBLFromMasterBL(modifyData);
      },
    );
  };

  const viewHandelar = (values) => {
    console.log(values, 'values');
    getLandingData(values?.masterBL?.value);
  };
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Profit And Loss',
    pageStyle: `@media print {
                body {
                  -webkit-print-color-adjust: exact;
                }
                @page {
                  size: portrait ! important;
                  margin: 1cm ! important;
                  margin-top: 1.5cm ! important;
                }`,
  });

  return (
    <>
      <ICustomCard
        title="Profit And Loss"
        renderProps={() => {
          return (
            <>
              <button
                onClick={handlePrint}
                type="button"
                className="btn btn-primary px-3 py-2"
              >
                <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
                Print
              </button>
            </>
          );
        }}
      >
        {(MBBLWiseProfitLossReportLoading ||
          genarateMasterBLDDLLoading ||
          getHBLFromMasterBLLoading) && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="modeOfTransport"
                      options={[
                        {
                          value: 1,
                          label: 'Air',
                        },
                        {
                          value: 2,
                          label: 'Sea',
                        },
                      ]}
                      value={values?.modeOfTransport || ''}
                      label="Booking Type"
                      onChange={(valueOption) => {
                        setMBLWiseProfitLossReport({});
                        setFieldValue('modeOfTransport', valueOption);
                        setFieldValue('masterBL', '');
                        setFieldValue('hbl', '');
                        modeOfTransportHandelar({
                          ...values,
                          modeOfTransport: valueOption,
                        });
                      }}
                      placeholder="Booking Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="masterBL"
                      options={genarateMasterBLDDL || []}
                      value={values?.masterBL || ''}
                      label="Master BL"
                      onChange={(valueOption) => {
                        setFieldValue('masterBL', valueOption);
                        setFieldValue('hbl', '');
                        setMBLWiseProfitLossReport({});
                        masterBLHandelar({
                          ...values,
                          masterBL: valueOption,
                        });
                      }}
                      placeholder="Master BL"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* HBL DDL */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="hbl"
                      options={HBLFromMasterBL || []}
                      value={values?.hbl || ''}
                      label="HBL"
                      onChange={(valueOption) => {
                        setFieldValue('hbl', valueOption);
                      }}
                      placeholder="HBL"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ marginTop: '15px' }}
                      onClick={() => {
                        viewHandelar(values);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                {/* Profit And Loss Info */}
                {MBBLWiseProfitLossReport?.rowData && (
                  <div ref={printRef}>
                    <ProfitAndLossInfo
                      values={values}
                      MBBLWiseProfitLossReport={MBBLWiseProfitLossReport}
                    />
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default ProfitAndLoss;
