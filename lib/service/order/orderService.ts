// lib/services/OrderService.ts

import Order from "@/lib/db/models/order";
import { BaseService } from "../BaseDBService";

export const OrderService = new BaseService(Order);
