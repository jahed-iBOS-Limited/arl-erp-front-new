import { Box } from "@material-ui/core";
import React, { useState } from "react";
import BankJournalCreateForm from "./contra/createBankTransfer/addForm";
import FundTransferRequest from "./contra/fundTransferRequest";

const FundTransfer = () => {
    const [viewType, setViewType] = useState("Contra");



    return (
        <Box style={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
            <Box mb={2}>
                <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                        <input
                            type="radio"
                            name="viewType"
                            checked={viewType === "Contra"}
                            className="mr-1 pointer"
                            style={{
                                position: "relative",
                                top: "2px",
                            }}
                            onChange={(valueOption) => {
                                setViewType("Contra");
                            }}
                        />
                        <strong style={{ fontSize: "13px", color: "black" }}>Contra</strong>
                    </label>
                    <label className="mr-3">
                        <input
                            type="radio"
                            name="viewType"
                            checked={viewType === "InterCompanyTransferRequest"}
                            className="mr-1 pointer"
                            style={{ position: "relative", top: "2px" }}
                            onChange={(e) => {
                                setViewType("InterCompanyTransferRequest");
                            }}
                        />
                        <strong style={{ fontSize: "13px", color: "black" }}>Inter Company Transfer Request</strong>
                    </label>
                </div>
            </Box>

            {/* Tab Section */}
            {viewType === "Contra" && (
                <>
                    <FundTransferRequest viewType={viewType} />

                </>
            )}

            {/* Placeholder for "Inter Company Transfer Request" */}
            {viewType === "InterCompanyTransferRequest" && (
                <>
                    <BankJournalCreateForm />
                </>
            )}
        </Box>
    );
};

export default FundTransfer;
