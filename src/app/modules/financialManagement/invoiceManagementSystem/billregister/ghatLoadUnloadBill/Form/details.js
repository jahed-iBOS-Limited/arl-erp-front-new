import { Formik } from "formik";
import React from "react";
import ICard from "../../../../../_helper/_card";
import ICustomTable from "../../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import Loading from "../../../../../_helper/_loading";

const Details = ({ obj }) => {
  const { singleItem: si } = obj;

  const rows = [
    {
      description: "Damp",
      rate: si?.dumpDeliveryRate,
      qty: si?.dumpQnt,
      amount: si?.dumpDeliveryRate * si?.dumpQnt,
    },
    {
      description: "Direct",
      rate: si?.directRate,
      qty: si?.directQnt,
      amount: si?.directRate * si?.directQnt,
    },
    {
      description: "Bolgate to Dam",
      rate: si?.bolgateToDamRate,
      qty: si?.bolgateToDumpQnt,
      amount: si?.bolgateToDamRate * si?.bolgateToDumpQnt,
    },
    {
      description: "Dam to Truck",
      rate: si?.damToTruckRate,
      qty: si?.dumpToTruckQnt,
      amount: si?.damToTruckRate * si?.dumpToTruckQnt,
    },
    {
      description: "Lighter to Bolgate",
      rate: si?.lighterToBolgateRate,
      qty: si?.lighterToBolgateQnt,
      amount: si?.lighterToBolgateRate * si?.lighterToBolgateQnt,
    },
    {
      description: "Truck to Dam",
      rate: si?.truckToDamRate,
      qty: si?.truckToDamQnt,
      amount: si?.truckToDamRate * si?.truckToDamQnt,
    },
    {
      description: "Truck To Dam Outside",
      rate: si?.truckToDumpOutsideRate,
      qty: si?.truckToDumpOutsideQnt,
      amount: si?.truckToDumpOutsideRate * si?.truckToDumpOutsideQnt,
    },
    { description: "BIWTA", rate: "", qty: "", amount: si?.biwtaAmount },
    {
      description: "Ship Sweeping",
      rate: "",
      qty: "",
      amount: si?.shipSweepingRate,
    },
    { description: "Scale", rate: "", qty: "", amount: si?.scaleRate },
    {
      description: "Daily Labor",
      rate: "",
      qty: "",
      amount: si?.dailyLaboureRate,
    },
    { description: "Others", rate: "", qty: "", amount: si?.othersCostRate },
  ];

  const headers = ["SL", "Description", "Rate", "Quantity", "Amount"];

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => {}}>
        {() => (
          <>
            {false && <Loading />}
            <ICard title={`Bill Details - Unloaded Qty: ${si?.unLoadQuantity}`}>
              <ICustomTable ths={headers}>
                {rows.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item?.description}</td>
                      <td className="text-right">{item?.rate}</td>
                      <td className="text-right">{item?.qty}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.amount, true)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="text-right" colSpan={4}>
                    <b>Total</b>
                  </td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        rows?.reduce((a, b) => (a += b?.amount), 0),
                        true
                      )}
                    </b>
                  </td>
                </tr>
              </ICustomTable>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default Details;
