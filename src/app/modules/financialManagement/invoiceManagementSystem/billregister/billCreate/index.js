import React from "react";
import HeaderForm from "./Table/form";
import { useLocation } from "react-router-dom";
import SupplerInvoiceForm from "./../supplerInvoice/Form/addEditForm";
import SupplierAdvance from "./../supplierAdvance/supplierAdvance";
import { CommercialPayment } from "../commercialPayment/form/addEditForm";
import TransportBillForm from "../transportBill/Form/addEditForm";
import SalesCommissionForm from "../salesCommission/form/addEditFrom";
import FuelBillForm from "../fuelBill/Form/addEditForm";
import LabourBillForm from "./../labourBill/Form/addEditForm";
import FairPriceShopForm from "../fairPriceInvoice/Form/addEditForm";
import InternalTransportBillForm from "./../internalTransportBill/Form/addEditForm";
import OthersBillCreateForm from "../othersBillNew/Form/addEditForm";
import RenewalBillForm from "../RenewalBill/table";
import G2GCarrierBill from "../g2gCarrierBill/Form/addEditForm";
import PumpFoodingBillForm from "../pumpFoodingBill/Form/addEditForm";
import MotherVesselBill from "../motherVesselBill/Form/addEditForm";
import GhatLoadUnloadBill from "../ghatLoadUnloadBill/Form/addEditForm";
import StevedoreBill from "../stevedoreBill/Form/addEditForm";
import SurveyorBill from "../surveyorBill/Form/addEditForm";
import CNFBill from "../cnfBill/Form/addEditForm";
import G2GTruckBill from "../g2gTruckBill/Form/addEditForm";

function BillregisterCreate() {
  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;
  console.log("billType", billType);
  return (
    <>
      {billType === 1 ? (
        <SupplerInvoiceForm />
      ) : billType === 2 ? (
        <SupplierAdvance />
      ) : billType === 5 ? (
        <CommercialPayment />
      ) : billType === 6 ? (
        <TransportBillForm />
      ) : billType === 7 ? (
        <SalesCommissionForm />
      ) : billType === 8 ? (
        <FuelBillForm />
      ) : billType === 9 || billType === 10 ? (
        <LabourBillForm />
      ) : billType === 11 ? (
        <FairPriceShopForm />
      ) : billType === 13 ? (
        <InternalTransportBillForm />
      ) : billType === 12 ? (
        <OthersBillCreateForm />
      ) : billType === 14 ? (
        <RenewalBillForm headerData={headerData} />
      ) : billType === 16 ? (
        <G2GTruckBill />
      ) : // <G2GCustomizeBill />
      billType === 17 ? (
        <G2GCarrierBill />
      ) : billType === 18 ? (
        <PumpFoodingBillForm />
      ) : billType === 19 ? (
        <MotherVesselBill />
      ) : billType === 22 ? (
        <GhatLoadUnloadBill />
      ) : billType === 25 ? (
        <CNFBill />
      ) : billType === 26 ? (
        <StevedoreBill />
      ) : billType === 27 ? (
        <SurveyorBill />
      ) : (
        <HeaderForm />
      )}
    </>
  );
}

export default BillregisterCreate;
