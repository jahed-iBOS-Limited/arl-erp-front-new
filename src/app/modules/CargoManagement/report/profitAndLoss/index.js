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
    masterBlLanding,
    GetMasterBlLanding,
    masterBlLandingLoading,
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

  // const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
  //   if (profileData?.accountId && selectedBusinessUnit?.value) {
  //     GetMasterBlLanding(
  //       `${imarineBaseUrl}/domain/ShippingService/GetMasterBlLanding?typeId=${values?.modeOfTransport?.value}&search=${searchValue}&PageNo=${pageNo}&PageSize=${pageSize}`,
  //     );
  //   }
  // };

  const modeOfTransportHandelar = (values) => {
    getGenarateMasterBLDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetGenarateMasterBLDDL?typeId=${values?.modeOfTransport?.value}`,
    );
  };

  const masterBLHandelar = (values) => {
    getHBLFromMasterBL(
      `${imarineBaseUrl}/domain/ShippingService/GetHBLFromMasterBL?masterBlId=${values?.masterBL?.value}&typeId=${values?.modeOfTransport?.value}`,
    );
  };

  const viewHandelar = (values) => {
    console.log(values);
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
        {(masterBlLandingLoading ||
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
                      options={masterBlLanding || []}
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
                <div ref={printRef}>
                  <ProfitAndLossInfo values={values} />
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default ProfitAndLoss;
