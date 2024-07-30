/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { promise } from "zod";

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

        const commitQueue = new Queue("adding-commit", {
          connection: redisConnection,
        });

        const processCommitsQueue = new Queue("process-commit", {
          connection: redisConnection,
        });

        const response =
          message.account &&
          (await axios.get("https://api.github.com/user/repos?per_page=1000", {
            headers: {
              Authorization: `Bearer ${message.account.access_token as string}`,
              Accept: "application/vnd.github.v3+json",
            },
          }));

        if (response && response.data) {
          for (const repo of response.data) {
            // await webhookQueue.add("create-webhook", {
            //   owner: repo.owner.login,
            //   repo: repo.name,
            //   accessToken: process.env.GITHUB_TOKEN,
            // });
            console.log(repo);

            await commitQueue.add("add-commit", {
              owner: repo.owner.login,
              repo: repo.name,
              accessToken: process.env.GITHUB_TOKEN,
            });
          }
        }

        const worker = new Worker(
          "webhook-creation",
          async (job) => {
            const { owner, repo } = job.data;
            try {
              await octokit.request(`POST /repos/${owner}/${repo}/hooks`, {
                owner: `${owner}`,
                repo: `${repo}`,
                name: "web",
                active: true,
                events: ["push", "pull_request"],
                config: {
                  url: "https://3795-2405-201-4031-30c0-c198-af1e-c72d-23d7.ngrok-free.app/webhook",
                  content_type: "json",
                  insecure_ssl: "0",
                },
                headers: {
                  "X-GitHub-Api-Version": "2022-11-28",
                },
              });

              console.log(`webhook created for ${repo} go check it`);
            } catch (error) {
              console.log(error);
            }
          },
          {
            connection: redisConnection,
            limiter: {
              max: 10,
              duration: 1000,
            },
          }
        );

        const commitWorker = new Worker(
          "adding-commit",
          async (job) => {
            const { owner, repo, accessToken } = job.data;

            const response = await octokit.request(
              `GET /repos/${owner}/${repo}/commits`,
              {
                owner: `${owner}`,
                repo: `${repo}`,
                headers: {
                  "X-GitHub-Api-Version": "2022-11-28",
                },
              }
            );

            response.data.map(async (commit: object) => {
              await processCommitsQueue.add("processCommit", { commit, repo });
            });
          },
          {
            connection: redisConnection,
            limiter: {
              max: 10,
              duration: 1000,
            },
          }
        );

        const processCommitWorker = new Worker(
          "process-commit",
          async (job) => {
            const { commit, repo } = job.data;

            const {
              sha,
              commit: {
                message,
                author: { date },
              },
              author,
            } = commit;

            try {
              const commitUser = await prisma.user.findFirst({
                where: {
                  email: author.email,
                },
              });

              console.log("this is user : ", commitUser);

              const newCommit = await prisma.commit.create({
                data: {
                  hash: sha,
                  message,
                  date,
                  author: {
                    connect: { id: commitUser?.id },
                  },
                  repository: repo,
                },
              });
            } catch (error) {
              console.log("an error occured while adding commit");
            }
          },
          {
            connection: redisConnection,
            limiter: {
              max: 100,
              duration: 1000,
            },
          }
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
