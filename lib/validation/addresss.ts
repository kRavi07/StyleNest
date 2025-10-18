//zod shcema for address validation
import { z } from "zod";
export const AddressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  address1: z.string().min(1, "Address1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  landmark: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
  type: z.enum(["home", "work", "other"]).optional().default("home"),
});
