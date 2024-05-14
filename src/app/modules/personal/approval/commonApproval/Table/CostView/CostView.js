import React, { useEffect, useState } from "react";
import { getBomTotalCost } from "../../helper";
import ICustomCard from "./../../../../../_helper/_customCard";
import Loading from "./../../../../../_helper/_loading";

export default function CostViewTable({ item }) {
  const [bomTotalCost, setBomTotalCost] = useState("");
  const [isDisabled, setIsDisabled] = useState("");
  console.log(bomTotalCost);
  console.log(item, "item");

  let accountId = item?.accountId;
  let businessUnitId = item?.businessUnitId;
  // let shopFloorId = item?.shopFloorId;
  let itemId = item?.itemId;
  let bomId = item?.billOfMaterialId;

  // useEffect(() => {
  //   CostForBOMLanding(
  //     accountId,
  //     businessUnitId,
  //     shopFloorId,
  //     itemId,
  //     1,
  //     setIsDisabled,
  //     setBomTotalCost
  //   );
  // }, [accountId, businessUnitId, shopFloorId, itemId]);
  useEffect(() => {
    getBomTotalCost(
      businessUnitId,
      itemId,
      bomId,
      setIsDisabled,
      setBomTotalCost
    );
  }, [accountId, businessUnitId, itemId, bomId]);
  return (
    <ICustomCard title={"View of BOM Info"} isDisabled={isDisabled}>
      {isDisabled && <Loading />}
     <div className="table-responsive">
     <table className="table table-striped table-bordered global-table">
        {/* {loading && <Loading />} */}
        <thead>
          <th>SL</th>
          <th>BOM Name</th>
          <th>UoM Name</th>
          <th>Lot Size</th>
          <th>BOM Total Cost</th>
        </thead>
        <tbody>
          <tr>
            <td>{item?.sl}</td>
            <td>{item?.itemName}</td>
            <td>{item?.uoMName}</td>
            <td className="text-center">{item?.lotSize}</td>
            <td className="text-center">
              {parseFloat(bomTotalCost[0]?.column1).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
     </div>
    </ICustomCard>
  );
}
