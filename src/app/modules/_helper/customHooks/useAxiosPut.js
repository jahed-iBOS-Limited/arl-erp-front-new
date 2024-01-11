import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const useAxiosPut = () => {
  const [res, setRes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const putData = (
    url,
    payload,
    cb,
    isToast,
    successMessage,
    errorMessage,
  ) => {
    setLoading && setLoading(true);
    axios
      .put(url, payload)
      .then((res) => {
        setRes(res?.data);
        cb && cb(res?.data);
        setLoading(false);
        if (isToast) {
          toast.success(
            res?.data?.message || successMessage ||  res?.data?.[0]?.message || "Submitted Successfully"
          );
        }
      })
      .catch((err) => {
        setRes([]);
        setError(err);
        setLoading(false);
        if (isToast) {
          toast.warn(
            err?.response?.data?.message || errorMessage || err?.response?.data?.[0]?.message || "Failed, try again"
          );
        }
      });
  };

  return [res, putData, loading, setRes, error];
};

export default useAxiosPut;