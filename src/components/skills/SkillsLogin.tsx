import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck, UserRound } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSkillAuth } from '../../context/SkillAuthContext';

export const SkillsLogin: React.FC = () => {
  const { language } = useLanguage();
  const { login } = useSkillAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const t = {
    es: {
      kicker: 'Área privada · Marky Skills',
      title: 'Aprende las skills de arquitectura KMP',
      subtitle:
        'Inicia sesión para acceder a los laboratorios interactivos de arquitectura, MVI, navegación, datos, testing y Compose.',
      user: 'Usuario',
      password: 'Contraseña',
      userPlaceholder: 'Introduce tu usuario',
      passwordPlaceholder: 'Introduce tu contraseña',
      submit: 'Entrar al laboratorio',
      error: 'Usuario o contraseña incorrectos.',
      note: 'Autenticación local de demostración. La sesión se guarda en esta pestaña.',
      features: [
        '9 laboratorios interactivos',
        'Ejemplos de código Kotlin',
        'Checklists y quizzes',
        'Progreso de aprendizaje',
      ],
    },
    pt: {
      kicker: 'Área privada · Marky Skills',
      title: 'Aprenda as skills de arquitetura KMP',
      subtitle:
        'Entre para acessar os laboratórios interativos de arquitetura, MVI, navegação, dados, testes e Compose.',
      user: 'Usuário',
      password: 'Senha',
      userPlaceholder: 'Digite seu usuário',
      passwordPlaceholder: 'Digite sua senha',
      submit: 'Entrar no laboratório',
      error: 'Usuário ou senha incorretos.',
      note: 'Autenticação local de demonstração. A sessão é salva nesta aba.',
      features: [
        '9 laboratórios interativos',
        'Exemplos de código Kotlin',
        'Checklists e quizzes',
        'Progresso de aprendizado',
      ],
    },
    en: {
      kicker: 'Private area · Marky Skills',
      title: 'Learn KMP architecture skills',
      subtitle:
        'Sign in to access interactive labs for architecture, MVI, navigation, data, testing, and Compose.',
      user: 'Username',
      password: 'Password',
      userPlaceholder: 'Enter your username',
      passwordPlaceholder: 'Enter your password',
      submit: 'Enter the lab',
      error: 'Incorrect username or password.',
      note: 'Local demo authentication. The session is stored in this tab.',
      features: [
        '9 interactive labs',
        'Kotlin code examples',
        'Checklists and quizzes',
        'Learning progress',
      ],
    },
  }[language];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(false);
    const valid = login(username, password);
    if (!valid) setError(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <section className="lg:col-span-7 p-8 rounded-2xl bg-gradient-to-b from-surface-high via-surface to-surface-lowest">
        <div className="flex items-center gap-2 text-xs font-mono text-brand">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.kicker}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface mt-4 max-w-2xl">
          {t.title}
        </h2>
        <p className="text-sm text-on-surface-variant mt-4 max-w-xl leading-relaxed">
          {t.subtitle}
        </p>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant">
          {t.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="lg:col-span-5 bg-surface-low rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="w-12 h-12 rounded-full bg-brand/15 flex items-center justify-center">
          <Lock className="w-5 h-5 text-brand" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface">Marky Skills</h3>
          <p className="text-xs text-on-surface-variant mt-1">{t.note}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-on-surface">{t.user}</span>
            <div className="relative">
              <UserRound className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={t.userPlaceholder}
                autoComplete="username"
                className="w-full pl-9 pr-3 py-2.5 text-xs"
              />
            </div>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-on-surface">{t.password}</span>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.passwordPlaceholder}
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-brand"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">{t.error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-full text-sm transition-colors"
          >
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};
