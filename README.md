# 🌳 Reno - Marketplace de Terrenos

![alt text](<reno capa.png>)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

O **Reno** é uma plataforma full-stack de marketplace especializada na compra, venda e busca de terrenos e propriedades rurais. O projeto foca em fornecer uma experiência rica em geolocalização, permitindo que os utilizadores explorem propriedades através de mapas interativos e giram os seus próprios anúncios de forma intuitiva.

## 🚀 Tecnologias Utilizadas

* **Framework:** `Next.js` (App Router) com `TypeScript`.
* **Frontend:** `React`, `Tailwind CSS` para estilização responsiva e `Framer Motion` para animações.
* **Backend as a Service:** `Firebase` (Firestore para base de dados, Auth para autenticação e Storage para imagens).
* **Mapas:** `Leaflet` com integração de camadas de satélite da Esri e Google Streets.
* **Validação de Dados:** `Zod` para esquemas de dados rigorosos e segurança em formulários.
* **Gestão de Estado:** `React Context API` para autenticação, perfil de utilizador e busca global.
* **UI/UX:** `Swiper` para galerias de imagens, `Sonner` para notificações e `React Icons`.

## ✨ Funcionalidades Principais

* **📍 Exploração por Mapa:** Visualização interativa de terrenos utilizando Leaflet, com marcadores dinâmicos que mostram preço e detalhes ao clicar.
* **🖼️ Gestão de Anúncios:** Sistema completo de CRUD para anúncios, incluindo upload de múltiplas imagens com funcionalidade de drag-and-drop.
* **🔍 Busca Avançada:** Filtros inteligentes por títulos, características (energia, água, topografia) e localização.
* **👤 Perfis de Utilizador:** Sistema de perfis com "slugs" personalizados e verificação de vendedores.
* **❤️ Interação Social:** Funcionalidade de "curtir" anúncios e guardar propriedades favoritas no perfil, utilizando transações do Firestore para garantir a consistência.
* **📐 Conversão Automática:** Conversão inteligente de unidades de medida entre hectares, acres e metros quadrados.

## 🛠️ Detalhes Técnicos de Destaque

* **Arquitetura Baseada em Contexto:** Centralização da lógica de autenticação e busca para garantir que o estado da aplicação seja consistente em diferentes rotas.
* **Otimização de Performance:** Uso de *skeletons* de carregamento para melhorar a percepção de performance (Lighthouse/Web Vitals).
* **Tratamento de Erros:** Sistema personalizado de tradução de erros do Firebase para garantir uma comunicação clara com o utilizador em português.
* **Segurança de Dados:** Implementação de `writeBatch` e `runTransaction` no Firestore para garantir que operações complexas de escrita sejam atómicas.

## 📁 Estrutura do Projeto

```text
src/
 ├── components/       # Componentes reutilizáveis (Layout, Feed, Modais)
 ├── context/          # Contextos de Autenticação, Perfil e Busca
 ├── config/           # Configurações do Firebase
 ├── utils/            # Esquemas Zod e funções auxiliares (Slug, Formatação)
 └── app/              # Estrutura de rotas do Next.js