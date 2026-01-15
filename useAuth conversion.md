# Auth conversion from supabase to Convex w/ Clerk Auth

## TSX COMPONENT BLOCKING
```tsx
import { Unauthenticated, Authenticated } from "convex/react";


<>
 <Unauthenticated>
      <div className="bg-teal-500 hover:bg-teal-400 text-black font-bold py-2 px-4 rounded transition-colors cursor-pointer">
        <SignInButton />
      </div>
    </Unauthenticated>
	<Authenticated>
		<Link href="/dashboard">
		<Button>Dashboard</Button>
		</Link>
	</Authenticated>
</>
```

## PROGRAMATIC
```tsx
// "server side"
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { currentUser } from '@clerk/nextjs/server'

const Page = async () => {
  const { userId } = await auth()
   const user = await currentUser()

  if (!userId) {
    return redirect('/sign-in')
  }

  return <div>Hello {user?.firstName}</div>
}
```

```
// "client side"
import { useUser } from '@clerk/nextjs'

const Page = () => {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!user) return <div>Not signed in</div>
  
  return <div>Hello {user.firstName}</div>
}
```

```
SIGNING OUT

'use client'

import { useClerk } from '@clerk/nextjs'

export default function SignOutComponent() {
  const { signOut } = useClerk()
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  return <button onClick={handleSignOut}>Sign out</button>
}

```

```
// USER INFO

// --- User's Email  ---
import { currentUser } from '@clerk/nextjs/server'
 const user = await currentUser()
user?.primaryEmailAddress?.emailAddress

// --- User's Name  ---
import { currentUser } from '@clerk/nextjs/server'
  const user = await currentUser()
    <p>First name: {user?.firstName}</p>
      <p>Last name: {user?.lastName}</p>
      <p>Full name: {user?.fullName}</p>

// --- User's ID  ---
import { currentUser } from '@clerk/nextjs/server'
  const user = await currentUser()
    <p>First name: {user?.firstName}</p>
      <p>Last name: {user?.lastName}</p>
      <p>Full name: {user?.fullName}</p>

// --- User's Avatar  ---
import { currentUser } from '@clerk/nextjs/server'
  const user = await currentUser()
    <p>First name: {user?.firstName}</p>
      <p>Last name: {user?.lastName}</p>
      <p>Full name: {user?.fullName}</p>

// --- User's Image  ---
import { currentUser } from '@clerk/nextjs/server'
const user = await currentUser()
   <img src={user?.imageUrl} alt="User avatar" />
```

### USERS LIST AND QUERIES

To get a list of users in your Next.js App Router application, you can use the getUserList() method from the Clerk Backend SDK1:

typescript
import { clerkClient } from '@clerk/nextjs/server'

const client = await clerkClient()
const response = await client.users.getUserList()


The getUserList() method retrieves a list of users and returns a PaginatedResourceResponse object with a data property containing an array of User objects, and a totalCount property indicating the total number of users.

You can also filter and paginate the results:

typescript
const { data, totalCount } = await client.users.getUserList({
  orderBy: '-created_at',
  limit: 10,
})
Filter by specific criteria:

typescript
const emailAddress = ['email1@clerk.dev', 'email2@clerk.dev']
const phoneNumber = ['+12025550108']

const { data, totalCount } = await client.users.getUserList({ 
  emailAddress, 
  phoneNumber 
})
Use a query for broader matching:

typescript
// Matches users with the string 'test' in userId, emailAddress, phoneNumber, 
// username, web3Wallet, firstName, or lastName
const { data, totalCount } = await client.users.getUserList({
  query: 'test',
})
