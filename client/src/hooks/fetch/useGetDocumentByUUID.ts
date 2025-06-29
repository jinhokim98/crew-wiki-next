'use client';

import {ENDPOINT} from '@constants/endpoint';
import {useFetch} from '@hooks/useFetch';
import {requestGetClient} from '@http/client';
import {WikiDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetDocumentByUUID = (uuid: string) => {
  const getDocumentByUUID = async (uuid: string) => {
    const response = await requestGetClient<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      endpoint: `${ENDPOINT.getDocumentByUUID}/${uuid}`,
    });

    return response;
  };

  const getData = useCallback(() => getDocumentByUUID(uuid), [uuid]);
  const {data} = useFetch<WikiDocument>(getData);

  return {
    document: data,
  };
};
