'use client';

import { useLogin } from "@/hooks/auth/hook";

export default function Dashboard() {
  const { mutate: login } = useLogin();
  return (
    <button style={{ width: '30px', margin: '50px' }} onClick={() => login({
      password: '11e3*!RQ$V11',
      email: 'hashir.dev12@gmail.com',
      anonymous_id: '62854e4b7a0475e2',
    })}>B</button>
  );
};