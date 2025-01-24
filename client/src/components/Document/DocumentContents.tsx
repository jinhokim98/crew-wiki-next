import {addDataIdToToc} from '@utils/addDataIdToToc';
import TOC from '../TOC/TOC';

import './toastui-editor-viewer.css';
import {AttachTocClickHandler} from '@components/TOC/AttachTocClickHandler';

interface DocumentContentsProps {
  contents: string;
}

const DocumentContents = ({contents}: DocumentContentsProps) => {
  const html = addDataIdToToc(contents);

  const extractDataIdsFromHtml = (htmlString: string) => {
    return htmlString.split('\n').filter(str => str.includes('data-id'));
  };

  return (
    <>
      <TOC headTags={extractDataIdsFromHtml(html)} />
      <AttachTocClickHandler />
      <section className="toastui-editor-contents" dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
};

export default DocumentContents;
