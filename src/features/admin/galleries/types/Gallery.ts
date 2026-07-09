export interface Gallery {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  images: string[];
  image_urls: string[];
  is_publish: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryFormData {
  title: string;
  description?: string;
  date?: string;
  is_publish: boolean;
  images?: File[];
  deleted_images?: string[];
}

export interface GalleryApiResponse {
  status: string;
  message: string;
  data: Gallery;
}

export interface GalleriesApiResponse {
  status: string;
  message: string;
  data: Gallery[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
