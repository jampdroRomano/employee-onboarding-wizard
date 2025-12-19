# 🪄 Employee Onboarding Wizard

![Status](https://img.shields.io/badge/status-%20concluido-gree)
![Frontend](https://img.shields.io/badge/tecnologia-React-blue)
![Backend](https://img.shields.io/badge/persistência-Firebase-red)
![UI](https://img.shields.io/badge/UI-Material--UI-purple)

---

## 📖 Descrição do Projeto
**Employee Onboarding Wizard** é uma aplicação web desenvolvida em **React** para otimizar e simplificar o gerenciamento de recursos humanos. Além do cadastro de novos colaboradores via wizard, o sistema evoluiu para incluir **gestão completa de departamentos**, **edição de registros** e **controle de acesso (autenticação)**. A aplicação utiliza **Firebase** para autenticação e persistência de dados em tempo real.

---

## 🗂 Estrutura do Repositório
```text
employee-onboarding-wizard/
│
├─── public/                  # Arquivos estáticos e avatares
│
├─── src/
│    ├─── assets/              # Logos e imagens da aplicação
│    ├─── components/          # Componentes React reutilizáveis
│    │    ├─── auth/           # Componentes de autenticação (Login/Registro)
│    │    ├─── collaborators/  # Componentes específicos de colaboradores
│    │    ├─── common/         # Componentes genéricos (Botão, Input, Stepper)
│    │    ├─── dashboard/      # Componentes do painel principal
│    │    ├─── departments/    # Componentes de gestão de departamentos
│    │    └─── layout/         # Estrutura do layout (Header, Sidebar)
│    ├─── config/              # Configuração de serviços (Firebase)
│    ├─── contexts/            # Contextos da aplicação (AuthContext)
│    ├─── hooks/               # Hooks customizados para lógica de estado
│    ├─── pages/               # Páginas principais (Dashboard, Creates, Edits)
│    ├─── services/            # Lógica de comunicação com a API/backend
│    └─── theme/               # Tema customizado do Material-UI
│
└─── package.json              # Dependências e scripts do projeto
```
---

## ⚙ Funcionalidades Principais
| ID    | Funcionalidade           | Descrição                                                   |
|-------|--------------------------|-------------------------------------------------------------|
| RF01  | Dashboard de Funcionários| Apresenta uma tabela com os funcionários cadastrados, permitindo uma visualização rápida e centralizada. |
| RF02  | Wizard de Cadastro       | Um formulário multi-passo para cadastrar novos funcionários, coletando informações básicas e profissionais de forma organizada. |
| RF03  | Gestão de Departamentos  | Criação e edição de departamentos, incluindo definição de gestores e movimentação em massa de colaboradores entre áreas.        |
| RF04  | Autenticação e Segurança | Sistema de Login e Registro com rotas protegidas (PrivateRoute), garantindo que apenas usuários autenticados acessem o sistema. |
| RF05  | Navegação Intuitiva      | Layout com menu lateral, breadcrumbs dinâmicos e feedbacks visuais (Toasts) utilizando a biblioteca Sonner. |
| RF06  | Persistência de Dados    | As informações dos funcionários são salvas e lidas do Firebase Firestore, garantindo dados consistentes e em tempo real. |

---

## 🛠 Tecnologias Utilizadas
- **Core:** React 19, TypeScript
- **Build Tool:** Vite
- **Roteamento:** React Router DOM
- **UI Framework:** Material-UI (MUI)
- **Feedback:** Sonner (Toasts)
- **Backend, Banco de Dados e Autenticação:** Firebase (Firestore & Auth)
- **Linting:** ESLint

---

## 🔥 Configuração do Firebase

Para facilitar a avaliação deste desafio, as credenciais do Firebase **já estão configuradas** diretamente no arquivo `src/config/firebase.ts`.

Não é necessário criar arquivos `.env` ou configurar um projeto novo no Firebase Console. Basta rodar o projeto e a conexão com o banco de dados funcionará automaticamente.

> **Nota:** Em um ambiente de produção real, estas chaves seriam armazenadas em variáveis de ambiente (`.env`) e não seriam commitadas no repositório, seguindo as boas práticas de segurança (12-Factor App). Mantive hardcoded aqui estritamente para fins de demonstração e facilidade de execução do teste.

---

## ⚠️ Pré-requisitos
-   Node.js >= 18.x
-   NPM ou Yarn

---

## 🚀 Instalação de Dependências
Na raiz do projeto, execute o comando para instalar todas as dependências:

```bash
npm install
```

---

## 💻 Como Rodar o Projeto
1.  Siga os passos da seção **🔥 Configuração do Firebase**.
2.  Após instalar as dependências, execute o comando abaixo para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```
A aplicação está disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

> **Nota:** Se houver algum problema com o vite, pode ser necessário reinstalá-lo como uma dependência de desenvolvimento, com o seguinte comando:
> ```bash
> npm install --save-dev vite
> ```
