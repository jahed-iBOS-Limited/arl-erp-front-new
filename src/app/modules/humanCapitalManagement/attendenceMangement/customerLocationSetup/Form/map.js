import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import Loading from './../../../../_helper/_loading'
function RemoteAttendanceMap({ mapData, setMapData }) {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          console.log(pos)
          setMapData({
            latitude: pos.coords?.latitude,
            longitude: pos.coords?.longitude,
          })
          setLoading(false)
        },
        (err) => {
          console.log(err)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 100,
          timeout: 60000,
        }
      )
    } else {
      console.log('else')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="RemoteAttendanceMap">
      {loading && <Loading />}
      <div style={{ width: '100%', height: '50Vh', overflow: 'hidden' }}>
        <p>
          <b>Latitude</b>: {mapData?.latitude}, <b>Longitude:</b>{' '}
          {mapData?.longitude}
        </p>

        {mapData?.latitude && (
          <MapContainer
            center={[mapData?.latitude, mapData?.longitude]}
            zoom={20}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
            />
            {mapData?.latitude && (
              <Marker
                position={[mapData?.latitude, mapData?.longitude]}
              ></Marker>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  )
}

export default RemoteAttendanceMap
