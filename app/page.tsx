"use client";
import FileDrop from '@/components/FileDrop';

export default function Home() {
  const handleRead = (file: File, content: string) => {
    console.log('Dropped file:', file);
    console.log('Content preview:', content.slice(0, 120));
  };

  return (
    <main className="p-8">
      <FileDrop onRead={handleRead} />
     
    </main>
  );
}