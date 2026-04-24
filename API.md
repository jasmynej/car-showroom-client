# API Contract

Base URL: `http://localhost:8080`

Interactive docs: [`/swagger-ui.html`](http://localhost:8080/swagger-ui.html)

---

## Table of contents

- [Cars](#cars)
- [Users](#users)
- [Purchase Orders](#purchase-orders)
- [Invoices](#invoices)
- [Payments](#payments)
- [Test Drives](#test-drives)
- [Service Schedules](#service-schedules)
- [Sales](#sales)

---

## Cars

### `GET /api/cars`
Returns all cars.

**Response `200`**
```json
[
  {
    "vin": "1HGCM82633A004352",
    "make": "Honda",
    "model": "Accord",
    "year": 2023,
    "price": 28500.0,
    "color": "Silver",
    "mileage": 1200.0,
    "availabilityStatus": "AVAILABLE",
    "lastServiceDate": "2024-12-01",
    "ownerId": null,
    "lastUpdated": "2025-01-10"
  }
]
```

---

### `GET /api/cars/available`
Returns only cars with `availabilityStatus = AVAILABLE`.

**Response `200`** — same shape as above, filtered.

---

### `GET /api/cars/{vin}`
Returns a single car by VIN.

**Response `200`** — single car object.  
**Response `404`** — car not found.

---

### `POST /api/cars`
Adds a new car. `availabilityStatus` defaults to `AVAILABLE` if omitted. `lastUpdated` is set to today server-side.

**Request body**
```json
{
  "vin": "5FNRL5H63GB066739",
  "make": "Honda",
  "model": "Odyssey",
  "year": 2024,
  "price": 38000.00,
  "color": "White",
  "mileage": 0.0,
  "availabilityStatus": "AVAILABLE",
  "lastServiceDate": null
}
```

**Response `201`** — created car object.  
**Response `400`** — validation error (e.g. invalid VIN format).  
**Response `409`** — VIN already exists.

---

### `PUT /api/cars/{vin}`
Updates a car. VIN is immutable. Only fields provided in the body are updated; `null` fields are ignored.

**Request body** — same shape as `POST /api/cars`, all fields optional except those you want to change.

**Response `200`** — updated car object.  
**Response `404`** — car not found.

---

### `DELETE /api/cars/{vin}`
Deletes a car.

**Response `204`** — deleted.  
**Response `404`** — car not found.  
**Response `409`** — car has a `PENDING` or `APPROVED` purchase order and cannot be deleted.

---

## Users

### `GET /api/users/{id}`
Returns a user. For `CUSTOMER` role, the response includes an `ownedCars` list (cars where `ownerId` matches).

**Response `200`**
```json
{
  "userId": 4,
  "name": "David Brown",
  "email": "david@example.com",
  "contactInfo": "555-0201",
  "role": "CUSTOMER",
  "department": null,
  "designation": null,
  "ownedCars": [
    {
      "vin": "4S3BMHB68B3286050",
      "make": "Subaru",
      "model": "Legacy",
      "year": 2020,
      "price": 18500.0,
      "color": "Red",
      "mileage": 32000.0,
      "availabilityStatus": "SOLD",
      "lastServiceDate": "2024-09-05",
      "ownerId": 4,
      "lastUpdated": "2025-01-20"
    }
  ]
}
```

For `STAFF` and `MANAGER`, `ownedCars` is `null`.

**Response `404`** — user not found.

---

### `POST /api/users`
Registers a new user. Provide `department` for `MANAGER` role; provide `designation` for `STAFF` role.

**Request body**
```json
{
  "name": "Grace Lee",
  "email": "grace@example.com",
  "password": "secret123",
  "contactInfo": "555-0301",
  "role": "CUSTOMER",
  "department": null,
  "designation": null
}
```

**Response `201`** — created user (no `password` field in response).  
**Response `400`** — validation error.  
**Response `409`** — email already registered.

---

### `PUT /api/users/{id}/password`
Updates a user's password.

**Request body**
```json
{ "password": "newSecret456" }
```

**Response `204`** — updated.  
**Response `400`** — blank password.  
**Response `404`** — user not found.

---

## Purchase Orders

### `GET /api/orders`
Returns all purchase orders.

**Response `200`**
```json
[
  {
    "orderId": 3,
    "customerId": 6,
    "vin": "1HGCM82633A004352",
    "date": "2025-01-18",
    "comments": "Would like to buy the silver Accord.",
    "status": "PENDING"
  }
]
```

---

### `GET /api/orders/{id}`
Returns a single order.

**Response `200`** — single order object.  
**Response `404`** — order not found.

---

### `POST /api/orders`
Creates a purchase order. Car must exist and have `availabilityStatus = AVAILABLE`. Status is set to `PENDING` and date is set to today.

**Request body**
```json
{
  "customerId": 6,
  "vin": "1HGCM82633A004352",
  "comments": "Would like to buy the silver Accord."
}
```

**Response `201`** — created order.  
**Response `400`** — validation error.  
**Response `404`** — car not found.  
**Response `409`** — car is not `AVAILABLE`.

---

### `PATCH /api/orders/{id}/status`
Updates an order's status. Setting to `APPROVED` automatically moves the car to `RESERVED`. `COMPLETED` is set automatically by the payment flow and should not be set manually.

**Request body**
```json
{ "status": "APPROVED" }
```

Allowed values: `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED`

**Response `200`** — updated order.  
**Response `400`** — invalid status value.  
**Response `404`** — order not found.

---

## Invoices

### `GET /api/invoices/{id}`
Returns a single invoice.

**Response `200`**
```json
{
  "invoiceId": 2,
  "orderId": 2,
  "customerId": 5,
  "price": 22000.0,
  "tax": 13.0,
  "totalAmount": 24860.0,
  "date": "2025-01-16",
  "termsAndConditions": "Payment due within 7 days. No refunds after delivery."
}
```

**Response `404`** — invoice not found.

---

### `POST /api/invoices`
Generates an invoice for a purchase order. `totalAmount` is computed server-side as `price + (price × tax / 100)`. Only one invoice per order is allowed.

**Request body**
```json
{
  "orderId": 2,
  "customerId": 5,
  "price": 22000.00,
  "tax": 13.00,
  "termsAndConditions": "Payment due within 7 days. No refunds after delivery."
}
```

**Response `201`** — created invoice with computed `totalAmount`.  
**Response `400`** — validation error (e.g. non-positive price or tax).  
**Response `409`** — invoice already exists for this order.

---

## Payments

### `GET /api/payments/{id}`
Returns a single payment.

**Response `200`**
```json
{
  "transactionId": 1,
  "invoiceId": 1,
  "customerId": 4,
  "vin": "4S3BMHB68B3286050",
  "amount": 20905.0,
  "status": "PAID",
  "paymentDate": "2025-01-14",
  "paymentMethod": "CREDIT_CARD"
}
```

**Response `404`** — payment not found.

---

### `POST /api/payments`
Processes a payment. This is an atomic operation — on success:
- Payment `status` → `PAID`
- Car `availabilityStatus` → `SOLD`, `ownerId` set to customer
- Purchase order `status` → `COMPLETED`
- A `Sale` record is created

Supply `accountNumber`, `pin`, `bank` for `CASH`. Supply `creditCardNumber`, `cvvCode` for `CREDIT_CARD`.

**Request body (credit card)**
```json
{
  "invoiceId": 2,
  "customerId": 5,
  "vin": "3VWFE21C04M000001",
  "amount": 24860.00,
  "paymentMethod": "CREDIT_CARD",
  "creditCardNumber": "4111111111111111",
  "cvvCode": "456"
}
```

**Request body (cash)**
```json
{
  "invoiceId": 2,
  "customerId": 5,
  "vin": "3VWFE21C04M000001",
  "amount": 24860.00,
  "paymentMethod": "CASH",
  "accountNumber": "987654321",
  "pin": "1234",
  "bank": "TD Bank"
}
```

**Response `201`** — payment record.  
**Response `400`** — validation error.  
**Response `404`** — invoice or related order/car not found.  
**Response `409`** — invoice already paid.

---

## Test Drives

### `GET /api/test-drives`
Returns all test drives.

**Response `200`**
```json
[
  {
    "testDriveId": 2,
    "vin": "5NPE24AF8FH052952",
    "customerId": 5,
    "date": "2025-01-20",
    "time": "2:00 PM",
    "status": "SCHEDULED",
    "comments": "First time test drive."
  }
]
```

---

### `GET /api/test-drives/{id}`
Returns a single test drive.

**Response `200`** — single test drive object.  
**Response `404`** — not found.

---

### `POST /api/test-drives`
Schedules a test drive. Car must exist. Status is set to `SCHEDULED`.

**Request body**
```json
{
  "vin": "5NPE24AF8FH052952",
  "customerId": 6,
  "date": "2025-02-01",
  "time": "10:00 AM",
  "comments": "Interested in the sports package."
}
```

**Response `201`** — scheduled test drive.  
**Response `400`** — validation error.  
**Response `404`** — car not found.

---

### `PATCH /api/test-drives/{id}/status`
Updates test drive status.

**Request body**
```json
{ "status": "COMPLETED" }
```

Allowed values: `SCHEDULED`, `COMPLETED`, `CANCELLED`

**Response `200`** — updated test drive.  
**Response `404`** — not found.

---

## Service Schedules

### `GET /api/services`
Returns all service schedules.

**Response `200`**
```json
[
  {
    "serviceId": 2,
    "vin": "2T1BURHE0JC043821",
    "serviceType": "Tire Rotation",
    "date": "2025-01-25",
    "status": "SCHEDULED",
    "comments": "Scheduled for regular tire rotation.",
    "staffId": 3
  }
]
```

---

### `GET /api/services/{id}`
Returns a single service schedule.

**Response `200`** — single service schedule object.  
**Response `404`** — not found.

---

### `POST /api/services`
Schedules a vehicle service. Car must exist. Status is set to `SCHEDULED`.

**Request body**
```json
{
  "vin": "2T1BURHE0JC043821",
  "serviceType": "Tire Rotation",
  "date": "2025-02-10",
  "comments": "Scheduled for regular tire rotation.",
  "staffId": 3
}
```

**Response `201`** — scheduled service.  
**Response `400`** — validation error.  
**Response `404`** — car not found.

---

### `PATCH /api/services/{id}/status`
Updates service schedule status.

**Request body**
```json
{ "status": "COMPLETED" }
```

Allowed values: `SCHEDULED`, `COMPLETED`, `CANCELLED`

**Response `200`** — updated service schedule.  
**Response `404`** — not found.

---

## Sales

### `GET /api/sales`
Returns all sale records. Sale records are created automatically when a payment is processed successfully.

**Response `200`**
```json
[
  {
    "saleId": 1,
    "saleDate": "2025-01-14",
    "vin": "4S3BMHB68B3286050"
  }
]
```

---

## Error responses

All errors return a JSON body with an `error` field:

```json
{ "error": "Car not found: 1HGCM82633A004352" }
```

| Status | Meaning |
|--------|---------|
| `400` | Validation failed — missing required field, invalid format, or non-positive value |
| `404` | Resource not found |
| `409` | Conflict — duplicate resource or invalid state transition (e.g. car not available, invoice already paid) |

---

## Enums

| Enum | Values |
|------|--------|
| `AvailabilityStatus` | `AVAILABLE`, `RESERVED`, `SOLD` |
| `Role` | `CUSTOMER`, `STAFF`, `MANAGER` |
| `OrderStatus` | `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED` |
| `PaymentStatus` | `PAID`, `UNPAID` |
| `PaymentMethod` | `CASH`, `CREDIT_CARD` |
| `ScheduleStatus` | `SCHEDULED`, `COMPLETED`, `CANCELLED` |
