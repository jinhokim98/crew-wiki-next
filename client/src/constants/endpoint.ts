export const ENDPOINT = {
  postDocument: '/document',
  updateDocument: '/document',
  getDocumentByTitle: '/document',
  getDocumentByUUID: '/document/uuid',
  getRandomDocument: '/document',
  getRecentlyDocuments: '/document/recent',
  getDocumentSearch: '/document/search',
  getDocumentLogsByTitle: (title: string) => `/document/${title}/log`,
  getDocumentLogsByUUID: (uuid: string) => `/document/uuid/${uuid}/log`,
  getSpecificDocumentLog: (logId: number) => `/document/log/${logId}`,
  postAdminLogin: '/admin/login',
} as const;
