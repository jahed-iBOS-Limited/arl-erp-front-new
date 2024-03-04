import React, { useRef, useEffect } from "react";
import { Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

const PolylineDecorator = (props) => {
  const polyRef = useRef();
  const map = useMap();

  useEffect(() => {
    const polyline = polyRef.current; //get native Leaflet polyline

    // Add Arow in Polyline
    L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: 15,
          /* pos of first arrow */ repeat: 55 /* dist between arrows */,
          symbol: L.Symbol.arrowHead({
            // Define the arrow symbol
            pixelSize: 10, // Size
            polygon: false, // false: ^ shape, true: triangle shape.
            pathOptions: { stroke: true }, // Required to actually draw the arrow.
          }),
        },
      ],
    }).addTo(map);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.positions]);
  return (
    <>
      <Polyline ref={polyRef} {...props} />
    </>
  );
};

export default PolylineDecorator;
