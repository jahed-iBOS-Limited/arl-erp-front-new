import React, { useEffect } from "react";
import RowTable from "../create/rowTable";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

function MarketCompetitorPriceView({ clickedRow }) {
  const [
    competitorPriceById,
    setCompetitorPriceById,
    loadingGetBy,
  ] = useAxiosGet();

  useEffect(() => {
    if (+clickedRow?.intCompetitorPriceHeaderId) {
      setCompetitorPriceById(
        `/oms/CompetitorPrice/GetCompetitorPriceById?PriceHeaderId=${+clickedRow?.intCompetitorPriceHeaderId}`,
        (resData) => {}
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedRow?.intCompetitorPriceHeaderId]);

  const {
    dteDate,
    strBusinessUnitName,
    strChannelName,
    strDistrictName,
    strThanaName,
    strTerritoryName,
  } = competitorPriceById?.objHeader || {};
  return (
    <>
      {loadingGetBy && <Loading />}
      <div>
        <div
          style={{
            display: "flex",
            gap: "38px",
            marginTop: "17px",
          }}
        >
          <p>
            <b>Date:</b> {_dateFormatter(dteDate)}
          </p>
          <p>
            <b>Business Unit:</b> {strBusinessUnitName}
          </p>
          <p>
            <b>Channel:</b> {strChannelName}
          </p>
          <p>
            <b>District:</b> {strDistrictName}
          </p>
          <p>
            <b>Police Station:</b> {strThanaName}
          </p>
          <p>
            <b>Territory:</b> {strTerritoryName}
          </p>
        </div>
      </div>
      <RowTable
        propsObj={{
          rowDto:
            competitorPriceById?.objRowList?.map((itm) => {
              return {
                ...itm,
                strDisplayName:
                  itm?.strDisplayName || itm?.strProductDisplayName || "",
              };
            }) || [],
          values: {
            ...competitorPriceById?.objHeader,
            channel: competitorPriceById?.objHeader?.intCompetitorChannelId
              ? {
                  value: competitorPriceById?.objHeader?.intCompetitorChannelId,
                  label: competitorPriceById?.objHeader?.strChannelName,
                }
              : "",
          },
          isView: true,
        }}
      />
    </>
  );
}

export default MarketCompetitorPriceView;
