import axios from "axios";
import { models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import React, { useEffect } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useDispatch, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { SetPowerBiAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import Loading from "../../../../_helper/_loading";
import "./styles.css";

const SubScheduleRDLCReport = ({ values, selectedBusinessUnit }) => {
  const dispatch = useDispatch();
  const [, getRowData, isLoading] = useAxiosGet();
  const { powerApi: localStorageData } = useSelector((state) => state.localStorage);

  const getData = () => {
    // 1st api
    const url = `/domain/PowerBIReport/PowerBIAccessToken`;
    getRowData(url, async (data) => {
      const config = {
        headers: { Authorization: `Bearer ${data}` },
      };
      try {
        // 2nd api
        const res = await axios.get(`https://api.powerbi.com/v1.0/myorg/groups/218e3d7e-f3ea-4f66-8150-bb16eb6fc606/reports/ef951be6-72a9-44d7-a158-1ed88d476761`, config);
        if (res?.data) {
          const configGenerateToken = {
            headers: { Authorization: `Bearer ${data}` },
          };
          try {
            const payload = {
              accessLevel: "View",
            };
            // 3rd api
            const resGenerateToken = await axios.post(
              `https://api.powerbi.com/v1.0/myorg/groups/218e3d7e-f3ea-4f66-8150-bb16eb6fc606/reports/ef951be6-72a9-44d7-a158-1ed88d476761/GenerateToken`,
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
  return (
    <div>
      {isLoading && <Loading />}
      {localStorageData?.generateToken ? (
        <PowerBIEmbed
          embedConfig={{
            type: "report",
            id: localStorageData?.reportId,
            embedUrl: localStorageData?.embedUrl,
            accessToken: localStorageData?.generateToken,
            tokenType: models.TokenType.Embed,
            parameterValues: [
              { name: "unit", value: `${selectedBusinessUnit?.value}` },
              { name: "GLId", value: `${values?.generalLedger?.value}` },
              { name: "fromDate", value: `${values?.fromDate}` },
              { name: "toDate", value: `${values?.toDate}` },
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
                "loaded",
                function() {
                  console.log("Report loaded");
                },
              ],
              [
                "rendered",
                function() {
                  console.log("Report rendered");
                },
              ],
              [
                "error",
                function(event) {
                  console.log(event.detail);
                },
              ],
            ])
          }
          cssClassName={"powerbi-report-style-class"}
          getEmbeddedComponent={(embeddedReport) => {
            window.report = embeddedReport;
          }}
        />
      ) : null}
    </div>
  );
};

export default SubScheduleRDLCReport;
