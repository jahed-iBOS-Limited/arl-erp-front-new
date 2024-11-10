import axios from "axios";
import { toast } from "react-toastify";
// import {APIUrl} from '../../'


export const DownloadFile = async (url, fileName, setLoading) => {
  
  try {
    setLoading(true);

    axios({
      url: url,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/docx" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.docx`);
      document.body.appendChild(link);
      link.click();
    });

    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
