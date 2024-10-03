export const commonBunkerInputFieldsCalculatorFunc = ({
  values,
  setValues,
  key,
}) => {
  // =================input field==============//
  const numBallastDistance = +values.numBallastDistance || 0;
  const numBallastSpeed = +values.numBallastSpeed || 0;
  const numBallastVlsfoConsumptionMt =
    +values.numBallastVlsfoConsumptionMt || 0;
  const numBallastLsmgoConsumptionMt =
    +values.numBallastLsmgoConsumptionMt || 0;
  const numLadenDistance = +values.numLadenDistance || 0;
  const numLadenSpeed = +values.numLadenSpeed || 0;
  const numLadenVlsfoConsumptionMt = +values.numLadenVlsfoConsumptionMt || 0;
  const numLadenLsmgoConsumptionMt = +values.numLadenLsmgoConsumptionMt || 0;
  const numCargoQty = +values.numCargoQty || 0;
  const intLoadRate = +values.intLoadRate || 0;
  const intDischargeRate = +values.intDischargeRate || 0;
  const numPortStayVlsfoPerDay = +values.numPortStayVlsfoPerDay || 0;
  const numPortStayLsmgoPerDay = +values.numPortStayLsmgoPerDay || 0;
  const numToleranceVlsfoPercentage = +values.numToleranceVlsfoPercentage || 0;

  // =================calculate field==============//
  const numBallastPassageVlsfoConsumptionMtCal =
    (numBallastDistance / numBallastSpeed / 24) * numBallastVlsfoConsumptionMt;

  const numBallastPassageLsmgoConsumptionMtCal =
    (numBallastDistance / numBallastSpeed / 24) * numBallastLsmgoConsumptionMt;

  const numLadenPassageVlsfoConsumptionMtCal =
    (numLadenDistance / numLadenSpeed / 24) * numLadenVlsfoConsumptionMt;

  const numLadenPassageLsmgoConsumptionMtCal =
    (numLadenDistance / numLadenSpeed / 24) * numLadenLsmgoConsumptionMt;

  const numLoadPortStayCal = numCargoQty / intLoadRate;

  const numDischargePortStayCal = numCargoQty / intDischargeRate;

  const numLoadPortStayVlsfoConsumptionMtCal =
    numLoadPortStayCal * numPortStayVlsfoPerDay;

  const numLoadPortStayLsmgoConsumptionMtCal =
    numLoadPortStayCal * numPortStayLsmgoPerDay;

  const numDischargePortStayVlsfoConsumptionMtCal =
    numDischargePortStayCal * numPortStayVlsfoPerDay;

  const numDischargePortStayLsmgoConsumptionMtCal =
    numDischargePortStayCal * numPortStayLsmgoPerDay;

  const numTotalVlsfoConsumptionMtCal =
    numBallastPassageVlsfoConsumptionMtCal +
    numLadenPassageVlsfoConsumptionMtCal +
    numLoadPortStayVlsfoConsumptionMtCal +
    numDischargePortStayVlsfoConsumptionMtCal;

  const numTotalLsmgoConsumptionMtCal =
    numBallastPassageLsmgoConsumptionMtCal +
    numLadenPassageLsmgoConsumptionMtCal +
    numLoadPortStayLsmgoConsumptionMtCal +
    numDischargePortStayLsmgoConsumptionMtCal;

  const numNetTotalConsumableVlsfoMtCal =
    (numTotalVlsfoConsumptionMtCal * numToleranceVlsfoPercentage) / 100 +
    numTotalVlsfoConsumptionMtCal;
  const numNetTotalConsumableLsmgoMtCal =
    (numTotalLsmgoConsumptionMtCal * numToleranceVlsfoPercentage) / 100 +
    numTotalLsmgoConsumptionMtCal;
  const valuesCopy = {
    ...values,
    numBallastPassageVlsfoConsumptionMt: Number(
      numBallastPassageVlsfoConsumptionMtCal.toFixed(4)
    ),
    numBallastPassageLsmgoConsumptionMt: Number(
      numBallastPassageLsmgoConsumptionMtCal.toFixed(4)
    ),
    numLadenPassageVlsfoConsumptionMt: Number(
      numLadenPassageVlsfoConsumptionMtCal.toFixed(4)
    ),
    numLadenPassageLsmgoConsumptionMt: Number(
      numLadenPassageLsmgoConsumptionMtCal.toFixed(4)
    ),
    numLoadPortStay: Number(numLoadPortStayCal.toFixed(4)),
    numDischargePortStay: Number(numDischargePortStayCal.toFixed(4)),
    numLoadPortStayVlsfoConsumptionMt: Number(
      numLoadPortStayVlsfoConsumptionMtCal.toFixed(4)
    ),
    numLoadPortStayLsmgoConsumptionMt: Number(
      numLoadPortStayLsmgoConsumptionMtCal.toFixed(4)
    ),
    numDischargePortStayVlsfoConsumptionMt: Number(
      numDischargePortStayVlsfoConsumptionMtCal.toFixed(4)
    ),
    numDischargePortStayLsmgoConsumptionMt: Number(
      numDischargePortStayLsmgoConsumptionMtCal.toFixed(4)
    ),
    numTotalVlsfoConsumptionMt: Number(
      numTotalVlsfoConsumptionMtCal.toFixed(4)
    ),
    numTotalLsmgoConsumptionMt: Number(
      numTotalLsmgoConsumptionMtCal.toFixed(4)
    ),
    numNetTotalConsumableVlsfoMt: Number(
      numNetTotalConsumableVlsfoMtCal.toFixed(4)
    ),
    numNetTotalConsumableLsmgoMt: Number(
      numNetTotalConsumableLsmgoMtCal.toFixed(4)
    ),
    // [key]: values[key]
  };
  setValues(valuesCopy);
};
