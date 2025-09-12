# Instruções para Commit no GitHub

Para fazer o commit do projeto e enviar para o repositório GitHub, siga estas etapas:

## 1. Instale o Git

- Baixe e instale o Git a partir de [git-scm.com](https://git-scm.com/download/win)
- Durante a instalação, mantenha as opções padrão
- Abra o Git Bash ou reinicie o Prompt de Comando/PowerShell após a instalação

## 2. Configure o Git (primeira vez apenas)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

## 3. Inicialize o Repositório Git

Navegue até a pasta do projeto e inicialize o Git:

```bash
cd C:\Projetos\minha-carteira
git init
```

## 4. Adicione os Arquivos ao Repositório

```bash
git add .
```

## 5. Faça o Commit

```bash
git commit -m "Primeira versão do projeto Minha Carteira"
```

## 6. Conecte ao Repositório Remoto

```bash
git remote add origin https://github.com/carlosfavero/minha-carteira.git
```

## 7. Envie para o GitHub

```bash
git push -u origin master
```
(ou `git push -u origin main` se o nome da branch principal for "main")

## 8. Autenticação GitHub

Quando solicitado, insira suas credenciais do GitHub. 
Se você tiver autenticação de dois fatores ativada, precisará usar um token de acesso pessoal ao invés da senha.

## Alternativa: GitHub Desktop

Se preferir uma interface gráfica:
1. Baixe e instale o [GitHub Desktop](https://desktop.github.com/)
2. Adicione o repositório local
3. Publique no GitHub