/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
// import { toast } from "react-toastify";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import Loading from "../../../_chartinghelper/loading/_loading";
import { createTrip, editTrip, getTripDataById } from "../helper";
import { calculateTotalExpense } from "../utils";
import Form from "./_form";

const initData = {
  // vessel type add for new requirement order by Iqbal vai
  /* Header State */
  lighterVessel: "", // DDL
  vesselType :"",
  loadPort: "", // DDL
  dischargePort: "", // DDL
  dteTripCommencedDate: "",
  dteTripCompletionDate: "",
  numTotalTripDuration: "",
  isComplete: false,
  receiveDate: "",
  dischargeStartDate: "",
  dischargeComplDate: "",

  tripNo: "",
  arrivalAtCtg: "",
  loadingCommenceAtCtg: "",
  loadingCompleteAtCtg: "",
  departureAtCtg: "",

  /* Row State */
  motherVessel: "", // DDL
  voyageNo: "",
  srnumber: "",
  eta: "",
  numBlqty: 0,
  consigneeParty: "", // DDL
  lcnumber: "",
  cargo: "", // DDL
  numEstimatedCargoQty: 0,
  numFreight: 0,
  numActualCargoQty: 0,
  numTotalFreight: 0,

  /* Expense */
  numDieselSupply: 0,
  numDieselRate: 0,
  numDieselCost: 0,
  numLubSupply: 0,
  numLubRate: 0,
  numLubCost: 0,
  numHydrolicSupply: 0,
  numHydrolicRate: 0,
  numHydrolicCost: 0,

  numTripCost: 7000,
  numPilotCoupon: 6500,
  numStoreExpense: 0,
  numTotalExpense: 0,
};

export default function TripForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getTripDataById({ id, setLoading, setSingleData, setRowData });
    }
  }, [id]);

  const saveHandler = (values, cb) => {
    // if (rowData?.length === 0) {
    //   return toast.warning("Please add at least one operation", {
    //     toastId: 1234,
    //   });
    // }

    if (!id) {
      const payload = {
        header: {
          lighterTripId: 0,
          vesselType: values?.vesselType?.label,
          tripNo: values?.tripNo,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          lighterVesselId: values?.lighterVessel?.value,
          lighterVesselName: values?.lighterVessel?.label,
          loadPortId: values?.loadPort?.value,
          loadPortName: values?.loadPort?.label,
          dischargePortId: values?.dischargePort?.value,
          dischargePortName: values?.dischargePort?.label,
          dteTripCommencedDate: values?.dteTripCommencedDate,
          dteTripCompletionDate: values?.dteTripCompletionDate,
          numTotalTripDuration: +values?.numTotalTripDuration,
          numTotalExpense: +calculateTotalExpense(values)?.result,
          isComplete: values?.isComplete,
          actionby: profileData?.userId,

          completeDate: values?.isComplete ? _todayDate() : undefined,
          receiveDate: values?.receiveDate || undefined,
          dischargeStartDate: values?.dischargeStartDate || undefined,
          dischargeComplDate: values?.dischargeComplDate || undefined,

          arrivalCtgDate: values?.arrivalAtCtg || undefined,
          departureCtgDate: values?.departureAtCtg || undefined,
          loadCommCtgDate: values?.loadingCommenceAtCtg || undefined,
          loadComplCtgDate: values?.loadingCompleteAtCtg || undefined,
        },
        rows: rowData || [],
        exp: {
          tripExpenseId: 0,
          lighterTripId: 0,
          numDieselRate: +values?.numDieselRate,
          numDieselSupply: +values?.numDieselSupply,
          numDieselCost: +values?.numDieselCost,
          numLubRate: +values?.numLubRate,
          numLubSupply: +values?.numLubSupply,
          numLubCost: +values?.numLubCost,
          numHydrolicRate: +values?.numHydrolicRate,
          numHydrolicSupply: +values?.numHydrolicSupply,
          numHydrolicCost: +values?.numHydrolicCost,
          numTripCost: +values?.numTripCost,
          numPilotCoupon: +values?.numPilotCoupon,
          numTotalExpense: +calculateTotalExpense(values)?.result,
          numStoreExpense: +values?.numStoreExpense || 0,
        },
      };
      createTrip(payload, setLoading, cb);
    } else {
      const payload = {
        header: {
          lighterTripId: +id || 0,
          tripNo: +values?.tripNo || 0,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          lighterVesselId: values?.lighterVessel?.value,
          lighterVesselName: values?.lighterVessel?.label,
          loadPortId: values?.loadPort?.value,
          loadPortName: values?.loadPort?.label,
          dischargePortId: values?.dischargePort?.value,
          dischargePortName: values?.dischargePort?.label,
          dteTripCommencedDate: values?.dteTripCommencedDate,
          dteTripCompletionDate: values?.dteTripCompletionDate,
          numTotalTripDuration: +values?.numTotalTripDuration,
          numTotalExpense: +calculateTotalExpense(values)?.result,
          isComplete: values?.isComplete,
          actionby: profileData?.userId,

          completeDate: values?.isComplete ? _todayDate() : undefined,
          receiveDate: values?.receiveDate || undefined,
          dischargeStartDate: values?.dischargeStartDate || undefined,
          dischargeComplDate: values?.dischargeComplDate || undefined,

          arrivalCtgDate: values?.arrivalAtCtg || undefined,
          departureCtgDate: values?.departureAtCtg || undefined,
          loadCommCtgDate: values?.loadingCommenceAtCtg || undefined,
          loadComplCtgDate: values?.loadingCompleteAtCtg || undefined,
        },
        rows: rowData || [],
        exp: {
          tripExpenseId: +values?.tripExpenseId,
          lighterTripId: +id,
          numDieselRate: +values?.numDieselRate,
          numDieselSupply: +values?.numDieselSupply,
          numDieselCost: +values?.numDieselCost,
          numLubRate: +values?.numLubRate,
          numLubSupply: +values?.numLubSupply,
          numLubCost: +values?.numLubCost,
          numHydrolicRate: +values?.numHydrolicRate,
          numHydrolicSupply: +values?.numHydrolicSupply,
          numHydrolicCost: +values?.numHydrolicCost,
          numTripCost: +values?.numTripCost,
          numPilotCoupon: +values?.numPilotCoupon,
          numTotalExpense: +calculateTotalExpense(values)?.result,
          numStoreExpense: +values?.numStoreExpense || 0,
        },
      };

      editTrip(payload, setLoading);
    }
  };

  const title =
    type === "view"
      ? "View Lighter Vessel Trip"
      : type === "edit"
      ? "Edit Lighter Vessel Trip"
      : "Create Lighter Vessel Trip";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        loading={loading}
        setLoading={setLoading}
        rowData={rowData}
        setRowData={setRowData}
      />
    </>
  );
}
