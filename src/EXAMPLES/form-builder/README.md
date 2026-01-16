# Form Builder

Project File Path: CODE/Web/2024 Projects/form-builder <br/>
Hosted at: next-form-builder-sable.vercel.app <br/>
Repo: https://github.com/Gold240sx/NextFormBuilder

This is an app that allows me to create forms for various use cases quickly while retaining quality and flexibility.
This app is based upon the formBuilder application built by this tutorial: https://youtu.be/QGXUUXy0AMw?si=rgR4XbKqE51bCQef.

This is by far one of the most challenging project I've worked on to date, requiring a lot of problem solving in order to get the app to behave with the dependancy and framework version differences. I've also made some major additions to the project, such as a ViewCode Output button which outputs the code with both dynamic and static behaviors as well as made some
UI tweaks to the app I felt were appropriate.

## My own additions

A significant amount of changes have been made to the video's tutorial, including:

-   I have created direct code output of both the statically typed form variables as well as the dynamic variables of each component
-   I included Form Field Variations, to allow the mixture of not only types but styles and features of such.

# Step 8: Beyond the tutorial

Figure out how to completely overhaul the clerk authentication system to allow for access to the home page without routing. I want to add a home page showing the features of the project as well.

-   Additional components: Radio group, Stepper, TimePicker, and switch
-   Date Picker was not working
-   Couple Data as an attribute so that it can be read as a property in the code of the component...
-   Figure out why the component isn't being shown in the code when the component properties are modified from the original.
-   Complete adding the various component styles for both dynamic and static reads.
-   (maybe) Maybe add a cycling feature to cycle dependencies to each of their respective components.

## Technologies

-   Next.js
-   Clerk
-   Prisma
-   DNDKit
-   PostgreSQL
-   TailwindCSS
-   React Hook Form
-   Prisma Studio
-   Typescript
-   Vercel
-   ShadCn
-   Supabase
-   Zod
-   NextJS-Toploader
-   React-Syntax-Highlighter

# To get started

To initiate a develeopment server, run the following command:

```bash
npm run dev
# or
yarn dev
bun dev
```

To initiate prisma studio, run the following command:

```bash
npx prisma studio
# or
yarn prisma studio
bun prisma studio
```
