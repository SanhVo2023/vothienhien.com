/**
 * Detects browsers that cannot render this site correctly and shows a
 * graceful bilingual upgrade banner instead of a broken page.
 *
 * Why: Tailwind CSS v4 (this project's styling baseline) requires Safari 16.4+,
 * Chrome 111+, Firefox 128+. Below that, oklch() colors, @property registrations
 * and the relative-color-syntax bundled defaults all silently fail and the page
 * renders with collapsed transforms, missing colors and broken layout.
 *
 * The probe — CSS.supports('color', 'rgb(from red r g b)') — lit up in
 * exactly the three baseline versions above, so it doubles as a clean
 * one-line gate that matches Tailwind's own internal @supports query.
 *
 * Inlined into <head> so it runs before any stylesheet paints and before
 * hydration; the modal is built from inline-styled DOM so it does not depend
 * on Tailwind to look correct.
 */
type Props = { locale: string };

export default function BrowserCompat({ locale }: Props) {
  const isVi = locale === 'vi';
  const copy = isVi
    ? {
        title: 'Trình duyệt cần được cập nhật',
        body: 'Trang web này sử dụng các tính năng web hiện đại chỉ khả dụng trên Safari 16.4 trở lên (macOS Ventura 13 hoặc mới hơn), Chrome 111+ hoặc Firefox 128+. Vui lòng cập nhật trình duyệt hoặc hệ điều hành để xem trang đầy đủ.',
        update: 'Hướng dẫn cập nhật Safari',
        dismiss: 'Vẫn tiếp tục',
        contact: 'Hoặc liên hệ trực tiếp',
      }
    : {
        title: 'Browser update required',
        body: 'This site uses modern web features that require Safari 16.4 or later (macOS Ventura 13 or newer), Chrome 111+, or Firefox 128+. Please update your browser or operating system to view this site properly.',
        update: 'How to update Safari',
        dismiss: 'Continue anyway',
        contact: 'Or contact us directly',
      };

  // Safe to inline — the JSON.stringify on each field guards against any quote / </script> escape.
  const script = `
(function(){
  try {
    if (typeof window === 'undefined' || !window.CSS || !CSS.supports) return;
    if (CSS.supports('color', 'rgb(from red r g b)')) return;
    if (sessionStorage.getItem('vth-browser-compat-dismissed') === '1') return;
    var copy = {
      title: ${JSON.stringify(copy.title)},
      body: ${JSON.stringify(copy.body)},
      update: ${JSON.stringify(copy.update)},
      dismiss: ${JSON.stringify(copy.dismiss)},
      contact: ${JSON.stringify(copy.contact)}
    };
    var overlay = document.createElement('div');
    overlay.id = 'vth-browser-compat';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'vth-bc-title');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(10,10,10,0.92);display:flex;align-items:center;justify-content:center;padding:24px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#fff;-webkit-font-smoothing:antialiased;';
    overlay.innerHTML =
      '<div style="max-width:560px;width:100%;background:#0A0A0A;border:1px solid rgba(197,165,90,0.3);padding:40px 32px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,0.6);">' +
        '<div style="width:48px;height:1px;background:#C5A55A;margin:0 auto 24px;"></div>' +
        '<h2 id="vth-bc-title" style="font-size:22px;font-weight:600;color:#C5A55A;margin:0 0 16px;letter-spacing:0.02em;">' + copy.title + '</h2>' +
        '<p style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.78);margin:0 0 24px;">' + copy.body + '</p>' +
        '<div style="display:flex;flex-direction:column;gap:10px;align-items:stretch;">' +
          '<a href="https://support.apple.com/en-us/108382" target="_blank" rel="noopener" style="display:inline-block;padding:12px 24px;background:#C5A55A;color:#0A0A0A;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">' + copy.update + '</a>' +
          '<a href="mailto:contact@apolo.com.vn" style="display:inline-block;padding:12px 24px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.25);text-decoration:none;font-size:13px;font-weight:500;letter-spacing:0.08em;">' + copy.contact + ': contact@apolo.com.vn</a>' +
          '<button type="button" id="vth-bc-dismiss" style="margin-top:8px;padding:10px;background:none;border:0;color:rgba(255,255,255,0.45);font-size:12px;cursor:pointer;letter-spacing:0.06em;text-decoration:underline;">' + copy.dismiss + '</button>' +
        '</div>' +
      '</div>';
    var append = function(){
      if (!document.body) { setTimeout(append, 30); return; }
      document.body.appendChild(overlay);
      document.documentElement.style.overflow = 'hidden';
      var btn = document.getElementById('vth-bc-dismiss');
      if (btn) btn.addEventListener('click', function(){
        try { sessionStorage.setItem('vth-browser-compat-dismissed', '1'); } catch (e) {}
        overlay.remove();
        document.documentElement.style.overflow = '';
      });
    };
    append();
  } catch (e) { /* fail-open: never block site over a probe error */ }
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
