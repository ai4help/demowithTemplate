import { useRouter } from "next/router";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  let errorMessage = "An unknown error occurred.";
  if (error === "OAuthAccountNotLinked") {
    errorMessage = "This email is already linked to another login method. Please use the original method.";
  }

  return (
    <div>
      <h1>Sign-In Error</h1>
      <p>{errorMessage}</p>
      <button onClick={() => router.push("/auth/signin")}>Go Back to Sign-In</button>
    </div>
  );
}
