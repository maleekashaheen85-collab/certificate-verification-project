# 🎥 Video Script (Arabic) — Certificate Verification Platform

## 0) المقدمة (30–45 ثانية)
- السلام عليكم، أنا أفنان، وهذا مشروع **منصّة توثيق الشهادات** باستخدام البلوكتشين.
- سنشوف اليوم الفكرة بسرعة، العقد الذكي على Remix، والواجهة الأمامية، وبالأخير كيف يتم التحقق وإلغاء الشهادة.

## 1) فكرة المنصّة (30 ثانية)
- هدفنا: جهة مُصدّرة تسجّل هاش نسخة إلكترونية من الشهادة على السلسلة، وأي شخص يقدر يتحقق بالـ ID أو الـ Hash.
- عندنا أدوار: **الـ Owner** و **Issuers** المصرّح لهم، بالإضافة لأي مستخدم يقدر يعمل Verify.

## 2) GitHub (30 ثانية)
- أستعرض الريبو على GitHub: يضمّ مجلد `smart-contract`، `frontend`، `backend`، `docs` و`/screenshots`.
- README يشرح خطوات التشغيل.

## 3) العقد الذكي على Remix (3–4 دقائق)
- أفتح رابط Remix → أضيف ملف `CertificateRegistry.sol` → أختار Compiler `0.8.20` → **Compile**.
- أروح لتبويب **Deploy & Run** → Environment = **Remix VM (London/Prague)** → **Deploy**.
- بعد النشر تظهر لي دوال العقد:
  - **authorizeIssuer(address,bool)**: لتفعيل أو إيقاف مُصدر.
  - **issueCertificate(id, hash, meta)**: أصدر شهادة جديدة. (أدخل `CERT-2025-00001`, و hash مثل `0x1234...abcd`, و Meta مثل `malak — IT — Very Good`).
  - **verifyById(id)**: ترجع لي `valid, exists, revoked`.
  - **revokeCertificate(id)**: ألغِ الشهادة ثم جرّب Verify مرة ثانية.
- أوضح إن في المتغيّر `feeWei` ممكن نضبط رسوم للإصدار، وفي `withdraw` لسحب الرسوم.

## 4) الواجهة الأمامية (1–2 دقيقة)
- أفتح `frontend/index.html` (ثيم متدرّج جميل).
- أستعرض الصفحات: **Home / Verify / Issuer / Admin / Login**.
- أشرح إنّه تفاعل Mock للتجربة التعليمية: البيانات تتخزن في LocalStorage، والـ Verify يطابق الـ ID من الجدول.

## 5) الـ Backend (اختياري – 30–60 ثانية)
- داخل `backend/` عندنا API بسيط بـ Express (JSON store).
- أشغّله بالأوامر: `npm install && npm start` → `http://localhost:4000`.
- موجود `POST /verify` و `GET /certificates`… الخ (للتكامل لاحقاً).

## 6) الخاتمة (20–30 ثانية)
- بهذا نكون استعرضنا المشروع: عقد ذكي بسيط للتحقق، واجهة تجريبية، و API للتوسعة لاحقاً.
- شكراً لمتابعتكم.
