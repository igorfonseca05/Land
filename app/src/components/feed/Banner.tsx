import Image from "next/image";
import Link from "next/link";
import banner  from '@/public/banner.png'

export function CommunityBanner() {
  return (
    <div className="relative z-1 overflow-hidden bg-slate-900 rounded-2xl shadow-lg min-h-[65] flex items-center group">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src={banner} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"></Image>
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6 w-full max-w-lg">
        <div className="flex flex-col gap-2">
          <span className="text-green-300 font-bold tracking-widest text-[10px] uppercase bg-green-500/20 self-start px-2 py-1 rounded">
            Comunidade
          </span>

          <h3 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            Participe da comunidade Reno!
          </h3>

          <p className="text-gray-200 font-medium text-base leading-relaxed">
            Acesse o feed exclusivo e encontre o seu próximo terreno.{" "}
            <span className="text-green-300 font-bold whitespace-nowrap">
              Junte-se a +5.000 membros.
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link href={'/auth/login'} className="px-6 py-3 rounded-xl text-center bg-white text-slate-900 text-sm font-semibold hover:bg-gray-100 transition active:scale-95 shadow-lg min-w-[140px]">
            Entrar
          </Link>

          <Link href={'/auth/signup'} className="px-6 py-3 rounded-xl bg-green-600 text-center text-white text-sm font-semibold shadow-lg hover:bg-green-700 hover:-translate-y-0.5 transition active:scale-95 min-w-[140px]">
            Criar conta
          </Link>
        </div>
      </div>

      {/* Avatars */}
      {/* <div className="absolute top-0 right-0 p-6 hidden lg:block">
        <div className="flex -space-x-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHsgW8FxL9RvKEn3dBKGONrx4jZg7SQ97MMoToxg9F9AxFEErm4SvZaNuW8-1LTCG82f0eA9yqNAygy9n27jEi4FErf5eVoBV5iWvrhuM5pvdjpCitdyGf_j3dcyfkL2dB_xACGSR_8hLxiPEep2VJH5BE8Tqo1TADOv5KcBTqo_x2_A3lpt71fPjodBbAV-U2McOO-jM1C50qR213eK7UuH6U1odVAlu19mkY-KZlDAyzPhnDQ-QMaYXmtQJjIJgYYXMALAg98EBr"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMNLP_Pj694azhZdN0-Y5pGTJDElBI938hCNtmGF2Yrxru3szoz9NQdt4LdrjwC_qV5zFqqu-z3ZXM6vALKSpPwqCFvzLcpZ_kvAohDOPpuI6LhdlS36H1LBWRi4gpNpcmGlAvoJV-GFyEoyPA349nzEpfLhVlYyJVvYJcdNyICc5Gwc4Ailbn1OhQUKYTTzlLjmb4YUqUToh9_MJHgV6s1yrKCiJ_JkNFAKVGaTRXlOtq0d456Cs6UtNmLZ7L3JshTIsDfqgN23go"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
            +5k
          </div>
        </div>
      </div> */}
    </div>
  );
}