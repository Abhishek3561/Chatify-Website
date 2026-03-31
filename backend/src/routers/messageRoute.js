import express from "express"
import {getAllContacts,getMessageByUserId,sendMessages,getChatPartners} from "../controllers/messageController.js"
import {protectRoute} from "../middlewares/auth.js"
import arcjetProtection from "../lib/arcjet.js"

const router=express.Router()

router.use(protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessages); 

export default router