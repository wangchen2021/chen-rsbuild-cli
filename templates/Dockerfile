# 阶段1：构建前端
FROM docker.duguqinchen.com/chen-node24-build:latest AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN  pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# 阶段2：生产环境
FROM nginx:alpine
# 复制构建产物（覆盖默认 Nginx 静态目录）
COPY --from=builder /app/dist /usr/share/nginx/html
# 复制 Nginx 配置
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]