import "server-only";

import type { AnalysisRecord, AnalysisStore, OrderPatch, OrderRecord } from "./types";

const TABLE = "analyses";
const ORDER_TABLE = "orders";
const REQUEST_TIMEOUT_MS = 10_000;

type Row = {
  token: string;
  status: AnalysisRecord["status"];
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  occupation_status: AnalysisRecord["occupationStatus"];
  occupation: string | null;
  concern: string;
  profile: AnalysisRecord["profile"];
  report: AnalysisRecord["report"];
  paid_at: string | null;
};

type Patch = Partial<Omit<AnalysisRecord, "token" | "createdAt">>;

type OrderRow = {
  order_id: string;
  token: string;
  amount: number;
  status: OrderRecord["status"];
  payment_key: string | null;
  method: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
};

const toIso = (time: number) => new Date(time).toISOString();

const toOrderRow = (order: OrderRecord): OrderRow => ({
  order_id: order.orderId,
  token: order.token,
  amount: order.amount,
  status: order.status,
  payment_key: order.paymentKey,
  method: order.method,
  created_at: toIso(order.createdAt),
  updated_at: toIso(order.updatedAt),
  approved_at: order.approvedAt === null ? null : toIso(order.approvedAt),
});

const fromOrderRow = (row: OrderRow): OrderRecord => ({
  orderId: row.order_id,
  token: row.token,
  amount: row.amount,
  status: row.status,
  paymentKey: row.payment_key,
  method: row.method,
  createdAt: Date.parse(row.created_at),
  updatedAt: Date.parse(row.updated_at),
  approvedAt: row.approved_at === null ? null : Date.parse(row.approved_at),
});

function toRow(record: AnalysisRecord): Row {
  return {
    token: record.token,
    status: record.status,
    created_at: toIso(record.createdAt),
    updated_at: toIso(record.updatedAt),
    name: record.name,
    email: record.email,
    occupation_status: record.occupationStatus,
    occupation: record.occupation,
    concern: record.concern,
    profile: record.profile,
    report: record.report,
    paid_at: record.paidAt === null ? null : toIso(record.paidAt),
  };
}

function fromRow(row: Row): AnalysisRecord {
  return {
    token: row.token,
    status: row.status,
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at),
    name: row.name,
    email: row.email,
    occupationStatus: row.occupation_status,
    occupation: row.occupation,
    concern: row.concern,
    profile: row.profile,
    report: row.report,
    paidAt: row.paid_at === null ? null : Date.parse(row.paid_at),
  };
}

function patchToRow(patch: Patch): Partial<Row> {
  const row: Partial<Row> = { updated_at: toIso(Date.now()) };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.occupationStatus !== undefined) row.occupation_status = patch.occupationStatus;
  if (patch.occupation !== undefined) row.occupation = patch.occupation;
  if (patch.concern !== undefined) row.concern = patch.concern;
  if (patch.profile !== undefined) row.profile = patch.profile;
  if (patch.report !== undefined) row.report = patch.report;
  if (patch.paidAt !== undefined) row.paid_at = patch.paidAt === null ? null : toIso(patch.paidAt);
  return row;
}

export class SupabaseStoreError extends Error {
  constructor(message: string) {
    super(`[supabase-store] ${message}`);
    this.name = "SupabaseStoreError";
  }
}

/** Supabase(PostgREST)에 Secret key로 접근하는 저장소. 서버에서만 쓴다. */
export class SupabaseAnalysisStore implements AnalysisStore {
  constructor(
    private readonly url: string,
    private readonly secretKey: string,
  ) {}

  private async request(path: string, init: RequestInit & { prefer?: string }) {
    const headers: Record<string, string> = { apikey: this.secretKey, "Content-Type": "application/json" };
    if (init.prefer) headers.Prefer = init.prefer;
    let response: Response;
    try {
      response = await fetch(`${this.url}/rest/v1/${path}`, {
        ...init,
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      throw new SupabaseStoreError(`network ${String(error)}`);
    }
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new SupabaseStoreError(`HTTP ${response.status} ${body.slice(0, 200)}`);
    }
    return response;
  }

  async create(record: AnalysisRecord) {
    await this.request(TABLE, { method: "POST", body: JSON.stringify(toRow(record)), prefer: "return=minimal" });
  }

  async get(token: string) {
    const response = await this.request(`${TABLE}?token=eq.${encodeURIComponent(token)}&select=*&limit=1`, {
      method: "GET",
    });
    const rows = (await response.json()) as Row[];
    return rows[0] ? fromRow(rows[0]) : null;
  }

  async update(token: string, patch: Patch) {
    await this.request(`${TABLE}?token=eq.${encodeURIComponent(token)}`, {
      method: "PATCH",
      body: JSON.stringify(patchToRow(patch)),
      prefer: "return=minimal",
    });
  }

  async createOrder(order: OrderRecord) {
    await this.request(ORDER_TABLE, { method: "POST", body: JSON.stringify(toOrderRow(order)), prefer: "return=minimal" });
  }

  async getOrder(orderId: string) {
    const response = await this.request(
      `${ORDER_TABLE}?order_id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`,
      { method: "GET" },
    );
    const rows = (await response.json()) as OrderRow[];
    return rows[0] ? fromOrderRow(rows[0]) : null;
  }

  async updateOrder(orderId: string, patch: OrderPatch) {
    const row: Partial<OrderRow> = { updated_at: toIso(Date.now()) };
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.paymentKey !== undefined) row.payment_key = patch.paymentKey;
    if (patch.method !== undefined) row.method = patch.method;
    if (patch.approvedAt !== undefined) row.approved_at = patch.approvedAt === null ? null : toIso(patch.approvedAt);
    await this.request(`${ORDER_TABLE}?order_id=eq.${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      body: JSON.stringify(row),
      prefer: "return=minimal",
    });
  }

  async deleteStalePendingOrders(createdBefore: number) {
    await this.request(
      `${ORDER_TABLE}?status=eq.pending&created_at=lt.${encodeURIComponent(toIso(createdBefore))}`,
      { method: "DELETE", prefer: "return=minimal" },
    );
  }
}
