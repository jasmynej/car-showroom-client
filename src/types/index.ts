export type AvailabilityStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';
export type Role = 'CUSTOMER' | 'STAFF' | 'MANAGER';
export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type PaymentStatus = 'PAID' | 'UNPAID';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD';
export type ScheduleStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Car {
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  availabilityStatus: AvailabilityStatus;
  lastServiceDate: string | null;
  ownerId: number | null;
  lastUpdated: string;
}

export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  contactInfo: string;
  role: Role;
  department: string | null;
  designation: string | null;
  ownedCars: Car[] | null;
}

export interface PurchaseOrder {
  orderId: number;
  customerId: number;
  vin: string;
  date: string;
  comments: string;
  status: OrderStatus;
}

export interface Invoice {
  invoiceId: number;
  orderId: number;
  customerId: number;
  price: number;
  tax: number;
  totalAmount: number;
  date: string;
  termsAndConditions: string;
}

export interface Payment {
  transactionId: number;
  invoiceId: number;
  customerId: number;
  vin: string;
  amount: number;
  status: PaymentStatus;
  paymentDate: string;
  paymentMethod: PaymentMethod;
}

export interface TestDrive {
  testDriveId: number;
  vin: string;
  customerId: number;
  date: string;
  time: string;
  status: ScheduleStatus;
  comments: string;
}

export interface ServiceSchedule {
  serviceId: number;
  vin: string;
  serviceType: string;
  date: string;
  status: ScheduleStatus;
  comments: string;
  staffId: number;
}

export interface Sale {
  saleId: number;
  saleDate: string;
  vin: string;
}
