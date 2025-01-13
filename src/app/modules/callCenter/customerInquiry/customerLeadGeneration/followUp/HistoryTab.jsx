import React from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";

export default function HistoryTab({ id }) {
  // =6
  const [data, GetCustomerLeadById, isLoadingCustomerLeadById] = useAxiosGet();

  React.useEffect(() => {
    if (id) {
      GetCustomerLeadById(
        `/oms/SalesQuotation/GetCustomerFollowUpActivity?CustomerAcquisitionId=${id}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <React.Fragment>
      {isLoadingCustomerLeadById && <Loading />}
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Activity Type</th>
              <th>Date</th>
              <th>Call By</th>
              <th>Follow Up Date</th>
              <th>Description</th>
              <th>Outcomes</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
