import React, { useState } from 'react';
import '../style.css';
import Form from './form';
import useGoogleSheets from '../../../_helper/useGoogleSheets';
export default function Jobstation() {
  const [mapData, setMapData] = useState({ latitude: '', longitude: '' });

  const { data, loading } = useGoogleSheets({
    apiKey: import.meta.env.VITE_GOOGLE_SHEET_KEY,
    sheetId: '1pLkXwLNmHronVS3RbXbZuMO0_32X4CKO9MtpklFrUtY',
    // sheetsOptions: [{ id: 'Form Responses 2' }],
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
