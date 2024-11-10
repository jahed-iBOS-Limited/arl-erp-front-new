import React from "react";
import { _todayDate } from "../../../../_helper/_todayDate";

export default function ReturnSubmissionReport() {
  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="4">Part-2 : RETURN SUBMISSION DATA</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="text-right pr-2">1</div>
            </td>
            <td>
              <div className="pl-2">Tax Preiod</div>
            </td>
            <td>
              <div className="text-center">:</div>
            </td>
            <td>
              <div className="text-left pl-2">
                <b>00-2020</b>
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="text-right pr-2">2</div>
            </td>
            <td>
              <div className="pl-2">
                Type of Return <br /> [Please select your desired option]
              </div>
            </td>
            <td rowSpan="2">
              <div className="text-center">:</div>
            </td>
            <td>
              <ul style={{ paddingLeft: "0" }}>
                <li className="d-flex justify-content-between">
                  <spn>A) Main/Original Return (Section 64)</spn>
                  <spn>
                    <input
                      type="checkbox"
                      checked
                      style={{ position: "relative", top: "2px" }}
                      disabled
                    />
                  </spn>
                </li>
                <li className="d-flex justify-content-between">
                  <spn>B) Late Return (Section 65)</spn>
                  <spn>
                    <input
                      type="checkbox"
                      style={{ position: "relative", top: "2px" }}
                      disabled
                    />
                  </spn>
                </li>
                <li className="d-flex justify-content-between">
                  <spn>C)Amend Return (Section 66)</spn>
                  <spn>
                    <input
                      type="checkbox"
                      style={{ position: "relative", top: "2px" }}
                      disabled
                    />
                  </spn>
                </li>
                <li className="d-flex justify-content-between">
                  <spn>
                    D) Full or Additional or Alternative Return (Section 67)
                  </spn>
                  <spn>
                    <input
                      type="checkbox"
                      style={{ position: "relative", top: "2px" }}
                      disabled
                    />
                  </spn>
                </li>
              </ul>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="text-right pr-2">3</div>
            </td>
            <td>
              <div className="pl-2">
                Any activites in this Tax Preiod? <br /> [If Selected "No"
                please Fill only the relevant Part]
              </div>
            </td>
            <td>
              <div className="d-flex justify-content-around">
                <div>
                  <label className="pr-2">Yes</label>
                  <input
                    type="checkbox"
                    checked
                    style={{ position: "relative", top: "2px" }}
                    disabled
                  />
                </div>
                <div>
                  <label className="pr-2">No</label>
                  <input
                    type="checkbox"
                    style={{ position: "relative", top: "2px" }}
                    disabled
                  />
                </div>
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="text-right pr-2">4</div>
            </td>
            <td>
              <div className="pl-2">Date of Submission</div>
            </td>
            <td>
              <div className="text-center">:</div>
            </td>
            <td>
              <div className="text-left pl-2">
                <b>{_todayDate()}</b>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
