export function loadScript(src: string, callback: () => void): void {
  const script: HTMLScriptElement = document.createElement('script');
  const head: HTMLHeadElement = document.getElementsByTagName('head')[0];

  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.src = src;

  if ('addEventListener' in script) {
    script.addEventListener(
      'load',
      () => {
        callback();
      },
      false,
    );
  } else if ('attachEvent' in script) {
    // 兼容旧浏览器（如 IE8）使用 attachEvent
    (script as any).attachEvent('onreadystatechange', function (this: HTMLScriptElement): void {
      // this 指向 script 元素
      const state = (this as Partial<HTMLScriptElement> & { readyState?: string }).readyState;
      if (state === 'loaded' || state === 'complete') {
        callback();
      }
    });
  }

  head.appendChild(script);
}
