import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { join } from "path";
import { Converter } from "../core/converter";
import { MethodMode } from "../types";

dotenv.config();

const port = process.env.PORT ?? 5055;
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
});

app.post("/convert", async (req, res) => {
    try {
        const output = await Converter.convert(
            req.body.input,
            MethodMode.SERVICE
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
