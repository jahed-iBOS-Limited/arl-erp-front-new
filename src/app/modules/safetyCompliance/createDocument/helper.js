import axios from "axios";
import { _dateFormatter } from "../../_helper/_dateFormate";

// get data by id
export const GetDocNameDataById = async (id, setter, setLoading) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentNameById&intDocumentId=${id}`
    );

    const modifyData = {
      ...data?.[0],
      documentName: data?.[0]?.strDocumentName,
      unit: {
        value: data?.[0]?.intBusinessUnitId,
        label:
          data?.[0]?.intBusinessUnitId === 0
            ? "All"
            : data?.[0]?.strBusinessUnitName,
      },
      workplaceGroup: {
        value: data?.[0]?.intWorkplaceGroupId,
        label:
          data?.[0]?.intWorkplaceGroupId === 0
            ? "All"
            : data?.[0]?.strWorkplaceGroupName,
      },
      workplace: {
        value: data?.[0]?.intWorkplaceId,
        label:
          data?.[0]?.intWorkplaceId === 0 ? "All" : data?.[0]?.strWorkplaceName,
      },
      reminderDate: _dateFormatter(data?.[0]?.dteNotifyReminderDate),
      frequency: data?.[0]?.strFrequency,
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

// get doc file list by id
export const GetDocNameFileById = async (id, setter, setLoading) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentNameFileById&intDocumentId=${id}`
    );
    const modifyData = data?.map((item) => ({
      ...item,
      fileName: item?.strFileUrl,
      isCreate: false,
      isDelete: false,
    }));
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getBusinessUnitDDL_api = async (actionBy, accountId, setter) => {
  try {
    const res = await axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${actionBy}&ClientId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      const newdata = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newdata);
    }
  } catch (error) {
    
  }
};
