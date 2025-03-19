import Axios from 'axios';
import * as Yup from 'yup';


export const getBankDDL_api = async (setter) => {
  try {
    const res = await Axios.get('/hcm/HCMDDL/GetBankDDL');
    setter(res.data);
  } catch (error) { }
};
export const getBankBranchDDL_api = async (bankId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBankBranchDDL?BankId=${bankId}`,
    );
    setter(res.data);
  } catch (error) { }
};

export const GetLighterStevedoreDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterStevedoreDDL`,
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};



export const validationSchema = Yup.object().shape({
  motherVessel: Yup.object().shape({
    label: Yup.string().required('Mother Vessel is required'),
    value: Yup.string().required('Mother Vessel is required'),
  }),
  item: Yup.object().shape({
    label: Yup.string().required('Item is required'),
    value: Yup.string().required('Item is required'),
  }),
  lotNo: Yup.string().required('Lot No is required'),
  cnf: Yup.object().shape({
    label: Yup.string().required('CNF is required'),
    value: Yup.string().required('CNF is required'),
  }),
  steveDore: Yup.object().shape({
    label: Yup.string().required('Steve dore is required'),
    value: Yup.string().required('Steve dore is required'),
  }),
});
