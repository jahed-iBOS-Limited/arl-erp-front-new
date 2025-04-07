import axios from 'axios';
import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { SetPowerBiAction } from '../../../_helper/reduxForLocalStorage/Actions';
import './styles.css';

const VatRebateReconciliationRDLCReport = () => {
  const dispatch = useDispatch();
  const { powerApi: localStorageData } = useSelector(
    (state) => state.localStorage
  );
  const [, setSeconds] = useState(0);
  const [, getRowData, isLoading] = useAxiosGet();
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const getData = () => {
    // 1st api
    const url = `/domain/PowerBIReport/PowerBIAccessToken`;
    getRowData(url, async (data) => {
      const config = {
        headers: { Authorization: `Bearer ${data}` },
      };
      try {
        // 2nd api
        const res = await axios.get(
          `https://api.powerbi.com/v1.0/myorg/groups/218e3d7e-f3ea-4f66-8150-bb16eb6fc606/reports/24eb9663-4ca5-49f6-88f9-bf0629c32d76`,
          config
        );
        if (res?.data) {
          const configGenerateToken = {
            headers: { Authorization: `Bearer ${data}` },
          };
          try {
            const payload = {
              accessLevel: 'View',
            };
            // 3rd api
            const resGenerateToken = await axios.post(
              `https://api.powerbi.com/v1.0/myorg/groups/218e3d7e-f3ea-4f66-8150-bb16eb6fc606/reports/24eb9663-4ca5-49f6-88f9-bf0629c32d76/GenerateToken`,
              payload,
              configGenerateToken
            );
            if (resGenerateToken?.data) {
              dispatch(
                SetPowerBiAction({
                  reportId: res?.data?.id,
                  testReportToken: data,
                  datasetId: res?.data?.datasetId,
                  generateToken: resGenerateToken?.data?.token,
                  embedUrl: res?.data?.embedUrl,
                })
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const generateTokenPoppup = () => {
    confirmAlert({
      title: 'Generate Token',
      message: 'Token excess timeout please generate token',
      buttons: [
        {
          label: 'Submit',
          onClick: () => {
            dispatch(
              SetPowerBiAction({
                testReportToken: '',
                reportId: '',
                datasetId: '',
                generateToken: '',
                embedUrl: '',
              })
            );
            window.location.reload();
            clearInterval(setSeconds(0));
          },
        },
      ],
    });
  };

  setTimeout(() => {
    dispatch(
      SetPowerBiAction({
        testReportToken: '',
        reportId: '',
        datasetId: '',
        generateToken: '',
        embedUrl: '',
      })
    );
    generateTokenPoppup();
  }, 3000000);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title={'VAT Rebate Reconciliation'}></CardHeader>
      <CardBody>
        {isLoading && <Loading />}
        <div>
          {localStorageData?.generateToken && (
            <PowerBIEmbed
              embedConfig={{
                id: localStorageData?.reportId,
                type: 'report',
                embedUrl: localStorageData?.embedUrl,
                accessToken: localStorageData?.generateToken,
                tokenType: models.TokenType.Embed,
                parameterValues: [
                  {
                    name: 'unitID',
                    value: `${selectedBusinessUnit?.value}`,
                  },
                ],
                settings: {
                  commands: {
                    parameterPanel: {
                      enabled: false,
                    },
                  },
                },
              }}
              eventHandlers={
                new Map([
                  [
                    'loaded',
                    function () {
                      console.log('Report loaded');
                    },
                  ],
                  [
                    'rendered',
                    function () {
                      console.log('Report rendered');
                    },
                  ],
                  [
                    'error',
                    function (event) {
                      console.log(event.detail);
                    },
                  ],
                ])
              }
              cssClassName={'powerbi-report-style-class'}
              getEmbeddedComponent={(embeddedReport) => {
                window.report = embeddedReport;
              }}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default VatRebateReconciliationRDLCReport;
