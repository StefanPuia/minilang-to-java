import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { join } from "path";
import { Converter } from "../core/converter";

dotenv.config();

const port = process.env.PORT ?? 5055;
const app = express();

app.use(
    express.json({
        limit: "5mb",
    })
);

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.json({ output: err.toString() });
    }
    return next(err);
});

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
});

app.post("/convert", async (req, res) => {
    try {
        const output = await Converter.convert(
            req.body.input,
            req.body.methodMode,
            req.body.packageName,
            req.body.className
        );
        res.json({
            output: output,
        });
    } catch (err) {
        console.log(err);
        res.json({ output: err.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server running on on port ${port}`);
});
