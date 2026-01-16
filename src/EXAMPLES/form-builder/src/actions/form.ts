"use server";
import prisma from "@/lib/prisma";
import { formSchema, type formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";
class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  // console.log("NAME ON SERVER", data.name);
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Invalid form data");
  }
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name: data.name,
      description: data.description,
    },
  });

  if (!form) {
    throw new Error("Failed to create form");
  }

  return form;
}

export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  const forms = await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return forms;
}

export const GetFormById = async (id: number) => {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id: id,
    },
  });
};

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      id: id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    where: {
      shareURL: formUrl,
      published: true,
    },
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content: content,
        },
      },
    },
  });
}
