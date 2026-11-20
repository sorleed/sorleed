import React, { useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { Input } from "../input";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { Tooltip } from "../tooltip";
import { TransferLimitMeter } from "../transfer-limit-meter";
import { WalletCard } from "../wallet-card";
import type { CardManagementFlowProps, ManagedCardStatus } from "../types";

type FlowState = "viewing" | "confirming" | "processing" | "success" | "error";
type PendingAction = "activate" | "freeze" | "unfreeze" | "set_limit" | "replace" | null;

const IconSnowflake = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="2" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="22" />
    <path d="m20 16-4-4 4-4" /><path d="m4 8 4 4-4 4" /><path d="m16 4-4 4-4-4" /><path d="m8 20 4-4 4 4" />
  </svg>
);

const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const IconSliders = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    <circle cx="9" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="11" cy="18" r="2" />
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />
  </svg>
);

const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

export const CardManagementFlow = React.forwardRef<HTMLDivElement, CardManagementFlowProps>(
  (
    {
      title = "Manage your card",
      accountType: initialAccountType = "personal",
      brand = "Visa Debit",
      cardNumber = "4532 •••• •••• 8841",
      cardHolder = "ALEX RIVERA",
      expiry = "09/29",
      cvv = "482",
      currency = "USD",
      initialStatus = "active",
      dailyLimit: initialDailyLimit = 2500,
      monthlyLimit: initialMonthlyLimit = 15000,
      usedToday = 640,
      onCardAction,
      className,
      ...props
    },
    ref,
  ) => {
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [cardStatus, setCardStatus] = useState<ManagedCardStatus>(initialStatus);
    const [flowState, setFlowState] = useState<FlowState>("viewing");
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [dailyLimit, setDailyLimit] = useState<number>(initialDailyLimit);
    const [draftLimit, setDraftLimit] = useState<string>(String(initialDailyLimit));
    const [lastFour, setLastFour] = useState<string>("8841");
    const [replaceReason, setReplaceReason] = useState<string>("damaged");
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");

    const displayedCardNumber = `4532 •••• •••• ${lastFour}`;
    const displayedHolder = accountType === "business" ? `${cardHolder} · CORP` : cardHolder;

    const statusBadgeVariant =
      cardStatus === "active"
        ? "success"
        : cardStatus === "frozen"
          ? "warning"
          : cardStatus === "replacing"
            ? "info"
            : "default";

    const monthlyLimitForPath = () =>
      accountType === "business" ? Math.max(initialMonthlyLimit, 50000) : initialMonthlyLimit;

    const startConfirm = (action: Exclude<PendingAction, null>) => {
      setFeedbackMessage("");
      setPendingAction(action);
      if (action === "set_limit") {
        setDraftLimit(String(dailyLimit));
      }
      setFlowState("confirming");
    };

    const handleCancelAction = () => {
      setPendingAction(null);
      setFeedbackMessage("");
      setFlowState("viewing");
    };

    const handleConfirmAction = async () => {
      if (!pendingAction) return;
      if (pendingAction === "set_limit") {
        const parsed = Number(draftLimit);
        if (!parsed || parsed < 100 || parsed > monthlyLimitForPath()) {
          setFlowState("error");
          setFeedbackMessage(
            `Daily limit must be between ${currency} 100 and ${currency} ${monthlyLimitForPath().toLocaleString()}.`,
          );
          return;
        }
      }

      setFlowState("processing");
      try {
        const parsed = Number(draftLimit);
        const ok = await onCardAction?.({
          action: pendingAction,
          limit: pendingAction === "set_limit" ? parsed : undefined,
          reason: pendingAction === "replace" ? replaceReason : undefined,
        });
        if (ok === false) {
          setFlowState("error");
          setFeedbackMessage("Card network declined this update. Retry in a moment.");
          return;
        }

        if (pendingAction === "activate") {
          setCardStatus("active");
          setLastFour("8841");
          setFeedbackMessage("Your card is now activated for contactless, online, and ATM transactions.");
        } else if (pendingAction === "freeze") {
          setCardStatus("frozen");
          setFeedbackMessage("Card temporarily frozen. Recurring charges stay paused until unfrozen.");
        } else if (pendingAction === "unfreeze") {
          setCardStatus("active");
          setFeedbackMessage("Card unfrozen and ready for use.");
        } else if (pendingAction === "set_limit") {
          setDailyLimit(parsed);
          setFeedbackMessage(`Daily spending limit updated to ${currency} ${parsed.toLocaleString()}.`);
        } else if (pendingAction === "replace") {
          setCardStatus("replacing");
          setLastFour("3914");
          setFeedbackMessage(
            `Replacement virtual card ending in 3914 issued immediately (reason: ${replaceReason}).`,
          );
        }

        setPendingAction(null);
        setFlowState("success");
      } catch {
        setFlowState("error");
        setFeedbackMessage("Could not update card settings. Please try again.");
      }
    };

    return (
      <div
        ref={ref}
        className={["fc-card-mgmt-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-card-mgmt-flow__header">
              <span>{title}</span>
              <Badge variant={statusBadgeVariant}>{cardStatus}</Badge>
            </div>
          }
          description="Inspect card details, adjust spending caps, freeze/unfreeze, or order a replacement."
          footer={
            <div className="fc-card-mgmt-flow__actions">
              {flowState === "confirming" ? (
                <>
                  <Button variant="ghost" onClick={handleCancelAction}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleConfirmAction}>
                    Confirm
                  </Button>
                </>
              ) : (
                <>
                  <span />
                  {flowState === "success" || flowState === "error" ? (
                    <Button variant="secondary" onClick={() => setFlowState("viewing")}>
                      Done
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          }
        >
          <div className="fc-card-mgmt-flow__stack">
            <div className="fc-card-mgmt-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => setAccountType(val as "personal" | "business")}
              >
                <TabsList aria-label="Card program">
                  <TabsTrigger value="personal">Personal card</TabsTrigger>
                  <TabsTrigger value="business">Business team card</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tooltip content={isFlipped ? "Hide CVV" : "Reveal CVV on card back"}>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={isFlipped ? "Show card front" : "Show CVV"}
                  onClick={() => setIsFlipped((f) => !f)}
                >
                  <span className="fc-card-mgmt-flow__btn-inner">
                    <IconEye /> {isFlipped ? "Show front" : "Show CVV"}
                  </span>
                </Button>
              </Tooltip>
            </div>

            <div className="fc-card-mgmt-flow__card-wrap" aria-live="polite">
              <div
                className={[
                  "fc-card-mgmt-flow__card-frame",
                  cardStatus === "frozen" ? "fc-card-mgmt-flow__card-frame--frozen" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <WalletCard
                  brand={brand}
                  cardNumber={cardNumber === "4532 •••• •••• 8841" ? displayedCardNumber : cardNumber}
                  cardHolder={displayedHolder}
                  expiry={expiry}
                  cvv={cvv}
                  isFlipped={isFlipped}
                  onFlip={setIsFlipped}
                />
                {cardStatus === "frozen" ? (
                  <div className="fc-card-mgmt-flow__frost-overlay" aria-label="Card is frozen">
                    <div className="fc-card-mgmt-flow__frost-pill">
                      <IconSnowflake />
                      <span>Card Frozen</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="fc-card-mgmt-flow__icon-bar" role="toolbar" aria-label="Card quick actions">
                {cardStatus === "inactive" || cardStatus === "replacing" ? (
                  <Tooltip content="Activate card">
                    <Button
                      variant="primary"
                      size="sm"
                      aria-label="Activate card"
                      onClick={() => startConfirm("activate")}
                    >
                      <span className="fc-card-mgmt-flow__btn-inner">
                        <IconZap /> Activate
                      </span>
                    </Button>
                  </Tooltip>
                ) : null}

                {cardStatus === "frozen" ? (
                  <Tooltip content="Unfreeze card">
                    <Button
                      variant="primary"
                      size="sm"
                      aria-label="Unfreeze card"
                      onClick={() => startConfirm("unfreeze")}
                    >
                      <span className="fc-card-mgmt-flow__btn-inner">
                        <IconSun /> Unfreeze
                      </span>
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip content="Freeze card">
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label="Freeze card"
                      onClick={() => startConfirm("freeze")}
                    >
                      <IconSnowflake />
                    </Button>
                  </Tooltip>
                )}

                <Tooltip content="Set daily spend limit">
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label="Set daily limit"
                    onClick={() => startConfirm("set_limit")}
                  >
                    <IconSliders />
                  </Button>
                </Tooltip>

                <Tooltip content="Order replacement card">
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label="Order replacement"
                    onClick={() => startConfirm("replace")}
                  >
                    <IconRefresh />
                  </Button>
                </Tooltip>
              </div>
            </div>

            <TransferLimitMeter
              title="Card spend limit"
              limits={[
                {
                  id: "daily-spend",
                  label: "Daily spend",
                  used: usedToday,
                  max: dailyLimit,
                  currency,
                },
                {
                  id: "monthly-cycle",
                  label: "Monthly cycle",
                  used: usedToday * 4,
                  max: monthlyLimitForPath(),
                  currency,
                },
              ]}
            />

            {flowState === "success" && feedbackMessage ? (
              <Alert variant="success" title="Card updated">
                {feedbackMessage}
              </Alert>
            ) : null}

            {flowState === "error" && feedbackMessage ? (
              <Alert variant="error" title="Update failed">
                {feedbackMessage}
              </Alert>
            ) : null}

            {flowState === "confirming" && pendingAction ? (
              <div className="fc-card-mgmt-flow__summary-box">
                {pendingAction === "set_limit" ? (
                  <Input
                    label={`New daily spending cap (${currency})`}
                    type="text" inputMode="decimal"
                    value={draftLimit}
                    onChange={(e) => setDraftLimit(e.target.value)}
                    helperText={`Between ${currency} 100 and ${currency} ${monthlyLimitForPath().toLocaleString()}`}
                  />
                ) : pendingAction === "replace" ? (
                  <Select
                    label="Replacement reason"
                    value={replaceReason}
                    onChange={(e) => setReplaceReason(e.target.value)}
                  >
                    <option value="damaged">Card damaged or worn</option>
                    <option value="lost">Lost card</option>
                    <option value="compromised">Suspected unauthorized charge</option>
                  </Select>
                ) : (
                  <Alert variant="info" title={`Confirm card ${pendingAction}`}>
                    {pendingAction === "freeze"
                      ? "Freezing blocks all new POS and online card charges immediately."
                      : pendingAction === "unfreeze"
                        ? "Unfreezing restores all active spending permissions on this card."
                        : "Activate this card so it can process online and in-person payments."}
                  </Alert>
                )}
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

CardManagementFlow.displayName = "CardManagementFlow";
export default CardManagementFlow;
