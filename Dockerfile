# Two stages: the build happens HERE, so the image is a function of the source and
# nothing else. The sibling static sites COPY a pre-built ./out, which makes the
# image a function of whatever was on the builder's disk — an export from an older
# commit ships silently, and `docker build` alone cannot reproduce it.
FROM node:22-alpine AS build
WORKDIR /src
ENV CI=true
RUN npm install -g pnpm@10
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# hanzoai/spa is the one static server in the k8s stack — never nginx, never caddy.
# PINNED to a semver, not :latest: the base is most of the bytes that reach the
# cluster, so a floating tag there is a floating deploy wearing a pinned one.
FROM ghcr.io/hanzoai/spa:1.4.11

# THE LINK IS THE LABEL. Without org.opencontainers.image.source the package lands
# UNLINKED on GHCR, and an unlinked package grants pull access to the token that
# pushed it and to nobody else — so the cluster's puller got denied and both pods
# sat in ImagePullBackOff while the image existed and was correct. Its siblings
# work because they are linked and inherit the org's access.
LABEL org.opencontainers.image.source="https://github.com/luxfi/tel"
LABEL org.opencontainers.image.title="lux.tel"
LABEL org.opencontainers.image.description="Voice, messaging, and satellite connectivity."
LABEL org.opencontainers.image.licenses="UNLICENSED"

COPY --from=build /src/out /public
ENV PORT=3000
ENV ROOT=/public
EXPOSE 3000
