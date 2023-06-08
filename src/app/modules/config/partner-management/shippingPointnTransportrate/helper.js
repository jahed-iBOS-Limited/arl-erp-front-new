import axios from "axios";

export const getRegionAreaTerritory = async ({
    channelId,
    regionId,
    areaId,
    territoryId,
    setter,
    setLoading,
    value,
    label,
}) => {
    setLoading(true);
    const region = regionId ? `&regionId=${regionId}` : "";
    const area = areaId ? `&areaId=${areaId}` : "";
    const territory = territoryId ? `&TerritoryId=${territoryId}` : "";
    try {
        const res = await axios.get(
            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}${region}${area}${territory}`
        );
        setter(
            res?.data?.map((item) => ({
                ...item,
                value: item[value],
                label: item[label],
            }))
        );
        setLoading(false);
    } catch (error) {
        setter([]);
        setLoading(false);
    }
};