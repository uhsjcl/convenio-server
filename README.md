# convenio-server

> Server code for the JCL Convention App, written in TypeScript.

![Yarn 1.16.0](https://img.shields.io/badge/yarn-1.16.0-blue.svg?style=flat-square&logo=yarn)
![TypeScript 3.5.2](https://img.shields.io/badge/TypeScript-%5E3.5.2-blue.svg?style=flat-square&logo=typescript)
![convenio-server version](https://img.shields.io/github/package-json/v/uhsjcl/convenio-server/master.svg?style=flat-square)
[![Documentation Available](https://img.shields.io/badge/documentation-0.1.0-green.svg?style=flat-square)](https://docs.uhsjcl.com/convenio-server)

## Dependencies

* [Docker (Win)](https://docs.docker.com/docker-for-windows/install/)
* [Docker (Mac)](https://docs.docker.com/docker-for-mac/install/)
* [Prisma CLI](https://www.prisma.io/docs/prisma-cli-and-configuration/using-the-prisma-cli-alx4/#installation)
* [PostgreSQL]() - production only. Local PQL is pulled from `Docker` with prisma-server.

## Installation

1. Clone the repository (SSH/HTTPS)

    ```bash
    git clone git@github.com:uhsjcl/convenio-server.git
    ```

    ```bash
    git clone https://github.com/uhsjcl/convenio-server.git
    ```

2. Run the `prisma` server

   ```bash
   cd convenio-server
   docker-compose up -d
   ```

## Documentation

**[API Documentation can be found here](/src/api/README.md)**
