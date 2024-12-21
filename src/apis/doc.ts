import { Request,Response } from "express";
async function docs(request:Request, response:Response){
    response.send(`
        <div>
            <a href='https://github.com/ayarvind/mapped' target='_blank'>
                Know about available endpoints.
            </a>
        </div>    
        
    `).status(200).contentType("text/html");
}

export default docs