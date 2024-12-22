import { Box, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import FundTransferRequest from "./fundTransferRequest";

const FundTransfer = () => {
    const [activeTab, setActiveTab] = useState("fundTransferRequest");

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Tabs
                value={activeTab}
                onChange={handleChange}
                variant="scrollable"
                indicatorColor="primary"
                textColor="primary"
                style={{ backgroundColor: "white" }}
            >
                <Tab label="FUND TRANSFER REQUEST" value="fundTransferRequest" />
                <Tab label="FUND TRANSFER OUT" value="fundTransferOut" />
            </Tabs>
            <Box mt={1}>
                {activeTab === "fundTransferRequest" && (
                    <FundTransferRequest activeTab={activeTab}/>
                )}
                {activeTab === "fundTransferOut" && (
                    <div>
                        {/* Add your Fund Transfer Out component here */}
                        <p>Fund Transfer Out Content</p>
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default FundTransfer;
