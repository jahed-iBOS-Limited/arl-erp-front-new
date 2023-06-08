import React, { useEffect } from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useLocation } from "react-router-dom";
import ICustomCard from "../../../_helper/_customCard";
import BasicInformation from "./landingCollapse/basicInformation/form/addEditForm";
import CostSummary from "./landingCollapse/costSummary/form/addEditForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function LCSummaryCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("false");
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };

  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === "insuranceInformation") {
      setExpanded("panel2");
    } else if (state?.checkbox === "shipmentWisePolicy") {
      setExpanded("panel3");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);


  return (
    <div className={classes.root}>
      <ICustomCard
        title="LC Summary"
        // backHandler={backHandler}
      >
        {/* Basic Information */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>
              Basic Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <BasicInformation />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {/* Shipment Wise Policy */}
        <ExpansionPanel
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.heading}>
              Cost Summary (BDT)
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <CostSummary />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </ICustomCard>
    </div>
  );
}
