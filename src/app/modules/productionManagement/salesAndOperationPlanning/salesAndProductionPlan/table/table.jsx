import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLandingPlantDDL, getSalesPlanLanding } from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import Loading from "../../../../_helper/_loading";
import VersionModal from "./versionModal";
import { SetSalesAndProductionTableLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const SalesAndProductionTable = () => {
  const [, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  /* Version Modal State */
  const [versionModalShow, setVersionModalShow] = useState(false);
  const [versionModalData, setVersionModalData] = useState();

  const { profileData, selectedBusinessUnit, localStorage } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        localStorage: state.localStorage,
      };
    }
  );
  const { salesAndProductionTableLanding } = localStorage;
  const { plant, year } = salesAndProductionTableLanding;

  useEffect(() => {
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`, (data) => {
      setYearDDL(data);
    });
    getLandingPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );

    if (plant && year) {
      getSalesPlanLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plant?.value,
        year?.label,
        setGridData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, plant, year]);

  const createHandler = () => {
    history.push(
      "/production-management/salesAndOperationsPlanning/salesAndProductionPlan/Create"
    );
  };

  return (
    <ICustomCard title="Sales Plan" createHandler={createHandler}>
      {(loading || fiscalYearDDLloader) && <Loading />}

      <div className="global-form row">
        <div className="col-lg">
          <label>Plant</label>
          <Select
            onChange={(v) => {
              // getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`, (data) => {
              //   setYearDDL(data);
              // });
              // getSalesPlanYearDDL(
              //   profileData?.accountId,
              //   selectedBusinessUnit?.value,
              //   v?.value,
              //   setYearDDL
              // );
              dispatch(
                SetSalesAndProductionTableLandingAction({
                  year: "",
                  plant: v,
                })
              );

              setGridData([]);
            }}
            options={plantDDL || []}
            value={plant}
            isSearchable={true}
            name="plant"
            styles={customStyles}
            placeholder="Plant"
          />
        </div>
        <div className="col-lg">
          <label>Year</label>
          <Select
            onChange={(v) => {
              dispatch(
                SetSalesAndProductionTableLandingAction({
                  plant,
                  year: v,
                })
              );
            }}
            options={yearDDL || []}
            value={year}
            isSearchable={true}
            name="year"
            styles={customStyles}
            placeholder="Year"
          />
        </div>

        <div className="col-lg">
          <button
            onClick={() => {
              getSalesPlanLanding(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                plant?.value,
                year?.label,
                setGridData,
                setLoading
              );
            }}
            style={{ marginTop: "18px" }}
            className="btn btn-primary"
            disabled={!plant || !year}
          >
            View
          </button>
        </div>
      </div>

      {gridData?.length > 0 && (
        <div className="table-responsive">
          <table className="global-table table">
            <>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Horizon Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Sales Plan Quantity</th>
                  <th>Production Plan Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.sl}</td>
                    <td>{item?.horizonName}</td>
                    <td>{_dateFormatter(item?.startDate)}</td>
                    <td>{_dateFormatter(item?.endDate)}</td>
                    <td>{item?.planQTY}</td>
                    <td>{item?.productionPlanQTY}</td>
                    <td>
                      <div className="d-flex justify-content-around">
                        {/* Edit */}
                        <span
                          onClick={() =>
                            history.push(
                              `/production-management/salesAndOperationsPlanning/salesAndProductionPlan/edit/${item?.salesPlanId}`
                            )
                          }
                        >
                          <IEdit />
                        </span>

                        {/* Extend */}
                        <span
                          className="extend"
                          onClick={() => {
                            history.push(
                              `/production-management/salesAndOperationsPlanning/salesAndProductionPlan/${plant.value}/${item?.salesPlanId}/createPP`
                            );
                          }}
                        >
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Create Production Plan"}
                              </Tooltip>
                            }
                          >
                            <span>
                              <i className={`fa fa-arrows-alt`}></i>
                            </span>
                          </OverlayTrigger>
                        </span>

                        {/* View */}
                        <span
                          onClick={() =>
                            history.push(
                              `/production-management/salesAndOperationsPlanning/salesAndProductionPlan/view/${item?.salesPlanId}`
                            )
                          }
                        >
                          <span>
                            <i className={`fa fa-eye`}></i>
                          </span>
                        </span>

                        {/* version */}
                        <span
                          onClick={() => {
                            setVersionModalShow(true);
                            setVersionModalData(item);
                          }}
                        >
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">{"Log Version"}</Tooltip>
                            }
                          >
                            <span>
                              <i className={`fa fa-history`}></i>
                            </span>
                          </OverlayTrigger>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          </table>
        </div>
      )}

      <IViewModal
        show={versionModalShow}
        onHide={() => setVersionModalShow(false)}
      >
        <VersionModal
          setVersionModalShow={setVersionModalShow}
          versionModalData={versionModalData}
          setVersionModalData={setVersionModalData}
        />
      </IViewModal>
    </ICustomCard>
  );
};

export default SalesAndProductionTable;
