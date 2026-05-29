# Hướng dẫn đăng bài viết mới — Publishing Guide (Payload CMS)

> Trang **vothienhien.com** dùng PayloadCMS để quản lý bài viết chuyên môn
> (*Legal Insights*). Hướng dẫn này chỉ cách đăng một bài viết mới song ngữ
> (Tiếng Việt + English). / *This guide shows how to publish a new bilingual
> article.*

---

## 1. Đăng nhập / Log in

1. Mở trình duyệt và vào trang quản trị:
   - **Production:** `https://<tên-miền>/admin` (ví dụ `https://vothienhien.com/admin`)
   - **Local:** `http://localhost:3000/admin`
2. Nhập **email + mật khẩu** quản trị viên của bạn rồi bấm **Login**.
   *(Thông tin đăng nhập do quản trị viên cấp — xem `PM_CREDENTIALS.md`.)*

> ⚠️ Nếu trang `/admin` báo lỗi *“This page couldn’t load”* trên bản deploy:
> biến môi trường `DATABASE_URI` / `PAYLOAD_SECRET` chưa được nạp trên Vercel.
> Xem `DEPLOYMENT.md`.

---

## 2. Tạo bài viết mới / Create a new article

1. Ở menu trái, chọn **Publications**.
2. Bấm nút **Create New** (góc trên bên phải).
3. Bạn sẽ thấy biểu mẫu với các trường bên dưới.

### Các trường chính / Fields

| Trường (Field) | Bắt buộc | Ghi chú |
|---|:---:|---|
| **Title** | ✅ | Tiêu đề bài viết. **Song ngữ** (xem mục 3). |
| **Slug** | ✅ | Định danh trên URL, **viết thường, không dấu, nối bằng `-`**. Phải **duy nhất**. Ví dụ: `quyen-loi-nguoi-lao-dong`. Nằm ở thanh **sidebar** bên phải. |
| **Content** | – | Nội dung bài viết (trình soạn thảo rich text). **Song ngữ.** |
| **Excerpt** | – | Đoạn tóm tắt ngắn (1–2 câu) hiện trên thẻ danh sách & dùng cho mô tả SEO. **Song ngữ.** |
| **Published Date** | – | Ngày đăng. Bài sắp xếp mới → cũ theo trường này. |
| **Category** | – | Chọn 1: **Analysis** / **Guide** / **Commentary** / **Case Study**. Quyết định nhãn lọc trên trang danh sách. |
| **Practice Area** | – | Liên kết tới Lĩnh vực hành nghề (tùy chọn). |
| **Author** | – | Mặc định để **Apolo Editorial Team** (`editorial-team`). Chỉ chọn **Vo Thien Hien** nếu chính ông là tác giả. |
| **Featured Image** | – | Ảnh đại diện — bấm để **Upload** ảnh mới hoặc chọn trong **Media**. Nên dùng ảnh ngang ~1200×630, định dạng `.webp`/`.jpg`. |

> **Slug rất quan trọng:** cùng một `slug` phục vụ cả hai ngôn ngữ —
> `/.../bai-viet-chuyen-mon/<slug>` (VI) và `/.../legal-insights/<slug>` (EN).
> Đặt slug **một lần** rồi đừng đổi (đổi slug = đổi URL = mất SEO/link cũ).

---

## 3. Nhập nội dung song ngữ / Bilingual content

Các trường **Title, Content, Excerpt** được *localized* — mỗi ngôn ngữ lưu riêng.

1. Ở **góc trên** biểu mẫu có nút chọn ngôn ngữ: **Tiếng Việt** / **English**.
2. Chọn **Tiếng Việt** → điền Title, Content, Excerpt bằng tiếng Việt.
3. Bấm **Save** (hoặc tiếp tục).
4. Chuyển sang **English** → điền lại Title, Content, Excerpt bằng tiếng Anh.
5. **Save** lại.

> Các trường **Slug, Published Date, Category, Featured Image, Author** dùng
> chung cho cả hai ngôn ngữ — chỉ cần đặt một lần.

> Nếu một bài chỉ có một ngôn ngữ, trang sẽ tự dùng nội dung ngôn ngữ còn lại
> làm dự phòng — nhưng nên có đủ cả hai để tối ưu SEO.

### Định dạng nội dung / Content formatting
- Dùng **Heading** cho các tiểu mục, **bullet list** cho danh sách, **bold**
  cho ý chính, và chèn **trích dẫn điều luật** (≥ 5 căn cứ pháp lý cho bài dài).
- Khi dẫn nguồn, chỉ liên kết tới các trang chính phủ: `*.gov.vn` hoặc `vbpl.vn`.
- Liên kết nội bộ tiếng Việt → `apolo.com.vn`; tiếng Anh → `apololawyers.com`.

---

## 4. Lưu & xuất bản / Save & publish

1. Kiểm tra đã điền **cả hai ngôn ngữ** + **Slug** + **Published Date** + **Category**.
2. Bấm **Save**. Bài viết đã nằm trong cơ sở dữ liệu.

### Khi nào bài hiện trên web? / When does it go live?

Trang web dùng **ISR — tự làm mới mỗi 1 giờ.** Sau khi Save:
- Bài mới sẽ tự xuất hiện ở `/vi/bai-viet-chuyen-mon` và `/en/legal-insights`
  **trong vòng tối đa 1 giờ** — không cần deploy lại.
- Muốn **hiện ngay lập tức**: vào **Vercel → Deployments → Redeploy** (hoặc
  push một commit) để build lại tức thì.

Kiểm tra nhanh bài đã vào DB chưa:
`https://<tên-miền>/api/publications?limit=5&depth=0` → phải thấy bài mới trong `docs`.

---

## 5. Sửa hoặc gỡ bài / Edit or remove

- **Sửa:** Publications → bấm vào bài → chỉnh → **Save** (chờ ≤ 1 giờ ISR).
- **Gỡ:** mở bài → **Delete** (góc trên). Bài sẽ biến mất khỏi danh sách & sitemap
  trong chu kỳ ISR kế tiếp.

---

## 6. Checklist trước khi đăng / Pre-publish checklist

- [ ] **Title** — đã điền cả VI và EN
- [ ] **Slug** — viết thường, không dấu, duy nhất, sẽ không đổi về sau
- [ ] **Content** — đã điền cả VI và EN, có heading/định dạng, dẫn nguồn `*.gov.vn`/`vbpl.vn`
- [ ] **Excerpt** — 1–2 câu, cả VI và EN (dùng cho SEO + thẻ danh sách)
- [ ] **Published Date** — đặt đúng ngày
- [ ] **Category** — đã chọn
- [ ] **Author** — `Apolo Editorial Team` (mặc định) hoặc `Vo Thien Hien`
- [ ] **Featured Image** — đã upload ảnh ngang chất lượng tốt
- [ ] Đã **Save** → kiểm tra trên `/api/publications` → chờ ISR (≤ 1 giờ) hoặc Redeploy

---

*Cập nhật: 2026-05-29 · Phù hợp với collection `Publications` hiện tại
(`src/collections/Publications.ts`).*
