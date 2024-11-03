import DragAndDropList from "./content";

export default function Home() {
  return (
    <div className="grid h-screen w-full">
      <main className="grid flex-1 gap-4 overflow-hidden">
        <div className="flex overflow-scroll justify-center">
          <div className="container max-w-screen-2xl justify-center px-4 py-4">
            <DragAndDropList />
          </div>
        </div>
      </main>
    </div>
  );
}
