import React from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import moment from "moment";

export default function HistoryTab({ id }) {
  // =6
  const [data, GetCustomerLeadById, isLoadingCustomerLeadById] = useAxiosGet();

  React.useEffect(() => {
    if (id) {
      GetCustomerLeadById(
        `/oms/SalesQuotation/GetCustomerFollowUpActivity?CustomerAcquisitionId=${id}`
      );
    }

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
              <th>Location</th>
              <th>Meeting With</th>
              <th>To</th>
              <th>Stage</th>
              <th>Follow Up Date</th>
              <th>Description</th>
              <th>Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.activityTypeName}</td>
                <td>
                  {moment(item?.activityDateTime).isValid() &&
                    moment(item?.activityDateTime).format(
                      "DDD MMM YYYY hh:mm A"
                    )}
                </td>
                <td>{item?.calledbyName}</td>
                <td>{item?.address}</td>
                <td>{item?.meetingWithName}</td>
                <td>{item?.to}</td>
                <td>{item?.stageName}</td>
                <td>
                  {moment(item?.followUpDate).isValid() &&
                    moment(item?.followUpDate).format("DDD MMM YYYY hh:mm A")}
                </td>
                <td>{item?.description}</td>
                <td>{item?.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
