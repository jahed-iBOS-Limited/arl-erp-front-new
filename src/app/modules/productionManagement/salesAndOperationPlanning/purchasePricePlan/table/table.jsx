import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLandingPlantDDL } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import Loading from "../../../../_helper/_loading";
import VersionModal from "./versionModal";
import { SetSalesAndProductionTableLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const PurchasePlanTable = () => {
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [plantDDL, setPlantDDL] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const [
    purchasePlan,
    getPurchasePlan,
    purchasePlanLoader,
    setPurchasePlan,
  ] = useAxiosGet();

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
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
    getLandingPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );

    if (plant && year) {
      getPurchasePlan(
        `/mes/SalesPlanning/GetPurchasePlanding?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${plant?.value}&StrYear=${year?.label}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, plant, year]);

  const createHandler = () => {
    history.push("/internal-control/budget/PurchasePlan/Create");
  };

  return (
    <ICustomCard title="Procurement Plan" createHandler={createHandler}>
      {(fiscalYearDDLloader || purchasePlanLoader) && <Loading />}
      <div className="global-form row">
        <div className="col-lg">
          <label>Plant</label>
          <Select
            onChange={(v) => {
              setPurchasePlan([]);
              dispatch(
                SetSalesAndProductionTableLandingAction({
                  year: "",
                  plant: v,
                })
              );
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
            options={fiscalYearDDL || []}
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
              getPurchasePlan(
                `/mes/SalesPlanning/GetPurchasePlanding?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${plant?.value}&StrYear=${year?.label}`
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

      {purchasePlan?.length > 0 && (
        <div className="table-responsive">
          <table className="global-table table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Horizon Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Plan Quantity</th>
              </tr>
            </thead>
            <tbody>
              {purchasePlan?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.strMonthName}</td>
                  <td>{_dateFormatter(item?.dteStartDateTime)}</td>
                  <td>{_dateFormatter(item?.dteEndDateTime)}</td>
                  <td className="text-center">{item?.procurementPlanQty}</td>
                </tr>
              ))}
            </tbody>
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

export default PurchasePlanTable;
