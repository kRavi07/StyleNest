import axiosInstance, { setAuthToken } from "./axiosInstace";
import {
  AddProductProps,
  SellerOwnerDetails,
  SellerRegistrationProps,
} from "../query.type";
import { getSellerToken, handleError } from "../util";

export const addProduct = async ({
  product_name,
  discription,
  price,
  category,
  files,
  attributes,
  priceRange,
}: AddProductProps) => {
  try {
    const token = getSellerToken();

    if (!token) {
      throw new Error("Token not found");
    }

    if (!files) {
      throw new Error("Files not found");
    }

    const attributesList = JSON.stringify(attributes);
    const priceRangeJson = JSON.stringify(priceRange);

    const formData = new FormData();

    formData.append("product_name", product_name);
    formData.append("discription", discription);
    formData.append("price", price);
    formData.append("category", category);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("attributes", attributesList);
    formData.append("priceRange", priceRangeJson);

    const res = await axiosInstance.post(
      `/admin/add-product`,
      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

export const getAllProducts = async () => {
  try {
    const token = getSellerToken();
    setAuthToken(token);
    const res = await axiosInstance.get(`/seller/products`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateSellerBusinessDetails = async ({
  Company_name,
  businessentity,
  businesstype,
  pan,
  yearestablished,
  gstin,
  cin,
  llpin,
  noofemployee,
  companyorigin,
  permanenetaddress,
  panFile,
  cinFile,
  gstinFile,
  llpinFile,
  profile_picture,
}: SellerRegistrationProps) => {
  try {
    const token = getSellerToken();
    let formData = new FormData();

    if (Company_name !== undefined) {
      formData.append("Company_name", Company_name);
    }

    if (businessentity !== undefined) {
      formData.append("businessentity", businessentity);
    }

    if (businesstype !== undefined) {
      formData.append("businesstype", businesstype);
    }

    if (pan !== undefined) {
      formData.append("pan", pan);
    }

    if (yearestablished !== undefined) {
      formData.append("yearestablished", yearestablished);
    }

    if (gstin !== undefined) {
      formData.append("gstin", gstin);
    }

    if (cin !== undefined) {
      formData.append("cin", cin);
    }

    if (llpin !== undefined) {
      formData.append("llpin", llpin);
    }

    if (noofemployee !== undefined) {
      formData.append("noofemployee", noofemployee);
    }

    if (companyorigin !== undefined) {
      formData.append("companyorigin", companyorigin);
    }

    if (permanenetaddress !== undefined) {
      formData.append("permanenetaddress", permanenetaddress);
    }

    if (profile_picture !== undefined) {
      formData.append("profile_picture", profile_picture);
    }

    if (panFile !== undefined) {
      formData.append("panFile", panFile);
    }

    if (cinFile !== undefined) {
      formData.append("cinFile", cinFile);
    }

    if (gstinFile !== undefined) {
      formData.append("gstinFile", gstinFile);
    }

    if (llpinFile !== undefined) {
      formData.append("llpinFile", llpinFile);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        token,
      },
    };
    const res = await axiosInstance.post(
      `/seller/update/business-details`,
      formData,
      config
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const confirmSellerPassword = async ({
  password,
}: {
  password: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("password", password);
    const token = getSellerToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        token,
      },
    };

    const res = await axiosInstance.post(
      `/seller/confirm-password`,
      formData,
      config
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateSellerPassword = async ({
  password,
  new_password,
}: {
  password: string;
  new_password: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("new_password", new_password);
    const token = getSellerToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        token,
      },
    };

    const res = await axiosInstance.post(
      `/seller/update-password`,
      formData,
      config
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifySellerOtp = async ({
  otp,
  mobileno,
}: {
  otp: string;
  mobileno: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("mobileno", mobileno);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axiosInstance.post(
      `/seller/verify-otp`,
      formData,
      config
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const UpdateProfileOwnerDetails = async ({
  mobileno,
  name,
  email,
  gender,
  dateofbirth,
  passportNo,
  passportDoc,
  pan,
  panDoc,
  aadharNumber,
  aadharDoc,
}: SellerOwnerDetails) => {
  try {
    const formData = new FormData();

    if (mobileno !== undefined) {
      formData.append("mobileno", mobileno);
    }

    if (name !== undefined) {
      formData.append("name", name);
    }

    if (email !== undefined) {
      formData.append("email", email);
    }

    if (gender !== undefined) {
      formData.append("gender", gender);
    }

    if (dateofbirth !== undefined) {
      formData.append("dateofbirth", dateofbirth);
    }

    if (passportNo !== undefined) {
      formData.append("passportNo", passportNo);
    }

    if (passportDoc !== undefined) {
      formData.append("passportDoc", passportDoc);
    }

    if (pan !== undefined) {
      formData.append("pan", pan);
    }

    if (panDoc !== undefined) {
      formData.append("panDoc", panDoc);
    }

    if (aadharNumber !== undefined) {
      formData.append("aadharNumber", aadharNumber);
    }

    if (aadharDoc !== undefined) {
      formData.append("aadharDoc", aadharDoc);
    }

    const token = getSellerToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        token,
      },
    };

    const res = await axiosInstance.post(
      `/seller/profile/update/owner-details`,
      formData,
      config
    );

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSellerSupportTickets = async () => {
  try {
    const token = getSellerToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        token,
      },
    };

    const res = await axiosInstance.get(`/seller/support-tickets`, config);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const sendSellerTicketChatMessage = async ({
  id,
  message,
}: {
  id: string;
  message: string;
}) => {
  try {
    const token = getSellerToken();

    const res = await axiosInstance.post(
      `/seller/ticket/chat/message/${id}`,
      {
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          token,
        },
      }
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

//toggle consent
export const toggleConsent = async () => {
  try {
    const token = await getSellerToken();
    setAuthToken(token);
    const res = await axiosInstance.post(`seller/toggle-admin-consent`);

    return res.data;
  } catch (error) {
    handleError(error);
  }
};
