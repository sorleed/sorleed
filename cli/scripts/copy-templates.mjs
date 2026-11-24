import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(cliRoot, '..');
const templatesDir = path.resolve(cliRoot, 'templates');

// Source -> Template destination map
export const templateManifest = [
  // button
  {
    source: path.resolve(repoRoot, "react/button/index.tsx"),
    dest: path.resolve(templatesDir, "components/button/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/button/button.css"),
    dest: path.resolve(templatesDir, "styles/button.css")
  },
  // input
  {
    source: path.resolve(repoRoot, "react/input/index.tsx"),
    dest: path.resolve(templatesDir, "components/input/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/input/input.css"),
    dest: path.resolve(templatesDir, "styles/input.css")
  },
  // password-input
  {
    source: path.resolve(repoRoot, "react/password-input/index.tsx"),
    dest: path.resolve(templatesDir, "components/password-input/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/password-input/password-input.css"),
    dest: path.resolve(templatesDir, "styles/password-input.css")
  },
  // phone-input
  {
    source: path.resolve(repoRoot, "react/phone-input/index.tsx"),
    dest: path.resolve(templatesDir, "components/phone-input/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/phone-input/phone-input.css"),
    dest: path.resolve(templatesDir, "styles/phone-input.css")
  },
  // select
  {
    source: path.resolve(repoRoot, "react/select/index.tsx"),
    dest: path.resolve(templatesDir, "components/select/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/select/select.css"),
    dest: path.resolve(templatesDir, "styles/select.css")
  },
  // checkbox
  {
    source: path.resolve(repoRoot, "react/checkbox/index.tsx"),
    dest: path.resolve(templatesDir, "components/checkbox/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/checkbox/checkbox.css"),
    dest: path.resolve(templatesDir, "styles/checkbox.css")
  },
  // radio-group
  {
    source: path.resolve(repoRoot, "react/radio-group/index.tsx"),
    dest: path.resolve(templatesDir, "components/radio-group/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/radio-group/radio-group.css"),
    dest: path.resolve(templatesDir, "styles/radio-group.css")
  },
  // textarea
  {
    source: path.resolve(repoRoot, "react/textarea/index.tsx"),
    dest: path.resolve(templatesDir, "components/textarea/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/textarea/textarea.css"),
    dest: path.resolve(templatesDir, "styles/textarea.css")
  },
  // otp
  {
    source: path.resolve(repoRoot, "react/otp/index.tsx"),
    dest: path.resolve(templatesDir, "components/otp/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/otp/otp.css"),
    dest: path.resolve(templatesDir, "styles/otp.css")
  },
  // currency
  {
    source: path.resolve(repoRoot, "react/currency/index.tsx"),
    dest: path.resolve(templatesDir, "components/currency/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/currency/currency.css"),
    dest: path.resolve(templatesDir, "styles/currency.css")
  },
  // cvv
  {
    source: path.resolve(repoRoot, "react/cvv/index.tsx"),
    dest: path.resolve(templatesDir, "components/cvv/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/cvv/cvv.css"),
    dest: path.resolve(templatesDir, "styles/cvv.css")
  },
  // date-picker
  {
    source: path.resolve(repoRoot, "react/date-picker/index.tsx"),
    dest: path.resolve(templatesDir, "components/date-picker/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/date-picker/date-picker.css"),
    dest: path.resolve(templatesDir, "styles/date-picker.css")
  },
  // card
  {
    source: path.resolve(repoRoot, "react/card/index.tsx"),
    dest: path.resolve(templatesDir, "components/card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/card/card.css"),
    dest: path.resolve(templatesDir, "styles/card.css")
  },
  // alert
  {
    source: path.resolve(repoRoot, "react/alert/index.tsx"),
    dest: path.resolve(templatesDir, "components/alert/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/alert/alert.css"),
    dest: path.resolve(templatesDir, "styles/alert.css")
  },
  // tabs
  {
    source: path.resolve(repoRoot, "react/tabs/index.tsx"),
    dest: path.resolve(templatesDir, "components/tabs/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/tabs/tabs.css"),
    dest: path.resolve(templatesDir, "styles/tabs.css")
  },
  // table
  {
    source: path.resolve(repoRoot, "react/table/index.tsx"),
    dest: path.resolve(templatesDir, "components/table/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/table/table.css"),
    dest: path.resolve(templatesDir, "styles/table.css")
  },
  // badge
  {
    source: path.resolve(repoRoot, "react/badge/index.tsx"),
    dest: path.resolve(templatesDir, "components/badge/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/badge/badge.css"),
    dest: path.resolve(templatesDir, "styles/badge.css")
  },
  // switch
  {
    source: path.resolve(repoRoot, "react/switch/index.tsx"),
    dest: path.resolve(templatesDir, "components/switch/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/switch/switch.css"),
    dest: path.resolve(templatesDir, "styles/switch.css")
  },
  // tooltip
  {
    source: path.resolve(repoRoot, "react/tooltip/index.tsx"),
    dest: path.resolve(templatesDir, "components/tooltip/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/tooltip/tooltip.css"),
    dest: path.resolve(templatesDir, "styles/tooltip.css")
  },
  // popover
  {
    source: path.resolve(repoRoot, "react/popover/index.tsx"),
    dest: path.resolve(templatesDir, "components/popover/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/popover/popover.css"),
    dest: path.resolve(templatesDir, "styles/popover.css")
  },
  // drawer
  {
    source: path.resolve(repoRoot, "react/drawer/index.tsx"),
    dest: path.resolve(templatesDir, "components/drawer/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/drawer/drawer.css"),
    dest: path.resolve(templatesDir, "styles/drawer.css")
  },
  // divider
  {
    source: path.resolve(repoRoot, "react/divider/index.tsx"),
    dest: path.resolve(templatesDir, "components/divider/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/divider/divider.css"),
    dest: path.resolve(templatesDir, "styles/divider.css")
  },
  // transaction-item
  {
    source: path.resolve(repoRoot, "react/transaction-item/index.tsx"),
    dest: path.resolve(templatesDir, "components/transaction-item/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/transaction-item/transaction-item.css"),
    dest: path.resolve(templatesDir, "styles/transaction-item.css")
  },
  // balance-card
  {
    source: path.resolve(repoRoot, "react/balance-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/balance-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/balance-card/balance-card.css"),
    dest: path.resolve(templatesDir, "styles/balance-card.css")
  },
  // amount-display
  {
    source: path.resolve(repoRoot, "react/amount-display/index.tsx"),
    dest: path.resolve(templatesDir, "components/amount-display/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/amount-display/amount-display.css"),
    dest: path.resolve(templatesDir, "styles/amount-display.css")
  },
  // status-indicator
  {
    source: path.resolve(repoRoot, "react/status-indicator/index.tsx"),
    dest: path.resolve(templatesDir, "components/status-indicator/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/status-indicator/status-indicator.css"),
    dest: path.resolve(templatesDir, "styles/status-indicator.css")
  },
  // stack
  {
    source: path.resolve(repoRoot, "react/stack/index.tsx"),
    dest: path.resolve(templatesDir, "components/stack/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/stack/stack.css"),
    dest: path.resolve(templatesDir, "styles/stack.css")
  },
  // inline
  {
    source: path.resolve(repoRoot, "react/inline/index.tsx"),
    dest: path.resolve(templatesDir, "components/inline/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/inline/inline.css"),
    dest: path.resolve(templatesDir, "styles/inline.css")
  },
  // container
  {
    source: path.resolve(repoRoot, "react/container/index.tsx"),
    dest: path.resolve(templatesDir, "components/container/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/container/container.css"),
    dest: path.resolve(templatesDir, "styles/container.css")
  },
  // avatar
  {
    source: path.resolve(repoRoot, "react/avatar/index.tsx"),
    dest: path.resolve(templatesDir, "components/avatar/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/avatar/avatar.css"),
    dest: path.resolve(templatesDir, "styles/avatar.css")
  },
  // modal
  {
    source: path.resolve(repoRoot, "react/modal/index.tsx"),
    dest: path.resolve(templatesDir, "components/modal/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/modal/modal.css"),
    dest: path.resolve(templatesDir, "styles/modal.css")
  },
  // toast
  {
    source: path.resolve(repoRoot, "react/toast/index.tsx"),
    dest: path.resolve(templatesDir, "components/toast/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/toast/toast.css"),
    dest: path.resolve(templatesDir, "styles/toast.css")
  },
  // pin-input
  {
    source: path.resolve(repoRoot, "react/pin-input/index.tsx"),
    dest: path.resolve(templatesDir, "components/pin-input/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/pin-input/pin-input.css"),
    dest: path.resolve(templatesDir, "styles/pin-input.css")
  },
  // bank-selector
  {
    source: path.resolve(repoRoot, "react/bank-selector/index.tsx"),
    dest: path.resolve(templatesDir, "components/bank-selector/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/bank-selector/bank-selector.css"),
    dest: path.resolve(templatesDir, "styles/bank-selector.css")
  },
  // wallet-card
  {
    source: path.resolve(repoRoot, "react/wallet-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/wallet-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/wallet-card/wallet-card.css"),
    dest: path.resolve(templatesDir, "styles/wallet-card.css")
  },
  // account-summary
  {
    source: path.resolve(repoRoot, "react/account-summary/index.tsx"),
    dest: path.resolve(templatesDir, "components/account-summary/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/account-summary/account-summary.css"),
    dest: path.resolve(templatesDir, "styles/account-summary.css")
  },
  // transfer-receipt
  {
    source: path.resolve(repoRoot, "react/transfer-receipt/index.tsx"),
    dest: path.resolve(templatesDir, "components/transfer-receipt/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/transfer-receipt/transfer-receipt.css"),
    dest: path.resolve(templatesDir, "styles/transfer-receipt.css")
  },
  // currency-exchange
  {
    source: path.resolve(repoRoot, "react/currency-exchange/index.tsx"),
    dest: path.resolve(templatesDir, "components/currency-exchange/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/currency-exchange/currency-exchange.css"),
    dest: path.resolve(templatesDir, "styles/currency-exchange.css")
  },
  // fee-breakdown
  {
    source: path.resolve(repoRoot, "react/fee-breakdown/index.tsx"),
    dest: path.resolve(templatesDir, "components/fee-breakdown/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/fee-breakdown/fee-breakdown.css"),
    dest: path.resolve(templatesDir, "styles/fee-breakdown.css")
  },
  // skeleton
  {
    source: path.resolve(repoRoot, "react/skeleton/index.tsx"),
    dest: path.resolve(templatesDir, "components/skeleton/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/skeleton/skeleton.css"),
    dest: path.resolve(templatesDir, "styles/skeleton.css")
  },
  // empty-state
  {
    source: path.resolve(repoRoot, "react/empty-state/index.tsx"),
    dest: path.resolve(templatesDir, "components/empty-state/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/empty-state/empty-state.css"),
    dest: path.resolve(templatesDir, "styles/empty-state.css")
  },
  // loan-calculator
  {
    source: path.resolve(repoRoot, "react/loan-calculator/index.tsx"),
    dest: path.resolve(templatesDir, "components/loan-calculator/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/loan-calculator/loan-calculator.css"),
    dest: path.resolve(templatesDir, "styles/loan-calculator.css")
  },
  // credit-score-gauge
  {
    source: path.resolve(repoRoot, "react/credit-score-gauge/index.tsx"),
    dest: path.resolve(templatesDir, "components/credit-score-gauge/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/credit-score-gauge/credit-score-gauge.css"),
    dest: path.resolve(templatesDir, "styles/credit-score-gauge.css")
  },
  // portfolio-summary
  {
    source: path.resolve(repoRoot, "react/portfolio-summary/index.tsx"),
    dest: path.resolve(templatesDir, "components/portfolio-summary/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/portfolio-summary/portfolio-summary.css"),
    dest: path.resolve(templatesDir, "styles/portfolio-summary.css")
  },
  // spending-meter
  {
    source: path.resolve(repoRoot, "react/spending-meter/index.tsx"),
    dest: path.resolve(templatesDir, "components/spending-meter/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/spending-meter/spending-meter.css"),
    dest: path.resolve(templatesDir, "styles/spending-meter.css")
  },
  // kyc-doc-uploader
  {
    source: path.resolve(repoRoot, "react/kyc-doc-uploader/index.tsx"),
    dest: path.resolve(templatesDir, "components/kyc-doc-uploader/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/kyc-doc-uploader/kyc-doc-uploader.css"),
    dest: path.resolve(templatesDir, "styles/kyc-doc-uploader.css")
  },
  // card-controls
  {
    source: path.resolve(repoRoot, "react/card-controls/index.tsx"),
    dest: path.resolve(templatesDir, "components/card-controls/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/card-controls/card-controls.css"),
    dest: path.resolve(templatesDir, "styles/card-controls.css")
  },
  // repayment-schedule
  {
    source: path.resolve(repoRoot, "react/repayment-schedule/index.tsx"),
    dest: path.resolve(templatesDir, "components/repayment-schedule/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/repayment-schedule/repayment-schedule.css"),
    dest: path.resolve(templatesDir, "styles/repayment-schedule.css")
  },
  // asset-allocation
  {
    source: path.resolve(repoRoot, "react/asset-allocation/index.tsx"),
    dest: path.resolve(templatesDir, "components/asset-allocation/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/asset-allocation/asset-allocation.css"),
    dest: path.resolve(templatesDir, "styles/asset-allocation.css")
  },
  // pagination
  {
    source: path.resolve(repoRoot, "react/pagination/index.tsx"),
    dest: path.resolve(templatesDir, "components/pagination/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/pagination/pagination.css"),
    dest: path.resolve(templatesDir, "styles/pagination.css")
  },
  // accordion
  {
    source: path.resolve(repoRoot, "react/accordion/index.tsx"),
    dest: path.resolve(templatesDir, "components/accordion/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/accordion/accordion.css"),
    dest: path.resolve(templatesDir, "styles/accordion.css")
  },
  // biometric-auth-prompt
  {
    source: path.resolve(repoRoot, "react/biometric-auth-prompt/index.tsx"),
    dest: path.resolve(templatesDir, "components/biometric-auth-prompt/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/biometric-auth-prompt/biometric-auth-prompt.css"),
    dest: path.resolve(templatesDir, "styles/biometric-auth-prompt.css")
  },
  // virtual-card-generator
  {
    source: path.resolve(repoRoot, "react/virtual-card-generator/index.tsx"),
    dest: path.resolve(templatesDir, "components/virtual-card-generator/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/virtual-card-generator/virtual-card-generator.css"),
    dest: path.resolve(templatesDir, "styles/virtual-card-generator.css")
  },
  // split-bill-calculator
  {
    source: path.resolve(repoRoot, "react/split-bill-calculator/index.tsx"),
    dest: path.resolve(templatesDir, "components/split-bill-calculator/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/split-bill-calculator/split-bill-calculator.css"),
    dest: path.resolve(templatesDir, "styles/split-bill-calculator.css")
  },
  // yield-curve-table
  {
    source: path.resolve(repoRoot, "react/yield-curve-table/index.tsx"),
    dest: path.resolve(templatesDir, "components/yield-curve-table/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/yield-curve-table/yield-curve-table.css"),
    dest: path.resolve(templatesDir, "styles/yield-curve-table.css")
  },
  // direct-debit-mandate
  {
    source: path.resolve(repoRoot, "react/direct-debit-mandate/index.tsx"),
    dest: path.resolve(templatesDir, "components/direct-debit-mandate/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/direct-debit-mandate/direct-debit-mandate.css"),
    dest: path.resolve(templatesDir, "styles/direct-debit-mandate.css")
  },
  // invoice-viewer
  {
    source: path.resolve(repoRoot, "react/invoice-viewer/index.tsx"),
    dest: path.resolve(templatesDir, "components/invoice-viewer/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/invoice-viewer/invoice-viewer.css"),
    dest: path.resolve(templatesDir, "styles/invoice-viewer.css")
  },
  // expense-receipt-uploader
  {
    source: path.resolve(repoRoot, "react/expense-receipt-uploader/index.tsx"),
    dest: path.resolve(templatesDir, "components/expense-receipt-uploader/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/expense-receipt-uploader/expense-receipt-uploader.css"),
    dest: path.resolve(templatesDir, "styles/expense-receipt-uploader.css")
  },
  // journal-entry-ledger
  {
    source: path.resolve(repoRoot, "react/journal-entry-ledger/index.tsx"),
    dest: path.resolve(templatesDir, "components/journal-entry-ledger/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/journal-entry-ledger/journal-entry-ledger.css"),
    dest: path.resolve(templatesDir, "styles/journal-entry-ledger.css")
  },
  // tax-summary-card
  {
    source: path.resolve(repoRoot, "react/tax-summary-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/tax-summary-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/tax-summary-card/tax-summary-card.css"),
    dest: path.resolve(templatesDir, "styles/tax-summary-card.css")
  },
  // chart-of-accounts-tree
  {
    source: path.resolve(repoRoot, "react/chart-of-accounts-tree/index.tsx"),
    dest: path.resolve(templatesDir, "components/chart-of-accounts-tree/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/chart-of-accounts-tree/chart-of-accounts-tree.css"),
    dest: path.resolve(templatesDir, "styles/chart-of-accounts-tree.css")
  },
  // iban-account-details
  {
    source: path.resolve(repoRoot, "react/iban-account-details/index.tsx"),
    dest: path.resolve(templatesDir, "components/iban-account-details/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/iban-account-details/iban-account-details.css"),
    dest: path.resolve(templatesDir, "styles/iban-account-details.css")
  },
  // beneficiary-picker
  {
    source: path.resolve(repoRoot, "react/beneficiary-picker/index.tsx"),
    dest: path.resolve(templatesDir, "components/beneficiary-picker/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/beneficiary-picker/beneficiary-picker.css"),
    dest: path.resolve(templatesDir, "styles/beneficiary-picker.css")
  },
  // transfer-limit-meter
  {
    source: path.resolve(repoRoot, "react/transfer-limit-meter/index.tsx"),
    dest: path.resolve(templatesDir, "components/transfer-limit-meter/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/transfer-limit-meter/transfer-limit-meter.css"),
    dest: path.resolve(templatesDir, "styles/transfer-limit-meter.css")
  },
  // standing-order-card
  {
    source: path.resolve(repoRoot, "react/standing-order-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/standing-order-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/standing-order-card/standing-order-card.css"),
    dest: path.resolve(templatesDir, "styles/standing-order-card.css")
  },
  // kyc-verification-flow
  {
    source: path.resolve(repoRoot, "react/kyc-verification-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/kyc-verification-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/kyc-verification-flow/kyc-verification-flow.css"),
    dest: path.resolve(templatesDir, "styles/kyc-verification-flow.css")
  },
  // deposit-funding-flow
  {
    source: path.resolve(repoRoot, "react/deposit-funding-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/deposit-funding-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/deposit-funding-flow/deposit-funding-flow.css"),
    dest: path.resolve(templatesDir, "styles/deposit-funding-flow.css")
  },
  // money-transfer-flow
  {
    source: path.resolve(repoRoot, "react/money-transfer-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/money-transfer-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/money-transfer-flow/money-transfer-flow.css"),
    dest: path.resolve(templatesDir, "styles/money-transfer-flow.css")
  },
  // withdrawal-payout-flow
  {
    source: path.resolve(repoRoot, "react/withdrawal-payout-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/withdrawal-payout-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/withdrawal-payout-flow/withdrawal-payout-flow.css"),
    dest: path.resolve(templatesDir, "styles/withdrawal-payout-flow.css")
  },
  // step-up-auth-flow
  {
    source: path.resolve(repoRoot, "react/step-up-auth-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/step-up-auth-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/step-up-auth-flow/step-up-auth-flow.css"),
    dest: path.resolve(templatesDir, "styles/step-up-auth-flow.css")
  },
  // account-opening-flow
  {
    source: path.resolve(repoRoot, "react/account-opening-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/account-opening-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/account-opening-flow/account-opening-flow.css"),
    dest: path.resolve(templatesDir, "styles/account-opening-flow.css")
  },
  // bill-payment-flow
  {
    source: path.resolve(repoRoot, "react/bill-payment-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/bill-payment-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/bill-payment-flow/bill-payment-flow.css"),
    dest: path.resolve(templatesDir, "styles/bill-payment-flow.css")
  },
  // card-management-flow
  {
    source: path.resolve(repoRoot, "react/card-management-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/card-management-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/card-management-flow/card-management-flow.css"),
    dest: path.resolve(templatesDir, "styles/card-management-flow.css")
  },
  // dispute-claim-flow
  {
    source: path.resolve(repoRoot, "react/dispute-claim-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/dispute-claim-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/dispute-claim-flow/dispute-claim-flow.css"),
    dest: path.resolve(templatesDir, "styles/dispute-claim-flow.css")
  },
  // recurring-payment-flow
  {
    source: path.resolve(repoRoot, "react/recurring-payment-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/recurring-payment-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/recurring-payment-flow/recurring-payment-flow.css"),
    dest: path.resolve(templatesDir, "styles/recurring-payment-flow.css")
  },
  // fx-conversion-flow
  {
    source: path.resolve(repoRoot, "react/fx-conversion-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/fx-conversion-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/fx-conversion-flow/fx-conversion-flow.css"),
    dest: path.resolve(templatesDir, "styles/fx-conversion-flow.css")
  },
  // loan-application-flow
  {
    source: path.resolve(repoRoot, "react/loan-application-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/loan-application-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/loan-application-flow/loan-application-flow.css"),
    dest: path.resolve(templatesDir, "styles/loan-application-flow.css")
  },
  // beneficiary-management-flow
  {
    source: path.resolve(repoRoot, "react/beneficiary-management-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/beneficiary-management-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/beneficiary-management-flow/beneficiary-management-flow.css"),
    dest: path.resolve(templatesDir, "styles/beneficiary-management-flow.css")
  },
  // statement-export-flow
  {
    source: path.resolve(repoRoot, "react/statement-export-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/statement-export-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/statement-export-flow/statement-export-flow.css"),
    dest: path.resolve(templatesDir, "styles/statement-export-flow.css")
  },
  // close-account-flow
  {
    source: path.resolve(repoRoot, "react/close-account-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/close-account-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/close-account-flow/close-account-flow.css"),
    dest: path.resolve(templatesDir, "styles/close-account-flow.css")
  },
  // session-timeout-modal
  {
    source: path.resolve(repoRoot, "react/session-timeout-modal/index.tsx"),
    dest: path.resolve(templatesDir, "components/session-timeout-modal/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/session-timeout-modal/session-timeout-modal.css"),
    dest: path.resolve(templatesDir, "styles/session-timeout-modal.css")
  },
  // virtual-card-reveal
  {
    source: path.resolve(repoRoot, "react/virtual-card-reveal/index.tsx"),
    dest: path.resolve(templatesDir, "components/virtual-card-reveal/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/virtual-card-reveal/virtual-card-reveal.css"),
    dest: path.resolve(templatesDir, "styles/virtual-card-reveal.css")
  },
  // device-management-card
  {
    source: path.resolve(repoRoot, "react/device-management-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/device-management-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/device-management-card/device-management-card.css"),
    dest: path.resolve(templatesDir, "styles/device-management-card.css")
  },
  // credit-utilization-meter
  {
    source: path.resolve(repoRoot, "react/credit-utilization-meter/index.tsx"),
    dest: path.resolve(templatesDir, "components/credit-utilization-meter/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/credit-utilization-meter/credit-utilization-meter.css"),
    dest: path.resolve(templatesDir, "styles/credit-utilization-meter.css")
  },
  // performance-chart-card
  {
    source: path.resolve(repoRoot, "react/performance-chart-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/performance-chart-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/performance-chart-card/performance-chart-card.css"),
    dest: path.resolve(templatesDir, "styles/performance-chart-card.css")
  },
  // order-entry-ticket
  {
    source: path.resolve(repoRoot, "react/order-entry-ticket/index.tsx"),
    dest: path.resolve(templatesDir, "components/order-entry-ticket/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/order-entry-ticket/order-entry-ticket.css"),
    dest: path.resolve(templatesDir, "styles/order-entry-ticket.css")
  },
  // bank-reconciliation-matcher
  {
    source: path.resolve(repoRoot, "react/bank-reconciliation-matcher/index.tsx"),
    dest: path.resolve(templatesDir, "components/bank-reconciliation-matcher/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/bank-reconciliation-matcher/bank-reconciliation-matcher.css"),
    dest: path.resolve(templatesDir, "styles/bank-reconciliation-matcher.css")
  },
  // cash-flow-forecast-card
  {
    source: path.resolve(repoRoot, "react/cash-flow-forecast-card/index.tsx"),
    dest: path.resolve(templatesDir, "components/cash-flow-forecast-card/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/cash-flow-forecast-card/cash-flow-forecast-card.css"),
    dest: path.resolve(templatesDir, "styles/cash-flow-forecast-card.css")
  },
  // audit-trail-timeline
  {
    source: path.resolve(repoRoot, "react/audit-trail-timeline/index.tsx"),
    dest: path.resolve(templatesDir, "components/audit-trail-timeline/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/audit-trail-timeline/audit-trail-timeline.css"),
    dest: path.resolve(templatesDir, "styles/audit-trail-timeline.css")
  },
  // trade-execution-flow
  {
    source: path.resolve(repoRoot, "react/trade-execution-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/trade-execution-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/trade-execution-flow/trade-execution-flow.css"),
    dest: path.resolve(templatesDir, "styles/trade-execution-flow.css")
  },
  // month-end-close-flow
  {
    source: path.resolve(repoRoot, "react/month-end-close-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/month-end-close-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/month-end-close-flow/month-end-close-flow.css"),
    dest: path.resolve(templatesDir, "styles/month-end-close-flow.css")
  },
  // security-center-flow
  {
    source: path.resolve(repoRoot, "react/security-center-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/security-center-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/security-center-flow/security-center-flow.css"),
    dest: path.resolve(templatesDir, "styles/security-center-flow.css")
  },
  // savings-goal-flow
  {
    source: path.resolve(repoRoot, "react/savings-goal-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/savings-goal-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/savings-goal-flow/savings-goal-flow.css"),
    dest: path.resolve(templatesDir, "styles/savings-goal-flow.css")
  },
  // budget-setup-flow
  {
    source: path.resolve(repoRoot, "react/budget-setup-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/budget-setup-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/budget-setup-flow/budget-setup-flow.css"),
    dest: path.resolve(templatesDir, "styles/budget-setup-flow.css")
  },
  // group-bill-split-flow
  {
    source: path.resolve(repoRoot, "react/group-bill-split-flow/index.tsx"),
    dest: path.resolve(templatesDir, "components/group-bill-split-flow/index.tsx")
  },
  {
    source: path.resolve(repoRoot, "components/group-bill-split-flow/group-bill-split-flow.css"),
    dest: path.resolve(templatesDir, "styles/group-bill-split-flow.css")
  },
  // Shared types
  {
    source: path.resolve(repoRoot, "react/types/index.ts"),
    dest: path.resolve(templatesDir, "components/types/index.ts")
  },
  // Shared tokens CSS
  {
    source: path.resolve(repoRoot, "tokens/dist/tokens.css"),
    dest: path.resolve(templatesDir, "styles/tokens.css")
  },
  // Official AI Agent Skill
  {
    source: path.resolve(repoRoot, "skills/sorleed/SKILL.md"),
    dest: path.resolve(templatesDir, "SKILL.md")
  }
];

export function copyTemplates() {
  console.log('Copying canonical sources into cli/templates/...');
  for (const item of templateManifest) {
    if (!fs.existsSync(item.source)) {
      throw new Error(`Canonical source missing: ${item.source}`);
    }
    const destDir = path.dirname(item.dest);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(item.source, item.dest);
    console.log(`  ✓ ${path.relative(repoRoot, item.source)} -> ${path.relative(cliRoot, item.dest)}`);
  }
  console.log('Templates packaging complete.');
}

// When executed directly as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  copyTemplates();
}
