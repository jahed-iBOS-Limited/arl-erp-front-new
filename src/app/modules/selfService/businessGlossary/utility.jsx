import axios from "axios";

export const fetchEmpBasicInfo = async (search, setter, setLoading) => {
  try {
    setLoading(true);
    let res = await axios.get(
      `/domain/BusinessUnitDomain/GetBusinessGlossary?search=${search}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(true);
  }
};
