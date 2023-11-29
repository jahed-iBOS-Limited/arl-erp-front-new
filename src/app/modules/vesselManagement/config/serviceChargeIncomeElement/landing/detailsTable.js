import React, { useState } from "react";
import InputField from "../../../../_helper/_inputField";
import { rateApprove } from "../helper";
import Loading from "../../../../_helper/_loading";

const DetailsTable = ({ obj }) => {
  const { costs, revenues, setCosts, setRevenues, userId } = obj;
  const [loading, setLoading] = useState(false);

  const approveRate = (item, i) => {
    const payload = [
      {
        rowId: item?.rowId,
        rateId: item?.rateId,
        rate: item?.rate,
        updateBy: userId,
      },
    ];
    rateApprove(payload, setLoading, () => {
      if (item?.typeId === 1) {
        costs[i].isApprove = true;
        setCosts([...costs]);
      } else if (item?.typeId === 2) {
        revenues[0].isApprove = true;
        setRevenues([...revenues]);
      }
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="row">
        <div className="col-lg-12">
          <div className="react-bootstrap-table table-responsive">
            <table
              className={"table table-striped table-bordered global-table "}
            >
              <thead>
                <tr>
                  <th style={{ minWidth: "30px" }}>SL</th>
                  <th>Cost Element</th>
                  <th>Rate (BDT)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {costs?.map((item, i) => {
                  return (
                    <tr>
                      <td style={{ minWidth: "30px" }} className="text-center">
                        {i + 1}
                      </td>
                      <td>{item?.serviceElementName}</td>
                      <td>
                        {item?.isApprove ? (
                          item?.rate
                        ) : (
                          <InputField
                            name="rate"
                            value={item?.rate}
                            placeholder="Rate"
                            type="number"
                            onChange={(e) => {
                              item.rate = e.target.value;
                              setCosts([...costs]);
                            }}
                          />
                        )}
                      </td>
                      <td className="text-center">
                        {item?.isApprove ? (
                          "Approved"
                        ) : (
                          <button
                            className="btn btn-info btn-sm"
                            type="button"
                            onClick={() => {
                              approveRate(item, i);
                            }}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* <div className="col-lg-6">
          <div className="react-bootstrap-table table-responsive">
            <table
              className={"table table-striped table-bordered global-table "}
            >
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Revenue Element</th>
                  <th>Rate (BDT)</th> <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {revenues?.map((item, i) => {
                  return (
                    <tr>
                      <td className="text-center">{i + 1}</td>
                      <td>{item?.serviceElementName}</td>
                      <td>
                        {item?.isApprove ? (
                          item?.rate
                        ) : (
                          <InputField
                            name="rate"
                            value={item?.rate}
                            placeholder="Rate"
                            type="number"
                            onChange={(e) => {
                              item.rate = e.target.value;
                              setRevenues([...revenues]);
                            }}
                          />
                        )}
                      </td>
                      <td className="text-center">
                        {item?.isApprove ? (
                          "Approved"
                        ) : (
                          <button
                            className="btn btn-info btn-sm"
                            type="button"
                            onClick={() => {
                              approveRate(item, i);
                            }}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default DetailsTable;
