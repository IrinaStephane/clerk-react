import { prisma } from "./lib/prisma";

async function main() {
  // Create a new user with a post
  const post = await prisma.post.create({
    data: {
      title: "Post for hei.irina.4@gmail.com",
      content: "This post belongs to user hei.irina.4@gmail.com",
      published: true,
      author: {
        connect: { id: "user_3Ayfj9vl2o5vpfXUdYeXaDlr5as" },
      },
    },
  });
  console.log("Created user:", post);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });