import axios from 'axios';

export const getCashRegisterReport = async ({
  fromDate,
  toDate,
  buId,
  setter,
}) => {
  try {
    const res = await axios.get(
      `/fino/Account/GetCashRegisterGroupLevel?fromDate=${fromDate}&toDate=${toDate}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
