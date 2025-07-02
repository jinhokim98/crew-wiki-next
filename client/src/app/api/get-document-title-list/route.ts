'use server';

import {getDocumentsMap} from '@utils/documentCache';
import {NextResponse} from 'next/server';

export const GET = async () => {
  const documentMap = await getDocumentsMap();
  const titles = [...documentMap].map(([, value]) => value.title);

  const response = {
    data: titles,
    code: 'SUCCESS',
  };

  try {
    return NextResponse.json(response, {status: 200});
  } catch (error) {
    return NextResponse.json({error}, {status: 500});
  }
};
