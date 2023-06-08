/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICustomCard from "../../../../_helper/_customCard";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Loading from "../../../../_helper/_loading";
import { getLandingAction } from "../helper";

export default function BankLimit() {
  let ths = ["SL", "Date ", "Bank Name", "Limit Type", "Type", "Amount"];
  const history = useHistory();
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [bankLimitData, getBankLimitData, getBankLimitDataLoader] = useAxiosGet([]);

  useEffect(() => {
    getLandingAction({ selectedBusinessUnit, getBankLimitData });
  }, [selectedBusinessUnit]);

  return (
    <>
      {getBankLimitDataLoader && <Loading />}
      <ICustomCard title={"Bank Limit"} createHandler={() => history.push("/financial-management/financials/limitBank/create")}>
        <ICustomTable ths={ths}>
          {bankLimitData?.map((item, index) => {
            const { dteTransaction, strLimit, strType, numAmount } = item?.limitInfo;
            const { strBankName } = item?.bankInfo;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="text-center">{_dateFormatter(dteTransaction)}</td>
                <td>{strBankName}</td>
                <td className="text-center">{strLimit}</td>
                <td className="text-center">{strType}</td>
                <td className="text-right">{_formatMoney(numAmount)}</td>
              </tr>
            );
          })}
          {bankLimitData?.length ? (
            <tr>
              <td colSpan="5" className="text-right">
                Total:
              </td>
              <td className="text-center">{_formatMoney(bankLimitData?.reduce((total, value) => total + +value?.limitInfo?.numAmount, 0))}</td>
            </tr>
          ) : null}
        </ICustomTable>
      </ICustomCard>
    </>
  );
}
