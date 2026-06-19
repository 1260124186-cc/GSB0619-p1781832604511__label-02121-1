# 网关服务 - 统一入口实现 localStorage 共享
FROM --platform=$BUILDPLATFORM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
