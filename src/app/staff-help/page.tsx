import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ── Password gate (internal staff only) ─────────────────────────────────────
// Lightweight shared-password gate via an httpOnly cookie. Not full auth — it
// keeps the operator guide off public eyes. Set HELP_PASSWORD in the env
// (Vercel) to override the default below.
const COOKIE = 'vth_help_auth';
const PASSWORD = process.env.HELP_PASSWORD || 'ApoloVTH@2026';

async function login(formData: FormData) {
  'use server';
  const pw = String(formData.get('password') || '').trim();
  if (pw && pw === PASSWORD) {
    const jar = await cookies();
    jar.set(COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    redirect('/admin/help');
  }
  redirect('/admin/help?e=1');
}

async function logout() {
  'use server';
  (await cookies()).delete(COOKIE);
  redirect('/admin/help');
}

export default async function StaffHelpPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const authed = (await cookies()).get(COOKIE)?.value === '1';
  const sp = await searchParams;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {authed ? <Guide /> : <Gate error={sp?.e === '1'} />}
    </>
  );
}

// ── Gate screen ─────────────────────────────────────────────────────────────
function Gate({ error }: { error: boolean }) {
  return (
    <main className="gate">
      <form action={login} className="gate-card">
        <div className="gate-mark">VH</div>
        <h1 className="gate-title">Khu vực nội bộ</h1>
        <p className="gate-sub">
          Trang hướng dẫn quản trị nội dung dành riêng cho nhân sự Apolo Lawyers.
          Vui lòng nhập mật khẩu để tiếp tục.
        </p>
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu nội bộ"
          autoFocus
          autoComplete="current-password"
          className="gate-input"
        />
        {error && <p className="gate-error">Mật khẩu không đúng. Vui lòng thử lại.</p>}
        <button type="submit" className="gate-btn">Truy cập hướng dẫn</button>
      </form>
    </main>
  );
}

// ── The guide ───────────────────────────────────────────────────────────────
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="step" id={`buoc-${n}`}>
      <div className="step-badge">{n}</div>
      <div className="step-body">
        <h3 className="step-title">{title}</h3>
        {children}
      </div>
    </section>
  );
}

function Guide() {
  return (
    <div className="wrap">
      <header className="topbar">
        <div className="topbar-in">
          <div className="brand">
            <span className="brand-mark">VH</span>
            <span className="brand-text">
              <strong>VÕ THIỆN HIỂN</strong>
              <small>Hướng dẫn quản trị nội dung</small>
            </span>
          </div>
          <form action={logout}>
            <button type="submit" className="logout">Đăng xuất</button>
          </form>
        </div>
      </header>

      <main className="page">
        <div className="hero">
          <span className="kicker">Tài liệu nội bộ</span>
          <h1>Hướng dẫn đăng bài viết trên hệ thống CMS</h1>
          <p className="lede">
            Tài liệu này hướng dẫn từng bước cách đăng một bài viết chuyên môn mới
            (song ngữ Việt – Anh) lên website <strong>vothienhien.com</strong> thông qua
            trang quản trị PayloadCMS. Dành cho nhân sự phụ trách nội dung.
          </p>
        </div>

        <nav className="toc" aria-label="Mục lục">
          <h2>Mục lục</h2>
          <ol>
            <li><a href="#buoc-1">Đăng nhập trang quản trị</a></li>
            <li><a href="#buoc-2">Tạo bài viết mới</a></li>
            <li><a href="#buoc-3">Điền các trường thông tin</a></li>
            <li><a href="#buoc-4">Nhập nội dung song ngữ (Việt &amp; Anh)</a></li>
            <li><a href="#buoc-5">Thêm ảnh đại diện</a></li>
            <li><a href="#buoc-6">Lưu &amp; xuất bản</a></li>
            <li><a href="#buoc-7">Kiểm tra bài đã lên web</a></li>
            <li><a href="#sua-go">Sửa hoặc gỡ bài</a></li>
            <li><a href="#seo">Mẹo viết chuẩn SEO</a></li>
            <li><a href="#checklist">Danh sách kiểm tra trước khi đăng</a></li>
            <li><a href="#su-co">Xử lý sự cố thường gặp</a></li>
          </ol>
        </nav>

        <Step n={1} title="Đăng nhập trang quản trị">
          <p>Mở trình duyệt và truy cập trang quản trị:</p>
          <ul>
            <li><b>Trên website thật:</b> <code>https://vothienhien.com/admin</code></li>
            <li><b>Khi chạy thử trên máy:</b> <code>http://localhost:3000/admin</code></li>
          </ul>
          <p>Nhập <b>email</b> và <b>mật khẩu</b> tài khoản quản trị của bạn, sau đó bấm <b>Login</b>.</p>
          <div className="callout warn">
            <b>Lưu ý:</b> Nếu trang <code>/admin</code> báo lỗi “This page couldn’t load”, nghĩa là
            cấu hình kết nối cơ sở dữ liệu trên máy chủ chưa đúng — báo cho bộ phận kỹ thuật
            (xem tài liệu <code>DEPLOYMENT.md</code>).
          </div>
        </Step>

        <Step n={2} title="Tạo bài viết mới">
          <ol>
            <li>Ở thanh menu bên trái, chọn mục <b>Publications</b> (Bài viết).</li>
            <li>Bấm nút <b>Create New</b> ở góc trên bên phải.</li>
            <li>Một biểu mẫu trống sẽ hiện ra để bạn nhập nội dung.</li>
          </ol>
        </Step>

        <Step n={3} title="Điền các trường thông tin">
          <p>Biểu mẫu gồm các trường sau:</p>
          <table className="fields">
            <thead>
              <tr><th>Trường</th><th>Bắt buộc</th><th>Mô tả</th></tr>
            </thead>
            <tbody>
              <tr><td><b>Title</b><br /><i>Tiêu đề</i></td><td className="req">Có</td><td>Tiêu đề bài viết. Cần nhập <b>cả tiếng Việt và tiếng Anh</b> (xem Bước 4).</td></tr>
              <tr><td><b>Slug</b><br /><i>Đường dẫn</i></td><td className="req">Có</td><td>Định danh trên đường link: <b>viết thường, không dấu, nối bằng dấu gạch ngang</b>. Ví dụ: <code>quyen-loi-nguoi-lao-dong</code>. Phải <b>không trùng</b> với bài khác. Nằm ở cột bên phải (sidebar).</td></tr>
              <tr><td><b>Content</b><br /><i>Nội dung</i></td><td>—</td><td>Nội dung bài viết, dùng trình soạn thảo. Nhập <b>cả hai ngôn ngữ</b>.</td></tr>
              <tr><td><b>Excerpt</b><br /><i>Tóm tắt</i></td><td>—</td><td>1–2 câu tóm tắt. Hiển thị trên thẻ danh sách và dùng làm mô tả SEO. Nhập <b>cả hai ngôn ngữ</b>.</td></tr>
              <tr><td><b>Published Date</b><br /><i>Ngày đăng</i></td><td>—</td><td>Ngày đăng bài. Bài được sắp xếp mới → cũ theo trường này.</td></tr>
              <tr><td><b>Category</b><br /><i>Chuyên mục</i></td><td>—</td><td>Chọn 1 trong: <b>Analysis</b> (Phân tích), <b>Guide</b> (Hướng dẫn), <b>Commentary</b> (Bình luận), <b>Case Study</b> (Nghiên cứu vụ việc).</td></tr>
              <tr><td><b>Practice Area</b><br /><i>Lĩnh vực</i></td><td>—</td><td>Liên kết tới lĩnh vực hành nghề liên quan (tùy chọn).</td></tr>
              <tr><td><b>Author</b><br /><i>Tác giả</i></td><td>—</td><td>Để mặc định <b>Apolo Editorial Team</b>. Chỉ chọn <b>Vo Thien Hien</b> nếu chính Luật sư là tác giả.</td></tr>
              <tr><td><b>Featured Image</b><br /><i>Ảnh đại diện</i></td><td>—</td><td>Ảnh minh hoạ bài viết — xem Bước 5.</td></tr>
            </tbody>
          </table>
          <div className="callout tip">
            <b>Quan trọng — Slug:</b> cùng một slug phục vụ cả hai ngôn ngữ
            (<code>/bai-viet-chuyen-mon/&lt;slug&gt;</code> cho tiếng Việt và
            <code>/legal-insights/&lt;slug&gt;</code> cho tiếng Anh). Hãy đặt slug
            <b> một lần</b> và <b>không đổi về sau</b> — đổi slug là đổi đường link,
            làm mất thứ hạng SEO và hỏng các link cũ.
          </div>
        </Step>

        <Step n={4} title="Nhập nội dung song ngữ (Việt & Anh)">
          <p>Ba trường <b>Title, Content, Excerpt</b> lưu riêng cho từng ngôn ngữ:</p>
          <ol>
            <li>Ở <b>góc trên</b> biểu mẫu có nút chuyển ngôn ngữ: <b>Tiếng Việt</b> / <b>English</b>.</li>
            <li>Chọn <b>Tiếng Việt</b> → nhập Tiêu đề, Nội dung, Tóm tắt bằng tiếng Việt.</li>
            <li>Bấm <b>Save</b>.</li>
            <li>Chuyển sang <b>English</b> → nhập lại Tiêu đề, Nội dung, Tóm tắt bằng tiếng Anh.</li>
            <li>Bấm <b>Save</b> lần nữa.</li>
          </ol>
          <div className="callout">
            Các trường <b>Slug, Ngày đăng, Chuyên mục, Ảnh đại diện, Tác giả</b> dùng
            chung cho cả hai ngôn ngữ — chỉ cần nhập một lần.
          </div>
        </Step>

        <Step n={5} title="Thêm ảnh đại diện (Featured Image)">
          <ol>
            <li>Tại trường <b>Featured Image</b>, bấm để mở thư viện ảnh.</li>
            <li>Chọn ảnh có sẵn trong <b>Media</b>, hoặc bấm <b>Upload</b> để tải ảnh mới lên.</li>
            <li>Nên dùng ảnh <b>nằm ngang</b>, kích thước khoảng <b>1200×630</b>, định dạng <code>.webp</code> hoặc <code>.jpg</code>, dung lượng dưới ~400&nbsp;KB.</li>
          </ol>
        </Step>

        <Step n={6} title="Lưu & xuất bản">
          <p>Kiểm tra đã nhập <b>cả hai ngôn ngữ</b> + <b>Slug</b> + <b>Ngày đăng</b> + <b>Chuyên mục</b>, rồi bấm <b>Save</b>.</p>
          <div className="callout tip">
            <b>Bài hiện trên web khi nào?</b> Website tự làm mới <b>mỗi 1 giờ</b>. Sau khi
            Save, bài mới sẽ tự xuất hiện trong vòng <b>tối đa 1 giờ</b> — không cần làm gì thêm.
            Nếu cần <b>hiện ngay</b>, báo kỹ thuật bấm <b>Redeploy</b> trên Vercel.
          </div>
        </Step>

        <Step n={7} title="Kiểm tra bài đã lên web">
          <p>Sau khi đăng, kiểm tra tại:</p>
          <ul>
            <li>Tiếng Việt: <code>https://vothienhien.com/vi/bai-viet-chuyen-mon</code></li>
            <li>Tiếng Anh: <code>https://vothienhien.com/en/legal-insights</code></li>
          </ul>
          <p>Kiểm tra nhanh bài đã vào hệ thống chưa: mở
            <code>https://vothienhien.com/api/publications?limit=5&amp;depth=0</code> —
            phải thấy bài mới trong danh sách.</p>
        </Step>

        <section className="block" id="sua-go">
          <h2>Sửa hoặc gỡ bài</h2>
          <ul>
            <li><b>Sửa:</b> vào <b>Publications</b> → bấm vào bài → chỉnh sửa → <b>Save</b> (chờ tối đa 1 giờ để cập nhật).</li>
            <li><b>Gỡ:</b> mở bài → bấm <b>Delete</b> ở góc trên. Bài sẽ biến mất khỏi website và sitemap trong chu kỳ làm mới kế tiếp.</li>
          </ul>
        </section>

        <section className="block" id="seo">
          <h2>Mẹo viết chuẩn SEO</h2>
          <ul>
            <li>Dùng <b>tiêu đề phụ (heading)</b> cho từng mục, <b>danh sách</b> cho các ý liệt kê, <b>in đậm</b> cho ý chính.</li>
            <li>Bài phân tích chuyên sâu nên có <b>tối thiểu 5 căn cứ pháp lý</b> (điều luật, nghị định...).</li>
            <li>Khi dẫn nguồn, chỉ liên kết tới trang chính phủ: <code>*.gov.vn</code> hoặc <code>vbpl.vn</code>.</li>
            <li>Liên kết nội bộ: nội dung tiếng Việt → <code>apolo.com.vn</code>; tiếng Anh → <code>apololawyers.com</code>.</li>
            <li><b>Tóm tắt (Excerpt)</b> nên hấp dẫn, đủ ý — đây chính là đoạn mô tả hiển thị trên Google.</li>
          </ul>
        </section>

        <section className="block checklist" id="checklist">
          <h2>Danh sách kiểm tra trước khi đăng</h2>
          <ul className="checks">
            <li><b>Title</b> — đã nhập cả tiếng Việt và tiếng Anh</li>
            <li><b>Slug</b> — viết thường, không dấu, không trùng, sẽ không đổi về sau</li>
            <li><b>Content</b> — đã nhập cả hai ngôn ngữ, có định dạng, dẫn nguồn <code>.gov.vn</code>/<code>vbpl.vn</code></li>
            <li><b>Excerpt</b> — 1–2 câu, cả hai ngôn ngữ</li>
            <li><b>Published Date</b> — đặt đúng ngày</li>
            <li><b>Category</b> — đã chọn chuyên mục</li>
            <li><b>Author</b> — Apolo Editorial Team (mặc định) hoặc Vo Thien Hien</li>
            <li><b>Featured Image</b> — đã tải ảnh ngang chất lượng tốt</li>
            <li>Đã bấm <b>Save</b> và kiểm tra bài hiển thị</li>
          </ul>
        </section>

        <section className="block" id="su-co">
          <h2>Xử lý sự cố thường gặp</h2>
          <div className="faq">
            <p className="q">Trang <code>/admin</code> báo lỗi “A server error occurred”.</p>
            <p>Máy chủ chưa kết nối được cơ sở dữ liệu — báo kỹ thuật kiểm tra biến môi trường
              <code>DATABASE_URI</code> / <code>PAYLOAD_SECRET</code> trên Vercel rồi Redeploy.</p>
            <p className="q">Đã Save nhưng bài chưa hiện trên web.</p>
            <p>Website làm mới mỗi 1 giờ — hãy đợi tối đa 60 phút, hoặc nhờ kỹ thuật bấm Redeploy để hiện ngay.</p>
            <p className="q">Bài hiện sai ngôn ngữ / thiếu một ngôn ngữ.</p>
            <p>Kiểm tra lại đã nhập đủ Title + Content + Excerpt ở <b>cả</b> Tiếng Việt và English (Bước 4).</p>
          </div>
        </section>

        <footer className="foot">
          <p>Tài liệu nội bộ — Apolo Lawyers · vothienhien.com</p>
          <p className="muted">Cập nhật 2026-05-29 · Phù hợp với cấu hình CMS hiện tại.</p>
        </footer>
      </main>
    </div>
  );
}

// ── Self-contained styles (no globals.css on this route) ────────────────────
const CSS = `
:root{
  --gold:#C5A55A; --gold-d:#B8924C; --ink:#0A0A0A; --ink2:#15140f;
  --cream:#FAF8F3; --line:#E7DCC2; --text:#2b2b2b; --muted:#7a7568;
}
*{box-sizing:border-box}
body{font-family:var(--font-body),-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--text);background:var(--cream);line-height:1.7}
code{background:#efe9da;color:#4a3f1f;padding:.1em .4em;border-radius:4px;font-size:.86em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-word}
a{color:var(--gold-d)}

/* Gate */
.gate{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 30%,#1d1b14,var(--ink));padding:24px}
.gate-card{width:100%;max-width:380px;background:#13120d;border:1px solid #322c1c;border-radius:16px;padding:40px 32px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.gate-mark{width:64px;height:64px;margin:0 auto 20px;border:2px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:var(--font-heading),Georgia,serif;font-size:24px;letter-spacing:1px}
.gate-title{color:#f4efe3;font-family:var(--font-heading),Georgia,serif;font-size:24px;margin:0 0 8px}
.gate-sub{color:#9c9686;font-size:14px;margin:0 0 24px}
.gate-input{width:100%;padding:13px 16px;border-radius:10px;border:1px solid #3a3322;background:#0d0c08;color:#f4efe3;font-size:15px;outline:none}
.gate-input:focus{border-color:var(--gold)}
.gate-error{color:#e7a4a4;font-size:13px;margin:12px 0 0}
.gate-btn{width:100%;margin-top:18px;padding:13px;border:none;border-radius:10px;background:var(--gold);color:var(--ink);font-weight:700;font-size:15px;letter-spacing:.3px;cursor:pointer;transition:background .2s}
.gate-btn:hover{background:var(--gold-d)}

/* Topbar */
.topbar{position:sticky;top:0;z-index:10;background:rgba(10,10,10,.96);backdrop-filter:blur(8px);border-bottom:1px solid #2a2519}
.topbar-in{max-width:860px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:12px}
.brand-mark{width:40px;height:40px;border:1.5px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:var(--font-heading),Georgia,serif;font-size:15px}
.brand-text{display:flex;flex-direction:column;line-height:1.25}
.brand-text strong{color:#f4efe3;font-size:14px;letter-spacing:1.5px}
.brand-text small{color:var(--gold);font-size:11px;letter-spacing:.5px}
.logout{background:transparent;border:1px solid #3a3322;color:#cfc7b4;padding:8px 16px;border-radius:8px;font-size:13px;cursor:pointer}
.logout:hover{border-color:var(--gold);color:var(--gold)}

/* Page */
.page{max-width:860px;margin:0 auto;padding:0 24px 80px}
.hero{padding:56px 0 32px;border-bottom:1px solid var(--line)}
.kicker{display:inline-block;color:var(--gold-d);font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:700}
.hero h1{font-family:var(--font-heading),Georgia,serif;font-size:34px;line-height:1.2;color:var(--ink);margin:14px 0 16px}
.lede{font-size:17px;color:#4f4a3e;margin:0;max-width:60ch}

h2{font-family:var(--font-heading),Georgia,serif;font-size:24px;color:var(--ink);margin:0 0 16px}
h3{font-family:var(--font-heading),Georgia,serif}

/* TOC */
.toc{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px 28px;margin:32px 0}
.toc h2{font-size:18px;margin:0 0 10px}
.toc ol{margin:0;padding-left:20px;columns:2;column-gap:32px}
.toc li{margin:5px 0;break-inside:avoid}
.toc a{text-decoration:none}
.toc a:hover{text-decoration:underline}

/* Steps */
.step{display:flex;gap:20px;padding:28px 0;border-bottom:1px solid var(--line);scroll-margin-top:80px}
.step-badge{flex:none;width:46px;height:46px;border-radius:50%;background:var(--ink);color:var(--gold);font-family:var(--font-heading),Georgia,serif;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px #efe7d4}
.step-body{flex:1;min-width:0}
.step-title{font-size:20px;color:var(--ink);margin:6px 0 12px}
.step ul,.step ol{margin:10px 0;padding-left:22px}
.step li{margin:6px 0}

.block{padding:32px 0;border-bottom:1px solid var(--line);scroll-margin-top:80px}
.block ul{padding-left:22px}.block li{margin:7px 0}

/* Field table */
table.fields{width:100%;border-collapse:collapse;margin:8px 0 4px;font-size:14.5px;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden}
table.fields th,table.fields td{text-align:left;padding:11px 14px;border-bottom:1px solid #efe7d4;vertical-align:top}
table.fields th{background:var(--ink);color:#f1ead8;font-size:12px;letter-spacing:.5px;text-transform:uppercase}
table.fields tr:last-child td{border-bottom:none}
table.fields td i{color:var(--muted);font-size:12.5px}
td.req{color:#9a6b1f;font-weight:700;white-space:nowrap}

/* Callouts */
.callout{background:#fff;border:1px solid var(--line);border-left:4px solid var(--gold);border-radius:8px;padding:14px 18px;margin:16px 0;font-size:14.5px}
.callout.tip{border-left-color:#3f8f5e;background:#f1f9f3}
.callout.warn{border-left-color:#c98a2b;background:#fdf6ea}

/* Checklist */
.checks{list-style:none;padding:0;margin:0}
.checks li{position:relative;padding:9px 0 9px 34px;border-bottom:1px solid #efe7d4}
.checks li:before{content:"✓";position:absolute;left:0;top:9px;width:22px;height:22px;background:var(--gold);color:var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}

/* FAQ */
.faq .q{font-weight:700;color:var(--ink);margin:18px 0 4px}
.faq .q:first-child{margin-top:0}

.foot{padding:32px 0 0;color:var(--muted);font-size:13px;text-align:center}
.foot .muted{color:#a59e8c;margin-top:4px}

@media(max-width:640px){
  .hero h1{font-size:27px}
  .toc ol{columns:1}
  .step{gap:14px;padding:22px 0}
  .step-badge{width:38px;height:38px;font-size:17px}
  table.fields{font-size:13px}
  table.fields th,table.fields td{padding:9px 10px}
}
`;
