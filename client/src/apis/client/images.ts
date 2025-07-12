'use client';

import {ENDPOINT} from '@constants/endpoint';
import {requestGetClient} from '@http/client';
import Resizer from 'react-image-file-resizer';

type PresignedUrlResponse = {
  url: string;
};

const uploadImageToS3 = async (uploadImageKey: string, image: File) => {
  const {url} = await requestGetClient<PresignedUrlResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: `${ENDPOINT.getPresignedUrl}/${uploadImageKey}`,
  });

  await fetch(url, {
    method: 'PUT',
    body: image,
    headers: {
      'Content-Type': 'image/jpeg',
      'x-amz-meta-filetype': 'image/jpeg',
      'x-amz-meta-content-type': 'image/jpeg',
    },
  });
};

const resizeFile = (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      640,
      640,
      'JPEG',
      70,
      0,
      uri => {
        if (uri instanceof File) {
          resolve(uri);
        } else {
          reject(new Error('이미지 리사이징에 실패했습니다.'));
        }
      },
      'file',
    );
  });

export async function uploadImage(documentUUID: string, imageFile: File) {
  const randomFileName = Math.random().toString(36).substr(2, 11);
  const resizedImage = await resizeFile(imageFile);
  const extension = resizedImage.type.split('/')[1];
  const uploadImageKey = `${documentUUID}/${randomFileName}.${extension}`;

  try {
    await uploadImageToS3(uploadImageKey, resizedImage);
  } catch (err) {
    console.error('이미지 업로드에 실패했습니다.', err);
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  return `${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN}/${uploadImageKey}`;
}
