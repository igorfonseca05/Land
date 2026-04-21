import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import Image from "next/image";
import { IconBase } from "react-icons";
import { MdRocketLaunch, MdVerifiedUser, MdVisibility } from "react-icons/md";
import quemSomos from '@/public/quemSomosBg.png'

export default function WhoAreWe() {
  return (
    <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 min-h-100 flex items-center p-10 shadow-lg">
        <Image
          src={quemSomos}
          alt="Vale verde com terreno a venda"
          className="absolute inset-0 object-cover opacity-60"
        ></Image>
        {/* <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuArw30rSP3JOHjy-PxgA6zkpLkrtPXO_HkNdQo7kxYk9BoHWmD1LIYez9Z1wvm1kDvIqM3vxMkuH2VexOGhu_0aNi6Y0OZzTU7u-q5e0uXLraEvV7jXugDCl0eWAwHmspZyIih3QyBNVx5ZCiH468vegrhnOwwN14_-r684lMpxTX9uIzUxnWs-iXtGa9zsFLFByBg20ZEsV5gPcohp6UcI8w_9LtLue4c7bHfTdYjguDQU5uM7Y9JpfcNfoLKZwHhONzAM7GcedWxt"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt=""
        /> */}

        <div className="relative z-1 max-w-2xl text-white">
          <span className="inline-block px-4 py-1 mb-6 rounded-full bg-green-500/20 border border-green-400 text-green-300 text-sm">
            NOSSA JORNADA
          </span>

          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Nossa Missão: Conectar pessoas à terra de seus sonhos.
          </h1>

          <p className="text-gray-200 mb-8">
            Acreditamos que a terra é o investimento mais sólido e o espaço onde
            o futuro acontece.
          </p>

          <button className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition">
            Explorar Oportunidades
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Um Marketplace Especializado
          </h2>

          <div className="w-16 h-1 bg-green-500 rounded-full"></div>

          <p className="text-gray-600">
            A Reno nasceu da necessidade de um mercado de terras mais eficiente.
            Focamos exclusivamente em propriedades rurais e terrenos de larga
            escala.
          </p>

          <p className="text-gray-600">
            Nossa plataforma é baseada em transparência, com dados claros e
            verificados para compradores e investidores.
          </p>

          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-green-600">15k+</p>
              <p className="text-xs text-gray-500 uppercase">
                Hectares Mapeados
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-green-600">2.4k</p>
              <p className="text-xs text-gray-500 uppercase">
                Vendas Concluídas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaB7IrYGRf0kAhnf79x-dGwzMqnuj4jWm-JeJYM0Zitsk2aEst8lU6QmzEsJgd_Q8t-YqLrg13oSKWJ_9rZNggLLTv5FYZm3dkGIKOtfTjgiA-YhJlxVo7dKlOgL_9UCilVDzZFgTmGpxHwggge2i1-hoiXhWDyrY-6kbE07KfBlIy95G_y4RxPX_FWaEQyKf2Nr-sMG-3p6xbYIsK9jDq8TWINDr8V20fH9V41tZgV1MUvkzZPla5ziM9Ttn4hH4nQfmiCTmG7G0w"
            className="w-full h-80 object-cover rounded-2xl"
            alt=""
          />
        </div>
      </section>

      {/* PILARES */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Nossos Pilares</h2>
          <p className="text-gray-500">
            Como construímos confiança no mercado de terras.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* CARD */}
          {[
            {
              title: "Transparência",
              text: "Dados reais e documentação clara.",
              icon: MdVisibility,
            },
            {
              title: "Segurança",
              text: "Verificação rigorosa dos anúncios.",
              icon: MdVerifiedUser,
            },
            {
              title: "Inovação",
              text: "Uso de tecnologia para análise de terrenos.",
              icon: MdRocketLaunch,
            },
          ].map(({ title, text, icon: Icon }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
                <Icon className="text-3xl"></Icon>
              </div>

              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white rounded-2xl border p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Pronto para encontrar seu espaço?
          </h2>
          <p className="text-gray-600">
            Seja para agricultura, lazer ou investimento seguro.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">
            Falar com especialista
          </button>

          <button className="bg-gray-100 px-6 py-3 rounded-xl hover:bg-gray-200 transition">
            Ver listagens
          </button>
        </div>
      </section>
    </div>
  );
}
