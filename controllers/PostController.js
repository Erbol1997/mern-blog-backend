import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save()

        res.json(post)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Invalid Post Create"
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Invalid get all posts"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                    message: "Invalid get one post"
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                    message: "Post not found"
                    })
                }

                res.json(doc)
            },
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Invalid get one post"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete(
            {
                _id: postId
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: "Invalid remove post"
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Post not found"
                    })
                }

                res.json({
                    success: true
                })
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Invalid get one post"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId, 
            },
        )

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Invalid update post"
        })
    }
}