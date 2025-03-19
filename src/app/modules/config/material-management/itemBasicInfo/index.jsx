import React from "react";
import { BasicInfornationLandingCard } from "./basicInfornationTable/basicInfornationLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export default function ItemBasicInfo({ history }) {
  const uIEvents = {};

  return (
    <>
      <UiProvider uIEvents={uIEvents}>
        <BasicInfornationLandingCard />
      </UiProvider>
    </>
  );
}
