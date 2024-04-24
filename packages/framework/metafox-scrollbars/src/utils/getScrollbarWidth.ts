import css from 'dom-css';
let scrollbarWidth: number | false = false;

export default function getScrollbarWidth(): number {
  if (false !== scrollbarWidth) return scrollbarWidth;

  /* istanbul ignore else */
  if ('undefined' !== typeof document) {
    const div = document.createElement('div');

    css(div, {
      width: 100,
      height: 100,
      position: 'absolute',
      top: -9999,
      overflow: 'scroll',
      MsOverflowStyle: 'scrollbar'
    });
    document.body.appendChild(div);
    scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  } else {
    scrollbarWidth = 14;
  }

  return scrollbarWidth || 0;
}
