import axios from 'axios';
import { Formik } from 'formik';
import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { SetPowerBiAction } from '../../../../_helper/reduxForLocalStorage/Actions';
import './style.css';

const initData = {};

const TestReport = () => {
  const dispatch = useDispatch();
  const [, getRowData, isLoading] = useAxiosGet();

  const { powerApi: localStorageData } = useSelector(
    (state) => state.localStorage
  );

  const [, setSeconds] = useState(0);

  const getData = () => {
    // 1st api call
    const url = `/domain/PowerBIReport/PowerBIAccessToken`;
    getRowData(url, async (data) => {
      const config = {
        headers: { Authorization: `Bearer ${data}` },
      };
      try {
        // 2nd api call
        const res = await axios.get(
          `https://api.powerbi.com/v1.0/myorg/groups/e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a/reports/868b274c-6f36-4cf6-bac2-b4465979dbcd`,
          config
        );
        if (res?.data) {
          const configGenerateToken = {
            headers: { Authorization: `Bearer ${data}` },
          };
          try {
            const payload = {
              datasets: [
                {
                  id: res?.data?.datasetId,
                  xmlaPermissions: 'ReadOnly',
                },
              ],
              reports: [
                {
                  id: res?.data?.id,
                },
              ],
            };
            // 3rd api
            const resGenerateToken = await axios.post(
              `https://api.powerbi.com/v1.0/myorg/GenerateToken`,
              payload,
              configGenerateToken
            );
            if (resGenerateToken?.data) {
              dispatch(
                SetPowerBiAction({
                  testReportToken: data,
                  //
                  reportId: res?.data?.id,
                  datasetId: res?.data?.datasetId,
                  generateToken: resGenerateToken?.data?.token,
                  embedUrl: res?.data?.embedUrl,
                })
              );
            }
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
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
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Test Report"></CardHeader>
              <CardBody>
                {isLoading && <Loading />}
                <form className="form form-label-right">
                  {localStorageData?.generateToken && (
                    <PowerBIEmbed
                      embedConfig={{
                        id: localStorageData?.reportId,
                        type: 'report',
                        embedUrl: localStorageData?.embedUrl,
                        accessToken: localStorageData?.generateToken,
                        tokenType: models.TokenType.Embed,
                        settings: {
                          panes: {
                            filters: {
                              expanded: false,
                              visible: false,
                            },
                          },
                          background: models.BackgroundType.Transparent,
                        },
                      }}
                      eventHandlers={
                        new Map([
                          [
                            'loaded',
                            // function () {
                            // //  console.log("Report loaded");
                            // },
                          ],
                          [
                            'rendered',
                            // function () {
                            //   console.log("Report rendered");
                            // },
                          ],
                          [
                            'error',
                            // function (event) {
                            //   console.log(event.detail);
                            // },
                          ],
                        ])
                      }
                      getEmbeddedComponent={(embeddedReport) => {
                        window.report = embeddedReport;
                      }}
                      cssClassName={'powerbi-report-style-class'}
                    />
                  )}
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default TestReport;
