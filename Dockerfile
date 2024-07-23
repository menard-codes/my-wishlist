FROM node:18-alpine

EXPOSE 3000

WORKDIR /app
COPY . .

ENV NODE_ENV=production

# install and use pnpm instead
RUN npm i -g pnpm

RUN pnpm install --omit=dev
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN pnpm remove @shopify/app @shopify/cli
RUN pnpm run build

# You'll probably want to remove this in production, it's here to make it easier to test things!
RUN rm -f prisma/dev.sqlite

CMD ["pnpm", "run", "docker-start"]
