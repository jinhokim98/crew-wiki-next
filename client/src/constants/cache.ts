// ISR : cache 시간 어떻게 가져갈 지 논의
// revalidate 1s
export const CACHE = {
  time: {
    basicRevalidate: 43200, // 12 hours
    longRevalidate: 604800, // 7 days
  },
  tag: {
    getDocuments: 'documents',
    getAllDocuments: 'all-documents',
    getDocumentByTitle: (title: string) => `title:${decodeURI(title)}`,
    getDocumentByUUID: (uuid: string) => `title:${uuid}`,
    getRecentlyDocuments: 'recently',
    getDocumentLogsByUUID: (uuid: string) => `logs:${uuid}`,
    getSpecificDocumentLog: (logId: number) => `specificLog:${logId}`,
    getDocumentSearch: 'search',
    getRandomDocument: 'random',
  },
} as const;
