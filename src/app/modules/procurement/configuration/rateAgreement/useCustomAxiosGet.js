import axios from "axios";
import { useState } from "react";

const useCustomAxiosGet = () => {
  const [res, setRes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = (url, payload,cb, errorCB) => {
    setLoading(true);
    axios
      .get(url,{
        params:payload
      })
      .then((res) => {
        setRes(res?.data);
        setLoading(false);
        cb && cb(res?.data);
      })
      .catch((err) => {
        setRes([]);
        setError(err);
        setLoading(false);
        errorCB && errorCB(err);
      });
  };

  return [res, getData, loading, setRes, error];
};

export default useCustomAxiosGet;
