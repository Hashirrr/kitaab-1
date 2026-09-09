export const ENDPOINTS = {
  login: '/auth/login',
  get_deeds: (type: string) => `/deeds/${type}/items`,
  create_deeds: (type: string) => `/deeds/${type}/items`,
  update_deed: (id: string, type: string) => `/deeds/${type}/items/${id}`,
  delete_deed: (id: string, type: string) => `/deeds/${type}/items/${id}`,
  update_deeds_display_order: (type: string) => `/deeds/${type}/items/display-order`,
  get_scales: (id: string) => `/scales/${id}/items`,
  create_scales: (id: string) => `/scales/${id}/items`,
  update_scale: (id: string, itemId: string) => `/scales/${id}/items/${itemId}`,
  delete_scale: (id: string, itemId: string) => `/scales/${id}/items/${itemId}`,
  update_scales_display_order: (id: string) => `/scales/${id}/items/display-order`,
  create_records: '/records',
  get_records: (date: string) => `/records/${date}`,
  get_records_range: (startDate: string, endDate: string) => `/records/range?start_date=${startDate}&end_date=${endDate}`,
  get_scale: (id: string) => `/scales/${id}`,
  update_scale_type: (id: string) => `/scales/${id}/type`
};