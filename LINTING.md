# قواعد اللنت والتايب شيك

هذا المشروع يستخدم ESLint و Prettier لضمان جودة الكود وتناسقه، بالإضافة إلى TypeScript الصارم للتحقق من الأنواع.

## الأدوات المستخدمة

### ESLint

أداة فحص الكود التي تساعد في اكتشاف الأخطاء والمشاكل المحتملة.

### Prettier

أداة تنسيق الكود التي تضمن تناسق أسلوب الكود في جميع أنحاء المشروع.

### TypeScript

نظام الكتابة الصارم الذي يساعد في اكتشاف الأخطاء في وقت التطوير.

## السكريبتات المتاحة

### على مستوى المشروع بالكامل

```bash
# فحص الكود في جميع الحزم
npm run lint

# إصلاح مشاكل الكود تلقائياً
npm run lint:fix

# تنسيق الكود
npm run format

# التحقق من تنسيق الكود
npm run format:check

# التحقق من أنواع TypeScript
npm run type-check
```

### على مستوى الحزمة الفردية

```bash
# فحص الكود في حزمة معينة
cd packages/core
npm run lint

# إصلاح مشاكل الكود تلقائياً
npm run lint:fix

# تنسيق الكود
npm run format

# التحقق من أنواع TypeScript
npm run type-check
```

## قواعد ESLint

يستخدم المشروع قواعد ESLint التالية:

- `eslint:recommended` - القواعد الموصى بها من ESLint
- `@typescript-eslint/recommended` - قواعد TypeScript الموصى بها
- `@typescript-eslint/recommended-requiring-type-checking` - قواعد TypeScript الصارمة
- `plugin:react/recommended` - قواعد React الموصى بها
- `plugin:react-hooks/recommended` - قواعد React Hooks الموصى بها
- `plugin:jsx-a11y/recommended` - قواعد إمكانية الوصول
- `plugin:prettier/recommended` - تكامل مع Prettier

## إعدادات Prettier

يستخدم المشروع إعدادات Prettier التالية:

- استخدام مسافات بدلاً من التبويبات (2 مسافات)
- عرض 100 حرف لكل سطر
- استخدام علامات اقتباس مفردة
- فاصلة منقوطة في نهاية السطر
- استخدام LF كنهاية للسطر

## إعدادات TypeScript

يستخدم المشروع إعدادات TypeScript الصارمة التالية:

- `strict: true` - تفعيل جميع خيارات التحقق الصارم
- `noImplicitAny: true` - منع الأنواع الضمنية
- `strictNullChecks: true` - التحقق الصارم من القيم الفارغة
- `noUnusedLocals: true` - منع المتغيرات غير المستخدمة
- `noUnusedParameters: true` - منع المعاملات غير المستخدمة
- `noImplicitReturns: true` - منع العوائد الضمنية
- `noFallthroughCasesInSwitch: true` - منع الحالات المتساقطة في switch

## تكامل المحرر

يوصى بتثبيت الإضافات التالية في محرر الكود الخاص بك:

- ESLint
- Prettier
- TypeScript

تم تكوين المشروع لاستخدام `.editorconfig` لضمان تناسق الإعدادات عبر المحررات المختلفة.

## Git Hooks

يستخدم المشروع Husky و lint-staged للتحقق التلقائي من الكود قبل كل commit:

### Husky

Husky هو أداة لإدارة git hooks بسهولة. يتم تشغيلها تلقائياً عند تثبيت المشروع.

### lint-staged

lint-staged يقوم بتشغيل ESLint و Prettier على الملفات المعدلة فقط، مما يسرع عملية التحقق.

### ما يحدث عند كل commit

1. يتم تشغيل lint-staged على الملفات المعدلة
2. يتم إصلاح مشاكل ESLint تلقائياً
3. يتم تنسيق الكود باستخدام Prettier
4. يتم التحقق من أنواع TypeScript

## ملاحظات مهمة

1. يجب تشغيل `npm install` لتثبيت جميع التبعيات اللازمة
2. سيتم تثبيت Husky تلقائياً عند تشغيل `npm install` بفضل سكريبت prepare
3. يُنصح بتشغيل `npm run lint:fix` قبل كل commit
4. يُنصح بتشغيل `npm run type-check` للتأكد من عدم وجود أخطاء في الأنواع
5. يتم تجاهل الملفات التالية تلقائياً:
   - node_modules
   - .next
   - dist
   - build
   - coverage
   - .turbo
