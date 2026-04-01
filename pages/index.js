import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

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

const cssVars = `
  :root {
    --page-bg:            #F5F5F5;
    --card-bg:            #FFFFFF;
    --field-bg:           rgba(51,54,63,0.05);
    --sheet-bg:           rgba(51,54,63,0.05);
    --sheet-blur:         rgba(255,255,255,0.05);
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
    --linear-primary:     #E6E6EB;
    --linear-secondary:   rgba(230,230,235,0.30);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --page-bg:            #1E1E20;
      --card-bg:            #131315;
      --field-bg:           rgba(230,230,235,0.05);
      --sheet-bg:           rgba(230,230,235,0.05);
      --sheet-blur:         rgba(19,19,21,0.05);
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
      --linear-primary:     rgba(230,230,235,0.30);
      --linear-secondary:   rgba(230,230,235,0.05);
    }
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--page-bg); min-height: 100vh; }
  html { height: -webkit-fill-available; }
  body { min-height: -webkit-fill-available; padding-bottom: env(safe-area-inset-bottom, 0px); }
  input::placeholder { color: var(--text-disabled); font-family: SF Pro Text, -apple-system, sans-serif; font-size: 17px; letter-spacing: -0.408px; }
  input { caret-color: #446BF2; }
  ::-webkit-scrollbar { display: none; }
  @property --ha {
    syntax: '<angle>';
    inherits: true;
    initial-value: 135deg;
  }
  .gb { position: relative; border: none !important; }
  .gb::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 0.5px;
    background: conic-gradient(from var(--ha) at 50% 50%, var(--linear-primary) 0deg, var(--linear-secondary) 180deg, var(--linear-primary) 360deg);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 10;
  }
`;

function useGyroscope() {
  useEffect(() => {
    let raf;
    const set = deg => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        document.documentElement.style.setProperty('--ha', `${deg}deg`)
      );
    };
    const onOrientation = e => set(((e.gamma ?? 0) + 90) / 180 * 360);
    const onMouse = e => set(e.clientX / window.innerWidth * 360);
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const ask = () => {
        DeviceOrientationEvent.requestPermission().then(s => {
          if (s === 'granted') window.addEventListener('deviceorientation', onOrientation);
        });
        document.removeEventListener('pointerdown', ask);
      };
      document.addEventListener('pointerdown', ask);
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', onOrientation);
    }
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(raf);
    };
  }, []);
}

function CriticalMessage({ text }) {
  if (!text) return null;
  return (
    <div style={{ alignSelf: 'stretch', color: 'var(--error-text)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '124%' }}>
      {text}
    </div>
  );
}

function TextField({ label, placeholder, value, onChange, onCommit, error }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const showIcon = focused || value.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, alignSelf: 'stretch' }}>
      {label && (
        <div style={{ alignSelf: 'stretch', color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '124%' }}>
          {label}
        </div>
      )}
      <div
        className={error ? undefined : 'gb'}
        style={{ display: 'flex', height: 44, paddingLeft: 16, alignItems: 'flex-start', alignSelf: 'stretch', borderRadius: 16, border: 'none', outline: error ? '0.5px solid var(--error-border)' : 'none', outlineOffset: '-0.5px', background: 'var(--field-bg)', overflow: 'hidden' }}
      >
        <div style={{ flex: '1 0 0', alignSelf: 'stretch', display: 'flex', alignItems: 'flex-start', padding: '11px 16px 11px 0', minWidth: 0 }}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
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
      <CriticalMessage text={error} />
    </div>
  );
}

function FileThumb({ file, onRemove }) {
  const isImage = file.type.startsWith('image/');
  const displayName = file.name.length > 12 ? file.name.slice(0, 10) + '…' : file.name;

  return (
    <div style={{ width: 150, height: 150, position: 'relative', background: isImage ? 'var(--card-bg)' : 'var(--field-bg)', overflow: 'hidden', borderRadius: 8, flexShrink: 0 }}>
      {isImage && <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: 150, height: 150, objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

function FileUpload({ hint, value, onChange, compact = false, buttonLabel = 'Загрузить', error }) {
  const handleChange = e => { onChange([...value, ...Array.from(e.target.files)]); e.target.value = ''; };
  const uploadBtnStyle = (w, h) => ({ display: 'flex', width: w, height: h, justifyContent: 'center', alignItems: 'center', borderRadius: 16, border: 'none', outline: '1px dashed #446BF2', outlineOffset: '-1px', background: 'var(--primary-bg)', cursor: 'pointer' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, alignSelf: 'stretch' }}>
      {hint && <div style={{ alignSelf: 'stretch', color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%' }}>{hint}</div>}
      {value.length === 0 ? (
        <label style={{ ...uploadBtnStyle(compact ? 'auto' : '100%', compact ? 44 : 89), alignSelf: compact ? 'flex-start' : 'stretch', padding: '0 16px', gap: 8, minHeight: compact ? 44 : 56 }}>
          <IconUpload />
          <span style={{ color: '#446BF2', fontFamily: 'Onest', fontSize: 16, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap' }}>{buttonLabel}</span>
          <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleChange} style={{ display: 'none' }} />
        </label>
      ) : (
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 8, alignSelf: 'stretch', height: 150 }}>
          <label style={uploadBtnStyle(87, '100%')}>
            <IconUpload />
            <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleChange} style={{ display: 'none' }} />
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', flex: 1, minWidth: 0 }}>
            {value.map((file, i) => <FileThumb key={i} file={file} onRemove={() => onChange(value.filter((_, idx) => idx !== i))} />)}
          </div>
        </div>
      )}
      <CriticalMessage text={error} />
    </div>
  );
}

function SegmentPicker({ options, value, onChange }) {
  return (
    <div className="gb" style={{ display: 'flex', height: 44, minHeight: 44, padding: 2, alignItems: 'center', alignSelf: 'stretch', borderRadius: 18, background: 'var(--field-bg)', overflow: 'hidden' }}>
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
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  return (
    <button onClick={scrollTo} className={done ? undefined : 'gb'} style={{ display: 'inline-flex', height: 32, padding: '0 10px 0 4px', alignItems: 'center', gap: 2, borderRadius: 16, border: 'none', outline: done ? '0.5px solid var(--border-good)' : 'none', outlineOffset: '-0.5px', background: 'var(--card-bg)', backdropFilter: 'blur(2px)', cursor: 'pointer', flexShrink: 0 }}>
      {done ? <IconCheckDone /> : <IconCheckEmpty />}
      <div style={{ color: 'var(--text-secondary)', fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%', whiteSpace: 'nowrap' }}>{label}</div>
    </button>
  );
}

export default function Home() {
  useGyroscope();

  const [fields, setFields] = useState({ name: '', snils: '', inn: '', educationPlace: '', contractNumber: '', accountNumber: '', bik: '', corrAccount: '' });
  const [committed, setCommitted] = useState({ name: '', snils: '', inn: '', educationPlace: '', contractNumber: '', accountNumber: '', bik: '', corrAccount: '' });
  const [files, setFiles] = useState({ passport: [], snilsFiles: [], innFiles: [], workbook: [], educationFiles: [], driverLicense: [], voennik: [] });
  const [toggles, setToggles] = useState({ engLevel: 'A1', marital: 'Не в браке', noEducation: false, hasChildren: false });

  const setField = k => v => setFields(f => ({ ...f, [k]: v }));
  const commitField = k => v => setCommitted(c => ({ ...c, [k]: v }));
  const setFile = k => v => setFiles(f => ({ ...f, [k]: v }));
  const setToggle = k => v => setToggles(t => ({ ...t, [k]: v }));

  const hasLetters = v => /[a-zA-Zа-яА-ЯёЁ]/.test(v);
  const digitError = (v, n, msg) => v.length > 0 ? (hasLetters(v) || v.replace(/\D/g, '').length !== n ? msg : null) : null;

  const errors = {
    name: committed.name.trim().length > 0 && committed.name.trim().split(' ').filter(Boolean).length < 2 ? 'Введите ваше полное имя' : null,
    snils: digitError(committed.snils, 11, 'Введите 11 цифр вашего номера СНИЛС'),
    inn: digitError(committed.inn, 12, 'Введите 12 цифр вашего номера ИНН'),
    passport: files.passport.length === 1 ? 'Добавьте фото / сканы всех заполненных страниц' : null,
    driverLicense: files.driverLicense.length === 1 ? 'Добавьте фото / сканы двух сторон' : null,
    contractNumber: digitError(committed.contractNumber, 10, 'Введите 10 цифр вашего номера договора'),
    accountNumber: digitError(committed.accountNumber, 20, 'Введите 20 цифр номера счета'),
    bik: digitError(committed.bik, 9, 'Введите 9 цифр БИК'),
    corrAccount: digitError(committed.corrAccount, 20, 'Введите 20 цифр корреспондентского счета'),
  };

  const checks = [
    { label: 'ФИО',          anchorId: 'doc-name',      done: committed.name.trim().split(' ').filter(Boolean).length >= 2 },
    { label: 'Паспорт',      anchorId: 'doc-passport',  done: files.passport.length >= 2 },
    { label: 'СНИЛС',        anchorId: 'doc-snils',     done: committed.snils.replace(/\D/g, '').length === 11 || files.snilsFiles.length > 0 },
    { label: 'ИНН',          anchorId: 'doc-inn',       done: committed.inn.replace(/\D/g, '').length === 12 || files.innFiles.length > 0 },
    { label: 'Трудовая',     anchorId: 'doc-workbook',  done: files.workbook.length > 0 },
    { label: 'Образование',  anchorId: 'doc-education', done: toggles.noEducation || committed.educationPlace.trim().length > 3 },
    { label: 'Английский',   anchorId: 'doc-eng',       done: true },
    { label: 'Водительское', anchorId: 'doc-driver',    done: files.driverLicense.length >= 2 },
    { label: 'Военник',      anchorId: 'doc-voennik',   done: files.voennik.length > 0 },
    { label: 'Семья',        anchorId: 'doc-marital',   done: true },
    { label: 'Реквизиты',    anchorId: 'doc-payment',   done: committed.contractNumber.replace(/\D/g, '').length === 10 && committed.accountNumber.replace(/\D/g, '').length === 20 && committed.bik.replace(/\D/g, '').length === 9 },
  ];

  const isReady = checks.filter(c => !['Английский', 'Водительское', 'Военник', 'Семья'].includes(c.label)).every(c => c.done);

  return (
    <>
      <Head>
        <title>Мультифора</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style>{cssVars}</style>
      </Head>

      <div style={{ width: '100%', maxWidth: 402, margin: '0 auto', paddingTop: 16, paddingBottom: 'calc(132px + env(safe-area-inset-bottom, 0px))', paddingLeft: 8, paddingRight: 8, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <DocCard id="doc-name" title="ФИО">
          <TextField placeholder="Фамилия Имя Отчество" value={fields.name} onChange={setField('name')} onCommit={commitField('name')} error={errors.name} />
        </DocCard>

        <DocCard id="doc-passport" title="Паспорт">
          <FileUpload hint="Загрузите фото или сканы всех страниц" value={files.passport} onChange={setFile('passport')} error={errors.passport} />
        </DocCard>

        <DocCard id="doc-snils" title="СНИЛС">
          <TextField placeholder="123-456-789 00" value={fields.snils} onChange={setField('snils')} onCommit={commitField('snils')} error={errors.snils} />
          <FileUpload value={files.snilsFiles} onChange={setFile('snilsFiles')} compact buttonLabel="Загрузить фото или скан" />
        </DocCard>

        <DocCard id="doc-inn" title="ИНН">
          <TextField placeholder="12345 67890 12" value={fields.inn} onChange={setField('inn')} onCommit={commitField('inn')} error={errors.inn} />
          <FileUpload value={files.innFiles} onChange={setFile('innFiles')} compact buttonLabel="Загрузить фото или скан" />
        </DocCard>

        <DocCard id="doc-workbook" title="Трудовая книжка">
          <FileUpload hint="Оригинал или выписка с Госуслуг" value={files.workbook} onChange={setFile('workbook')} />
        </DocCard>

        <DocCard id="doc-education" title="Образование">
          <TextField label="Учебное заведение и специальность" placeholder="ВПО ВУЗ Веб-дизайнер" value={fields.educationPlace} onChange={setField('educationPlace')} onCommit={commitField('educationPlace')} />
          {!toggles.noEducation && <FileUpload hint="Фото или скан диплома или аттестата" value={files.educationFiles} onChange={setFile('educationFiles')} />}
          <Checkbox label="Нет диплома или аттестата" checked={toggles.noEducation} onChange={setToggle('noEducation')} />
        </DocCard>

        <DocCard id="doc-eng" title="Уровень английского">
          <SegmentPicker options={['A1','A2','B1','B2','C1','C2']} value={toggles.engLevel} onChange={setToggle('engLevel')} />
        </DocCard>

        <DocCard id="doc-driver" title="Водительские права" subtitle="При наличии">
          <FileUpload hint="Лицевая и обратная стороны" value={files.driverLicense} onChange={setFile('driverLicense')} error={errors.driverLicense} />
        </DocCard>

        <DocCard id="doc-voennik" title="Военный билет" subtitle="Военнообязанным">
          <FileUpload hint="Загрузите фото или сканы всех страниц" value={files.voennik} onChange={setFile('voennik')} />
        </DocCard>

        <DocCard id="doc-marital" title="Семейное положение">
          <SegmentPicker options={['Не в браке', 'В браке']} value={toggles.marital} onChange={setToggle('marital')} />
          <Checkbox label="Есть дети" checked={toggles.hasChildren} onChange={setToggle('hasChildren')} />
        </DocCard>

        <DocCard id="doc-payment" title="Реквизиты">
          <TextField label="Номер договора" placeholder="1234567890"          value={fields.contractNumber} onChange={setField('contractNumber')} onCommit={commitField('contractNumber')} error={errors.contractNumber} />
          <TextField label="Номер счета"    placeholder="12345678901234567890" value={fields.accountNumber}  onChange={setField('accountNumber')}  onCommit={commitField('accountNumber')}  error={errors.accountNumber} />
          <TextField label="БИК"            placeholder="123456789"           value={fields.bik}            onChange={setField('bik')}            onCommit={commitField('bik')}            error={errors.bik} />
          <TextField label="Корр. счет"     placeholder="12345678901234567890" value={fields.corrAccount}    onChange={setField('corrAccount')}    onCommit={commitField('corrAccount')}    error={errors.corrAccount} />
        </DocCard>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 402, padding: '0 8px calc(env(safe-area-inset-bottom, 0px) + 8px) 8px', zIndex: 100 }}>
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }} />
        <div style={{ position: 'relative', background: 'var(--panel-bg)', borderRadius: 24, border: 'none', outline: '0.5px solid var(--panel-border)', outlineOffset: '-0.5px', boxShadow: '0 2px 40px 0 rgba(0,0,0,0.10)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 8px 0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
              {checks.map(({ label, done, anchorId }) => <CheckChip key={label} label={label} done={done} anchorId={anchorId} />)}
            </div>
          </div>
          <div style={{ padding: '8px' }}>
            <button disabled={!isReady} style={{ display: 'flex', width: '100%', height: 56, padding: '0 16px', justifyContent: 'center', alignItems: 'center', borderRadius: 16, border: 'none', background: isReady ? '#446BF2' : 'var(--ctrl-disabled)', color: isReady ? '#FFFFFF' : 'var(--text-disabled)', fontFamily: 'Onest', fontSize: 16, fontWeight: 500, lineHeight: '16px', cursor: isReady ? 'pointer' : 'default', transition: 'all 0.2s' }}>
              Отправить
            </button>
          </div>
        </div>
      </div>
    </>
  );
}