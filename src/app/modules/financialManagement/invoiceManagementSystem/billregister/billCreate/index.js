import React from "react";
import { useLocation } from "react-router-dom";
import RenewalBillForm from "../RenewalBill/table";
import CNFBill from "../cnfBill/Form/addEditForm";
import { CommercialPayment } from "../commercialPayment/form/addEditForm";
import DamDeliveryBill from "../damDelivery/Form/addEditForm";
import FairPriceShopForm from "../fairPriceInvoice/Form/addEditForm";
import FuelBillForm from "../fuelBill/Form/addEditForm";
import G2GGodownUnloadBill from "../g2gGodownUnloadBill/Form/addEditForm";
import G2GLighterBill from "../g2gLighterBill/Form/addEditForm";
import G2GTruckBill from "../g2gTruckBill/Form/addEditForm";
import GhatLoadUnloadBill from "../ghatLoadUnloadBill/Form/addEditForm";
import HatchLaborBill from "../hatchLaborBill/Form/addEditForm";
import MotherVesselBill from "../motherVesselBill/Form/addEditForm";
import OthersBillCreateForm from "../othersBillNew/Form/addEditForm";
import PumpFoodingBillForm from "../pumpFoodingBill/Form/addEditForm";
import SalesCommissionForm from "../salesCommission/form/addEditFrom";
import StevedoreBill from "../stevedoreBill/Form/addEditForm";
import SurveyorBill from "../surveyorBill/Form/addEditForm";
import TransportBillForm from "../transportBill/Form/addEditForm";
import InternalTransportBillForm from "./../internalTransportBill/Form/addEditForm";
import LabourBillForm from "./../labourBill/Form/addEditForm";
import SupplerInvoiceForm from "./../supplerInvoice/Form/addEditForm";
import SupplierAdvance from "./../supplierAdvance/supplierAdvance";
import HeaderForm from "./Table/form";
import CustomerRefundCreateEditForm from "../customerRefund/addEditForm";
import TruckToDampDeliveryBill from "../truckToDampDelivery/Form/addEditForm";

function BillregisterCreate() {
  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;
  console.log({ billType });
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
      ) : billType === 17 ? (
        <G2GLighterBill />
      ) : billType === 18 ? (
        <PumpFoodingBillForm />
      ) : billType === 19 ? (
        <MotherVesselBill />
      ) : billType === 21 ? (
        <G2GGodownUnloadBill />
      ) : billType === 22 ? (
        <GhatLoadUnloadBill />
      ) : billType === 25 ? (
        <CNFBill />
      ) : billType === 26 ? (
        <StevedoreBill />
      ) : billType === 27 ? (
        <SurveyorBill />
      ) : billType === 28 ? (
        <HatchLaborBill />
      ) : billType === 31 ? (
        <TruckToDampDeliveryBill />
      ) : billType === 32 ? (
        <DamDeliveryBill />
      ) : billType === 33 ? (
        <CustomerRefundCreateEditForm />
      ) : (
        <HeaderForm />
      )}
    </>
  );
}

export default BillregisterCreate;
