"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Lock, Mail, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  const currentLogo = theme === "dark" ? APP_CONFIG.logo.login : APP_CONFIG.logo.icon;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-pink-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-4 mb-6">
            <div className="relative group">
              {currentLogo ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                  <div className="relative glass-card p-6 rounded-2xl">
                    <Image 
                      src={currentLogo} 
                      alt={APP_CONFIG.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 glass-button rounded-2xl flex items-center justify-center shadow-glow-lg">
                  <span className="text-white font-bold text-3xl">{APP_CONFIG.logo.text}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </h1>
          </div>
          <p className="text-gray-400 text-lg flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-violet-400" />
            {APP_CONFIG.description}
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-2xl p-8 shadow-glass relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="glass-card bg-red-500/10 border-red-500/30 rounded-xl p-4 flex items-center gap-3 animate-slide-in">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                E-posta
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input text-white pl-10 pr-4 py-3 rounded-xl"
                  placeholder="ornek@fikircreative.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Şifre
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input text-white pl-10 pr-4 py-3 rounded-xl"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button text-white py-3 rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-glow relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Giriş yapılıyor...
                  </span>
                ) : (
                  "Giriş Yap"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 text-center">
              Admin tarafından oluşturulan hesap bilgileriniz ile giriş yapabilirsiniz.
            </p>
          </div>
        </div>

        {/* Default Credentials (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 glass-card bg-yellow-500/10 border-yellow-500/30 rounded-xl p-4 animate-slide-in">
            <p className="text-yellow-400 text-xs font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={14} />
              Geliştirme Modunda Test Bilgileri:
            </p>
            <p className="text-yellow-400 text-xs">Email: admin@fikircreative.com</p>
            <p className="text-yellow-400 text-xs">Şifre: Admin123!</p>
          </div>
        )}
      </div>
    </div>
  );
}
