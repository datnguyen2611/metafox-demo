import draftToHtml from 'draftjs-to-html';

const parseHtml = data =>
  draftToHtml(data, undefined, false, ({ type, data }) => {
    if (type === 'IMAGE') {
      const alignment = data.alignment || 'none';
      const textAlign = alignment === 'none' ? 'center' : alignment;

      // eslint-disable-next-line max-len
      return `<div style="text-align:${textAlign};"><img style="width: ${data.width};height: ${data.height}" src="${data.src}"></img></div>`;
    }

    if (type === 'EMBEDDED_LINK') {
      const alignment = data.alignment || 'none';
      const textAlign = alignment === 'none' ? 'center' : alignment;

      // eslint-disable-next-line max-len
      return `<span style="text-align:${textAlign};"><iframe width="${data.width}" height="${data.height}" src="${data.src}" frameborder="0"></iframe></span>`;
    }
  });
export default parseHtml;
