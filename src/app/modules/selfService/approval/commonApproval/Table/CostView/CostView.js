import React, { useState, useEffect } from "react";
import { CostForBOMLanding } from "../../helper";
import ICustomCard from "./../../../../../_helper/_customCard";
import Loading from "./../../../../../_helper/_loading";

export default function CostViewTable({ item }) {
  const [bomTotalCost, setBomTotalCost] = useState("");
  const [isDisabled, setIsDisabled] = useState("");
  console.log(bomTotalCost);

  let accountId = item?.accountId;
  let businessUnitId = item?.businessUnitId;
  let shopFloorId = item?.shopFloorId;
  let itemId = item?.itemId;

  useEffect(() => {
    CostForBOMLanding(
      accountId,
      businessUnitId,
      shopFloorId,
      itemId,
      1,
      setIsDisabled,
      setBomTotalCost
    );
  }, [accountId, businessUnitId, shopFloorId, itemId]);
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
                {parseFloat(bomTotalCost).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ICustomCard>
  );
}
