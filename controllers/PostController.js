import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts
            .map((obj) => obj.tags || []) // Якщо теги відсутні, використовуємо порожній масив
            .flat()
            .slice(0, 5);
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
};
export const getAll = async (req, res) => {
    
    try {
        const posts = await PostModel.find()
            .populate({
                path: "user",
                select: "-passwordHash",
            })
            .exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
};
// export const getOne = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         PostModel.findOneAndUpdate(
//             {
//                 _id: postId,
//             },
//             {
//                 $inc: {viewsCount: 1},
//             },
//             {
//                 returnDocument: "after",
//             },
//             (err, doc) => { //КОЛБЕКИ ТЕПЕР НЕ ПРАЦЮЮТЬ
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).json({
//                         message: "Не удалось получить статью",
//                     });
//                 }
//                 if (!doc) {
//                     return res.status(404).json({
//                         message: 'стаття не знайдена'
//                     })
//                 }
//                 res.json(doc)
//             }
//         );
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: "Не удалось получить статьи",
//         });
//     }
// };
export const getOne = async (req, res) => {
    console.log(123);
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndUpdate(
            {_id: postId},
            {$inc: {viewsCount: 1}},
            {returnDocument: "after"}
        ).populate('user');
        if (!doc) {
            return res.status(404).json({message: "Стаття не знайдена"});
        }
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Не вдалося отримати статтю"});
    }
};
export const remove = async (req, res) => {
    console.log(123);
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndDelete({_id: postId});
        if (!doc) {
            return res.status(404).json({message: "Стаття не знайдена"});
        }
        res.json({succes: "post deleted"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Не вдалося видалити статтю"});
    }
};
export const create = async (req, res) => {
    console.log(req.userId);
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags.split(','),
        });
        console.log(req.body.tags.split(','))
        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "не вдалось створити статтю",
        });
    }
};
export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.updateOne(
            {_id: postId},
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(','),
            }
        );
        if (!doc) {
            return res.status(404).json({message: "Стаття не знайдена"});
        }
        res.json({succes: "post update"});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "не вдалось оновити статтю",
        });
    }
};
