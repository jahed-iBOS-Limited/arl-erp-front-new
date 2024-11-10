import React from "react";

export default function TaxCalculationReport({ noteData, allValueResult }) {
  const {
    result34,
    result35,
    result36,
    result37,
    result40,
    result41,
    result42,
    result43,
    result44,
    result45,
    result46,
    result47,
    result48,
    result49,
    result50,
    result51,
    result52,
    result53,
  } = allValueResult;

  return (
    <>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th colSpan="3">Part - 7: NET TAX CALCULATION</th>
          </tr>
          <tr>
            <th style={{ width: "550px" }}>Items</th>
            <th>Note</th>
            <th>Amount (Tax)</th>
          </tr>
        </thead>
        <tbody>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable VAT for the Tax Period (Section- 45)(9C-23B+28-33)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">34</div>
            </td>
            <td>
              <div className="text-right pr-2">{result34.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable VAT for the Tax Period after Adjustment with Closing
                Balance and Balance of from 18.6 [34-(52+56)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">35</div>
            </td>
            <td>
              <div className="text-right pr-2">{result35.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable Supplementary Duty for the Tax Period (Before
                adjustment with Closing Balance) [9B+38-(39+40)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">36</div>
            </td>
            <td>
              <div className="text-right pr-2">{result36.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable Supplementary Duty for the Tax Period after Adjusted
                with Closing Balance and Balance of from 18.6 [36-(53+57)]
              </div>
            </td>
            <td>
              <div className="text-right pr-2">37</div>
            </td>
            <td>
              <div className="text-right pr-2">{result37.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Supplementary Duty Against Issuance of Debit Note
              </div>
            </td>
            <td>
              <div className="text-right pr-2">38</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {noteData[0]?.noteNo === 38 ? noteData[0]?.amount : ""}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Supplementary Duty Against Issuance of Credit Note
              </div>
            </td>
            <td>
              <div className="text-right pr-2">39</div>
            </td>
            <td>
              <div className="text-right pr-2">
                {noteData[1]?.noteNo === 39 ? noteData[1]?.amount : ""}
              </div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Supplementary Duty Paid on Inputs Against Exports
              </div>
            </td>
            <td>
              <div className="text-right pr-2">40</div>
            </td>
            <td>
              <div className="text-right pr-2">{result40}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Interest on Overdue VAT (Based on note -35)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">41</div>
            </td>
            <td>
              <div className="text-right pr-2">{result41}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Interest on Overdue SD (Based on note -37)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">42</div>
            </td>
            <td>
              <div className="text-right pr-2">{result42}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Fine/Penalty for Non-submission of Return
              </div>
            </td>
            <td>
              <div className="text-right pr-2">43</div>
            </td>
            <td>
              <div className="text-right pr-2">{result43}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Other Fine/Penalty/Interest</div>
            </td>
            <td>
              <div className="text-right pr-2">44</div>
            </td>
            <td>
              <div className="text-right pr-2">{result44}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable Excise Duty</div>
            </td>
            <td>
              <div className="text-right pr-2">45</div>
            </td>
            <td>
              <div className="text-right pr-2">{result45}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable Development Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">46</div>
            </td>
            <td>
              <div className="text-right pr-2">{result46}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable ICT Development Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">47</div>
            </td>
            <td>
              <div className="text-right pr-2">{result47.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">Payable Health Care Surcharge</div>
            </td>
            <td>
              <div className="text-right pr-2">48</div>
            </td>
            <td>
              <div className="text-right pr-2">{result48}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Payable Environmental Protection Surcharge
              </div>
            </td>
            <td>
              <div className="text-right pr-2">49</div>
            </td>
            <td>
              <div className="text-right pr-2">{result49}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable VAT for treasury Deposit (35+41+43+44)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">50</div>
            </td>
            <td>
              <div className="text-right pr-2">{result50.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Net Payable SD for treasury Deposit (37+42)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">51</div>
            </td>
            <td>
              <div className="text-right pr-2">{result51.toFixed(2)}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance of Last Tax Period (VAT)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">52</div>
            </td>
            <td>
              <div className="text-right pr-2">{result52}</div>
            </td>
          </tr>
          {/* 1st row */}
          <tr>
            <td>
              <div className="pl-2">
                Closing Balance of Last Tax Period (SD)
              </div>
            </td>
            <td>
              <div className="text-right pr-2">53</div>
            </td>
            <td>
              <div className="text-right pr-2">{result53}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
