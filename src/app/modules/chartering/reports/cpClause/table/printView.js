import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import "../Form/style.css";

export default function PrintView({ data }) {
  const printRef = useRef();
  return (
    <>
      <form className="marine-modal-form-card">
        <ReactToPrint
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
          trigger={() => (
            <button type="button" className="btn btn-primary px-3 py-2">
              <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
              Print
            </button>
          )}
          content={() => printRef.current}
        />
        <div ref={printRef} className="cpPrint">
          {" "}
          <div
            dangerouslySetInnerHTML={{
              __html:
                `<table style="border-collapse: collapse; text-align: left !important;">
                <tbody>
                  <tr style="border: 1px solid gray">
                    <td style="border: 1px solid gray; width: 50%; text-align: left; padding-bottom: 100px;" rowspan="2"><div>1. Shipbroker</div></td>
                    <td>
                      RECOMMENDED <br/> <b>THE BALTIC AND INTERNATIONAL MARITIME CONFERENCE UNIFORM
                      GENERAL CHARTER (AS REVISED 1922 AND 1976) INCLUDING “F.I.O.”
                      ALTERNATIVE, ETC.</b> <small> (To be used for trades for which no approved form
                      is in force)</small>  <b>CODE NAME: “G E N C O N” Part I </b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      2. Place and date <br/> <br> 06TH JANUARY, 2021, Dhaka </b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      3. Head Owners/Place of business (Cl.1) DISPONENT OWNERS: <br/> <b>  AKIJ
                      SHIPPING LINES PTE. LTD. SINGAPORE LAND TOWER, 50 RAFFLES PLACE,
                      LEVEL 19, ROOM-08, SINGAPORE 048623 </b>
                    </td>
                    <td style="border: 1px solid gray">
                      4. Charterers/Place of business (Cl.1) <br/> <b>  AKIJ CERAMICS LTD. AKIJ
                      CHAMBER 73, DILKUSHA C/A, DHAKA-1000 FACTORY: MOKKHOPUR, TRISHAL,
                      MYMENSINGH, DHAKA, BANGLADESH </b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      5. Vessel’s name (Cl.1) <br/> <b>  MV. AKIJ WAVE </b>  
                    </td>
                    <td style="border: 1px solid gray">
                      6. GRT/NRT (Cl.1) <br/> <b>  27,011/16,011 </b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      7. Deadweight cargo carrying capacity in tons (abt.) (Cl.1) <br/> <b> 46,640
                      MT </b>
                    </td>
                    <td style="border: 1px solid gray" rowspan="2">
                      8. Present position (Cl.1) <br/> <b>-TRADING </b> 
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      9. Expected ready to load (abt.) (Cl.1) <br/> <b>21th JANUARY, 2022/0000 HRS
                        LT</b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      10. Loading port or place (Cl.1) <br/> <b>THASALA PORT, THAILAND</b>
                    </td>
                    <td style="border: 1px solid gray">
                      11. Discharging port or place (Cl.1) <br/> <b>
                        CHATTOGRAM SEAPORT, BANGLADESH
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;" colspan="2">
                      12. Cargo (also state quantity and margin in Owners’ option, if
                      agreed: if full and complete cargo not agreed state “part cargo”)
                      (Cl.1) <br/> <b>
                        9,000.00 MT +/- 10% SODIUM FELDSPAR IN BULK
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      13. Freight rate (also state if payable on delivered or intake
                      quantity) (Cl.1) <br/> USD 27.5 PER METRIC TON FIOST BSS 1/1
                    </td>
                    <td style="border: 1px solid gray">
                      14. Freight payment (state currency and method of payment: also,
                      beneficiary and bank account) (Cl.4) <br/> <b>
                        SEE CLAUSE 47
                      </b>
                    </td>
                  </tr>
          
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      15. Loading and discharging costs (state alternative (a) or (b) of
                      Cl.5; also indicate if vessel is gearless) <br/> <b>FREE IN OUT STOWAGE AND
                        TRIMMING</b>
                    </td>
                    <td style="border: 1px solid gray" rowspan="2">
                      16. Laytime (if separate laytime for load. and disch. is agreed,
                      fill in a) and b) <br/> If total laytime for load. and disch., fill in c)
                      only) (Cl.6) <br/> A)  Laytime for Loading: Load rate at <b>THASALA PORT,
                        THAILAND</b> 6,000 Metric tons per weather working day Saturday(s),
                      Sunday(s) and holiday(s) included. Statutory port & THAILAND
                      National holiday(s) excluded. <br/> B)  Laytime for Discharging: Discharge
                      rate at CHATTOGRAM 3,000 MT per Weather working day, Friday(s),
                      Saturday(s) and holiday(s) included. Statutory port and Bangladesh
                      National holiday(s) excluded, uu iuatutc WORKING DAY SUNDAYS
                      HOLIDAYS INCLUDED. STATUTORY PORT & INDIAN NATIONAL HOLIDAYS
                      EXCLUDED, UU, IUATUTC c) Total Laytime for loading and discharging
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      17. Shippers (state name and address) (Cl. 6) <br/> <b>TO BE ANNOUNCED,</b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;">
                      18. Demurrage rate (loading and discharging) (Cl. 7) <br/> <b>USD 12,000 per
                        day pro-rata/half despatch working time saved</b>
                    </td>
                    <td style="border: 1px solid gray">
                      19. Cancelling date (Cl.10) <br/> <b>2359 HOURS LOCAL TIME, 26th JANUARY,
                        2022</b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;" colspan="2">
                      20. Brokerage commission and to whom payable (Cl.14) <br/> <b>NOT APPLICABLE</b>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid gray; text-align: left;" colspan="2">
                      21. Additional clauses covering special provisions, if Agreed <br/>
                      <b>ADDITIONAL CLAUSES 22 TO 55 ARE DEEMED FULLY INCORPORATED IN THIS
                        CHARTER PARTY</b>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: left;" colspan="2">
                      <p>
                        It is mutually agreed that this Contract shall be performed
                        subject to the conditions contained in this Charter which shall
                        include Part I as well as Part II. In the event of a conflict of
                        conditions, the provisions of Part I shall prevail over those of
                        Part II to the extent of such conflict.
                      </p>
                    </td>
                  </tr>
                  <tr style="padding-bottom: 100px;">
                    <td style="border: 1px solid gray; text-align: left; padding-bottom: 100px;">
                      <b> <small>Signature (Owners)</small>  <br/> AKIJ SHIPPING LINES PTE. LTD., SINGAPORE</b>
                    </td>
                    <td style="border: 1px solid gray; text-align: left; padding-bottom: 100px;">
                    <b> <small>Signature (Charterers)</small> <br/> AKIJ CERAMICS LTD.</b>
                    </td>
                  </tr>
                </tbody>
              </table>` + data,
            }}
          />{" "}
        </div>
      </form>
    </>
  );
}
