import React, { useEffect, useState } from "react";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import {
   updateIsShownAction,
  
} from "../PerformanceChart/_redux/Actions";
import Card from "./card";
import { getUnFavouriteDDLAction } from "./_redux/Actions";
import { getReportAction } from "../../_redux/Actions";
export default function GrouphChart({ values, yearDDL }) {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  // Redux store data
  const reports = useSelector((state) => state.performanceChart?.reportData, {
    shallowEqual,
  });

  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  let { profileData, selectedBusinessUnit } = storeData;

  //charts onChange Heandelar
  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const nextState = swap(items, sourceIndex, targetIndex);
    setItems(nextState);
  }

  const callGetReportAction = () => {
    dispatch(
      getReportAction(
        selectedBusinessUnit?.value,
        profileData.userId,
        values.year?.value,
        values.from?.value,
        values.to?.value,
        true,
        1
      )
    );
    dispatch(
      getUnFavouriteDDLAction(
        selectedBusinessUnit?.value,
        profileData.userId,
        values.year?.value
      )
    );
  };

  const updateIsShown = (kpiId, tf) => {
    dispatch(updateIsShownAction(kpiId, tf, callGetReportAction));
  };

  // swap state with redux store
  useEffect(() => {
    setItems(reports);
  }, [reports]);

  return (
    <>
      {reports.length > 0 && (
        <div className="dnd-wrapper iscroll">
          <GridContextProvider onChange={onChange}>
            <GridDropZone
              boxesPerRow={4}
              rowHeight={250}
              style={{ height: "100%" }}
            >
              {items.length > 0 &&
                items.map((itm, idx) => (
                  <GridItem key={itm.kpiId}>
                    <div className="mt-4 kpi_item_wrapper pointer">
                      <div className="row m-0 kpiDashboard">
                        <Card itm={itm} updateIsShown={updateIsShown} />
                      </div>
                    </div>
                  </GridItem>
                ))}
            </GridDropZone>
          </GridContextProvider>
        </div>
      )}
    </>
  );
}
