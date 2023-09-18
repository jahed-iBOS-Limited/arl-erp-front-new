import React, { useState } from "react";
import "../style.css";
import Form from "./form";
import useGoogleSheets from "../../../_helper/useGoogleSheets";
export default function Jobstation() {
  const [mapData, setMapData] = useState({ latitude: "", longitude: "" });

  const { data, loading, error } = useGoogleSheets({
    apiKey: "AIzaSyCS7G-53NbWXSPNN5_FsesareMdoByM61w",
    sheetId: "1N0mKMy7tziPaahDIQviLjtMqIKiHcanCflXU8jnePSc",
    sheetsOptions: [{ id: 'Form Responses 2' }],
  });


  return (
    <Form
      setMapData={setMapData}
      mapData={mapData}
      datalist={data || []}
      loading={loading}
    />
  );
}
