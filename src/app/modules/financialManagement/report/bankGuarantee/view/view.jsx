import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function BankGuaranteeView({
  landingItem,
  selectedBusinessUnit,
}) {
  const [viwData, getViewData, loading] = useAxiosGet();

  useEffect(() => {
    getViewData(
      `https://localhost:44346/fino/CommonFino/GetBankGuaranteeSecurityRegisterById?businessUnitId=${selectedBusinessUnit?.value}&code=${landingItem?.strCode}&autoId=${landingItem?.intId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("viwData", viwData);
  return (
    <div>
      {loading && <Loading />}
      <div className="mt-5">
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SBU</th>
                <th>Bank</th>
                <th>BG Number</th>
                <th>Beneficiary Name</th>
                <th>Issue Date</th>
                <th>Ending Date</th>
                <th>T Days</th>
                <th>Currency</th>
                <th>Amount</th>
                <th>Margin Ref.</th>
                <th>In Fav. Of</th>
                <th>Responsible Person</th>
                <th>Security Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {viwData?.length > 0 &&
                viwData?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.strSbu}</td>
                    <td>{item?.strBankName}</td>
                    <td>{item?.strBankGuaranteeNumber}</td>
                    <td>{item?.strBeneficiaryTitle}</td>
                    <td>{_dateFormatter(item?.dteIssueDate)}</td>
                    <td>{_dateFormatter(item?.dteEndingDate)}</td>
                    <td>{item?.intTdays}</td>
                    <td>{item?.strCurrency}</td>
                    <td>{item?.numAmount}</td>
                    <td>{item?.strMarginRef}</td>
                    <td>{item?.strInFavOf}</td>
                    <td>{item?.strResponsiblePerson}</td>
                    <td>{item?.strSecurityType}</td>
                    <td>{item?.strStatus}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
