import React, { useState } from "react";
import "../style.css";
import Form from "./form";
import useGoogleSheets from "use-google-sheets";
export default function Jobstation() {
  const [mapData, setMapData] = useState({ latitude: "", longitude: "" });

  const { data, loading, error } = useGoogleSheets({
    apiKey: "AIzaSyCS7G-53NbWXSPNN5_FsesareMdoByM61w",
    sheetId: "1N0mKMy7tziPaahDIQviLjtMqIKiHcanCflXU8jnePSc",
  });

  return (
    <Form
      setMapData={setMapData}
      mapData={mapData}
      datalist={data}
      loading={loading}
    />
  );
}
