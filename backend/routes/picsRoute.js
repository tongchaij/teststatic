import express from 'express';
import { Pic } from '../models/picModel.js';
import { images } from '../images.js'

const router = express.Router();

router.post('/', async (request, response) => {
    try {
        if (!request.body.url || !request.body.hashtag) {
            return response.status(400).send({
                message: 'Send all required fields: url, hashtag'
            });
        }
        const newPic = {
            url:request.body.url,
            hashtag:request.body.hashtag
        };

        const pic = await Pic.create(newPic);

        return response.status(201).send(pic);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message});
    }
});

router.get('/', async (request, response) => {
    try {
        const pics = await Pic.find({});
        return response.status(200).json({
            count:pics.length,
            data:pics
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message });
    }
});

router.get('/:page/:tag', async (request, response) => {
    try {
        const { page,tag } = request.params;

        console.log(`page : '${page}'`);
        console.log(`tag : '${tag}'`);

//        const pics = await Pic.find({});

        let query = {};
        if (tag.trim() !== '') {
            query = {
                "tags.value": tag
            }
        }

        const options = {
            page: parseInt(page),
            limit: 10,
            collation: {
              locale: 'en',
            },
        };
          
        Pic.paginate(query, options, function (err, result) {
            // result.docs
            // result.totalDocs = 100
            // result.limit = 10
            // result.page = 1
            // result.totalPages = 10
            // result.hasNextPage = true
            // result.nextPage = 2
            // result.hasPrevPage = false
            // result.prevPage = null
            // result.pagingCounter = 1
            console.log(`totalDocs:${result.totalDocs}, totalPages:${result.totalPages}`)
            return response.status(200).json(result);
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message });
    }
});

router.post('/init', async (request, response) => {
    try {

        images.map(async (image) => {
            const newPic = {
                src:image.src,
                width:image.width,
                height:image.height,
                tags:image.tags
            };
                
            const pic = await Pic.create(newPic);

            console.log(`image:${image.src}`);
        });

        return response.status(201).send({success:true});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message});
    }
});

export default router;