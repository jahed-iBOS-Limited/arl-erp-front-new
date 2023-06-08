import axios from "axios";
import { toast } from "react-toastify";

export const saveBulkJV = async (
  accId,
  userId,
  buId,
  values,
  attachment,
  cb,
  setLoading
) => {
  setLoading(true);
  let formData = new FormData();
  /*
   * @NB: Dont't try like this > attachment[0]?.file | Loop it.
   */
  attachment.forEach((file) => {
    formData.append("journalExcel", file?.file);
  });

  try {
    let res = await axios.post(
      `/fino/BulkUpload/CommissionJVFromExcl?AccountId=${accId}&BusinessUnitId=${buId}&BusinessTranactionId=${values?.buTransaction?.value}&BusinessTranactionName=${values?.buTransaction?.label}&Narration=${values?.narration || ""}&insertby=${userId}&intPartnerTypeId=${values?.partnerType?.value}`,
      formData,
      {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      }
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "bulkJV" });
      cb(res?.data?.message);
    }
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Attachment not upload", {
      toastId: "bulkJVERR",
    });
    setLoading(false);
  }
};

export const getBuTransactionDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    console.log(err);
  }
};
