import { customersMock } from "@/mocks/customers";
import type { PaginatedResponse, PaginationQuery } from "@/types/common";
import type { Customer, CustomerDetail } from "@/types/customer";
import { mockResponse, NotFoundError } from "./mock-response";

/** `GET /customers?page=&limit=` */
export function listCustomers({
  page = 1,
  limit = 20,
}: PaginationQuery = {}): Promise<PaginatedResponse<Customer>> {
  const start = (page - 1) * limit;
  const data = customersMock
    .slice(start, start + limit)
    .map(({ id, identificationType, identification, businessName, email, status }) => ({
      id,
      identificationType,
      identification,
      businessName,
      email,
      status,
    }));

  return mockResponse({
    data,
    meta: {
      page,
      limit,
      total: customersMock.length,
      totalPages: Math.ceil(customersMock.length / limit),
    },
  });
}

/** `GET /customers/:id` */
export async function getCustomer(id: string): Promise<CustomerDetail> {
  const customer = customersMock.find((candidate) => candidate.id === id);
  if (!customer) throw new NotFoundError("Customer", id);
  return mockResponse(customer);
}
