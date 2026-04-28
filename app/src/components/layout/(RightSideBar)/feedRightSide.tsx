import { MdLandscape, MdLightbulb, MdTrendingUp, MdVerified, MdVisibility, MdWaterDrop } from "react-icons/md";

export function FeedRightSide() {
  return (
    <>
      {/* Em alta */}
      {/* <div classNameName="bg-white border border-neutral-200 rounded-2xl p-5">
        <h3 classNameName="font-bold text-lg mb-4">Áreas em alta</h3>

        <div classNameName="space-y-4">
          {[
            ["1", "Condado de Costilla", "Colorado • 124 novos"],
            ["2", "Condado de Mohave", "Arizona • 89 novos"],
            ["3", "Condado de Hudspeth", "Texas • 65 novos"],
          ].map(([rank, name, info]) => (
            <div
              key={name}
              classNameName="flex items-center justify-between cursor-pointer group"
            >
              <div classNameName="flex items-center gap-3">
                <div classNameName="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 group-hover:bg-neutral-200">
                  {rank}
                </div>
                <div>
                  <p classNameName="font-bold text-sm">{name}</p>
                  <p classNameName="text-xs text-neutral-500">{info}</p>
                </div>
              </div>
              <MdTrendingUp/>
            </div>
          ))}
        </div>

        <button classNameName="w-full mt-4 py-2 text-sm font-semibold hover:bg-neutral-100 rounded-lg">
          Ver todas as tendências
        </button>
      </div> */}
      <section className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-6">
        <h3 className="font-h3 text-on-surface text-[clamp(18px,1vw,20px)] mb-lg flex items-center gap-2">
          <MdLightbulb className="text-green-600" size={20} ></MdLightbulb>
          Dicas para compradores
        </h3>
        <ul className="flex flex-col gap-4 text-[clamp(15px,1vw,20px)] text-neutral-500">
          <li className="flex items-start gap-3">
            <MdVerified className="text-green-600 text-sm mt-1" size={20}/>
            <p className="text-body-md text-tertiary">
              Verifique a documentação e RGI do terreno.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <MdVisibility className="text-green-600 text-sm mt-1" size={20}/>
            <p className="text-body-md text-tertiary">
              Visite o local pessoalmente em diferentes horários.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <MdWaterDrop className="text-green-600 text-sm mt-1" size={20}/>
            <p className="text-body-md text-tertiary">
              Confirme o acesso à rede de água e energia.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <MdLandscape className="text-green-600 text-sm mt-1" size={20}/>
            <p className="text-body-md text-tertiary">
              Avalie a topografia para evitar custos extras de obra.
            </p>
          </li>
        </ul>
      </section>

      {/* Vendedores */}
      {/* <div classNameName="bg-white border border-neutral-200 rounded-2xl p-5">
        <h3 classNameName="font-bold text-lg mb-4">
          Principais vendedores para seguir
        </h3>

        <div classNameName="space-y-4">
          {[
            ["TL", "TerraLand Inc", "2,4 mil seguidores"],
            ["DL", "Discount Lots", "1,8 mil seguidores"],
          ].map(([initials, name, followers]) => (
            <div key={name} classNameName="flex items-center justify-between">
              <div classNameName="flex items-center gap-2">
                <div classNameName="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <div>
                  <p classNameName="text-sm font-bold">{name}</p>
                  <p classNameName="text-[10px] text-neutral-500">{followers}</p>
                </div>
              </div>

              <button classNameName="px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-900 text-white hover:opacity-80">
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div> */}

      {/* Aviso legal */}
      <p className="text-xs text-neutral-400 px-2">
        O marketplace é apenas para fins informativos. Sempre verifique os dados
        do terreno de forma independente.
      </p>
    </>
  );
}
