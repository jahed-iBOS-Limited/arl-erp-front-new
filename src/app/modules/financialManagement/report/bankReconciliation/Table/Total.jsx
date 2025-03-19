import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const Total = ({ running,total }) => {
  // const [total, setTotal] = useState(0);
  // const [runningBalance, setRunningBalance] = useState(0);

  // useEffect(() => {
  //   let dataOnetotal = report?.typeOne?.reduce(
  //     (acc, item) => acc + +item?.numAmount,
  //     0
  //   );
  //   let dataTwototal = report?.typeTwo?.reduce(
  //     (acc, item) => acc + +item?.numAmount,
  //     0
  //   );
  //   let dataThreetotal = report?.typeThree?.reduce(
  //     (acc, item) => acc + +item?.numAmount,
  //     0
  //   );
  //   let dataFourtotal = report?.typeFour?.reduce(
  //     (acc, item) => acc + +item?.numAmount,
  //     0
  //   );
    // let dataFivetotal = report?.typeBalanceOfBankBook?.reduce(
    //   (acc, item) => acc + +item?.numAmount,
    //   0
    // );
    // let dataSixtotal = report?.typeSix?.reduce(
    //   (acc, item) => acc + +item?.numAmount,
    //   0
    // );

    // if (type === 1) {
    //   setRunningBalance(dataOnetotal);
    //   setTotal(dataOnetotal);
    //   setAggregateClosing(dataOnetotal);
    // }
    // if (type === 2) {
    //   let twoBL = dataOnetotal + dataTwototal;
    //   setRunningBalance(twoBL);
    //   setAggregateClosing(twoBL);
    //   setTotal(dataTwototal);
    // }
    // if (type === 3) {
    //   let threeBL = dataOnetotal + dataTwototal + dataThreetotal;
    //   setRunningBalance(threeBL);
    //   setAggregateClosing(threeBL);
    //   setTotal(dataThreetotal);
    // }
    // if (type === 4) {
    //   let fourBL = dataOnetotal + dataTwototal + dataThreetotal + dataFourtotal;
    //   setRunningBalance(fourBL);
    //   setAggregateClosing(fourBL);
    //   setTotal(dataFourtotal);
    // }
    // if (type === 5) {
    //   setRunningBalance(
    //     dataOnetotal +
    //       dataTwototal +
    //       dataThreetotal +
    //       dataFourtotal +
    //       dataFivetotal
    //   );
    //   setTotal(dataFivetotal);
    // }
    // if (type === 6) {
    //   setRunningBalance(
    //     dataOnetotal +
    //       dataTwototal +
    //       dataThreetotal +
    //       dataFourtotal +
    //       dataFivetotal +
    //       dataSixtotal
    //   );
    //   setTotal(dataSixtotal);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data, type, report]);

  return (
    <>
      <tr>
        <td className="text-right" colSpan="5">
          <span
            style={{ fontSize: "15px", fontWeight: "bold", color: "#36d633" }}
          >
            Group Total
          </span>
        </td>
        <td className="text-right">
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            {numberWithCommas((total || 0).toFixed(2))}
          </span>
        </td>
      </tr>
      <tr>
        <td className="text-right" colSpan="5">
          <span style={{ fontSize: "15px", fontWeight: "bold", color: "blue" }}>
            Running Balance
          </span>
        </td>
        <td className="text-right">
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            {numberWithCommas((running || 0).toFixed(2))}
          </span>
        </td>
      </tr>
    </>
  );
};

export default Total;
