import { NextFunction, Request, Response } from "express";
import { prisma } from "../../libs/prisma";
import { AppError, HttpStatus } from "../../libs/error";
import { transformQueryToWhere } from "../../libs/object.util";
import { Post, Posts } from "./post.type";
import { logger } from "../../libs/pino";

export const listPostsHandler = async (req: Request, res: Response, next:NextFunction) => {
    // get the query parameters from the request
    const query = req.query;
    // transform the query to where object
    const where = transformQueryToWhere(query,[
        {key:'title',type:'text'},{key:'body',type:'text'},{key:'userId',type:'number'}
    ])

    // query the posts from the database and filter them
    try{
        const result : Posts = await prisma.post.findMany({
            where
        });

        // return the list of posts
        return res.send(result).end();
    }catch(err){
        logger.error('listPosts error',err)
        return next(new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR))
    }


}

export const getPostHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the post id from the request
    const postId = req.params.id;

    // query the post from the database
    try{
        const result : Post | null = await prisma.post.findUnique({
            where:{
                id:parseInt(postId, 10)
            }
        });

        // check if the post is found
        if(!result){
            return next(new AppError('Post not found',HttpStatus.NOT_FOUND))
        }

        // return the post
        return res.send(result).end();
    }catch(err){
        logger.error('getPost error',err)
        return next(new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR) as Error)
    }

}

export const createPostHandler = async (req: Request, res: Response, next:NextFunction) => {

    // get the post data from the request
    const postData = req.body;

    // save the post to the database
    try{
        const result : Post = await prisma.post.create({
            data:postData
        });

        // return the post
        return res.status(HttpStatus.CREATED).send(result).end();
    }catch(err){
        return next(new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR));
    }

}

export const updatePostHandler = async (req: Request, res: Response, next:NextFunction) => {

    // get the post id from the request
    const postId = req.params.id;
    const postData = req.body;

    // update the post in the database
    try{

        const postFound : Post | null = await prisma.post.findUnique({
            where:{
                id:parseInt(postId, 10)
            }
        });

        if(!postFound){
            return next(new AppError('Post not found',HttpStatus.NOT_FOUND));
        }

        const result : Post = await prisma.post.update({
            where:{
                id:parseInt(postId, 10)
            },
            data:postData
        });

        // return the updated post
        return res.send(result).end();
    }catch(err){
        return next(new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR));
    }

}


export const patchPostHandler = async (req: Request, res: Response, next:NextFunction) => {

    // get the post id from the request
    const postId = req.params.id;
    const postData = req.body;

    try{
        // check if the post exists
        const postFound : Post | null= await prisma.post.findUnique({
            where:{
                id:parseInt(postId, 10)
            }
        });

        if(!postFound){
            return next(new AppError('Post not found',HttpStatus.NOT_FOUND));
        }

        // update the post in the database
        const result : Post = await prisma.post.update({
            where:{
                id:parseInt(postId, 10)
            },
            data:postData
        });

        // return the updated post
        return res.send(result).end();
    }catch(err){
        return next(new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR));
    }

}

export const deletePostHandler = async (req: Request, res: Response, next: NextFunction) => {

    // get the post id from the request
    const postId = req.params.id;

    try{
        // check if the post exists
        const postFound : Post | null= await prisma.post.findUnique({
            where:{
                id:parseInt(postId, 10)
            }
        });

        if(!postFound){
            return next(new AppError('Post not found',HttpStatus.NOT_FOUND));
        }

        // delete the post from the database
        await prisma.post.delete({
            where:{
                id:parseInt(postId, 10)
            }
        });

        // return success message
        return res.send({msg:'Post deleted'}).end();

    }catch(err){
        return next(new AppError('Internal server error',HttpStatus.INTERNAL_SERVER_ERROR));
    }

}
