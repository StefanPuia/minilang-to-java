import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import expressWinston from "express-winston";
import { join } from "path";
import * as winston from "winston";
import { Converter } from "../core/converter";
import { ElementFactory } from "../core/element-factory";
import prettyBytes from 'pretty-bytes';

dotenv.config();

const port = process.env.PORT ?? 5055;
const app = express();

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.simple(),
        expressFormat: true,
        meta: true,
    })
);

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

app.use("/static", express.static("public/static"));
app.get("/", (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
});

app.post("/convert", (req, res) => {
    const payloadSize = (req.body.input as string).length * 8;
    const consoleLabel = `Convert ${prettyBytes(payloadSize)}`
    console.time(consoleLabel);
    try {
        const output = Converter.convert({
            source: req.body.input,
            methodMode: req.body.methodMode,
            className: req.body.className,
            logging: {},
        });
        res.json({ output });
    } catch (err: any) {
        console.log(err);
        res.json({ output: err.toString() });
    } finally {
        console.timeEnd(consoleLabel);
    }
});

app.listen(port, async () => {
    await ElementFactory.loadClasses();
    console.log(`Finished loading. Listening on http://localhost:${port}`);
});
