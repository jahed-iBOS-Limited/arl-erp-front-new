import React from "react";
import "../../templates/style.scss";

const AuthorizationOne = () => {
  return (
    <>
      <div className="bank-letter-template-common-wrapper">
        <p style={{}}>
          <b>
            {" "}
            REF : {"{"}
            {"{"}Unit Short Name{"}"}
            {"}"}/{"{"}
            {"{"}Bank Name{"}"}
            {"}"}/Doc/{"{"}
            {"{"}Date Ref{"}"}
            {"}"}
          </b>
        </p>
        <p style={{ marginTop: "-15px" }}>
          <b>
            Date : {"{"}
            {"{"}Date{"}"}
            {"}"}
          </b>
        </p>
        <p style={{ marginTop: 35 }}>To</p>
        <p style={{ marginTop: "-15px" }}>The Head of the Branch</p>
        <p style={{ marginTop: "-15px" }}>
          {"{"}
          {"{"}Bank Name{"}"}
          {"}"}
        </p>
        <p style={{ marginTop: "-15px" }}>
          {"{"}
          {"{"}Branch Name{"}"}
          {"}"} Branch
        </p>
        <p style={{ marginTop: "-15px" }}>
          {"{"}
          {"{"}Bank Address{"}"}
          {"}"}
        </p>
        <p style={{ margin: "35px 0" }}>
          <b>
            Subject: Authorization to receive {"{"}
            {"{"}Document Name{"}"}
            {"}"} of {"{"}
            {"{"}SBU Full Name{"}"}
            {"}"}
            Account Type{"}"}
            {"}"} A/c No- {"{"}
            {"{"}Account Number{"}"}
            {"}"}.
          </b>
        </p>
        <p style={{ marginTop: 35 }}>Dear Sir/ Madam,</p>
        <p>As-salamu alaykum</p>
        <p style={{ marginTop: "-10px" }}>
          We do hereby authorize {"{"}
          {"{"}Messenger Name{"}"}
          {"}"}, {"{"}
          {"{"}Messenger Designation{"}"}
          {"}"}of our company to receive {"{"}
          {"{"}Document Name{"}"}
          {"}"} of {"{"}
          {"{"}SBU Full Name{"}"}
          {"}"}, A/C No-
          {"{"}
          {"{"}Account Number{"}"}
          {"}"}. His specimen signature is attested below.
        </p>
        <p style={{ marginTop: 35 }}>
          <b>The Specimen Signature of</b>
        </p>
        <p style={{ marginTop: 35 }}>.....................................</p>
        <p style={{ marginTop: "-15px" }}>
          {"{"}
          {"{"}Messenger Name{"}"}
          {"}"}
        </p>
        <p style={{ marginTop: "-15px" }}>
          {"{"}
          {"{"}Messenger Designation{"}"}
          {"}"}
        </p>
        <br />
        <p style={{ marginTop: 5 }}>Yours faithfully,</p>
        <p style={{ marginTop: 5 }}>
          For,{" "}
          <b>
            {"{"}
            {"{"}SBU Full Name{"}"}
            {"}"}
          </b>
        </p>
        <div style={{ marginTop: 65, display: "flex" }}>
          <div>Authorized Signature</div>
          <div style={{ marginLeft: 20 }}>Authorized Signature</div>
        </div>
      </div>
    </>
  );
};

export default AuthorizationOne;
