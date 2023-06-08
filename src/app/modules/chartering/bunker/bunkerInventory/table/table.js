/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router";
import { Formik } from "formik";
import { getLandingData } from "../helper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "LSMGO Qty" },
  { name: "LSFO-1 Qty" },
  { name: "LSFO-2 Qty" },
  { name: "Actions" },
];

export default function BunkerInventoryTable() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={(values) => {}}
      >
        {() => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Bunker Inventory</p>
                <div></div>
              </div>

              {loading && <Loading />}
              {gridData?.length ? (
                <ICustomTable ths={headers}>
                  {gridData?.map((item, index) => (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.vesselName}</td>
                      <td className="text-right">{item?.lsmgoqty}</td>
                      <td className="text-right">{item?.lsfo1qty}</td>
                      <td className="text-right">{item?.lsfo2qty}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-around">
                          {item?.bunkerId && (
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">
                                  View Bunker Information Details
                                </Tooltip>
                              }
                            >
                              <span
                                onClick={() => {
                                  history.push({
                                    pathname: `/chartering/bunker/bunkerInformation/view/${item?.bunkerId}`,
                                  });
                                }}
                              >
                                <i className="fas pointer fa-box-open"></i>
                              </span>
                            </OverlayTrigger>
                          )}
                          {item?.costBunkerId ? (
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">
                                  View Bunker Cost Details
                                </Tooltip>
                              }
                            >
                              <span
                                onClick={() => {
                                  history.push({
                                    pathname: `/chartering/bunker/bunkerCost/view/${item?.costBunkerId}`,
                                  });
                                }}
                              >
                                <i className="fas pointer fa-funnel-dollar"></i>
                              </span>
                            </OverlayTrigger>
                          ) : (
                            <span
                              onClick={() => {
                                history.push({
                                  pathname: `/chartering/bunker/bunkerCost/view/${item?.costBunkerId}`,
                                });
                              }}
                            ></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </ICustomTable>
              ) : null}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
