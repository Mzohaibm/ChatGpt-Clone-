import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message:
      "This is ChatGPT AI APP server url, please visit https://chatgpt-ai-app-od21.onrender.com",
  });
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// To use this application, you will need to replace the placeholder with your own API key. You can easily obtain a free API key from openai.com in the API section. You have the option to either directly paste the API key in the code or store it in a separate .env file. Both methods are effective for configuring the API key.
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.input,
      temperature: 0,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    // You have the flexibility to modify these endpoints according to your specific requirements. In my case, these endpoints are functioning correctly and meeting my needs. Feel free to customize these endpoints to align with your own application's requirements and ensure smooth functionality.
    console.log("PASSED: ", req.body.input);

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log("FAILED:", req.body.input);
    console.error(error);
    res.status(500).send(error);
  }
});

app.listen(4000, () => console.log("Server is running on port 4000"));
