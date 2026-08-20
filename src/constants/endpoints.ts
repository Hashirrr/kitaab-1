export const ENDPOINTS = {
  login: '/auth/login',
  get_deeds: (type: string) => `/deeds/${type}/items`,
  create_deeds: (type: string) => `/deeds/${type}/items`,
  update_deed: (id: string, type: string) => `/deeds/${type}/items/${id}`,
  delete_deed: (id: string, type: string) => `/deeds/${type}/items/${id}`,
  update_deeds_display_order: (type: string) => `/deeds/${type}/items/display-order`,
  get_scales: (id: string) => `/scales/${id}/items`,
  create_scales: (id: string) => `/scales/${id}/items`
};