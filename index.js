
'use strict';
const Hapi = require('@hapi/hapi');
const { PrismaClient } = require('@prisma/client');
const { request } = require('express');
const prisma = new PrismaClient();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route({
    method: 'POST',
    path: '/create-user',
    handler: async (request, h) => {
      try {
        console.log(request.payload)
        const newUser = await prisma.user.create({
          data: request.payload,
        });
        console.log(newUser);
        return h.response(newUser).code(201);
      } catch (error) {
        return h.response(error.message).code(500);
      }
    },

  });

  server.route({
    method: 'GET',
    path: '/user-list',
    handler: async (request, h) => {
      const users = await prisma.user.findMany();
      return h.response(users).code(200);
    },
  });


  server.route({
    method: 'GET',
    path: '/user-view/{id}',
    handler: async (request, h) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            id: +request.params.id
          }
        });

        return h.response(user).code(200);

      } catch (error) {
        return h.response(error.message).code(500);
      }

    },
  });


  server.route({
    method: 'POST',
    path: '/update-user/{id}', // This defines 'id' as a route parameter
    handler: async (request, h) => {
      try {
        console.log(45, request.params);
        const userId = parseInt(request.params.id);
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: request.payload,

        });

        return updatedUser;
      } catch (error) {
        console.error(error);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    },
  });


  server.route({
    method: 'POST',
    path: '/user-delete/{id}',// This defines 'id' as a route parameter
    handler: async (request, h) => {
      try {

        const userId = parseInt(request.params.id);
        await prisma.user.delete({
          where: { id: userId },
        });
        return { message: 'User deleted successfully' };
      }
      catch (error) {
        console.error(error);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    }
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
