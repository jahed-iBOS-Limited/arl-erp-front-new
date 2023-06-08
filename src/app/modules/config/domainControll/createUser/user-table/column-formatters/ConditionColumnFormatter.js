import React from "react";
import {
   
  UserConditionTitles,
  UserConditionCssClasses
} from "../../UserUIHelpers";

export const ConditionColumnFormatter = (cellContent, row) => (
  <>
    <span
      className={`badge badge-${
        UserConditionCssClasses[row.condition]
      } badge-dot`}
    ></span>
    &nbsp;
    <span
      className={`font-bold font-${
        UserConditionCssClasses[row.condition]
      }`}
    >
      {UserConditionTitles[row.condition]}
    </span>
  </>
);
