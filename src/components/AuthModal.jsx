import { useState } from 'react';
import { Car, CircleAlert, Lock, Mail, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

function LoginForm({ setModalType, setUser, showToast, navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.endsWith('@utr.edu.mx')) {
      setError('Debes ingresar tu correo institucional (@utr.edu.mx)');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError) {
      setError('Correo o contraseña incorrectos, o cuenta aún no verificada.');
      setLoading(false);
      return;
    }

    // Obtener perfil completo desde public.profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setUser({
      id: data.user.id,
      isAuthenticated: true,
      emailVerified: true,
      firstName: profile?.first_name || 'Usuario',
      lastName: profile?.last_name || 'UTR',
      name: profile
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : cleanEmail,
      email: cleanEmail,
      matricula: profile?.matricula || '',
      career: profile?.career || 'Estudiante UTR',
      phone: profile?.phone || '',
      role: profile?.role || 'Pasajero',
      driverStatus: profile?.driver_status || 'Sin solicitud',
    });

    setLoading(false);
    showToast('Bienvenido a UTRide', 'success');
    setModalType(null);
    navigateTo('home');
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-[#B5121B]">
          <Car className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-[#171717]">Iniciar Sesión</h2>
        <p className="mt-1 text-xs text-[#6B7280]">
          Ingresa a tu cuenta de movilidad universitaria
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-[#DC2626]">
          <CircleAlert className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-[#171717]">
            Correo Institucional (@utr.edu.mx)
          </label>
          <div className="relative">
            <Mail className="absolute top-3 left-3 h-4 w-4 text-[#6B7280]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="matricula@utr.edu.mx"
              className="w-full rounded-lg border border-[#D1D5DB] py-2.5 pr-3.5 pl-9 text-xs outline-none focus:border-[#B5121B]"
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-bold text-[#171717]">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setModalType('forgot')}
              className="text-[11px] font-semibold text-[#B5121B] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute top-3 left-3 h-4 w-4 text-[#6B7280]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#D1D5DB] py-2.5 pr-3.5 pl-9 text-xs outline-none focus:border-[#B5121B]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#8F1720] disabled:bg-[#D1D5DB]"
        >
          {loading ? 'Verificando...' : 'Acceder al sistema'}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-[#6B7280]">
        ¿Aún no tienes cuenta?{' '}
        <button
          onClick={() => setModalType('register')}
          className="font-bold text-[#B5121B] hover:underline"
        >
          Regístrate aquí
        </button>
      </div>
    </div>
  );
}

function RegisterForm({ setModalType, setUser, showToast, navigateTo }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Pasajero');
  const [error, setError] = useState('');

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const cleanEmail = email.toLowerCase().trim();
  const isEmailValid = cleanEmail.endsWith('@utr.edu.mx');

  // PASO 1: Registrar en Supabase Auth y enviar OTP de 6 dígitos
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError('El correo debe terminar estrictamente en @utr.edu.mx');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          matricula: matricula.trim(),
          role,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setStep(2);
    showToast(`Código de 6 dígitos enviado a ${cleanEmail}`, 'info');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);
    setError('');

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      setError('');
    }
  };

  // PASO 2: Validar el código OTP real en Supabase
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const token = otpDigits.join('');

    if (token.length < 6) {
      setError('Ingresa los 6 dígitos del código enviado a tu correo.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token,
      type: 'signup',
    });

    setLoading(false);

    if (verifyError) {
      setError('Código incorrecto o expirado. Verifica tu bandeja de entrada.');
      return;
    }

    setUser({
      id: data.user?.id,
      isAuthenticated: true,
      emailVerified: true,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      matricula: matricula.trim(),
      email: cleanEmail,
      career: 'Estudiante UTR',
      phone: '',
      role,
      driverStatus:
        role === 'Conductor' ? 'Pendiente de validación' : 'Sin solicitud',
    });

    showToast('¡Correo institucional verificado y cuenta activa!', 'success');
    setModalType(null);
    navigateTo('home');
  };

  const handleResend = async () => {
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
    });
    if (resendError) {
      setError(resendError.message);
    } else {
      showToast('Nuevo código enviado a tu correo UTR', 'info');
    }
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <div className="mb-5 text-center">
            <h2 className="text-xl font-bold text-[#171717]">
              Registro Estudiantil
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              Enviaremos un código de 6 dígitos a tu correo @utr.edu.mx
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-[#DC2626]">
              <CircleAlert className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSendCode} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Nombre(s) *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ej. Leonardo Daniel"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Apellido(s) *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ej. Jiménez"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Matrícula *
                </label>
                <input
                  type="text"
                  required
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  placeholder="ST-XXXX"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Rol Inicial *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#B5121B]"
                >
                  <option value="Pasajero">Pasajero</option>
                  <option value="Conductor">Conductor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#171717]">
                Correo Institucional (@utr.edu.mx) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="tu.usuario@utr.edu.mx"
                className={`w-full rounded-lg border px-3 py-2 text-xs outline-none ${
                  email && !isEmailValid
                    ? 'border-[#DC2626] bg-red-50/50'
                    : 'border-[#D1D5DB] focus:border-[#B5121B]'
                }`}
              />
              {email && !isEmailValid && (
                <span className="mt-0.5 block text-[10px] text-[#DC2626]">
                  Solo se permiten correos con terminación @utr.edu.mx
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Confirmar *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#8F1720] disabled:bg-[#D1D5DB]"
            >
              {loading ? 'Enviando código...' : 'Enviar código de verificación'}
            </button>
          </form>

          <div className="mt-4 border-t border-gray-100 pt-3 text-center text-xs text-[#6B7280]">
            ¿Ya tienes cuenta activa?{' '}
            <button
              onClick={() => setModalType('login')}
              className="font-bold text-[#B5121B] hover:underline"
            >
              Inicia sesión
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-[#B5121B]">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-[#171717]">
              Verifica tu correo UTR
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              Ingresa el código de 6 dígitos enviado a{' '}
              <strong className="text-[#171717]">{cleanEmail}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-[#DC2626]">
              <CircleAlert className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div
              className="flex justify-center gap-2"
              onPaste={handleOtpPaste}
            >
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="h-12 w-10 rounded-lg border border-[#D1D5DB] text-center text-lg font-extrabold text-[#171717] outline-none focus:border-[#B5121B] focus:ring-2 focus:ring-[#B5121B]/20 sm:w-11"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#8F1720] disabled:bg-[#D1D5DB]"
            >
              {loading ? 'Validando...' : 'Verificar y activar cuenta'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtpDigits(['', '', '', '', '', '']);
                setError('');
              }}
              className="text-[#6B7280] hover:text-[#171717]"
            >
              ← Cambiar correo
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#B5121B] hover:underline"
            >
              Reenviar código
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ForgotPasswordForm({ setModalType, showToast }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim());
    setSubmitted(true);
    showToast(
      'Enlace de recuperación enviado al correo institucional',
      'info'
    );
  };

  return (
    <div>
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold text-[#171717]">
          Recuperar Contraseña
        </h2>
        <p className="mt-1 text-xs text-[#6B7280]">
          Ingresa tu correo institucional registrado para recibir un enlace de
          restablecimiento.
        </p>
      </div>

      {submitted ? (
        <div className="space-y-3 py-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
            <Mail className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-[#171717]">
            Revisa tu bandeja de entrada
          </h4>
          <p className="text-xs text-[#6B7280]">
            Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
            <strong>{email}</strong>.
          </p>
          <button
            onClick={() => setModalType('login')}
            className="mt-3 rounded-lg bg-[#171717] px-4 py-2 text-xs font-bold text-white"
          >
            Regresar a Iniciar Sesión
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#171717]">
              Correo Institucional (@utr.edu.mx)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.usuario@utr.edu.mx"
              className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#8F1720]"
          >
            Enviar enlace de recuperación
          </button>

          <button
            type="button"
            onClick={() => setModalType('login')}
            className="w-full py-1 text-xs text-[#6B7280] hover:text-[#171717]"
          >
            Volver al inicio de sesión
          </button>
        </form>
      )}
    </div>
  );
}

export default function AuthModal({
  modalType,
  setModalType,
  setUser,
  showToast,
  navigateTo,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={() => setModalType(null)}
          className="absolute top-4 right-4 rounded-lg p-1 text-[#6B7280] hover:text-[#171717]"
        >
          <X className="h-5 w-5" />
        </button>

        {modalType === 'login' && (
          <LoginForm
            setModalType={setModalType}
            setUser={setUser}
            showToast={showToast}
            navigateTo={navigateTo}
          />
        )}
        {modalType === 'register' && (
          <RegisterForm
            setModalType={setModalType}
            setUser={setUser}
            showToast={showToast}
            navigateTo={navigateTo}
          />
        )}
        {modalType === 'forgot' && (
          <ForgotPasswordForm
            setModalType={setModalType}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}