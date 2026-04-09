import { MdTrendingUp } from "react-icons/md";

export function SavedItemsRightSide() {
  return (
    <>
      {/* Em alta */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
  <h3 className="font-bold text-lg mb-4">Dica para compradores</h3>

  <p className="text-sm text-neutral-600 leading-relaxed">
    Antes de comprar um terreno, verifique sempre:
  </p>

  <ul className="mt-3 space-y-2 text-xs text-neutral-500">
    <li>• Acesso legal à estrada</li>
    <li>• Disponibilidade de água</li>
    <li>• Zoneamento da área</li>
    <li>• Restrições ambientais</li>
  </ul>

  <button className="w-full mt-4 py-2 text-sm font-semibold hover:bg-neutral-100 rounded-lg">
    Aprender mais
  </button>
</div>
      {/* <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4">Parecidos com seus salvos</h3>

        <div className="space-y-4">
          {[
            ["Arizona • 1.2 acres", "$6,200"],
            ["Texas • 2 acres", "$8,900"],
            ["Colorado • 0.9 acre", "$4,750"],
          ].map(([name, price]) => (
            <div
              key={name}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div>
                <p className="font-bold text-sm">{name}</p>
                <p className="text-xs text-neutral-500">{price}</p>
              </div>

              <button className="text-xs font-semibold text-green-600 group-hover:underline">
                Ver
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm font-semibold hover:bg-neutral-100 rounded-lg">
          Ver mais recomendações
        </button>
      </div> */}

      {/* Vendedores */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4">Organize seus salvos</h3>

        <div className="space-y-3 text-sm text-neutral-600">
          <p>Crie listas para organizar os terrenos que você salvou.</p>

          <ul className="space-y-1 text-xs text-neutral-500">
            <li>• Terrenos para investimento</li>
            <li>• Terrenos para morar</li>
            <li>• Áreas rurais</li>
          </ul>
        </div>

        <button className="w-full mt-4 py-2 text-sm font-semibold bg-neutral-900 text-white rounded-lg hover:opacity-90">
          Criar nova lista
        </button>
      </div>

      {/* Aviso legal */}
      <p className="text-xs text-neutral-400 px-2">
        O marketplace é apenas para fins informativos. Sempre verifique os dados
        do terreno de forma independente.
      </p>
    </>
  );
}
