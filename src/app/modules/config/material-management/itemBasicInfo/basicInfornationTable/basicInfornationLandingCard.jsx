import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls';
import { BasicInfornationTable } from './basicInfornationTableCard';

export function BasicInfornationLandingCard() {
  return (
    <Card>
      <CardHeader title="Item Basic Info">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <BasicInfornationTable />
      </CardBody>
    </Card>
  );
}
