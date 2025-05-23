import React from 'react';
import { UserStatusCssClasses, UserStatusTitles } from '../../UserUIHelpers';

export const StatusColumnFormatter = (cellContent, row) => (
  <span
    className={`label label-lg label-light-${
      UserStatusCssClasses[row.status]
    } label-inline`}
  >
    {UserStatusTitles[row.status]}
  </span>
);
