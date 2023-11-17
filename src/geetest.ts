import { Request, Response } from 'express';
import { Mutex } from 'async-mutex';
import {ttocrRecognize,ttocrResult} from './utils/ttocr';

const mutex = new Mutex();
const validateCache: Map<string, string> = new Map();

async function handleGeetestPost(req: Request, res: Response) {
    const release = await mutex.acquire();
    const {gt, challenge, appkey} = req.body;


    const result = {
        data:{
            challenge:"",
            validate:""
        }
    }

    try {
        console.log('Debug: handleGeetestPost',', gt=', gt,', challenge=', challenge);


        const cacheValidate = validateCache.get(challenge)
        if(cacheValidate){
            console.log('Debug: cache hit, challenge=',challenge,'validate=',cacheValidate);
            result.data.challenge=challenge;
            result.data.validate=cacheValidate;
            return;
        }

        const result1 = await ttocrRecognize(gt,challenge,appkey,32);
        const result2 = await ttocrResult(appkey,result1.resultid);

        if(result2.data){
            result.data.challenge=result2.data.challenge;
            result.data.validate=result2.data.validate;
            validateCache.set(result.data.challenge,result.data.validate);
        }

    } finally {
        release();
        res.send(result);
    }
}

export { handleGeetestPost };
