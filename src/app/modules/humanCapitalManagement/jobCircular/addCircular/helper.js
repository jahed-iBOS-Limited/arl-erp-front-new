import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";


export const saveAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Attachment Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};


export const addAndEditJobCircular = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/hcm/JobRequisition/CreateOrEditJobRequisition`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// get loanApplication by id
export const getCircularById = async (
  circularId,
  setter,
  setLoading
) => {
  setLoading(true)
  try {
    const res = await Axios.get(
      `/hcm/JobRequisition/GetJobRequisitionById?RequisitionId=${circularId}`
    );
    if (res.status === 200 && res?.data) {
      const circularData = res?.data[0]
      let newData = {
        ...circularData,
        title: circularData?.strDesignation || "",
        description:circularData?.strRequisitionSummery || "",
        deadline : _dateFormatter(circularData?.dteJobValidto) 
      };
      setter(newData);
      setLoading(false)
    }
  } catch (error) {
    setLoading(false)
  }
};