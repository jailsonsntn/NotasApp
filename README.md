# NotasApp - Aplicativo de Notas Next.js

NotasApp é um aplicativo web completo para gerenciamento de notas e tarefas, desenvolvido com Next.js e tecnologias modernas para oferecer uma experiência rica e responsiva.

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
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```
NEXT_PUBLIC_API_URL=https://eqhbjuiz.manus.space/api
NEXT_PUBLIC_APP_URL=https://eqhbjuiz.manus.space
NEXT_PUBLIC_APP_NAME=NotasApp
NODE_ENV=development
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Estrutura do Projeto

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

## 🌐 Implantação

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Cloudflare Workers
```bash
npm run build:worker
npm run preview
```

## 📖 Manual Completo

Para documentação detalhada, consulte o arquivo `manualapp.txt` que contém:
- Fluxos de usuário completos
- Documentação de componentes
- Guia de funcionalidades
- Instruções de backup

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Desenvolvido com ❤️ para organização e produtividade.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
