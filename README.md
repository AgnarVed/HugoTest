# HugoServer

Для начала работы понадобятся:
- [Node.js](https://nodejs.org/en/) версии 16.х.х и старше
- [npm](https://docs.npmjs.com/cli/v6/commands/npm-install) или [yarn](https://yarnpkg.com/getting-started/install)
- [Python](https://www.python.org/downloads/) для SQL, но в данной версии не обязателен
- [brew](https://brew.sh/index_ru)
- [Git](https://git-scm.com/)

Установка:
- Установить Hugo:
```
brew install hugo
```
проверить правильность установки:
```
hugo version
```
- Перейти в `/strapi` и запустить:
```
npm run develop
```
- В отдельном терминале запустить Hugo сервер:
```
hugo server -D
```
# Описание

На данном этапе реализован весь сайт в статике, который поднимается локально:
```
http://localhost:1313
```
