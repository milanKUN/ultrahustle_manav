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

export const createListing = async (payload) => {
  try {
    const formData = new FormData();

    formData.append("listing_type", payload.listing_type || "");
    formData.append("status", payload.status || "published");
    formData.append("title", payload.title || "");
    formData.append("category", payload.category || "");
    formData.append("sub_category", payload.sub_category || "");
    formData.append("short_description", payload.short_description || "");
    formData.append("about", payload.about || "");
    formData.append("ai_powered", payload.ai_powered ? "1" : "0");
    formData.append("seller_mode", payload.seller_mode || "Solo");
    formData.append("team_name", payload.team_name || "");

    if (payload.cover_file) {
      formData.append("cover_file", payload.cover_file);
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
      if (item.file) {
        formData.append(`deliverables[${index}][file]`, item.file);
      }
      formData.append(`deliverables[${index}][notes]`, item.notes || "");
    });

    const details = payload.details || {};

    if (details.product_type) {
      formData.append("details[product_type]", details.product_type);
    }

    if (details.course_level) {
      formData.append("details[course_level]", details.course_level);
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

    if (details.preview_video_file) {
      formData.append("details[preview_video_file]", details.preview_video_file);
    }

    if (details.ticket_price) {
      formData.append("details[ticket_price]", details.ticket_price);
    }

    if (details.webinar_level) {
      formData.append("details[webinar_level]", details.webinar_level);
    }

    if (details.schedule_date) {
      formData.append("details[schedule_date]", details.schedule_date);
    }

    if (details.schedule_start_time) {
      formData.append("details[schedule_start_time]", details.schedule_start_time);
    }

    if (details.schedule_duration) {
      formData.append("details[schedule_duration]", details.schedule_duration);
    }

    if (details.schedule_timezone) {
      formData.append("details[schedule_timezone]", details.schedule_timezone);
    }

    if (details.webinar_link) {
      formData.append("details[webinar_link]", details.webinar_link);
    }

    (details.learning_points || []).forEach((point, index) => {
      formData.append(`details[learning_points][${index}]`, point);
    });

    (details.languages || []).forEach((language, index) => {
      formData.append(`details[languages][${index}]`, language);
    });

    (details.tools || []).forEach((tool, index) => {
      formData.append(`details[tools][${index}]`, tool);
    });

    (details.agenda || []).forEach((item, index) => {
      formData.append(`details[agenda][${index}][time]`, item.time || "");
      formData.append(`details[agenda][${index}][topic]`, item.topic || "");
      formData.append(`details[agenda][${index}][description]`, item.description || "");
    });

    (details.lessons || []).forEach((lesson, index) => {
      formData.append(`details[lessons][${index}][title]`, lesson.title || "");
      formData.append(`details[lessons][${index}][description]`, lesson.description || "");
      formData.append(`details[lessons][${index}][media_type]`, lesson.media_type || "");

      if (lesson.media_file) {
        formData.append(`details[lessons][${index}][media_file]`, lesson.media_file);
      }
    });

    Object.entries(details.packages || {}).forEach(([packageName, pkg], index) => {
      formData.append(`details[packages][${index}][package_name]`, packageName);
      formData.append(`details[packages][${index}][price]`, pkg.price || "");

      (pkg.included || []).forEach((item, itemIndex) => {
        formData.append(`details[packages][${index}][included][${itemIndex}]`, item);
      });

      (pkg.deliveryFormats || []).forEach((item, itemIndex) => {
        formData.append(`details[packages][${index}][deliveryFormats][${itemIndex}]`, item);
      });
    });

    const res = await api.post("/api/v1/listings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

//my listings
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

export const updateListing = async (username, payload) => {
  try {
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("listing_type", payload.listing_type || "");
    formData.append("status", payload.status || "published");
    formData.append("title", payload.title || "");
    formData.append("category", payload.category || "");
    formData.append("sub_category", payload.sub_category || "");
    formData.append("short_description", payload.short_description || "");
    formData.append("about", payload.about || "");
    formData.append("ai_powered", payload.ai_powered ? "1" : "0");
    formData.append("seller_mode", payload.seller_mode || "Solo");
    formData.append("team_name", payload.team_name || "");

    if (payload.cover_file) {
      formData.append("cover_file", payload.cover_file);
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
      if (item.file) {
        formData.append(`deliverables[${index}][file]`, item.file);
      }
      formData.append(`deliverables[${index}][notes]`, item.notes || "");
    });

    const details = payload.details || {};

    if (details.course_level) {
      formData.append("details[course_level]", details.course_level);
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

    if (details.preview_video_file) {
      formData.append("details[preview_video_file]", details.preview_video_file);
    }

    (details.lessons || []).forEach((lesson, index) => {
      formData.append(`details[lessons][${index}][title]`, lesson.title || "");
      formData.append(`details[lessons][${index}][description]`, lesson.description || "");
      formData.append(`details[lessons][${index}][media_type]`, lesson.media_type || "");

      if (lesson.media_file) {
        formData.append(`details[lessons][${index}][media_file]`, lesson.media_file);
      }
    });
    
    if (details.webinar_level) {
      formData.append("details[webinar_level]", details.webinar_level);
    }
    if (details.ticket_price) {
      formData.append("details[ticket_price]", details.ticket_price);
    }
    if (details.schedule_date) {
      formData.append("details[schedule_date]", details.schedule_date);
    }
    if (details.schedule_start_time) {
      formData.append("details[schedule_start_time]", details.schedule_start_time);
    }
    if (details.schedule_duration) {
      formData.append("details[schedule_duration]", details.schedule_duration);
    }
    if (details.schedule_timezone) {
      formData.append("details[schedule_timezone]", details.schedule_timezone);
    }
    if (details.webinar_link) {
      formData.append("details[webinar_link]", details.webinar_link);
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

    (details.agenda || []).forEach((item, index) => {
      formData.append(`details[agenda][${index}][time]`, item.time || "");
      formData.append(`details[agenda][${index}][topic]`, item.topic || "");
      formData.append(`details[agenda][${index}][description]`, item.description || "");
    });

    const res = await api.post(`/api/v1/listings/${encodeURIComponent(username)}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

//get my teams
export const getMyTeams = async () => {
  try {
    const res = await api.get("/api/v1/my-teams");
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

//fetch all languages
export const getLanguages = async () => {
  try {
    const res = await api.get("/api/v1/languages");
    return unwrap(res);
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};