/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { getSingleDataById } from "../helper";
import Loading from "../../../../_helper/_loading";
import ICustomCard from "../../../../_helper/_customCard";
import { useLocation } from "react-router";

const initData = {
  year: "",
  employmentType: "",
  days: "",
};

export default function ViewYearlyLeavePolicyForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});
  const location = useLocation();

  useEffect(() => {
    if (id) {
      getSingleDataById(
        id,
        location?.state?.intYearId,
        location?.state?.intBusinessUnitId,
        setRowDto
      );
    }
  }, [id, location]);

  return (
    <ICustomCard
      title={"View Yearly Leave Policy"}
      backHandler={() => {
        history.goBack();
      }}
      renderProps={() => {}}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form {...objProps} initData={initData} rowDto={rowDto} />
    </ICustomCard>
  );
}
