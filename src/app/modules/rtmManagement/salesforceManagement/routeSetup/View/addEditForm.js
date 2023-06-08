import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { GetRoutePlanById } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";

export default function RouteSetupViewForm({
  history,
  match: {
    params: { employeeId, tourId },
  },
}) {
  const params = useParams();

  const [, setSingleData] = useState([]);
  const [monthlyRowDto, setMonthlyRowDto] = useState([]);
  const [, setWeeklyRowDto] = useState([]);

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

  const backHandler = () => {
    history.goBack();
  };

  return (
    <ICustomCard title="View Market Visit Program" backHandler={backHandler}>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th style={{ width: "30px" }}>SL</th>
            <th>Date</th>
            <th>Day Name</th>
            <th>Category</th>
            <th>Tour Location</th>
          </tr>
        </thead>
        <tbody>
          {monthlyRowDto?.map((td, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>
                <div className="pl-2">{_dateFormatter(td?.dteTourDate)}</div>
              </td>
              <td>
                <div className="pl-2">{td?.strDayName}</div>
              </td>
              <td>
                <div className="px-2 routesetupDDL">{td?.strCategory}</div>
              </td>
              <td>
                <div className="px-2 routesetupDDL">{td?.territoryName}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ICustomCard>
  );
}
