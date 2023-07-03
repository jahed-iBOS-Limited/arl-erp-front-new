import React, { useEffect } from "react";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PartnerBank from "./collpaseComponent/partnerBank/partnerBank";
import PartnerPurchase from "./collpaseComponent/partnerPurchase/partnerPurchase";
import PartnerBasicInfo from "./collpaseComponent/partnerBasic/partnerBasic";
import PartnerSales from "./collpaseComponent/partnerSales/partnerSales";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";

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

export default function MainCollapsePanel() {
  const { state } = useLocation();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };
  const history = useHistory();
  const businessPartnerNameFromHistory =
    history?.location?.state?.businessPartnerName;
  const businessPartnerCodeFromHistory =
    history?.location?.state?.businessPartnerCode;

  const businessPartnerNameCollapsed = state?.tableData?.businessPartnerName;
  const businessPartnerCodeCollapsed = state?.tableData?.businessPartnerCode;

  useEffect(() => {
    if (state?.checkBox === "BasicInformation") {
      setExpanded("panel1");
    } else if (state?.checkBox === "BankInformation") {
      setExpanded("panel2");
    } else if (state?.checkBox === "PurchaseInformation") {
      setExpanded("panel3");
    } else if (state?.checkBox === "SalesInformation") {
      setExpanded("panel4");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ICustomCard
      title={`Business Partner Basic Info [${businessPartnerNameFromHistory ||
        businessPartnerNameCollapsed}-${businessPartnerCodeFromHistory ||
        businessPartnerCodeCollapsed}]`}
      backHandler={() =>
        history.push("/config/partner-management/partner-basic-info")
      }
    >
      <div className={classes.root}>
        {/* Partner Basic Information */}
        <ExpansionPanel
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Partner Basic Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <PartnerBasicInfo />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        {/* Partner Bank Information */}
        {/* changes as per miraj bhai's suggestion */}
        {/* {(state?.businessPartnerTypeName === "Supplier" ||
          state?.businessPartnerTypeName === "Customer") && (
          <ExpansionPanel
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                Partner Bank Information
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <PartnerBank />
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )} */}
        <ExpansionPanel
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Partner Bank Information
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <PartnerBank />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {/* Partner Purchase Information  */}
        {state?.businessPartnerTypeName === "Supplier" && (
          <ExpansionPanel
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Partner Purchase Information{" "}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <PartnerPurchase />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
        {/* Partner Sales Information  */}
        {(state?.businessPartnerTypeName === "Customer" ||
          state?.businessPartnerTypeName === "Customer's Ship To Party" ||
          state?.businessPartnerTypeName === "Employee") && (
            <ExpansionPanel
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography className={classes.heading}>
                  Partner Sales Information
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <PartnerSales />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
      </div>
    </ICustomCard>
  );
}
