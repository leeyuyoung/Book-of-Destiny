import "server-only";

import type { AnalysisRecord, AnalysisStore, OrderPatch, OrderRecord } from "./types";

/** 개발용 보관 기간. 서버를 재시작해도 사라진다. */
const RECORD_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * 개발용 메모리 저장소. Supabase 설정이 없을 때만 쓰며, 서버 프로세스 하나에서만 유효해 배포 환경에서는 쓸 수 없다.
 */
export class MemoryAnalysisStore implements AnalysisStore {
  private records = new Map<string, AnalysisRecord>();
  private orders = new Map<string, OrderRecord>();

  private sweep() {
    const now = Date.now();
    for (const [token, record] of this.records) {
      if (now - record.createdAt > RECORD_TTL_MS) this.records.delete(token);
    }
  }

  async create(record: AnalysisRecord) {
    this.sweep();
    this.records.set(record.token, structuredClone(record));
  }

  async get(token: string) {
    this.sweep();
    const record = this.records.get(token);
    return record ? structuredClone(record) : null;
  }

  async update(token: string, patch: Partial<Omit<AnalysisRecord, "token" | "createdAt">>) {
    const record = this.records.get(token);
    if (!record) return;
    this.records.set(token, { ...record, ...structuredClone(patch), updatedAt: Date.now() });
  }

  async claimReportGeneration(token: string, staleBefore: number) {
    const record = this.records.get(token);
    if (!record || record.paidAt === null || record.report !== null) return false;
    if (record.status === "generating" && record.updatedAt >= staleBefore) return false;
    this.records.set(token, { ...record, status: "generating", updatedAt: Date.now() });
    return true;
  }

  async createOrder(order: OrderRecord) {
    if (this.orders.has(order.orderId)) throw new Error("duplicate orderId");
    this.orders.set(order.orderId, { ...order });
  }

  async getOrder(orderId: string) {
    const order = this.orders.get(orderId);
    return order ? { ...order } : null;
  }

  async updateOrder(orderId: string, patch: OrderPatch) {
    const order = this.orders.get(orderId);
    if (!order) return;
    this.orders.set(orderId, { ...order, ...patch, updatedAt: Date.now() });
  }

  async deleteStalePendingOrders(createdBefore: number) {
    for (const [orderId, order] of this.orders) {
      if (order.status === "pending" && order.createdAt < createdBefore) this.orders.delete(orderId);
    }
  }
}
