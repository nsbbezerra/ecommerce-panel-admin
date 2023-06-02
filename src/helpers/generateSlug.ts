import shortid from "shortid";

export default function generateSlug(name: string): string {
  const parsed = name
    .normalize("NFD")
    .replaceAll(/[^\w\s]/gi, "")
    .replaceAll(" ", "-")
    .toLowerCase();

  return `${parsed}-${shortid.generate().toLowerCase()}`;
}
