import { Form } from "./components/Form";

export default function Page() {
  return (
    <div className="w-full space-y-4">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
        Criar Anúncio
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm md:text-base">
        Preencha as informações abaixo para publicar seu anúncio de terreno.
      </p>
      <Form />
    </div>
  );
}
