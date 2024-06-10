import { readFileSync } from "fs";
import { prisma } from "../../libs/prisma";

const seedPosts = async ()=>{
    const postsData = JSON.parse(readFileSync(`${__dirname}/posts.json`, 'utf8'));
    for (const post of postsData) {
        await prisma.post.create({
            data: {
                userId: post.userId,
                title: post.title,
                body: post.body
            }
        })
    }
}

export default seedPosts;