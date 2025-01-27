FROM --platform=linux/amd64 ubuntu:24.04 AS base

FROM base AS build

WORKDIR /build

# Install build dependecies
RUN apt-get update -qq && \
  apt-get install -y --no-install-recommends build-essential wget ca-certificates curl zip unzip tar git pkg-config

RUN update-ca-certificates -f

ARG VCPKG_ROOT="$HOME/vcpkg"
ARG PATH="$PATH:$VCPKG_ROOT"
ARG CMAKE_TOOLCHAIN_FILE="$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake"

# Install cmake
RUN wget -qO /tmp/cmake.sh https://github.com/Kitware/CMake/releases/download/v3.30.6/cmake-3.30.6-linux-x86_64.sh
RUN chmod +x /tmp/cmake.sh
RUN /tmp/cmake.sh --skip-license --prefix=/usr/local/ --exclude-subdir

# Install vcpkg
RUN git clone https://github.com/microsoft/vcpkg.git "$VCPKG_ROOT"
RUN $VCPKG_ROOT/bootstrap-vcpkg.sh

COPY . .

RUN cmake -B ./cmake

WORKDIR /build/cmake

RUN make

FROM base

WORKDIR /app

COPY --from=build /build/cmake/main ./main

RUN chmod +x ./main

RUN useradd crow --create-home --shell /bin/bash

COPY docker-entrypoint.sh entrypoint.sh

RUN chmod +x entrypoint.sh

ENV SAVE_DIRECTORY="/uploads" \
  MAX_FILE_SIZE=0 \
  PORT=3001

EXPOSE 3001
VOLUME /uploads

ENTRYPOINT ["./entrypoint.sh"]
CMD ["./main"]
