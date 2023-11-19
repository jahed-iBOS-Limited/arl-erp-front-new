import axios from "axios";

export const getInstrumentDDL = async (setter) => {
  try {
    const res = await axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    res.data.push(
      { label: "Salary Advice", value: 12 },
      { label: "Bonus Advice", value: 13 },
      { label: "Manning Advice", value: 14 },
      { label: "Zakat Advice", value: 15 },
      { label: "Sales Incentive", value: 20 }
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};
