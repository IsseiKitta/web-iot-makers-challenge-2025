export default function Page() {
  return (
    <>
      <main>
        <h1>Login</h1>
        <form action="/api/login" method="post">
          <label htmlFor="username">User Name</label>
          <input type="text" id="username" name="username" placeholder="Input your name" />
          <br />
          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password" placeholder="Input your name" />
          <br />
          <button type="submit">submit</button>
        </form>
      </main>
    </>
  );
}
