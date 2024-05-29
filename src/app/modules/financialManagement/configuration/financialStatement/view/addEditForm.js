/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import { getFinancialStatementById } from "../helper";
import { useLocation } from "react-router-dom";

export function FinacialStatementViewForm({
  history,
  match: {
    params: { comId, busId },
  },
}) {
  const location = useLocation();
  const [generalLedgerRowDto, setGeneralLedgerRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getFinancialStatementById(
        comId,
        selectedBusinessUnit.value,
        setGeneralLedgerRowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <ICustomCard
      title="Financial Statement"
      backHandler={() => history.goBack()}
    >
      <div className="row bank-journal bank-journal-custom bj-left">
        <>
          <div className="col-lg-2 mb-2">
            <input
              className="form-control"
              value={location.state?.fscomponentName}
              name="fsComponent"
              placeholder="FS Component Name"
              disabled
            />
          </div>
        </>
      </div>
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          {generalLedgerRowDto?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 pl-0">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Accounts Category</th>
                    <th>General Ledger</th>
                  </tr>
                </thead>
                <tbody>
                  {generalLedgerRowDto?.map((itm, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {itm?.accountCategoryName}
                      </td>
                      <td className="text-center">{itm?.generalLedgerName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ICustomCard>
  );
}
