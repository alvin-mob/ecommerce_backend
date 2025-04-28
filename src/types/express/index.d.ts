import { User } from "@prisma/client";
import express from "express";

declare module 'express-serve-static-core'{
     interface Request{
        user? : User
    }
}

// import { User } from "@prisma/client";
// import { Express, Request} from "express";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: User;
//     }
//   }
// }

// // ✅ Make sure this file is treated as a script
// export {};
// import { User } from "@prisma/client";

// declare global {
//   namespace Express {
//     interface Request {
//       user: User;
//     }
//   }
// }

//export {}