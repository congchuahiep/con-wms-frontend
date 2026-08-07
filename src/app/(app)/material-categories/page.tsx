import { MaterialCategoriesHeader } from "./header";

export default function MaterialCategoryPage() {
  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <MaterialCategoriesHeader totalCategories={5} />
    </div>
  );
}
