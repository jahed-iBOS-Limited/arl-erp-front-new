import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import TextArea from "../../../../_helper/TextArea";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const RevenueVariance = ({ obj }) => {
  const { setShow, item } = obj;
  // get selected business unit from store
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [, postData, loader] = useAxiosPost();

  const collectionDetailsEntry = (values) => {
    const payload = [
      {
        sl: 0,
        id: 0,
        businessUnitId: buId,
        territoryId: item?.intTerritoryId,
        territoryName: item?.nl7 || "",
        channelId: 0,
        channelName: item?.nl5 || "",
        employeeId: 0,
        employeeName: item?.strEmployeeName || "",
        levelId: 0,
        typeId: 0,
        dayId: 0,
        weekId: 0,
        monthId: 0,
        monthName: "string",
        yearId: 0,
        revenueTarget: item?.monTotalRevenueTarget,
        revenueAchievement: item?.monCollectionAmount,
        achievementPercentage: item?.monAchv,
        reason: values?.reason,
        stepForAchievement: "string",
        firstWeekTarget: item?.decFirstWeekTarget,
        firstWeekRevenue: item?.decFirstWeekRevenue,
        secondWeekTarget: item?.decSecondWeekTarget,
        secondWeekRevenue: item?.decSecondWeekRevenue,
        thirdWeekTarget: item?.decThirdWeekTarget,
        thirdWeekRevenue: item?.decThirdWeekRevenue,
        fourthWeekTarget: item?.decFourthWeekTarget,
        fourthWeekRevenue: item?.decFourthWeekRevenue,
      },
    ];
    postData(
      `/oms/Complains/TargetAndCollectionDetailsEntry`,
      payload,
      () => {
        setShow(false);
      },
      true
    );
  };

  return (
    <>
      {loader && <Loading />}
      <Formik enableReinitialize={true} initialValues={{ reason: "" }}>
        {({ values }) => (
          <>
            <div>
              <div className="text-right">
                <button
                  className={"btn btn-info mt-1"}
                  onClick={() => {
                    collectionDetailsEntry(values);
                  }}
                  type="button"
                  disabled={!values?.reason}
                >
                  Submit
                </button>
              </div>
              <div className="table-responsive">
                <table className="table mt-3 bj-table bj-table-landing">
                  <thead
                    style={{
                      borderTop: "1px solid rgb(207, 203, 203)",
                    }}
                  >
                    <tr>
                      <th colSpan={2}>First Week</th>
                      <th colSpan={2}>Second Week</th>
                      <th colSpan={2}>Third Week</th>
                      <th colSpan={2}>Fourth Week</th>
                    </tr>
                    <tr>
                      <th>Target</th>
                      <th>Revenue</th>
                      <th>Target</th>
                      <th>Revenue</th>
                      <th>Target</th>
                      <th>Revenue</th>
                      <th>Target</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        {_fixedPoint(item?.decFirstWeekTarget, true)}
                      </td>
                      <td className="text-center">
                        {_fixedPoint(item?.decFirstWeekRevenue, true)}
                      </td>
                      <td className="text-center">
                        {_fixedPoint(item?.decSecondWeekTarget, true)}
                      </td>
                      <td className="text-center">
                        {_fixedPoint(item?.decSecondWeekRevenue, true)}
                      </td>
                      <td className="text-center">
                        {_fixedPoint(item?.decThirdWeekTarget, true)}
                      </td>
                      <td className="text-center">
                        {_fixedPoint(item?.decThirdWeekRevenue, true)}
                      </td>
                      <td className="text-center">
                        {_fixedPoint(item?.decFourthWeekTarget, true)}
                      </td>
                      <td className="text-center">
                        {_fixedPoint(item?.decFourthWeekRevenue, true)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="global-form">
                <label>Reason</label>
                <TextArea
                  name="reason"
                  value={values?.reason}
                  placeholder="Reason"
                  rows="4"
                />
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default RevenueVariance;
