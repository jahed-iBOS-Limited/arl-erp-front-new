import React from 'react';
import { useHistory } from "react-router-dom";
import { ShipPointOperatorCreateForm } from './shipPointOperatorCreate/AddEditForm';
import ShippingPointAndTerritoryCreateForm from './shippingPointAndTerritoryCreate/form';


const ShipPointCreateForm = () => {
    const history = useHistory();
    const pageType = history.location?.state?.value;

    if(pageType === 1) return  <ShipPointOperatorCreateForm />
    else if(pageType === 2) return <ShippingPointAndTerritoryCreateForm />
    else return null;
  
}

export default ShipPointCreateForm