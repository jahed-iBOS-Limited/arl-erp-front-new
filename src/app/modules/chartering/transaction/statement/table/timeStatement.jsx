import moment from "moment";
import React from "react";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";

export default function TimeCharterStatement({
  printRef,
  timeCharterData,
  hireList,
  bunkerSellList,
  additionalCostList,
}) {
  const {
    objTimeCHeader: {
      actualDuration,
      addComm,
      apAndOthers, // AP
      othersAmount, // Others
      ballastDuration,
      brokerName,
      brokerageComm,
      cargoQty,
      chartererName,
      cpDate,
      cvDays,
      dailyHire,
      deliveryPlace,
      deliveryTime,
      dischargePort,
      ilohc,
      loadPort,
      lsfoCost,
      lsmgoCost,
      offHireDuration,
      reDeliveryPlace,
      reDeliveryTime,
      vesselName,
      voyageName,
      ballastCost,
    } = {},
    objTimeDesc: {
      bunkerCost,
      // hireBunkerSurveyCost,
      offHireOtherCost,
      offHireCostForDays,
      offHireBunkerCost,
    } = {},
  } = timeCharterData;

  const totalBunkerSellCost = bunkerSellList?.reduce(
    (acc, curr) => acc + curr?.numAmount,
    0
  );

  const totalAdditionalCost = additionalCostList?.reduce(
    (a, b) => a + b?.costAmount,
    0
  );
  const hireDueToOwners = actualDuration * dailyHire;
  const addressCommission = (hireDueToOwners / 100) * addComm;
  const brokerCommission = (hireDueToOwners / 100) * brokerageComm;
  const totalCVE = (cvDays / 12 / 365) * actualDuration;
  const totalAddComm = ((offHireDuration * dailyHire) / 100) * addComm;
  const totalBrokerageComm =
    ((offHireDuration * dailyHire) / 100) * brokerageComm;

  const totalGrossHire =
    hireDueToOwners +
    totalAddComm +
    totalBrokerageComm -
    (addressCommission + brokerCommission + offHireCostForDays);

  const totalNetIncome =
    hireDueToOwners +
    totalAddComm +
    totalBrokerageComm +
    ilohc +
    totalCVE +
    totalBunkerSellCost -
    (addressCommission +
      brokerCommission +
      offHireCostForDays +
      bunkerCost +
      offHireCostForDays +
      ballastCost +
      totalAdditionalCost);

  return (
    <>
      <div className="px-5" ref={printRef} id="pdf-section">
        <div className="text-center mt-2">
          <h4 className="font-weight-bold mb-0">AKIJ SHIPPING LINE LTD.</h4>
          <h6 className="font-weight-bold mb-0">ESTIMATED HIRE STATEMENT</h6>
        </div>

        <div className="voyageStatement">
          <ICustomTable id="table-to-xlsx" ths={[]}>
            <tr>
              <td className="text-center" colSpan={8}>
                <h6 className="mb-0">
                  {" "}
                  VESSEL NAME & VOYAGE NO:{" "}
                  <b>{vesselName + " & V" + voyageName}</b>
                </h6>
              </td>
            </tr>
            <tr
              style={{
                backgroundColor: "#C8C6C6",
              }}
            >
              <td colSpan={8}>
                <div>
                  <h6 className="font-weight-bold pt-1 pb-1 mb-0 text-center">
                    Income/Day: {_formatMoney(totalNetIncome / actualDuration)}{" "}
                    USD
                  </h6>
                </div>
              </td>
            </tr>
            <tr className="d-none">
              <td className="text-center" colSpan={8}>
                <h1 className="font-weight-bold" style={{ color: "#305496" }}>
                  AKIJ SHIPPING LINE LTD.
                </h1>
              </td>
            </tr>
            <tr className="d-none">
              <td className="text-center" colSpan={8}>
                <h3 className="font-weight-bold">ESTIMATED HIRE STATEMENT</h3>
              </td>
            </tr>

            {/* <tr
              className="text-center"
              style={{
                // backgroundColor: "#C8C6C6",
                textTransform: "uppercase",
              }}
            >
              <td colSpan={8}>
                <h6 className="mb-0">
                  Vessel Name & Voyage No:{" "}
                  <b>{`${vesselName} & V${voyageName}`}</b>
                </h6>
              </td>
            </tr> */}

            <tr>
              <td className="text-left" colSpan={2}>
                Charterer
              </td>
              <td colSpan={2}>{chartererName}</td>
              <td colSpan={2}>CP Date</td>
              <td colSpan={2}>{_dateFormatter(cpDate)}</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Broker
              </td>
              <td colSpan={2}>{brokerName}</td>
              <td colSpan={2}>Load Port</td>
              <td colSpan={2}>{loadPort}</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Delivery Place
              </td>
              <td colSpan={2}>{deliveryPlace}</td>
              <td colSpan={2}>Discharge Port</td>
              <td colSpan={2}>{dischargePort}</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Redelivery Place
              </td>
              <td colSpan={2}>{reDeliveryPlace}</td>
              <td colSpan={2}>Cargo & Qty</td>
              <td className="text-right" colSpan={2}>
                {cargoQty}
              </td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Delivery Time
              </td>
              <td>{moment(deliveryTime).format("DD-MMM-yyyy, HH:mm")}</td>
              <td>GMT</td>
              <td colSpan={2}>Daily Hire</td>
              <td className="text-right">{_formatMoney(dailyHire)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Redelivery Time
              </td>
              <td>{moment(reDeliveryTime).format("DD-MMM-yyyy, HH:mm")}</td>
              <td>GMT</td>
              <td colSpan={2}>ILOHC</td>
              <td className="text-right">{_formatMoney(ilohc)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Actual Duration
              </td>
              <td>{actualDuration}</td>
              <td>Days</td>
              <td colSpan={2}>C/V/E 30 Days</td>
              <td className="text-right">{_formatMoney(cvDays)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Off Hire Duration
              </td>
              <td>{offHireDuration}</td>
              <td>Days</td>
              <td colSpan={2}>AP</td>
              <td className="text-right">{_formatMoney(apAndOthers)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Ballast Duration
              </td>
              <td>{ballastDuration}</td>
              <td>Days</td>
              <td colSpan={2}>Others</td>
              <td className="text-right">{_formatMoney(othersAmount)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Address Commission
              </td>
              <td className="text-center" colSpan={2}>
                {addComm}%
              </td>
              <td colSpan={2}>LSMGO Cost/MT</td>
              <td className="text-right">{_formatMoney(lsmgoCost)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={2}>
                Brokerage Commission
              </td>
              <td className="text-center" colSpan={2}>
                {brokerageComm}%
              </td>
              <td colSpan={2}>LSFO Cost/MT</td>
              <td className="text-right">{_formatMoney(lsfoCost)}</td>
              <td>USD</td>
            </tr>

            <tr className="font-weight-bold text-center">
              <td colSpan={1}>SR.</td>
              <td colSpan={5}>Description</td>
              <td colSpan={2}>Income</td>
            </tr>

            <tr>
              <td colSpan={1} className="text-center">
                1
              </td>
              <td colSpan={3}>Hire Due To Owners</td>
              <td>{actualDuration}</td>
              <td>Days</td>
              <td className="text-right">{_formatMoney(hireDueToOwners)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={1} className="text-center">
                2
              </td>
              <td colSpan={3}>Add Commission</td>
              <td>{actualDuration}</td>
              <td>Days</td>
              <td className="text-right">{`-${_formatMoney(
                addressCommission
              )}`}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={1} className="text-center">
                3
              </td>
              <td colSpan={3}>Broker Commission</td>
              <td>{actualDuration}</td>
              <td>Days</td>
              <td className="text-right">{`-${_formatMoney(
                brokerCommission
              )}`}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={1} className="text-center">
                4
              </td>
              <td colSpan={3}>ILOHC</td>
              <td>{actualDuration}</td>
              <td>Days</td>
              <td className="text-right"> {_formatMoney(ilohc)} </td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={1} className="text-center">
                5
              </td>
              <td colSpan={3}>C/V/E</td>
              <td>{actualDuration}</td>
              <td>Days</td>
              <td className="text-right">{_formatMoney(totalCVE)}</td>
              <td>USD</td>
            </tr>
            {/* <tr>
            <td colSpan={1} className="text-center">
              6
            </td>
            <td colSpan={5}>AP & Others</td>
            
            <td className="text-right"></td>
            <td>USD</td>
          </tr> */}
            <tr>
              <td colSpan={1} className="text-center">
                6
              </td>
              <td colSpan={5}>On & Off Hire Bunker Survey Cost</td>
              {/* <td colSpan={2}>{actualDuration}</td> */}
              <td className="text-right">
                {" "}
                {`-${_formatMoney(
                  additionalCostList?.find((e) => e?.costId === 14)?.costAmount
                )}`}{" "}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-center">7</td>
              <td colSpan={5}>Bunker Cost (Purchase Cost)</td>
              {/* <td colSpan={2}>{actualDuration}</td> */}
              <td className="text-right"> {`-${_formatMoney(bunkerCost)}`} </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-center">8</td>
              <td colSpan={5}>Ballast Cost</td>
              <td className="text-right">{`-${_formatMoney(ballastCost)}`}</td>
              <td>USD</td>
            </tr>

            <tr>
              <td className="text-center align-middle" rowSpan={5}>
                9
              </td>
              <td className="text-center align-middle" rowSpan={5}>
                Off Hire
              </td>
              <td colSpan={4}>Cost For Days Off Hire</td>
              <td className="text-right">
                {" "}
                {`-${_formatMoney(offHireCostForDays)}`}{" "}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={4}>
                Bunker Cost
              </td>
              <td className="text-right">
                {" "}
                {`-${_formatMoney(offHireBunkerCost)}`}{" "}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={4}>
                Address Commission
              </td>
              <td className="text-right"> {_formatMoney(totalAddComm)} </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={4}>
                Broker Commission
              </td>
              <td className="text-right">
                {" "}
                {_formatMoney(totalBrokerageComm)}{" "}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={4}>
                Others
              </td>
              <td className="text-right">
                {" "}
                {`-${_formatMoney(offHireOtherCost)}`}{" "}
              </td>
              <td>USD</td>
            </tr>

            <tr>
              <td
                className="text-center align-middle"
                rowSpan={
                  additionalCostList?.length +
                    !additionalCostList?.filter((e) => e?.costId === 14)
                      .length ?? 1
                }
              >
                10
              </td>
              <td
                className="text-center align-middle"
                rowSpan={
                  additionalCostList?.length +
                    !additionalCostList?.filter((e) => e?.costId === 14)
                      .length ?? 1
                }
              >
                Expense
              </td>
            </tr>
            {additionalCostList?.map((item, index) => {
              return (
                item?.costId !== 14 && (
                  <tr key={index}>
                    <td colSpan={4}>{item?.costName}</td>
                    <td className="text-right">{`-${_formatMoney(
                      // item?.totalAmount
                      item?.costAmount
                    )}`}</td>
                    <td>USD</td>
                  </tr>
                )
              );
            })}
            <tr>
              <td
                className="text-center align-middle"
                rowSpan={hireList?.length + 1}
              >
                11
              </td>
              <td
                className="text-center align-middle"
                rowSpan={hireList?.length + 1}
              >
                Hire RCVD
              </td>
            </tr>
            {hireList?.map((item, index) => {
              return (
                <tr key={index}>
                  <td colSpan={2}>{item?.transactionName}</td>
                  <td>Date</td>
                  <td>{_dateFormatter(item?.dateTransaction) || ""}</td>
                  <td className="text-right">
                    {_formatMoney(item?.totalValue)}
                  </td>
                  <td>USD</td>
                </tr>
              );
            })}
            <tr>
              <td
                className="text-center align-middle"
                rowSpan={bunkerSellList?.length + 1}
              >
                12
              </td>
              <td
                className="text-center align-middle"
                rowSpan={bunkerSellList?.length + 1}
              >
                Bunker Sell Cost
              </td>
            </tr>
            {bunkerSellList?.map((item, index) => {
              return (
                <tr key={index}>
                  <td colSpan={4}>{item?.itemName}</td>
                  <td className="text-right">
                    {_formatMoney(item?.numAmount)}
                  </td>
                  <td>USD</td>
                </tr>
              );
            })}

            <tr style={{ height: "1px" }}></tr>
            {additionalCostList?.filter((e, i) => {
              return (
                e?.costId === 18 && (
                  <tr key={i}>
                    <td colSpan={6}>{e?.costName}</td>
                    <td className="text-right">{`-${_formatMoney(
                      e?.costAmount
                    )}`}</td>
                    <td
                      style={{
                        width: "10%",
                      }}
                    >
                      USD
                    </td>
                  </tr>
                )
              );
            })}
            <tr>
              <td className="text-left" colSpan={6}>
                Total Gross Hire
              </td>
              <td className="text-right"> {_formatMoney(totalGrossHire)} </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={6}>
                Gross Hire/Day
              </td>
              <td className="text-right">
                {" "}
                {_formatMoney(totalGrossHire / actualDuration)}{" "}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={6}>
                Other Income/Day
              </td>
              <td className="text-right"> </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={6}>
                Bunker Cost/Day
              </td>
              <td className="text-right"></td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={6}>
                PDA Cost/Day
              </td>
              <td className="text-right"> </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left" colSpan={6}>
                Other Cost/Day
              </td>
              <td className="text-right"> </td>
              <td>USD</td>
            </tr>
            <tr className="font-weight-bold">
              <td className="text-left" colSpan={6}>
                Total Net Income
              </td>
              <td className="text-right"> {_formatMoney(totalNetIncome)} </td>
              <td>USD</td>
            </tr>
            <tr className="font-weight-bold">
              <td className="text-left" colSpan={6}>
                Income/Day
              </td>
              <td className="text-right">
                {" "}
                {_formatMoney(totalNetIncome / actualDuration)}{" "}
              </td>
              <td>USD</td>
            </tr>
          </ICustomTable>
        </div>
      </div>
    </>
  );
}
