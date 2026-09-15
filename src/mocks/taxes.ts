import type { Tax } from "@/types/tax";

export const taxesMock: Tax[] = [
  { id: 1, code: "2", percentageCode: "4", name: "IVA 15 %", rate: 15, status: "ACTIVE" },
  { id: 2, code: "2", percentageCode: "0", name: "IVA 0 %", rate: 0, status: "ACTIVE" },
  { id: 3, code: "2", percentageCode: "6", name: "No objeto de IVA", rate: 0, status: "ACTIVE" },
  { id: 4, code: "2", percentageCode: "7", name: "Exento de IVA", rate: 0, status: "ACTIVE" },
  { id: 5, code: "2", percentageCode: "2", name: "IVA 12 %", rate: 12, status: "INACTIVE" },
];
