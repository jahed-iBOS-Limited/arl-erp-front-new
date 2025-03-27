
import React, { useEffect, useState } from "react";
import "./rgl.css";
import { getReportAction } from "./_redux/Actions";
import { updateIsShownAction } from "../PerformanceChart/_redux/Actions";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Card from "./card";
import { getUnFavDepSbuDDLAction } from "../../_redux/Actions";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ShowcaseLayout = ({ values }) => {
  const dispatch = useDispatch();
  const [_props, setProps] = useState({
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 12, sm: 12, xs: 6, xxs: 6 },
    initialLayout: [],
  });
  const [state, setState] = useState({
    currentBreakpoint: "lg",
    compactType: "horizontal",
    mounted: false,
    layouts: { lg: [] },
  });

  // Redux store data
  const reports = useSelector((state) => state.kipDeshboardTwo?.reportData, {
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

  const callGetReportAction = () => {
    dispatch(
      getReportAction(
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values.year?.value,
        values.from?.value,
        values.to?.value,
        true,
        3
      )
    );
    dispatch(
      getUnFavDepSbuDDLAction(
        selectedBusinessUnit?.value,
        3,
        values?.year?.value
      )
    );
  };
  const updateIsShown = (kpiId, tf) => {
    dispatch(updateIsShownAction(kpiId, tf, callGetReportAction));
  };

  function generateDOM() {
    return _.map(state.layouts.lg, function(itm, i) {
      return (
        <div key={i} className={itm.static ? "static" : ""}>
          <div className="mt-4 kpi_item_wrapper pointer">
            <div className="row m-0 kpiDashboard">
              <Card itm={itm.item} updateIsShown={updateIsShown} />
            </div>
          </div>
        </div>
      );
    });
  }

  function onLayoutChange(layout, layouts) {
    _props.onLayoutChange(layout, layouts);
  }

  function generateLayout(arr) {
    return _.map(arr, function(item, i) {
      var y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 3) % 12,
        y: Math.floor(i / 6) * y,
        w: 3,
        h: 5,
        i: i.toString(),
        item,
      };
    });
  }
  useEffect(() => {
    const initialLayout = generateLayout(reports);
    setState({
      ...state,
      layouts: { lg: initialLayout },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  return (
    <div className="mt-3">
      <ResponsiveReactGridLayout {..._props} layouts={state.layouts}>
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default ShowcaseLayout;
