import axios from "axios";
import { Formik } from "formik";
import { models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { SetPowerBiAction } from "../../../_helper/reduxForLocalStorage/Actions";
import Loading from "../../../_helper/_loading";

import "./style.css";

const initData = {};

const MeltingScrapUsedSummaryReportRDLC = () => {
  const dispatch = useDispatch();
  const [, getRowData, isLoading] = useAxiosGet();
  const [loading] = useState(false);

  const { powerApi: localStorageData } = useSelector(
    (state) => state.localStorage
  );

  const [, setSeconds] = useState(0);

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
          `https://api.powerbi.com/v1.0/myorg/groups/e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a/reports/15d8774d-a635-4fa9-a921-cd1fa1a34a08`,
          config
        );
        if (res?.data) {
          const configGenerateToken = {
            headers: { Authorization: `Bearer ${data}` },
          };
          try {
            const payload = {
              "accessLevel": "View"
            };
            // 3rd api
            const resGenerateToken = await axios.post(
              `https://api.powerbi.com/v1.0/myorg/groups/e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a/reports/15d8774d-a635-4fa9-a921-cd1fa1a34a08/GenerateToken`,
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
              <CardHeader title="Melting Scrap Used Summary Report"></CardHeader>
              <CardBody>
                {(isLoading || loading) && <Loading />}
                <form className="form form-label-right">
                  {localStorageData?.generateToken && (
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
                    </>
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

export default MeltingScrapUsedSummaryReportRDLC;
