import React from "react";
import { Card } from "./../../../../_metronic/_partials/controls/Card";
import { ModalProgressBar } from "./../../../../_metronic/_partials/controls/ModalProgressBar";
import StrategicmapLanding from "./landing";
import "./style.css";


function Strategicmap() {
  return (
    <Card>
      {true && <ModalProgressBar />}
      <h4 className="text-center pt-2">Strategic Map</h4>
      <hr />
      <StrategicmapLanding />
    </Card>
  );
}

export default Strategicmap;
