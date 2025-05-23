import axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';

// Validation schema
export const validationSchema = Yup.object().shape({
  portName: Yup.string().required('Port name is required'),
  portCountry: Yup.object().shape({
    label: Yup.string().required('Port Country is required'),
    value: Yup.string().required('Port Country is required'),
  }),
});

export const getPortLandingData = async (
  pageNo,
  pageSize,
  portName,
  countryName,
  setLoading,
  setter
) => {
  setLoading(true);
  const country = countryName ? `&searchByCountry=${countryName}` : '';
  const port = portName ? `&searchByPortName=${portName}` : '';
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Port/GetPortLandingPagination?viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${port}${country}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const createPort = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/Port/CreatePort`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const updatePort = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(`${imarineBaseUrl}/domain/Port/EditPort`, data);
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const deletePort = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.delete(
      `${imarineBaseUrl}/domain/Port/DeletePort?porteId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const activeInactivePort = async (id, status, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Port/ActiveOrInActive?porteId=${id}&activeOrInActive=${status}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
