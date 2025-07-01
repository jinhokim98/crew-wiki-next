'use server';

import {PostDocumentContent} from '@apis/document';
import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {WikiDocument} from '@type/Document.type';
import {requestPostServer} from '@http/server';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';
import {clearDocumentsCache} from '@utils/documentCache';

const postDocument = async (document: PostDocumentContent) => {
  const response = await requestPostServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.postDocument,
    body: document,
  });

  revalidateTag(CACHE.tag.getAllDocuments);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));
  clearDocumentsCache();
  return response;
};

export const POST = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    await postDocument(document);

    return NextResponse.json(document, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
