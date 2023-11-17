const axios = require('axios');

interface ttocrRecognizeResponse{
    status:number;
    resultid:string;
    msg:string;
}
export async function ttocrRecognize(gt: string,challenge: string,appkey: string,itemid: number): Promise<ttocrRecognizeResponse> {
    const apiUrl = 'http://api.ttocr.com/api/recognize';
    const response:any = await axios.post(apiUrl, {
        appkey,
        gt,
        challenge,
        itemid
    });
    const result:ttocrRecognizeResponse =  response.data;
    console.log("Debug: ttocrRecognize status=",result.status,", msg=",result.msg,", challenge=",challenge,", resultid=",result.resultid);
    return result;
}

interface ttocrResulteResponse{
    status: number;
    msg: string;
    data: {
        challenge: string;
        validate: string;
        seccode: string;
    };
    time: number;
}

export async function ttocrResult(appkey:string,resultid:string,) :Promise<ttocrResulteResponse>{
    const apiUrl = 'http://api.ttocr.com/api/results';

    let result:ttocrResulteResponse;
    let count=0

    do {
        const response:any = await axios.post(apiUrl, {
            appkey,
            resultid,
        });

        result = response.data
        count++;

        if(result.status==1){
            console.log("Debug: ttocrResult success!, status=", result.status, ", msg=", result.msg, ", challenge=", result.data.challenge, ", validate=", result.data.validate);
            break;
        }else if(result.status==2){
            console.log("Debug: ttocrResult wait for 1100ms, status=", result.status, ", msg=", result.msg);
        }else{
            console.log("Debug: ttocrResult error!",", status=",result.status,", msg=",result.msg);
            break;
        }
        await new Promise(f => setTimeout(f, 1100));
    } while (count < 30)

    return result;
}