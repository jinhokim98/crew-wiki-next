import {getDocumentTitleListClient} from '@apis/client/document';
import {useFetch} from '@hooks/useFetch';

export const useGetDocumentTitleList = () => {
  const {data} = useFetch<string[]>(getDocumentTitleListClient);

  return {
    titles: data,
  };
};
