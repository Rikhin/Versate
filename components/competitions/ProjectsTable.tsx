import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface Project {
  id: string;
  title: string;
  authors: string;
  category: string;
  description: string;
  awards?: string;
  created_at: string;
}

interface ProjectsTableProps {
  projects: Project[];
  error?: any;
  competition: { name: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const PAGE_SIZE = 10;

export default function ProjectsTable({ projects, error, competition }: ProjectsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Project>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  if (error) return <div className="text-red-600">Error loading projects.</div>;
  if (!projects) return <div>Loading...</div>;

  // Filter and sort
  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.authors?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortDir === "asc") {
      return (a[sortBy] || "").localeCompare(b[sortBy] || "");
    } else {
      return (b[sortBy] || "").localeCompare(a[sortBy] || "");
    }
  });
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold">Projects for {competition.name}</h2>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
          aria-label="Search projects"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => { setSortBy("title"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>Title</TableHead>
              <TableHead className="cursor-pointer" onClick={() => { setSortBy("authors"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>Authors</TableHead>
              <TableHead className="cursor-pointer" onClick={() => { setSortBy("category"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="cursor-pointer" onClick={() => { setSortBy("awards"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>Awards</TableHead>
              <TableHead className="cursor-pointer" onClick={() => { setSortBy("created_at"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">No projects found.</TableCell>
              </TableRow>
            ) : (
              paginated.map(project => (
                <TableRow key={project.id}>
                  <TableCell className="font-semibold">{project.title}</TableCell>
                  <TableCell>{project.authors}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.description?.slice(0, 80)}{project.description?.length > 80 ? "..." : ""}</TableCell>
                  <TableCell>{project.awards || "-"}</TableCell>
                  <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => { e.preventDefault(); goToPage(page - 1); }}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={e => { e.preventDefault(); goToPage(i + 1); }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => { e.preventDefault(); goToPage(page + 1); }}
                aria-disabled={page === totalPages}
                tabIndex={page === totalPages ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
} 