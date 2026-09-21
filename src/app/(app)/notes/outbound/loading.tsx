import { Spinner } from "@/components/ui/spinner";

export default function NotesLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Spinner className="size-8" />
    </div>
  );
}
