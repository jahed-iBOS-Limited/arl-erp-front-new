import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import RemoteAttendanceMap from "./map";
import { convertKeysSpace } from "../../allReport/utility";
import Loading from "../../../_helper/_loading";
// Validation schema
export default function _Form({ mapData, setMapData, datalist, loading }) {
  const [allSheetData, setAllSheetData] = React.useState('');
  const handleRefresh = () => {
    window.location.reload();
  };
  useEffect(() => {
    try {
      const _allSheetData = datalist?.[0]?.data || [];

      const _list = [];
      // for in loop
      for (const item of _allSheetData) {
        const newObj = convertKeysSpace(item);
        const latitude = parseFloat(newObj?.gpscoordinate?.split(",")?.[0]);
        const longitude = parseFloat(newObj?.gpscoordinate?.split(",")?.[1]);
        _list.push({
          ...newObj,
          latitude: latitude &&longitude ? latitude : 0,
          longitude : latitude &&longitude ? longitude : 0,
        });
      }
      setAllSheetData(_list);
    } catch (error) {
      console.log(error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datalist]);
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"ARL Workplace(Job Station)"}>
          <CardHeaderToolbar>
            <button
              onClick={handleRefresh}
              className='btn btn-primary ml-2'
              type='button'
            >
              Location Refresh
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody className=''>
          {loading && <Loading />}
          <RemoteAttendanceMap
            setMapData={setMapData}
            mapData={mapData}
            datalist={datalist}
            allSheetData={allSheetData}
          />
        </CardBody>
      </Card>
    </>
  );
}
