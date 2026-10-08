// Generated from vendor/duestreasury-contracts/ERRORS.md. Do not retype messages.
export const errorMessages: Record<number,string> = {
  "1": "This group could not be found.",
  "2": "This proposal could not be found.",
  "3": "Provide between 1 and 100 unique members.",
  "4": "Provide between 1 and 20 unique signers.",
  "5": "The approval threshold must be between 1 and the signer count.",
  "6": "The amount must be greater than zero.",
  "7": "The period must be between 1 second and 366 days.",
  "8": "This address is not a member of the group.",
  "9": "This address is not a signer for the group.",
  "10": "This member has already paid for this period.",
  "11": "This signer has already approved the proposal.",
  "12": "This proposal is already executed or cancelled.",
  "13": "The proposal needs more signer approvals.",
  "14": "The group does not have enough recorded balance.",
  "15": "The operation would exceed a numeric limit.",
  "16": "Choose a recipient other than the treasury contract.",
  "17": "Cancellation requires the proposer or a unique threshold of group signers."
};
export function describeError(error: unknown): string { const raw=error instanceof Error?error.message:String(error);const match=/Error\(Contract,\s*#?(\d+)\)/.exec(raw);return match ? (errorMessages[Number(match[1])] ?? "Unknown contract error. TODO(verify): refresh the error mapping.") : raw; }
