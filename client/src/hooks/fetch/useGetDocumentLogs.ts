import {getDocumentLogsByUUIDClient} from '@apis/client/document';
import {WikiDocumentLogSummary} from '@type/Document.type';
import {useEffect, useState} from 'react';

export const useGetDocumentLogs = (uuid: string, initialData: WikiDocumentLogSummary[], totalPage: number) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<WikiDocumentLogSummary[]>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDocumentLogsByUUIDClient(uuid, {
        pageNumber: page,
        pageSize: 10,
        sort: 'ID',
        sortDirection: 'DESC',
      });

      setData(prev => [...prev, ...response.data]);
    };

    if (page > 0) {
      fetchData();
    }
  }, [page, uuid]);

  const fetchNextPage = () => {
    if (page >= totalPage) return;
    setPage(prev => prev + 1);
  };

  return {
    logs: data,
    fetchNextPage,
  };
};
