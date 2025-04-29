# Kanban Board Uygulaması

Bu proje, React + Vite frontend ve NestJS backend kullanılarak geliştirilen bir Kanban board uygulamasıdır. Kullanıcılar, farklı board'lar oluşturarak bu board'lar üzerinde kartlar taşıyabilir, düzenleyebilir ve yönetebilir.

## Kullanılan Teknolojiler

### Backend
- [NestJS](https://nestjs.com/)
- [MySQL](https://www.mysql.com/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)

### Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [@dnd-kit/core](https://dndkit.com/) – Sürükle bırak desteği için
- [Axios](https://axios-http.com/) – API istekleri için

## Backend Kurulum

Depoyu klonlayın:
```bash
git clone https://github.com/MuhammedKemalOzcan/KanbanBoard.git
cd kanban/backend

## .env dosyası
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=kemal
DATABASE_PASSWORD=kemal123
DATABASE_NAME=kanban_db

### Docker ile çalıştırın:

docker-compose up --build

## Frontend Kurulum
cd ../Frontend
npm install
npm run dev

## API Dökümantasyonu

POST /boards
Content-Type: application/json
{
  "name": "Yeni Proje"
}

GET /boards

GET /boards/:id









