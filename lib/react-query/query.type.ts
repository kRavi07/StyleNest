export interface UserRegistrationRequest {
  name: string;
  email: string;
  mobileno: string;
  password: string;
}

export interface BusinessLicense {
  businessLicensevalue: string;
  businessLicensename: string;
  businessLicense_Issueddate: string;
}

export interface ExportLicense {
  exportPermissionvalue: string;
  exportPermissionname: string;
  exportPermission_Issueddate: string;
}

export interface SellerLicenseUpdateProps {
  consentToAdmin: boolean;
  mobileno: string;
  haveexportpermission: boolean;
  exportLicense?: ExportLicense[];
  havebusinesslicenses: boolean;
  businessLicense?: BusinessLicense[];
  business_LicenseFile: any;
  export_PermissionFile: any;
}

export interface SellerOwnerDetails {
  name: string;
  email: string;
  mobileno: string;
  owner_mobileno: string;
  gender: string;
  dateofbirth: string;
  aadharNumber: string;
  havePassport: boolean;
  passportNo: string;
  aadharDoc: any;
  passportDoc: any;
  pan: string;
  panDoc: any;
}

export interface AddProductProps {
  Product_ID: string;
  product_name: string;
  discription: string;
  price: string;
  quantity: string;
  category: string;
  sku: string;
  files: any;
  attributes: any;
  priceRange: any;
}

export interface AddProductForSellerProps {
  Product_ID: string;
  sellerId: string;
  product_name: string;
  discription: string;
  price: string;
  quantity: string;
  category: string;
  sku: string;
  files: any;
  attributes: any;
  priceRange: any;
}

export interface ProductList {}

export interface FetchProductProps {
  Product_ID: string;
  product_name: string;
  price: string;
  image: string[];
  discription: string;
  category: string;
  brand: string;
  color: string;
  sku: string;
  featured: boolean;
  approved: boolean;
  sellerid: string;
  created_at: string;
  addedBy: string;
}

export interface Product {
  Product_ID: string;
  product_name: string;
  price: string;
  image: string[];
  discription: string;
  category: string;
  sku: string;
  featured: boolean;
  approved: boolean;
  sellerid: null | string; // Assuming sellerid can be null or a string
  attributes: Attribute[];
  pricerange: null; // Assuming pricerange can be null
  variant: null; // Assuming variant can be null
  reviews: string[];
  attributes_info: AttributeInfo[];
}

export interface Attribute {
  attribute_type: string;
  attribute_value: string[];
}

export interface AttributeInfo {
  _id: string;
  attribute_name: string;
  attribute_code: string;
  options: string[];
}

export interface AttributeType {
  _id: string;
  attribute_name: string;
  attribute_code: string;
  options: string[];
}

export interface CreateVariantAttribute {
  name: string;
  label: string;
  values: string[];
  isActive: boolean;
}

export interface VariantAttribute {
  _id: string;
  name: string;
  label: string;
  values: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CategoryProps {
  category: string;
  parent_category: string;
  category_image: any;
  category_description: string;
}

export interface FeedsProps {
  title: string;
  content: string;
  feedDocument: any[];
}

export interface SUPPORT_TICKET_STATUS {
  status: "Initiated" | "In Progress" | "Closed";
}

export interface FeedInfoTable {
  FeedID: string;
  Title: string;
  Content: string;
  FeedDocument: string[];
}

export interface Enquiry {
  Enquire_id: string;
  enquire_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  resolved: boolean;
  status: string;
  enquire_note: string;
  enquire_date: string;
  updated_at: string;
}

export interface EnquiryResultProduct {
  _id: string;
  category: string;
  image: string | null;
  name: string;
  price: string;
  price_range: string | null;
  sellers: string | null;
}

export interface EnquiryResultUser {
  _id: string;
  email: string;
  mobile: string;
  name: string;
}

export interface AdminEnquiryResult {
  enquiry: Enquiry;
  product: EnquiryResultProduct;
  user: EnquiryResultUser;
}

export type TicketProps = {
  email: string;
  subject: string;
  message: string;
  name: string;
  mobileno: string;
  attachments: any;
};

export interface SupportTicket {
  Ticket_id: string;
  ticketid: string;
  resolved: boolean;
  deleted: boolean;
  name: string;
  email: string;
  mobileno: string;
  subject: string;
  message: string;
  status: string;
  attachments: string | null;
  chatmessage: string;
  created_at: string;
  updated_at: string;
  assignedsupport: string;
}

export interface RequirementMessage {
  Requirement_id: string;
  resolved: boolean;
  deleted: boolean;
  name: string;
  email: string;
  mobileno: string;
  message: string;
}

export interface PostReview {
  product_id: string;
  reviews_details: ReviewDetail;
}

export interface ReviewDetail {
  review_rating: number;
  review_text: string;
  review_title: string;
}

interface ReviewUser {
  _id: string;
  mobileno: string;
  name: string;
}

interface RviewProduct {
  _id: string;
  approved: boolean;
  brand: string;
  category: string;
  color: string | null;
  description: string;
  featured: boolean;
  image: string[] | null;
  price: string;
  product_name: string;
  reviews: string[];
  sellerregistered: string | null;
  sku: string;
}

export interface ReviewList {
  _id: string;
  approved: boolean;
  archived: boolean;
  created_at: string;
  product: RviewProduct;
  reviews_details: ReviewDetail;
  user: ReviewUser;
}

export interface PublishBlogProps {
  title: string;
  subtitle?: string;
  slug: string;
  author?: string;
  blogContent: string;
  keywords?: string[];
  published?: boolean;
  coverImage?: string;
  created_at?: Date;
  updated_at?: Date;
  isArchived?: boolean;
}

export interface CreateContentItemProps {
  contentKey: string;
  description?: string;
  type: string;
  content: any;
}
