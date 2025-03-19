import React, { useState } from "react";
import Loading from "../../_helper/_loading";
import ScrollableTable from "./components/scrollableTable";
import "./style.css";

export function Addjustment() {
  const [loading, setLoading] = useState(false);

  return (
    <>
     {loading && <Loading />}
      <form className="marine-form-card">
        <div className="marine-form-card-heading">
          <p>Adjustment</p>
        </div>
        <ScrollableTable setLoading={setLoading}/>
      </form>
    </>
  );
}
