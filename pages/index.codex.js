import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

// ─── Токены (Figma Variables: Light/Dark) ───────────────────────────────────
const C = {
  primary: 'var(--controls-primary-bg)',
  primaryBg: 'var(--controls-attachment-bg)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textDisabled: 'var(--text-disabled)',
  textWhite: 'var(--text-control-white)',
  pageBg: 'var(--page-bg-secondary)',
  cardBg: 'var(--page-bg-primary)',
  fieldBg: 'var(--page-bg-secondary)',
  border: 'var(--basic-border)',
  borderLight: 'var(--linear-primary)',
  borderGood: 'var(--success-border)',
  sheetBg: 'var(--sheet-bg-blur)',
  sheetSurface: 'var(--page-bg-tertiary)',
  segmentBg: 'var(--controls-segment-bg)',
  controlGray: 'var(--text-control-gray)',
  deleteBg: 'var(--delete-bg)',
};

// ─── Иконки из Figma Dev Mode ────────────────────────────────────────────────
const IconCheckDone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM10.9326 13.5176L8.70703 11.293L7.29297 12.707L11.0674 16.4814L11.7686 15.6406L16.7686 9.64062L15.2314 8.35938L10.9326 13.5176Z" fill="#34C759" />
  </svg>
);

const IconCheckEmpty = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM10.9326 13.5176L8.70703 11.293L7.29297 12.707L11.0674 16.4814L11.7686 15.6406L16.7686 9.64062L15.2314 8.35938L10.9326 13.5176Z" fill={C.textDisabled} />
  </svg>
);

const IconDelete = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM12 10.5859L8.70703 7.29297L7.29297 8.70703L10.5859 12L7.29297 15.293L8.70703 16.707L12 13.4141L15.293 16.707L16.707 15.293L13.4141 12L16.707 8.70703L15.293 7.29297L12 10.5859Z" fill={C.textWhite} />
  </svg>
);

// Иконка загрузки (точно по Figma)
const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
    <path d="M10 5L10.7071 4.29289L10 3.58579L9.29289 4.29289L10 5ZM9 14V15H11V14H10H9ZM4 18H3V20H4V19V18ZM16 20H17V18H16V19V20ZM5 10L5.70711 10.7071L10.7071 5.70711L10 5L9.29289 4.29289L4.29289 9.29289L5 10ZM10 5L9.29289 5.70711L14.2929 10.7071L15 10L15.7071 9.29289L10.7071 4.29289L10 5ZM10 5L9 5L9 14H10H11L11 5L10 5ZM4 19V20H16V19V18H4V19Z" fill={C.primary} />
  </svg>
);

// ─── TextField ───────────────────────────────────────────────────────────────
function TextField({ label, placeholder, value, onChange, onCommit }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, alignSelf: 'stretch' }}>
      {label && (
        <div style={{ alignSelf: 'stretch', color: C.textSecondary, fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '124%' }}>
          {label}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          height: 44,
          paddingLeft: 16,
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          borderRadius: 16,
          border: `0.5px solid ${focused ? C.primary : C.borderLight}`,
          background: C.fieldBg,
          transition: 'border-color 0.15s',
        }}
      >
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (onCommit) onCommit(value);
          }}
          onKeyDown={e => e.key === 'Enter' && e.target.blur()}
          style={{
            flex: '1 0 0',
            alignSelf: 'stretch',
            padding: '11px 16px 11px 0',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: value ? C.textPrimary : C.textDisabled,
            fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            fontSize: 17,
            fontWeight: 400,
            lineHeight: '22px',
            letterSpacing: '-0.408px',
            width: '100%',
            caretColor: C.primary,
            fontFeatureSettings: "'case' 1",
          }}
        />
      </div>
    </div>
  );
}

// ─── FileThumb ───────────────────────────────────────────────────────────────
function FileThumb({ file, onRemove }) {
  const isImage = file.type.startsWith('image/');
  const url = useMemo(() => (isImage ? URL.createObjectURL(file) : null), [file, isImage]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const shortName = file.name.length > 12 ? `${file.name.slice(0, 10)}…` : file.name;

  return (
    <div style={{ width: 150, height: 150, position: 'relative', background: C.cardBg, overflow: 'hidden', borderRadius: 8, flexShrink: 0 }}>
      {isImage ? (
        <img src={url} alt={file.name} style={{ width: 150, height: 150, objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
      ) : (
        <div
          style={{
            width: 150,
            height: 150,
            position: 'absolute',
            top: 0,
            left: 0,
            background: C.primaryBg,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 26,
          }}
        >
          <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="47" height="62" viewBox="0 0 47 62" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="43" height="58" rx="5.42" stroke={C.primary} strokeWidth="4" fill="none" />
            </svg>
          </div>
          <div style={{ color: C.primary, fontFamily: 'Onest', fontSize: 14, fontWeight: 400, lineHeight: '22.4px', textAlign: 'center', marginTop: 6 }}>
            {shortName}
          </div>
        </div>
      )}

      {/* Оверлей */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 150, height: 150, background: C.sheetBg }} />

      {/* Кнопка удаления */}
      <button
        onClick={onRemove}
        aria-label="Удалить файл"
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 24,
          height: 24,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: C.deleteBg,
          border: 'none',
          borderRadius: 999,
          cursor: 'pointer',
        }}
      >
        <IconDelete />
      </button>
    </div>
  );
}

// ─── FileUpload ──────────────────────────────────────────────────────────────
function FileUpload({ hint, value, onChange, buttonText = 'Загрузить', compact = false }) {
  const hasFiles = value.length > 0;

  const handleChange = e => {
    const newFiles = Array.from(e.target.files || []);
    onChange([...value, ...newFiles]);
    e.target.value = '';
  };

  const removeFile = i => onChange(value.filter((_, idx) => idx !== i));

  const buttonHeight = compact ? 40 : hasFiles ? 56 : 89;
  const buttonMinHeight = compact ? 44 : 56;
  const buttonWidth = compact ? 'auto' : hasFiles ? 87 : '100%';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, alignSelf: 'stretch' }}>
      {hint && (
        <div style={{ alignSelf: 'stretch', color: C.textSecondary, fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%' }}>
          {hint}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          alignSelf: 'stretch',
          minHeight: compact ? 44 : 150,
          width: '100%',
        }}
      >
        {/* Кнопка загрузки */}
        <label
          style={{
            display: 'inline-flex',
            width: buttonWidth,
            height: buttonHeight,
            minHeight: buttonMinHeight,
            padding: '0 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            borderRadius: 16,
            border: `1px dashed ${C.primary}`,
            background: C.primaryBg,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ width: 20, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconUpload />
          </div>
          {(compact || !hasFiles) && (
            <span style={{ color: C.primary, fontFamily: 'Onest', fontSize: 16, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap' }}>
              {buttonText}
            </span>
          )}
          <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleChange} style={{ display: 'none' }} />
        </label>

        {/* Превью файлов со скроллом */}
        {hasFiles && (
          <div
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorX: 'contain',
              scrollbarWidth: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'max-content' }}>
              {value.map((file, i) => (
                <FileThumb key={`${file.name}-${file.size}-${i}`} file={file} onRemove={() => removeFile(i)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SegmentPicker ───────────────────────────────────────────────────────────
function SegmentPicker({ options, value, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignSelf: 'stretch',
        height: 44,
        minHeight: 44,
        padding: 2,
        background: C.fieldBg,
        borderRadius: 18,
        border: `0.5px solid ${C.borderLight}`,
        alignItems: 'center',
      }}
    >
      {options.map(opt => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              flex: '1 1 0',
              height: 40,
              minHeight: 40,
              padding: '0 10px',
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              background: selected ? C.segmentBg : 'transparent',
              boxShadow: selected ? '0px 3px 1px rgba(0,0,0,0.04), 0px 3px 8px rgba(0,0,0,0.12)' : 'none',
              outline: selected ? `0.5px solid ${C.border}` : 'none',
              color: selected ? C.controlGray : C.textPrimary,
              fontFamily: 'Onest',
              fontSize: 16,
              fontWeight: selected ? 600 : 500,
              lineHeight: '16px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'all 0.15s',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Checkbox ────────────────────────────────────────────────────────────────
function Checkbox({ label, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignSelf: 'stretch',
        height: 40,
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          position: 'relative',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: checked ? C.primary : 'transparent',
            border: checked ? 'none' : `2px solid ${C.borderLight}`,
            borderRadius: 4,
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {checked && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
              <path d="M1 5l3.5 3.5L11 1" stroke={C.textWhite} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      <div style={{ color: C.textPrimary, fontFamily: 'Onest', fontSize: 16, fontWeight: 500, lineHeight: '16px', textAlign: 'center' }}>{label}</div>
    </button>
  );
}

// ─── DocCard ─────────────────────────────────────────────────────────────────
function DocCard({ id, title, subtitle, children }) {
  return (
    <div
      id={id}
      style={{
        alignSelf: 'stretch',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 28,
        paddingBottom: 28,
        background: C.cardBg,
        borderRadius: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 20,
      }}
    >
      <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        {subtitle && (
          <div style={{ alignSelf: 'stretch', color: C.textSecondary, fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%' }}>
            {subtitle}
          </div>
        )}
        <div style={{ alignSelf: 'stretch', color: C.textPrimary, fontFamily: 'Onest', fontSize: 28, fontWeight: 700, lineHeight: '110%' }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

// ─── CheckChip ───────────────────────────────────────────────────────────────
function CheckChip({ label, done, anchorId }) {
  const scrollTo = () => {
    const el = document.getElementById(anchorId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      onClick={scrollTo}
      style={{
        display: 'inline-flex',
        height: 32,
        padding: '0 10px 0 4px',
        alignItems: 'center',
        gap: 2,
        borderRadius: 16,
        border: `0.5px solid ${done ? C.borderGood : C.borderLight}`,
        background: C.cardBg,
        backdropFilter: 'blur(2px)',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'border-color 0.2s',
      }}
    >
      {done ? <IconCheckDone /> : <IconCheckEmpty />}
      <div style={{ color: C.textSecondary, fontFamily: 'Onest', fontSize: 16, fontWeight: 400, lineHeight: '140%', whiteSpace: 'nowrap' }}>{label}</div>
    </button>
  );
}

// ─── Главная страница ────────────────────────────────────────────────────────
export default function Home() {
  const [fields, setFields] = useState({
    name: '',
    snils: '',
    inn: '',
    educationPlace: '',
    contractNumber: '',
    accountNumber: '',
    bik: '',
    corrAccount: '',
  });

  const [committed, setCommitted] = useState({
    name: '',
    snils: '',
    inn: '',
    educationPlace: '',
    contractNumber: '',
    accountNumber: '',
    bik: '',
    corrAccount: '',
  });

  const [files, setFiles] = useState({
    passport: [],
    snilsFiles: [],
    innFiles: [],
    workbook: [],
    educationFiles: [],
    driverLicense: [],
    voennik: [],
  });

  const [toggles, setToggles] = useState({
    engLevel: 'A1',
    marital: 'Не в браке',
    noEducation: false,
    hasChildren: false,
  });

  const setField = k => v => setFields(f => ({ ...f, [k]: v }));
  const commitField = k => v => setCommitted(c => ({ ...c, [k]: v }));
  const setFile = k => v => setFiles(f => ({ ...f, [k]: v }));
  const setToggle = k => v => setToggles(t => ({ ...t, [k]: v }));

  const checks = [
    { label: 'ФИО', anchorId: 'doc-name', done: committed.name.trim().split(' ').filter(Boolean).length >= 2 },
    { label: 'Паспорт', anchorId: 'doc-passport', done: files.passport.length > 0 },
    { label: 'СНИЛС', anchorId: 'doc-snils', done: committed.snils.replace(/\D/g, '').length === 11 || files.snilsFiles.length > 0 },
    { label: 'ИНН', anchorId: 'doc-inn', done: committed.inn.replace(/\D/g, '').length === 12 || files.innFiles.length > 0 },
    { label: 'Трудовая', anchorId: 'doc-workbook', done: files.workbook.length > 0 },
    { label: 'Образование', anchorId: 'doc-education', done: toggles.noEducation || committed.educationPlace.trim().length > 3 },
    { label: 'Английский', anchorId: 'doc-eng', done: true },
    { label: 'Водительское', anchorId: 'doc-driver', done: files.driverLicense.length > 0 },
    { label: 'Военник', anchorId: 'doc-voennik', done: files.voennik.length > 0 },
    { label: 'Семья', anchorId: 'doc-marital', done: true },
    {
      label: 'Реквизиты',
      anchorId: 'doc-payment',
      done:
        committed.contractNumber.trim().length > 0 &&
        committed.accountNumber.trim().length > 0 &&
        committed.bik.trim().length > 0,
    },
  ];

  const requiredChecks = checks.filter(c => !['Английский', 'Водительское', 'Военник', 'Семья'].includes(c.label));
  const isReady = requiredChecks.every(c => c.done);

  return (
    <>
      <Head>
        <title>Мультифора</title>
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --controls-primary-bg: #446bf2;
            --controls-attachment-bg: #446bf21a;
            --text-primary: #33363f;
            --text-secondary: #33363fa6;
            --text-disabled: #33363f40;
            --text-control-blue: #446bf2;
            --text-control-white: #ffffff;
            --text-control-gray: #33363f;
            --page-bg-primary: #ffffff;
            --page-bg-secondary: #33363f0d;
            --page-bg-tertiary: #ffffffa6;
            --sheet-bg-blur: #ffffff0d;
            --basic-border: #33363f0d;
            --linear-primary: #e6e6eb;
            --controls-segment-bg: #ffffff;
            --success-border: rgba(52, 199, 89, 0.25);
            --delete-bg: rgba(19, 19, 21, 0.38);
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --text-primary: #ffffff;
              --text-secondary: #e6e6eba6;
              --text-disabled: #e6e6eb4d;
              --page-bg-primary: #131315;
              --page-bg-secondary: #e6e6eb0d;
              --page-bg-tertiary: #131315cc;
              --sheet-bg-blur: #1313150d;
              --basic-border: #e6e6eb0d;
              --linear-primary: #e6e6eb4d;
              --controls-segment-bg: #e6e6eb;
              --delete-bg: rgba(19, 19, 21, 0.56);
            }
          }

          * { box-sizing: border-box; }
          html, body, #__next { min-height: 100%; }
          body {
            margin: 0;
            background: var(--page-bg-secondary);
            color: var(--text-primary);
          }
          input {
            box-sizing: border-box;
            caret-color: var(--text-control-blue);
          }
          input::placeholder {
            color: var(--text-disabled);
            font-family: SF Pro Text, -apple-system, sans-serif;
            font-size: 17px;
          }
          ::-webkit-scrollbar { display: none; }
        `}</style>
      </Head>

      {/* Основной контент */}
      <div style={{ paddingTop: 0, paddingBottom: 200 }}>
        <div
          style={{
            maxWidth: 390,
            margin: '0 auto',
            paddingTop: 62,
            paddingBottom: 160,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
          }}
        >
          <DocCard id="doc-name" title="ФИО">
            <TextField placeholder="Фамилия Имя Отчество" value={fields.name} onChange={setField('name')} onCommit={commitField('name')} />
          </DocCard>

          <DocCard id="doc-passport" title="Паспорт">
            <FileUpload hint="Загрузите фото или сканы всех страниц" value={files.passport} onChange={setFile('passport')} />
          </DocCard>

          <DocCard id="doc-snils" title="СНИЛС">
            <TextField placeholder="123-456-789 00" value={fields.snils} onChange={setField('snils')} onCommit={commitField('snils')} />
            <FileUpload compact buttonText="Загрузить фото или скан" value={files.snilsFiles} onChange={setFile('snilsFiles')} />
          </DocCard>

          <DocCard id="doc-inn" title="ИНН">
            <TextField placeholder="12345 67890 12" value={fields.inn} onChange={setField('inn')} onCommit={commitField('inn')} />
            <FileUpload compact buttonText="Распознать по фото" value={files.innFiles} onChange={setFile('innFiles')} />
          </DocCard>

          <DocCard id="doc-workbook" title="Трудовая книжка">
            <FileUpload hint="Оригинал или выписка с Госуслуг" value={files.workbook} onChange={setFile('workbook')} />
          </DocCard>

          <DocCard id="doc-education" title="Образование">
            <TextField
              label="Учебное заведение и специальность"
              placeholder="ВПО ВУЗ Веб-дизайнер"
              value={fields.educationPlace}
              onChange={setField('educationPlace')}
              onCommit={commitField('educationPlace')}
            />
            {!toggles.noEducation && (
              <FileUpload hint="Фото или скан диплома или аттестата" value={files.educationFiles} onChange={setFile('educationFiles')} />
            )}
            <Checkbox label="Нет диплома или аттестата" checked={toggles.noEducation} onChange={setToggle('noEducation')} />
          </DocCard>

          <DocCard id="doc-eng" title="Уровень английского">
            <SegmentPicker options={['A1', 'A2', 'B1', 'B2', 'C1', 'C2']} value={toggles.engLevel} onChange={setToggle('engLevel')} />
          </DocCard>

          <DocCard id="doc-driver" title="Водительские права" subtitle="При наличии">
            <FileUpload hint="Лицевая и обратная стороны" value={files.driverLicense} onChange={setFile('driverLicense')} />
          </DocCard>

          <DocCard id="doc-voennik" title="Военный билет" subtitle="Военнообязанным">
            <FileUpload hint="Загрузите фото или сканы всех страниц" value={files.voennik} onChange={setFile('voennik')} />
          </DocCard>

          <DocCard id="doc-marital" title="Семейное положение">
            <SegmentPicker options={['Не в браке', 'В браке']} value={toggles.marital} onChange={setToggle('marital')} />
            <Checkbox label="Есть дети" checked={toggles.hasChildren} onChange={setToggle('hasChildren')} />
          </DocCard>

          <DocCard id="doc-payment" title="Реквизиты">
            <TextField label="Номер договора" placeholder="1234567890" value={fields.contractNumber} onChange={setField('contractNumber')} onCommit={commitField('contractNumber')} />
            <TextField
              label="Номер счёта"
              placeholder="12345678901234567890"
              value={fields.accountNumber}
              onChange={setField('accountNumber')}
              onCommit={commitField('accountNumber')}
            />
            <TextField label="БИК" placeholder="123456789" value={fields.bik} onChange={setField('bik')} onCommit={commitField('bik')} />
            <TextField
              label="Корр. счёт"
              placeholder="12345678901234567890"
              value={fields.corrAccount}
              onChange={setField('corrAccount')}
              onCommit={commitField('corrAccount')}
            />
          </DocCard>
        </div>
      </div>

      {/* Нижняя панель — по Figma */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 402,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 8px 34px 8px',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        {/* Blur-фон */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: C.sheetBg,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        />

        {/* Контейнер с чипсами и кнопкой */}
        <div
          style={{
            position: 'relative',
            background: C.sheetSurface,
            boxShadow: '0px 2px 40px rgba(0,0,0,0.10)',
            borderRadius: 24,
            border: `0.5px solid ${C.borderLight}`,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            overflow: 'hidden',
            pointerEvents: 'all',
          }}
        >
          {/* Строка чипсов */}
          <div style={{ padding: '12px 8px 0 8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingBottom: 4,
              }}
            >
              {checks.map(({ label, done, anchorId }) => (
                <CheckChip key={label} label={label} done={done} anchorId={anchorId} />
              ))}
            </div>
          </div>

          {/* Кнопка Отправить */}
          <div style={{ padding: '8px 8px 8px 8px' }}>
            <button
              disabled={!isReady}
              style={{
                display: 'flex',
                width: '100%',
                height: 56,
                minHeight: 56,
                padding: '0 16px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                borderRadius: 16,
                border: 'none',
                background: isReady ? C.primary : C.fieldBg,
                color: isReady ? C.textWhite : C.textDisabled,
                fontFamily: 'Onest',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: '16px',
                cursor: isReady ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
