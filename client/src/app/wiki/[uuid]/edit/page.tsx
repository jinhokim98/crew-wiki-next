'use client';

import PostHeader from '@components/document/Write/PostHeader';
import {DocumentWriteContextProvider, useDocumentWriteContext} from '@context/DocumentWriteContext';
import TitleInputField from '@components/document/Write/TitleInputField';
import TuiEditor from '@components/document/TuiEditor';
import {useParams} from 'next/navigation';
import {useGetDocumentByUUID} from '@hooks/fetch/useGetDocumentByUUID';

const EditPage = () => {
  const {contentsProps} = useDocumentWriteContext();

  return (
    <>
      <PostHeader />
      <TitleInputField disabled />
      <TuiEditor initialValue={contentsProps.initialContents} />
    </>
  );
};

const Page = () => {
  const {uuid} = useParams();
  const {document} = useGetDocumentByUUID(uuid as string);
  return (
    document && (
      <DocumentWriteContextProvider mode="edit" title={document.title} contents={document.contents}>
        <EditPage />
      </DocumentWriteContextProvider>
    )
  );
};

export default Page;
