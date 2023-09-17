/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Fullscreen from "react-leaflet-fullscreen-plugin";
import Loading from "../../../_helper/_loading";
function RemoteAttendanceMap({ mapData, setMapData, allSheetData }) {
  const [loading, setLoading] = useState(false);
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
          }
        );
      } else {
        console.log("else");
      }
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const options = {
    position: "topleft",
    title: "Show me the fullscreen !",
    titleCancel: "Exit fullscreen mode",
    content: null,
    forceSeparateButton: true,
    forcePseudoFullscreen: true,
    fullscreenElement: false,
  };

  return (
    <div className='jobstationMap'>
      {loading && <Loading />}
      <div style={{ width: "100%", height: "80Vh", overflow: "hidden" }}>
        {mapData?.latitude && allSheetData && (
          <MapContainer
            center={[mapData?.latitude, mapData?.longitude]}
            zoom={10}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'
            />
            {/* {mapData?.latitude && (
              <Marker
                position={[mapData?.latitude, mapData?.longitude]}
              ></Marker>
            )} */}
            <Markers markersData={allSheetData} />
            <Fullscreen
              eventHandlers={{
                enterFullscreen: (event) => {},
                exitFullscreen: (event) => {},
              }}
              {...options}
            />
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default RemoteAttendanceMap;

const Markers = ({ markersData }) => {
  return (
    <>
      {markersData.map((element, index) => {
        const photoLinkList = [
          element?.photo1,
          element?.photo2,
          element?.photo3,
        ];
        return (
          <Marker
            className={"markerPopup"}
            key={index}
            marker_index={index}
            position={[element?.latitude || 0, element?.longitude || 0]}
          >
            <Popup position={[element?.latitude || 0, element?.longitude || 0]}>
              <p>
                {" "}
                <i class='fa fa-dot-circle-o' aria-hidden='true'></i>
                <b>Responsible Name: </b>
                {element?.[`responsibleperson'sname`]}
              </p>
              <p>
                {" "}
                <i class='fa fa-dot-circle-o' aria-hidden='true'></i>
                <b>Business Name: </b>
                {element?.[`businessname`]}
              </p>
              <p>
                {" "}
                <i class='fa fa-dot-circle-o' aria-hidden='true'></i>
                <b>Present Address </b>
                {element?.[`presentaddress(postaladdressfull)`]}
              </p>
              <p>
                {" "}
                <i class='fa fa-dot-circle-o' aria-hidden='true'></i>
                <b>Territory Name </b>
                {element?.[`territoryname`]}
              </p>
              <p>
                <i class='fa fa-dot-circle-o' aria-hidden='true'></i>
                <b>Mobile Number :</b> {element?.mobilenumber}
              </p>
              <div className="photoLinkList">
                {photoLinkList.map((photoLink, index) => {
                  return (
                    <div key={index}>
                      {photoLink && (
                        <img
                          src={photoLink}
                          alt={`photo ${index +1}`}
                          style={{ width: "100px", height: "100px" }}
                          onClick={() => {
                            window.open(photoLink);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
