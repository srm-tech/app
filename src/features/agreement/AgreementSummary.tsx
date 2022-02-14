import * as React from "react";

export default function AgreementSummary({ agreement }) {
  return (
    <div>
      <p>
        {agreement.commissionValue?.toLocaleString("en-AU", {
          style: "currency",
          currency: agreement.commissionCurrency || "AUD",
        })}
      </p>
      <p>for {agreement.commissionLabel}</p>
    </div>
  );
}
