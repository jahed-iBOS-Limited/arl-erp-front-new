import axios from "axios";
import { imarineBaseUrl } from "../../App";

export const getVoyageDDLNew = async ({
    accId,
    buId,
    id,
    setLoading,
    setter,
    voyageTypeId, // 0: All, 1: Time Charter, 2: Voyage Charter,
    isComplete, // 0: All, 1: true, 2: false,
    hireType, // 0: All, 1: Owner, 2: Charterer,
}) => {
    setLoading && setLoading(true);
    try {
        const res = await axios.get(
            `${imarineBaseUrl}/domain/PortPDA/GetVoyageDDLNew?AccountId=${accId}&BusinessUnitId=${buId}&vesselId=${id}&VoyageTypeId=${voyageTypeId ||
            0}&ReturnType=${isComplete || 0}&HireTypeId=${hireType || 0}`
        );
        setter(res?.data);
        setLoading && setLoading(false);
    } catch (error) {
        setter([]);
        setLoading && setLoading(false);
    }
};

export const getVesselDDL = async (accId, buId, setter, vesselId) => {
    const vesselIdStr = vesselId ? `&IsVessel=${vesselId}` : ""; // first perameter so not (?)
    try {
        const res = await axios.get(
            `${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}${vesselIdStr}`
        );
        setter(res.data);
    } catch (error) {
        setter([]);
    }
};