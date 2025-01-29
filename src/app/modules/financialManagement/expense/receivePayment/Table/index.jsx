import React, { useEffect, useState } from "react";
import HeaderForm from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { employeEnroll_Api } from "../helper";
export default function RecivePaymentLanding() {
  const [employeeDDL, SetEmployeeDDL] = useState([]);
  const [referanceNo, SetReferanceNo] = useState([]);
  const [girdData, setGirdData] = useState([]);
  const [loading, setLoading] = useState(false);


  let cashJournal = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit } = cashJournal;

  useEffect(() => {
    employeEnroll_Api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      SetEmployeeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeaderForm
        rowDto={girdData}
        employeeDDL={employeeDDL}
        SetReferanceNo={SetReferanceNo}
        referanceNo={referanceNo}
        setGirdData={setGirdData}
        girdData={girdData}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}
