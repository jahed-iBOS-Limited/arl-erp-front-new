import React from "react";
import ICustomCard from "../../_helper/_customCard";

function Help() {
  const fontSize = {
    fontSize: "20px",
  };
  return (
    <ICustomCard title="">
      <div style={fontSize}>
        <p>
          <span style={{ fontWeight: "700" }}>
            What is Strategic Objective?: Objectives
          </span>{" "}
          are prioritized by an organization through a thorough analysis of
          business practices such as a SWOT/PESTEL/Five Force analysis.
        </p>
        <p>
          <span style={{ fontWeight: "700" }}>
            What is meant by a Operational Objective?:
          </span>{" "}
          A specific result that a business aims to achieve within a time frame
          and with available resources.
        </p>
        <p>
          <span style={{ fontWeight: "700" }}>Strategic Initiatives:</span>{" "}
          Strategic initiatives are the means through which an organization
          translates its goals and visions into practice. Example: Raise brand
          awareness with a social-media campaign. Acquire or merge with a
          critical supplier of raw materials. Launch a strategy to reduce
          outsourcing. Open more customer-facing retail outlets. Its more of
          Corporate and SBU's level.
        </p>
        <p>
          <span style={{ fontWeight: "700" }}>
            Initiative: "a new plan or action to improve something or solve a
            problem"
          </span>
          . Examples: a marketing/costcutting initiative, a diplomatic/peace
          initiative. Training module development. Functional level.
        </p>
        <p>
          <span style={{ fontWeight: "700" }}>Projects:</span> A project is
          defined as{" "}
          <span style={{ fontWeight: "700" }}>
            "a piece of planned work or an activity which is done over a period
            of time and intended to achieve a particular purpose"
          </span>
          .
        </p>
        <p>
          <span style={{ fontWeight: "700" }}> Programs:</span> A program refers
          to multiple projects which are managed and delivered as a single
          package.
        </p>
        <p>
          <span style={{ fontWeight: "700" }}> Milestone:</span> Main
          task/stages within a project. Example: Complete 50% of the trainings
          by 30 June
        </p>

        <p>
          <span style={{ fontWeight: "700" }}>Action Plan:</span> An Action Plan
          is{" "}
          <span style={{ fontWeight: "700" }}>
            a list of tasks that you need to do to complete a simple project or
            objective.
          </span>{" "}
          Individual level.
        </p>
      </div>
    </ICustomCard>
  );
}

export default Help;
