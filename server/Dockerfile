# Node.js'ın resmi image'ını kullanıyoruz
FROM node:16

# Çalışma dizinini belirliyoruz
WORKDIR /app

# package.json ve package-lock.json dosyalarını container'a kopyalıyoruz
COPY package*.json ./

# Bağımlılıkları yüklüyoruz
RUN npm install

# Backend uygulamasının tüm dosyalarını container'a kopyalıyoruz
COPY . .

# Port 3000'i açıyoruz, NestJS genellikle bu portu kullanır
EXPOSE 3000

# Uygulamayı çalıştırıyoruz
CMD ["npm", "run", "start:dev"]
