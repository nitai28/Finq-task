import { ReactNode } from 'react';
import { Profile } from '../types/user';

const TITLES = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Monsieur'];

interface ProfileCardProps {
  profile: Profile;
  nameTitle: string;
  nameFirst: string;
  nameLast: string;
  onTitleChange: (v: string) => void;
  onFirstChange: (v: string) => void;
  onLastChange: (v: string) => void;
}

export function ProfileCard({
  profile,
  nameTitle, nameFirst, nameLast,
  onTitleChange, onFirstChange, onLastChange,
}: ProfileCardProps) {
  const birthYear = new Date(profile.dob_date).getFullYear();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" dir="rtl">
      <Section title="פרטים אישיים">
        <FormRow label="מין">
          <span dir="ltr" className="text-sm text-gray-900 text-left">
            {profile.gender === 'male' ? 'Male' : 'Female'}
          </span>
        </FormRow>

        <FormRow label="שם">
          <div dir="ltr" className="flex gap-2 flex-1">
            <select
              value={nameTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {TITLES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <NameInput value={nameFirst} onChange={onFirstChange} placeholder="First" />
            <NameInput value={nameLast}  onChange={onLastChange}  placeholder="Last"  />
          </div>
        </FormRow>

        <FormRow label="גיל">
          <span dir="ltr" className="text-sm text-gray-900 text-left">
            {profile.age} <span className="text-gray-400 text-xs">({birthYear})</span>
          </span>
        </FormRow>
      </Section>

      <Section title="כתובת">
        <FormRow label="רחוב">
          <span dir="ltr" className="text-sm text-gray-900 text-left">
            {profile.street_number} {profile.street_name}
          </span>
        </FormRow>
        <FormRow label="עיר">
          <span className="text-sm text-gray-900">{profile.city}</span>
        </FormRow>
        <FormRow label="מחוז">
          <span className="text-sm text-gray-900">{profile.state}</span>
        </FormRow>
        <FormRow label="מדינה">
          <span className="text-sm text-gray-900">{profile.country}</span>
        </FormRow>
      </Section>

      <Section title="יצירת קשר" last>
        <FormRow label='דוא"ל'>
          <span dir="ltr" className="text-sm text-gray-900 text-left break-all">
            {profile.email}
          </span>
        </FormRow>
        <FormRow label="טלפון">
          <span dir="ltr" className="text-sm text-gray-900 text-left">
            {profile.phone}
          </span>
        </FormRow>
      </Section>
    </div>
  );
}

function Section({ title, last, children }: { title: string; last?: boolean; children: ReactNode }) {
  return (
    <div className={`px-5 py-4 space-y-3 ${last ? '' : 'border-b border-gray-100'}`}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
        {title}
      </p>
      {children}
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 min-h-[32px]">
      <span className="text-sm font-medium text-gray-500 w-16 flex-shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function NameInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      dir="ltr"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}
