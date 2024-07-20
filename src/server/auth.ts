/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Redis } from "ioredis";
import { Worker, Queue } from "bullmq";

import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env.mjs";
import { prisma } from "./db";

import { Octokit } from "@octokit/rest";
import axios from "axios";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "repo read:user user:email",
        },
      },
    }),

    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],

  events: {
    async signIn(message) {
      if (message.isNewUser) {
        console.log(message.account?.access_token);

        const redisConnection = new Redis({
          host: "127.0.0.1",
          port: 6379,
          maxRetriesPerRequest: null,
        });

        const octokit = new Octokit({
          auth: message.account?.access_token,
        });
        const webhookQueue = new Queue("webhook-creation", {
          connection: redisConnection,
        });

        const response = await axios.get(
          "https://api.github.com/user/repos?per_page=1000",
          {
            headers: {
              Authorization: `Bearer ${
                message.account?.access_token as string
              }`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (response.data) {
          for (const repo of response.data) {
            await webhookQueue.add("create-webhook", {
              owner: repo.owner.login,
              repo: repo.name,
              accessToken: process.env.GITHUB_TOKEN,
            });
          }
        }

        const worker = new Worker(
          "webhook-creation",
          async (job) => {
            const { owner, repo, accessToken } = job.data;
            const octokit = new Octokit({ auth: accessToken });

            try {
              await octokit.request(`POST /repos/${owner}/${repo}/hooks`, {
                owner: "OWNER",
                repo: "REPO",
                name: "web",
                active: true,
                events: ["push", "pull_request"],
                config: {
                  url: " https://7eb3-2405-201-4031-30c0-fa7e-beac-868-1a5f.ngrok-free.app/webhook",
                  content_type: "json",
                  insecure_ssl: "0",
                },
                headers: {
                  "X-GitHub-Api-Version": "2022-11-28",
                },
              });
              console.log(`Webhook created for ${owner}/${repo}`);
            } catch (error) {
              console.error(
                `Error creating webhook for ${owner}/${repo}:`,
                error
              );
            }
          },
          { connection: redisConnection }
        );
      }
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
