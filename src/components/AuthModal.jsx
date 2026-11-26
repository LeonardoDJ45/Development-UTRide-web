import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Hash, Phone, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function AuthModal({ isOpen, mode, initialMode, onClose, showToast }) {
  const activeInitialMode = mode || initialMode || 'login';
  const [currentMode, setCurrentMode] = useState(activeInitialMode); // 'login' | 'register' | 'otp'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [phone, setPhone] = useState('');
  const [career, setCareer] = useState('');
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    if (mode || initialMode) {
      setCurrentMode(mode || initialMode);
      setErrorMsg('');
    }
  }, [mode, initialMode, isOpen]);

  if (isOpen === false) return null;

  const isValidUtrEmail = (mail) => {
    return /^[^\s@]+@utr\.edu\.mx$/i.test(mail.trim());
  };

  // 1. Iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidUtrEmail(cleanEmail)) {
      setErrorMsg('Debes utilizar tu correo institucional @utr.edu.mx');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) throw error;

      if (showToast) showToast('¡Bienvenido de vuelta a UTRide!', 'success');
      if (onClose) onClose();
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setErrorMsg(
        err.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Registro institucional
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidUtrEmail(cleanEmail)) {
      setErrorMsg('Solo se permiten correos institucionales @utr.edu.mx');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            matricula: matricula.trim(),
            phone: phone.trim(),
            career: career.trim(),
          },
        },
      });

      if (error) throw error;

      // Crear o actualizar registro inicial en profiles
      if (data?.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: cleanEmail,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          matricula: matricula.trim(),
          phone: phone.trim(),
          career: career.trim(),
          role: cleanEmail === 'st5303@utr.edu.mx' ? 'admin' : 'Pasajero',
        });
      }

      if (data?.session) {
        if (showToast) showToast('Cuenta creada e iniciada correctamente.', 'success');
        if (onClose) onClose();
      } else {
        if (showToast) showToast('Revisa tu correo institucional para verificar tu código.', 'info');
        setCurrentMode('otp');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setErrorMsg(err.message || 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verificación OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otpCode.trim(),
        type: 'signup',
      });

      if (error) throw error;

      if (showToast) showToast('¡Cuenta verificada con éxito!', 'success');
      if (onClose) onClose();
    } catch (err) {
      console.error('Error verificando OTP:', err);
      setErrorMsg('Código inválido o expirado. Verifica tu bandeja @utr.edu.mx.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-[#D1D5DB] shadow-2xl overflow-hidden animate-fadeIn">
        {/* Cabecera */}
        <div className="bg-[#171717] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff8a90] block">
              Comunidad @utr.edu.mx
            </span>
            <h2 className="text-lg font-bold">
              {currentMode === 'login' && 'Iniciar Sesión'}
              {currentMode === 'register' && 'Crear Cuenta Universitaria'}
              {currentMode === 'otp' && 'Verificar Correo Institucional'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pestañas Login / Registro */}
        {currentMode !== 'otp' && (
          <div className="grid grid-cols-2 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <button
              type="button"
              onClick={() => {
                setCurrentMode('login');
                setErrorMsg('');
              }}
              className={`py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                currentMode === 'login'
                  ? 'bg-white text-[#B5121B] border-b-2 border-[#B5121B]'
                  : 'text-[#6B7280] hover:text-[#171717]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentMode('register');
                setErrorMsg('');
              }}
              className={`py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                currentMode === 'register'
                  ? 'bg-white text-[#B5121B] border-b-2 border-[#B5121B]'
                  : 'text-[#6B7280] hover:text-[#171717]'
              }`}
            >
              Registrarse
            </button>
          </div>
        )}

        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-[#DC2626]">
              {errorMsg}
            </div>
          )}

          {/* FORMULARIO LOGIN */}
          {currentMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Correo Institucional
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="matricula@utr.edu.mx"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B5121B] hover:bg-[#8F1720] text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Ingresando...' : 'Entrar a UTRide'}</span>
              </button>
            </form>
          )}

          {/* FORMULARIO REGISTRO */}
          {currentMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Nombre(s)
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Juan"
                      className="w-full pl-9 pr-3 py-2 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez López"
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Correo Institucional (@utr.edu.mx)
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="st0000@utr.edu.mx"
                    className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Matrícula
                  </label>
                  <div className="relative">
                    <Hash className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      placeholder="5303"
                      className="w-full pl-9 pr-3 py-2 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="4491234567"
                      className="w-full pl-9 pr-3 py-2 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Carrera / Área
                </label>
                <div className="relative">
                  <GraduationCap className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="Ing. en Desarrollo y Gestión de Software"
                    className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B5121B] hover:bg-[#8F1720] text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Creando cuenta...' : 'Crear mi cuenta UTR'}</span>
              </button>
            </form>
          )}

          {/* FORMULARIO VERIFICACIÓN OTP */}
          {currentMode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-[#171717] flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-[#B5121B] shrink-0 mt-0.5" />
                <p>
                  Enviamos un código de verificación a <strong>{email}</strong>. Ingrésalo para activar tu cuenta institucional.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Código de verificación (OTP)
                </label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-center tracking-widest font-mono text-base text-[#171717] focus:outline-none focus:border-[#B5121B]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B5121B] hover:bg-[#8F1720] text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Verificando...' : 'Confirmar código'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}