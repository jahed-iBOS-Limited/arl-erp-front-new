import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";

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
      <div>
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
            </tr>
          </thead>
          <tbody>
            {viwData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
