/** Three fixed Foam questions (P1-acceptance row 9 / M2 / M5). */

export type FoamQuestionId = "usage" | "ownership" | "impact";

export interface FoamQuestion {
  id: FoamQuestionId;
  prompt: string;
  seed_qname: string;
  gql_tool: "gql_read" | "gql_context" | "gql_impact";
  grep_procedure: string[];
}

export const FOAM_QUESTIONS: FoamQuestion[] = [
  {
    id: "usage",
    prompt: "What uses FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator?",
    seed_qname: "FoamDetectionLiteVer2::CoreVideoMonitorToolbar::backgroundSetIndicator",
    gql_tool: "gql_read",
    grep_procedure: [
      "Clone Foam SoI; restrict to sysml-models/ (do not stuff parts/**).",
      "rg -n 'backgroundSetIndicator' sysml-models --glob '*.sysml'",
      "Open each hit; classify usage vs comment vs requirement prose.",
      "Trace owning part def and ports/connections that mention the nested usage.",
      "Answer from those slices only; note any file truncated out of context.",
    ],
  },
  {
    id: "ownership",
    prompt: "Who owns FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator?",
    seed_qname: "FoamDetectionLiteVer2::CoreMonitorConfigPanel::backgroundSetIndicator",
    gql_tool: "gql_context",
    grep_procedure: [
      "rg -n 'part def CoreMonitorConfigPanel' -n 'part backgroundSetIndicator' sysml-models/models/deploy.sysml",
      "Walk brace nesting to name the owner part def (do not invent qnames).",
      "Confirm the same nested name under CoreVideoMonitorToolbar is a distinct owner.",
      "Record owner qname + file path. Do not dump the whole tree into the prompt.",
    ],
  },
  {
    id: "impact",
    prompt:
      "Impact of **foamDetection** (usage of FoamCoverageDetectionService). The part def itself may be UNKNOWN in the parser if `doc /*` hits markdown `**.../**`. Neighbourhood only until closure is measured.",
    seed_qname: "FoamDetectionLiteVer2::FoamLiteVer2EdgePcSoftware::foamDetection",
    gql_tool: "gql_impact",
    grep_procedure: [
      "rg -n 'FoamCoverageDetectionService' sysml-models --glob '*.sysml'",
      "Collect connection usages that name foamDetection / videoDisplay / preview ports.",
      "Score only neighbourhood + usage cues unless gql_impact closure is later proven on gold.",
      "MUST NOT claim exhaustive impact. UNKNOWN on a required field fails that line.",
    ],
  },
];
