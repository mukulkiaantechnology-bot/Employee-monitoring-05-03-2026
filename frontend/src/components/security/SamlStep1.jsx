import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useSecurityStore } from '../../store/securityStore';
import { cn } from '../../utils/cn';

function FieldLabel({ children }) {
    return <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{children}</label>;
}

function Field({ label, error, children }) {
    return (
        <div className="space-y-2">
            <FieldLabel>{label}</FieldLabel>
            {children}
            {error && <p className="text-xs font-bold text-rose-500">{error}</p>}
        </div>
    );
}

export function SamlStep1({ errors, setErrors }) {
    const { saml, updateField } = useSecurityStore();
    const fileRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            updateField('certificate', ev.target.result);
            setErrors((er) => ({ ...er, certificate: undefined }));
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const inputClass = (errKey) => cn(
        'w-full h-12 px-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
        errors[errKey] ? 'border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-violet-500'
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Intro */}
            <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">SAML Configuration</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Please fill in <span className="text-violet-600 font-bold">all</span> the fields below to configure SAML
                </p>
            </div>

            {/* Name */}
            <Field label="Name" error={errors.name}>
                <input
                    type="text"
                    placeholder="Enter SSO name you would like to have"
                    value={saml.name}
                    onChange={(e) => { updateField('name', e.target.value); setErrors((er) => ({ ...er, name: undefined })); }}
                    className={inputClass('name')}
                />
            </Field>

            {/* Issuer ID */}
            <Field label="Issuer ID" error={errors.issuerId}>
                <input
                    type="text"
                    placeholder="Insert identity provider issuer here"
                    value={saml.issuerId}
                    onChange={(e) => { updateField('issuerId', e.target.value); setErrors((er) => ({ ...er, issuerId: undefined })); }}
                    className={inputClass('issuerId')}
                />
            </Field>

            {/* Login URL */}
            <Field label="Login URL" error={errors.loginUrl}>
                <input
                    type="text"
                    placeholder="Insert login URL here"
                    value={saml.loginUrl}
                    onChange={(e) => { updateField('loginUrl', e.target.value); setErrors((er) => ({ ...er, loginUrl: undefined })); }}
                    className={inputClass('loginUrl')}
                />
            </Field>

            {/* Certificate */}
            <Field label="Identity Provider Certificate" error={errors.certificate}>
                <textarea
                    placeholder="Paste your certificate here"
                    value={saml.certificate}
                    onChange={(e) => { updateField('certificate', e.target.value); setErrors((er) => ({ ...er, certificate: undefined })); }}
                    rows={5}
                    className={cn(
                        'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm font-mono text-slate-900 dark:text-white outline-none transition-all resize-none leading-relaxed',
                        errors.certificate ? 'border-rose-400' : 'border-slate-200 dark:border-slate-800 focus:border-violet-500'
                    )}
                />
                {/* OR divider / upload */}
                <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <span className="text-xs font-bold text-slate-400">OR</span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                </div>
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 text-xs font-black text-violet-600 dark:text-violet-400 hover:underline transition-all mx-auto"
                >
                    <Upload size={13} strokeWidth={3} /> Upload Certificate File
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".crt,.pem,.cer"
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </Field>
        </div>
    );
}
