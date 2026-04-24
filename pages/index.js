import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import Head from 'next/head';

// =============================================
// УТИЛИТЫ
// =============================================

const digitsOnly   = v => v.replace(/\D/g, '');
const normalizeName = v => v.trim().replace(/\s+/g, ' ');

// Маппинг QWERTY → ЙЦУКЕН (позиционный, по раскладке клавиатуры)
const qwertyToRu = (() => {
  const pairs = [
    ['q','й'],['w','ц'],['e','у'],['r','к'],['t','е'],['y','н'],['u','г'],
    ['i','ш'],['o','щ'],['p','з'],['[','х'],[']','ъ'],
    ['a','ф'],['s','ы'],['d','в'],['f','а'],['g','п'],['h','р'],['j','о'],
    ['k','л'],['l','д'],[';','ж'],["'",'э'],['\\','ё'],
    ['z','я'],['x','ч'],['c','с'],['v','м'],['b','и'],['n','т'],['m','ь'],
    [',','б'],['.','ю'],
    ['Q','Й'],['W','Ц'],['E','У'],['R','К'],['T','Е'],['Y','Н'],['U','Г'],
    ['I','Ш'],['O','Щ'],['P','З'],['{','Х'],['}','Ъ'],
    ['A','Ф'],['S','Ы'],['D','В'],['F','А'],['G','П'],['H','Р'],['J','О'],
    ['K','Л'],['L','Д'],[':', 'Ж'],['"','Э'],['|','Ё'],
    ['Z','Я'],['X','Ч'],['C','С'],['V','М'],['B','И'],['N','Т'],['M','Ь'],
    ['<','Б'],['>','Ю'],
  ];
  const map = {};
  for (const [en, ru] of pairs) map[en] = ru;
  return map;
})();
const toRussianName = v =>
  v.split('').map(c => qwertyToRu[c] ?? c).join('').replace(/[^а-яА-ЯёЁ\s-]/g, '');
const toDigitsOnly = v => v.replace(/\D/g, '');

// =============================================
// ИКОНКИ — существующие
// =============================================

const IconCheckDone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM10.9326 13.5176L8.70703 11.293L7.29297 12.707L11.0674 16.4814L11.7686 15.6406L16.7686 9.64062L15.2314 8.35938L10.9326 13.5176Z" fill="#34C759"/>
  </svg>
);

const IconCheckEmpty = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM10.9326 13.5176L8.70703 11.293L7.29297 12.707L11.0674 16.4814L11.7686 15.6406L16.7686 9.64062L15.2314 8.35938L10.9326 13.5176Z" style={{ fill: 'var(--icon-neutral)' }}/>
  </svg>
);

const IconUpload = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
    <path d="M10 5L10.7071 4.29289L10 3.58579L9.29289 4.29289L10 5ZM9 14V15H11V14H10H9ZM4 18H3V20H4V19V18ZM16 20H17V18H16V19V20ZM5 10L5.70711 10.7071L10.7071 5.70711L10 5L9.29289 4.29289L4.29289 9.29289L5 10ZM10 5L9.29289 5.70711L14.2929 10.7071L15 10L15.7071 9.29289L10.7071 4.29289L10 5ZM10 5L9 5L9 14H10H11L11 5L10 5ZM4 19V20H16V19V18H4V19Z" fill="#446BF2"/>
  </svg>
);

const IconFieldClear = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" style={{ fill: 'var(--field-clear-circle)' }}/>
    <path d="M8 16L16 8M16 16L8 8" style={{ stroke: 'var(--field-clear-cross)' }} strokeWidth="2"/>
  </svg>
);

const IconFieldEdit = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M11.7151 8.77283C12.6152 10.1801 13.8191 11.3753 15.2424 12.267L9.19458 18.3158C8.82169 18.6887 8.63549 18.8757 8.40649 18.9984C8.1773 19.1211 7.91805 19.1733 7.40063 19.2767L4.69946 19.8168C4.40807 19.8751 4.26204 19.9042 4.17896 19.8217C4.09591 19.7386 4.12447 19.5921 4.18286 19.3002L4.72388 16.599C4.82729 16.0819 4.87867 15.8232 5.00122 15.5941C5.12388 15.3649 5.31072 15.1782 5.68384 14.8051L11.7151 8.77283ZM15.5637 5.05505C16.0549 4.81165 16.6321 4.81165 17.1233 5.05505C17.3813 5.18301 17.6205 5.42241 18.0989 5.90076C18.5775 6.37938 18.8167 6.61916 18.9446 6.87732C19.1879 7.36846 19.188 7.94479 18.9446 8.43591C18.8166 8.69405 18.5775 8.93389 18.0989 9.41248L16.5217 10.9886C15.0535 10.1536 13.8374 8.94544 12.9915 7.49646L14.5881 5.90076C15.0665 5.42238 15.3057 5.18298 15.5637 5.05505Z" style={{ fill: 'var(--text-primary)' }}/>
  </svg>
);

const DocIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="51" height="66" viewBox="0 0 51 66" fill="none">
    <path d="M27.3077 2.00012V15.0155C27.3077 18.0527 27.3077 19.5713 27.8988 20.7314C28.4187 21.7518 29.2483 22.5814 30.2687 23.1013C31.4288 23.6924 32.9474 23.6924 35.9846 23.6924H49M46.4586 17.5356L33.4645 4.54153C32.5265 3.6036 32.0576 3.13464 31.5103 2.79927C31.0251 2.50193 30.4961 2.28281 29.9427 2.14996C29.3186 2.00012 28.6554 2.00012 27.329 2.00012H10.6769C7.63971 2.00012 6.12111 2.00012 4.96105 2.5912C3.94063 3.11113 3.11101 3.94076 2.59108 4.96117C2 6.12123 2 7.63983 2 10.677V54.7847C2 57.8219 2 59.3405 2.59108 60.5006C3.11101 61.521 3.94063 62.3506 4.96105 62.8706C6.12111 63.4616 7.63971 63.4616 10.6769 63.4616H40.3231C43.3603 63.4616 44.8789 63.4616 46.0389 62.8706C47.0593 62.3506 47.889 61.521 48.4089 60.5006C49 59.3405 49 57.8219 49 54.7847V23.6711C49 22.3447 49 21.6815 48.8501 21.0574C48.7173 20.504 48.4982 19.975 48.2008 19.4898C47.8655 18.9425 47.3965 18.4736 46.4586 17.5356Z" stroke="var(--text-secondary)" strokeWidth="4"/>
  </svg>
);

const CheckboxIcon = ({ checked }) => checked ? (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block', flexShrink: 0 }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.44444 0C1.98985 0 0 1.98985 0 4.44444V15.5556C0 18.0102 1.98985 20 4.44444 20H15.5556C18.0102 20 20 18.0102 20 15.5556V4.44444C20 1.98985 18.0102 0 15.5556 0H4.44444Z" fill="#446BF2"/>
    <path transform="translate(5.5, 6.5)" d="M0.707093 3.64014L3.70709 6.64014L8.70709 0.640137" stroke="white" strokeWidth="2"/>
  </svg>
) : (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block', flexShrink: 0 }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M4.44444 0C1.98985 0 0 1.98985 0 4.44444V15.5556C0 18.0102 1.98985 20 4.44444 20H15.5556C18.0102 20 20 18.0102 20 15.5556V4.44444C20 1.98985 18.0102 0 15.5556 0H4.44444Z" style={{ fill: 'var(--checkbox-bg)' }}/>
  </svg>
);

// =============================================
// ИКОНКИ — прогресс 3 шагов
// =============================================

// Иконки шагов: active → var(--text-primary), inactive → var(--icon-neutral)
// Пути — точно из Figma (node 2465-7029)

const IconStep1 = ({ active }) => (
  // Экран входа — дверь со стрелкой
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M6.12988 2.41705C7.25978 1.51628 8.95214 1.90315 12.3369 2.67682L12.7822 2.77838C15.764 3.45992 17.2556 3.80057 18.1279 4.89459C19.0002 5.98873 19 7.51854 19 10.5772V13.4219C19 16.4807 19.0002 18.0104 18.1279 19.1046C17.2556 20.1986 15.764 20.5392 12.7822 21.2208L12.3369 21.3223C8.95214 22.096 7.25978 22.4829 6.12988 21.5821C5.00014 20.6813 5 18.9455 5 15.4737V13.0001H10.2334L8.14258 16.4854L9.85742 17.5147L12.8574 12.5147L13.166 12.0001L12.8574 11.4854L9.85742 6.48541L8.14258 7.51471L10.2334 11.0001H5V8.52545C5 5.05369 5.00009 3.31781 6.12988 2.41705Z"
      fill={active ? 'var(--text-primary)' : 'var(--icon-neutral)'}
    />
  </svg>
);

const IconStep2 = ({ active }) => (
  // Звезда — важные сведения
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9.7838 5.93454C10.6244 3.92278 11.0448 2.9169 11.7276 2.77749C11.9072 2.74084 12.0928 2.74084 12.2723 2.77749C12.9552 2.9169 13.3756 3.92278 14.2162 5.93454C14.6943 7.07859 14.9333 7.65061 15.3805 8.03968C15.506 8.14881 15.6422 8.246 15.7872 8.32989C16.3041 8.62898 16.9494 8.68446 18.2401 8.79542C20.4249 8.98325 21.5174 9.07717 21.851 9.67508C21.9201 9.79892 21.967 9.93299 21.9899 10.0717C22.1005 10.7417 21.2974 11.443 19.6913 12.8458L19.2452 13.2353C18.4943 13.8911 18.1188 14.219 17.9017 14.6283C17.7714 14.8737 17.684 15.1381 17.6431 15.4108C17.5749 15.8653 17.6848 16.341 17.9047 17.2924L17.9833 17.6323C18.3776 19.3385 18.5748 20.1916 18.3287 20.6109C18.1076 20.9876 17.7004 21.2287 17.2505 21.2493C16.7497 21.2723 16.044 20.7203 14.6326 19.6163C13.7028 18.889 13.2379 18.5253 12.7217 18.3832C12.2501 18.2534 11.7499 18.2534 11.2783 18.3832C10.7621 18.5253 10.2972 18.889 9.36736 19.6163C7.956 20.7203 7.25033 21.2723 6.74951 21.2493C6.29965 21.2287 5.89241 20.9876 5.67132 20.6109C5.42518 20.1916 5.62236 19.3385 6.0167 17.6323L6.09527 17.2924C6.31516 16.341 6.42511 15.8653 6.35688 15.4108C6.31595 15.1381 6.2286 14.8737 6.09833 14.6283C5.88116 14.219 5.5057 13.8911 4.75478 13.2353L4.30875 12.8458C2.70256 11.443 1.89947 10.7417 2.01007 10.0717C2.03297 9.93299 2.07995 9.79892 2.14904 9.67508C2.48264 9.07717 3.57506 8.98325 5.7599 8.79542C7.05056 8.68446 7.69588 8.62898 8.21283 8.32989C8.35783 8.246 8.49401 8.14881 8.61946 8.03968C9.06672 7.65061 9.30575 7.07859 9.7838 5.93454Z"
      fill={active ? 'var(--text-primary)' : 'var(--icon-neutral)'}
    />
  </svg>
);

const IconStep3 = ({ active }) => (
  // Сердце — расскажите о себе
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3.78542 14.0455L11.3507 21.4131C11.6113 21.6669 11.7416 21.7938 11.8952 21.8251C11.9644 21.8392 12.0356 21.8392 12.1048 21.8251C12.2584 21.7938 12.3887 21.6669 12.6493 21.4131L20.2146 14.0455C22.3431 11.9726 22.6016 8.56134 20.8114 6.16926L20.4748 5.71948C18.3332 2.85787 14.0344 3.33778 12.5296 6.60648C12.317 7.0682 11.683 7.0682 11.4704 6.60648C9.96562 3.33778 5.66683 2.85787 3.52522 5.71948L3.1886 6.16927C1.39838 8.56135 1.65687 11.9726 3.78542 14.0455Z"
      fill={active ? 'var(--text-primary)' : 'var(--icon-neutral)'}
    />
  </svg>
);

const IconBack = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// =============================================
// CSS ПЕРЕМЕННЫЕ
// =============================================

const cssVars = `
  :root {
    /* ── functional vars ──────────────────────────────────────────── */
    --page-bg:            #F5F5F5;
    --card-bg:            #FFFFFF;
    --field-bg:           rgba(51,54,63,0.05);
    --sheet-bg:           rgba(255,255,255,0.05);
    --panel-bg:           rgba(255,255,255,0.65);
    --border-light:       #E6E6EB;
    --panel-border:       #E6E6EB;
    --text-primary:       #33363F;
    --text-secondary:     rgba(51,54,63,0.65);
    --text-disabled:      rgba(51,54,63,0.25);
    --primary:            #446BF2;
    --primary-bg:         rgba(68,107,242,0.10);
    --segment-bg:         #FFFFFF;
    --ctrl-disabled:      rgba(51,54,63,0.05);
    --border-good:        rgba(52,199,89,0.25);
    --icon-neutral:       rgba(51,54,63,0.25);
    --divider:            rgba(51,54,63,0.25);
    --ctrl-gray:          #33363F;
    --del-doc-circle:     #33363F;
    --del-doc-cross:      #FFFFFF;
    --error-border:       rgba(255,56,60,0.25);
    --error-text:         #FF383C;
    --field-clear-circle: #33363F;
    --field-clear-cross:  #FFFFFF;
    --checkbox-bg:        rgba(51,54,63,0.05);
    --linear-primary:     #FFFFFF;
    --linear-secondary:   rgba(230,230,235,0.20);
    --tooltip-bg:         #33363F;
    --tooltip-text:       #FFFFFF;
    --gb-border:          rgba(51,54,63,0.05);
    --gb-glint:           255,255,255;

    /* ── Figma variable collection (light) ───────────────────────── */
    --basic-page_bg_primary:   var(--card-bg);
    --basic-page_bg_secondary: var(--field-bg);
    --basic-page_bg_tertiary:  var(--panel-bg);
    --basic-sheet_bg_blur:     var(--sheet-bg);
    --text-control_white:      #FFFFFF;
    --text-control_gray:       #33363F;
    --text-control_blue:       #446BF2;
    --controls-primary_bg:     var(--primary);
    --controls-attachment_bg:  var(--primary-bg);
    --controls-segment_bg:     var(--segment-bg);
    --success-border:          var(--border-good);
    --linear-primary-token:    var(--linear-primary);
    --linear-secondary-token:  var(--linear-secondary);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      /* ── functional vars ────────────────────────────────────────── */
      --page-bg:            #0A0A0B;
      --card-bg:            #131315;
      --field-bg:           rgba(230,230,235,0.05);
      --sheet-bg:           rgba(19,19,21,0.05);
      --panel-bg:           rgba(19,19,21,0.80);
      --border-light:       rgba(230,230,235,0.30);
      --panel-border:       rgba(230,230,235,0.30);
      --text-primary:       #FFFFFF;
      --text-secondary:     rgba(230,230,235,0.65);
      --text-disabled:      rgba(230,230,235,0.30);
      --primary:            #446BF2;
      --primary-bg:         rgba(68,107,242,0.10);
      --segment-bg:         #E6E6EB;
      --ctrl-disabled:      rgba(230,230,235,0.05);
      --border-good:        rgba(52,199,89,0.25);
      --icon-neutral:       rgba(230,230,235,0.30);
      --del-doc-circle:     #FFFFFF;
      --del-doc-cross:      #33363F;
      --divider:            rgba(230,230,235,0.30);
      --ctrl-gray:          #33363F;
      --field-clear-circle: rgba(230,230,235,0.85);
      --field-clear-cross:  #33363F;
      --checkbox-bg:        rgba(230,230,235,0.05);
      --error-border:       rgba(255,56,60,0.25);
      --error-text:         #FF383C;
      --linear-primary:     rgba(230,230,235,0.50);
      --linear-secondary:   rgba(230,230,235,0.04);
      --tooltip-bg:         #E6E6EB;
      --tooltip-text:       #33363F;
      --gb-border:          rgba(230,230,235,0.05);
      --gb-glint:           112,112,112;
    }
  }
  * { box-sizing: border-box; }
  html { height: -webkit-fill-available; background: var(--page-bg); }
  body { margin: 0; padding: 0; min-height: 100vh; min-height: -webkit-fill-available; background: var(--page-bg) !important; }
  input::placeholder { color: var(--text-disabled); font-family: SF Pro Text, -apple-system, sans-serif; font-size: 17px; letter-spacing: -0.408px; }
  input { caret-color: #446BF2; }
  ::-webkit-scrollbar { display: none; }
  @property --gyro-angle {
    syntax: '<angle>';
    inherits: true;
    initial-value: 225deg;
  }

  .gb { position: relative; border: none !important; }
  .gb::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    /* Маска: content-box XOR padding-box = видна только кромка.
       Блик заперт в контуре — не протечёт ни внутрь, ни наружу. */
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    /* Каждый элемент вычисляет позиции пятен из общего угла --gyro-angle.
       cos()/sin() в CSS дают позиции относительно СОБСТВЕННОГО размера элемента.
       30px — фиксированный радиус пятна (одинаковый на chip и textfield). */
    --_a: calc(var(--gyro-angle) + var(--gb-offset, 0deg));
    background:
      radial-gradient(var(--gb-radius, 20px) at calc(50% + 50% * cos(var(--_a))) calc(50% + 50% * sin(var(--_a))),
        rgba(var(--gb-glint), var(--op1, 0.4)) 0%, transparent 100%),
      radial-gradient(var(--gb-radius, 20px) at calc(50% - 50% * cos(var(--_a))) calc(50% - 50% * sin(var(--_a))),
        rgba(var(--gb-glint), var(--op2, 0.4)) 0%, transparent 100%),
      var(--gb-border);
    pointer-events: none;
    z-index: 10;
  }
`;

// =============================================
// ХУКИ
// =============================================

function useGyroscope() {
  useEffect(() => {
    let raf;
    let targetGamma = 0, targetBeta = 0;
    let currGamma = 0, currBeta = 0;
    const LERP = 0.08;

    const tick = () => {
      currGamma += (targetGamma - currGamma) * LERP;
      currBeta  += (targetBeta  - currBeta)  * LERP;

      // 225° база → покой = top-left + bottom-right
      const angleDeg = currGamma + 225;
      const angleRad = (angleDeg * Math.PI) / 180;

      // Beta модулирует яркость: наклон "от себя" → верхнее пятно чуть ярче.
      // Мягкая модуляция: база 0.5, ±0.25 при полном наклоне (60°).
      // Оба пятна всегда видны даже при лёгком тильте.
      const sinA = Math.sin(angleRad);
      const bFactor = Math.max(-1, Math.min(1, currBeta / 60));
      const spot1Top = sinA < 0;
      const op1 = Math.max(0.2, Math.min(1, spot1Top ? 0.5 + bFactor * 0.25 : 0.5 - bFactor * 0.25));
      const op2 = Math.max(0.2, Math.min(1, spot1Top ? 0.5 - bFactor * 0.25 : 0.5 + bFactor * 0.25));

      // Только 3 переменных — позиции вычисляются каждым элементом в CSS
      const root = document.documentElement.style;
      root.setProperty('--gyro-angle', `${angleDeg.toFixed(2)}deg`);
      root.setProperty('--op1', op1.toFixed(3));
      root.setProperty('--op2', op2.toFixed(3));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOrientation = e => {
      targetGamma = e.gamma ?? 0;
      targetBeta  = e.beta  ?? 0;
    };
    const onMouse = e => {
      targetGamma = (e.clientX / window.innerWidth  - 0.5) * 180;
      targetBeta  = (e.clientY / window.innerHeight - 0.5) * 90;
    };

    window.addEventListener('mousemove', onMouse);

    if (typeof DeviceOrientationEvent === 'undefined') {
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouse);
      };
    }

    let ask = null;

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ — нужен явный жест пользователя
      ask = () => {
        DeviceOrientationEvent.requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', onOrientation);
            }
          })
          .catch(() => {});
        document.removeEventListener('touchend', ask);
        document.removeEventListener('click',    ask);
      };
      document.addEventListener('touchend', ask, { once: true });
      document.addEventListener('click',    ask, { once: true });
    } else {
      // Android / desktop DeviceOrientation
      window.addEventListener('deviceorientation', onOrientation);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', onOrientation);
      if (ask) {
        document.removeEventListener('touchend', ask);
        document.removeEventListener('click',    ask);
      }
    };
  }, []);
}

// =============================================
// UI-КОМПОНЕНТЫ
// =============================================

function CriticalMessage({ text }) {
  if (!text) return null;
  return (
    <div style={{ alignSelf: 'stretch', color: 'var(--error-text)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '124%' }}>
      {text}
    </div>
  );
}

function ErrorTooltip({ text }) {
  if (!text) return null;
  return (
    <div style={{ position: 'relative', alignSelf: 'stretch', marginTop: -4 }}>
      {/* Стрелка вверх */}
      <div style={{
        position: 'absolute',
        top: -2,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: '6px solid var(--tooltip-bg)',
      }} />
      {/* Пузырь */}
      <div style={{
        background: 'var(--tooltip-bg)',
        borderRadius: 12,
        padding: 10,
        color: 'var(--tooltip-text)',
        fontFamily: 'SF Pro Text, -apple-system, sans-serif',
        fontSize: 13,
        lineHeight: '20px',
        letterSpacing: '0.1px',
        textAlign: 'center',
      }}>
        {text}
      </div>
    </div>
  );
}

function TextField({ label, placeholder, value, onChange, onCommit, error, digitOnly }) {
  const [focused, setFocused] = useState(false);
  const [digitMsg, setDigitMsg] = useState(null);
  const digitTimer = useRef(null);
  const inputRef = useRef(null);
  const showIcon = focused || value.trim().length > 0;

  useEffect(() => () => clearTimeout(digitTimer.current), []);

  const handleChange = e => {
    const raw = e.target.value;
    if (digitOnly && /[^\d]/.test(raw)) {
      setDigitMsg('Используйте цифры, чтобы ввести номер');
      clearTimeout(digitTimer.current);
      digitTimer.current = setTimeout(() => setDigitMsg(null), 2500);
    }
    onChange(raw);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, alignSelf: 'stretch' }}>
      {label && (
        <div style={{ alignSelf: 'stretch', color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '124%' }}>
          {label}
        </div>
      )}
      <div
        className={error ? undefined : 'gb'}
        style={{ '--gb-offset': '-24deg', '--gb-radius': '32px', display: 'flex', height: 44, paddingLeft: 16, alignItems: 'flex-start', alignSelf: 'stretch', borderRadius: 16, border: 'none', outline: error ? '0.5px solid var(--error-border)' : 'none', outlineOffset: '-0.5px', background: 'var(--field-bg)', overflow: 'hidden' }}
      >
        <div style={{ flex: '1 0 0', alignSelf: 'stretch', display: 'flex', alignItems: 'flex-start', padding: '11px 16px 11px 0', minWidth: 0 }}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); onCommit && onCommit(value); }}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            style={{ flex: '1 0 0', background: 'transparent', border: 'none', outline: 'none', color: value ? 'var(--text-primary)' : 'var(--text-disabled)', fontFamily: 'SF Pro Text, -apple-system, sans-serif', fontSize: 17, fontWeight: 400, lineHeight: '22px', letterSpacing: '-0.408px', caretColor: '#446BF2', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          />
        </div>
        {showIcon && (
          <div style={{ display: 'flex', width: 33, paddingRight: 16, alignItems: 'center', alignSelf: 'stretch', flexShrink: 0 }}>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                if (focused) { onChange(''); onCommit && onCommit(''); inputRef.current?.focus(); }
                else { inputRef.current?.focus(); setTimeout(() => inputRef.current?.setSelectionRange(value.length, value.length), 0); }
              }}
              style={{ width: 24, height: 24, flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {focused ? <IconFieldClear /> : <IconFieldEdit />}
            </button>
          </div>
        )}
      </div>
      <ErrorTooltip text={digitMsg} />
      {error && (
        <div style={{ alignSelf: 'stretch', color: 'var(--error-text)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '124%' }}>
          {error}
        </div>
      )}
    </div>
  );
}

function FileThumb({ file, url, onRemove }) {
  const isImage = file.type.startsWith('image/');
  const displayName = file.name.length > 12 ? file.name.slice(0, 10) + '…' : file.name;

  return (
    <div style={{ width: 150, height: 150, position: 'relative', background: isImage ? 'var(--card-bg)' : 'var(--field-bg)', overflow: 'hidden', borderRadius: 8, flexShrink: 0 }}>
      {isImage && <img src={url} alt={file.name} style={{ width: 150, height: 150, objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />}
      {isImage && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'none' }} />}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--sheet-bg)', display: isImage ? 'block' : 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        {!isImage && (
          <>
            <div style={{ position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DocIcon />
            </div>
            <div style={{ position: 'absolute', top: 'calc(50% + 45px)', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-primary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%', textAlign: 'center', whiteSpace: 'nowrap' }}>
              {displayName}
            </div>
          </>
        )}
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={onRemove} style={{ width: 24, height: 24, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {isImage ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.35))' }}>
              <circle cx="12" cy="12" r="9" fill="white"/>
              <path d="M8 16L16 8M16 16L8 8" stroke="#33363F" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" style={{ fill: 'var(--del-doc-circle)' }}/>
              <path d="M8 16L16 8M16 16L8 8" style={{ stroke: 'var(--del-doc-cross)' }} strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function FileUpload({ hint, value, onChange, compact = false, buttonLabel = 'Загрузить', error, maxFiles = 20 }) {
  const urlsRef = useRef(new Map()); // ключ: строка `name-lastModified-size`

  const fileKey = f => `${f.name}-${f.lastModified}-${f.size}`;

  const getUrl = file => {
    const k = fileKey(file);
    if (!urlsRef.current.has(k)) {
      urlsRef.current.set(k, URL.createObjectURL(file));
    }
    return urlsRef.current.get(k);
  };

  useEffect(() => {
    const currentKeys = new Set(value.map(fileKey));
    urlsRef.current.forEach((url, k) => {
      if (!currentKeys.has(k)) { URL.revokeObjectURL(url); urlsRef.current.delete(k); }
    });
  }, [value]);

  useEffect(() => () => { urlsRef.current.forEach(url => URL.revokeObjectURL(url)); urlsRef.current.clear(); }, []);

  const canAddMore = value.length < maxFiles;

  const handleChange = e => {
    const newFiles = Array.from(e.target.files);
    const valid = [], errs = [];
    for (const f of newFiles) {
      if (f.size > MAX_FILE_SIZE) { errs.push(`${f.name}: слишком большой (макс. 10 МБ)`); continue; }
      if (value.some(x => x.name === f.name && x.size === f.size)) { errs.push(`${f.name}: уже добавлен`); continue; }
      valid.push(f);
    }
    const total = value.length + valid.length;
    if (total > maxFiles) {
      const allowed = maxFiles - value.length;
      if (allowed > 0) { errs.push(`Можно добавить ещё ${allowed} (максимум ${maxFiles})`); valid.splice(allowed); }
      else { errs.push(`Достигнут лимит: ${maxFiles} файлов`); valid.length = 0; }
    }
    if (errs.length) alert(errs.join('\n'));
    if (valid.length) onChange([...value, ...valid]);
    e.target.value = '';
  };

  const uploadBtnStyle = (w, h) => ({
    display: 'flex', width: w, height: h, justifyContent: 'center', alignItems: 'center',
    borderRadius: 16, border: 'none', outline: '1px dashed #446BF2', outlineOffset: '-1px',
    background: 'var(--primary-bg)', cursor: 'pointer',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, alignSelf: 'stretch' }}>
      {hint && <div style={{ alignSelf: 'stretch', color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%' }}>{hint}</div>}
      {value.length === 0 ? (
        <label style={{ ...uploadBtnStyle(compact ? 'auto' : '100%', compact ? 44 : 89), alignSelf: compact ? 'flex-start' : 'stretch', padding: '0 16px', gap: 8, minHeight: compact ? 44 : 56 }}>
          <IconUpload />
          <span style={{ color: '#446BF2', fontFamily: 'Onest', fontSize: 16, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap' }}>{buttonLabel}</span>
          <input type="file" multiple accept=".png,.jpg,.jpeg,.pdf" onChange={handleChange} style={{ display: 'none' }} />
        </label>
      ) : (
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, alignSelf: 'stretch', height: 150 }}>
          {canAddMore && (
            <label style={uploadBtnStyle(87, '100%')}>
              <IconUpload />
              <input type="file" multiple accept=".png,.jpg,.jpeg,.pdf" onChange={handleChange} style={{ display: 'none' }} />
            </label>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', flex: 1, minWidth: 0 }}>
            {value.map((file, i) => (
              <FileThumb key={`${file.name}-${file.size}`} file={file} url={getUrl(file)} onRemove={() => onChange(value.filter((_, idx) => idx !== i))} />
            ))}
          </div>
        </div>
      )}
      <CriticalMessage text={error} />
    </div>
  );
}

function SegmentPicker({ options, value, onChange }) {
  return (
    <div className="gb" style={{ '--gb-offset': '-24deg', display: 'flex', height: 44, minHeight: 44, padding: 2, alignItems: 'center', alignSelf: 'stretch', borderRadius: 18, background: 'var(--field-bg)', overflow: 'hidden' }}>
      {options.map((opt, i) => {
        const selected = value === opt;
        const showSep = i > 0 && !selected && value !== options[i - 1];
        return (
          <div key={opt} style={{ display: 'flex', flex: '1 0 0', alignItems: 'center', height: 40 }}>
            {showSep && <div style={{ width: '0.5px', height: 16, flexShrink: 0, background: 'var(--divider)' }} />}
            <button onClick={() => onChange(opt)} style={{ flex: '1 0 0', height: 40, padding: '0 10px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 16, border: 'none', outline: selected ? '0.5px solid var(--field-bg)' : 'none', outlineOffset: '-0.5px', background: selected ? 'var(--segment-bg)' : 'transparent', boxShadow: selected ? '0px 3px 8px 0px rgba(0,0,0,0.12), 0px 3px 1px 0px rgba(0,0,0,0.04)' : 'none', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.15s' }}>
              <div style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, flex: '1 0 0', overflow: 'hidden', textAlign: 'center', textOverflow: 'ellipsis', color: selected ? 'var(--ctrl-gray)' : 'var(--text-primary)', fontFamily: 'Onest', fontSize: 16, fontWeight: selected ? 600 : 500, lineHeight: '100%', whiteSpace: 'nowrap' }}>
                {opt}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ display: 'flex', alignSelf: 'stretch', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0, height: 24 }}>
      <div style={{ width: 24, height: 24, minWidth: 24, minHeight: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={checked ? undefined : 'gb'} style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, display: 'flex' }}>
          <CheckboxIcon checked={checked} />
        </div>
      </div>
      <div style={{ color: 'var(--text-primary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 500, lineHeight: '16px' }}>
        {label}
      </div>
    </button>
  );
}

function DocCard({ id, title, subtitle, children }) {
  return (
    <div id={id} style={{ alignSelf: 'stretch', padding: '28px 16px', background: 'var(--card-bg)', borderRadius: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
      <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        {subtitle && <div style={{ alignSelf: 'stretch', color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%' }}>{subtitle}</div>}
        <div style={{ alignSelf: 'stretch', color: 'var(--text-primary)', fontFamily: 'Onest', fontSize: 28, fontWeight: 700, lineHeight: '110%' }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function CheckChip({ label, done, anchorId }) {
  const scrollTo = () => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  return (
    <button onClick={scrollTo} className={done ? undefined : 'gb'} style={{ display: 'inline-flex', height: 32, padding: '0 10px 0 4px', alignItems: 'center', gap: 2, borderRadius: 16, border: 'none', outline: done ? '0.5px solid var(--border-good)' : 'none', outlineOffset: '-0.5px', background: 'var(--card-bg)', backdropFilter: 'blur(2px)', cursor: 'pointer', flexShrink: 0 }}>
      {done ? <IconCheckDone /> : <IconCheckEmpty />}
      <div style={{ color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%', whiteSpace: 'nowrap' }}>{label}</div>
    </button>
  );
}

// =============================================
// LAYOUT-КОМПОНЕНТЫ
// =============================================

// Task — шапка с заголовком, кнопкой назад и индикатором шагов
const STEP_TITLES = {
  1: 'Приветствуем\nв команде!',
  2: 'Укажите важные\nсведения',
  3: 'Расскажите нам\nбольше о себе',
};

function Task({ step, onBack, titleRef }) {
  const StepIcons = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconStep1 active={step === 1} />
      <IconStep2 active={step === 2} />
      <IconStep3 active={step === 3} />
    </div>
  );

  const isScrollable = step > 1;

  return (
    <>
      {/* Nav — sticky на экранах 2/3, остаётся при скролле */}
      <div style={{
        position: isScrollable ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50,
        width: '100%',
        maxWidth: 402,
        margin: '0 auto',
        paddingTop: 'calc(20px + env(safe-area-inset-top, 0px))',
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        boxSizing: 'border-box',
        background: isScrollable ? 'var(--page-bg)' : 'transparent',
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                position: 'absolute',
                left: 0,
                display: 'flex',
                width: 32,
                height: 32,
                padding: 4,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                background: 'var(--card-bg)',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <IconBack />
            </button>
          )}
          <StepIcons />
        </div>
      </div>

      {/*
        Заголовок — параллакс: title зафиксирован сразу под nav, DocList
        наезжает на него сверху (у DocList выше z-index + фон страницы).
        Одновременно title плавно угасает по opacity (см. useEffect в Home).
      */}
      <div ref={titleRef} style={{
        position: isScrollable ? 'sticky' : 'relative',
        // nav: 20 (safe-area-top) + 32 (иконки) + 8 (padding-bottom) = 60
        top: isScrollable ? 'calc(60px + env(safe-area-inset-top, 0px))' : 'auto',
        zIndex: 10,
        width: '100%',
        maxWidth: 402,
        margin: '0 auto',
        padding: '24px 0px 28px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%',
          textAlign: 'center',
          color: 'var(--text-primary)',
          fontFamily: 'Onest',
          fontSize: step === 1 ? 40 : 38,
          fontWeight: 600,
          lineHeight: '110%',
          whiteSpace: 'pre-line',
        }}>
          {STEP_TITLES[step]}
        </div>
      </div>
    </>
  );
}

// DocList — контейнер карточек документов (строго по спецификации)
function DocList({ children, bottomPad }) {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      maxWidth: 402,
      margin: '0 auto',
      // height из спецификации — используем min-height чтобы контент мог расти
      minHeight: 668,
      // spec padding: 4px 8px 160px 8px, но bottom — динамический для точных 8px
      paddingTop: 4,
      paddingRight: 8,
      paddingBottom: bottomPad,
      paddingLeft: 8,
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 4,
      boxSizing: 'border-box',
      // Параллакс: DocList «наезжает» на sticky title.
      // Нужен фон страницы + z-index выше, чем у title (10).
      position: 'relative',
      zIndex: 20,
      background: 'var(--page-bg)',
    }}>
      {children}
    </div>
  );
}

// BottomMenu — фиксированная панель внизу с чипами и кнопкой
const BottomMenu = forwardRef(function BottomMenu(
  { chips, buttonLabel, onButton, buttonDisabled, errorText },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 402,
        padding: '0 8px calc(env(safe-area-inset-bottom, 0px) + 8px) 8px',
        zIndex: 100,
        boxSizing: 'border-box',
      }}
    >
      {/* Blur-подложка */}
      <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }} />

      {/* Панель */}
      <div className="gb" style={{
        '--gb-offset': '-4deg',
        position: 'relative',
        background: 'var(--panel-bg)',
        borderRadius: 24,
        border: 'none',
        boxShadow: '0 2px 40px 0 rgba(0,0,0,0.10)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        overflow: 'hidden',
      }}>
        {/* Чипы */}
        <div style={{ padding: '12px 8px 0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {chips.map(({ label, done, anchorId }) => (
              <CheckChip key={label} label={label} done={done} anchorId={anchorId} />
            ))}
          </div>
        </div>

        {/* Ошибка (если есть) */}
        {errorText && (
          <div style={{ padding: '8px 16px 0', color: 'var(--error-text)', fontFamily: 'Onest', fontSize: 14, textAlign: 'center' }}>
            {errorText}
          </div>
        )}

        {/* Кнопка */}
        <div style={{ padding: 8 }}>
          <button
            disabled={buttonDisabled}
            onClick={onButton}
            style={{
              display: 'flex',
              width: '100%',
              height: 56,
              padding: '0 16px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 16,
              border: 'none',
              background: buttonDisabled ? 'var(--ctrl-disabled)' : '#446BF2',
              color: buttonDisabled ? 'var(--text-disabled)' : '#FFFFFF',
              fontFamily: 'Onest',
              fontSize: 16,
              fontWeight: 500,
              lineHeight: '16px',
              cursor: buttonDisabled ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
});

// =============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// =============================================

export default function Home() {
  useGyroscope();

  // ── Шаг ────────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);

  // ── Форма (сохраняется при навигации назад/вперёд) ─────────────────────────
  const [fields, setFields]     = useState({ name: '', snils: '', inn: '', educationPlace: '', contractNumber: '', accountNumber: '', bik: '', corrAccount: '' });
  const [committed, setCommitted] = useState({ name: '', snils: '', inn: '', educationPlace: '', contractNumber: '', accountNumber: '', bik: '', corrAccount: '' });
  const [files, setFiles]       = useState({ passport: [], snilsFiles: [], innFiles: [], workbook: [], educationFiles: [], driverLicense: [], voennik: [] });
  const [toggles, setToggles]   = useState({ engLevel: 'A1', marital: 'Не в браке', noEducation: false, hasChildren: false });

  // ── Статус отправки ─────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [serverError, setServerError]   = useState(null);

  // ── Фоновые операции (создаём один раз, не пересоздаём при навигации) ──────
  // foldersPromise: Promise<{basePath}>, запускается при переходе 1→2, ждёт создания папок
  const foldersPromiseRef    = useRef(null);
  // step2UploadPromise: Promise<void>, запускается при переходе 2→3, ждёт загрузки файлов
  const step2UploadPromiseRef = useRef(null);

  // ── Высота BottomMenu для точных 8px отступа ───────────────────────────────
  const menuRef             = useRef(null);
  const [menuHeight, setMenuHeight] = useState(160);
  const titleRef = useRef(null);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const update = () => setMenuHeight(el.offsetHeight || 160);
    update();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [step]);

  // ── Параллакс: заголовок плавно исчезает при скролле ─────────────────────────
  useEffect(() => {
    if (step === 1) {
      if (titleRef.current) titleRef.current.style.opacity = 1;
      return;
    }
    const handleScroll = () => {
      if (!titleRef.current) return;
      const opacity = Math.max(0, 1 - window.scrollY / 100);
      titleRef.current.style.opacity = opacity;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step]);

  // ── Сеттеры ─────────────────────────────────────────────────────────────────
  const setField   = k => v => setFields(f    => ({ ...f, [k]: v }));
  const commitField = k => v => setCommitted(c => ({ ...c, [k]: v }));
  const setFile    = k => v => setFiles(f     => ({ ...f, [k]: v }));
  const setToggle  = k => v => setToggles(t   => ({ ...t, [k]: v }));

  // ── Валидация ────────────────────────────────────────────────────────────────
  const hasLetters  = v => /[a-zA-Zа-яА-ЯёЁ]/.test(v);
  const digitError  = (v, n, msg) => v.length > 0 ? (hasLetters(v) || v.replace(/\D/g, '').length !== n ? msg : null) : null;

  const errors = {
    name:           committed.name.trim().length > 0 && committed.name.trim().split(' ').filter(Boolean).length < 2 ? 'Введите ваше полное имя' : null,
    snils:          digitError(committed.snils, 11, 'Введите 11 цифр вашего номера СНИЛС'),
    inn:            digitError(committed.inn, 12, 'Введите 12 цифр вашего номера ИНН'),
    passport:       files.passport.length === 1 ? 'Добавьте фото / сканы всех заполненных страниц' : null,
    driverLicense:  files.driverLicense.length === 1 ? 'Добавьте фото / сканы двух сторон' : null,
    voennik:        files.voennik.length === 1 ? 'Добавьте фото / сканы всех страниц' : null,
    contractNumber: digitError(committed.contractNumber, 10, 'Введите 10 цифр вашего номера договора'),
    accountNumber:  digitError(committed.accountNumber, 20, 'Введите 20 цифр номера счета'),
    bik:            digitError(committed.bik, 9, 'Введите 9 цифр БИК'),
    corrAccount:    digitError(committed.corrAccount, 20, 'Введите 20 цифр корреспондентского счета'),
  };

  // ── Готовность полей (по fields — обновляется при каждом вводе, без ожидания blur) ───
  const nameComplete      = fields.name.trim().split(' ').filter(Boolean).length >= 2;
  const passportComplete  = files.passport.length >= 2;
  const snilsComplete     = fields.snils.replace(/\D/g, '').length === 11 || files.snilsFiles.length > 0;
  const innComplete       = fields.inn.replace(/\D/g, '').length === 12 || files.innFiles.length > 0;
  const workbookComplete  = files.workbook.length > 0;
  const educationComplete = toggles.noEducation || (fields.educationPlace.trim().length > 0 && files.educationFiles.length > 0);
  const paymentComplete   =
    fields.contractNumber.replace(/\D/g, '').length === 10 &&
    fields.accountNumber.replace(/\D/g, '').length === 20 &&
    fields.bik.replace(/\D/g, '').length === 9 &&
    fields.corrAccount.replace(/\D/g, '').length === 20;

  // Блокируем переход 2→3 пока не заполнено всё
  const step2Complete = passportComplete && snilsComplete && innComplete && workbookComplete && educationComplete && paymentComplete;

  // ── Чипы прогресса (без ФИО) ────────────────────────────────────────────────
  const step2Chips = [
    { label: 'Паспорт',     anchorId: 'doc-passport',  done: passportComplete  },
    { label: 'СНИЛС',       anchorId: 'doc-snils',     done: snilsComplete     },
    { label: 'ИНН',         anchorId: 'doc-inn',       done: innComplete       },
    { label: 'Трудовая',    anchorId: 'doc-workbook',  done: workbookComplete  },
    { label: 'Образование', anchorId: 'doc-education', done: educationComplete },
    { label: 'Реквизиты',   anchorId: 'doc-payment',   done: paymentComplete   },
  ];

  const step3Chips = [
    { label: 'Английский',   anchorId: 'doc-eng',     done: true },
    { label: 'Семья',        anchorId: 'doc-marital',  done: true },
    { label: 'Водительское', anchorId: 'doc-driver',   done: files.driverLicense.length === 0 || files.driverLicense.length >= 2 },
    { label: 'Военник',      anchorId: 'doc-voennik',  done: files.voennik.length === 0 || files.voennik.length >= 2 },
  ];

  // ── Helpers для direct-upload на Яндекс.Диск ───────────────────────────────
  // Файлы летят из браузера мимо нашего сервера — иначе на Vercel
  // не влезем в 4.5 MB / 10 сек лимиты serverless-функций.
  const getExt = (name) => {
    const e = (name ?? '').split('.').pop().toLowerCase();
    return e || 'file';
  };

  // Универсальный direct-upload: файлы И текст одним пайплайном.
  // items: [{ path, file?: File|Blob, content?: string }]
  // — Сервер (/api/sign-uploads) только выдаёт href'ы от Яндекса.
  // — Клиент PUT'ит байты напрямую в uploader*.disk.yandex.net.
  // Плюс: серверный fetch к uploader-доменам (который флэйкает из Node) исключён.
  async function uploadDirect(items) {
    if (!items.length) return;
    const normalized = items.map(({ path, file, content }) => ({
      path,
      body: content !== undefined
        ? new Blob([content], { type: 'text/plain; charset=utf-8' })
        : file,
    }));
    const r = await fetch('/api/sign-uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: normalized.map(i => i.path) }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.error ?? 'sign-uploads failed');
    }
    const { links } = await r.json(); // [{ path, href }]
    const hrefByPath = new Map(links.map(l => [l.path, l.href]));
    // PUT с retry на транзиентные сбои (Яндекс любит иногда уронить соединение).
    const putWithRetry = async (path, body, attempt = 1) => {
      try {
        const put = await fetch(hrefByPath.get(path), { method: 'PUT', body });
        if (!put.ok) {
          const t = await put.text().catch(() => '');
          throw new Error(`PUT ${path} (${put.status}): ${t.slice(0, 160)}`);
        }
      } catch (e) {
        if (attempt < 3) {
          await new Promise(res => setTimeout(res, 300 * attempt));
          return putWithRetry(path, body, attempt + 1);
        }
        throw e;
      }
    };
    await Promise.all(normalized.map(({ path, body }) => {
      if (!hrefByPath.get(path)) throw new Error(`no href for ${path}`);
      return putWithRetry(path, body);
    }));
  }

  // ── Фон: создание папок (один раз) ──────────────────────────────────────────
  const ensureFolders = useCallback(fullName => {
    if (foldersPromiseRef.current) return foldersPromiseRef.current;
    foldersPromiseRef.current = fetch('/api/create-folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName }),
    }).then(r => {
      if (!r.ok) return r.json().then(e => Promise.reject(new Error(e.error ?? 'create-folders failed')));
      return r.json(); // → { basePath }
    });
    return foldersPromiseRef.current;
  }, []);

  // ── Обработчики переходов ────────────────────────────────────────────────────

  // 1 → 2: папки создаются в фоне, пользователь сразу видит экран 2
  const handleStep1Continue = useCallback(() => {
    if (!nameComplete) return;
    ensureFolders(normalizeName(fields.name)); // fire & forget
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nameComplete, fields.name, ensureFolders]);

  // 2 → 3: стартуем загрузку файлов в фоне, не ждём
  const handleStep2Continue = useCallback(() => {
    if (!step2Complete) return;

    // Запускаем только один раз
    if (!step2UploadPromiseRef.current) {
      // Сохраняем снапшот состояния прямо сейчас (до перехода на экран 3)
      const snap = {
        snils:       committed.snils,
        inn:         committed.inn,
        educationPlace: committed.educationPlace,
        contractNumber: committed.contractNumber,
        accountNumber: committed.accountNumber,
        bik:         committed.bik,
        corrAccount: committed.corrAccount,
        noEducation: toggles.noEducation,
        passport:    [...files.passport],
        snilsFiles:  [...files.snilsFiles],
        innFiles:    [...files.innFiles],
        workbook:    [...files.workbook],
        educationFiles: [...files.educationFiles],
      };

      step2UploadPromiseRef.current = (async () => {
        // Ждём basePath (папки должны быть созданы ~5 сек)
        const { basePath } = await foldersPromiseRef.current;

        // ── Собираем ВСЁ (файлы + текст) в один массив ───────────────────────
        const items = [];
        const pushFiles = (folder, list) =>
          list.forEach((file, i) => items.push({
            path: `${basePath}/${folder}/${i + 1}.${getExt(file.name)}`,
            file,
          }));

        pushFiles('1. Паспорт',         snap.passport);
        pushFiles('2. СНИЛС',           snap.snilsFiles);
        pushFiles('3. ИНН',             snap.innFiles);
        pushFiles('4. Трудовая книжка', snap.workbook);
        if (!snap.noEducation) pushFiles('5. Образование', snap.educationFiles);

        const snilsNum = digitsOnly(snap.snils);
        if (snilsNum) items.push({ path: `${basePath}/2. СНИЛС/Номер СНИЛС.txt`, content: snilsNum });
        const innNum = digitsOnly(snap.inn);
        if (innNum) items.push({ path: `${basePath}/3. ИНН/Номер ИНН.txt`, content: innNum });
        if (!snap.noEducation && snap.educationPlace.trim()) {
          items.push({ path: `${basePath}/5. Образование/Учебное заведение.txt`, content: snap.educationPlace.trim() });
        }
        const paymentText = [
          `Номер договора:         ${digitsOnly(snap.contractNumber)}`,
          `Номер счёта:            ${digitsOnly(snap.accountNumber)}`,
          `БИК:                    ${digitsOnly(snap.bik)}`,
          `Корреспондентский счёт: ${digitsOnly(snap.corrAccount)}`,
        ].join('\n');
        items.push({ path: `${basePath}/Реквизиты.txt`, content: paymentText });

        // Одним direct-upload'ом — всё параллельно, ничего не идёт через наш сервер
        await uploadDirect(items);
      })();
    }

    setStep(3);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step2Complete, committed, files, toggles]);

  // 3 → Готово: ждём фоновые загрузки, затем отправляем данные экрана 3
  const handleFinish = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setServerError(null);

    try {
      // Ждём завершения фоновых операций (если ещё идут)
      await foldersPromiseRef.current;
      if (step2UploadPromiseRef.current) await step2UploadPromiseRef.current;

      const { basePath } = await foldersPromiseRef.current;

      // ── Шаг 3: файлы + текст одним пайплайном direct-upload ───────────────
      const items = [];
      files.driverLicense.forEach((file, i) => items.push({
        path: `${basePath}/7. Водительские права/${i + 1}.${getExt(file.name)}`,
        file,
      }));
      files.voennik.forEach((file, i) => items.push({
        path: `${basePath}/8. Военный билет/${i + 1}.${getExt(file.name)}`,
        file,
      }));
      if (toggles.engLevel) {
        items.push({ path: `${basePath}/6. Уровень английского.txt`, content: toggles.engLevel });
      }
      const familyText = [
        `Семейное положение: ${toggles.marital === 'В браке' ? 'В браке' : 'Не в браке'}`,
        `Дети: ${toggles.hasChildren ? 'Есть' : 'Нет'}`,
      ].join('\n');
      items.push({ path: `${basePath}/9. О семье.txt`, content: familyText });

      await uploadDirect(items);

      setIsSuccess(true);
    } catch (err) {
      console.error('[finish]', err);
      setServerError(err.message || 'Не удалось отправить данные. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, toggles, files]);

  const handleBack = useCallback(() => {
    setStep(s => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ── Head (общий) ─────────────────────────────────────────────────────────────
  const pageHead = (
    <Head>
      <title>Мультифора</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#F5F5F5" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#0A0A0B"  media="(prefers-color-scheme: dark)"  />
      <style>{cssVars}</style>
    </Head>
  );

  // ── Экран успеха ──────────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <>
        {pageHead}
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          gap: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 64 }}>✅</div>
          <div style={{ color: 'var(--text-primary)', fontFamily: 'Onest', fontSize: 28, fontWeight: 700, lineHeight: '110%' }}>
            Документы отправлены
          </div>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, lineHeight: '140%', maxWidth: 320 }}>
            Мы получили ваши данные и&nbsp;свяжемся с&nbsp;вами в&nbsp;ближайшее время
          </div>
        </div>
      </>
    );
  }

  // ── Основной рендер ──────────────────────────────────────────────────────────
  return (
    <>
      {pageHead}

      {/*
        Обёртка-колонка на весь вьюпорт.
        Экраны 2 и 3: Task + DocList (прокрутка страницы) + BottomMenu (fixed).
        Экран 1: Task + центрированная карточка с кнопкой.
      */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* ── Task (header) ── */}
        <Task step={step} onBack={step > 1 ? handleBack : null} titleRef={titleRef} />

        {/* ─────────────── ЭКРАН 1 ─────────────── */}
        {step === 1 && (
          /*
            Группа «карточка + кнопка» ровно по центру экрана — и на смартфоне, и на Desktop.
            position: fixed + top/left 50% + translate(-50%,-50%) даёт точный геометрический центр
            вьюпорта независимо от высоты Task сверху.
          */
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: 402,
            padding: '0 8px',
            boxSizing: 'border-box',
            zIndex: 1,
          }}>
            {/* Карточка ФИО */}
            <DocCard id="doc-name" title="Назовите ФИО">
              <TextField
                placeholder="Фамилия Имя Отчество"
                value={fields.name}
                onChange={v => setField('name')(toRussianName(v))}
                onCommit={commitField('name')}
                error={errors.name}
              />
            </DocCard>

            {/* Кнопка «Начать» — ровно 8px от карточки */}
            <button
              onClick={handleStep1Continue}
              disabled={!nameComplete}
              style={{
                marginTop: 8,
                display: 'flex',
                width: '100%',
                height: 56,
                padding: '0 16px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 16,
                border: 'none',
                background: nameComplete ? '#446BF2' : 'var(--ctrl-disabled)',
                color: nameComplete ? '#FFFFFF' : 'var(--text-disabled)',
                fontFamily: 'Onest',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: '16px',
                cursor: nameComplete ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              Начать
            </button>
          </div>
        )}

        {/* ─────────────── ЭКРАН 2 ─────────────── */}
        {step === 2 && (
          <>
            {/*
              DocList идёт сразу после Task.
              Зазор = Task.paddingBottom(8) + DocList.paddingTop(4) = 12px ✓
              paddingBottom = menuHeight + 8 — гарантирует ровно 8px при максимальной прокрутке
            */}
            <DocList bottomPad={menuHeight + 8}>
              <DocCard id="doc-passport" title="Паспорт">
                <FileUpload hint="Загрузите фото или сканы всех страниц" value={files.passport} onChange={setFile('passport')} error={errors.passport} maxFiles={20} />
              </DocCard>

              <DocCard id="doc-snils" title="СНИЛС">
                <TextField placeholder="12345678901" value={fields.snils} onChange={v => setField('snils')(toDigitsOnly(v))} onCommit={commitField('snils')} error={errors.snils} digitOnly />
                <FileUpload value={files.snilsFiles} onChange={setFile('snilsFiles')} compact buttonLabel="Загрузить фото или скан" maxFiles={1} />
              </DocCard>

              <DocCard id="doc-inn" title="ИНН">
                <TextField placeholder="123456789012" value={fields.inn} onChange={v => setField('inn')(toDigitsOnly(v))} onCommit={commitField('inn')} error={errors.inn} digitOnly />
                <FileUpload value={files.innFiles} onChange={setFile('innFiles')} compact buttonLabel="Загрузить фото или скан" maxFiles={1} />
              </DocCard>

              <DocCard id="doc-workbook" title="Трудовая книжка">
                <FileUpload hint="Оригинал или выписка с Госуслуг" value={files.workbook} onChange={setFile('workbook')} maxFiles={1} />
              </DocCard>

              <DocCard id="doc-education" title="Образование">
                <TextField label="Учебное заведение и специальность" placeholder="ВУЗ, специальность" value={fields.educationPlace} onChange={v => setField('educationPlace')(toRussianName(v))} onCommit={commitField('educationPlace')} />
                {!toggles.noEducation && (
                  <FileUpload hint="Фото или скан диплома или аттестата" value={files.educationFiles} onChange={setFile('educationFiles')} maxFiles={5} />
                )}
                <Checkbox label="Нет диплома или аттестата" checked={toggles.noEducation} onChange={setToggle('noEducation')} />
              </DocCard>

              <DocCard id="doc-payment" title="Реквизиты">
                <TextField label="Номер договора"    placeholder="1234567890"           value={fields.contractNumber} onChange={v => setField('contractNumber')(toDigitsOnly(v))} onCommit={commitField('contractNumber')} error={errors.contractNumber} digitOnly />
                <TextField label="Номер счета"        placeholder="12345678901234567890" value={fields.accountNumber}  onChange={v => setField('accountNumber')(toDigitsOnly(v))}  onCommit={commitField('accountNumber')}  error={errors.accountNumber}  digitOnly />
                <TextField label="БИК"                placeholder="123456789"           value={fields.bik}            onChange={v => setField('bik')(toDigitsOnly(v))}            onCommit={commitField('bik')}            error={errors.bik}            digitOnly />
                <TextField label="Корр. счет"         placeholder="12345678901234567890" value={fields.corrAccount}    onChange={v => setField('corrAccount')(toDigitsOnly(v))}    onCommit={commitField('corrAccount')}    error={errors.corrAccount}    digitOnly />
              </DocCard>
            </DocList>

            <BottomMenu
              ref={menuRef}
              chips={step2Chips}
              buttonLabel="Продолжить"
              onButton={handleStep2Continue}
              buttonDisabled={!step2Complete}
            />
          </>
        )}

        {/* ─────────────── ЭКРАН 3 ─────────────── */}
        {step === 3 && (
          <>
            <DocList bottomPad={menuHeight + 8}>
              <DocCard id="doc-eng" title="Уровень английского">
                <SegmentPicker options={['A1','A2','B1','B2','C1','C2']} value={toggles.engLevel} onChange={setToggle('engLevel')} />
              </DocCard>

              <DocCard id="doc-marital" title="Семейное положение">
                <SegmentPicker options={['Не в браке', 'В браке']} value={toggles.marital} onChange={setToggle('marital')} />
                <Checkbox label="Есть дети" checked={toggles.hasChildren} onChange={setToggle('hasChildren')} />
              </DocCard>

              <DocCard id="doc-driver" title="Водительские права" subtitle="При наличии">
                <FileUpload hint="Лицевая и обратная стороны" value={files.driverLicense} onChange={setFile('driverLicense')} error={errors.driverLicense} maxFiles={2} />
              </DocCard>

              <DocCard id="doc-voennik" title="Военный билет" subtitle="Военнообязанным">
                <FileUpload hint="Загрузите фото или сканы всех страниц" value={files.voennik} onChange={setFile('voennik')} error={errors.voennik} maxFiles={20} />
              </DocCard>
            </DocList>

            <BottomMenu
              ref={menuRef}
              chips={step3Chips}
              buttonLabel={isSubmitting ? 'Отправка…' : 'Готово'}
              onButton={handleFinish}
              buttonDisabled={isSubmitting}
              errorText={serverError}
            />
          </>
        )}

      </div>
    </>
  );
}
