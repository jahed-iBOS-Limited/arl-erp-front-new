import React, { useEffect, useState } from "react";
import { TableRow } from "./tableRow";
import { shallowEqual } from "react-redux";
import { useSelector } from "react-redux";
import { getTaxPayerInfo } from "../helper";
import NotPermittedPage from "../../../_helper/notPermitted/NotPermittedPage";

export function TrunOverTaxLanding() {
  const [data, setData] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTaxPayerInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setData
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return data?.bin ? <TableRow /> : <NotPermittedPage />;
}
