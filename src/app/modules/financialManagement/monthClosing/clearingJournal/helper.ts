import { _todayDate } from '../../../_helper/_todayDate';

// type ddl
export const typeDDL = [{ value: 1, label: 'Unallocated Profit Center' }];

// landing init data
export const clearingJournalLandingData = {
  type: typeDDL[0],
  businessUnit: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
