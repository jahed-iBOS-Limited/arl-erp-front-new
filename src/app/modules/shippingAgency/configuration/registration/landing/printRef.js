import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import { getASLLAgencyRegistrationById } from "../helper";
import "./printRef.css";
function PrintRef({ componentRef, registrationId }) {
  const [loading, setLoading] = React.useState(false);
  const [singleData, setSingleData] = React.useState({});

  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  useEffect(() => {
    if (registrationId) {
      getASLLAgencyRegistrationById(registrationId, setLoading, (resData) => {
        setSingleData(resData);
      });
    }
  }, [registrationId]);

  return (
    <>
      {loading && <Loading />}
      <div ref={componentRef}>
        <div className="Registration">
          <div className="RegistrationTopBar">
            <h1>{selectedBusinessUnit?.label}</h1>
            <h6>Registration Invoice </h6>
          </div>

          <div className="RegistrationInfo">
            <div className="left">
              <p>
                <b>Vessel Type:</b> {singleData?.vesselType}
              </p>

              <p>
                <b>Vessel Name:</b> {singleData?.vesselName}
              </p>
              <p>
                <b>Dockyard Name:</b> {singleData?.DockyardName}
              </p>
              <p>
                <b>Remarks:</b> {singleData?.remarks}
              </p>
            </div>
            <div className="right">
              <p>
                <b>Arrived Time:</b>{" "}
                {singleData?.serverDateTime
                  ? moment(singleData?.serverDateTime).format(
                      "YYYY-DD-MM, hh:mm A"
                    )
                  : "N/A"}
              </p>
              <p>
                <b>Sailed Time:</b>{" "}
                {singleData?.sailedDateTime
                  ? moment(singleData?.sailedDateTime).format(
                      "YYYY-DD-MM, hh:mm A"
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="table">
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Completion Date</th>
                    <th>Discharge Port</th>
                    <th>Cargo Name</th>
                    <th>Cargo Owner</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {singleData?.rowDtos?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center"> {index + 1}</td>
                      <td>
                        {item?.completionDate &&
                          moment(item?.completionDate).format("YYYY-MM-DD")}
                      </td>
                      <td>{item?.dischargePortName}</td>
                      <td>{item?.cargoName}</td>
                      <td>{item?.cargoOwner}</td>
                      <td className="text-center">{item?.quantity}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="text-right" colSpan={5}>
                      <b>Total</b>
                    </td>
                    <td className="text-center">
                      <b>
                        {singleData?.rowDtos?.reduce(
                          (acc, cur) => acc + (+cur?.quantity || 0),
                          0
                        )}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrintRef;
