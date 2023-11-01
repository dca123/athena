import { Flow } from './flow';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-4 h-screen">
      <h1 className="text-lg self-start font-mono leading-4 tracking-wider">
        Athena
      </h1>
      <div className="w-[100%] h-[100%] border rounded">
        <Flow />
      </div>
    </main>
  );
}
