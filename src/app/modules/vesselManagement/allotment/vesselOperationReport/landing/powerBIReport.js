import axios from "axios";
import { models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { SetPowerBiAction } from "../../../../_helper/reduxForLocalStorage/Actions";

export default function ReportsByPowerBI({ reportTypeId }) {
  const [, getRowData] = useAxiosGet();
  const dispatch = useDispatch();
  const [, setSeconds] = useState(0);

  const { powerApi: localStorageData } = useSelector(
    (state) => state.localStorage
  );

  const getPowerBIData = (typeId) => {
    const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
    const reportId =
      typeId === 4
        ? "5e1b59c0-c646-4bae-9ec6-f70de8d99c41" // G2G Challan Info (BI)
        : typeId === 5
        ? "971cb3ef-54ba-4ef8-92f3-ce5147b36486" // Lighter Vessel Time Sheet (BI)
        : "";
    // 1st api
    const url = `/domain/PowerBIReport/PowerBIAccessToken`;
    getRowData(url, async (data) => {
      const config = {
        headers: {
          Authorization: `Bearer ${data}`,
        },
      };
      try {
        // 2nd api
        const res = await axios.get(
          `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}`,
          config
        );
        if (res?.data) {
          const configGenerateToken = {
            headers: {
              Authorization: `Bearer ${data}`,
            },
          };
          try {
            const payload = {
              accessLevel: "View",
            };
            // 3rd api
            const resGenerateToken = await axios.post(
              `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`,
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
              //   setBIReport(true);
            }
          } catch (error) {
            // console.log(error);
          }
        }
      } catch (error) {
        // console.log(error);
      }
    });
  };

  const generateTokenPoppup = () => {
    confirmAlert({
      title: "Generate Token",
      message: "Token excess timeout please generate token",
      buttons: [
        {
          label: "Submit",
          onClick: () => {
            dispatch(
              SetPowerBiAction({
                testReportToken: "",
                reportId: "",
                datasetId: "",
                generateToken: "",
                embedUrl: "",
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
        testReportToken: "",
        reportId: "",
        datasetId: "",
        generateToken: "",
        embedUrl: "",
      })
    );
    generateTokenPoppup();
  }, 3000000);

  useEffect(() => {
    getPowerBIData(reportTypeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PowerBIEmbed
        embedConfig={{
          type: "report",
          id: localStorageData?.reportId,
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
              "loaded",
              function() {
                // console.log("Report loaded");
              },
            ],
            [
              "rendered",
              function() {
                // console.log("Report rendered");
              },
            ],
            [
              "error",
              function(event) {
                // console.log(event.detail);
              },
            ],
          ])
        }
        cssClassName={"powerbi-report-style-class"}
        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
    </>
  );
}
