import {cache} from 'react';
import {getAllDocuments} from '@apis/document';
import {WikiDocumentExpand} from '@type/Document.type';

type DocumentsMap = Map<string, WikiDocumentExpand>;

export const getDocumentsMap = cache(async (): Promise<DocumentsMap> => {
  const list = await getAllDocuments();
  return new Map(list.map(document => [document.uuid, document]));
});
