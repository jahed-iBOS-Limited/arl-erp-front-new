/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import moment from "moment";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams, useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  GetRoutePlanById,
  saveEditedRoutePlanMonthlyApproveAction,
  saveRoutePlanWeekWiseAction,
  saveRoutePlanMonthlyWiseAction,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  routeDate: _todayDate(),
  employeeName: "",
  routeCategory: "",
  routeLocation: "",
};

export default function RouteSetupApproveForm({
  history,
  match: {
    params: { employeeId, tourId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const params = useParams();
  const location = useLocation();

  const [singleData, setSingleData] = useState([]);
  const [monthlyRowDto, setMonthlyRowDto] = useState([]);
  const [weeklyRowDto, setWeeklyRowDto] = useState([]);
  const [isRoutePlanWeekwise, setIsRoutePlanWeekwise] = useState(true);
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get value addition view data
  useEffect(() => {
    if (params?.employeeId && params?.tourId) {
      GetRoutePlanById(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.employeeId,
        params?.tourId,
        setSingleData,
        setMonthlyRowDto,
        setWeeklyRowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  //  all day
  const endDay = Number(
    moment(location?.state?.tourDate)
      .endOf("month")
      .format("D")
  );

  const mm = moment(location?.state?.tourDate).format("M");
  const yy = moment(location?.state?.tourDate).format("YYYY");

  let AllDaysInMonth = [];
  for (let i = 1; i <= endDay; i++) {
    let dayWeekName = moment(`${yy}/${mm}/${i}`).format("dddd");
    AllDaysInMonth.push({
      sl: i,
      dteTourDate: `${yy}/${mm}/${i}`,
      strDayName: `${dayWeekName}`,
      routeCategory: {
        value: 1,
        label: "Market Visit",
      },
      routeLocation: territoryNameDDL[0],
    });
  }

  useEffect(() => {
    setMonthlyRowDto(AllDaysInMonth);
  }, []);

  useEffect(() => {
    setWeeklyRowDto([
      {
        strDayName: "Saturday",
        routeCategory: {
          value: 1,
          label: "Market Visit",
        },
        routeLocation: territoryNameDDL[0],
      },
      {
        strDayName: "Sunday",
        routeCategory: {
          value: 1,
          label: "Market Visit",
        },
        routeLocation: territoryNameDDL[0],
      },
      {
        strDayName: "Monday",
        routeCategory: {
          value: 1,
          label: "Market Visit",
        },
        routeLocation: territoryNameDDL[0],
      },
      {
        strDayName: "Tuesday",
        routeCategory: {
          value: 1,
          label: "Market Visit",
        },
        routeLocation: territoryNameDDL[0],
      },
      {
        strDayName: "Wednesday",
        routeCategory: {
          value: 1,
          label: "Market Visit",
        },
        routeLocation: territoryNameDDL[0],
      },
      {
        strDayName: "Thursday",
        routeCategory: {
          value: 1,
          label: "Market Visit",
        },
        routeLocation: territoryNameDDL[0],
      },
      {
        strDayName: "Friday",
        routeCategory: {
          value: 1,
          label: "Market Visit",
        },
        routeLocation: territoryNameDDL[0],
      },
    ]);
  }, [territoryNameDDL]);

  const setWeeklyCategoryHandler = (sl, value, name) => {
    const cloneArr = [...weeklyRowDto];
    cloneArr[sl][name] = value;
    setWeeklyRowDto([...cloneArr]);
  };

  const setMonthlyCategoryHandler = (sl, value, name) => {
    const cloneArr = [...monthlyRowDto];
    cloneArr[sl][name] = value;
    setMonthlyRowDto([...cloneArr]);
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.employeeId && params?.tourId) {
        const editMonthlyObj = monthlyRowDto?.map((itm, idx) => {
          return {
            tourId: itm?.intTourId,
            attendanceLocationId: itm?.routeLocation?.value,
            attendanceLocationName: itm?.routeLocation?.label,
          };
        });
        const payload = {
          objHeader: {
            tourId: params?.tourId,
            isApprove: true,
            intApproveBy: 0,
          },
          objRow: editMonthlyObj,
        };

        saveEditedRoutePlanMonthlyApproveAction(payload, setDisabled);
      } else {
        if (isRoutePlanWeekwise === true) {
          const weeklyObj = weeklyRowDto?.map((itm, idx) => {
            return {
              intTourId: 0,
              intEmployeeId: values?.employeeName?.value,
              strCategory: itm?.routeCategory?.label,
              dteTourDate: values?.routeDate,
              day: itm?.dayName,
              intTerritoryId: itm?.routeLocation?.value,
              strTerritoryName: itm?.routeLocation?.label,
              dteAttendanceTime: "2021-01-12T06:31:45.948Z",
              intAttendanceLocationId: 0,
              strAttendanceLocationName: "string",
            };
          });
          const payload = {
            objCreateHeader: {
              intAccountId: profileData?.accountId,
              intBusinessUnitId: selectedBusinessUnit?.value,
              intEmployeeId: values?.employeeName?.value,
              intTerritoryId: 0,
              intDistributionChallanId: 0,
              intApproveBy: 0,
              dteCurrentDate: _todayDate(),
              dteTourMonth: values?.routeDate,
              intActionBy: profileData?.userId,
            },
            objCreateRowList: weeklyObj,
          };
          saveRoutePlanWeekWiseAction(payload, cb, setDisabled);
        } else {
          const monthlyObj = monthlyRowDto?.map((itm, idx) => {
            return {
              intTourId: 0,
              intEmployeeId: values?.employeeName?.value,
              strCategory: itm?.routeCategory?.label,
              dteTourDate: itm?.dteTourDate,
              strDayName: itm?.strDayName,
              intTerritoryId: itm?.routeLocation?.value,
              strTerritoryName: itm?.routeLocation?.label,
              dteAttendanceTime: _todayDate(),
              intAttendanceLocationId: 0,
              strAttendanceLocationName: "string",
            };
          });
          const payload = {
            objCreateHeader: {
              intAccountId: profileData?.accountId,
              intBusinessUnitId: selectedBusinessUnit?.value,
              intEmployeeId: values?.employeeName?.value,
              intTerritoryId: 0,
              intDistributionChallanId: 0,
              intApproveBy: 0,
              dteTourMonth: values?.routeDate,
              dteCurrentDate: _todayDate(),
              intActionBy: profileData?.userId,
            },
            objCreateRow: monthlyObj,
          };
          saveRoutePlanMonthlyWiseAction(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <IForm
      title={tourId ? "Approve Market Visit Program" : ""}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        location={location?.state}
        setIsRoutePlanWeekwise={setIsRoutePlanWeekwise}
        weeklyRowDto={weeklyRowDto}
        setWeeklyCategoryHandler={setWeeklyCategoryHandler}
        monthlyRowDto={monthlyRowDto}
        setMonthlyCategoryHandler={setMonthlyCategoryHandler}
        tourId={tourId}
        isEdit={tourId || false}
        setTerritoryNameDDL={setTerritoryNameDDL}
        territoryNameDDL={territoryNameDDL}
      />
    </IForm>
  );
}
