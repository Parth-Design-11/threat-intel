import {
  API_TYPES,
  ENDPOINTS_BY_TYPE,
  ENVIRONMENTS,
  EXPIRY_OPTIONS,
  type ApiEnvironment,
  type ApiType,
} from "./apiManagement";

export { API_TYPES, ENDPOINTS_BY_TYPE, ENVIRONMENTS, EXPIRY_OPTIONS };

export type ApiStatus = "Active" | "Disabled" | "Expired";
export type HttpMethod = "GET" | "POST";

export type ManagedApi = {
  id: string;
  name: string;
  keyId: string;
  maskedKeyId: string;
  type: ApiType;
  environment: ApiEnvironment;
  createdBy: string;
  createdOn: string;
  lastUsed: string;
  expiry: string;
  status: ApiStatus;
  description?: string;
  endpoint?: string;
  secret?: string;
};

export type RequestLog = {
  id: string;
  timestamp: string;
  endpoint: string;
  method: HttpMethod;
  status: 200 | 201 | 400 | 401 | 403 | 404 | 500 | 503;
  responseTime: string;
  apiName: string;
  requestId: string;
  environment: ApiEnvironment;
  apiType: ApiType;
};

export const INITIAL_KEYS: ManagedApi[] = [
  {
    id: "1",
    name: "Production Fraud Monitor",
    keyId: "ti_prod_a4f2k9m2b8z1p5r0x7v9",
    maskedKeyId: "ti_prod_a4f2••••x7v9",
    type: "A-Party Risk Score",
    environment: "Production",
    createdBy: "Sarah Chen",
    createdOn: "15 Jan 2026",
    lastUsed: "2 hours ago",
    expiry: "18 Sep 2026",
    status: "Active",
    description: "Primary production scorer for originating-party checks.",
    endpoint: "/v1/risk/a-party",
  },
  {
    id: "2",
    name: "Partner Vulnerability Sync",
    keyId: "ti_stg_b7m4p8r0x2n6q1l5k3w9",
    maskedKeyId: "ti_stg_b7m4••••k3w9",
    type: "B-Party Vulnerability",
    environment: "Staging",
    createdBy: "James Wilson",
    createdOn: "22 Mar 2026",
    lastUsed: "Yesterday",
    expiry: "12 Oct 2026",
    status: "Active",
    description: "Pre-production receiver-party vulnerability scoring.",
    endpoint: "/v1/risk/b-party",
  },
  {
    id: "3",
    name: "Support CTA Validation",
    keyId: "ti_dev_c1v9m4t7q3p8x2k6n5r1",
    maskedKeyId: "ti_dev_c1v9••••n5r1",
    type: "CTA Check",
    environment: "Development",
    createdBy: "Maria Garcia",
    createdOn: "10 Apr 2026",
    lastUsed: "Never",
    expiry: "25 Sep 2026",
    status: "Disabled",
    description: "Developer sandbox for CTA investigations.",
    endpoint: "/v1/check/cta",
  },
  {
    id: "4",
    name: "Message Pattern Insights",
    keyId: "ti_prod_m9h2q8p4r1t6v3x5k7n0",
    maskedKeyId: "ti_prod_m9h2••••k7n0",
    type: "Message Pattern Check",
    environment: "Production",
    createdBy: "Alex Kumar",
    createdOn: "05 Jun 2026",
    lastUsed: "18 minutes ago",
    expiry: "02 Sep 2026",
    status: "Active",
    description: "Production pattern analysis integration for messaging abuse.",
    endpoint: "/v1/check/message-pattern",
  },
  {
    id: "5",
    name: "Fraud Ops Universal",
    keyId: "ti_prod_u4n2i8v6e0r9s1a3l5l7",
    maskedKeyId: "ti_prod_u4n2••••l5l7",
    type: "All APIs",
    environment: "Production",
    createdBy: "Sarah Chen",
    createdOn: "18 Jul 2026",
    lastUsed: "5 minutes ago",
    expiry: "Never",
    status: "Active",
    description: "Internal ops bundle for all four intelligence endpoints.",
  },
  {
    id: "6",
    name: "Legacy A-Party Connector",
    keyId: "ti_dev_l2g8a1c9y4o7m6d3p5x0",
    maskedKeyId: "ti_dev_l2g8••••p5x0",
    type: "A-Party Risk Score",
    environment: "Development",
    createdBy: "James Wilson",
    createdOn: "03 Sep 2025",
    lastUsed: "12 days ago",
    expiry: "04 Aug 2026",
    status: "Expired",
    description: "Legacy connector awaiting renewal.",
    endpoint: "/v1/risk/a-party",
  },
];

export const REQUEST_LOGS: RequestLog[] = [
  {
    id: "l1",
    timestamp: "2026-08-19 09:41:12 IST",
    endpoint: "/v1/risk/a-party",
    method: "POST",
    status: 200,
    responseTime: "112ms",
    apiName: "Production Fraud Monitor",
    requestId: "req_8f2k9m4b",
    environment: "Production",
    apiType: "A-Party Risk Score",
  },
  {
    id: "l2",
    timestamp: "2026-08-19 09:40:45 IST",
    endpoint: "/v1/check/cta",
    method: "POST",
    status: 201,
    responseTime: "245ms",
    apiName: "Fraud Ops Universal",
    requestId: "req_4q1m7a2x",
    environment: "Production",
    apiType: "CTA Check",
  },
  {
    id: "l3",
    timestamp: "2026-08-19 09:39:11 IST",
    endpoint: "/v1/check/message-pattern",
    method: "POST",
    status: 200,
    responseTime: "89ms",
    apiName: "Message Pattern Insights",
    requestId: "req_1t8b5n2c",
    environment: "Production",
    apiType: "Message Pattern Check",
  },
  {
    id: "l4",
    timestamp: "2026-08-19 09:38:02 IST",
    endpoint: "/v1/check/cta",
    method: "POST",
    status: 401,
    responseTime: "42ms",
    apiName: "Support CTA Validation",
    requestId: "req_6z2h3d9p",
    environment: "Development",
    apiType: "CTA Check",
  },
  {
    id: "l5",
    timestamp: "2026-08-19 09:35:59 IST",
    endpoint: "/v1/risk/b-party",
    method: "POST",
    status: 500,
    responseTime: "310ms",
    apiName: "Partner Vulnerability Sync",
    requestId: "req_5n4r2m7y",
    environment: "Staging",
    apiType: "B-Party Vulnerability",
  },
  {
    id: "l6",
    timestamp: "2026-08-19 09:34:20 IST",
    endpoint: "/v1/risk/a-party",
    method: "POST",
    status: 403,
    responseTime: "412ms",
    apiName: "Fraud Ops Universal",
    requestId: "req_2w8s4j1k",
    environment: "Production",
    apiType: "A-Party Risk Score",
  },
  {
    id: "l7",
    timestamp: "2026-08-19 09:31:15 IST",
    endpoint: "/v1/risk/b-party",
    method: "POST",
    status: 404,
    responseTime: "95ms",
    apiName: "Partner Vulnerability Sync",
    requestId: "req_9q3e5a7c",
    environment: "Staging",
    apiType: "B-Party Vulnerability",
  },
  {
    id: "l8",
    timestamp: "2026-08-19 09:30:00 IST",
    endpoint: "/v1/check/message-pattern",
    method: "POST",
    status: 503,
    responseTime: "102ms",
    apiName: "Message Pattern Insights",
    requestId: "req_7p1x6v4m",
    environment: "Production",
    apiType: "Message Pattern Check",
  },
];

export const VOLUME_POINTS = [
  { date: "18 May", value: 8200, left: 24, top: 64, dateLeft: 24, dotLeft: -5, dotTop: 98 },
  { date: "19 May", value: 9100, left: 167, top: 57, dateLeft: 195, dotLeft: 172, dotTop: 89 },
  { date: "20 May", value: 7800, left: 338, top: 67, dateLeft: 366, dotLeft: 356, dotTop: 100 },
  { date: "21 May", value: 12400, left: 509, top: 31, dateLeft: 537, dotLeft: 533, dotTop: 63 },
  { date: "22 May", value: 14500, left: 680, top: 14, dateLeft: 708, dotLeft: 714, dotTop: 42 },
  { date: "23 May", value: 11200, left: 851, top: 40, dateLeft: 879, dotLeft: 895, dotTop: 71 },
  { date: "24 May", value: 15300, left: 1022, top: 8, dateLeft: 1050, dotLeft: 1075, dotTop: 35 },
];
