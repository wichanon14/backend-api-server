// Purpose: Define the Post model class.

import { logger } from "src/libs/pino";
import { prisma } from "../libs/prisma";

// use for persisting data to the database.
class Post {
    id: number| null = null;
    title: string
    body: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor( title: string, body: string, userId: number) {
        this.title = title;
        this.body = body;
        this.userId = userId;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    async save(){
        // save the post to the database
        await prisma.post.create({
            data: {
                title: this.title,
                body: this.body,
                userId: this.userId
            }
        });
    }

    static async findMany(*args: any){
        // find all the posts from the database
        return prisma.post.findMany();
    }

    static async findOne(id: number){
        // find a post from the database
        return prisma.post.findUnique({
            where: {
                id
            }
        });
    }
   

}

export {
    Post
}