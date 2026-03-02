import { MdTrendingUp } from "react-icons/md";

export function FeedRightSide() {
  return (
    <>
      {/* Em alta */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4">Áreas em alta</h3>

        <div className="space-y-4">
          {[
            ["1", "Condado de Costilla", "Colorado • 124 novos"],
            ["2", "Condado de Mohave", "Arizona • 89 novos"],
            ["3", "Condado de Hudspeth", "Texas • 65 novos"],
          ].map(([rank, name, info]) => (
            <div
              key={name}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 group-hover:bg-neutral-200">
                  {rank}
                </div>
                <div>
                  <p className="font-bold text-sm">{name}</p>
                  <p className="text-xs text-neutral-500">{info}</p>
                </div>
              </div>
              <MdTrendingUp/>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm font-semibold hover:bg-neutral-100 rounded-lg">
          Ver todas as tendências
        </button>
      </div>

      {/* Vendedores */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4">
          Principais vendedores para seguir
        </h3>

        <div className="space-y-4">
          {[
            ["TL", "TerraLand Inc", "2,4 mil seguidores"],
            ["DL", "Discount Lots", "1,8 mil seguidores"],
          ].map(([initials, name, followers]) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold">{name}</p>
                  <p className="text-[10px] text-neutral-500">{followers}</p>
                </div>
              </div>

              <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-900 text-white hover:opacity-80">
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso legal */}
      <p className="text-xs text-neutral-400 px-2">
        O marketplace é apenas para fins informativos. Sempre verifique os dados
        do terreno de forma independente.
      </p>
    </>
  );
}
