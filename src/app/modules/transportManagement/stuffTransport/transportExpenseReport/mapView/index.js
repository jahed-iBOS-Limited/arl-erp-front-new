import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import PolylineDecorator from './polylineDecorator';

export default function MapView({ singleData }) {
  const [mapData, setMapData] = useState({ latitude: '', longitude: '' });
  const [allSheetData, getAllSheetData] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [polylineData, setPolylineData] = useState([]);

  useEffect(() => {
    getAllSheetData(
      `mes/VehicleLog/GetTripAndDriverCheckPointInfo?tripId=${singleData?.intTripId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => {
            console.log(pos);
            setMapData({
              latitude: pos.coords?.latitude,
              longitude: pos.coords?.longitude,
            });
            setLoading(false);
          },
          (err) => {
            console.log(err);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 100,
            timeout: 60000,
          },
        );
      } else {
        console.log('else');
      }
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate Payload for Polyline
  useEffect(() => {
    if (allSheetData?.length === 0) return;

    // Modify Data for Polyline in Map
    let polylineData = allSheetData.map((item) => [
      item?.latitude,
      item?.longitude,
    ]);

    setPolylineData(polylineData);
  }, [allSheetData]);

  return (
    <>
      <div className="jobstationMap">
        {loading && <Loading />}
        <div
          style={{
            width: '96%',
            height: '500px',
            overflow: 'hidden',
            margin: '5px auto',
          }}
        >
          {mapData?.latitude && (
            <MapContainer
              center={[mapData?.latitude, mapData?.longitude]}
              zoom={11}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
              />

              {/* Add PolyLine  */}
              {polylineData?.length > 1 && (
                // <Polyline positions={polylineData} color={"red"} />
                <PolylineDecorator positions={polylineData} />
              )}

              <Markers markersData={allSheetData} />
              <FullscreenControl />
            </MapContainer>
          )}
        </div>
      </div>
      <div className="mt-5">
        <div className="d-flex justify-content-between">
          <div>
            <p>
              <strong>Vehicle User Name:</strong>{' '}
              {allSheetData[0]?.vehicleUserName}
            </p>
            <p>
              <strong>Vehicle User Enroll:</strong>{' '}
              {allSheetData[0]?.vehicleUserEnroll}
            </p>
            <p>
              <strong>Designation:</strong>{' '}
              {allSheetData[0]?.employeeDesignation}
            </p>
          </div>
          <div>
            <p>
              <strong>Trip No:</strong> {allSheetData[0]?.tripCode}
            </p>
            <p>
              <strong>Vehicle No:</strong> {allSheetData[0]?.vehicleName}
            </p>
            <p>
              <strong>Driver Name:</strong> {allSheetData[0]?.driverName}
            </p>
            <p>
              <strong>Driver Enroll:</strong> {allSheetData[0]?.driverEnroll}
            </p>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {allSheetData?.length > 0 &&
                allSheetData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      {_dateFormatter(item?.tripDateTime?.split('T')[0])}
                    </td>
                    <td className="text-center">{item?.tripTime}</td>
                    <td className="">{item?.tripLocation}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const Markers = ({ markersData }) => {
  return (
    <>
      {markersData?.length > 0 &&
        markersData.map((element, index) => {
          //   const photoLinkList = [
          //     element?.photo1,
          //     element?.photo2,
          //     element?.photo3,
          //   ];

          console.log(element, 'element');
          return (
            <Marker
              className={'markerPopup'}
              key={index}
              marker_index={index}
              position={[element?.latitude || 0, element?.longitude || 0]}
            >
              {/* <Popup
                position={[element?.latitude || 0, element?.longitude || 0]}
              >
                <p>
                  {" "}
                  <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
                  <b>Responsible Name: </b>
                  {element?.[`driverName`]}
                </p>
                <p>
                  {" "}
                  <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
                  <b>Business Name: </b>
                  {element?.[`businessname`]}
                </p>
                <p>
                  {" "}
                  <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
                  <b>Present Address </b>
                  {element?.[`presentaddress(postaladdressfull)`]}
                </p>
                <p>
                  {" "}
                  <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
                  <b>Territory Name </b>
                  {element?.[`territoryname`]}
                </p>
                <p>
                  <i class="fa fa-dot-circle-o" aria-hidden="true"></i>
                  <b>Mobile Number :</b> {element?.mobilenumber}
                </p>
                <div className="photoLinkList">
                  {photoLinkList.map((photoLink, index) => {
                    return (
                      <div key={index}>
                        {photoLink && (
                          <img
                            src={photoLink}
                            alt={`photo ${index + 1}`}
                            style={{ width: "100px", height: "100px" }}
                            onClick={() => {
                              window.open(photoLink);
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${element?.latitude},${element?.longitude}`
                      );
                    }}
                  >
                    <MapIcon />
                  </span>
                </div>
              </Popup> */}
            </Marker>
          );
        })}
    </>
  );
};
