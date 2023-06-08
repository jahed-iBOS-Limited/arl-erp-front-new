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

const SalesOfficersKPIReport = ({
  values,
  selectedBusinessUnit,
  ratId,
  levelId,
  userId,
}) => {
  const dispatch = useDispatch();
  const [, getRowData, isLoading] = useAxiosGet();
  const { powerApi: localStorageData } = useSelector(
    (state) => state.localStorage
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
          `https://api.powerbi.com/v1.0/myorg/groups/e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a/reports/540426d4-3ef8-44f2-8455-688dd25f88bb`,
          config
        );
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
              `https://api.powerbi.com/v1.0/myorg/groups/e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a/reports/540426d4-3ef8-44f2-8455-688dd25f88bb/GenerateToken`,
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
              { name: "unitid", value: `${selectedBusinessUnit}` },
              { name: "ChannelId", value: `${values?.channel?.value}` },
              { name: "fromdate", value: `${values?.fromDate}` },
              { name: "toDate", value: `${values?.toDate}` },
              { name: "RATId", value: `${ratId}` },
              { name: "intLevelid", value: `${levelId}` },
              { name: "intEmployeeid", value: `${userId}` },
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
                function () {
                  console.log("Report loaded");
                },
              ],
              [
                "rendered",
                function () {
                  console.log("Report rendered");
                },
              ],
              [
                "error",
                function (event) {
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

export default SalesOfficersKPIReport;
