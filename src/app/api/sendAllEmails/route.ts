import { NextResponse } from "next/server";
import { Resend } from "resend";
import GenInquiryTemplate from "../../../../emails/Projects/2026-portfolio/gen-inquiry";
import ChatMessageTemplate from "../../../../emails/Projects/2026-portfolio/chat-message";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const emailGroup = await request.json();
    const emails = Array.isArray(emailGroup) ? emailGroup : [emailGroup];
    const results = [];

    for (const emailItem of emails) {
      const { from, to, subject, templateName, templateProps, text, replyTo, cc, bcc } = emailItem;
      
      let reactComponent;
      if (templateName === "gen-inquiry") {
        // @ts-ignore
        reactComponent = GenInquiryTemplate(templateProps);
      } else if (templateName === "chat-message") {
        // @ts-ignore
        reactComponent = ChatMessageTemplate(templateProps);
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

      console.log(`Sending email [${templateName}] to ${to}`);
      const data = await resend.emails.send(payload);
      results.push(data);
    }

    return NextResponse.json({ status: "ok", data: results });
  } catch (error: any) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }
}
