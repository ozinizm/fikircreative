"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-4 mb-6">
            {APP_CONFIG.logo.login && !APP_CONFIG.logo.showText ? (
              <Image 
                src={APP_CONFIG.logo.login} 
                alt={APP_CONFIG.name}
                width={120}
                height={120}
                className="object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{APP_CONFIG.logo.text}</span>
              </div>
            )}
            <h1 className="text-3xl font-bold text-white">{APP_CONFIG.name}</h1>
          </div>
          <p className="text-gray-400 text-lg">{APP_CONFIG.description}</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#252525] text-white pl-10 pr-4 py-3 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  placeholder="ornek@fikir.agency"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#252525] text-white pl-10 pr-4 py-3 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
            <p className="text-sm text-gray-400 text-center">
              Admin tarafından oluşturulan hesap bilgileriniz ile giriş yapabilirsiniz.
            </p>
          </div>
        </div>

        {/* Default Credentials (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-500 text-xs font-semibold mb-2">Geliştirme Modunda Test Bilgileri:</p>
            <p className="text-yellow-500 text-xs">Email: admin@fikir.agency</p>
            <p className="text-yellow-500 text-xs">Şifre: Admin123!</p>
          </div>
        )}
      </div>
    </div>
  );
}
