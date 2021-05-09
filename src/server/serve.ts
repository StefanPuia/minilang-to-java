import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { join } from "path";
import { Converter } from "../core/converter";
import { ElementFactory } from "../core/element-factory";

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

app.post("/convert", (req, res) => {
    try {
        const output = Converter.convert({
            source: req.body.input,
            methodMode: req.body.methodMode,
            packageName: req.body.packageName,
            className: req.body.className,
            logging: {},
        });
        res.json({
            output: output,
        });
    } catch (err) {
        console.log(err);
        res.json({ output: err.toString() });
    }
});

app.listen(port, async () => {
    await ElementFactory.loadClasses();
    console.log(`Server running on on port ${port}`);
});
