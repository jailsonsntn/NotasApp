# NotasApp 📝

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jailsonsntn/NotasApp/blob/master/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC)](https://tailwindcss.com/)

Um aplicativo web completo para gerenciamento de notas e tarefas, desenvolvido com Next.js e tecnologias modernas para oferecer uma experiência rica e responsiva.

## 🌟 Funcionalidades

### Gerenciamento de Notas
- ✏️ Criar, editar e excluir notas
- ⭐ Marcar notas como favoritas
- 📁 Organizar em categorias personalizadas
- 🗂️ Arquivar notas (disponíveis por 30 dias)
- 🗑️ Lixeira com restauração de notas
- ✅ Criar listas de tarefas
- 🏷️ Sistema de tags
- 🔍 Busca avançada

### Interface e Experiência
- 🌙 Tema claro/escuro
- 📱 Design responsivo
- 📊 Visualização em grade ou lista
- 🔄 Sincronização automática
- 📴 Funcionamento offline

### Autenticação e Sincronização
- 👤 Sistema de login/registro
- ☁️ Sincronização na nuvem
- 🎉 Modal de boas-vindas
- ⚙️ Preferências personalizadas

## 🚀 Configuração e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/jailsonsntn/NotasApp.git
cd NotasApp
```

2. Instale as dependências:
```bash
npm install
# ou
pnpm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
pnpm dev
```

Abra [http://localhost:3002](http://localhost:3002) no seu navegador.

## � Demonstração

### 📸 Screenshots
- **Interface Principal**: Grid responsivo de notas com categorias
- **Modo Escuro**: Suporte completo a tema escuro/claro
- **Edição de Notas**: Modal intuitivo para criação e edição
- **Busca Avançada**: Filtros por categoria, tags e texto

### 🔗 Demo Online
> Em breve - Deploy automático via GitHub Actions

## �🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css      # Estilos globais
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página principal
├── components/
│   ├── Sidebar.tsx      # Barra lateral
│   ├── NoteGrid.tsx     # Grade de notas
│   ├── NoteModal.tsx    # Modal de edição
│   ├── WelcomeModal.tsx # Modal de boas-vindas
│   └── ui/              # Componentes UI
├── hooks/
│   ├── useAuth.ts       # Hook de autenticação
│   ├── useNotes.ts      # Hook de notas
│   ├── useCategories.ts # Hook de categorias
│   └── useSync.ts       # Hook de sincronização
├── lib/
│   ├── utils.ts         # Utilitários
│   └── initialData.ts   # Dados iniciais
└── types/
    └── index.ts         # Definições de tipos
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Sonner** - Notificações

## 📚 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm run build:worker # Build para Cloudflare
npm run preview      # Preview da aplicação
```

## 🔧 Configurações de Desenvolvimento

### Dados Iniciais
Na primeira execução, o app configura automaticamente:
- Categorias padrão (Minhas Notas, Favoritos, Arquivados, etc.)
- Nota de boas-vindas
- Configurações padrão

### Backup e Restauração
O sistema inclui funções para:
- Exportar dados em JSON
- Importar backup
- Reset completo dos dados

### Personalização
- Temas claro/escuro
- Categorias personalizadas com cores
- Preferências do usuário

## 🚀 Deploy

### Vercel (Recomendado)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jailsonsntn/NotasApp)

```bash
npm run build
npx vercel --prod
```

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jailsonsntn/NotasApp)

### Cloudflare Pages
```bash
npm run build
npx wrangler pages publish out
```

## 📖 Manual Completo

Para documentação detalhada, consulte o arquivo `manualapp.txt` que contém:
- Fluxos de usuário completos
- Documentação de componentes
- Guia de funcionalidades
- Instruções de backup

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### � Roadmap
- [ ] Sincronização com backend em tempo real
- [ ] Notificações push para lembretes
- [ ] Colaboração em tempo real
- [ ] Aplicativo mobile (React Native)
- [ ] Plugin para editores de código
- [ ] API REST completa
- [ ] Importação/exportação em múltiplos formatos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Jailson Santana**
- GitHub: [@jailsonsntn](https://github.com/jailsonsntn)
- Email: jailsonjs55@gmail.com

---

Desenvolvido com ❤️ para organização e produtividade.

⭐ Se este projeto ajudou você, considere dar uma estrela!
