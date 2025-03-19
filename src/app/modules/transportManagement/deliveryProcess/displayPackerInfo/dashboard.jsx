import React, { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";

const Dashboard = () => {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [reportData, getReportData] = useAxiosGet();

  useEffect(() => {
    getReportData(
      `/oms/SalesInformation/GetPackerInfoLiveTime?PartId=1&ShipPointid=60&UnitId=${
        selectedBusinessUnit?.value
      }&FromDate=${_todayDate()}&ToDate=${_todayDate()}`
    );

    const interval = setInterval(() => {
      getReportData(
        `/oms/SalesInformation/GetPackerInfoLiveTime?PartId=1&ShipPointid=60&UnitId=${
          selectedBusinessUnit?.value
        }&FromDate=${_todayDate()}&ToDate=${_todayDate()}`
      );
    }, 60000); // Fetch data every 1 minitue

    return () => clearInterval(interval); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Real-Time Packer Dashboard</h1>
      <div style={styles.cardContainer}>
        {reportData.map((data, index) => (
          <div key={index} style={styles.card}>
            <h2 style={styles.vehicleName}>{data.strWorkCenterName}</h2>
            <p>
              <strong>Vehicle Name:</strong> {data.strVehicleName}
            </p>
            <p>
              <strong>TLM:</strong> {data.TLM}
            </p>
            <p>
              <strong>Packer Out Time:</strong>{" "}
              {new Date(data.dtePackerOutTime).toLocaleString()}
            </p>
            <p>
              <strong>Item Name:</strong> {data.strItemName}
            </p>
            <p>
              <strong>Quantity:</strong> {data.numQuantity}
            </p>
            <p>
              <strong>Bag Type:</strong> {data.strbagtype}
            </p>
            <p>
              <strong>Driver Name:</strong> {data.strDriverName}
            </p>
            <p>
              <strong>Driver Contact:</strong> {data.strDriverContact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px",
    margin: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  vehicleName: {
    margin: "0 0 10px 0",
    color: "#007bff",
  },
};

export default Dashboard;
