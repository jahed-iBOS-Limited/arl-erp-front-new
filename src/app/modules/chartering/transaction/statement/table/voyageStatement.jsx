import React from "react";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";
export default function VoyageCharterStatement({
  printRef,
  voyageCharterData,
  additionalCostList,
}) {
  const {
    objRow: {
      bunkerCost,
      deadFreight,
      // dispatchRate,
      // guardCost,
      // otherCost,
      otherEaring,
      // otherPda,
      pdaDishPort,
      pdaLoadPort,
      // pniAndSurveyCost,
      totalAddComm,
      totalBrockComm,
      // totalDemurrage,
      totalFreight,
    } = {},
    // objTimeDesc,
    // objTimeCHeader,
  } = voyageCharterData;

  // const totalAdditionalCost =

  const totalExpense =
    bunkerCost +
    additionalCostList?.reduce((acc, curr) => {
      if (curr?.costId !== 18) {
        acc += curr?.costAmount;
      }
      return acc;
    }, 0);

  const totalDemurrage = voyageCharterData?.objheader?.reduce(
    (a, b) => a + Number(b?.demurrageCost),
    0
  );

  const totalDispatch = voyageCharterData?.objheader?.reduce(
    (a, b) => a + Number(b?.dispatchCost),
    0
  );

  // const totalAddCommission = TotalFreight +  * addComm;

  const totalGrossHire = totalFreight + totalBrockComm;

  const headerData = voyageCharterData?.objheader?.length
    ? voyageCharterData?.objheader[0]
    : {};

  const subtotalEarnings =
    totalFreight +
    deadFreight +
    // headerData?.demurrageCost +
    // headerData?.dispatchCost +
    totalAddComm +
    totalBrockComm +
    totalDemurrage -
    totalDispatch;

  // const totalIncome =
  //   deadFreight +
  //   // headerData?.dispatch +
  //   // headerData?.demurrage +
  //   totalAddComm +
  //   totalBrockComm +
  //   totalDemurrage +
  //   totalFreight +
  //   totalDemurrage -
  //   totalDispatch;

  const totalEarnings =
    totalFreight +
    deadFreight +
    totalAddComm +
    totalBrockComm +
    totalDemurrage -
    totalDispatch;

  const bunkerCostPerDay = bunkerCost / Number(headerData?.voyageDuration);
  const PDAPerDay = (pdaLoadPort + pdaDishPort) / headerData?.voyageDuration;
  const grossHirePerDay = totalGrossHire / Number(headerData?.voyageDuration);
  const netEarnings = totalEarnings - totalExpense;

  return (
    <>
      <div className="px-5" ref={printRef} id="pdf-section">
        <div className="text-center mt-2">
          <h4 className="font-weight-bold mb-0">AKIJ SHIPPING LINE LTD.</h4>
          <h6 className="font-weight-bold mb-0">ESTIMATED HIRE STATEMENT</h6>
        </div>
        <div className="text-center"></div>
       <div className="table-responsive">
       <table className="w-100" id="table-to-xlsx">
          <div className="voyageStatement">
            <ICustomTable ths={[]}>
              <tr className="text-center">
                <td colSpan={6}>
                  <h6 className="mb-0">
                    VESSEL NAME & VOYAGE NO:{" "}
                    <b>
                      {headerData?.vesselName + " & V" + headerData?.voyageName}
                    </b>
                  </h6>
                </td>
              </tr>
              <tr
                style={{
                  backgroundColor: "#C8C6C6",
                }}
              >
                <td colSpan={6}>
                  <h6 className="font-weight-bold pb-1 mb-0 text-center">
                    Net Hire/Day:{" "}
                    {_formatMoney(netEarnings / headerData?.voyageDuration)} USD
                  </h6>
                </td>
              </tr>
              <tr>
                <td className="text-left">Load Port</td>
                <td colSpan={2}> {headerData?.loadPort} </td>
                <td style={{ width: "20%" }}>Add Comm</td>
                <td colSpan={2} style={{ width: "10%" }}>
                  {" "}
                  {headerData?.addComm}%{" "}
                </td>
              </tr>
              <tr>
                <td className="text-left">Discharge Port</td>
                <td colSpan={2}> {headerData?.dischargePort} </td>
                <td>Brokerage</td>
                <td colSpan={2}> {headerData?.brokarage}% </td>
              </tr>
              <tr>
                <td className="text-left">Voyage Commence Date (GMT)</td>
                <td colSpan={2}> {headerData?.voyageCommenced} </td>
                <td></td>
                <td colSpan={2}> {} </td>
              </tr>
              <tr>
                <td className="text-left">Voyage Completion Date (GMT)</td>
                <td colSpan={2}> {headerData?.voyageCompletion} </td>
                <td></td>
                <td colSpan={2}> {} </td>
              </tr>
              <tr>
                <td className="text-left">Voyage Duration (Days)</td>
                <td colSpan={2}> {headerData?.voyageDuration} </td>
                <td></td>
                <td colSpan={2}> {} </td>
              </tr>
            </ICustomTable>
          </div>

          <ICustomTable ths={[]}>
            {voyageCharterData?.objheader?.length > 0 &&
              voyageCharterData?.objheader?.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td colSpan={8} className="text-center font-weight-bold">
                        {`Charterer Name: ${item?.chartererName}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">CP Date</td>
                      <td colSpan={2}> {_dateFormatter(item?.cpDate)} </td>
                      <td>Demurrage Rate</td>
                      <td
                        className="text-right"
                        style={{
                          width: "20%",
                        }}
                      >
                        {" "}
                        {_formatMoney(item?.demurrage)}{" "}
                      </td>
                      {/* <td> {item?.demurrage} </td> */}
                      <td
                        style={{
                          width: "10%",
                        }}
                      >
                        USD/Day
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">Broker</td>
                      <td colSpan={2}> {item?.broker} </td>
                      <td>Demurrage Cost</td>
                      <td className="text-right">
                        {" "}
                        {_formatMoney(item?.demurrageCost)}{" "}
                      </td>
                      {/* <td> {item?.dispatch} </td> */}
                      <td>USD</td>
                    </tr>
                    <tr className="text-left">
                      <td className="text-left">Cargo</td>
                      <td colSpan={2}> {item?.cargoName?.join(", ")} </td>
                      <td>Despatch Rate</td>
                      <td className="text-right">
                        {" "}
                        {_formatMoney(item?.dispatch)}{" "}
                      </td>
                      <td>USD/Day</td>
                    </tr>
                    <tr>
                      <td className="text-left">Cargo Qty</td>
                      <td colSpan={2}> {item?.cargoQty} </td>
                      <td>Despatch Cost</td>
                      <td className="text-right">
                        {" "}
                        {_formatMoney(item?.dispatchCost)}{" "}
                      </td>
                      <td>USD</td>
                    </tr>
                    <tr>
                      <td className="text-left">Freight/MT</td>
                      <td colSpan={2}> {item?.freightRate} </td>
                      <td>Dead Freight</td>
                      <td className="text-right">
                        {" "}
                        {_formatMoney(item?.detention)}{" "}
                      </td>{" "}
                      <td>USD</td>
                    </tr>
                    <tr>
                      <td colSpan={3}> </td>
                      <td>Detention</td>
                      <td className="text-right">
                        {" "}
                        {_formatMoney(item?.detention)}{" "}
                      </td>{" "}
                      <td>USD</td>
                    </tr>
                  </>
                );
              })}
          </ICustomTable>
          <ICustomTable ths={[]}>
            <tr>
              <td colSpan={8} className="text-center font-weight-bold">
                Expense
              </td>
            </tr>
            <tr>
              <td
                className="text-left"
                style={{
                  width: "70%",
                }}
              >
                Bunker Cost
              </td>
              <td
                className="text-right"
                style={{
                  width: "20%",
                }}
              >
                {_formatMoney(bunkerCost)}
              </td>
              <td>USD</td>
            </tr>
            {additionalCostList?.map((item, index) => {
              return (
                item?.costId !== 18 && (
                  <tr key={index}>
                    <td className="text-left">{item?.costName}</td>
                    <td className="text-right">{`-${_formatMoney(
                      item?.costAmount
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
              <td className="text-left">Sub Total Other Cost</td>
              <td className="text-right"></td>
              <td>USD</td>
            </tr>
            <tr className="font-weight-bold">
              <td className="text-left">Total Expense</td>
              <td className="text-right font-weight-bold">
                {_formatMoney(totalExpense)}
              </td>
              <td>USD</td>
            </tr>
          </ICustomTable>
          {/* <div className="row">
            <div className="col-lg-6"></div>
            <div className="col-lg-6"></div>
          </div> */}

          <ICustomTable ths={[]}>
            <tr>
              <td colSpan={8} className="text-center font-weight-bold">
                Earnings
              </td>
            </tr>
            <tr>
              <td
                className="text-left"
                style={{
                  width: "70%",
                }}
              >
                Total Freight
              </td>
              <td
                className="text-right"
                style={{
                  width: "20%",
                }}
              >
                {_formatMoney(totalFreight)}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left">Dead Freight</td>
              <td className="text-right">{_formatMoney(deadFreight)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left">Total Detention</td>
              <td className="text-right">-{_formatMoney(0)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left">Total Demurrage</td>
              <td className="text-right">
                {_formatMoney(
                  voyageCharterData?.objheader?.reduce(
                    (a, b) => a + Number(b?.demurrageCost),
                    0
                  )
                )}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left">Other Earnings</td>
              <td className="text-right">{_formatMoney(otherEaring)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left">Total Despatch</td>
              <td className="text-right">
                {"-"}
                {_formatMoney(
                  voyageCharterData?.objheader?.reduce(
                    (a, b) => a + Number(b?.dispatchCost),
                    0
                  )
                )}{" "}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left">Add Comm</td>
              <td className="text-right">{_formatMoney(totalAddComm)}</td>
              <td>USD</td>
            </tr>
            <tr>
              <td className="text-left">Broker Comm</td>
              <td className="text-right">{_formatMoney(totalBrockComm)}</td>
              <td>USD</td>
            </tr>
            {additionalCostList?.map((item) => {
              return (
                item?.costId === 18 && (
                  <tr>
                    <td className="text-left">{item?.costName}</td>
                    <td className="text-right">
                      {`-${_formatMoney(item?.costAmount)}`}
                    </td>
                    <td>USD</td>
                  </tr>
                )
              );
            })}
            <tr>
              <td className="text-left">Sub Total Other Income</td>
              <td className="text-right"> {_formatMoney(subtotalEarnings)} </td>
              <td>USD</td>
            </tr>
            <tr className="font-weight-bold">
              <td className="text-left">Total Earnings</td>
              <td className="text-right font-weight-bold">
                {" "}
                {_formatMoney(totalEarnings)}{" "}
              </td>
              <td>USD</td>
            </tr>
          </ICustomTable>

          <ICustomTable ths={[]}>
            <tr>
              <td colSpan={8} className="text-center font-weight-bold">
                Per Day
              </td>
            </tr>
            <tr>
              <td
                className="text-left"
                style={{
                  width: "70%",
                }}
                colSpan={4}
              >
                Total Gross Hire
              </td>
              <td
                className="text-right"
                style={{
                  width: "20%",
                }}
              >
                {" "}
                {_formatMoney(totalGrossHire)}
              </td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-left">
                Gross Hire/Day
              </td>
              <td className="text-right"> {_formatMoney(grossHirePerDay)} </td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-left">
                Other Earnings/Day
              </td>
              <td className="text-right"></td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-left">
                Bunker Cost/Day
              </td>
              <td className="text-right"> {_formatMoney(bunkerCostPerDay)} </td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-left">
                PDA/Day
              </td>
              <td className="text-right"> {_formatMoney(PDAPerDay)} </td>
              <td>USD</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-left">
                Other Cost/Day
              </td>
              <td className="text-right"></td>
              <td>USD</td>
            </tr>
            <tr className="font-weight-bold">
              <td colSpan={4} className="text-left">
                Net Earnings
              </td>
              <td className="text-right"> {_formatMoney(netEarnings)} </td>
              <td>USD</td>
            </tr>
            <tr className="font-weight-bold">
              <td colSpan={4} className="text-left">
                Net Hire/Day
              </td>
              <td className="text-right">
                {" "}
                {_formatMoney(netEarnings / headerData?.voyageDuration)}{" "}
              </td>
              <td>USD</td>
            </tr>
          </ICustomTable>
        </table>
       </div>
      </div>
    </>
  );
}
