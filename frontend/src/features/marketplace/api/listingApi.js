import axios from "axios";
import { getAuthToken } from "../../auth/api/authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const unwrap = (res) => res?.data;

const extractErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) return error?.message || "Request failed";
  if (typeof data === "string") return data;

  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstValue = data.errors[firstKey];

    if (Array.isArray(firstValue) && firstValue[0]) return firstValue[0];
    if (typeof firstValue === "string") return firstValue;
  }

  if (data.message) return data.message;
  return "Request failed";
};

export const getMyListings = async () => {
  try {
    const res = await api.get("/api/v1/my-listings");
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getListingByUsername = async (username) => {
  try {
    const res = await api.get(`/api/v1/listings/${encodeURIComponent(username)}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getListingDropdowns = async (listingTypeSlug, params = {}) => {
  try {
    const res = await api.get(`/api/v1/listing-dropdowns/${listingTypeSlug}`, { params });
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getLanguages = async () => {
  try {
    const res = await api.get("/api/v1/languages");
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};


export const getPublicDigitalProductListing = async ({ username, listingId }) => {
  try {
    const res = await api.get(`/api/v1/digital-products/${username}/${listingId}`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getPublicUserListings = async (username) => {
  try {
    const res = await api.get(`/api/v1/public/users/${encodeURIComponent(username)}/listings`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getAllMarketplaceListings = async () => {
  try {
    const res = await api.get(`/api/v1/public/marketplace/listings`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getMarketplaceCategories = async () => {
  try {
    const res = await api.get(`/api/v1/public/marketplace/categories`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const getMarketplaceLanguages = async () => {
  try {
    const res = await api.get(`/api/v1/public/marketplace/languages`);
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

//get my teams
export const getMyTeams = async () => {
  try {
    const res = await api.get("/api/v1/my-teams");
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};



const appendCommonListingFields = (formData, payload) => {
  formData.append("listing_type", payload.listing_type || "");
  formData.append("status", payload.status || "published");
  formData.append("title", payload.title || "");
  formData.append("category", payload.category || "");
  formData.append("sub_category", payload.sub_category || "");
  formData.append("short_description", payload.short_description || "");
  formData.append("about", payload.about || "");
  formData.append("ai_powered", payload.ai_powered ? "1" : "0");

  if (payload.seller_mode) formData.append("seller_mode", payload.seller_mode);
  if (payload.team_name) formData.append("team_name", payload.team_name);

  if (payload.cover_files && Array.isArray(payload.cover_files)) {
    payload.cover_files.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`cover_files[${index}]`, file);
      }
    });
  } else if (payload.cover_file instanceof File) {
    formData.append("cover_file", payload.cover_file);
  }

  if (payload.existing_cover_urls && Array.isArray(payload.existing_cover_urls)) {
    payload.existing_cover_urls.forEach((url, index) => {
      if (url) formData.append(`existing_cover_urls[${index}]`, url);
    });
  }

  (payload.tags || []).forEach((tag, index) => {
    formData.append(`tags[${index}]`, tag);
  });

  (payload.faqs || []).forEach((faq, index) => {
    formData.append(`faqs[${index}][q]`, faq.q || "");
    formData.append(`faqs[${index}][a]`, faq.a || "");
  });

  (payload.links || []).forEach((link, index) => {
    formData.append(`links[${index}]`, link);
  });

  (payload.deliverables || []).forEach((item, index) => {
    if (item.file instanceof File) {
      formData.append(`deliverables[${index}][file]`, item.file);
    }
    formData.append(`deliverables[${index}][notes]`, item.notes || "");
    if (item.existing_file_url) {
      formData.append(
        `deliverables[${index}][existing_file_url]`,
        item.existing_file_url
      );
      if (item.existing_file_name) {
        formData.append(
          `deliverables[${index}][existing_file_name]`,
          item.existing_file_name
        );
      }
      if (item.file_size) {
        formData.append(
          `deliverables[${index}][file_size]`,
          item.file_size
        );
      }
    }
  });

  (payload.portfolio_projects || []).forEach((project, index) => {
    formData.append(`portfolio_projects[${index}][title]`, project.title || "");
    formData.append(
      `portfolio_projects[${index}][description]`,
      project.description || ""
    );
    formData.append(`portfolio_projects[${index}][cost]`, project.cost || "");
    formData.append(
      `portfolio_projects[${index}][sort_order]`,
      project.sort_order ?? index
    );

    (project.files || []).forEach((file, fileIndex) => {
      if (file instanceof File) {
        formData.append(
          `portfolio_projects[${index}][files][${fileIndex}]`,
          file
        );
      }
    });

    (project.existing_media || project.media || []).forEach((m, mIdx) => {
      const path = typeof m === "string" ? m : m.path || m.url;
      if (path && typeof path === "string" && !path.startsWith("blob:")) {
        formData.append(
          `portfolio_projects[${index}][existing_media][${mIdx}]`,
          path
        );
      }
    });
  });
};

const appendDetails = (formData, details = {}) => {
  if (details.product_type) {
    formData.append("details[product_type]", details.product_type);
  }

  if (
    details.price !== undefined &&
    details.price !== null &&
    details.price !== ""
  ) {
    formData.append("details[price]", details.price);
  }

  (details.included || []).forEach((item, index) => {
    formData.append(`details[included][${index}]`, item);
  });

  if (details.delivery_format) {
    formData.append("details[delivery_format]", details.delivery_format);
  }

  (details.tools || []).forEach((tool, index) => {
    formData.append(`details[tools][${index}]`, tool);
  });

  (details.learning_points || []).forEach((point, index) => {
    formData.append(`details[learning_points][${index}]`, point);
  });

  (details.languages || []).forEach((language, index) => {
    formData.append(`details[languages][${index}]`, language);
  });

  (details.key_outcomes || []).forEach((item, index) => {
    formData.append(`details[key_outcomes][${index}]`, item);
  });

  if (details.course_level) {
    formData.append("details[course_level]", details.course_level);
  }

  if (
    details.ticket_price !== undefined &&
    details.ticket_price !== null &&
    details.ticket_price !== ""
  ) {
    formData.append("details[ticket_price]", details.ticket_price);
  }

  if (details.schedule_date) {
    formData.append("details[schedule_date]", details.schedule_date);
  }

  if (details.schedule_start_time) {
    formData.append("details[schedule_start_time]", details.schedule_start_time);
  }

  if (
    details.schedule_duration !== undefined &&
    details.schedule_duration !== null &&
    details.schedule_duration !== ""
  ) {
    formData.append("details[schedule_duration]", details.schedule_duration);
  }

  if (details.schedule_timezone) {
    formData.append("details[schedule_timezone]", details.schedule_timezone);
  }

  if (details.webinar_link) {
    formData.append("details[webinar_link]", details.webinar_link);
  }

  (details.agenda || []).forEach((item, index) => {
    formData.append(`details[agenda][${index}][time]`, item.time || "");
    formData.append(`details[agenda][${index}][topic]`, item.topic || "");
    formData.append(
      `details[agenda][${index}][description]`,
      item.description || ""
    );
  });

  if (details.preview_video_file instanceof File) {
    formData.append("details[preview_video_file]", details.preview_video_file);
  }

  if ("existing_preview_video_url" in details) {
    formData.append(
      "details[existing_preview_video_url]",
      details.existing_preview_video_url ?? ""
    );
  }

  (details.lessons || []).forEach((lesson, index) => {
    formData.append(`details[lessons][${index}][title]`, lesson.title || "");
    formData.append(
      `details[lessons][${index}][description]`,
      lesson.description || ""
    );
    formData.append(
      `details[lessons][${index}][media_type]`,
      lesson.media_type || ""
    );
    formData.append(
      `details[lessons][${index}][existing_media_url]`,
      lesson.existing_media_url || ""
    );
    formData.append(
      `details[lessons][${index}][existing_media_path]`,
      lesson.existing_media_path || ""
    );

    if (lesson.media_file instanceof File) {
      formData.append(`details[lessons][${index}][media_file]`, lesson.media_file);
    }
  });

  (details.packages || []).forEach((pkg, index) => {
    formData.append(
      `details[packages][${index}][package_name]`,
      pkg.package_name || pkg.packageName || ""
    );
    formData.append(`details[packages][${index}][price]`, pkg.price ?? "");
    formData.append(
      `details[packages][${index}][delivery_days]`,
      pkg.delivery_days ?? pkg.deliveryDays ?? ""
    );
    formData.append(
      `details[packages][${index}][revisions]`,
      pkg.revisions ?? ""
    );
    formData.append(`details[packages][${index}][scope]`, pkg.scope || "");

    (pkg.included || []).forEach((item, itemIndex) => {
      formData.append(
        `details[packages][${index}][included][${itemIndex}]`,
        item
      );
    });

    (pkg.how_it_works || pkg.howItWorks || []).forEach((item, itemIndex) => {
      formData.append(
        `details[packages][${index}][how_it_works][${itemIndex}]`,
        item
      );
    });

    (pkg.not_included || pkg.notIncluded || []).forEach((item, itemIndex) => {
      formData.append(
        `details[packages][${index}][not_included][${itemIndex}]`,
        item
      );
    });

    (pkg.tools_used || pkg.toolsUsed || []).forEach((item, itemIndex) => {
      formData.append(
        `details[packages][${index}][tools_used][${itemIndex}]`,
        item
      );
    });

    formData.append(
      `details[packages][${index}][delivery_format]`,
      pkg.delivery_format || pkg.deliveryFormat || ""
    );
  });

  (details.add_ons || details.addOns || []).forEach((item, index) => {
    formData.append(`details[add_ons][${index}][name]`, item.name || "");
    formData.append(`details[add_ons][${index}][price]`, item.price ?? "");
    formData.append(`details[add_ons][${index}][days]`, item.days ?? "");
  });
};

export const createListing = async (payload) => {
  try {
    const formData = new FormData();
    appendCommonListingFields(formData, payload);
    appendDetails(formData, payload.details || {});

    const res = await api.post("/api/v1/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

export const updateListing = async (username, payload) => {
  try {
    const formData = new FormData();
    formData.append("_method", "PUT");
    appendCommonListingFields(formData, payload);
    appendDetails(formData, payload.details || {});

    const res = await api.post(
      `/api/v1/listings/${encodeURIComponent(username)}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};