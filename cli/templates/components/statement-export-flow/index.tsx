import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { Input } from "../input";
import { RadioGroup } from "../radio-group";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import type { StatementAccountOption, StatementExportFlowProps } from "../types";

const DEFAULT_ACCOUNTS: StatementAccountOption[] = [
  { id: "acc-usd", label: "Primary Checking", mask: "•••• 4410", currency: "USD" },
  { id: "acc-eur", label: "Euro Operating", mask: "•••• 9921", currency: "EUR" },
  { id: "acc-sav", label: "Treasury Reserve", mask: "•••• 1108", currency: "USD" },
];

type ExportStatus = "selecting" | "generating" | "ready" | "error";

const IconFileText = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </svg>
);

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />
  </svg>
);

export const StatementExportFlow = React.forwardRef<HTMLDivElement, StatementExportFlowProps>(
  (
    {
      title = "Export account statement",
      accountType: initialAccountType = "personal",
      accounts = DEFAULT_ACCOUNTS,
      defaultEmail = "finance@company.com",
      onExport,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [accountId, setAccountId] = useState<string>(accounts[0]?.id || "");
    const [dateRange, setDateRange] = useState<string>("last_30_days");
    const [customStart, setCustomStart] = useState<string>("2026-10-01");
    const [customEnd, setCustomEnd] = useState<string>("2026-10-31");
    const [format, setFormat] = useState<"pdf" | "csv">("pdf");
    const [delivery, setDelivery] = useState<"download" | "email">("download");
    const [email, setEmail] = useState<string>(defaultEmail);
    const [status, setStatus] = useState<ExportStatus>("selecting");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [generatedFileName, setGeneratedFileName] = useState<string>("");

    const selectedAccount = accounts.find((a) => a.id === accountId) || accounts[0];

    const resetFlow = (nextType: "personal" | "business" = accountType) => {
      setAccountType(nextType);
      setStatus("selecting");
      setErrorMessage("");
      setGeneratedFileName("");
    };

    const handleGenerate = () => {
      setErrorMessage("");
      if (!selectedAccount) {
        setStatus("error");
        setErrorMessage("Select an account to export.");
        return;
      }
      if (dateRange === "custom" && (!customStart.trim() || !customEnd.trim() || customEnd < customStart)) {
        setStatus("error");
        setErrorMessage("Provide a valid custom start and end date (YYYY-MM-DD).");
        return;
      }
      if (delivery === "email" && !email.includes("@")) {
        setStatus("error");
        setErrorMessage("Enter a valid recipient email address.");
        return;
      }

      setStatus("generating");
      const rangeSlug = dateRange === "custom" ? `${customStart}_${customEnd}` : dateRange;
      const fileName = `statement-${selectedAccount.currency.toLowerCase()}-${rangeSlug}.${format}`;
      setGeneratedFileName(fileName);
      setStatus("ready");

      onExport?.({
        accountId: selectedAccount.id,
        dateRange: rangeSlug,
        format,
        delivery,
        email: delivery === "email" ? email : undefined,
        fileName,
      });
    };

    return (
      <div
        ref={ref}
        className={["fc-statement-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-statement-flow__header">
              <span>{title}</span>
              <Badge variant={status === "ready" ? "success" : "info"}>
                {status === "ready" ? "File ready" : format.toUpperCase()}
              </Badge>
            </div>
          }
          description="Generate official PDF bank statements or CSV ledgers for accounting."
          footer={
            <div className="fc-statement-flow__actions">
              {status !== "ready" ? (
                <>
                  <Button variant="ghost" onClick={() => resetFlow()}>
                    <span className="fc-statement-flow__btn-inner">
                      <IconRefresh /> Reset
                    </span>
                  </Button>
                  <div className="fc-statement-flow__actions-right">
                    <Button variant="primary" onClick={handleGenerate} disabled={status === "generating"}>
                      <span className="fc-statement-flow__btn-inner">
                        <IconFileText /> {status === "generating" ? "Generating..." : "Generate"}
                      </span>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => resetFlow()}>
                    <span className="fc-statement-flow__btn-inner">
                      <IconRefresh /> Reset
                    </span>
                  </Button>
                  <div className="fc-statement-flow__actions-right">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        onExport?.({
                          accountId: selectedAccount.id,
                          dateRange,
                          format,
                          delivery: "email",
                          email,
                          fileName: generatedFileName,
                        })
                      }
                    >
                      <span className="fc-statement-flow__btn-inner">
                        <IconMail /> Email
                      </span>
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() =>
                        onExport?.({
                          accountId: selectedAccount.id,
                          dateRange,
                          format,
                          delivery: "download",
                          fileName: generatedFileName,
                        })
                      }
                    >
                      <span className="fc-statement-flow__btn-inner">
                        <IconDownload /> Download
                      </span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          }
        >
          <div className="fc-statement-flow__stack">
            <div className="fc-statement-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => resetFlow(val as "personal" | "business")}
              >
                <TabsList aria-label="Statement format profile">
                  <TabsTrigger value="personal">Personal statements</TabsTrigger>
                  <TabsTrigger value="business">Business audit pack</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {status === "error" && errorMessage ? (
              <Alert variant="error" title="Export could not start">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "ready" ? (
              <Alert variant="success" title="Statement generated">
                {generatedFileName} is ready for {selectedAccount?.label} ({selectedAccount?.mask}).{" "}
                {delivery === "email" ? `Sent a copy to ${email}.` : "Click Download below to save locally."}
              </Alert>
            ) : (
              <div className="fc-statement-flow__stack">
                <div className="fc-statement-flow__grid-2">
                  <Select
                    label="Select account"
                    id={`${baseId}-account`}
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.label} ({acc.mask}) · {acc.currency}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Date range"
                    id={`${baseId}-range`}
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="last_30_days">Last 30 days</option>
                    <option value="last_quarter">Previous quarter</option>
                    <option value="ytd">Year to date</option>
                    <option value="custom">Custom date range</option>
                  </Select>
                </div>

                {dateRange === "custom" ? (
                  <div className="fc-statement-flow__grid-2">
                    <Input
                      label="Start date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                    <Input
                      label="End date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                ) : null}

                <div className="fc-statement-flow__grid-2">
                  <RadioGroup
                    label="File format"
                    name={`${baseId}-format`}
                    value={format}
                    onChange={(val) => setFormat(val as "pdf" | "csv")}
                    options={[
                      { label: "Signed PDF statement", value: "pdf" },
                      { label: "CSV ledger export", value: "csv" },
                    ]}
                  />
                  <RadioGroup
                    label="Delivery method"
                    name={`${baseId}-delivery`}
                    value={delivery}
                    onChange={(val) => setDelivery(val as "download" | "email")}
                    options={[
                      { label: "Direct download", value: "download" },
                      { label: "Send via email", value: "email" },
                    ]}
                  />
                </div>

                {delivery === "email" ? (
                  <Input
                    label="Recipient email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="accounting@acme.com"
                  />
                ) : null}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  },
);

StatementExportFlow.displayName = "StatementExportFlow";
export default StatementExportFlow;
