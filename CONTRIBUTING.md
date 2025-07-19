# Contribuindo para o NotasApp

Obrigado por seu interesse em contribuir! 🎉

## Como Contribuir

### 🐛 Reportando Bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/jailsonsntn/NotasApp/issues)
2. Se não encontrar, crie uma nova issue usando o template de bug report
3. Inclua o máximo de detalhes possível

### ✨ Sugerindo Funcionalidades

1. Verifique se a funcionalidade já foi sugerida nas [Issues](https://github.com/jailsonsntn/NotasApp/issues)
2. Crie uma nova issue usando o template de feature request
3. Explique claramente a motivação e o benefício da funcionalidade

### 🔧 Contribuindo com Código

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature/correção:
   ```bash
   git checkout -b feature/minha-feature
   ```
4. **Faça** suas alterações
5. **Teste** suas alterações:
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```
6. **Commit** suas alterações usando [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   git commit -m "fix: corrige bug na interface"
   git commit -m "docs: atualiza documentação"
   ```
7. **Push** para sua branch:
   ```bash
   git push origin feature/minha-feature
   ```
8. **Abra** um Pull Request

## 📝 Padrões de Código

### Estrutura de Commits

Usamos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Formatação, sem alteração de código
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Alterações em ferramentas, configurações, etc.

### Código TypeScript

- Use TypeScript para toda nova funcionalidade
- Defina tipos apropriados
- Use interfaces para objetos complexos
- Evite `any` sempre que possível

### Componentes React

- Use componentes funcionais com hooks
- Mantenha componentes pequenos e focados
- Use Tailwind CSS para estilização
- Documente props complexas

### Estrutura de Arquivos

```
src/
├── app/          # Páginas Next.js (App Router)
├── components/   # Componentes React
│   └── ui/      # Componentes de UI base
├── hooks/       # Hooks customizados
├── lib/         # Utilitários e configurações
└── types/       # Definições de tipos TypeScript
```

## 🧪 Testes

Embora ainda não tenhamos uma suíte de testes completa, encorajamos:

1. Testar manualmente todas as alterações
2. Verificar responsividade em diferentes tamanhos de tela
3. Testar em diferentes navegadores
4. Verificar acessibilidade básica

## 📚 Recursos Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 🤔 Dúvidas?

Sinta-se à vontade para:
- Abrir uma [Discussion](https://github.com/jailsonsntn/NotasApp/discussions)
- Comentar em issues existentes
- Entrar em contato via email: jailsonjs55@gmail.com

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [Licença MIT](LICENSE).

---

Obrigado por contribuir! 🙏
