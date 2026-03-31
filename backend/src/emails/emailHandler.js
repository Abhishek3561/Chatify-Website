import { resendClient,sender } from "../lib/resend.js";
import {createWelcomeEmailTemplate} from "../emails/emailTemplate.js"

export const sendWelcomeEmail=async(email, name,clientURL)=>{
    const {data,error}=await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to:email,
        subject:"welcome to chatify",
        html:createWelcomeEmailTemplate(name,clientURL),
    })
    console.log("RESEND RESPONSE:", data, error);

    if(error){
        console.error("error sending welcome email:",error);
        throw new Error("Failed to send welcome email");
        
    }
    console.log("welcome email send successfully",data);    
}