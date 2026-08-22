import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, ARCJET_ENV } from "../config/env.js";

const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    // detectBot({
    //   mode: "LIVE", 
    //   allow: [
    //     "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
    //   ],
    // }),
    tokenBucket({
      mode: "LIVE",
      characteristics: ["ip.src"],
      refillRate: 5,                // Refill 5 tokens per interval
      interval: 10,                 // Refill every 10 seconds
      capacity: 10,                 // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;
