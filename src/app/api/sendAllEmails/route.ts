import { NextResponse } from "next/server";
import { Resend } from "resend";
import GenInquiryTemplate from "../../../../emails/Projects/2026-portfolio/gen-inquiry";
import ChatMessageTemplate from "../../../../emails/Projects/2026-portfolio/chat-message";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const emailGroup = await request.json();
    const emails = Array.isArray(emailGroup) ? emailGroup : [emailGroup];
    const results = await Promise.all(
      emails.map(async (emailItem, index) => {
        const { from, to, subject, templateName, templateProps, text, replyTo, cc, bcc } = emailItem;
        
        console.log(`[Email ${index + 1}/${emails.length}] Preparing to send '${subject}' to ${to}`);
        
        let reactComponent;
        try {
          if (templateName === "gen-inquiry") {
            // @ts-ignore
            reactComponent = GenInquiryTemplate(templateProps);
          } else if (templateName === "chat-message") {
            // @ts-ignore
            reactComponent = ChatMessageTemplate(templateProps);
          }
        } catch (templateError) {
           console.error(`[Email ${index + 1}] Template Rendering Error:`, templateError);
           // Fallback to text only if template fails? Or throw?
        }

        const payload: any = {
          from: from || "onboarding@resend.dev",
          to,
          subject,
          text,
          reply_to: replyTo,
          cc,
          bcc,
        };

        if (reactComponent) {
          payload.react = reactComponent;
        }

        try {
          console.log(`[Email ${index + 1}] Sending via Resend...`);
          const data = await resend.emails.send(payload);
          console.log(`[Email ${index + 1}] Success! ID:`, data.data?.id);
          return { status: "fulfilled", ...data };
        } catch (sendError) {
          console.error(`[Email ${index + 1}] Failed to send:`, sendError);
          return { status: "rejected", error: sendError };
        }
      })
    );

    return NextResponse.json({ status: "ok", data: results });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }
}
