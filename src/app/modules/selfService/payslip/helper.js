import axios from "axios";
import { toast } from "react-toastify";

export const getPaySlip_api = async (empId, date, setter, setLoading) => {
  setLoading(true);
  try {
    const url = `/hcm/PdfReport/PaySlipAPI?EmployeeId=${empId}&Date=${date}`;

    const res = await axios.get(url);
    if (res?.data?.length < 1) toast.warn("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter("");
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getPDFAction = async (url, setLoading) => {
  try {
    setLoading(true);
    await axios
      .get(url, {
        responseType: "blob",
      })
      .then((response) => {
        setLoading(false);
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        const pdfWindow = window.open();
        pdfWindow.location.href = fileURL;
      })
      .catch((error) => {
        setLoading(false);
        toast.warn(error?.response?.data?.message || "Failed, try again");
      });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
