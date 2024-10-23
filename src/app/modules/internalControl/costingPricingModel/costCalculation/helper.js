export const tblMaterialCostHeaders = [
  "SL",
  "Material Name",
  "UOM",
  {
    title: "Conv.",
    style: { width: "115px" },
  },
  {
    title: "Percentige",
    style: { width: "115px" },
  },
  {
    title: "Yield %",
    style: { width: "115px" },
  },
  "Required Qty",
  {
    title: "Current Qty",
    style: { maxWidth: "50px" },
  },
  "Current Inv Price",
  {
    title: "New Qty",
    style: { width: "115px" },
  },
  {
    title: "New Price",
    style: { width: "115px" },
  },
  "Current Cost",
  {
    title: "New Cost",
    style: { maxWidth: "50px" },
  },
  {
    title: "Avg. Cost",
    style: { maxWidth: "50px" },
  },
];
export const tblCostComponentHeaders = [
  {
    title: "SL",
    style: { width: "30px" },
  },
  "Cost Name",
  {
    title: "",
    style: { width: "150px" },
  },
];

export const rowCalculationFunc = ({
  item,
  productPreCostingData,
  index,
  setProductPreCostingData,
}) =>
  // productPreCostingData,
  // setProductPreCostingData
  {
    //let rowData = [...productPreCostingData?.precostingMaterial];

    let _sl = { ...item };

    const percentigeInput = +item?.percentigeInput || 0;
    const yieldNum = +item?.yield || 0;
    const currentInvQty = +item?.currentInvQty || 0;
    const currentInvRate = +item?.currentInvRate || 0;

    // required Qty cal
    const requiredQty = isFinite(percentigeInput / yieldNum)
      ? percentigeInput / yieldNum
      : 0;
    _sl.requiredQty = requiredQty || 0;

    // current cost cal
    const currentCost = currentInvRate * percentigeInput;
    _sl.currentCost = currentCost || 0;

    // new cost cal
    const newQty = +item?.newQty || 0;
    const newPrice = +item?.newPrice || 0;
    const newCost = (percentigeInput / yieldNum) * newPrice;
    _sl.newCost = newCost || 0;

    // average cost cal
    const averageCost =
      ((currentInvQty * currentCost + newQty * newCost) /
        (currentInvQty + newQty)) *
      requiredQty;

    _sl.averageCost = averageCost || 0;

    const priviousData = [...productPreCostingData?.precostingMaterial];
    priviousData[index] = _sl;
    setProductPreCostingData({
      ...productPreCostingData,
      precostingMaterial: priviousData,
    });

    // if (name === "percentigeInput") {
    //   const requiredQty = _sl?.percentigeInput / _sl?.yield;
    //   _sl.requiredQty = requiredQty || 0;
    //   const currentCost = _sl?.currentInvQty * _sl?.percentigeInput;
    //   _sl.currentCost = currentCost || 0;
    // } else if (name === "yield") {
    //   const requiredQty = _sl?.percentigeInput / _sl?.yield;
    //   _sl.requiredQty = requiredQty;
    // } else if (name === "newQty") {
    //   const averageCost =
    //     ((_sl?.currentInvQty * _sl?.currentCost + _sl?.newQty * _sl?.newCost) /
    //       (_sl?.currentInvQty + _sl?.newQty)) *
    //     _sl?.requiredQty;
    //   _sl.averageCost = averageCost || 0;
    // } else if (name === "newPrice") {
    //   const newCost = (_sl?.percentigeInput / _sl?.yield) * _sl?.newPrice;
    //   _sl.newCost = newCost || 0;
    //   const averageCost =
    //     ((_sl?.currentInvQty * _sl?.currentCost + _sl?.newQty * _sl?.newCost) /
    //       (_sl?.currentInvQty + _sl?.newQty)) *
    //     _sl?.requiredQty;
    //   _sl.averageCost = averageCost || 0;
    // }

    // setProductPreCostingData({
    //   ...productPreCostingData,
    //   precostingMaterial: rowData,
    // });
  };
