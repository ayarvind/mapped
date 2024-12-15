import { Request, Response } from "express";

async function health(req: Request, res: Response): Promise<void> {
    res.status(200).send('OK');
}


export default health;