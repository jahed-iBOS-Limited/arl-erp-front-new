// import axios from "axios";

// export const getDistributionChannelDDL = async (accId, buId, sbuId, setter) => {
//   try {
//     let res = await axios.get(
//       `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
//     );
//     setter(res?.data);
//   } catch (err) {
//     setter([]);
//   }
// };


export const pickupHandler = ({item}) => {
  console.log("Pickup Handler");
}

export const cancelHandler = ({item}) => {}