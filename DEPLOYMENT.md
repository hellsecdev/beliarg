# Beliarg Deployment Guide

Этот документ описывает процесс деплоя приложения Beliarg на production сервер.

## Подготовка к деплою

### Что было исправлено в коде:

1. ✅ Добавлены серверные зависимости в `package.json`
2. ✅ Конвертирован `server/server.js` из CommonJS в ES modules
3. ✅ Исправлены захардкоженные API_URL на относительные пути
4. ✅ Добавлена раздача статики из папки `dist` и SPA fallback
5. ✅ Добавлен скрипт `start` в package.json
6. ✅ Создана конфигурация PM2 (`ecosystem.config.js`)
7. ✅ Создана конфигурация Nginx (`nginx/beliarg.conf`)
8. ✅ Создан скрипт автоматизации деплоя (`deploy.sh`)

## Информация о сервере

- **IP адрес:** 164.90.136.126
- **Пользователь:** root
- **Домен:** beliarg.online, www.beliarg.online
- **Директория приложения:** /var/www/beliarg

## Ручной деплой (пошагово)

### 1. Подключение к серверу

```bash
ssh root@164.90.136.126
```

### 2. Установка Node.js (если не установлен)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Должна быть версия 18+
```

### 3. Установка PostgreSQL

```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Настройка базы данных

```bash
sudo -u postgres psql
```

В psql консоли:

```sql
CREATE DATABASE beliarg_db;
CREATE USER beliarg_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE beliarg_db TO beliarg_user;
ALTER USER beliarg_user CREATEDB;
\q
```

### 5. Применение схемы базы данных

```bash
cd /var/www/beliarg
sudo -u postgres psql -d beliarg_db -f sql/schema.sql
```

### 6. Создание .env файла

```bash
cd /var/www/beliarg
nano .env
```

Содержимое `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://beliarg_user:your_secure_password_here@localhost:5432/beliarg_db
JWT_SECRET=$(openssl rand -base64 32)
```

**Важно:** Замените `your_secure_password_here` на реальный пароль и сгенерируйте JWT_SECRET:

```bash
openssl rand -base64 32
```

### 7. Установка зависимостей и сборка

```bash
cd /var/www/beliarg
npm install
npm run build
```

### 8. Установка и настройка PM2

```bash
npm install -g pm2
mkdir -p /var/www/beliarg/logs
cd /var/www/beliarg
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Следуйте инструкциям для автозапуска
```

### 9. Установка и настройка Nginx

```bash
sudo apt-get install -y nginx
sudo cp /var/www/beliarg/nginx/beliarg.conf /etc/nginx/sites-available/beliarg
sudo ln -s /etc/nginx/sites-available/beliarg /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t  # Проверка конфигурации
sudo systemctl reload nginx
```

### 10. Настройка SSL (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d beliarg.online -d www.beliarg.online
```

После получения сертификата, обновите `/etc/nginx/sites-available/beliarg`:
- Раскомментируйте блок SSL (443 порт)
- Раскомментируйте редирект с HTTP на HTTPS в блоке порта 80
- Закомментируйте proxy_pass в блоке порта 80

Затем:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 11. Настройка Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## Автоматический деплой

Используйте скрипт `deploy.sh`:

```bash
./deploy.sh
```

**Внимание:** Скрипт требует интерактивного ввода для некоторых шагов (создание .env, настройка SSL).

## Проверка работы

1. Проверьте статус PM2:
   ```bash
   pm2 status
   pm2 logs beliarg
   ```

2. Проверьте Nginx:
   ```bash
   sudo systemctl status nginx
   ```

3. Проверьте доступность:
   - HTTP: http://beliarg.online
   - HTTPS: https://beliarg.online (после настройки SSL)

## Обновление приложения

```bash
# На сервере
cd /var/www/beliarg
git pull  # Если используете git
# Или загрузите новые файлы через rsync/scp
npm install
npm run build
pm2 restart beliarg
```

## Логи

- PM2 логи: `pm2 logs beliarg`
- Nginx логи: `/var/log/nginx/access.log` и `/var/log/nginx/error.log`
- PM2 файлы логов: `/var/www/beliarg/logs/`

## Устранение проблем

### Приложение не запускается

1. Проверьте логи: `pm2 logs beliarg`
2. Проверьте .env файл
3. Проверьте подключение к БД: `psql -U beliarg_user -d beliarg_db`

### Nginx не проксирует запросы

1. Проверьте конфигурацию: `sudo nginx -t`
2. Проверьте, что приложение слушает порт 3000: `pm2 logs beliarg`
3. Проверьте логи Nginx: `sudo tail -f /var/log/nginx/error.log`

### Проблемы с SSL

1. Убедитесь, что домен указывает на IP сервера
2. Проверьте, что порты 80 и 443 открыты
3. Проверьте сертификат: `sudo certbot certificates`

