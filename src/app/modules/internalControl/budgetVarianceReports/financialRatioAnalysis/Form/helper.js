import axios from "axios";

// export const getFinancialRatioApi = async ({
//   fromDate,
//   toDate,
//   buId,
//   typeId,
//   setter,
//   setLoading,
// }) => {
//   setLoading(true);
//   try {
//     const res = await axios.get(
//       `/fino/CostSheet/GetFinancialRatio?BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&Type=${typeId}`
//     );
//     const resTwo = await axios.get(
//       `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&Type=2`
//     );

//     const resThree = await axios.get(
//       `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&Type=1`
//     );

//     const modifyData = res?.data?.map((item) => ({
//       ...item,
//       budgetRatio: (() => {
//         const matchingBudget = resTwo?.data?.find(
//           (budget) => budget.strRarioName === item.strRarioName
//         );
//         return matchingBudget?.numRatio || 0;
//       })(),
//       budgetAmount: (() => {
//         const matchingBudget = resThree?.data?.find(
//           (budget) => budget.strComName === item.strComName
//         );
//         return matchingBudget?.numAmount || 0;
//       })(),
//     }));

//     setter(modifyData);
//     setLoading(false);
//   } catch (error) {
//     setLoading(false);
//     setter([]);
//   }
// };

export const getFinancialRatioApi = async ({
  fromDate,
  toDate,
  buId,
  forecastType = 0,
  typeId,
  setter,
  setLoading,
}) => {
  const makeApiRequest = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data || [];
    } catch (error) {
      return [];
    }
  };

  setLoading(true);
  try {
    const [res, resTwo, resThree] = await Promise.all([
      makeApiRequest(
        `/fino/CostSheet/GetFinancialRatio?BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&Type=${typeId}&isForecast=${forecastType}`
      ),
      makeApiRequest(
        `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&Type=2&isForecast=${forecastType}`
      ),
      makeApiRequest(
        `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&Type=1&isForecast=${forecastType}`
      ),
    ]);

    const modifyData = res.map((item) => {
      const matchingBudget = resTwo.find(
        (budget) => budget.strRarioName === item.strRarioName
      );
      const budgetRatio = matchingBudget ? matchingBudget.numRatio : 0;

      const matchingBudgetAmount = resThree.find(
        (budget) => budget.strComName === item.strComName
      );
      const budgetAmount = matchingBudgetAmount
        ? matchingBudgetAmount.numAmount
        : 0;

      return {
        ...item,
        budgetRatio,
        budgetAmount,
      };
    });

    setter(modifyData);
  } catch (error) {
    setter([]);
  } finally {
    setLoading(false);
  }
};
