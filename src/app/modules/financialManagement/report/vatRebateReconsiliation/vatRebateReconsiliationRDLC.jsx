import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './styles.css';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { SetPowerBiAction } from '../../../_helper/reduxForLocalStorage/Actions';
import Loading from '../../../_helper/_loading';
import {
   Card,
   CardBody,
   CardHeader,
   ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';

const VatRebateReconciliationRDLCReport = () => {
   const dispatch = useDispatch();
   const [, getRowData, isLoading] = useAxiosGet();
   const { powerApi: localStorageData } = useSelector(
      state => state.localStorage
   );

   const { selectedBusinessUnit } = useSelector(
      state => state?.authData,
      shallowEqual
   );

   const [, setSeconds] = useState(0);

   const getData = () => {
      // 1st api
      const url = `/domain/PowerBIReport/PowerBIAccessToken`;
      getRowData(url, async data => {
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
                           testReportToken: data,
                           reportId: res?.data?.id,
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
         setSeconds(seconds => seconds + 1);
      }, 1000);
      return () => clearInterval(interval);
   }, []);
   return (
      <Card>
         {true && <ModalProgressBar />}
         <CardHeader title={"VAT Rebate Reconciliation"}></CardHeader>
         <CardBody>
            <div>
               {isLoading && <Loading />}
               {localStorageData?.generateToken ? (
                  <PowerBIEmbed
                     embedConfig={{
                        type: 'report',
                        id: localStorageData?.reportId,
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
                              function() {
                                 console.log('Report loaded');
                              },
                           ],
                           [
                              'rendered',
                              function() {
                                 console.log('Report rendered');
                              },
                           ],
                           [
                              'error',
                              function(event) {
                                 console.log(event.detail);
                              },
                           ],
                        ])
                     }
                     cssClassName={'powerbi-report-style-class'}
                     getEmbeddedComponent={embeddedReport => {
                        window.report = embeddedReport;
                     }}
                  />
               ) : null}
            </div>
         </CardBody>
      </Card>
   );
};

export default VatRebateReconciliationRDLCReport;
