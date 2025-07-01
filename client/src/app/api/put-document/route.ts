'use server';

import {PostDocumentContent} from '@apis/document';

import {WikiDocument} from '@type/Document.type';
import {ENDPOINT} from '@constants/endpoint';
import {requestPutServer} from '@http/server';
import {NextRequest, NextResponse} from 'next/server';
import {revalidateTag} from 'next/cache';
import {CACHE} from '@constants/cache';
import {clearDocumentsCache} from '@utils/documentCache';

const putDocument = async (document: PostDocumentContent) => {
  const response = await requestPutServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.updateDocument,
    body: document,
  });

  revalidateTag(CACHE.tag.getAllDocuments);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));
  clearDocumentsCache();

  return response;
};

export const PUT = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    await putDocument(document);

    return NextResponse.json(document, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
