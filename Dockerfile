# Используем официальный образ Bun
FROM oven/bun:1-alpine AS base

# Установка рабочей директории
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json bun.lock* ./

# Устанавливаем зависимости
RUN bun install --production

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 3000

# Healthcheck для проверки работоспособности
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

# Запускаем приложение
CMD ["bun", "run", "src/app/index.ts"]
