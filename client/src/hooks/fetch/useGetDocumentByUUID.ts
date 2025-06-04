'use client';

import {ENDPOINT} from '@constants/endpoint';
import {useFetch} from '@hooks/useFetch';
import {WikiDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetDocumentByUUID = (uuid: string) => {
  // TODO: 현재는 백엔드 서버로 직접 호출, 서버 -> 서버로 호출하는 방식으로 변경 필요 (현재는 client->server로 호출 중)
  const getDocumentByUUID = async (uuid: string): Promise<WikiDocument> => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${ENDPOINT.getDocumentByUUID}/${uuid}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.message || JSON.stringify(errorData) || 'API 요청 실패';
      throw new Error(errorMessage);
    }

    return response.json() as Promise<WikiDocument>;
  };

  const getData = useCallback(() => getDocumentByUUID(uuid), [uuid]);

  const {data} = useFetch<WikiDocument>(getData);

  return {
    document: data,
  };
};
