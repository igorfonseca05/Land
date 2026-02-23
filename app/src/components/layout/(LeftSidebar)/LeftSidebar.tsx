import { MdFeed, MdBookmark, MdMap, MdHistory } from "react-icons/md";
import { UserInfoContainer } from "./components/UserInfoContainer";
import { NavBar } from "./components/NavBar";

export function LeftSidebar() {
    return (
    <aside className="hidden lg:block w-72 shrink-0 sticky top-20 h-[calc(100vh-8rem)] overflow-y-auto">
      {/* Usuário */}
     {/* <UserInfoContainer/> */}

      {/* Navegação */}
      <NavBar/>

      {/* Preferências */}
      <div className="mt-8 px-2">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold text-neutral-500 uppercase">
            Preferências do feed
          </p>
          <button className="text-xs font-semibold text-neutral-700">
            Editar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Qualquer preço", "1+ acres", "Residencial"].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700"
            >
              {item}
              <span className="material-symbols-outlined text-[14px] cursor-pointer">
                close
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-10 px-2 text-xs text-neutral-400 space-y-2">
        <div className="flex gap-4 flex-wrap">
          <a href="#" className="hover:underline">
            Privacidade
          </a>
          <a href="#" className="hover:underline">
            Termos
          </a>
          <a href="#" className="hover:underline">
            Cookies
          </a>
        </div>
        <p>©  {new Date().getFullYear()} Reno</p>
      </div>
    </aside>
  );
}
