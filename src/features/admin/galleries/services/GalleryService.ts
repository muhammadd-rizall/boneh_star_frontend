import api from "@/api/Axios";
import type { Gallery, GalleryFormData } from "../types/Gallery";

export const ENDPOINTS = {
  BASE: "/admin/galleries",
  PUBLIC: "/public/galleries",
};

export const galleryService = {
  getAll: async (params?: { page?: number; search?: string }): Promise<{ data: Gallery[] }> => {
    const response = await api.get(ENDPOINTS.BASE, { params });
    return response.data;
  },

  getPublic: async (): Promise<{ data: Gallery[] }> => {
    const response = await api.get(ENDPOINTS.PUBLIC);
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Gallery }> => {
    const response = await api.get(`${ENDPOINTS.BASE}/${id}`);
    return response.data;
  },

  create: async (data: GalleryFormData): Promise<{ data: Gallery }> => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.date) formData.append("date", data.date);
    formData.append("is_publish", data.is_publish ? "1" : "0");
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    const response = await api.post(ENDPOINTS.BASE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: string, data: GalleryFormData): Promise<{ data: Gallery }> => {
    const formData = new FormData();
    // Use POST with _method=PUT for Laravel when sending multipart/form-data
    formData.append("_method", "PUT");
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.date) formData.append("date", data.date);
    formData.append("is_publish", data.is_publish ? "1" : "0");
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    if (data.deleted_images && data.deleted_images.length > 0) {
      data.deleted_images.forEach((imagePath, index) => {
        formData.append(`deleted_images[${index}]`, imagePath);
      });
    }

    const response = await api.post(`${ENDPOINTS.BASE}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${ENDPOINTS.BASE}/${id}`);
  },
};
